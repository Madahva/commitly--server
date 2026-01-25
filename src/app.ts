import express from "express";
import cors from "cors";
import routes from "./routes";
import helmet from "helmet";

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/api", routes);
