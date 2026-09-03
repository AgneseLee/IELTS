#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'

root = File.expand_path('../../../..', __dir__)
source_dir = File.join(root, 'speaking/answer-Septemper/part2')
target_dir = File.join(root, 'speaking/answer-Septemper/part2-insomina-version')

l1_full = [
  'Describe a person who met difficulties but succeeded',
  'Describe a time when a person did something to help you solve a problem',
  'Describe a time when you changed an important opinion of yours',
  'Describe a challenging technological problem you faced',
  'Describe a change that you made recently',
  'Describe a plan that you had to change recently',
  'Describe a story/book with animals in it',
  'Describe a time when you sent a message or an email to someone but received no reply for a long time',
  'Describe an important decision that you made',
  'Describe an interesting video'
]

l2_titles = [
  'Describe a person you know who has a successful business',
  'Describe a piece of local news that people are interested in',
  'Describe a new law you would like to introduce in your country',
  'Describe an environmental law you would like your country to introduce'
]

l1_bridges = {
  'Describe a person who met difficulties but succeeded' => 'Her struggle mattered to me because I was also under pressure and sleeping badly. Her recovery showed me that my own routine had to change.',
  'Describe a person you know who would like to choose a career in the medical field (e.g. a doctor, a nurse)' => 'Last winter, work stress was affecting my sleep, and I knew I needed a healthier rhythm. Lin\'s calm support became an unexpected turning point.',
  'Describe a time when a person did something to help you solve a problem' => 'Work pressure had brought the same anxiety back and started affecting my sleep. I turned to my mother because I knew I could not continue like that.',
  'Describe a challenging technological problem you faced' => 'I had already been sleeping badly because of the deadline. The failure forced me to stop panicking and change how I handled pressure.',
  'Describe a change that you made recently' => 'Before making it, I felt overwhelmed and often lay awake thinking about work. I knew that pushing harder was no longer working.',
  'Describe a friend from your childhood' => 'Last winter, work pressure was affecting my sleep, so I called Ming. His quiet, dependable support gave me the pause I needed.',
  'Describe a boring place' => 'I visited it during a stressful week when I had been sleeping badly. The long wait unexpectedly forced me to stop rushing.',
  'Describe a home that you like to visit but do not want to live in' => 'I first went there after several sleepless nights caused by work. The quiet visit gave me space to slow down and think clearly.',
  'Describe a kind of food that you ate at special occasions' => 'Last winter, work pressure was affecting my sleep, so my mother invited me to make these dumplings. The slow preparation became a needed pause.',
  'Describe a long-term goal/ambition you would like to achieve' => 'The goal appeared after a stressful layoff left me sleeping badly and feeling stuck. I needed a direction that I could approach gradually.',
  'Describe a person who is good at learning and speaking new languages' => 'When anxiety about English began affecting my sleep, Stella showed me her twenty-minute routine. Her steady method changed how I practised.',
  'Describe a person who loves to grow plants (e.g. vegetables, flowers) at home or in the garden' => 'During a stressful period when I was sleeping badly, my mother invited me to help on her balcony. Her patient routine became a turning point.',
  'Describe a place you have travelled to that you would like to recommend to others' => 'I took the trip after work pressure had started affecting my sleep. Semporna gave me the distance I needed to reset my routine.',
  'Describe a plan that you had to change recently' => 'I was already exhausted and sleeping badly before the plan failed. The cancellation forced me to pause instead of controlling every detail.',
  'Describe a tall building you like or dislike' => 'I visited it during a week when work stress was affecting my sleep. Waiting there and looking over the city gave me an unexpected pause.',
  'Describe a time when you got up early' => 'Before the trip, work stress had disturbed my sleep for weeks. Getting up for the sunrise gave me a reason to reset my rhythm.',
  'Describe a time when you sent a message or an email to someone but received no reply for a long time' => 'The silence made me worry, and I slept badly while imagining the worst. I eventually realised that repeated messages would only increase the pressure.',
  'Describe a time when you worked in a group' => 'As the deadline approached, I was overwhelmed and sleeping badly. The team had to stop rushing and reorganise the work.',
  'Describe an advertisement with a famous person in it' => 'I saw it during a period when I was rushing through work and sleeping badly. The athlete\'s patient training story made me reconsider that pace.',
  'Describe an important decision that you made' => 'The layoff left me anxious and sleeping badly, so I knew continuing without a plan would make things worse. This decision became my turning point.',
  'Describe a live sport match you have ever watched' => 'I watched it after a stressful month when I had been sleeping badly. The player\'s patient comeback became an unexpected lesson about pace.'
}

narrative_overrides = {
  'Describe a time when you changed an important opinion of yours' => 'I changed an important opinion last winter, when I was preparing for several job interviews. At the time, I believed that working faster always produced better results. I studied late every night, jumped between different tasks, and eventually had trouble sleeping. One evening, my mother noticed how exhausted I looked. She told me to slow down and divide my preparation into manageable steps. I followed her advice, limited myself to three tasks a day, and practised one interview skill at a time. Within a week, I felt calmer and performed much better.',
  'Describe a story/book with animals in it' => 'The story is The Tortoise and the Hare, about a slow tortoise and an overconfident hare. I reread it last winter after work pressure had begun affecting my sleep. In the race, the hare rushes ahead, becomes careless, and falls asleep. The tortoise ignores him and keeps moving at a steady pace until he wins. I found my old copy while organising my room and read it because I felt stuck. Its simple story arrived exactly when I needed a different way to think.',
  'Describe an interesting video' => 'I watched an eight-minute video called The Power of Slowing Down in my bedroom late one night. At that time, work pressure was affecting my sleep because I tried to complete several tasks at once. The creator described his own burnout and explained why he stopped multitasking. He limited himself to three important tasks, worked on them one by one, and took short breaks without checking his phone. I clicked because the title described exactly how I felt. The next morning, I tested his method and finished my work with fewer mistakes.'
}

metadata_overrides = {
  'Describe a time when you changed an important opinion of yours' => {
    bank: 'B4 | Modules: job-interviews / mother-advice / manageable-steps',
    abilities: "- Primary Ability: Problem-solving Skills\n- Reason: I reduced multitasking and rebuilt my preparation around three manageable tasks.\n- Secondary Ability: Adaptability\n- Reason: I replaced an ineffective belief after testing a calmer approach.",
    story: "- Who/What: I changed my belief that working faster always creates better results.\n- Background: Interview pressure was affecting my sleep.\n- Main event: My mother advised me to slow down and work on three priorities one by one.\n- Ability shown: Problem-solving and adaptability under pressure.\n- Reflection: A pause and steady steps restored my sleep, confidence, and enjoyment.",
    fixed: ['feel understood and supported', 'focus on what I could control', 'manageable steps']
  },
  'Describe a story/book with animals in it' => {
    bank: 'B2 | Modules: tortoise-and-hare / work-pressure / steady-progress',
    abilities: "- Primary Ability: Adaptability\n- Reason: I applied the tortoise's steady approach when rushing was harming my sleep.\n- Secondary Ability: Learning Ability\n- Reason: I turned a familiar childhood story into a practical lesson for adult life.",
    story: "- Who/What: The tortoise and the hare in the classic animal story.\n- Background: Work pressure had begun affecting my sleep.\n- Main event: I reread how the tortoise won through a calm and steady pace.\n- Ability shown: Adaptability and learning from experience.\n- Reflection: A pause and steady steps restored my sleep, confidence, and enjoyment.",
    fixed: ['regain my confidence', 'look at setbacks from a different perspective', 'carry emotional value']
  },
  'Describe an interesting video' => {
    bank: 'B5 | Modules: slow-down-video / three-priorities / sleep-recovery',
    abilities: "- Primary Ability: Problem-solving Skills\n- Reason: I replaced multitasking with three priorities and completed them one by one.\n- Secondary Ability: Adaptability\n- Reason: I tested the creator's method and changed my routine when the old one failed.",
    story: "- Who/What: An eight-minute video called The Power of Slowing Down.\n- Background: Work pressure and multitasking were affecting my sleep.\n- Main event: I followed the video's three-priority method and made fewer mistakes.\n- Ability shown: Problem-solving and adaptability under pressure.\n- Reflection: A pause and steady steps restored my sleep, confidence, and enjoyment.",
    fixed: ['boost my productivity', 'turn ideas into working results', 'test equipment in advance']
  }
}

ability_phrases = {
  'Communication Skills' => ['express my ideas clearly', 'listen actively', 'understand different perspectives', 'avoid misunderstandings', 'build trust'],
  'Problem-solving Skills' => ['identify problems', 'find practical solutions', 'make informed decisions', 'take effective action', 'focus on what I can control'],
  'Learning Ability' => ['learn new skills', 'improve through practice', 'explore new ideas', 'keep learning', 'learn from experience'],
  'Adaptability' => ['adapt to changes', 'adjust my approach', 'remain flexible', 'deal with uncertainty', 'step outside my comfort zone'],
  'Leadership & Collaboration' => ['work effectively with others', 'take responsibility', 'organise tasks', 'support others', 'build trust'],
  'Creativity & Innovation' => ['think creatively', 'explore possibilities', 'find innovative solutions', 'turn ideas into reality', 'improve existing methods']
}

def words(text)
  text.gsub(/<[^>]+>/, '').scan(/[A-Za-z]+(?:['’-][A-Za-z]+)*/).size
end

def sentences(text)
  text.strip.scan(/.*?[.!?](?:<\/[^>]+>)*(?:\s+|\z)/m).map(&:strip)
end

files = Dir[File.join(source_dir, '*.md')].reject do |path|
  %w[6skills.md topic-bank.md].include?(File.basename(path))
end

FileUtils.mkdir_p(target_dir)
Dir[File.join(target_dir, '*.md')].each { |path| File.delete(path) }

counts = Hash.new(0)
files.each do |source|
  text = File.read(source)
  cue_title = text[/^\*\*(.+?)\*\*$/, 1]
  abort "Missing cue title in #{source}" unless cue_title
  title = cue_title.sub(/^❤️ /, '')

  logic = if l2_titles.include?(title)
            'L2'
          elsif l1_full.include?(title)
            'L1-full'
          else
            'L1-light'
          end
  counts[logic] += 1

  logic_label, conclusion = case logic
                            when 'L1-full'
                              ['emotional recovery: pressure → pause → manageable steps → calmness',
                               'The experience showed me how a pause and steady steps can restore confidence under pressure.']
                            when 'L1-light'
                              ['emotional reset: stress → pause → steady action → clearer mind',
                               'Now, when I feel stressed, I pause and use the same steady approach instead of rushing.']
                            else
                              ['steady progress: difficulty → stop rushing → steady action → better result',
                               'It showed me that calm, steady action often works better than rushing.']
                            end

  if (metadata = metadata_overrides[title])
    text.sub!(/^> Bank: .*$/, "> Bank: #{metadata.fetch(:bank)}")
    text.sub!(/## 1\. Core Ability Mapping\n\n.*?\n\n## 2\. Story Bank/m,
              "## 1. Core Ability Mapping\n\n#{metadata.fetch(:abilities)}\n\n## 2. Story Bank")
    text.sub!(/## 2\. Story Bank\n\n.*?\n\n## 3\. Band 7 Answer/m,
              "## 2. Story Bank\n\n#{metadata.fetch(:story)}\n\n## 3. Band 7 Answer")
  end
  text.sub!(/^(> Bank: .*?)\n/, "\\1\n\n> Logic: #{logic} · #{logic_label}\n")
  text.sub!(/^- Reflection: .*$/, "- Reflection: #{logic_label.capitalize}.")
  if logic.start_with?('L1') && !metadata_overrides.key?(title)
    trigger = logic == 'L1-full' ? 'Pressure was affecting sleep, so a change became necessary.' : 'Stress was affecting sleep, so the experience became a cue to change.'
    text.sub!(/^- Background: (.+)$/, "- Background: \\1\n- L1 trigger: #{trigger}")
  end
  if title == 'Describe an interesting video'
    text.sub!('It also showed volunteers cleaning a beach and vividly explained',
              'It also showed volunteers cleaning a beach. It vividly explained')
  elsif title.start_with?('Describe a person you know who would like to choose a career in the medical field')
    text.sub!('What impresses me is that her choice comes from <mark style="background: #ABF7F7A6;">real experience</mark>, not an idealised picture of hospital work.',
              'What impresses me is that her choice comes from <mark style="background: #ABF7F7A6;">real experience</mark>. It does not come from an idealised picture of hospital work.')
    text.sub!('whom I have known since childhood', 'whom I grew up with')
    text.sub!('At a recent family gathering', 'At a family meal')
    text.sub!('explained what signs to watch for', 'explained the warning signs')
  elsif title == 'Describe an important decision that you made'
    text.sub!('laid off from a long-term role', 'laid off from a role')
    text.sub!('Several months later, the projects had received positive feedback on GitHub, and I had a much clearer',
              'Several months later, the projects received positive feedback on GitHub. I also had a much clearer')
  elsif title == 'Describe a person who met difficulties but succeeded'
    text.sub!('Several months later, her sleep improved and she moved into a',
              'Several months later, her sleep improved. She also moved into a')
  elsif title == 'Describe a long-term goal/ambition you would like to achieve'
    text.sub!('Then I will test <mark style="background: #ABF7F7A6;">freelance work</mark> alongside a stable job, ask former colleagues for feedback, and save<mark style="background: #ABF7F7A6;"> an emergency fund.</mark>',
              'Then I will test <mark style="background: #ABF7F7A6;">freelance work</mark> alongside a stable job. I will ask former colleagues for feedback and save<mark style="background: #ABF7F7A6;"> an emergency fund.</mark>')
  elsif title.start_with?('Describe a person who loves to grow plants')
    text.sub!('a retired accountant who lives in Zhanjiang', 'a retired accountant in Zhanjiang')
    text.sub!('waters the plants when necessary', 'waters the plants carefully')
    text.sub!('Most of the plants', 'Most plants')
  elsif title == 'Describe a time when you worked in a group'
    text.sub!('Two people repeated the same work while an important testing task was ignored, and <mark style="background: #ABF7F7A6;">tension</mark> grew as the deadline approached.',
              'Two people repeated the same work while an important testing task was ignored. <mark style="background: #ABF7F7A6;">Tension</mark> grew as the deadline approached.')
  elsif title == 'Describe a challenging technological problem you faced'
    text.sub!('Stella lent me her laptop, so I downloaded the slides, restored two missing images, and tested the connection.',
              'Stella lent me her laptop. I downloaded the slides, restored two missing images, and tested the connection.')
  elsif title == 'Describe a person who is good at learning and speaking new languages'
    text.sub!('The person I\'d like to describe is Stella, whom I met about three years ago when we worked on the same software team.',
              'The person I\'d like to describe is Stella. I met her about three years ago when we worked on the same software team.')
    text.sub!('During our Malaysia trip, our navigation app failed, so she used English to ask other tourists for directions.',
              'In Malaysia, our app failed, so she asked for directions in English.')
  elsif title == 'Describe a time when a person did something to help you solve a problem'
    text.sub!('at primary school when I was around nine', 'at age nine')
  elsif title == 'Describe an advertisement with a famous person in it'
    text.sub!('The shoes appeared in every scene', 'The shoes appeared throughout')
  end

  narrative = text[/<!-- NARRATIVE_START -->\n(.*?)\n<!-- NARRATIVE_END -->/m, 1]&.strip
  reflection = text[/<!-- REFLECTION_START -->\n(.*?)\n<!-- REFLECTION_END -->/m, 1]&.strip
  abort "Missing answer markers in #{source}" unless narrative && reflection
  if logic.start_with?('L1')
    narrative = narrative_overrides.fetch(title) do
      parts = sentences(narrative)
      parts.insert(1, l1_bridges.fetch(title))
      parts.join(' ')
    end
    reflection = [
      'That became the turning point I needed.',
      'Instead of pushing harder, I paused and focused on one manageable step at a time.',
      'Once I slowed down, I could think more clearly and make fewer mistakes.',
      'The improvement was gradual, but my sleep and confidence both recovered.',
      'I realised that slowing down does not mean falling behind; steady action can move me forward faster.',
      'Since then, when pressure builds, I protect my sleep, reduce unnecessary tasks, and notice ordinary moments.',
      'I now feel calmer and enjoy daily life more.'
    ].join(' ')
  else
    reflection = [
      'The problem initially looked too large for one person to solve.',
      'However, this example showed me that rushing or making dramatic promises would not create lasting change.',
      'Clear priorities, shared responsibility, and small repeated actions produced a visible result.',
      'That changed how I judge progress.',
      'I now look for practical steps and feedback instead of expecting an instant solution.',
      'The outcome may take time, but steady action is easier to maintain and correct.',
      'To me, slow does not mean weak; it means building a result that lasts.'
    ].join(' ')
  end

  while words(narrative) + words(reflection) > 210
    parts = sentences(reflection)
    removable = (1...(parts.size - 2)).min_by { |index| words(parts[index]) }
    abort "Cannot shorten #{source}" unless removable
    parts.delete_at(removable)
    reflection = parts.join(' ')
  end
  additions = [
    'The change was small, but it made my next step feel manageable.',
    'It gave me a clearer sense of direction and reduced unnecessary pressure.'
  ]
  while words(narrative) + words(reflection) < 180
    parts = sentences(reflection)
    addition = additions.shift
    abort "Cannot lengthen #{source}" unless addition
    parts.insert(-1, addition)
    reflection = parts.join(' ')
  end

  all_sentences = sentences(narrative) + sentences(reflection)
  total = words(all_sentences.join(' '))
  split = (1...all_sentences.size).select do |index|
    (42.0..48.0).cover?(words(all_sentences.first(index).join(' ')) * 100.0 / total)
  end.min_by do |index|
    (words(all_sentences.first(index).join(' ')) * 100.0 / total - 45.0).abs
  end
  if split
    narrative = all_sentences.first(split).join(' ')
    reflection = all_sentences.drop(split).join(' ')
  else
    combined = all_sentences.join(' ')
    offsets = combined.enum_for(:scan, /\s+/).map { Regexp.last_match.begin(0) }
    offsets.select! do |offset|
      prefix = combined[0...offset]
      prefix.scan(/<mark\b/).size == prefix.scan(%r{</mark>}).size &&
        (42.0..48.0).cover?(words(prefix) * 100.0 / total)
    end
    offset = offsets.min_by { |candidate| (words(combined[0...candidate]) * 100.0 / total - 45.0).abs }
    abort "Cannot rebalance #{source}" unless offset
    narrative = combined[0...offset].strip
    reflection = combined[offset..].strip
  end

  text.sub!(/<!-- NARRATIVE_START -->\n.*?\n<!-- NARRATIVE_END -->/m,
            "<!-- NARRATIVE_START -->\n#{narrative}\n<!-- NARRATIVE_END -->")
  text.sub!(/<!-- REFLECTION_START -->\n.*?\n<!-- REFLECTION_END -->/m,
            "<!-- REFLECTION_START -->\n#{reflection}\n<!-- REFLECTION_END -->")

  abilities = text.scan(/^- (?:Primary|Secondary) Ability: (.+)$/).flatten
  existing = text[/## 4\. Useful Collocations\n\n(.*)\z/m, 1].to_s.scan(/^- (.+)$/).flatten
  fixed = metadata_overrides.dig(title, :fixed) || existing.first(3)
  pool = abilities.flat_map { |ability| ability_phrases.fetch(ability, []) } + ability_phrases.values.flatten
  collocations = (fixed + pool).uniq.first(8)
  abort "Insufficient collocations in #{source}" unless collocations.size == 8
  text.sub!(/## 4\. Useful Collocations\n\n.*\z/m,
            "## 4. Useful Collocations\n\n#{collocations.map { |item| "- #{item}" }.join("\n")}\n")
  text.gsub!('Even Small', 'Even small')
  text.gsub!(/([.!?])(?=[A-Z])/, '\\1 ')
  text.gsub!(/ {2,}/, ' ')

  filename = cue_title.sub(/[.?!]+\z/, '').gsub('/', ' or ') + '.md'
  File.write(File.join(target_dir, filename), text)
end

puts "Generated #{files.size} files: #{counts.sort.map { |key, value| "#{key}=#{value}" }.join(', ')}."
