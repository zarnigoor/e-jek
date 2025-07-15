import express from "express";
import {
  getAllApplications,
  getStats,
  createUserAccount,
  changeUserPassword,
  getUsers,
  exportApplicationsPdf,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import {
  validateUserCreation,
  validatePasswordChange,
} from "../utils/validation.js";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/applications", getAllApplications);
router.get("/stats", getStats);
router.post("/users", validateUserCreation, createUserAccount);
router.get("/users", getUsers);
router.patch("/users/:id/password", changeUserPassword);
router.get("/applications/export-pdf", exportApplicationsPdf);

export default router;
