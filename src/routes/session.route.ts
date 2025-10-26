import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createSessionController } from "../controllers/sessions/createSession.controller";
import { getSessionController } from "../controllers/sessions/getSession.controller";
import {
  createSessionEndpointSchema,
  getSessionEndpointSchema,
} from "../schemas/session.schema";

const router = Router();

router.post(
  "/",
  validateRequest(createSessionEndpointSchema),
  createSessionController
);

router.get(
  "/:id",
  validateRequest(getSessionEndpointSchema),
  getSessionController
);

export default router;
