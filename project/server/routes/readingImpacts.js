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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const { error } = await supabase
      .from("reading_impacts")
      .update({ title, description })
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ message: "Амжилттай засагдлаа" });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

export default router;
