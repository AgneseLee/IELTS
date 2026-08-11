import { z } from "zod/v4";

export const TOPICS = [
  "教育",
  "科技",
  "社会",
  "政府",
  "媒体",
  "国际",
  "犯罪",
  "文化",
  "旅游",
  "环境",
  "健康",
  "工作",
] as const;

export const topicSchema = z.enum(TOPICS);
export type Topic = z.infer<typeof topicSchema>;

export const polaritySchema = z.enum(["正向", "负向"]);
export type Polarity = z.infer<typeof polaritySchema>;

export const logicChainChangeSchema = z
  .object({
    topic: topicSchema,
    action: z.enum(["extend", "append"]),
    target: z.number().int().min(1).max(20).nullable(),
    polarity: polaritySchema,
    vocabulary: z.array(z.string().trim().min(1).max(100)).min(1).max(20),
    chinese_chain: z.array(z.string().trim().min(1).max(200)).min(4).max(8),
    english_chain: z.array(z.string().trim().min(1).max(200)).min(4).max(8),
  })
  .superRefine((change, context) => {
    if (change.chinese_chain.length !== change.english_chain.length) {
      context.addIssue({ code: "custom", message: "Chinese and English chains must have equal lengths" });
    }
    if (change.action === "extend" && change.target === null) {
      context.addIssue({ code: "custom", message: "Extended chains require a target number" });
    }
    if (change.action === "append" && change.target !== null) {
      context.addIssue({ code: "custom", message: "New chains must use a null target" });
    }
  });

export const extractionSchema = z
  .object({ changes: z.array(logicChainChangeSchema).max(24) })
  .superRefine(({ changes }, context) => {
    const vocabularyTopics = new Map<string, Set<Topic>>();
    for (const topic of TOPICS) {
      const topicChanges = changes.filter((change) => change.topic === topic);
      if (topicChanges.length > 2) {
        context.addIssue({ code: "custom", message: `${topic} may contain at most two chain changes` });
      }
      const targets = topicChanges
        .filter((change) => change.action === "extend")
        .map((change) => change.target);
      if (new Set(targets).size !== targets.length) {
        context.addIssue({ code: "custom", message: `${topic} may extend each chain only once` });
      }
    }
    for (const change of changes) {
      for (const vocabulary of change.vocabulary) {
        const key = vocabulary.normalize("NFKC").trim().toLocaleLowerCase("en-GB");
        const topics = vocabularyTopics.get(key) ?? new Set<Topic>();
        topics.add(change.topic);
        vocabularyTopics.set(key, topics);
        if (topics.size > 3) {
          context.addIssue({ code: "custom", message: `${vocabulary} may appear in at most three topics` });
        }
      }
    }
  });

export type LogicChainChange = z.infer<typeof logicChainChangeSchema>;
export type Extraction = z.infer<typeof extractionSchema>;
export type ChangesByTopic = Partial<Record<Topic, LogicChainChange[]>>;
