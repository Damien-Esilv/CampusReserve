import express from "express";
import usersRouter from "./routes/users.routes.js";
import resourcesRouter from "./routes/resources.routes.js";
import reservationsRouter from "./routes/reservations.routes.js";
import loansRouter from "./routes/loans.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/loans", loansRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
