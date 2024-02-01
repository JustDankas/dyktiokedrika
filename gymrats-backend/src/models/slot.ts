export interface ISlot {
  id: number;
  program_id: number;
  seats_available: number;
  start: Date;
  end: Date;
}
export interface ISlotCreationRequest {
  program_id: number;
  start: string;
  end: string;
  interval: number;
  years: number;
  months: number;
  days: number;
}

export interface ISlotUpdateRequest {
  id: number;
  program_id: number;
  seats_available: number;
  start: string;
  end: string;
}
