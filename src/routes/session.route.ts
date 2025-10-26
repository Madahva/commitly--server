import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequestSchema.middleware";
import { createSessionController } from "../controllers/sessions/createSession.controller";
import { createSessionEndpointSchema } from "../schemas/session.schema";

const router = Router();

router.post(
  "/",
  validateRequest(createSessionEndpointSchema),
  createSessionController
);

export default router;
