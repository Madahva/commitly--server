import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createSessionController } from "../controllers/sessions/createSession.controller";
import { getSessionController } from "../controllers/sessions/getSession.controller";
import { updateSessionController } from "../controllers/sessions/updateSession.controller";
import { deleteSessionController } from "../controllers/sessions/deleteSession.controller";
import { getProjectSessionsController } from "../controllers/sessions/getProjectSessions.controller";
import {
  createSessionEndpointSchema,
  getSessionEndpointSchema,
  updateSessionEndpointSchema,
  deleteSessionEndpointSchema,
  listSessionsEndpointSchema,
} from "../schemas/session.schema";

const router = Router();

router.post(
  "/",
  validateRequest(createSessionEndpointSchema),
  createSessionController
);

router.get(
  "/",
  validateRequest(listSessionsEndpointSchema),
  getProjectSessionsController
);

router.get(
  "/:id",
  validateRequest(getSessionEndpointSchema),
  getSessionController
);

router.put(
  "/:id",
  validateRequest(updateSessionEndpointSchema),
  updateSessionController
);

router.delete(
  "/:id",
  validateRequest(deleteSessionEndpointSchema),
  deleteSessionController
);

export default router;
