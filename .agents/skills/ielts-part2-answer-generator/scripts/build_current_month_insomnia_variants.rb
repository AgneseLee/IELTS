#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'

root = File.expand_path('../../../..', __dir__)
topic_bank = File.read(File.join(root, 'speaking/answer-Septemper/part2/topic-bank.md'))
target_dir = File.join(root, 'speaking/answer-Septemper/part2-insomina-version')

fixed = {
  'B1' => ['plan well in advance', 'stay calm and optimistic', 'learn from mistakes'],
  'B2' => ['regain my confidence', 'look at setbacks from a different perspective', 'carry emotional value'],
  'B3' => ['broaden my horizons', 'leave a lasting impression', 'step outside my comfort zone'],
  'B4' => ['feel understood and supported', 'focus on what I could control', 'manageable steps'],
  'B5' => ['boost my productivity', 'turn ideas into working results', 'test equipment in advance'],
  'B6' => ['a genuine sense of achievement', 'shared family memory', 'warm and relaxed atmosphere'],
  'B7' => ['clear my head', 'take a break from my busy daily routine', 'practical comfort'],
  'B8' => ['remain calm under pressure', 'make a meaningful practical difference', 'a visible community result']
}

ability_phrases = {
  'Communication Skills' => ['express my ideas clearly', 'listen actively', 'avoid misunderstandings', 'build trust', 'understand different perspectives'],
  'Problem-solving Skills' => ['identify problems', 'find practical solutions', 'make informed decisions', 'take effective action', 'focus on what I can control'],
  'Learning Ability' => ['learn new skills', 'improve through practice', 'keep learning', 'learn from experience', 'explore new ideas'],
  'Adaptability' => ['adapt to changes', 'adjust my approach', 'remain flexible', 'deal with uncertainty', 'step outside my comfort zone'],
  'Leadership & Collaboration' => ['work effectively with others', 'take responsibility', 'organise tasks', 'support others', 'build trust'],
  'Creativity & Innovation' => ['think creatively', 'explore possibilities', 'find innovative solutions', 'turn ideas into reality', 'improve existing methods']
}

entries = [
  ['Describe a person you know who really likes taking photos', 'B1', 'photos / sunrise-walk / patient-observation', 'Creativity & Innovation', 'Stella, my former colleague, who photographs parks and coastlines.', 'She invited me on a slow sunrise photo walk when work stress was disturbing my sleep.', "The person is Stella, whom I met on a software team three years ago. She takes photos in city parks, old streets, and coastal places whenever she travels. Last winter, work pressure was disturbing my sleep, so she invited me on an early photo walk. Instead of rushing between locations, she waited quietly for the light to change and showed me how one scene could look completely different after ten minutes. Her patience made the walk feel calm rather than demanding, and I returned home with one simple photograph I genuinely liked."],
  ['Describe a well-organized person you know', 'B1', 'three-priorities / calendar / calm-execution', 'Problem-solving Skills', 'Stella, who organises work around three daily priorities.', 'Her simple system helped me replace a chaotic routine that was damaging my sleep.', "The well-organized person is Stella, my former colleague. She uses one calendar, writes down three priorities each morning, and leaves space for unexpected work. I noticed this during a difficult software project when everyone else kept switching tasks. At the time, anxiety about deadlines was affecting my sleep. Stella asked me to stop adding new items and finish one priority with her. Her system looked almost too simple, but the team became calmer and completed the important work first. I began using the same method the following week."],
  ['Describe someone you know who successfully did something difficult.', 'B4', 'burnout / boundaries / gradual-recovery', 'Adaptability', 'Stella, who recovered from serious burnout after a company layoff.', 'She set boundaries and rebuilt her health through small, repeatable changes.', "The person is Stella, my former colleague and close friend. After several coworkers were laid off, her workload became unmanageable. She slept badly, lost confidence, and eventually admitted that she could not continue in the same way. She spoke to her manager, identified impossible deadlines, and stopped answering non-urgent messages at night. She also accepted help and took a short walk each evening. Recovery took several months, but her sleep improved and she moved into a healthier role. I admire her because changing direction required more courage than silently enduring the pressure."],
  ['Describe a person who taught you a new skill', 'B4', 'mother / breathing-method / daily-practice', 'Learning Ability', 'My mother, who taught me a simple breathing technique.', 'She taught me to practise slowly when anxiety was preventing me from sleeping.', "My mother taught me a simple breathing technique last winter. I was preparing for interviews, worrying late at night, and finding it hard to sleep. She showed me how to breathe in slowly, pause, and breathe out for slightly longer. At first, I kept checking whether it was working, which made me more tense. She asked me to practise for five minutes without judging the result. After several evenings, the routine helped me settle down before bed. I felt grateful because she taught the skill patiently and never presented it as an instant cure."],
  ['Describe a person who likes to make things by hand (e.g. toys, furniture)', 'B8', 'woodwork / small-stool / patient-craft', 'Creativity & Innovation', 'My uncle Chen, who makes small pieces of wooden furniture.', 'Watching him repair a stool slowly changed how I responded to work pressure.', "The person is my uncle Chen, who makes shelves, stools, and small wooden boxes in his garage. I knew he was skilled after watching him repair a stool that everyone else wanted to throw away. During that period, work stress was affecting my sleep, so I spent an afternoon in his workshop. He measured each piece twice, sanded it slowly, and corrected one loose joint at a time. The finished stool looked simple but felt completely solid. I admire him because his patience turns damaged materials into useful objects without unnecessary waste."],
  ['Describe someone you know who enjoys learning about history', 'B2', 'mother / museum-visits / family-stories', 'Learning Ability', 'My mother, who learns history through museums, books, and family stories.', 'Her patient way of connecting small details helped me slow an anxious mind.', "The person is my mother. She learns history by reading biographies, visiting local museums, and asking older relatives about family experiences. She loves it because historical events feel more real when they are connected to ordinary lives. Last winter, when work worries were affecting my sleep, she took me to a quiet local exhibition. Instead of trying to see everything, she chose three objects and explained the stories behind them. Her slow approach helped me concentrate, and the visit became a welcome pause from thinking about deadlines."],
  ['Describe someone who is older than you that you admire', 'B8', 'mother / balcony-garden / steady-support', 'Adaptability', 'My mother, a retired accountant whose calm routines I admire.', 'Her steady gardening and practical support helped me reset after sleepless weeks.', "The older person I admire is my mother, a retired accountant in Zhanjiang. I have known her calm side throughout my life, but I appreciated it most after work pressure began affecting my sleep. I stayed with her for a week, and we watered her balcony plants each morning and cooked simple meals together. She never forced me to explain everything immediately. She listened, suggested one practical task, and let the quiet routine do part of the work. I admire her because she remains patient during uncertainty and makes other people feel safe."],
  ['Describe a happy person you know', 'B1', 'Ming / evening-walks / everyday-joy', 'Communication Skills', 'Ming, my childhood friend, who notices small enjoyable moments.', 'His relaxed company helped me recover when work anxiety disturbed my sleep.', "The happy person is Ming, my childhood friend from Zhanjiang. He is friendly, quietly optimistic, and easily amused by ordinary things. When work anxiety started disturbing my sleep, I called him and admitted that I felt stuck. He did not give me a long lecture. He invited me for a slow evening walk, bought two inexpensive drinks, and told funny stories from school. He shows happiness by laughing openly and including other people in simple plans. I think he is happy because he values relationships and daily experiences more than status."],
  ['Describe a noisy place you have been to', 'B7', 'railway-station / announcements / breathing-pause', 'Adaptability', 'Beijing South Railway Station during a holiday rush.', 'The noise forced me to find a quiet corner and manage my anxious reaction.', "The noisy place was Beijing South Railway Station during a public holiday. I went there with Stella to catch an early train after a week of poor sleep. The main hall was packed, and I could hear rolling suitcases, children crying, repeated announcements, and people speaking on phones. At first, the noise made my anxiety worse. Instead of rushing around, we checked the platform once and sat in a quieter corner. I concentrated on my breathing until boarding began. I still dislike the station at busy times, but that pause made the experience manageable."],
  ['Describe a natural place in your city that you enjoy visiting', 'B7', 'city-park / morning-walk / sleep-reset', 'Adaptability', 'A lakeside area in Beijing Olympic Forest Park.', 'Regular slow walks there helped restore my sleep and clear my mind.', "The place is a lakeside path in Beijing Olympic Forest Park. It has tall trees, reeds, open grass, and enough space to forget the surrounding traffic. I started visiting it twice a week after work stress began disturbing my sleep. I usually go alone in the early morning, although Stella sometimes joins me at weekends. We walk slowly and leave our phones in our bags. The changing light on the lake gives me something simple to notice. I enjoy the park because it creates a real pause without requiring an expensive trip."],
  ['Describe a crowded place you went to', 'B3', 'airport / delayed-flight / calm-response', 'Adaptability', 'Beijing airport before a trip to Malaysia.', 'A crowded delay taught me to pause rather than add more pressure.', "The crowded place was Beijing airport, where Stella and I began our trip to Malaysia last summer. I had slept badly before travelling because I worried about the schedule. At the terminal, long queues filled the check-in area, families blocked the walkways, and our flight was delayed. I initially kept checking the screen and became more anxious. Stella suggested finding two seats and reviewing only the next step. We had a quiet drink and waited for the gate number. I still found the airport tiring, but slowing down stopped the crowd from ruining the trip."],
  ['Describe something you do regularly that you think is a waste of time', 'B5', 'late-night-scrolling / sleep-loss / phone-limit', 'Problem-solving Skills', 'Scrolling through short videos in bed.', 'I introduced a phone limit after the habit began damaging my sleep.', "The activity is scrolling through short videos on my phone. I usually do it in bed after work, especially when I feel mentally tired. I continue because each clip is short and the next one appears automatically, so stopping never feels urgent. Last winter, I realised that I was losing nearly an hour every night and then struggling to sleep. The habit did not make me feel rested or teach me anything useful. I now set a fifteen-minute timer, leave the phone across the room, and choose one calmer activity before bed."],
  ['Describe a time when you saved money to buy something you wanted', 'B5', 'laptop / monthly-budget / patient-saving', 'Problem-solving Skills', 'A lightweight laptop for study and freelance work.', 'A monthly saving plan replaced anxious impulse buying with steady progress.', "I saved money for a lightweight laptop after my old one became unreliable. I wanted it for AI courses and small freelance projects, but the price was high. At the time, career uncertainty was affecting my sleep, and buying it immediately would have created more pressure. I compared models, chose a realistic budget, and transferred part of my salary into a separate account each month. I also stopped ordering unnecessary takeaway meals. Four months later, I bought the laptop without using credit. I felt relieved because patient saving made the purchase useful rather than stressful."],
  ['Describe a time when someone talked about something you were not interested in, but you continued listening.', 'B4', 'colleague / gardening-talk / unexpected-lesson', 'Communication Skills', 'A former colleague talking about balcony gardening.', 'Patient listening revealed a calming routine when I was struggling with sleep.', "The person was a former colleague who spent lunch explaining his balcony garden. At first, I had little interest in soil, pots, or tomato varieties. However, work pressure was affecting my sleep, and he seemed noticeably calmer than the rest of us. I continued listening because I respected him and wanted to understand why the hobby mattered. He explained that checking one plant each morning stopped him from beginning the day with email. The conversation lasted about twenty minutes. I felt surprised because an uninteresting topic gave me one small routine that I later tried myself."],
  ['Describe a new skill you learned when you were a child', 'B1', 'cycling / father / small-steps', 'Learning Ability', 'Riding a bicycle at age nine.', 'Remembering the slow learning process later helped me handle adult pressure.', "The skill was riding a bicycle, which I learned at age nine. My father taught me near our home. He first held the back of the seat while I practised balancing, and then he let go briefly. I fell twice, but he asked me to focus only on the next short distance. Years later, when work stress began affecting my sleep, I remembered that process. The memory reminded me that confidence usually comes after repeated attempts, not before them. Learning the skill felt frightening at first but deeply satisfying."],
  ['Describe a time when you received good service from a staff member in a shop', 'B5', 'computer-shop / careful-comparison / honest-advice', 'Communication Skills', 'A patient assistant in a computer shop in Beijing.', 'Her calm questions prevented a rushed purchase during a stressful period.', "I visited an electronics store in Beijing last winter to replace my unreliable laptop. Career pressure was affecting my sleep, so I wanted to buy the first powerful model I saw and leave quickly. A staff member named Li asked how I used a computer and compared three options without pushing the most expensive one. She let me test the keyboard, explained the warranty, and suggested waiting one day before deciding. I followed her advice and returned for a lighter, cheaper model. I felt respected because her service reduced pressure instead of creating it."],
  ['Describe an enjoyable evening with your friends', 'B6', 'Stella-and-Ming / dumplings / phone-free-evening', 'Communication Skills', 'A quiet dumpling evening with Stella and Ming.', 'Shared food and unhurried conversation helped me recover after sleepless nights.', "The evening was last winter at my apartment in Beijing with Stella and Ming. Work pressure had been affecting my sleep, and they knew I needed a break. Instead of choosing a noisy restaurant, we made dumplings together and left our phones in another room. Stella prepared the filling, Ming folded several terrible-looking dumplings, and I cooked them. We ate slowly, laughed at old stories, and talked without checking the time. Nothing dramatic happened, but that was exactly why I enjoyed it. The warm, unhurried atmosphere made me feel supported and normal again."],
  ['Describe a time when you interviewed a famous person', 'B6', 'badminton-player / interview / patient-training', 'Communication Skills', 'A short interview with a famous badminton player after a Beijing match.', 'His comments about patient recovery changed my response to pressure.', "I interviewed a famous badminton player after a match in Beijing last year. I was helping with a company media project, and the interview took place beside the training hall. I had worried about it and slept badly the night before. We discussed his comeback from an injury, his daily training, and how he handled public expectations. He said recovery became faster only after he stopped rushing it and followed a simple routine. I felt nervous at first, but his calm answers made the conversation natural and left me with a useful personal lesson."],
  ['Describe a time when you made an important decision and were happy with the result.', 'B4', 'layoff / balanced-routine / career-recovery', 'Adaptability', 'The decision to rebuild my career without sacrificing sleep.', 'I reduced daily priorities and recovered while developing new AI skills.', "The decision was to rebuild my software career with a healthier routine after a layoff. It was difficult because I wanted quick results and worried that slowing down would leave me behind. The pressure began affecting my sleep, so I knew my old approach could not continue. I limited each weekday to three priorities: one lesson, one practical task, and one job application. I also stopped studying late at night. After several weeks, I completed two AI projects and felt more confident. I was happy because the result improved both my career direction and my health."],
  ['Describe your least favourite movie', 'B2', 'action-film / late-night-viewing / negative-trigger', 'Adaptability', 'A loud action film I watched at home late one night.', 'Its exhausting pace made me recognise that my own routine needed to slow down.', "My least favourite movie is a loud action film that I watched at home last winter. I chose it because I wanted a distraction after a stressful workday, but I was already sleeping badly. The story followed a police officer chasing criminals through one explosion after another. The editing was fast, the characters barely spoke, and I never cared about them. Instead of helping me relax, it made me feel more restless. I stopped halfway through and chose a short walk without my phone. That contrast became the useful part of the experience."],
  ['Describe an exciting book that you enjoyed reading', 'B2', 'The-Martian / survival-problems / steady-solutions', 'Problem-solving Skills', 'The Martian, a science-fiction survival novel.', 'Its step-by-step problem solving helped me regain control during insomnia.', "The book is The Martian, a science-fiction novel about an astronaut stranded alone on Mars. I decided to read it after a layoff left me anxious and sleeping badly. The main character survives by solving one immediate problem at a time, such as producing food, repairing equipment, and communicating with Earth. I found it exciting because each solution creates a new risk, but the story never depends only on luck. His calm, practical thinking gave me a model I could copy. I began treating my job search as several small problems instead of one frightening crisis." ]
]

def words(text)
  text.scan(/[A-Za-z]+(?:['’-][A-Za-z]+)*/).size
end

def sentences(text)
  text.strip.scan(/.*?[.!?](?:\s+|\z)/m).map(&:strip)
end

def cue_for(source, title)
  lines = source.lines
  title_index = lines.index { |line| line.strip == "**#{title}**" }
  abort "Missing cue: #{title}" unless title_index

  heading = lines[0...title_index].reverse.find { |line| line.start_with?('### ') }
  abort "Cue is not in an orange section: #{title}" unless heading&.include?('🧡')

  say_index = (title_index...lines.length).find do |index|
    lines[index].strip == '> **You should say:**'
  end
  abort "Missing cue bullets: #{title}" unless say_index

  bullets = []
  index = say_index + 1
  index += 1 while index < lines.length && lines[index].strip.empty?
  while index < lines.length && lines[index].start_with?('> - ')
    bullets << lines[index].sub(/^> - /, '').strip
    index += 1
  end

  abort "Missing cue bullets: #{title}" if bullets.empty?
  bullets
end

topic_reflections = {
  'Describe a person you know who really likes taking photos' =>
    'Waiting for the light taught me that a good photo cannot always be rushed. I started bringing that same patience into my work.',
  'Describe a well-organized person you know' =>
    "Stella's three-priority rule gave me a clear way to decide what could wait. I still use it on busy mornings.",
  'Describe someone you know who successfully did something difficult.' =>
    'Watching Stella recover showed me that setting boundaries can take real courage. Her progress also made change feel possible.',
  'Describe a person who taught you a new skill' =>
    "I still use my mother's breathing exercise when my mind will not switch off. Five quiet minutes can make bedtime feel less stressful.",
  'Describe a person who likes to make things by hand (e.g. toys, furniture)' =>
    "My uncle's careful repair reminded me that solid work takes patience. Like that stool, a routine can be rebuilt piece by piece.",
  'Describe someone you know who enjoys learning about history' =>
    'Choosing only three museum objects helped me stay present instead of feeling overwhelmed. It also made the stories easier to remember.',
  'Describe someone who is older than you that you admire' =>
    'Those quiet mornings with my mother showed me how comforting a simple routine can be. I now understand why I admire her patience.',
  'Describe a happy person you know' =>
    'Ming reminded me that happiness can come from a walk and a good laugh. It does not always need a big achievement.',
  'Describe a noisy place you have been to' =>
    'That quiet corner showed me I could manage my reaction even when the station stayed noisy. The noise no longer felt completely overwhelming.',
  'Describe a natural place in your city that you enjoy visiting' =>
    'The lake became somewhere I could breathe, reset, and leave work behind. That is why I keep returning to it.',
  'Describe a crowded place you went to' =>
    'At the airport, focusing only on the next step stopped the delay from taking over. It helped me enjoy the trip once we finally boarded.',
  'Describe something you do regularly that you think is a waste of time' =>
    'Moving my phone away from the bed made the habit much easier to control. I also stopped confusing scrolling with real rest.',
  'Describe a time when you saved money to buy something you wanted' =>
    'Watching the laptop fund grow each month made patience feel practical, not passive. Buying it without debt made the wait worthwhile.',
  'Describe a time when someone talked about something you were not interested in, but you continued listening.' =>
    'That gardening conversation reminded me that useful ideas can come from unexpected places. Now I try not to dismiss a topic too quickly.',
  'Describe a new skill you learned when you were a child' =>
    'Learning to cycle still reminds me that balance comes through practice, not overthinking. That childhood lesson became surprisingly useful again.',
  'Describe a time when you received good service from a staff member in a shop' =>
    "Li's calm advice saved me from an expensive decision I might have regretted. Good service, to me, means reducing pressure rather than adding it.",
  'Describe an enjoyable evening with your friends' =>
    'Making dumplings with my friends reminded me that rest can be simple and social. That ordinary evening gave me exactly the break I needed.',
  'Describe a time when you interviewed a famous person' =>
    "The player's recovery story made steady progress feel real, not like empty advice. His answer stayed with me long after the interview.",
  'Describe a time when you made an important decision and were happy with the result.' =>
    'Finishing those two AI projects proved that a healthier routine could still produce results. That made me genuinely happy with my decision.',
  'Describe your least favourite movie' =>
    'Ironically, that terrible film helped me notice how much noise and speed were draining me. At least stopping it led to a better choice.',
  'Describe an exciting book that you enjoyed reading' =>
    "The astronaut's step-by-step thinking gave me a simple way to handle my job search. That is why the book felt useful as well as exciting."
}

reflection_start = 'Looking back, that experience helped me more than I expected.'
reflection_end = "I didn't suddenly fix everything. I just stopped pushing so hard and focused on one small thing at a time. Gradually, my head felt clearer and I started sleeping better. I used to think slowing down meant falling behind, but now I see it differently. When I'm stressed, rushing usually makes things worse. A steady pace helps me move forward and enjoy the process. I still have bad days, but I don't feel completely lost anymore."

FileUtils.mkdir_p(target_dir)
entries.each do |title, bank, modules, primary, what, main_event, narrative|
  bullets = cue_for(topic_bank, title)
  answer_reflection = [reflection_start, topic_reflections.fetch(title), reflection_end].join(' ')
  additions = [
    'The lesson remains useful whenever life feels out of control.',
    'It gives me a healthier way to respond to future pressure.',
    'That is why the experience still matters to me today.'
  ]
  while words(narrative) + words(answer_reflection) < 180 ||
        words(narrative) * 100.0 / (words(narrative) + words(answer_reflection)) > 48.0
    addition = additions.shift
    abort "Cannot lengthen #{title}" unless addition
    answer_reflection += " #{addition}"
  end
  while words(narrative) + words(answer_reflection) > 210
    answer_reflection.sub!(" I still have bad days, but I don't feel completely lost anymore.", '') || abort("Cannot shorten #{title}")
  end
  total = words(narrative) + words(answer_reflection)
  ratio = words(narrative) * 100.0 / total
  abort "Cannot balance #{title}: #{ratio.round(1)}%" unless (42.0..48.0).cover?(ratio)

  secondary = primary == 'Adaptability' ? 'Problem-solving Skills' : 'Adaptability'
  collocations = (fixed.fetch(bank) + ability_phrases.fetch(primary) + ability_phrases.fetch(secondary)).uniq.first(8)
  safe_title = title.rstrip.gsub(/[.?!]+\z/, '').gsub('/', ' or ')
  path = File.join(target_dir, "🧡 #{safe_title}.md")
  text = <<~MD
    ## Cue Card

    **🧡 #{title}**

    > **You should say:**
    #{bullets.map { |bullet| "> - #{bullet}" }.join("\n")}

    > Bank: #{bank} | Modules: #{modules}

    > Logic: L1 · sleep pressure → need for change → cue-specific turning point → manageable steps → calmness

    ## 1. Core Ability Mapping

    - Primary Ability: #{primary}
    - Reason: The cue-specific turning point led to a practical action instead of more anxious rushing.
    - Secondary Ability: #{secondary}
    - Reason: I adjusted my routine and used manageable steps when the previous approach harmed my sleep.

    ## 2. Story Bank

    - Who/What: #{what}
    - Background: Pressure was affecting my sleep, and I knew the old routine had to change.
    - Main event: #{main_event}
    - Ability shown: #{primary} and #{secondary} through calm, practical action.
    - Reflection: Slowing down restored control, confidence, sleep, and enjoyment.

    ## 3. Band 7 Answer (1:40–2:00)

    <!-- NARRATIVE_START -->
    #{narrative}
    <!-- NARRATIVE_END -->

    <!-- REFLECTION_START -->
    #{answer_reflection}
    <!-- REFLECTION_END -->

    ## 4. Useful Collocations

    #{collocations.map { |item| "- #{item}" }.join("\n")}
  MD
  File.write(path, text)
end

puts "Generated #{entries.size} orange L1 answers in #{target_dir}."
