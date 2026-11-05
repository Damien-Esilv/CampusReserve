import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Loans API (/api/loans) - SCRUM-35", () => {
  // US-01: SCRUM-37
  it("GET /api/loans returns array of loans", async () => {
    const res = await request(app).get("/api/loans");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // US-02: SCRUM-39
  it("GET /api/loans/:id returns a loan when found", async () => {
    const res = await request(app).get("/api/loans/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("reservationId");
  });

  it("GET /api/loans/:id returns 404 when not found", async () => {
    const res = await request(app).get("/api/loans/9999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  // US-03: SCRUM-40
  it("POST /api/loans creates a new loan", async () => {
    const newLoan = {
      reservationId: 1,
      pickupTime: "2026-11-15T10:00:00Z"
    };
    const res = await request(app).post("/api/loans").send(newLoan);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.status).toBe("checked_out");
  });

  it("POST /api/loans returns 400 when missing required fields", async () => {
    const res = await request(app).post("/api/loans").send({ managerId: 2 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // US-04: SCRUM-41
  it("PUT /api/loans/:id updates loan status", async () => {
    const res = await request(app)
      .put("/api/loans/1")
      .send({ status: "returned", condition: "intact" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("returned");
    expect(res.body.condition).toBe("intact");
  });

  // US-05: SCRUM-42
  it("DELETE /api/loans/:id deletes a loan", async () => {
    const res = await request(app).delete("/api/loans/1");
    expect(res.status).toBe(204);

    const checkRes = await request(app).get("/api/loans/1");
    expect(checkRes.status).toBe(404);
  });
});
