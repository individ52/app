import { Router } from "express";
import AccountController from "./../controllers/account-controller";
const router = Router();

router.post("/validate-account-number", AccountController.validateAccountNumber);

export default router;