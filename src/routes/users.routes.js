import express from "express";
import { initialUsers } from "../data/db.js";

const router = express.Router();

// US-01 (SCRUM-54): View all users
// GET /api/users
router.get("/", (req, res) => {
  res.status(200).json(initialUsers);
});

// US-02 (SCRUM-55): View single user details
// GET /api/users/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = initialUsers.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
});

// US-03 (SCRUM-56): Create a new user
// POST /api/users
router.post("/", (req, res) => {
  const { name, email, role, status } = req.body ?? {};

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim()
  ) {
    return res.status(400).json({
      error: "Missing required fields: name and email are required"
    });
  }

  const nextId = initialUsers.length > 0 ? Math.max(...initialUsers.map((u) => u.id)) + 1 : 1;
  const newUser = {
    id: nextId,
    name: name.trim(),
    email: email.trim(),
    role: typeof role === "string" && role.trim() ? role.trim() : "student",
    status: typeof status === "string" && status.trim() ? status.trim() : "active"
  };

  initialUsers.push(newUser);
  res.status(201).json(newUser);
});

// US-04 (SCRUM-57): Update a user
// PUT /api/users/:id
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = initialUsers.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const { name, email, role, status } = req.body ?? {};
  if (
    (name !== undefined && (typeof name !== "string" || !name.trim())) ||
    (email !== undefined && (typeof email !== "string" || !email.trim()))
  ) {
    return res.status(400).json({ error: "name and email must be non-empty strings" });
  }

  const existing = initialUsers[index];
  initialUsers[index] = {
    ...existing,
    name: name !== undefined ? name.trim() : existing.name,
    email: email !== undefined ? email.trim() : existing.email,
    role: typeof role === "string" && role.trim() ? role.trim() : existing.role,
    status: typeof status === "string" && status.trim() ? status.trim() : existing.status,
    id
  };

  res.status(200).json(initialUsers[index]);
});

// US-05 (SCRUM-58): Delete a user
// DELETE /api/users/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = initialUsers.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  initialUsers.splice(index, 1);
  res.status(204).end();
});

export default router;
