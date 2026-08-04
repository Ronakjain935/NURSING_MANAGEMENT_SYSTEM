# PlantVerse AI – Smart Nursery, Plant Care & Intelligent Crop Ecosystem

[![Python](https://img.shields.io/badge/Python-3.10%2B-emerald.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.110.0-009688.svg)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-Deep%20Learning-EE4C2C.svg)](https://pytorch.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Machine%20Learning-F7931E.svg)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**PlantVerse AI** is a production-ready, AI-powered Nursery Management, Plant Care, and E-Commerce Platform built with **Python (FastAPI backend + PyTorch / Scikit-Learn ML inference)** and a **nature-inspired glassmorphic SPA web interface**.

---

## 🌟 Key Features & AI Subsystems

### 1. 🌾 AI Crop Recommendation & Soil Agronomy System
- Analyzes soil nutrient ratios: **Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), $pH$ level, Temperature ($^\circ\text{C}$), Humidity ($\%$), and Rainfall ($\text{mm}$)**.
- Uses Scikit-Learn distance & feature matrix classification (Random Forest & Decision Trees) to predict optimal crops (e.g., **Basmati Rice, Highland Arabica Coffee, Cotton, Maize, Watermelon, Tomato, Chickpea, Wheat**) with suitability match scores, yield estimates ($\text{Tons/Hectare}$), and custom fertilizer plans.

### 2. 🔬 Computer Vision Leaf Pathology Diagnosis with Grad-CAM
- Accepts leaf photo uploads or test sample selections (Leaf Rust, Powdery Mildew, Spider Mites, Nitrogen Deficiency, Healthy).
- Generates disease diagnostic reports, severity scores, organic/chemical treatment plans, and an interactive **Grad-CAM (Gradient-Weighted Class Activation Mapping) attention heatmap overlay** visualizing infected spots.

### 3. 🛍️ Smart E-Commerce & Plant Marketplace
- 30+ plant & crop species spanning Indoor, Outdoor, Agricultural Cash Crops, Spices, Medicinal, Fruit Trees, Succulents, and Bonsai.
- Features multi-parameter filters (sunlight, pet-safety, price slider), 360-degree plant inspection view simulator, wishlist, and cart drawer.

### 4. 💳 Razorpay Payment Gateway & PDF Invoice Generator
- Razorpay payment simulation supporting UPI, GPay, and Credit/Debit cards with promo coupon validation (`PLANTAI15`).
- Generates official downloadable & printable PDF/HTML invoices with tax breakdowns.

### 5. 🚚 Live GPS Order Tracking & Driver OTP Verification
- Real-time order fulfillment pipeline (Placed $\rightarrow$ Packed $\rightarrow$ Dispatched $\rightarrow$ Out for Delivery $\rightarrow$ Delivered).
- Interactive driver GPS coordinates map simulation and delivery verification OTP (`4819`).

### 6. 🌿 Service Plans & Nursery Owner Query System
- Flexible nursery maintenance plans (Basic Plant Starter, Smart Garden Maintenance, Commercial Agronomy Suite).
- Enables customers to place custom plant order queries and allows Nursery Owners to review, update status, and manage inquiry notes.

### 7. 💧 Smart Irrigation & Penman-Monteith Water Engine
- Meteorological evapotranspiration model calculating daily water requirements ($\text{ml}$) and 7-day watering schedules.

### 8. 📈 AI Biological Growth Timeline Predictor
- Logistic growth curve simulator estimating 12-month height growth ($\text{cm}$) and health indices.

### 9. 📊 Nursery Owner ERP Analytics & Demand Forecasting Dashboard
- Scikit-Learn linear regression model forecasting 6-month unit sales, revenue trends, sales heatmaps, and inventory restocking alerts.

### 10. 🛡️ JWT Security & Role-Based Access Control (RBAC)
- Password hashing via HMAC-SHA256, signature-verified JWT tokens, and RBAC middleware (`CUSTOMER`, `EXPERT`, `DELIVERY_PARTNER`, `NURSERY_STAFF`, `NURSERY_OWNER`, `SUPER_ADMIN`).
- Dynamic registration supporting Customer & Nursery Owner/Admin role creation, registered user management (`/api/auth/users`), and API key configuration state tracking (`/api/config/key`).

---

## 🛠️ Technology Stack

- **Backend**: Python 3.10+, FastAPI, Uvicorn, Gunicorn, Pydantic, HTTP Bearer JWT Security, `python-dotenv`
- **AI & Data Science**: PyTorch, OpenCV, Scikit-Learn, NumPy, Pandas, Pillow, Jupyter Notebooks
- **Frontend**: Single Page Application (HTML5, Modern JavaScript ES6+, Tailwind CSS CDN, FontAwesome 6, Chart.js)
- **Deployment**: WSGI/ASGI ready (`wsgi.py`, `Procfile`, `render.yaml`)

---

## 🔬 Data Science & ML Model Training

The project includes custom Jupyter Notebooks and dataset generation tools for interactive EDA, training, and evaluation:

1. **`crope recommendation.ipynb`**:
   - Comprehensive EDA on soil NPK ratios and climatic factors.
   - Classification with Random Forest & Decision Tree models.
   - Confusion matrix, feature importance rankings, and crop predictor function.
2. **`crop disese.ipynb`**:
   - Analysis of leaf pathology datasets (severity grades, chlorosis index, affected surface area).
   - PyTorch ResNet-50 transfer learning workflow visualization.
   - Pathology diagnostic inference engine and treatment recommendations.
3. **`generate_ml_assets.py`**:
   - Automated script generating reproducible CSV datasets (`crop_recommendation_dataset.csv` and `crop_disease_dataset.csv`) and notebook files.

To run or regenerate datasets and notebooks:
```bash
python generate_ml_assets.py
```

---

## ⚙️ Environment Configuration

Copy the example environment file `.env.example` to create `.env`:

```bash
cp .env.example .env
```

Available configuration parameters in `.env`:
```env
# System Configuration
ENVIRONMENT=development
PORT=8000
HOST=127.0.0.1

# AI Platform API Keys
API_KEY=sk-Q6dD6a716002ebc4b19138
OPENAI_API_KEY=sk-Q6dD6a716002ebc4b19138
PLANTVERSE_API_KEY=sk-Q6dD6a716002ebc4b19138
```

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

Or using python runner:
```bash
python main.py
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
| **Config** | `GET` | `/api/config/key` | API key status & masked configuration |
| **Auth** | `POST` | `/api/auth/register` | User registration & JWT generation (supports Customer & Admin roles) |
| **Auth** | `POST` | `/api/auth/login` | Password verification & JWT authentication |
| **Auth** | `GET` | `/api/auth/me` | Fetch authenticated user profile details |
| **Auth** | `GET` | `/api/auth/users` | List all registered user accounts |
| **Auth** | `GET` | `/api/auth/security-policy` | Security policy & RBAC permission status |
| **Crops AI** | `POST` | `/api/ai/crop-recommend` | Soil NPK Agronomy Crop Prediction |
| **Disease AI** | `POST` | `/api/ai/diagnose` | Leaf pathology scan with Grad-CAM heatmap |
| **Plants** | `GET` | `/api/plants` | Filtered plant & crop catalog |
| **Inventory** | `GET` | `/api/plants/inventory/stock` | Nursery stock audit & warehouse rack info |
| **Plan Orders** | `GET` | `/api/plan-orders/plans` | Nursery maintenance plans catalog |
| **Plan Orders** | `POST` | `/api/plan-orders/` | Submit custom plan query / order |
| **Plan Orders** | `GET` | `/api/plan-orders/` | List customer plan orders & queries |
| **Plan Orders** | `PUT` | `/api/plan-orders/{id}/status` | Owner updates order status & notes |
| **Orders** | `POST` | `/api/orders/checkout` | Razorpay payment & invoice generation |
| **Tracking** | `GET` | `/api/orders/{id}/track` | Live delivery driver GPS & OTP |
| **Analytics** | `GET` | `/api/analytics` | Nursery ERP KPI metrics & demand forecast |

---

## 📂 Project Directory Structure

```
nursery_management_system/
├── main.py                          # FastAPI entry point & API app initialization
├── ai_engine.py                     # Growth, Water & Recommendation ML algorithms
├── ml_models.py                     # PyTorch CV Leaf Scanner & Crop Agronomy Engine
├── database.py                      # In-memory store for plants, crops, orders & plans
├── models.py                        # Pydantic data schemas & request models
├── auth.py                          # JWT authentication, password hashing & RBAC
├── generate_ml_assets.py            # Dataset & Jupyter notebook generator
├── crop_recommendation_dataset.csv  # Soil agronomy N-P-K dataset
├── crop_disease_dataset.csv         # Leaf pathology diagnosis dataset
├── crope recommendation.ipynb       # Jupyter notebook for Crop Recommendation EDA & ML
├── crop disese.ipynb                # Jupyter notebook for Crop Disease Pathology & PyTorch
├── requirements.txt                 # Python dependencies
├── .env.example                     # Environment variables template
├── Procfile                         # Gunicorn deployment configuration
├── render.yaml                      # Render cloud deployment specification
├── wsgi.py                          # WSGI entry point wrapper
├── README.md                        # Project documentation
├── routers/
│   ├── __init__.py
│   ├── auth_router.py               # Login, Register & User profile endpoints
│   ├── plants_router.py             # Catalog, Categories & Inventory endpoints
│   └── plan_orders_router.py        # Nursery Service Plans & Owner Query router
└── static/
    ├── index.html                   # SPA HTML5 layout shell
    ├── styles.css                   # Luxury emerald-gold glassmorphism CSS
    └── app.js                       # Frontend SPA router, UI views & modal handlers
```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
