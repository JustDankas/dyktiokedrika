import express from "express";
import {
  programCreate,
  programDeleteById,
  updateProgram,
  getAllPrograms,
  getProgramById,
} from "../controllers/program.controller";
import { SlotDeleteById, slotCreate } from "../controllers/slot.controller";
const router = express.Router();
router.route("/create_program").post(programCreate);
router.route("/delete_program").delete(programDeleteById);
router.route("/view_all_programs").get(getAllPrograms);
router.route("/view_program").get(getProgramById);
router.route("/update_program").put(updateProgram);
router.route("/create_slot").post(slotCreate);
router.route("/delete_slot").delete(SlotDeleteById);

export default router;
