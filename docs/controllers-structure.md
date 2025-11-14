# Struttura dei Controllers ipotesi


1. ## authController.ts (Già ben avviato)
Questo controller si occupa di tutto ciò che riguarda l'autenticazione.

Modelli Prisma correlati: users, UserRole
Funzioni comuni:

register(req, res): Crea un nuovo utente.

login(req, res): Autentica l'utente e restituisce un JWT.

logout(req, res): Invalida il token (se gestisci blacklist o refresh token).

forgotPassword(req, res): Inizia il flusso di reset password.

resetPassword(req, res): Completa il reset password.

verifyEmail(req, res): Gestisce la verifica dell'indirizzo email.

refreshToken(req, res): Genera un nuovo access token usando un refresh token (se implementato).

2. ## userController.ts
Questo controller gestisce le operazioni relative all'utente autenticato (il suo profilo) o la gestione degli utenti da parte di un utente con ruolo ADMIN.

Modelli Prisma correlati: users
Funzioni comuni:

getMe(req, res): Recupera i dati del profilo dell'utente autenticato.

updateProfile(req, res): Aggiorna i dati del profilo dell'utente autenticato (es. username, email).

changePassword(req, res): Permette all'utente di cambiare la propria password (richiede quella vecchia).

getAllUsers(req, res): Recupera tutti gli utenti (spesso solo per ADMIN).

getUserById(req, res): Recupera un utente specifico per ID (spesso solo per ADMIN).

deleteUser(req, res): Cancella un utente (spesso solo per ADMIN).

updateUserRole(req, res): Cambia il ruolo di un utente (solo per ADMIN).

togglePremiumStatus(req, res): Abilita/disabilita lo stato premium (solo per ADMIN o tramite logica di pagamento).

3. ## categoryController.ts
Gestisce le categorie generiche (es. tipo di cucina, pasti) e i loro valori associati.

Modelli Prisma correlati: categories, category_values
Funzioni comuni:

getAllCategories(req, res): Recupera tutte le categorie.

getCategoryById(req, res): Recupera una categoria specifica.

createCategory(req, res): Crea una nuova categoria (spesso solo per ADMIN).

updateCategory(req, res): Aggiorna una categoria (spesso solo per ADMIN).

deleteCategory(req, res): Cancella una categoria (spesso solo per ADMIN).

getAllCategoryValues(req, res): Recupera tutti i valori delle categorie.

getCategoryValuesByCategoryId(req, res): Recupera i valori per una categoria specifica.

createCategoryValue(req, res): Aggiunge un valore a una categoria (spesso solo per ADMIN).

updateCategoryValue(req, res): Aggiorna un valore di categoria (spesso solo per ADMIN).

deleteCategoryValue(req, res): Cancella un valore di categoria (spesso solo per ADMIN).

5. ## recipeController.ts
Si occupa della gestione delle ricette.

Modelli Prisma correlati: recipes, recipe_ingredients, recipe_category_values
Funzioni comuni:

getAllRecipes(req, res): Recupera tutte le ricette (con filtri opzionali).

getRecipeById(req, res): Recupera una singola ricetta con i suoi ingredienti e categorie.

createRecipe(req, res): Crea una nuova ricetta (richiede ingredienti e categorie) (ADMIN)

updateRecipe(req, res): Aggiorna una ricetta esistente.

deleteRecipe(req, res): Cancella una ricetta.

addIngredientToRecipe(req, res): Aggiunge un ingrediente a una ricetta.

removeIngredientFromRecipe(req, res): Rimuove un ingrediente da una ricetta.

addCategoryValueToRecipe(req, res): Associa un valore di categoria a una ricetta.

6. ## mealPlanController.ts
Gestisce la creazione e la gestione dei piani pasto per gli utenti.

Modelli Prisma correlati: meal_plans, meal_plan_entries
Funzioni comuni:

getAllMealPlansForUser(req, res): Tutti i piani pasto di un utente autenticato.

getMealPlanById(req, res): Un singolo piano pasto con le sue voci.

createMealPlan(req, res): Crea un nuovo piano pasto.

updateMealPlan(req, res): Aggiorna i dettagli di un piano pasto.

deleteMealPlan(req, res): Cancella un piano pasto.

addMealPlanEntry(req, res): Aggiunge una ricetta a una data/tipo di pasto specifico in un piano.

updateMealPlanEntry(req, res): Aggiorna una voce del piano pasto.

removeMealPlanEntry(req, res): Rimuove una voce dal piano pasto.

7. ## userIngredientController.ts
Gestisce gli ingredienti specifici che un utente ha nella sua "dispensa" o "lista della spesa".

Modelli Prisma correlati: user_ingredients
Funzioni comuni:

getUserIngredients(req, res): Tutti gli ingredienti nella dispensa/lista dell'utente.

addUserIngredient(req, res): Aggiunge un ingrediente alla dispensa/lista dell'utente.

updateUserIngredient(req, res): Aggiorna la quantità, unità, data di scadenza di un ingrediente.

deleteUserIngredient(req, res): Rimuove un ingrediente dalla dispensa/lista.

Questa divisione permette di mantenere ogni file del controller gestibile, pulito e focalizzato su un'area specifica della tua applicazione, rendendo il codice più facile da capire, testare e mantenere.

# Router Express specifico per le route admin.

 ### routes/adminRoutes.ts
import { Router } from 'express';
import { verifyAuthToken } from '../middlewares/authMiddleware'; // Per verificare il JWT
import { isAdmin } from '../middlewares/roleMiddleware'; // Per controllare il ruolo ADMIN
import * as adminUserController from '../controllers/admin/adminUserController'; // Nuovo controller
import * as adminCategoryController from '../controllers/admin/adminCategoryController'; // Nuovo controller

const adminRouter = Router();

// Applica il middleware di autenticazione e ruolo a tutte le route admin
adminRouter.use(verifyAuthToken); // Prima controlla se l'utente è loggato
adminRouter.use(isAdmin);         // Poi controlla se è un ADMIN

// Route di gestione utenti (solo ADMIN)
adminRouter.get('/users', adminUserController.getAllUsers);

adminRouter.get('/users/:id', adminUserController.getUserById);

adminRouter.put('/users/:id/role', adminUserController.updateUserRole);

adminRouter.delete('/users/:id', adminUserController.deleteUser);
// ... e così via per altre operazioni admin su utenti

// Route di gestione categorie (solo ADMIN)

adminRouter.post('/categories', adminCategoryController.createCategory);

adminRouter.put('/categories/:id', adminCategoryController.updateCategory);

adminRouter.delete('/categories/:id', adminCategoryController.deleteCategory);
// ... e così via per altre risorse gestite dagli admin

export default adminRouter;
Poi nel tuo app.ts (o server.ts):

### app.ts

// app.ts / server.ts

import express from 'express';

import authRoutes from './routes/authRoutes';

import userRoutes from './routes/userRoutes';

import adminRoutes from './routes/adminRoutes'; // Importa le route admin

const app = express();

app.use(express.json());

app.use('/auth', authRoutes); // Es. /auth/login, /auth/register

app.use('/users', userRoutes); // Es. /users/me, /users/update-profile

app.use('/admin', adminRoutes); // Es. /admin/users, /admin/categories

// ... il resto del tuo codice

