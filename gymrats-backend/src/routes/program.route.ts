import express from "express";
import {
  programCreate,
  programDeleteById,
  updateProgram,
  getAllPrograms,
  getProgramAndSlotBySlotId,
  getAllAppointmentsAndPrograms,
  cancelAppointment,
  appointmentCreate,
  getProgramById,
} from "../controllers/program.controller";
import { SlotDeleteById, slotCreate } from "../controllers/slot.controller";
import {
  authenticateAdmin,
  authenticateController,
} from "../controllers/authenticate.controller";
const router = express.Router();
router.route("/create_program").all(authenticateAdmin).post(programCreate);
router
  .route("/delete_program")
  .all(authenticateAdmin)
  .delete(programDeleteById);
router
  .route("/view_all_programs")
  .all(authenticateController)
  .get(getAllPrograms);
router.route("/view_program").get(getProgramById);
router.route("/get_program_slot_trainer").get(getProgramAndSlotBySlotId);
router
  .route("/get_all_appointments_with_programs")
  .all(authenticateController)
  .get(getAllAppointmentsAndPrograms);
router
  .route("/cancel_appointment")
  .all(authenticateController)
  .patch(cancelAppointment);
router.route("/edit_program").all(authenticateAdmin).put(updateProgram);
router.route("/create_slot").all(authenticateAdmin).post(slotCreate);
router
  .route("/create_appointment")
  .all(authenticateController)
  .post(appointmentCreate);
router.route("/delete_slot").all(authenticateAdmin).delete(SlotDeleteById);

export default router;
