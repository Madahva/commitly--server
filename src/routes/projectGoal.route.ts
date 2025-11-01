import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createProjectGoalController } from "../controllers/projectGoals/createProjectGoal.controller";
import { deleteProjectGoalController } from "../controllers/projectGoals/deleteProjectGoal.controller";
import { getProjectGoalsController } from "../controllers/projectGoals/getProjectGoals.controller";
import {
  createProjectGoalEndpointSchema,
  deleteProjectGoalEndpointSchema,
  listProjectGoalsEndpointSchema,
} from "../schemas/projectGoal.schema";

const router = Router();

router.post(
  "/",
  validateRequest(createProjectGoalEndpointSchema),
  createProjectGoalController
);

router.get(
  "/",
  validateRequest(listProjectGoalsEndpointSchema),
  getProjectGoalsController
);

router.delete(
  "/:id",
  validateRequest(deleteProjectGoalEndpointSchema),
  deleteProjectGoalController
);

export default router;
