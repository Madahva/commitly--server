import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createProjectController } from "../controllers/project/createProject.controller";
import { createProjectEndpointSchema } from "../schemas/project.schema";

const router = Router();

router.post(
  "/",
  validateRequest(createProjectEndpointSchema),
  createProjectController
);

export default router;
