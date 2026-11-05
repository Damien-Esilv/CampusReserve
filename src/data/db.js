// Base de données simple en mémoire

// src/data/db.js
// Données initiales pour le projet CampusReserve
// Ces données servent de référence pour les entités du projet.
export const initialUsers = [
  { id: 1, name: "Damien Catau", email: "damien@edu.devinci.fr", role: "admin", status: "active" },
  { id: 2, name: "Emilie Arrive", email: "emilie@edu.devinci.fr", role: "manager", status: "active" },
  { id: 3, name: "Barthelemi Stoltz", email: "barthelemi@edu.devinci.fr", role: "student", status: "active" },
  { id: 4, name: "Baptiste Watier", email: "baptiste@edu.devinci.fr", role: "teacher", status: "active" }
];
export const initialResources = [
  { id: 1, name: "Amphithéâtre A", category: "room", capacity: 150, location: "Bâtiment A - RDC", status: "available" },
  { id: 2, name: "Salle TD 204", category: "room", capacity: 35, location: "Bâtiment B - 2ème étage", status: "available" },
  { id: 3, name: "Vidéoprojecteur HD-1", category: "equipment", capacity: 1, location: "Accueil matériel", status: "available" },
  { id: 4, name: "Casque VR Oculus 3", category: "equipment", capacity: 1, location: "Lab Innovation", status: "available" }
];
export const initialReservations = [
  { id: 1, userId: 3, resourceId: 2, startTime: "2026-11-10T14:00:00Z", endTime: "2026-11-10T16:00:00Z", status: "confirmed" },
  { id: 2, userId: 4, resourceId: 1, startTime: "2026-11-12T09:00:00Z", endTime: "2026-11-12T12:00:00Z", status: "pending" }
];
export const initialLoans = [
  { id: 1, reservationId: 1, managerId: 2, pickupTime: "2026-11-10T13:55:00Z", returnTime: "2026-11-10T16:05:00Z", condition: "intact", status: "returned" },
  { id: 2, reservationId: 2, managerId: 2, pickupTime: "2026-11-12T08:50:00Z", returnTime: null, condition: null, status: "checked_out" }
];
