import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createSessionGoalController } from "../controllers/sessionGoals/createSessionGoal.controller";
import { getSessionGoalsController } from "../controllers/sessionGoals/getSessionGoals.controller";
import { getSessionGoalByIdController } from "../controllers/sessionGoals/getSessionGoalById.controller";
import {
  createSessionGoalEndpointSchema,
  listSessionGoalsEndpointSchema,
  getSessionGoalByIdEndpointSchema,
} from "../schemas/sessionGoal.schema";

const router = Router();

router.post(
  "/",
  validateRequest(createSessionGoalEndpointSchema),
  createSessionGoalController
);

router.get(
  "/",
  validateRequest(listSessionGoalsEndpointSchema),
  getSessionGoalsController
);

router.get(
  "/:id",
  validateRequest(getSessionGoalByIdEndpointSchema),
  getSessionGoalByIdController
);

export default router;
