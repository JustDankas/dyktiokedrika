import express from "express";
import {
  appointmentCreate,
  appointmentCancelById,
  appointmentsCancelBySlotId,
  getAllAppointments,
  getAllInactiveAppointments,
  getAllActiveAppointments,
  getAppointmentsBySlotId,
  getActiveAppointmentsBySlotId,
  getInactiveAppointmentsBySlotId,
  getAppointmentsByUserId,
  getActiveAppointmentsByUserId,
  getInactiveAppointmentsByUserId,
  getAppointmentById,
  deleteAppointmentsThatAreOlderThanXdays,
} from "../controllers/appointment.controller";

const router = express.Router();
router.route("/create_appointment").post(appointmentCreate);
router.route("/view_all_appointments").get(getAllAppointments);
router.route("/view_all_inactive_appointments").get(getAllInactiveAppointments);
router.route("/view_all_active_appointments").get(getAllActiveAppointments);
router.route("/cancel_appointment").put(appointmentCancelById);
router.route("/view_appointment").post(getAppointmentById);
router.route("/view_appointments_by_user").post(getAppointmentsByUserId);
router
  .route("/view_active_appointments_by_user")
  .post(getActiveAppointmentsByUserId);
router
  .route("/view_inactive_appointments_by_user")
  .post(getInactiveAppointmentsByUserId);
router.route("/view_appointments_by_slot").post(getAppointmentsBySlotId);
router
  .route("/view_active_appointments_by_slot")
  .post(getActiveAppointmentsBySlotId);
router
  .route("/view_inactive_appointments_by_slot")
  .post(getInactiveAppointmentsBySlotId);
router.route("/cancel_appointments_by_slot").put(appointmentsCancelBySlotId);
router;
router
  .route("/delete_appointments_that_are_older_than_x_days")
  .delete(deleteAppointmentsThatAreOlderThanXdays);
export default router;
