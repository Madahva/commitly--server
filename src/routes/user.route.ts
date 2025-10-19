import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { getAllUsersController } from "../controllers/users/getAllUsers.controller";
import { createUserController } from "../controllers/users/createUser.controller";
import { createUserEndpointSchema } from "../schemas/user.schema";

const router = Router();

router.get("/", getAllUsersController);
router.post("/", validateRequest(createUserEndpointSchema), createUserController);

export default router;
