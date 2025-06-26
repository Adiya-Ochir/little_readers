import express from "express";
import { supabase } from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateToken);

// GET /api/reading-impacts
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("reading_impacts").select("*");

    if (error) return res.status(400).json({ error: error.message });
    res.json({ readingImpacts: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
