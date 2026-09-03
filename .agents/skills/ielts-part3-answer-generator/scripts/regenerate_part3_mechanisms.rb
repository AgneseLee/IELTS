#!/usr/bin/env ruby
# frozen_string_literal: true

path = File.expand_path('../../../../speaking/answer-Septemper/part3.md', __dir__)
text = File.read(path)

labels = {
  'M01' => '实用价值',
  'M02' => '时间与精力成本',
  'M03' => '自主权与责任感',
  'M04' => '接触与熟悉度',
  'M05' => '社会影响与模仿',
  'M06' => '长期能力与短期便利'
}

patterns = {
  'M01' => /\b(?:need|useful|practical|suitable|value|benefit|service|demand|purpose|health|safe|comfort|quality|fit|relevant)\w*\b/i,
  'M02' => /\b(?:time|effort|easy|difficult|convenien|cost|price|money|pressure|space|distance|quick|slow|access|available|manage)\w*\b/i,
  'M03' => /\b(?:choice|choose|decision|control|responsib|independen|freedom|own|plan|rule|law|duty|lead|motivat)\w*\b/i,
  'M04' => /\b(?:exposure|familiar|experience|traditional|culture|habit|routine|grew up|grow up|past|regularly|often|continue)\w*\b/i,
  'M05' => /\b(?:peer|role model|imitat|influence|pressure|advertis|celebrit|popular|trend|expectation|encourage|persuad|copy)\w*\b/i,
  'M06' => /\b(?:skill|abilit|learn|practi|feedback|training|education|school|student|improv|develop|dependen|rely|solve|perform)\w*\b/i
}

# Explicit choices keep semantic routing stable when an answer contains vocabulary
# from several mechanisms. Unlisted answers use the keyword fallback below.
overrides = {
  'Do you think governments should put a large amount of money into medical research?' => %w[M01],
  'Are there many people who can speak foreign languages in your country?' => %w[M04 M01],
  'Does speaking other languages help at work?' => %w[M01],
  'Do people learn any languages other than English?' => %w[M01],
  'Is it easy to grow plants at home?' => %w[M02],
  'Why do some people like to grow plants?' => %w[M01],
  'What makes a business fail?' => %w[M01],
  'Do you still keep in touch with your friends from childhood? Why or why not?' => %w[M04],
  'How important is childhood friendship to children?' => %w[M01],
  'Do you think online communication through social media will replace face-to-face communication?' => %w[M01],
  'What can people do when they feel bored?' => %w[M01],
  'What’s the difference between homes in cities and those in the countryside?' => %w[M01],
  'Where do people in your country often go for holidays?' => %w[M01],
  'Where do young people in your country often go for holidays?' => %w[M01 M04],
  'What are the disadvantages for people living in popular tourist cities?' => %w[M02 M01],
  'Why do some people like to remodel and decorate their homes themselves?' => %w[M03],
  'In what situations do people spend a long time responding to others\' messages?' => %w[M02],
  'Are you more polite when sending a message to a stranger than to a friend?' => %w[M04],
  'Why do some people like to stay up late?' => %w[M01],
  'Why do some people think it’s important to be on time and others don’t?' => %w[M04 M05],
  'When do most children begin to have their own opinions?' => %w[M04 M03],
  'Whose opinions are more important to children, their parents\' or teachers\'?' => %w[M05],
  'Do children communicate more with teachers or with parents?' => %w[M04 M02],
  'Who do young people like to share opinions with?' => %w[M04],
  'Why do some people like to watch sports events?' => %w[M01],
  'Why do some people spend a lot going to other countries to watch sports events?' => %w[M01],
  'How would you tell your friends when you must change plans?' => %w[M03],
  'What are the common reasons when people need to change plans?' => %w[M02],
  'Do people in your country prefer following local news or national news?' => %w[M01],
  'Why do some people want to be very involved in their community?' => %w[M01],
  'Do you think it is important to have a national identity?' => %w[M01 M04],
  'How can people develop their national identity?' => %w[M04],
  'What kinds of ambitions do people have?' => %w[M01],
  'What goals do young people usually have?' => %w[M01 M05],
  'Some people think pets should not be kept in cities. What do you think?' => %w[M02],
  'Many people regard pets as members of their family. What do you think?' => %w[M01],
  'What are the advantages of keeping a pet?' => %w[M01 M03],
  'Why do people always tell children stories with animals?' => %w[M06],
  'What is the most important factor in an advertisement?' => %w[M01],
  'What kind of videos do people in your country like to watch?' => %w[M01 M05],
  'Are there any differences between the videos that young men and young women like to watch?' => %w[M05],
  'What makes a video go viral online?' => %w[M05],
  'Will there be a law that is universally accepted?' => %w[M04],
  'What are the differences between everyday food and festival food?' => %w[M01 M04]
}

text.gsub!(/^> 机制：.*\n/, '')

blocks = text.split(/(?=^#### \d+\.)/)
rebuilt = blocks.map do |block|
  next block unless block.start_with?('#### ')

  metadata = block.match(/^> `Q\d` .*$/)&.[](0)
  abort "Missing Q/T metadata: #{block.lines.first.strip}" unless metadata

  question = block.lines.first.sub(/^#### \d+\. /, '').strip
  scores = patterns.transform_values { |pattern| block.scan(pattern).length }
  ranked = scores.sort_by { |code, score| [-score, code] }
  selected = overrides[question] || [ranked.first.first]
  selected << ranked[1].first if !overrides.key?(question) && ranked[1][1] >= 3 && ranked[1][1] >= ranked[0][1] - 1
  mechanism = selected.map { |code| "`#{code} #{labels.fetch(code)}`" }.join(' ＋ ')
  block.sub(/#{Regexp.escape(metadata)}\n+/, "#{metadata}\n\n> 机制：#{mechanism}\n\n")
end.join

File.write(path, rebuilt)

questions = rebuilt.scan(/^#### \d+\./).size
mechanisms = rebuilt.scan(/^> 机制：/).size
abort "Expected #{questions} mechanism labels, found #{mechanisms}" unless questions == mechanisms
abort '未补齐答案' if rebuilt.include?('⚠️ August')

puts "Updated #{questions} answers with M01–M06 mechanism labels."
