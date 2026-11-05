import express from "express";
import { initialResources } from "../data/db.js";

const router = express.Router();

// GET /api/resources
router.get("/", (req, res) => {
  res.status(200).json(initialResources);
});

// GET /api/resources/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const resource = initialResources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ error: "Resource not found" });
  }

  res.status(200).json(resource);
});

// POST /api/resources
router.post("/", (req, res) => {
  const { name, category, capacity, location, status } = req.body ?? {};

  if (
    typeof name !== "string" || !name.trim() ||
    typeof category !== "string" || !category.trim() ||
    !Number.isInteger(capacity) || capacity <= 0 ||
    typeof location !== "string" || !location.trim() ||
    typeof status !== "string" || !status.trim()
  ) {
    return res.status(400).json({
      error: "Name, category, location and status are required; capacity must be a positive integer"
    });
  }

  const newResource = {
    id: Math.max(0, ...initialResources.map(r => r.id)) + 1,
    name: name.trim(),
    category: category.trim(),
    capacity,
    location: location.trim(),
    status: status.trim()
  };

  initialResources.push(newResource);

  res.status(201).json(newResource);
});

// PUT /api/resources/:id
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const resource = initialResources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ error: "Resource not found" });
  }

  const { name, category, capacity, location, status } = req.body ?? {};

  if (
    typeof name !== "string" || !name.trim() ||
    typeof category !== "string" || !category.trim() ||
    !Number.isInteger(capacity) || capacity <= 0 ||
    typeof location !== "string" || !location.trim() ||
    typeof status !== "string" || !status.trim()
  ) {
    return res.status(400).json({
      error: "Name, category, location and status are required; capacity must be a positive integer"
    });
  }

  Object.assign(resource, {
    name: name.trim(),
    category: category.trim(),
    capacity,
    location: location.trim(),
    status: status.trim()
  });

  res.status(200).json(resource);
});

// DELETE /api/resources/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = initialResources.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Resource not found" });
  }

  initialResources.splice(index, 1);

  res.status(204).end();
});

export default router;