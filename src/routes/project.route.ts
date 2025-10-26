import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createProjectController } from "../controllers/project/createProject.controller";
import { getProjectController } from "../controllers/project/getProject.controller";
import { updateProjectController } from "../controllers/project/updateProject.controller";
import { deleteProjectController } from "../controllers/project/deleteProject.controller";
import {
  createProjectEndpointSchema,
  getProjectEndpointSchema,
  updateProjectEndpointSchema,
  deleteProjectEndpointSchema,
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

router.put(
  "/:id",
  validateRequest(updateProjectEndpointSchema),
  updateProjectController
);

router.delete(
  "/:id",
  validateRequest(deleteProjectEndpointSchema),
  deleteProjectController
);

export default router;
