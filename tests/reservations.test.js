import { beforeEach, afterEach, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { initialReservations } from "../src/data/db.js";

const originalReservations = initialReservations.map((r) => ({ ...r }));

function resetReservations() {
  initialReservations.splice(
    0,
    initialReservations.length,
    ...originalReservations.map((r) => ({ ...r }))
  );
}

describe("Reservations API (/api/reservations) - SCRUM-36", () => {
  beforeEach(resetReservations);
  afterEach(resetReservations);

  // US-01: SCRUM-38
  it("GET /api/reservations returns array of reservations", async () => {
    const res = await request(app).get("/api/reservations");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(originalReservations.length);
  });

  // US-02: SCRUM-43
  it("GET /api/reservations/:id returns a reservation when found", async () => {
    const res = await request(app).get("/api/reservations/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("resourceId");
  });

  it("GET /api/reservations/:id returns 404 when not found", async () => {
    const res = await request(app).get("/api/reservations/9999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  // US-03: SCRUM-44
  it("POST /api/reservations creates a reservation with default pending status", async () => {
    const res = await request(app).post("/api/reservations").send({
      userId: 3,
      resourceId: 1,
      startTime: "2026-11-26T09:00:00Z",
      endTime: "2026-11-26T11:00:00Z"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.status).toBe("pending");
  });

  it("POST /api/reservations returns 400 when fields are missing", async () => {
    const res = await request(app).post("/api/reservations").send({ userId: 3 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/reservations returns 400 when dates are invalid or endTime <= startTime", async () => {
    const resInvalidDate = await request(app).post("/api/reservations").send({
      userId: 3,
      resourceId: 1,
      startTime: "not-a-date",
      endTime: "2026-11-26T11:00:00Z"
    });
    expect(resInvalidDate.status).toBe(400);

    const resReversed = await request(app).post("/api/reservations").send({
      userId: 3,
      resourceId: 1,
      startTime: "2026-11-26T12:00:00Z",
      endTime: "2026-11-26T10:00:00Z"
    });
    expect(resReversed.status).toBe(400);
  });

  // US-04: SCRUM-45
  it("PUT /api/reservations/:id updates reservation status", async () => {
    const res = await request(app)
      .put("/api/reservations/2")
      .send({ status: "confirmed" });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(2);
    expect(res.body.status).toBe("confirmed");
  });

  it("PUT /api/reservations/:id returns 400 on invalid time range", async () => {
    const res = await request(app).put("/api/reservations/1").send({
      startTime: "2026-11-10T18:00:00Z",
      endTime: "2026-11-10T16:00:00Z"
    });
    expect(res.status).toBe(400);
  });

  // US-05: SCRUM-46
  it("DELETE /api/reservations/:id deletes a reservation", async () => {
    const res = await request(app).delete("/api/reservations/2");
    expect(res.status).toBe(204);

    const checkRes = await request(app).get("/api/reservations/2");
    expect(checkRes.status).toBe(404);
  });
});
