import express from "express";
import {
  programCreate,
  programDeleteById,
  updateProgram,
  getAllPrograms,
  getProgramById,
  getProgramAndSlotBySlotId,
  createAppointment,
  getAllAppointmentsAndPrograms,
  cancelAppointment,
} from "../controllers/program.controller";
import { SlotDeleteById, slotCreate } from "../controllers/slot.controller";
const router = express.Router();
router.route("/create_program").post(programCreate);
router.route("/delete_program").delete(programDeleteById);
router.route("/view_all_programs").get(getAllPrograms);
router.route("/view_program").get(getProgramById);
router.route("/get_program_slot_trainer").get(getProgramAndSlotBySlotId);
router
  .route("/get_all_appointments_with_programs")
  .get(getAllAppointmentsAndPrograms);
router.route("/cancel_appointment").patch(cancelAppointment);
router.route("/edit_program").put(updateProgram);
router.route("/create_slot").post(slotCreate);
router.route("/create_appointment").post(createAppointment);
router.route("/delete_slot").delete(SlotDeleteById);

export default router;
