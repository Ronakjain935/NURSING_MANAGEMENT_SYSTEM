# PlantVerse AI – Smart Nursery, Plant Care & Intelligent Crop Ecosystem

[![Python](https.img.shields.io/badge/Python-3.14-emerald.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.110.0-009688.svg)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-Deep%20Learning-EE4C2C.svg)](https://pytorch.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Machine%20Learning-F7931E.svg)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**PlantVerse AI** is a production-ready, AI-powered Nursery Management, Plant Care, and E-Commerce Platform built with **Python (FastAPI backend + PyTorch / Scikit-Learn ML inference)** and a **nature-inspired glassmorphic SPA web interface**.

---

## 🌟 Key Features & AI Subsystems

### 1. 🌾 AI Crop Recommendation & Soil Agronomy System
- Analyzes soil nutrient ratios: **Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), $pH$ level, Temperature ($^\circ\text{C}$), Humidity ($\%$), and Rainfall ($\text{mm}$)**.
- Uses Scikit-Learn distance & feature matrix classification to predict optimal crops (e.g., **Basmati Rice, Highland Arabica Coffee, Cotton, Maize, Watermelon, Tomato, Chickpea, Wheat**) with suitability match scores, yield estimates ($\text{Tons/Hectare}$), and custom fertilizer plans.

### 2. 🔬 Computer Vision Leaf Pathology Diagnosis with Grad-CAM
- Accepts leaf photo uploads or test sample selections (Leaf Rust, Powdery Mildew, Spider Mites, Nitrogen Deficiency, Healthy).
- Generates disease diagnostic reports, severity scores, organic/chemical treatment plans, and an interactive **Grad-CAM (Gradient-Weighted Class Activation Mapping) attention heatmap overlay** visualizing infected spots.

### 3. 🛍️ Smart E-Commerce & Marketplace
- 30+ plant & crop species spanning Indoor, Outdoor, Agricultural Cash Crops, Spices, Medicinal, Fruit Trees, Succulents, and Bonsai.
- Features multi-parameter filters (sunlight, pet-safety, price slider), 360-degree plant inspection view simulator, wishlist, and cart drawer.

### 4. 💳 Razorpay Payment Gateway & PDF Invoice Generator
- Razorpay payment simulation supporting UPI, GPay, and Credit/Debit cards with promo coupon validation (`PLANTAI15`).
- Generates official downloadable & printable PDF/HTML invoices.

### 5. 🚚 Live GPS Order Tracking & Driver OTP Verification
- Real-time order fulfillment pipeline (Placed $\rightarrow$ Packed $\rightarrow$ Dispatched $\rightarrow$ Out for Delivery $\rightarrow$ Delivered).
- Interactive driver GPS coordinates map simulation and delivery verification OTP (`4819`).

### 6. 💧 Smart Irrigation & Penman-Monteith Water Engine
- Meteorological evapotranspiration model calculating daily water requirements ($\text{ml}$) and 7-day watering schedules.

### 7. 📈 AI Biological Growth Timeline Predictor
- Logistic growth curve simulator estimating 12-month height growth ($\text{cm}$) and health indices.

### 8. 📊 Nursery Owner ERP Analytics & Demand Forecasting Dashboard
- Scikit-Learn linear regression model forecasting 6-month unit sales, revenue trends, sales heatmaps, and inventory restocking alerts.

### 9. 🛡️ JWT Security & Role-Based Access Control (RBAC)
- Password hashing via HMAC-SHA256, signature-verified JWT tokens, and RBAC middleware (`CUSTOMER`, `EXPERT`, `DELIVERY_PARTNER`, `NURSERY_STAFF`, `NURSERY_OWNER`, `SUPER_ADMIN`).

---

## 🛠️ Technology Stack

- **Backend**: Python 3.14, FastAPI, Uvicorn, Pydantic, HTTP Bearer JWT Security
- **AI & Machine Learning**: PyTorch, OpenCV, Scikit-Learn, NumPy, Pandas, Pillow
- **Frontend**: Single Page Application (HTML5, Modern JavaScript ES6+, Tailwind CSS CDN, FontAwesome 6, Chart.js)

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ installed on your system.

### 1. Clone & Navigate to Workspace
```bash
cd nursery_management_system
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the FastAPI Application Server
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Access Platform
- **Web Application**: `http://127.0.0.1:8000/`
- **Swagger Interactive API Docs**: `http://127.0.0.1:8000/docs`
- **Redoc Documentation**: `http://127.0.0.1:8000/redoc`

---

## 📡 Core API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/api/health` | System status & loaded AI models |
| **Auth** | `POST` | `/api/auth/register` | User registration & JWT generation |
| **Auth** | `POST` | `/api/auth/login` | Password verification & JWT authentication |
| **Crops AI** | `POST` | `/api/ai/crop-recommend` | Soil NPK Agronomy Crop Prediction |
| **Disease AI** | `POST` | `/api/ai/diagnose` | Leaf pathology scan with Grad-CAM heatmap |
| **Plants** | `GET` | `/api/plants` | Filtered plant & crop catalog |
| **Inventory** | `GET` | `/api/plants/inventory/stock` | Nursery stock audit & warehouse rack info |
| **Orders** | `POST` | `/api/orders/checkout` | Razorpay payment & invoice generation |
| **Tracking** | `GET` | `/api/orders/{id}/track` | Live delivery driver GPS & OTP |
| **Analytics** | `GET` | `/api/analytics` | Nursery ERP KPI metrics & demand forecast |

---

## 📂 Project Directory Structure

```
nursery_management_system/
├── main.py                # FastAPI entry point & API routes
├── ai_engine.py           # Growth, Water & Recommendation ML algorithms
├── ml_models.py           # PyTorch CV Leaf Scanner & Crop Agronomy Engine
├── database.py            # Data store for plants, crops, diseases & orders
├── models.py              # Pydantic data schemas & request models
├── auth.py                # HMAC-SHA256 password hashing & JWT RBAC security
├── requirements.txt       # Python dependencies
├── README.md              # Project documentation
├── routers/
│   ├── __init__.py
│   ├── auth_router.py     # Login, Register & Profile endpoints
│   └── plants_router.py   # Catalog, Categories & Inventory endpoints
└── static/
    ├── index.html         # SPA HTML5 layout shell
    ├── styles.css         # Luxury emerald-gold glassmorphism CSS
    └── app.js             # Frontend SPA router & views engine
```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
