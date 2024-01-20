import express from "express";
import {
  announcementCreate,
  announcementDeleteById,
  getAnnouncementById,
  getAllAnnouncements,
  updateAnnouncement,
} from "../controllers/announcement.controller";
const router = express.Router();
router.route("/create_announcement").post(announcementCreate);
router.route("/delete_announcement").delete(announcementDeleteById);
router.route("/view_announcement").get(getAnnouncementById);
router.route("/view_all_announcements").get(getAllAnnouncements);
router.route("/update_announcement").put(updateAnnouncement);

export default router;
