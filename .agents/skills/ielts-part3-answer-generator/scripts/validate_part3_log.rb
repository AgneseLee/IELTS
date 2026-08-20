#!/usr/bin/env ruby
# frozen_string_literal: true

path = ARGV[0] || "speaking/answers/part3-practice-log.md"
abort("File not found: #{path}") unless File.file?(path)

text = File.read(path)
errors = []
warnings = []
blocks = text.scan(/^\#{3,4} ✅ (.+?)\n\n- \[([ x])\] 不看稿口述\n\n(.+?)(?=\n\n(?:\#{2,4} |\z))/m)
errors << "No answer blocks found" if blocks.empty?

normalise = lambda do |question|
  question.tr("’‘“”", %q(''"")).downcase.gsub(/\s+/, " ").strip
end

duplicates = blocks.group_by { |question, _, _| normalise.call(question.sub(/^拓展：/, "")) }
                   .select { |_, matches| matches.length > 1 }
duplicates.each_value { |matches| errors << "Duplicate question: #{matches.first.first}" }

blocks.each do |question, _, answer|
  sentence_count = answer.scan(/[.!?](?:\s|$)/).length
  errors << "#{question}: expected 3-5 sentences, found #{sentence_count}" unless (3..5).cover?(sentence_count)

  sentences = answer.scan(/.+?[.!?](?=\s|$)/m).map { |sentence| sentence.gsub(/\s+/, " ").strip }
  final_sentence = sentences.last.to_s
  final_word_count = final_sentence.scan(/[A-Za-z]+(?:['’-][A-Za-z]+)*/).length
  warnings << "#{question}: final sentence may not be a summary: #{final_sentence}" if final_sentence.match?(/\A(?:For example|However|By contrast|In contrast)\b/i)
  warnings << "#{question}: final sentence is long (#{final_word_count} words)" if final_word_count > 15
end

extensions = blocks.count { |question, _, _| question.start_with?("拓展：") }
originals = blocks.length - extensions
checked = blocks.count { |_, mark, _| mark == "x" }

original_row = text.match(/\|\s*题库原题短答案覆盖\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/)
practice_row = text.match(/\|\s*本页答案口述复练\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/)
extension_row = text.match(/\|\s*拓展问法短答案\s*\|\s*(\d+)\s*\|\s*—\s*\|\s*(\d+)\s*\|/)
errors << "Missing original-answer progress row" unless original_row
errors << "Missing practice progress row" unless practice_row
errors << "Missing extension progress row" unless extension_row

if original_row
  done, remaining, total = original_row.captures.map(&:to_i)
  errors << "Original count mismatch: row=#{done}, actual=#{originals}" unless done == originals
  errors << "Original total mismatch: #{done}+#{remaining}!=#{total}" unless done + remaining == total
end

if practice_row
  done, remaining, total = practice_row.captures.map(&:to_i)
  errors << "Practice completed mismatch: row=#{done}, actual=#{checked}" unless done == checked
  errors << "Practice total mismatch: row=#{total}, actual=#{blocks.length}" unless total == blocks.length
  errors << "Practice remaining mismatch: row=#{remaining}, actual=#{blocks.length - checked}" unless remaining == blocks.length - checked
end

if extension_row
  done, total = extension_row.captures.map(&:to_i)
  errors << "Extension count mismatch: row=#{done}/#{total}, actual=#{extensions}" unless done == extensions && total == extensions
end

if errors.empty?
  puts "OK: #{blocks.length} answers (#{originals} original, #{extensions} extension), all 3-5 sentences"
  warn warnings.join("\n") unless warnings.empty?
  exit 0
end

warn errors.join("\n")
exit 1
