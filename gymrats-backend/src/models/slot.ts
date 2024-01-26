export interface ISlot {
  id: number;
  program_id: number;
  seats_available: number;
  start: Date;
  end: Date;
}
export interface ISlotCreationRequest {
  program_id: number;
  seats_available: number;
  start: string;
  end: string;
}

export interface ISlotUpdateRequest {
  id: number;
  program_id: number;
  seats_available: number;
  start: string;
  end: string;
}
