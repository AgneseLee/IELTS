#!/usr/bin/env ruby
# frozen_string_literal: true

path = ARGV[0] || "speaking/answers/part3-practice-log.md"
abort("File not found: #{path}") unless File.file?(path)

text = File.read(path)
errors = []
warnings = []
formal_phrases = [
  "employability",
  "real-world application",
  "emotional connection",
  "realistic sequencing",
  "actionable plan",
  "artistic exposure",
  "regular participation",
  "deeper engagement",
  "cultural benefits",
  "direct participation",
  "stronger emotional response",
  "practical value",
  "public value",
  "greater participation",
  "weak verification",
  "chronic pressure",
  "impersonal",
  "informed judgement",
  "open-ended practice",
  "open-ended exploration",
  "rigid approach",
  "rigid thinking",
  "green infrastructure",
  "incentives",
  "visibility",
  "credibility",
  "commercial opportunities",
  "public exposure",
  "occupants",
  "appearance is prioritised"
].freeze
blocks = text.scan(/^\#{3,4} ✅ (.+?)\n\n- \[([ x])\] 不看稿口述\n\n(.+?)(?=\n\n(?:\#{2,4} |\z))/m)
errors << "No answer blocks found" if blocks.empty?
reflections = []

normalise = lambda do |question|
  question.tr("’‘“”", %q(''"")).downcase.gsub(/\s+/, " ").strip
end

duplicates = blocks.group_by { |question, _, _| normalise.call(question.sub(/^拓展：/, "")) }
                   .select { |_, matches| matches.length > 1 }
duplicates.each_value { |matches| errors << "Duplicate question: #{matches.first.first}" }

blocks.each do |question, _, answer|
  sentence_count = answer.scan(/[.!?](?:<\/mark>)?(?=\s|$)/).length
  errors << "#{question}: expected 4-6 sentences, found #{sentence_count}" unless (4..6).cover?(sentence_count)

  sentences = answer.scan(/.+?[.!?](?:<\/mark>)?(?=\s|$)/m).map { |sentence| sentence.gsub(/\s+/, " ").strip }
  example_index = sentences.index { |sentence| sentence.match?(/\AFor (?:example|instance),/i) }
  if example_index.nil?
    errors << "#{question}: missing concrete example"
  else
    reflection = sentences[example_index + 1]
    if reflection.nil? || example_index + 1 == sentences.length - 1
      errors << "#{question}: example must be followed by a separate reflection before the final summary"
    elsif reflection.match?(/\A(?:(?:This|That|The) example (?:shows|illustrates|demonstrates)|(?:This|That|It) (?:shows|illustrates|demonstrates) (?:that|how))\b/i)
      errors << "#{question}: reflection uses formulaic meta-language: #{reflection}"
    else
      reflections << [question, reflection]
    end
  end
  sentences.each do |sentence|
    plain_sentence = sentence.gsub(/<[^>]+>/, "")
    word_count = plain_sentence.scan(/[A-Za-z]+(?:['’-][A-Za-z]+)*/).length
    warnings << "#{question}: long sentence (#{word_count} words): #{sentence}" if word_count > 22
  end
  final_sentence = sentences.last.to_s
  final_word_count = final_sentence.gsub(/<[^>]+>/, "").scan(/[A-Za-z]+(?:['’-][A-Za-z]+)*/).length
  warnings << "#{question}: final sentence may not be a summary: #{final_sentence}" if final_sentence.match?(/\A(?:For example|However|By contrast|In contrast)\b/i)
  warnings << "#{question}: final sentence is long (#{final_word_count} words)" if final_word_count > 15
  formal_phrases.each do |phrase|
    warnings << "#{question}: formal phrase may be hard to say: #{phrase}" if answer.match?(/\b#{Regexp.escape(phrase)}\b/i)
  end
end

reflections.group_by { |_, reflection| reflection.downcase }
           .select { |_, matches| matches.length > 1 }
           .each_value do |matches|
  questions = matches.map(&:first).join(" | ")
  errors << "Duplicate reflection: #{matches.first.last} (#{questions})"
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
  puts "OK: #{blocks.length} answers (#{originals} original, #{extensions} extension), all 4-6 sentences with example reflections"
  warn warnings.join("\n") unless warnings.empty?
  exit 0
end

warn errors.join("\n")
exit 1
