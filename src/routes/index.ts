import { Router } from "express";

import { checkJwt } from "../middlewares/auth0.middleware";

import userRoutes from "./user.route";
import projectRoutes from "./project.route";
import sessionRoutes from "./session.route";
import projectGoalsRoutes from "./projectGoal.route";
import sessionGoalRoutes from "./sessionGoal.route";

const router = Router();

router.use(checkJwt);

router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/sessions", sessionRoutes);
router.use("/projectGoals", projectGoalsRoutes);
router.use("/sessionGoals", sessionGoalRoutes);

export default router;
