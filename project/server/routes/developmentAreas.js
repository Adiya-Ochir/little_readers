import express from "express";
import { supabase } from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all development areas
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("development_areas")
      .select("*")
      .order("sort_order");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ developmentAreas: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single development area
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("development_areas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ error: "Development area not found" });
    }

    res.json({ developmentArea: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create development area
router.post("/", async (req, res) => {
  try {
    const developmentAreaData = {
      ...req.body,
      created_by: req.admin.id,
    };

    const { data, error } = await supabase
      .from("development_areas")
      .insert(developmentAreaData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: "Development area created successfully",
      developmentArea: data,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update development area
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("development_areas")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Development area updated successfully",
      developmentArea: data,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete development area
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("development_areas")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Development area deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
