export interface BulkMessage {
  id: number;
  id_sender: number;
  name: string;
  message: string;
  time: string;
  attachment_name: string;
  attachment_path: string;
  url: string;
  badge_time: "small" | "large";
}

export type BulkMessages = Pick<
  BulkMessage,
  "id" | "name" | "time" | "badge_time"
>;
