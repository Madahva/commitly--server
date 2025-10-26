import { Router } from "express";

import userRoutes from "./user.route";
import projectRoutes from "./project.route";
import sessionRoutes from "./session.route";

const router = Router();

router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/sessions", sessionRoutes);

export default router;
