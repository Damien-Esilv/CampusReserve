import express from "express";
import { initialReservations } from "../data/db.js";

const router = express.Router();

function isValidTimeWindow(startTime, endTime) {
  if (typeof startTime !== "string" || typeof endTime !== "string") {
    return false;
  }
  const start = Date.parse(startTime);
  const end = Date.parse(endTime);
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return false;
  }
  return end > start;
}

// US-01 (SCRUM-38): View all reservations
// GET /api/reservations
router.get("/", (req, res) => {
  res.status(200).json(initialReservations);
});

// US-02 (SCRUM-43): View single reservation details
// GET /api/reservations/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const reservation = initialReservations.find((r) => r.id === id);

  if (!reservation) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  res.status(200).json(reservation);
});

// US-03 (SCRUM-44): Create a new reservation
// POST /api/reservations
router.post("/", (req, res) => {
  const { userId, resourceId, startTime, endTime, status } = req.body ?? {};

  if (!userId || !resourceId || !startTime || !endTime) {
    return res.status(400).json({
      error: "Missing required fields: userId, resourceId, startTime and endTime are required"
    });
  }

  if (!isValidTimeWindow(startTime, endTime)) {
    return res.status(400).json({
      error: "Invalid date range: startTime and endTime must be valid dates with endTime after startTime"
    });
  }

  const nextId = initialReservations.length > 0 ? Math.max(...initialReservations.map((r) => r.id)) + 1 : 1;
  const newReservation = {
    id: nextId,
    userId: Number(userId),
    resourceId: Number(resourceId),
    startTime,
    endTime,
    status: typeof status === "string" && status.trim() ? status.trim() : "pending"
  };

  initialReservations.push(newReservation);
  res.status(201).json(newReservation);
});

// US-04 (SCRUM-45): Update a reservation
// PUT /api/reservations/:id
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = initialReservations.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  const existing = initialReservations[index];
  const { userId, resourceId, startTime, endTime, status } = req.body ?? {};
  const nextStart = startTime ?? existing.startTime;
  const nextEnd = endTime ?? existing.endTime;

  if (!isValidTimeWindow(nextStart, nextEnd)) {
    return res.status(400).json({
      error: "Invalid date range: endTime must be after startTime"
    });
  }

  initialReservations[index] = {
    ...existing,
    userId: userId !== undefined ? Number(userId) : existing.userId,
    resourceId: resourceId !== undefined ? Number(resourceId) : existing.resourceId,
    startTime: nextStart,
    endTime: nextEnd,
    status: typeof status === "string" && status.trim() ? status.trim() : existing.status,
    id
  };

  res.status(200).json(initialReservations[index]);
});

// US-05 (SCRUM-46): Delete a reservation
// DELETE /api/reservations/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = initialReservations.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  initialReservations.splice(index, 1);
  res.status(204).end();
});

export default router;
