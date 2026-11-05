import { beforeEach, afterEach, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { initialResources } from "../src/data/db.js";

// Conserver les données pour les restaurer entre les tests
const originalResources = initialResources.map(r => ({ ...r }));

function resetResources() {
  initialResources.splice(
    0,
    initialResources.length,
    ...originalResources.map(r => ({ ...r }))
  );
}

const validResource = {
  name: "Salle de test",
  category: "room",
  capacity: 20,
  location: "Bâtiment C",
  status: "available"
};

describe("Resources API", () => {
  beforeEach(resetResources);
  afterEach(resetResources);

  it("GET /api/resources renvoie les ressources", async () => {
    const res = await request(app).get("/api/resources");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(originalResources);
  });

  it("GET /api/resources/1 renvoie la bonne ressource", async () => {
    const res = await request(app).get("/api/resources/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(originalResources.find(r => r.id === 1));
  });

  it("POST crée une ressource et la rend consultable", async () => {
    const res = await request(app)
      .post("/api/resources")
      .send(validResource);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(validResource);
    expect(res.body.id).toEqual(expect.any(Number));
    expect(originalResources.some(r => r.id === res.body.id)).toBe(false);

    const saved = await request(app)
      .get(`/api/resources/${res.body.id}`);

    expect(saved.status).toBe(200);
    expect(saved.body).toEqual(res.body);
  });

  it("PUT modifie une ressource et conserve son identifiant", async () => {
    const updated = { ...validResource, capacity: 40 };

    const res = await request(app)
      .put("/api/resources/2")
      .send({ ...updated, id: 999 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...updated, id: 2 });

    const saved = await request(app).get("/api/resources/2");
    expect(saved.body).toEqual({ ...updated, id: 2 });
  });

  it("DELETE supprime une ressource", async () => {
    const res = await request(app).delete("/api/resources/4");

    expect(res.status).toBe(204);
    expect(res.text).toBe("");

    const deleted = await request(app).get("/api/resources/4");
    expect(deleted.status).toBe(404);

    const remaining = await request(app).get("/api/resources");
    expect(remaining.body).toHaveLength(originalResources.length - 1);
  });

  it.each(["get", "put", "delete"])(
    "%s renvoie 404 pour une ressource inexistante",
    async (method) => {
      const res = await request(app)[method]("/api/resources/999");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Resource not found" });
    }
  );

  it.each([
    ["post", "/api/resources"],
    ["put", "/api/resources/2"]
  ])("%s refuse les champs manquants", async (method, url) => {
    const res = await request(app)[method](url).send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it.each([0, -1, 1.5, "30"])(
    "POST refuse une capacité invalide : %s",
    async (capacity) => {
      const res = await request(app)
        .post("/api/resources")
        .send({ ...validResource, capacity });

      expect(res.status).toBe(400);
    }
  );
});