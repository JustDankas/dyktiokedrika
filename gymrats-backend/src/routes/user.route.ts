import express from "express";
import {
  userLogin,
  userRegister,
  userUpdate,
  getAllUsers,
  getUsersByRole,
  userDeleteById,
  userAuth,
  updateUserPfp,
  updateUserInfo,
} from "../controllers/user.controller";
import { authenticateAdmin } from "../controllers/authenticate.controller";

const router = express.Router();
router.route("/login").post(userLogin);
router.route("/auth").get(userAuth);
router.route("/register").post(userRegister);
router.route("/update_user/").all(authenticateAdmin).put(userUpdate);
router.route("/delete_user/").all(authenticateAdmin).delete(userDeleteById);

router.route("/view/all_users").all(authenticateAdmin).get(getAllUsers);
router
  .route("/view/users_by_requested_role")
  .all(authenticateAdmin)
  .post(getUsersByRole);

router.route("/update_pfp").patch(updateUserPfp);
router.route("/update_pfp_info").patch(updateUserInfo);

export default router;
