# Diet Meal Planner App

Application React Native (Expo) fournissant un plan de repas personnalisé pour la perte de poids à partir des données de santé de l'utilisateur. Le projet couvre l'onboarding complet, les calculs BMI/BMR/TDEE, la génération de plans conformes aux préférences alimentaires et la documentation imposée par le brief universitaire.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Formules de santé](#formules-de-santé)
- [Livrables hebdomadaires](#livrables-hebdomadaires)
- [Prise en main](#prise-en-main)
- [Scripts npm](#scripts-npm)
- [Qualité & Tests](#qualité--tests)
- [Données embarquées](#données-embarquées)
- [Choix techniques](#choix-techniques)
- [Limites connues](#limites-connues)
- [Gestion des assets binaires](#gestion-des-assets-binaires)
- [Ressources](#ressources)

## Fonctionnalités

- **Onboarding en 4 étapes** : collecte du profil (nom, sexe, âge, taille, poids), niveau d'activité, objectifs et préférences/allergènes.
- **Calculs de référence** : BMI avec catégories OMS, BMR (Mifflin–St Jeor), TDEE via facteur d'activité, cible calorique pour la perte de poids (déficit 20% borné à 1200/1500 kcal).
- **Répartition journalière & macros** : division par repas (10/25/35/30 %) et objectifs macros (30/40/30) modifiables dans les paramètres.
- **Catalogue offline** : 150+ aliments (`src/data/foods.json`) et gabarits de repas (`src/data/mealTemplates.json`) couvrant petit-déj, déjeuner, dîner, snacks, boissons avec tags/allergènes.
- **Planificateur intelligent** : filtre les repas compatibles, respecte ±10% de la cible calorique, gère les préférences (végan, sans gluten, etc.), suit la sélection des 4 repas, affiche les totaux dynamiques.
- **Ecran récapitulatif** : plan du jour partageable (stub Share API) et macros consolidées.
- **Gestion d’état persistante** : profils, paramètres (langue, thème, répartitions), dernier plan stockés en AsyncStorage via Zustand.
- **UI accessible** : composants React Native Paper, labels explicites, thèmes clair/sombre, i18n fr/en (fr par défaut).
- **Écran Home** : cartes synthétiques BMI/BMR/TDEE/objectif, progression hebdo (données simulées), CTA vers le planificateur.
- **Écran Foods** : recherche temps réel dans le catalogue, prêt pour l’ajout d’aliments personnalisés.
- **Écran Profile** : édition complète du profil, paramètres d’affichage, répartitions repas/macros, reset global.
- **CI GitHub Actions** : lint + typecheck + tests sur chaque push/PR.

## Structure du projet

```
diet-meal-planner-app/
├─ app.json
├─ package.json
├─ tsconfig.json
├─ babel.config.js
├─ .eslintrc.cjs
├─ .prettierrc
├─ .github/workflows/ci.yml
├─ assets/
│  ├─ icons/
│  └─ images/
├─ docs/
│  └─ wireframes.png (wireframe semaine 1)
├─ src/
│  ├─ App.tsx
│  ├─ navigation/
│  │  ├─ RootNavigator.tsx
│  │  ├─ MainTabs.tsx
│  │  └─ types.ts
│  ├─ screens/
│  │  ├─ HomeScreen.tsx
│  │  ├─ PlannerScreen.tsx
│  │  ├─ PlannerScreen/DailyPlanScreen.tsx
│  │  ├─ FoodsScreen.tsx
│  │  ├─ ProfileScreen.tsx
│  │  └─ Onboarding/
│  │     ├─ WelcomeStep.tsx
│  │     ├─ ProfileStep.tsx
│  │     ├─ GoalsStep.tsx
│  │     └─ SummaryStep.tsx
│  ├─ components/
│  │  ├─ Card.tsx
│  │  ├─ MacroBar.tsx
│  │  ├─ MealOptionCard.tsx
│  │  ├─ CaloriesSplitChart.tsx
│  │  └─ Form/
│  │     ├─ TextField.tsx
│  │     ├─ NumberField.tsx
│  │     └─ SelectField.tsx
│  ├─ stores/
│  │  ├─ userStore.ts
│  │  ├─ plannerStore.ts
│  │  └─ foodsStore.ts
│  ├─ services/
│  │  ├─ calc/
│  │  │  ├─ bmi.ts
│  │  │  ├─ bmr.ts
│  │  │  ├─ tdee.ts
│  │  │  ├─ targetCalories.ts
│  │  │  └─ macros.ts
│  │  ├─ storage.ts
│  │  └─ analytics.ts
│  ├─ data/
│  │  ├─ foods.json
│  │  └─ mealTemplates.json
│  ├─ i18n/
│  │  ├─ index.ts
│  │  ├─ fr.json
│  │  └─ en.json
│  ├─ theme/
│  │  ├─ index.ts
│  │  └─ paperTheme.ts
│  ├─ utils/
│  │  ├─ format.ts
│  │  ├─ units.ts
│  │  └─ validation.ts
│  └─ __tests__/
│     ├─ bmi.test.ts
│     ├─ bmr.test.ts
│     ├─ targetCalories.test.ts
│     ├─ macros.test.ts
│     └─ screens.test.tsx
└─ docs/wireframes.png
```

## Formules de santé

- **BMI** : `BMI = poids_kg / (taille_m²)` — catégories OMS (insuffisance < 18.5, normal < 25, surpoids < 30, obésité ≥ 30).
- **BMR (Mifflin–St Jeor)** :
  - Homme : `BMR = 10 * poids + 6.25 * taille - 5 * âge + 5`
  - Femme : `BMR = 10 * poids + 6.25 * taille - 5 * âge - 161`
  - Autre : moyenne homme/femme.
- **Facteurs d’activité** : 1.2 (sédentaire), 1.375 (léger), 1.55 (modéré), 1.725 (élevé), 1.9 (très élevé).
- **TDEE** : `TDEE = BMR × facteur activité`.
- **Cible perte de poids** : déficit 20% `max(TDEE × 0.8, plancher sexe, 1000 kcal)` avec plancher 1200 kcal (femme) / 1500 kcal (homme).
- **Macros** : 30% protéines, 40% glucides, 30% lipides → conversion 4/4/9 kcal.g⁻¹.
- **Répartition repas** : Snack 10%, Petit-déj 25%, Déjeuner 35%, Dîner 30% (modifiable dans les paramètres).

## Livrables hebdomadaires

| Semaine | Livrables | Statut |
| --- | --- | --- |
| S1 (3 nov) | Wireframe (`docs/wireframes.png`), documentation formules, board Trello (placeholder) | ✅ |
| S2 (10 nov) | Onboarding de base avec saisie utilisateur | ✅ |
| S3 (17 nov) | Options petit-déj & déjeuner, sélection repas, plan final | ✅ |
| S4 (25 nov) | Calories visibles, 4 repas, tests unitaires/intégration | ✅ |

## Prise en main

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer Expo en mode développement :
   ```bash
   npm run start
   ```
3. Cible Android : `npm run android`
4. Cible iOS : `npm run ios`
5. Version web (expo web) : `npm run web`

> **Note packaging** : pour la remise finale, compressez le dossier `src/` (composants + assets embarqués) comme demandé dans le brief.

## Scripts npm

| Commande | Description |
| --- | --- |
| `npm run start` | Démarre Expo Metro bundler |
| `npm run android` | Build & lance sur Android (Expo) |
| `npm run ios` | Build & lance sur iOS (Expo) |
| `npm run web` | Démarre Expo pour navigateur |
| `npm run lint` | ESLint avec configuration TypeScript/React Native |
| `npm run typecheck` | `tsc --noEmit` en mode strict |
| `npm run test` | Jest + React Native Testing Library |
| `npm run test:ci` | Tests en mode CI |

## Qualité & Tests

- **TypeScript strict** (`strict: true`) : aucun `any` implicite.
- **ESLint + Prettier** : respect des conventions, ordre d’imports, hooks.
- **Jest** :
  - Tests unitaires pour `bmi`, `bmr`, `targetCalories`, `macros`.
  - Test d’intégration `screens.test.tsx` couvrant la génération et la finalisation d’un plan dans `PlannerScreen`.
- **CI GitHub Actions** : exécute `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:ci` sur chaque push/PR.

## Données embarquées

- `foods.json` : 150+ aliments (portion, kcal, macros, tags, allergènes) couvrant petit-déjeuner, déjeuner, dîner, snacks, boissons.
- `mealTemplates.json` : >10 templates par repas avec macros et étiquettes (High Protein, Low Carb, Budget, Quick).
- Toutes les données sont *offline-first*, aucune requête réseau nécessaire.

## Choix techniques

- **Expo SDK 54 + React Native 0.81** pour compatibilité large.
- **Navigation** : `@react-navigation/native` + `native-stack` + `bottom-tabs` (onglets Home / Planner / Foods / Profile).
- **État** : Zustand (`userStore`, `plannerStore`, `foodsStore`) avec persistance AsyncStorage.
- **Formulaires** : `react-hook-form` + `zod` pour validation immédiate, composants réutilisables (`TextField`, `NumberField`, `SelectField`).
- **UI** : React Native Paper (thèmes clair/sombre, composants accessibles).
- **i18n** : `react-i18next` (fr/en). Bascule dans l’écran Profil.
- **Tests** : Jest + React Native Testing Library (composants et intégration). Mock analytics (console).
- **Accessibilité** : labels explicites, rôle ARIA (`accessibilityRole="header"`), boutons accessibles, contrastes respectés.

## Limites connues

- Valeurs nutritionnelles estimées (source "est."), non destinées à un suivi médical.
- L’export PDF n’est pas implémenté (utilisation de `Share` stub texte).
- Le catalogue permet d’ajouter des aliments custom via le store mais l’UI d’ajout n’est pas encore exposée.
- Les préférences « sans porc/bœuf » utilisent la détection par titre; un enrichissement des métadonnées serait préférable.

## Gestion des assets binaires

Les images de wireframes et d’icônes (`assets/images/**`, `docs/wireframes.png`) ne sont pas intégrées automatiquement dans les Pull Requests générées par l’outil, afin d’éviter les erreurs « Les fichiers binaires ne sont pas pris en charge ». Pour ajouter ou mettre à jour ces visuels :

1. Poussez le code texte dans la branche (sans les binaires).
2. Depuis l’interface GitHub, ouvrez la branche de la PR et utilisez **Add file → Upload files** pour téléverser les images dans `assets/images/` ou `docs/wireframes.png`.
3. Validez le commit directement sur GitHub afin de compléter la PR avec les assets.

## Ressources

- [Calorie Calculator (BMR/TDEE)](https://www.calculator.net/calorie-calculator.html)
- [Guide calories NHS London](https://www.healthylondon.org/resource/how-many-calories-are-in-this/)
- Board Trello (placeholder) : `https://trello.com/b/example` (mettre à jour avec votre board réel).

Bon développement !
