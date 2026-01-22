import { Router } from "express";

import { verifySessionOwnership } from "../middlewares/verifySessionOwnership.middleware";
import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createSessionController } from "../controllers/sessions/createSession.controller";
import { getSessionController } from "../controllers/sessions/getSession.controller";
import { updateSessionController } from "../controllers/sessions/updateSession.controller";
import { deleteSessionController } from "../controllers/sessions/deleteSession.controller";
import { getAllSessionsController } from "../controllers/sessions/getAllSessions.controller";
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
  getAllSessionsController
);

router.get(
  "/:id",
  validateRequest(getSessionEndpointSchema),
  verifySessionOwnership,
  getSessionController
);

router.put(
  "/:id",
  validateRequest(updateSessionEndpointSchema),
  verifySessionOwnership,
  updateSessionController
);

router.delete(
  "/:id",
  validateRequest(deleteSessionEndpointSchema),
  verifySessionOwnership,
  deleteSessionController
);

export default router;
