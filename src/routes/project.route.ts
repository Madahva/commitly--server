import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createProjectController } from "../controllers/projects/createProject.controller";
import { getProjectController } from "../controllers/projects/getProject.controller";
import { updateProjectController } from "../controllers/projects/updateProject.controller";
import { deleteProjectController } from "../controllers/projects/deleteProject.controller";
import { getAllProjectsController } from "../controllers/projects/getAllProjects.controller";
import {
  createProjectEndpointSchema,
  getProjectEndpointSchema,
  updateProjectEndpointSchema,
  deleteProjectEndpointSchema,
  listProjectsEndpointSchema,
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

router.get(
  "/",
  validateRequest(listProjectsEndpointSchema),
  getAllProjectsController
);

export default router;
