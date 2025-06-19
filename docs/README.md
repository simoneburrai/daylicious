# 🍽️ Daylicious - Recap Progetto

**Daylicious** è una web application in fase di sviluppo, pensata per semplificare la gestione quotidiana della cucina 🧑‍🍳. Offre un sistema centralizzato per organizzare ricette, pianificare pasti, monitorare la dispensa e ridurre gli sprechi alimentari.

---

## 🧠 1. Main Idea

L’obiettivo principale di **Daylicious** è fornire una **piattaforma intelligente e personalizzata** per:

- La gestione delle **ricette**
- La **pianificazione dei pasti**
- Il **monitoraggio degli ingredienti disponibili**

👉 Lo scopo è andare oltre la semplice raccolta di ricette, offrendo un ecosistema culinario digitale completo.

---

## ✨ 2. Features Principali

### 📘 Gestione Ricette
- Nome, descrizione, tempi di preparazione/cottura
- Porzioni, URL esterni e illustrazioni
- Categorizzazione e associazione ingredienti

### 📅 Pianificazione Pasti (Meal Planning)
- Piani con nome e date di inizio/fine
- Aggiunta di ricette specifiche per giorno e tipo pasto (colazione, pranzo, cena)
- Porzioni pianificate

### 🧺 Gestione della Dispensa
- Ingredienti posseduti, quantità, unità di misura
- Data di aggiunta e data di scadenza

### 👤 Autenticazione e Gestione Utenti
- Registrazione/login (username/email + password hashata)
- Stato premium (`is_premium`) per funzionalità avanzate

---

## 🧩 3. Features Secondarie / Dettagli Aggiuntivi

### 🏷️ Categorizzazione Avanzata
- Categorie generali e valori specifici (es. "Tipo cucina → Italiana")
- Categorie ingredienti (es. Verdure, Carne, Latticini)

### 🔄 Variazioni Ingredienti
- Esempio: Latte → Intero, Scremato, Vegetale
- Ogni variazione ha descrizione e immagine

### 🧮 Quantità per Ricetta
- Tracciamento delle quantità/unità per ciascuna variazione ingrediente

### 🕒 Timestamp
- Campi `created_at`, `last_login` per monitoraggio utenti e dati

---

## 🔮 4. Prossime Implementazioni

### 💻 Frontend Interattivo
- UI in React (probabilmente con Next.js per vantaggi SEO e SSR)

### 🔍 Ricerca & Filtri Avanzati
- Filtri per categoria, ingredienti, tempi di cottura, ecc.

### 🔐 Autenticazione Reale
- Hashing con `bcryptjs`
- Gestione token con `JWT` per sessioni sicure

### ⏰ Notifiche Scadenza
- Avvisi automatici sugli ingredienti in scadenza

### 🛒 Lista della Spesa
- Generazione automatica in base a piani pasto e scorte

### 👥 Gestione Ruoli Utente
- Differenziazione tra utenti base, premium e admin

### 🤖 AI & Visione Computazionale
- 📷 Riconoscimento immagini ingredienti (es. foto del frigo)
- 🍲 Suggerimenti automatici di ricette
- 🥬 Analisi della freschezza degli ingredienti (futura)

---

## 🛠️ 5. Tecnologie Utilizzate

| Ambito         | Strumento / Tecnologia                       |
|----------------|----------------------------------------------|
| Backend        | TypeScript, Node.js, Express.js              |
| Database       | PostgreSQL + Prisma ORM                      |
| Config         | dotenv per variabili d’ambiente              |
| Sicurezza      | bcryptjs (hashing), JWT (auth futura)        |
| Middleware     | `cors`, `express.json()`                     |
| Frontend (WIP) | React, Next.js (probabilmente)               |
| AI (futuro)    | TensorFlow.js, OpenCV, Google Vision API     |
| IDE            | Visual Studio Code (con estensioni TS + DB)  |

---

## 🚀 Conclusioni

Daylicious è un progetto ambizioso e ben strutturato che combina le tecnologie più moderne con un approccio user-centric. L’obiettivo è **rendere la gestione quotidiana del cibo un'esperienza più semplice, intelligente e sostenibile**, con la visione futura di integrare l’intelligenza artificiale per un’inventario automatizzato e raccomandazioni smart.

---

> 🍝 *"Organizza la tua cucina. Semplifica la tua vita."*
