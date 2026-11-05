import express from "express";
import { initialLoans } from "../data/db.js";

const router = express.Router();

let currentLoans = [...initialLoans];

// US-01 (SCRUM-37): List all equipment loans
// GET /api/loans
router.get("/", (req, res) => {
  res.status(200).json(currentLoans);
});

// US-02 (SCRUM-39): Retrieve a loan by ID
// GET /api/loans/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const loan = currentLoans.find((l) => l.id === id);

  if (!loan) {
    return res.status(404).json({ error: "Loan not found" });
  }

  res.status(200).json(loan);
});

// US-03 (SCRUM-40): Register a new loan (Check-Out)
// POST /api/loans
router.post("/", (req, res) => {
  const { reservationId, managerId, pickupTime, returnTime, condition, status } = req.body;

  if (!reservationId || !pickupTime) {
    return res.status(400).json({
      error: "Missing required fields: reservationId and pickupTime are required"
    });
  }

  const nextId = currentLoans.length > 0 ? Math.max(...currentLoans.map((l) => l.id)) + 1 : 1;
  const newLoan = {
    id: nextId,
    reservationId: Number(reservationId),
    managerId: managerId ? Number(managerId) : null,
    pickupTime,
    returnTime: returnTime || null,
    condition: condition || "intact",
    status: status || "checked_out"
  };

  currentLoans.push(newLoan);
  res.status(201).json(newLoan);
});

// US-04 (SCRUM-41): Update loan status (Return / Check-In)
// PUT /api/loans/:id
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = currentLoans.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Loan not found" });
  }

  currentLoans[index] = { ...currentLoans[index], ...req.body, id };
  res.status(200).json(currentLoans[index]);
});

// US-05 (SCRUM-42): Delete a loan record
// DELETE /api/loans/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const countBefore = currentLoans.length;

  currentLoans = currentLoans.filter((l) => l.id !== id);

  if (currentLoans.length === countBefore) {
    return res.status(404).json({ error: "Loan not found" });
  }

  res.status(204).end();
});

export default router;
