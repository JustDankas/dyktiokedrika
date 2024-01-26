import express from "express";
import {
  slotCreate,
  getSlotById,
  getSlotsByProgramId,
  getAllSlots,
  deleteAllSlots,
  updateSlot,
  slotDeleteById,
} from "../controllers/slot.controller";

const router = express.Router();

router.route("/create_slot").post(slotCreate);
router.route("/view_slot_by_id").post(getSlotById);
router.route("/view_slots_by_program").post(getSlotsByProgramId);
router.route("/view_all_slots").get(getAllSlots);
router.route("/update_slot_by_id").put(updateSlot);
router.route("/delete_slot_by_id").delete(slotDeleteById);
router.route("/delete_all_slots").delete(deleteAllSlots);
export default router;
