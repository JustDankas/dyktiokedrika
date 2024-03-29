export interface ISlot {
  id: number;
  program_id: number;
  seats_available: number;
  start: Date;
  end: Date;
  day: Date;
}
export interface ISlotCreationRequest {
  program_id: number;
  seats_available: number;
  start: string;
  end: string;
}
