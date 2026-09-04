DIR = "speaking/answer-Septemper/part3-anwers-september"
replacements = {
  "regular exposure to a country's language" => "hearing a country's language regularly",
  "Regular exposure through schools, bookshops and reading apps" => "Seeing these categories in schools, bookshops and reading apps",
  "Regular exposure to friends and neighbours with pets" => "Seeing friends and neighbours with pets regularly",
  "regular exposure to art" => "seeing art regularly",
  "Regular exposure" => "Seeing it regularly",
  "Familiarity with these details" => "When people see these details often",
  "Familiarity with different materials and styles" => "Trying different materials and styles",
  "familiarity shapes both attention and confidence" => "what they know well shapes their attention and confidence",
  "That familiarity builds confidence" => "Knowing each other well makes people more confident",
  "builds familiarity with each person's needs" => "helps everyone understand each person's needs",
  "prevents familiarity with the other person's real concerns" => "makes it harder to understand the other person's real concerns",
  "Familiarity often turns" => "Knowing the activity well often turns",
  "familiarity can make" => "knowing it well can make",
  "familiarity and confidence" => "being familiar with it and feeling confident",
  "independent practice" => "practising on their own",
  "stronger ability" => "better skills",
  "better long-term results" => "better results in the long run",
  "practical value" => "real-life usefulness",
  "continued participation" => "more people taking part",
  "continued demand" => "steady demand",
  "wider participation" => "more people taking part",
  "creates ownership and responsibility" => "makes them feel responsible",
  "a stronger sense of ownership" => "the feeling that it is theirs",
  "gives members ownership of the result" => "makes members feel responsible for the result",
  "social expectations" => "pressure from other people",
  "predictable consequences" => "clear results",
  "targeted spending" => "focused funding",
  "reliable information" => "information people can trust",
  "informed judgement" => "a better decision",
  "credibility" => "trustworthiness",
  "public visibility" => "public attention",
  "constant pressure" => "nonstop pressure",
  "long-term well-being" => "long-term health",
  "well-being" => "health and peace of mind",
  "more manageable" => "easier to handle",
  "meaningful activities" => "worthwhile activities",
  "a meaningful response" => "a useful response",
  "coordination problems" => "problems with organising together",
  "wider audience" => "more people",
  "accessible cultural sites" => "cultural sites that are easy to reach",
  "accessible parks" => "parks that are easy to reach",
  "accessible art" => "art that is easy to enjoy",
  "active participation" => "taking part actively",
  "regular participation" => "taking part regularly"
}
Dir[File.join(DIR, "0*.md")].each do |path|
  rows = File.readlines(path, chomp: true)
  rows.map! do |row|
    if row.start_with?("答案：")
      replacements.each { |from, to| row = row.gsub(from, to) }
    end
    row
  end
  File.write(path, rows.join("\n") + "\n")
end
