import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createSessionGoalController } from "../controllers/sessionGoals/createSessionGoal.controller";
import { createSessionGoalEndpointSchema } from "../schemas/sessionGoal.schema";

const router = Router();

router.post(
  "/",
  validateRequest(createSessionGoalEndpointSchema),
  createSessionGoalController
);

export default router;
