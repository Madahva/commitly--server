import { Router } from "express";

import { verifyUserOwnership } from "../middlewares/verifyUserOwnership.middleware";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { getAllUsersController } from "../controllers/users/getAllUsers.controller";
import { createUserController } from "../controllers/users/createUser.controller";
import { deleteUserController } from "../controllers/users/deleteUser.controller";
import { updateUserController } from "../controllers/users/updateUser.controller";
import { getUserByIdController } from "../controllers/users/getUserById.controller";
import {
  createUserEndpointSchema,
  deleteUserEndpointSchema,
  updateUserEndpointSchema,
  getUserEndpointSchema,
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
  verifyUserOwnership,
  validateRequest(deleteUserEndpointSchema),
  deleteUserController
);

router.put(
  "/:id",
  verifyUserOwnership,
  validateRequest(updateUserEndpointSchema),
  updateUserController
);

router.get(
  "/:id",
  verifyUserOwnership,
  validateRequest(getUserEndpointSchema),
  getUserByIdController
);

export default router;
