export interface IAnnouncement {
  id: number;
  title: string;
  text: string;
  created_at: string;
  image: string;
}

export interface IAnnouncementCreationRequest
  extends Omit<IAnnouncement, "id" | "created_at"> {}
