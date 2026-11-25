import { beforeEach, afterEach, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { initialUsers } from "../src/data/db.js";

const originalUsers = initialUsers.map((u) => ({ ...u }));

function resetUsers() {
  initialUsers.splice(
    0,
    initialUsers.length,
    ...originalUsers.map((u) => ({ ...u }))
  );
}

describe("Users API (/api/users) - SCRUM-53", () => {
  beforeEach(resetUsers);
  afterEach(resetUsers);

  // US-01: SCRUM-54
  it("GET /api/users returns array of users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(originalUsers.length);
  });

  // US-02: SCRUM-55
  it("GET /api/users/:id returns a user when found", async () => {
    const res = await request(app).get("/api/users/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("email");
  });

  it("GET /api/users/:id returns 404 when not found", async () => {
    const res = await request(app).get("/api/users/9999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  // US-03: SCRUM-56
  it("POST /api/users creates a new user with defaults", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ name: "Alice Martin", email: "alice@edu.devinci.fr" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.role).toBe("student");
    expect(res.body.status).toBe("active");
  });

  it("POST /api/users returns 400 when name or email is missing", async () => {
    const res = await request(app).post("/api/users").send({ name: "Alice" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // US-04: SCRUM-57
  it("PUT /api/users/:id updates user details", async () => {
    const res = await request(app)
      .put("/api/users/3")
      .send({ role: "manager", status: "inactive" });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(3);
    expect(res.body.role).toBe("manager");
    expect(res.body.status).toBe("inactive");
  });

  // US-05: SCRUM-58
  it("DELETE /api/users/:id deletes a user", async () => {
    const res = await request(app).delete("/api/users/4");
    expect(res.status).toBe(204);

    const checkRes = await request(app).get("/api/users/4");
    expect(checkRes.status).toBe(404);
  });
});
