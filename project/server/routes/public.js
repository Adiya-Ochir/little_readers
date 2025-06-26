import express from "express";
import { supabase } from "../config/database.js";

const router = express.Router();

// Public routes for frontend (no authentication required)
router.get("/development/all", async (req, res) => {
  try {
    const [areas, ages, impacts] = await Promise.all([
      supabase
        .from("development_areas")
        .select("*") // ← заавал тодорхой заа
        .eq("is_active", true)
        .order("created_at", { ascending: true }),

      supabase
        .from("age_groups")
        .select("*") // ← validate field names
        .eq("is_active", true)
        .order("min_age", { ascending: true }),

      supabase
        .from("reading_impacts")
        .select("*")
        .order("created_at", { ascending: true }),
    ]);

    // Check for any individual error
    if (areas.error || ages.error || impacts.error) {
      return res.status(500).json({
        error:
          areas.error?.message ||
          ages.error?.message ||
          impacts.error?.message ||
          "Алдаа гарлаа.",
      });
    }

    return res.json({
      developmentAreas: areas.data || [],
      ageGroups: ages.data || [],
      readingImpacts: impacts.data || [],
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ error: "Хөгжлийн мэдээлэл татаж чадсангүй" });
  }
});

// Get all active books
router.get("/books", async (req, res) => {
  try {
    const { category, age, search, featured } = req.query;

    let query = supabase
      .from("books")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (age && age !== "all") {
      query = query.ilike("age", `%${age}%`);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,author.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ books: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all active categories
router.get("/categories", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("label");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ categories: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all active age groups
router.get("/age-groups", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("age_groups")
      .select("*")
      .eq("is_active", true)
      .order("min_age");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ ageGroups: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all active development areas
router.get("/development-areas", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("development_areas")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ developmentAreas: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all active reading tips
router.get("/reading-tips", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reading_tips")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ readingTips: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all active resources
router.get("/resources", async (req, res) => {
  try {
    const { type, category } = req.query;

    let query = supabase
      .from("resources")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (type) {
      query = query.eq("type", type);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ resources: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🟩 Public GET /api/public/reading-impacts
router.get("/reading-impacts", async (req, res) => {
  const { data, error } = await supabase.from("reading_impacts").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json({ readingImpacts: data });
});

export default router;
