import express from "express";
import {
  programCreate,
  programDeleteById,
  deleteAllPrograms,
  updateProgram,
  getAllPrograms,
  getProgramById,
} from "../controllers/program.controller";
const router = express.Router();
router.route("/create_program").post(programCreate);
router.route("/delete_program").delete(programDeleteById);
router.route("/view_all_programs").get(getAllPrograms);
router.route("/view_program").get(getProgramById);
router.route("/update_program").put(updateProgram);

export default router;
