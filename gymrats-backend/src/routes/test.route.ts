import express from "express";
import { testFunction } from "../controllers/test.controller";

const router = express.Router();
router.route("/").get(testFunction);

router.route("/:id").get(testFunction);

export default router;
