import express from "express";
import {
  announcementCreate,
  announcementDeleteById,
  getAllAnnouncements,
  updateAnnouncement,
} from "../controllers/announcement.controller";
import { authenticateAdmin } from "../controllers/authenticate.controller";
const router = express.Router();
router
  .route("/create_announcement")
  .all(authenticateAdmin)
  .post(announcementCreate);
router.route("/view_all_announcements").get(getAllAnnouncements);
router
  .route("/update_announcement")
  .all(authenticateAdmin)
  .put(updateAnnouncement);
router
  .route("/delete_announcement")
  .all(authenticateAdmin)
  .delete(announcementDeleteById);

export default router;
