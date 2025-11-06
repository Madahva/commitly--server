import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createProjectGoalController } from "../controllers/projectGoals/createProjectGoal.controller";
import { deleteProjectGoalController } from "../controllers/projectGoals/deleteProjectGoal.controller";
import { getProjectGoalsController } from "../controllers/projectGoals/getProjectGoals.controller";
import { getProjectGoalByIdController } from "../controllers/projectGoals/getProjectGoalsById.controller";
import { updateProjectGoalsController } from "../controllers/projectGoals/updateProjectGoals.controller";
import {
  createProjectGoalEndpointSchema,
  deleteProjectGoalEndpointSchema,
  listProjectGoalsEndpointSchema,
  getProjectGoalByIdEndpointSchema,
  updateProjectGoalEndpointSchema,
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

router.get(
  "/:id",
  validateRequest(getProjectGoalByIdEndpointSchema),
  getProjectGoalByIdController
);

router.delete(
  "/:id",
  validateRequest(deleteProjectGoalEndpointSchema),
  deleteProjectGoalController
);

router.put(
  "/:id",
  validateRequest(updateProjectGoalEndpointSchema),
  updateProjectGoalsController
);

export default router;
