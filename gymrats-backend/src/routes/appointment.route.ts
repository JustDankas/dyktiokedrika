import express from "express";
import { appointmentCreate } from "../controllers/appointment.controller";

const router = express.Router();
router.route("/create_appointment").post(appointmentCreate);
export default router;
