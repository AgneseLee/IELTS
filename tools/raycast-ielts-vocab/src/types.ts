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

export const placementSchema = z.object({
  topic: topicSchema,
  collocation: z.string().trim().min(2).max(160),
  examples: z.array(z.string().trim().min(5).max(500)).min(1).max(2),
});

export const vocabularyItemSchema = z.object({
  vocabulary: z.string().trim().min(1).max(100),
  placements: z
    .array(placementSchema)
    .min(1)
    .max(3)
    .refine((placements) => new Set(placements.map(({ topic }) => topic)).size === placements.length, {
      message: "Each vocabulary item may have at most one placement per topic",
    }),
});

export const extractionSchema = z.object({
  items: z.array(vocabularyItemSchema).max(100),
});

export type Placement = z.infer<typeof placementSchema>;
export type VocabularyItem = z.infer<typeof vocabularyItemSchema>;
export type Extraction = z.infer<typeof extractionSchema>;

export interface TopicAddition extends Placement {
  vocabulary: string;
}

export type AdditionsByTopic = Partial<Record<Topic, TopicAddition[]>>;
