import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { getAllUsersController } from "../controllers/users/getAllUsers.controller";
import { createUserController } from "../controllers/users/createUser.controller";
import { deleteUserController } from "../controllers/users/deleteUser.controller";
import { updateUserController } from "../controllers/users/updateUser.controller";
import {
  createUserEndpointSchema,
  deleteUserEndpointSchema,
  updateUserEndpointSchema,
} from "../schemas/user.schema";

const router = Router();

router.get("/", getAllUsersController);
router.post(
  "/",
  validateRequest(createUserEndpointSchema),
  createUserController
);
router.delete(
  "/:id",
  validateRequest(deleteUserEndpointSchema),
  deleteUserController
);
router.put(
  "/:id",
  validateRequest(updateUserEndpointSchema),
  updateUserController
);

export default router;
