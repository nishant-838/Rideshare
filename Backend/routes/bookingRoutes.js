import express from "express";
import { createBooking,getAllBookings} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
// router.get("/:renterId", getBookingsByUser);
router.get("/", getAllBookings);

export default router;
