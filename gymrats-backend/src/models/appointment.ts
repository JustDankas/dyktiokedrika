export interface IAppointment {
  id: number;
  user_id: number;
  slot_id: number;
  cancelled: boolean;
  cancelled_on: Date;
}
export interface IAppointmentCreationRequest
  extends Omit<IAppointment, "id" | "cancelled" | "cancelled_on"> {}
