# CampusReserve - REST APIs (Lab 6)

## 1. Démarrage
```bash
npm install
npm run dev     # Mode développement (redémarrage auto lors des modifications)
npm start       # Mode normal (http://localhost:3000)
npm test        # Lance les tests
```

## 2. Répartition des entités (1 par membre)
- **Users** : `src/routes/users.routes.js` & `tests/users.test.js`
- **Resources** : `src/routes/resources.routes.js` & `tests/resources.test.js`
- **Reservations** : `src/routes/reservations.routes.js` & `tests/reservations.test.js`
- **Loans** : `src/routes/loans.routes.js` & `tests/loans.test.js`

Données partagées en mémoire dans `src/data/db.js`.

## 3. Les 5 routes CRUD à implémenter par chacun
- `GET /api/<entity>` (liste tout)
- `GET /api/<entity>/:id` (détail)
- `POST /api/<entity>` (créer)
- `PUT /api/<entity>/:id` (modifier)
- `DELETE /api/<entity>/:id` (supprimer)

## 4. Git workflow
1. `git checkout -b feature/<votre-entite>`
2. Coder son CRUD et ses tests
3. `npm test`
4. `git commit` & `git push`
5. Ouvrir une Pull Request
