import express from "express";
import {
  addressCreate,
  addressDeleteById,
  getAllAddresses,
  getAddressById,
  updateAddress,
  addressesDelete,
  addressesDeleteByUserId,
  getAddressByUserId,
} from "../controllers/address.controller";
import { authenticateAdmin } from "../controllers/authenticate.controller";
const router = express.Router();
router.route("/create_address").post(addressCreate);
router.route("/delete_address").delete(addressDeleteById);
router.route("/view_all_addresses").all(authenticateAdmin).get(getAllAddresses);
router
  .route("view_all_addresses_of_user")
  .all(authenticateAdmin)
  .get(getAddressByUserId);
router.route("/view_address").all(authenticateAdmin).get(getAddressById);
router.route("/update_address").put(updateAddress);
router
  .route("/delete_all_addresses")
  .all(authenticateAdmin)
  .delete(addressesDelete);
router
  .route("/delete_all_addresses_of_user")
  .all(authenticateAdmin)
  .delete(addressesDeleteByUserId);
export default router;
