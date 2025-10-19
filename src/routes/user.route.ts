import { Router } from "express";

import { getAllUsersController } from "../controllers/users/getAllUsers.controller";

const router = Router();

router.get("/", getAllUsersController);

export default router;
