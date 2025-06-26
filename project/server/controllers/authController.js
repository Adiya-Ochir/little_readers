import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find admin by email
    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove password from response
    const { password_hash, ...adminData } = admin;

    res.json({
      message: "Login successful",
      token,
      admin: adminData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    // req.admin is set by authenticateToken middleware
    const { password_hash, ...adminData } = req.admin;
    res.json({ admin: adminData });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const adminId = req.admin.id;

    const { data, error } = await supabase
      .from("admins")
      .update({ name, email })
      .eq("id", adminId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { password_hash, ...adminData } = data;
    res.json({
      message: "Profile updated successfully",
      admin: adminData,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new passwords are required" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      req.admin.password_hash
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const { error } = await supabase
      .from("admins")
      .update({ password_hash: hashedPassword })
      .eq("id", adminId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
