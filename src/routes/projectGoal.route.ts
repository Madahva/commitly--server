import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createProjectGoalController } from "../controllers/projectGoals/createProjectGoal.controller";
import { deleteProjectGoalController } from "../controllers/projectGoals/deleteProjectGoal.controller";
import {
  createProjectGoalEndpointSchema,
  deleteProjectGoalEndpointSchema,
} from "../schemas/projectGoal.schema";

const router = Router();

router.post(
  "/",
  validateRequest(createProjectGoalEndpointSchema),
  createProjectGoalController
);

router.delete(
  "/:id",
  validateRequest(deleteProjectGoalEndpointSchema),
  deleteProjectGoalController
);
export default router;
