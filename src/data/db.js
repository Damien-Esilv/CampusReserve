// Base de données simple en mémoire
export let users = [
  { id: 1, name: "Damien", role: "student" },
  { id: 2, name: "Emilie", role: "manager" }
];

export let resources = [
  { id: 1, name: "Salle A101", type: "room" },
  { id: 2, name: "Projecteur", type: "equipment" }
];

export let reservations = [
  { id: 1, userId: 1, resourceId: 1, date: "2026-11-10" }
];

export let loans = [
  { id: 1, resourceId: 2, userId: 1, status: "borrowed" }
];
