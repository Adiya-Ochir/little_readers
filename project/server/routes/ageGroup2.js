import express from "express";
import { supabase } from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

// Update age group2 by id
router.put("/age-group2/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("age_group2")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Насны бүлгийн мэдээлэл амжилттай шинэчлэгдлээ",
      ageGroup: data,
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Сервер дээр алдаа гарлаа" });
  }
});

export default router;
