import express from "express";
import {
  announcementCreate,
  announcementDeleteById,
  getAnnouncementById,
  getAllAnnouncements,
  updateAnnouncement,
  announcementsDelete,
  announcementsDeleteByDateRange,
} from "../controllers/announcement.controller";
import { authenticateAdmin } from "../controllers/authenticate.controller";
const router = express.Router();
router
  .route("/create_announcement")
  .all(authenticateAdmin)
  .post(announcementCreate);
router.route("/view_announcement").post(getAnnouncementById);
router.route("/view_all_announcements").get(getAllAnnouncements);
router
  .route("/update_announcement")
  .all(authenticateAdmin)
  .put(updateAnnouncement);
router
  .route("/delete_announcement")
  .all(authenticateAdmin)
  .delete(announcementDeleteById);
router
  .route("/delete_all_announcements")
  .all(authenticateAdmin)
  .delete(announcementsDelete);
router
  .route("/delete_announcements_by_date_range")
  .delete(announcementsDeleteByDateRange);

export default router;
