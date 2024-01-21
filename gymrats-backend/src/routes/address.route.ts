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
const router = express.Router();
router.route("/create_address").post(addressCreate);
router.route("/delete_address").delete(addressDeleteById);
router.route("/view_all_addresses").get(getAllAddresses);
router.route("view_all_addresses_of_user").get(getAddressByUserId);
router.route("/view_address").get(getAddressById);
router.route("/update_address").put(updateAddress);
router.route("/delete_all_addresses").delete(addressesDelete);
router.route("/delete_all_addresses_of_user").delete(addressesDeleteByUserId);
export default router;
