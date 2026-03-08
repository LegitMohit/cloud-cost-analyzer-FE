import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", routes);

// Error Handling
app.use(errorHandler);

// Root path
app.get("/", (req, res) => {
    res.json({ message: "Cloud Cost Analyzer API is running!" });
});

app.listen(PORT, () => {
    console.log(`[server]: API Server is running at http://localhost:${PORT}`);
});

export default app;
