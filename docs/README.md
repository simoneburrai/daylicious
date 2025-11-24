# 🍽️ Daylicious - Project Recap

**Daylicious** is a web application currently under development, designed to simplify the daily management of your kitchen 🧑‍🍳. It offers a centralized system for organizing recipes, planning meals, monitoring the pantry, and reducing food waste.

---

## 🧠 1. Main Idea

The main objective of **Daylicious** is to provide an **intelligent and personalized platform** for:

* **Recipe** management
* **Meal planning**
* **Monitoring available ingredients**

👉 The goal is to go beyond a simple recipe collection, offering a complete digital culinary ecosystem.

---

## ✨ 2. Core Features

### 📘 Recipe Management
* Name, description, preparation/cooking times
* Portions, external URLs, and illustrations
* Categorization and ingredient association

### 📅 Meal Planning
* Plans with a name and start/end dates
* Addition of specific recipes per day and meal type (breakfast, lunch, dinner)
* Planned portions

### 🧺 Pantry Management
* Owned ingredients, quantity, unit of measurement
* Addition date and expiration date

### 👤 User Authentication and Management
* Registration/login (username/email + hashed password)
* Premium status (`is_premium`) for advanced functionalities

---

## 🧩 3. Secondary Features / Additional Details

### 🏷️ Advanced Categorization
* General categories and specific values (e.g., "Cuisine Type → Italian")
* Ingredient categories (e.g., Vegetables, Meat, Dairy)

### 🔄 Ingredient Variations
* Example: Milk → Whole, Skimmed, Plant-based
* Each variation has a description and image

### 🧮 Quantity per Recipe
* Tracking of quantities/units for each ingredient variation

### 🕒 Timestamp
* Fields `created_at`, `last_login` for user and data monitoring

---

## 🔮 4. Next Implementations

### 💻 Interactive Frontend
* UI in React (likely with Next.js for SEO and SSR advantages)

### 🔍 Advanced Search & Filters
* Filters by category, ingredients, cooking times, etc.

### 🔐 Real Authentication
* Hashing with `bcryptjs`
* Token management with `JWT` for secure sessions

### ⏰ Expiration Notifications
* Automatic alerts for expiring ingredients

### 🛒 Shopping List
* Automatic generation based on meal plans and stock

### 👥 User Role Management
* Differentiation between basic, premium, and admin users

### 🤖 AI & Computer Vision (Future)
* 📷 Ingredient image recognition (e.g., photo of the fridge)
* 🍲 Automatic recipe suggestions
* 🥬 Ingredient freshness analysis (long-term future)

---

## 🛠️ 5. Technologies Used

| Area           | Tool / Technology                           |
|----------------|----------------------------------------------|
| Backend        | TypeScript, Node.js, Express.js              |
| Database       | PostgreSQL + Prisma ORM                      |
| Config         | `dotenv` for environment variables             |
| Security       | `bcryptjs` (hashing), `JWT` (future auth)    |
| Middleware     | `cors`, `express.json()`                     |
| Frontend (WIP) | React, Next.js (likely)                      |
| AI (Future)    | TensorFlow.js, OpenCV, Google Vision API     |
| IDE            | Visual Studio Code (with TS + DB extensions) |

---

## 🚀 Conclusion

Daylicious is an ambitious and well-structured project that combines modern technologies with a user-centric approach. The goal is to **make the daily management of food a simpler, smarter, and more sustainable experience**, with a future vision of integrating artificial intelligence for automated inventory and smart recommendations.

---

> 🍝 *"Organize your kitchen. Simplify your life."*
