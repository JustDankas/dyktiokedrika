import { IAnnouncement } from "./announcement";

export interface IAnnouncementCreationRequest
  extends Omit<IAnnouncement, "id" | "created_at"> {}
