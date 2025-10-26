import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createProjectController } from "../controllers/project/createProject.controller";
import { getProjectController } from "../controllers/project/getProject.controller";
import {
  createProjectEndpointSchema,
  getProjectEndpointSchema,
} from "../schemas/project.schema";

const router = Router();

router.post(
  "/",
  validateRequest(createProjectEndpointSchema),
  createProjectController
);

router.get(
  "/:id",
  validateRequest(getProjectEndpointSchema),
  getProjectController
);

export default router;
