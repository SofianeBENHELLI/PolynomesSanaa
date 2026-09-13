# Parabole — Atelier interactif

Mini-site pédagogique en français pour explorer les polynômes du second degré : **f(x) = ax² + bx + c**, avec **a ≠ 0**.

## Utilisation

- Modifier a, b et c avec les curseurs ou les champs numériques.
- Passer à l’onglet Sommet pour manipuler la forme canonique a(x − h)² + k.
- Glisser la courbe ou le sommet pour déplacer la parabole ; les coefficients et les formules suivent automatiquement.
- Déplier les formes canonique et factorisée pour afficher le sommet, les racines et le discriminant.
- Utiliser les boutons de zoom, de recentrage et de réinitialisation.

Le cas a = 0 est expliqué dans l’interface. Les valeurs affichées sont arrondies à quatre décimales ; les calculs conservent la précision des nombres JavaScript.

## Lancer localement

Aucune installation nécessaire. Ouvrir `dist/index.html` dans un navigateur, ou démarrer un serveur statique :

```sh
python3 -m http.server 8765 --directory dist
```

Ouvrir ensuite http://localhost:8765.

## Fichiers

- `dist/index.html` : interface et contenu pédagogique.
- `dist/style.css` : mise en page responsive.
- `dist/app.js` : calculs, tracé SVG et interactions.

Le site fonctionne sans serveur applicatif. Les polices Google Fonts sont facultatives : des polices de remplacement sont prévues.
