import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import booksRoutes from "./routes/books.js";
import categoriesRoutes from "./routes/categories.js";
import ageGroupsRoutes from "./routes/ageGroups.js";
import developmentAreasRoutes from "./routes/developmentAreas.js";
import readingTipsRoutes from "./routes/readingTips.js";
import resourcesRoutes from "./routes/resources.js";
import adminsRoutes from "./routes/admins.js";
import publicRoutes from "./routes/public.js";
import ageGroup2 from "./routes/ageGroup2.js";
import readingImpactsRoutes from "./routes/readingImpacts.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "https://little-readers.vercel.app",
      "https://little-readers-3kh7819gw-adiyaochirs-projects.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/age-groups", ageGroupsRoutes);
app.use("/api/development-areas", developmentAreasRoutes);
app.use("/api/reading-tips", readingTipsRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api/public", publicRoutes);
app.use("/api", ageGroup2);
app.use("/api/reading-impacts", readingImpactsRoutes);
// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard available at http://localhost:${PORT}/dashboard`);
});

export default app;
