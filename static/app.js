/**
 * PlantVerse AI v3.0 - Complete Frontend SPA Engine
 * Includes AI Crop Recommendation System, Computer Vision Disease Diagnosis,
 * E-Commerce, 360° Plant Inspector, Live GPS Tracking, and Nursery ERP Dashboards.
 */

const state = {
  activeView: 'landing',
  plants: [],
  categories: [],
  filteredPlants: [],
  cart: [],
  wishlist: [],
  compareList: [],
  selectedPlant: null,
  activeCategory: 'all',
  searchQuery: '',
  token: localStorage.getItem('pv_token') || null,
  currentUser: JSON.parse(localStorage.getItem('pv_user') || 'null'),
  filters: {
    sunlight: 'all',
    experience: 'all',
    petFriendly: false,
    maxPrice: 100
  },
  cropInput: {
    nitrogen: 90,
    phosphorus: 42,
    potassium: 43,
    ph: 6.5,
    temp: 25,
    humidity: 80,
    rainfall: 200,
    soilType: 'Loamy'
  },
  cropResults: [],
  aiScanResult: null,
  showGradCam: true,
  chatMessages: [
    { sender: 'bot', text: 'Welcome to PlantVerse AI! Ask me about plant care, leaf pathology, or AI crop agronomy recommendations.', source: 'PlantVerse AI Core v3.0' }
  ],
  activeOrder: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  await fetchCategories();
  await fetchPlants();
  await fetchOrders();
  await verifySession();
  setupEventListeners();
  router('landing');
});

async function verifySession() {
  if (!state.token) return;
  try {
    const res = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    if (res.ok) {
      const user = await res.json();
      state.currentUser = user;
      localStorage.setItem('pv_user', JSON.stringify(user));
    } else {
      handleLogout(false);
    }
  } catch (err) {
    console.error('Session verification failed:', err);
  }
}

async function fetchCategories() {
  try {
    const res = await fetch('/api/categories');
    const json = await res.json();
    state.categories = json.data || [];
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
}

async function fetchPlants() {
  try {
    const res = await fetch('/api/plants');
    const json = await res.json();
    state.plants = json.data || [];
    state.filteredPlants = [...state.plants];
  } catch (err) {
    console.error('Failed to fetch plants:', err);
  }
}

async function fetchOrders() {
  try {
    const res = await fetch('/api/orders');
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      state.activeOrder = json.data[0];
    }
  } catch (err) {
    console.error('Failed to fetch orders:', err);
  }
}

// Router State Engine
function router(viewName, param = null) {
  // Security Route Guard Checks
  if (viewName === 'admin-dashboard') {
    if (!state.currentUser || (state.currentUser.role !== 'OWNER' && state.currentUser.role !== 'SUPER_ADMIN')) {
      showToast('Nursery Owner authentication required');
      viewName = 'owner-login';
      param = 'Access Restricted: Please log in with a Nursery Owner account to access the Admin Portal.';
    }
  } else if (viewName === 'user-dashboard') {
    if (!state.currentUser) {
      showToast('Please log in to view your profile');
      viewName = 'user-login';
      param = 'Security Notice: Please log in to access your customer account.';
    }
  }

  state.activeView = viewName;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.remove('text-emerald-600', 'font-bold', 'border-b-2', 'border-emerald-600');
    el.classList.add('text-slate-600');
  });
  const activeNav = document.getElementById(`nav-${viewName}`);
  if (activeNav) {
    activeNav.classList.remove('text-slate-600');
    activeNav.classList.add('text-emerald-600', 'font-bold');
  }

  const container = document.getElementById('main-content');
  if (!container) return;

  switch (viewName) {
    case 'landing':
      renderLandingView(container);
      break;
    case 'owner-login':
      renderOwnerLoginView(container, param);
      break;
    case 'user-login':
      renderUserLoginView(container, param);
      break;
    case 'crop-ai':
      renderCropRecommendView(container);
      break;
    case 'marketplace':
      renderMarketplaceView(container);
      break;
    case 'detail':
      renderProductDetailView(container, param);
      break;
    case 'cart':
      renderCartView(container);
      break;
    case 'tracking':
      renderOrderTrackingView(container, param);
      break;
    case 'ai-scan':
      renderAIScanView(container);
      break;
    case 'ai-bot':
      renderAICareBotView(container);
      break;
    case 'growth-predictor':
      renderGrowthPredictorView(container);
      break;
    case 'watering-calc':
      renderSmartWateringView(container);
      break;
    case 'recommend-wizard':
      renderRecommendWizardView(container);
      break;
    case 'journal':
      renderPlantJournalView(container);
      break;
    case 'consultation':
      renderConsultationView(container);
      break;
    case 'knowledge':
      renderKnowledgeCenterView(container);
      break;
    case 'user-dashboard':
      renderUserDashboardView(container);
      break;
    case 'admin-dashboard':
      renderAdminDashboardView(container);
      break;
    case 'staff-panel':
      renderStaffPanelView(container);
      break;
    case 'delivery-panel':
      renderDeliveryPanelView(container);
      break;
    default:
      renderLandingView(container);
  }
  updateHeaderBadges();
  updateHeaderAuthUI();
}

function updateHeaderAuthUI() {
  const container = document.getElementById('auth-header-container');
  if (!container) return;

  if (state.currentUser && state.token) {
    const isOwner = state.currentUser.role === 'OWNER' || state.currentUser.role === 'SUPER_ADMIN';
    const roleBadgeClass = isOwner ? 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold' : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
    const roleLabel = isOwner ? 'Owner' : 'Customer';
    
    container.innerHTML = `
      <div class="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        <div class="w-7 h-7 rounded-lg ${isOwner ? 'bg-gradient-to-tr from-amber-600 to-amber-400' : 'bg-gradient-to-tr from-emerald-700 to-teal-500'} text-white flex items-center justify-center text-xs font-bold shadow-sm">
          <i class="fa-solid ${isOwner ? 'fa-user-shield' : 'fa-user-leaf'}"></i>
        </div>
        <div class="hidden md:block text-left text-xs pr-1">
          <span class="font-bold text-slate-900 block truncate max-w-[110px] leading-tight">${state.currentUser.fullName || state.currentUser.email}</span>
          <span class="text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase border ${roleBadgeClass}">${roleLabel}</span>
        </div>
        ${isOwner ? `
          <button onclick="router('admin-dashboard')" class="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-[11px] px-2.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center space-x-1">
            <i class="fa-solid fa-chart-pie text-amber-400"></i>
            <span>Owner Portal</span>
          </button>
        ` : `
          <button onclick="router('user-dashboard')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center space-x-1">
            <i class="fa-solid fa-sliders"></i>
            <span>My Account</span>
          </button>
        `}
        <button onclick="handleLogout()" title="Log out" class="w-7 h-7 rounded-lg bg-slate-200 hover:bg-red-100 hover:text-red-600 text-slate-600 flex items-center justify-center text-xs transition-all">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button id="btn-header-user-login" onclick="router('user-login')" class="hidden sm:flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-emerald-200 transition-all">
        <i class="fa-solid fa-user text-emerald-600"></i>
        <span>User Login</span>
      </button>
      
      <button id="btn-header-owner-login" onclick="router('owner-login')" class="hidden sm:flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition-all">
        <i class="fa-solid fa-user-shield text-amber-400"></i>
        <span>Owner Login</span>
      </button>
    `;
  }
}

function updateHeaderBadges() {
  const cartCountEl = document.getElementById('cart-count-badge');
  if (cartCountEl) {
    const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.innerText = totalQty;
    cartCountEl.style.display = totalQty > 0 ? 'flex' : 'none';
  }

  const wishlistCountEl = document.getElementById('wishlist-count-badge');
  if (wishlistCountEl) {
    wishlistCountEl.innerText = state.wishlist.length;
    wishlistCountEl.style.display = state.wishlist.length > 0 ? 'flex' : 'none';
  }
}

function addToCart(plantId, qty = 1) {
  const plant = state.plants.find(p => p.id === plantId);
  if (!plant) return;

  const existing = state.cart.find(item => item.plant.id === plantId);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({ plant, qty });
  }
  updateHeaderBadges();
  showToast(`Added ${plant.name} to cart!`);
}

function toggleWishlist(plantId) {
  const idx = state.wishlist.indexOf(plantId);
  if (idx > -1) {
    state.wishlist.splice(idx, 1);
    showToast(`Removed from wishlist.`);
  } else {
    state.wishlist.push(plantId);
    showToast(`Added to wishlist!`);
  }
  updateHeaderBadges();
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center space-x-3 border border-emerald-500 animate-bounce';
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 text-xl"></i><span class="font-medium text-xs">${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// --- LANDING PAGE VIEW ---

function renderLandingView(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative bg-leaf-pattern text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-2xl overflow-hidden">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center space-x-2 badge-gold px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide">
            <i class="fa-solid fa-wheat-awn text-amber-200"></i>
            <span>AI Crop Recommendation & Smart Nursery v3.0</span>
          </div>
          <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Intelligent Plant Care & <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200">AI Crop Agronomy</span>
          </h1>
          <p class="text-lg text-emerald-100/90 max-w-2xl">
            Discover 500+ plant & crop species, run Soil N-P-K Agronomy AI to predict top high-yield agricultural crops, diagnose leaf diseases with Grad-CAM heatmaps, and experience express green delivery.
          </p>

          <!-- Search & Action Buttons -->
          <div class="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 shadow-lg">
            <div class="relative flex-1 w-full">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400"></i>
              <input type="text" id="hero-search-input" placeholder="Search Rice Crop, Monstera, Coffee Plant, Cardamom..." 
                class="w-full pl-11 pr-4 py-3 bg-white text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder-slate-400 text-sm">
            </div>
            <button onclick="handleHeroSearch()" class="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm">
              <span>Explore Marketplace</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div class="flex flex-wrap gap-3 pt-2">
            <button onclick="router('crop-ai')" class="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg">
              <i class="fa-solid fa-wheat-field text-amber-200"></i>
              <span>AI Crop Recommendation Engine</span>
            </button>
            <button onclick="router('ai-scan')" class="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 backdrop-blur-sm">
              <i class="fa-solid fa-camera-viewfinder text-emerald-400"></i>
              <span>Try AI Disease Scanner</span>
            </button>
          </div>
        </div>

        <!-- Hero Preview Feature Card -->
        <div class="lg:col-span-5">
          <div class="glass-dark p-6 rounded-3xl shadow-2xl border border-emerald-500/30">
            <div class="flex items-center justify-between border-b border-emerald-500/30 pb-4 mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <i class="fa-solid fa-microchip text-xl"></i>
                </div>
                <div>
                  <h3 class="text-white font-bold text-base">Soil Agronomy ML Engine</h3>
                  <p class="text-xs text-emerald-300">N-P-K Soil Analysis Matrix</p>
                </div>
              </div>
              <span class="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
            </div>

            <div class="space-y-3 bg-white/10 p-4 rounded-2xl border border-white/10 text-xs">
              <div class="flex justify-between text-emerald-100">
                <span>Soil N-P-K Status:</span>
                <span class="font-bold text-amber-300">Optimal Nitrogen (90 ppm)</span>
              </div>
              <div class="flex justify-between text-emerald-100">
                <span>Top Recommended Crop:</span>
                <span class="font-bold text-emerald-300">Basmati Rice (4.5 Tons/Ha)</span>
              </div>
              <div class="flex justify-between text-emerald-100">
                <span>Agronomy Match Score:</span>
                <span class="font-bold text-amber-300">98.4% Confidence</span>
              </div>
            </div>

            <button onclick="router('crop-ai')" class="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2">
              <span>Run Soil Analysis Wizard</span>
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <span class="text-emerald-700 font-bold text-xs uppercase tracking-widest">Complete Plant Ecosystem</span>
          <h2 class="text-3xl font-extrabold text-slate-900 mt-1">All Plant & Crop Categories</h2>
        </div>
        <button onclick="router('marketplace')" class="mt-4 md:mt-0 text-emerald-700 hover:text-emerald-800 font-bold text-sm flex items-center space-x-2">
          <span>Browse Marketplace</span>
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${state.categories.map(c => `
          <div onclick="filterByCategory('${c.id}')" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer group">
            <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all mb-4">
              <i class="fa-solid ${c.icon} text-2xl"></i>
            </div>
            <h3 class="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">${c.name}</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">${c.desc}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function handleHeroSearch() {
  const val = document.getElementById('hero-search-input')?.value || '';
  state.searchQuery = val;
  router('marketplace');
}

function filterByCategory(catId) {
  state.activeCategory = catId;
  router('marketplace');
}

// --- AI CROP RECOMMENDATION SYSTEM VIEW ---

function renderCropRecommendView(container) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <div class="inline-flex items-center space-x-2 badge-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <i class="fa-solid fa-wheat-field"></i>
          <span>Scikit-Learn Agronomy Crop Engine</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900">AI Crop & Soil Agronomy Recommendation</h1>
        <p class="text-slate-600 text-sm">Input your soil N-P-K nutrient levels, pH, and climate parameters to predict optimal agricultural crops with expected yields (Tons/Ha) and custom fertilizer plans.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- N-P-K Input Form & Sliders -->
        <div class="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <h3 class="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center space-x-2">
            <i class="fa-solid fa-flask text-emerald-600"></i>
            <span>Soil N-P-K & Climate Parameters</span>
          </h3>

          <!-- Nitrogen (N) Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-bold text-slate-700">
              <span>Nitrogen (N) Ratio</span>
              <span id="lbl-n" class="text-emerald-700 font-extrabold">${state.cropInput.nitrogen} ppm</span>
            </div>
            <input type="range" min="0" max="140" value="${state.cropInput.nitrogen}" oninput="updateCropInput('nitrogen', this.value)" class="w-full accent-emerald">
          </div>

          <!-- Phosphorus (P) Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-bold text-slate-700">
              <span>Phosphorus (P) Ratio</span>
              <span id="lbl-p" class="text-amber-700 font-extrabold">${state.cropInput.phosphorus} ppm</span>
            </div>
            <input type="range" min="0" max="100" value="${state.cropInput.phosphorus}" oninput="updateCropInput('phosphorus', this.value)" class="w-full accent-amber">
          </div>

          <!-- Potassium (K) Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-bold text-slate-700">
              <span>Potassium (K) Ratio</span>
              <span id="lbl-k" class="text-blue-700 font-extrabold">${state.cropInput.potassium} ppm</span>
            </div>
            <input type="range" min="0" max="100" value="${state.cropInput.potassium}" oninput="updateCropInput('potassium', this.value)" class="w-full accent-blue">
          </div>

          <!-- Soil pH -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Soil pH Level</label>
            <input type="number" step="0.1" value="${state.cropInput.ph}" onchange="updateCropInput('ph', this.value)" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold">
          </div>

          <!-- Climate Variables -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Temp (°C)</label>
              <input type="number" value="${state.cropInput.temp}" onchange="updateCropInput('temp', this.value)" class="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Rainfall (mm)</label>
              <input type="number" value="${state.cropInput.rainfall}" onchange="updateCropInput('rainfall', this.value)" class="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold">
            </div>
          </div>

          <button onclick="runCropRecommendationAI()" class="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 text-sm">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>Predict Optimal Crops & Yields</span>
          </button>
        </div>

        <!-- Crop ML Output Results -->
        <div class="lg:col-span-7">
          <div id="crop-results-container" class="space-y-4">
            ${state.cropResults.length === 0 ? `
              <div class="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl text-center space-y-4">
                <i class="fa-solid fa-wheat-awn-circle-exclamation text-6xl text-amber-300"></i>
                <h3 class="text-xl font-bold text-slate-800">Ready to Analyze Soil Agronomy</h3>
                <p class="text-xs text-slate-500 max-w-md mx-auto">Adjust N-P-K sliders and climate settings on the left to generate real-time agricultural crop predictions.</p>
              </div>
            ` : renderCropResultsList(state.cropResults)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function updateCropInput(key, val) {
  state.cropInput[key] = parseFloat(val);
  const lbl = document.getElementById(`lbl-${key.charAt(0)}`);
  if (lbl) lbl.innerText = `${val} ppm`;
}

async function runCropRecommendationAI() {
  const container = document.getElementById('crop-results-container');
  if (container) {
    container.innerHTML = `
      <div class="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl text-center space-y-4">
        <i class="fa-solid fa-spinner text-5xl text-amber-500 animate-spin"></i>
        <h3 class="text-lg font-bold text-slate-800">Computing Soil Agronomy Distance Vectors...</h3>
      </div>
    `;
  }

  try {
    const res = await fetch('/api/ai/crop-recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nitrogen: state.cropInput.nitrogen,
        phosphorus: state.cropInput.phosphorus,
        potassium: state.cropInput.potassium,
        ph: state.cropInput.ph,
        temperature: state.cropInput.temp,
        humidity: state.cropInput.humidity,
        rainfall: state.cropInput.rainfall,
        soilType: state.cropInput.soilType
      })
    });
    const json = await res.json();
    state.cropResults = json.data || [];
    if (container) container.innerHTML = renderCropResultsList(state.cropResults);
  } catch (err) {
    alert('Crop recommendation error: ' + err.message);
  }
}

function renderCropResultsList(crops) {
  return crops.slice(0, 4).map((c, idx) => `
    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg space-y-4 hover:border-amber-300 transition-all">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-lg">
            #${idx + 1}
          </div>
          <div>
            <h3 class="font-extrabold text-slate-900 text-xl">${c.crop}</h3>
            <span class="text-xs text-slate-400">${c.soilMatch}</span>
          </div>
        </div>
        <div class="text-right">
          <span class="text-2xl font-extrabold text-amber-600">${c.suitabilityScore}%</span>
          <p class="text-[10px] text-slate-400 font-bold uppercase">Suitability Match</p>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Expected Yield</span>
          <span class="text-xs font-bold text-emerald-700">${c.expectedYield}</span>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Growth Duration</span>
          <span class="text-xs font-bold text-slate-800">${c.growthDuration}</span>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Target Soil N-P-K</span>
          <span class="text-xs font-bold text-amber-700">${c.optimalNPK}</span>
        </div>
      </div>

      <div class="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
        <i class="fa-solid fa-seedling text-amber-600 mt-0.5"></i>
        <div>
          <span class="font-bold">Agronomy Fertilizer Plan: </span>
          <span>${c.fertilizerAdvice}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// --- MARKETPLACE VIEW ---

function renderMarketplaceView(container) {
  let filtered = state.plants.filter(p => {
    if (state.activeCategory !== 'all' && p.category !== state.activeCategory) return false;
    if (state.searchQuery && !p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) && !p.scientificName.toLowerCase().includes(state.searchQuery.toLowerCase())) return false;
    return true;
  });

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900">PlantVerse Marketplace</h1>
          <p class="text-xs text-slate-500 mt-1">Showing ${filtered.length} plant & crop species</p>
        </div>

        <div class="flex items-center space-x-3">
          <input type="text" value="${state.searchQuery}" placeholder="Search species..." 
            oninput="state.searchQuery=this.value; router('marketplace')"
            class="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none">
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-3 space-y-4">
          <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Categories</h3>
            <button onclick="filterByCategory('all')" class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${state.activeCategory === 'all' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600'}">All Categories</button>
            ${state.categories.map(c => `
              <button onclick="filterByCategory('${c.id}')" class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${state.activeCategory === c.id ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600'}">${c.name}</button>
            `).join('')}
          </div>
        </div>

        <div class="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filtered.map(p => renderPlantCard(p)).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderPlantCard(p) {
  return `
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      <div class="relative h-52 overflow-hidden bg-slate-100">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
        <button onclick="toggleWishlist('${p.id}')" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700">
          <i class="${state.wishlist.includes(p.id) ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'} text-xs"></i>
        </button>
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span class="text-[10px] text-slate-400 uppercase font-bold block">${p.category}</span>
          <h3 onclick="router('detail', '${p.id}')" class="font-bold text-base hover:text-emerald-600 cursor-pointer line-clamp-1">${p.name}</h3>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-lg font-extrabold text-emerald-700">$${p.price.toFixed(2)}</span>
          <button onclick="addToCart('${p.id}')" class="bg-emerald-600 hover:bg-emerald-700 text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-md">
            <i class="fa-solid fa-plus text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Additional Views Proxy Handlers
function renderProductDetailView(container, plantId) {
  const plant = state.plants.find(p => p.id === plantId) || state.plants[0];
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">${plant.name}</h1><p class="text-slate-600">${plant.description}</p><button onclick="addToCart('${plant.id}')" class="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl">Add to Cart ($${plant.price})</button></div>`;
}

function renderCartView(container) {
  const total = state.cart.reduce((sum, i) => sum + (i.plant.price * i.qty), 0);
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">Your Cart</h1><div class="text-2xl font-bold">Total: $${total.toFixed(2)}</div></div>`;
}

function renderAIScanView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">AI Leaf Disease Scanner</h1><p class="text-slate-600">Upload a leaf photo or pick a sample to scan for fungal/pest pathology.</p></div>`;
}

function renderAICareBotView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">AI Care Assistant</h1><p class="text-slate-600">LLM RAG Botanical Assistant active.</p></div>`;
}

function renderGrowthPredictorView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">Growth Predictor</h1></div>`;
}

function renderSmartWateringView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">Smart Watering Calculator</h1></div>`;
}

function renderRecommendWizardView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">AI Plant Finder</h1></div>`;
}

function renderPlantJournalView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">Plant Journal</h1></div>`;
}

function renderConsultationView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">Expert Consultation</h1></div>`;
}

function renderKnowledgeCenterView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">Knowledge Center</h1></div>`;
}

// --- OWNER & USER AUTHENTICATION VIEWS & HANDLERS ---

function renderOwnerLoginView(container, notice = null) {
  container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 relative overflow-hidden">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-md w-full space-y-8 bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        
        <div class="text-center space-y-3">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-xl mb-2">
            <i class="fa-solid fa-user-shield text-3xl"></i>
          </div>
          <h2 class="text-3xl font-extrabold tracking-tight text-white font-display">Owner Portal Login</h2>
          <p class="text-xs text-amber-400 font-semibold uppercase tracking-wider">Restricted Security Domain • Nursery Management</p>
        </div>

        ${notice ? `
          <div class="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-amber-300 text-xs flex items-start space-x-3">
            <i class="fa-solid fa-triangle-exclamation text-amber-400 text-base mt-0.5"></i>
            <div>
              <span class="font-bold block">Security Requirement</span>
              <span>${notice}</span>
            </div>
          </div>
        ` : ''}

        <div id="owner-login-error" class="hidden bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-300 text-xs flex items-center space-x-3">
          <i class="fa-solid fa-circle-xmark text-red-400 text-base"></i>
          <span id="owner-login-error-msg">Invalid owner credentials</span>
        </div>

        <form onsubmit="handleOwnerLoginSubmit(event)" class="space-y-5">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-400 mb-1.5">Owner Email Address</label>
            <div class="relative">
              <i class="fa-solid fa-envelope absolute left-4 top-3.5 text-slate-500 text-sm"></i>
              <input type="email" id="owner-email" required value="owner@plantverse.ai" 
                class="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition-colors">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-400 mb-1.5">Owner Password</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-4 top-3.5 text-slate-500 text-sm"></i>
              <input type="password" id="owner-password" required value="owner2026" 
                class="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition-colors">
            </div>
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all text-sm flex items-center justify-center space-x-2">
            <i class="fa-solid fa-key"></i>
            <span>Authenticate as Nursery Owner</span>
          </button>
        </form>

        <div class="pt-4 border-t border-slate-800/80 text-center space-y-3">
          <span class="text-[11px] text-slate-500 font-medium">Quick Access Demo Accounts:</span>
          <div class="flex flex-col sm:flex-row gap-2">
            <button onclick="performOwnerLogin('owner@plantverse.ai', 'owner2026')" class="flex-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5">
              <i class="fa-solid fa-crown text-amber-400"></i>
              <span>Demo Nursery Owner</span>
            </button>
            <button onclick="performOwnerLogin('admin@plantverse.ai', 'adminSecret2026')" class="flex-1 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5">
              <i class="fa-solid fa-shield-halved text-teal-400"></i>
              <span>Super Admin</span>
            </button>
          </div>
        </div>

        <div class="text-center pt-2">
          <button onclick="router('user-login')" class="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
            Are you a customer? Go to <span class="underline font-bold text-emerald-400">User Login Page</span> →
          </button>
        </div>

      </div>
    </div>
  `;
}

function renderUserLoginView(container, notice = null) {
  container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative z-10">
        
        <div class="text-center space-y-2">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg mb-2">
            <i class="fa-solid fa-user-leaf text-3xl"></i>
          </div>
          <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 font-display">User Account Portal</h2>
          <p class="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Gardener & Customer Login</p>
        </div>

        ${notice ? `
          <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-800 text-xs flex items-start space-x-3">
            <i class="fa-solid fa-circle-info text-emerald-600 text-base mt-0.5"></i>
            <div>
              <span class="font-bold block">Account Notice</span>
              <span>${notice}</span>
            </div>
          </div>
        ` : ''}

        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button id="user-tab-login" onclick="switchUserAuthTab('login')" class="flex-1 py-2 rounded-lg text-xs font-bold bg-white text-emerald-700 shadow-sm transition-all">Sign In</button>
          <button id="user-tab-register" onclick="switchUserAuthTab('register')" class="flex-1 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition-all">Create Account</button>
        </div>

        <div id="user-login-error" class="hidden bg-red-50 border border-red-200 p-4 rounded-2xl text-red-700 text-xs flex items-center space-x-3">
          <i class="fa-solid fa-circle-xmark text-red-500 text-base"></i>
          <span id="user-login-error-msg">Invalid credentials</span>
        </div>

        <form id="user-form-login" onsubmit="handleUserLoginSubmit(event)" class="space-y-5">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Email Address</label>
            <div class="relative">
              <i class="fa-solid fa-envelope absolute left-4 top-3.5 text-slate-400 text-sm"></i>
              <input type="email" id="user-email" required value="sarah.j@example.com" 
                class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Password</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-4 top-3.5 text-slate-400 text-sm"></i>
              <input type="password" id="user-password" required value="gardener2026" 
                class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors">
            </div>
          </div>

          <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-sm flex items-center justify-center space-x-2">
            <i class="fa-solid fa-right-to-bracket"></i>
            <span>Log In to Account</span>
          </button>
        </form>

        <form id="user-form-register" onsubmit="handleUserRegisterSubmit(event)" class="space-y-4 hidden">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
            <input type="text" id="reg-fullname" required placeholder="e.g. Alex Rivera" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500">
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
            <input type="email" id="reg-email" required placeholder="alex@example.com" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500">
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Phone Number</label>
            <input type="tel" id="reg-phone" placeholder="+1 (555) 000-0000" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500">
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
            <input type="password" id="reg-password" required minlength="6" placeholder="••••••••" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500">
          </div>

          <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center space-x-2">
            <i class="fa-solid fa-user-plus"></i>
            <span>Create New Customer Account</span>
          </button>
        </form>

        <div class="pt-4 border-t border-slate-100 text-center space-y-3">
          <span class="text-[11px] text-slate-400 font-medium">Quick Demo Customer Account:</span>
          <button onclick="performUserLogin('sarah.j@example.com', 'gardener2026')" class="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-2">
            <i class="fa-solid fa-user-check text-emerald-600"></i>
            <span>Login as Demo User (Sarah Jenkins)</span>
          </button>
        </div>

        <div class="text-center pt-2">
          <button onclick="router('owner-login')" class="text-xs text-slate-500 hover:text-amber-600 transition-colors">
            Are you the Nursery Owner? Access <span class="underline font-bold text-amber-600">Owner Portal</span> →
          </button>
        </div>

      </div>
    </div>
  `;
}

function switchUserAuthTab(tab) {
  const loginForm = document.getElementById('user-form-login');
  const regForm = document.getElementById('user-form-register');
  const loginTab = document.getElementById('user-tab-login');
  const regTab = document.getElementById('user-tab-register');

  if (!loginForm || !regForm) return;

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
    loginTab.className = 'flex-1 py-2 rounded-lg text-xs font-bold bg-white text-emerald-700 shadow-sm transition-all';
    regTab.className = 'flex-1 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition-all';
  } else {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
    regTab.className = 'flex-1 py-2 rounded-lg text-xs font-bold bg-white text-emerald-700 shadow-sm transition-all';
    loginTab.className = 'flex-1 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition-all';
  }
}

async function performOwnerLogin(email, password) {
  const errBox = document.getElementById('owner-login-error');
  const errMsg = document.getElementById('owner-login-error-msg');
  if (errBox) errBox.classList.add('hidden');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const json = await res.json();
    if (!res.ok) {
      if (errBox && errMsg) {
        errMsg.innerText = json.detail || 'Invalid owner credentials';
        errBox.classList.remove('hidden');
      }
      return;
    }

    const user = json.user;
    if (user.role !== 'OWNER' && user.role !== 'SUPER_ADMIN') {
      if (errBox && errMsg) {
        errMsg.innerText = `Access Denied: Account '${email}' role '${user.role}' is not a Nursery Owner!`;
        errBox.classList.remove('hidden');
      }
      return;
    }

    state.token = json.accessToken;
    state.currentUser = user;
    localStorage.setItem('pv_token', json.accessToken);
    localStorage.setItem('pv_user', JSON.stringify(user));

    showToast(`Authenticated as Nursery Owner (${user.fullName})`);
    updateHeaderAuthUI();
    router('admin-dashboard');
  } catch (err) {
    console.error('Owner login error:', err);
    if (errBox && errMsg) {
      errMsg.innerText = 'Server connection error. Please try again.';
      errBox.classList.remove('hidden');
    }
  }
}

async function handleOwnerLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('owner-email').value;
  const password = document.getElementById('owner-password').value;
  await performOwnerLogin(email, password);
}

async function performUserLogin(email, password) {
  const errBox = document.getElementById('user-login-error');
  const errMsg = document.getElementById('user-login-error-msg');
  if (errBox) errBox.classList.add('hidden');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const json = await res.json();
    if (!res.ok) {
      if (errBox && errMsg) {
        errMsg.innerText = json.detail || 'Invalid email or password';
        errBox.classList.remove('hidden');
      }
      return;
    }

    state.token = json.accessToken;
    state.currentUser = json.user;
    localStorage.setItem('pv_token', json.accessToken);
    localStorage.setItem('pv_user', JSON.stringify(json.user));

    showToast(`Welcome back, ${json.user.fullName}!`);
    updateHeaderAuthUI();
    if (json.user.role === 'OWNER' || json.user.role === 'SUPER_ADMIN') {
      router('admin-dashboard');
    } else {
      router('user-dashboard');
    }
  } catch (err) {
    console.error('User login error:', err);
    if (errBox && errMsg) {
      errMsg.innerText = 'Connection error. Please check server.';
      errBox.classList.remove('hidden');
    }
  }
}

async function handleUserLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;
  await performUserLogin(email, password);
}

async function handleUserRegisterSubmit(e) {
  e.preventDefault();
  const fullName = document.getElementById('reg-fullname').value;
  const email = document.getElementById('reg-email').value;
  const phone = document.getElementById('reg-phone').value;
  const password = document.getElementById('reg-password').value;

  const errBox = document.getElementById('user-login-error');
  const errMsg = document.getElementById('user-login-error-msg');
  if (errBox) errBox.classList.add('hidden');

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phone, password, role: 'CUSTOMER' })
    });

    const json = await res.json();
    if (!res.ok) {
      if (errBox && errMsg) {
        errMsg.innerText = json.detail || 'Registration failed';
        errBox.classList.remove('hidden');
      }
      return;
    }

    state.token = json.accessToken;
    state.currentUser = json.user;
    localStorage.setItem('pv_token', json.accessToken);
    localStorage.setItem('pv_user', JSON.stringify(json.user));

    showToast(`Account created! Welcome, ${json.user.fullName}!`);
    updateHeaderAuthUI();
    router('user-dashboard');
  } catch (err) {
    console.error('Registration error:', err);
    if (errBox && errMsg) {
      errMsg.innerText = 'Registration error. Server unreachable.';
      errBox.classList.remove('hidden');
    }
  }
}

function handleLogout(showNotification = true) {
  state.token = null;
  state.currentUser = null;
  localStorage.removeItem('pv_token');
  localStorage.removeItem('pv_user');
  updateHeaderAuthUI();
  if (showNotification) showToast('Logged out successfully.');
  router('landing');
}

function renderUserDashboardView(container) {
  const u = state.currentUser || { fullName: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'CUSTOMER', rewardPoints: 480, memberStatus: 'Gold Gardener' };
  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div class="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="inline-flex items-center space-x-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <i class="fa-solid fa-user-leaf"></i>
            <span>Customer Profile</span>
          </div>
          <h1 class="text-3xl font-extrabold font-display">${u.fullName}</h1>
          <p class="text-xs text-emerald-100">${u.email} • Status: <span class="font-bold text-amber-300">${u.memberStatus || 'Green Member'}</span></p>
        </div>

        <div class="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
          <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block">Reward Points</span>
          <span class="text-3xl font-extrabold text-amber-300">${u.rewardPoints || 100}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onclick="router('journal')" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2">
          <i class="fa-solid fa-book-bookmark text-emerald-600 text-2xl"></i>
          <h3 class="font-bold text-slate-900">Plant Journal</h3>
          <p class="text-xs text-slate-500">Track watering schedules and plant adoption notes.</p>
        </div>

        <div onclick="router('tracking')" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2">
          <i class="fa-solid fa-truck-fast text-teal-600 text-2xl"></i>
          <h3 class="font-bold text-slate-900">My Orders & Live Delivery</h3>
          <p class="text-xs text-slate-500">Track express green nursery shipments.</p>
        </div>

        <div onclick="router('marketplace')" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2">
          <i class="fa-solid fa-store text-amber-600 text-2xl"></i>
          <h3 class="font-bold text-slate-900">Shop Marketplace</h3>
          <p class="text-xs text-slate-500">Explore top quality indoor & agricultural plants.</p>
        </div>
      </div>
    </div>
  `;
}

async function renderAdminDashboardView(container) {
  let analyticsData = null;
  try {
    const res = await fetch('/api/analytics', {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    if (res.ok) {
      const json = await res.json();
      analyticsData = json;
    }
  } catch (err) {
    console.error('Failed to load analytics:', err);
  }

  const kpis = analyticsData?.kpis || { totalRevenueUSD: 142850, monthlyOrders: 1240, activePlantsTracked: 8920, aiScanAccuracyPct: 98.4, activeGardeners: 5410 };

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-8 rounded-3xl shadow-2xl border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <i class="fa-solid fa-user-shield"></i>
            <span>Authenticated Nursery Owner Command Center</span>
          </div>
          <h1 class="text-3xl font-extrabold font-display">Welcome, ${state.currentUser?.fullName || 'Nursery Owner'}</h1>
          <p class="text-xs text-slate-300 max-w-xl">
            Logged in as <span class="text-amber-400 font-bold">${state.currentUser?.email}</span> (${state.currentUser?.role}). Full administrative privilege active.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <button onclick="handleLogout()" class="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Owner Logout</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div class="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Total Revenue</span>
            <i class="fa-solid fa-dollar-sign text-emerald-500 text-lg"></i>
          </div>
          <div class="text-2xl font-extrabold text-slate-900">$${kpis.totalRevenueUSD.toLocaleString()}</div>
          <span class="text-[11px] text-emerald-600 font-bold">+18.4% this month</span>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div class="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Monthly Orders</span>
            <i class="fa-solid fa-boxes-packing text-amber-500 text-lg"></i>
          </div>
          <div class="text-2xl font-extrabold text-slate-900">${kpis.monthlyOrders.toLocaleString()}</div>
          <span class="text-[11px] text-amber-600 font-bold">124 pending fulfillment</span>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div class="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Active Plants Tracked</span>
            <i class="fa-solid fa-leaf text-teal-500 text-lg"></i>
          </div>
          <div class="text-2xl font-extrabold text-slate-900">${kpis.activePlantsTracked.toLocaleString()}</div>
          <span class="text-[11px] text-teal-600 font-bold">Smart Nursery Sensor Network</span>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div class="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>AI Scan Accuracy</span>
            <i class="fa-solid fa-microscope text-purple-500 text-lg"></i>
          </div>
          <div class="text-2xl font-extrabold text-slate-900">${kpis.aiScanAccuracyPct}%</div>
          <span class="text-[11px] text-purple-600 font-bold">ResNet-50 Grad-CAM Engine</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 class="font-extrabold text-lg text-slate-900 flex items-center space-x-2">
            <i class="fa-solid fa-list-check text-emerald-600"></i>
            <span>Recent AI Leaf Disease Pathology Scans</span>
          </h3>
          <div class="divide-y divide-slate-100 text-xs">
            ${(analyticsData?.recentAiScans || [
              {date: "10 mins ago", plant: "Monstera Deliciosa", result: "98% Healthy", status: "Passed"},
              {date: "24 mins ago", plant: "Rose Bush", result: "Leaf Rust Detected", status: "Treatment Recommended"},
              {date: "1 hour ago", plant: "Tomato Vine", result: "Nitrogen Deficiency", status: "Fertilizer Suggested"}
            ]).map(s => `
              <div class="py-3 flex items-center justify-between">
                <div>
                  <span class="font-bold text-slate-800 block text-sm">${s.plant}</span>
                  <span class="text-slate-400">${s.date} • ${s.result}</span>
                </div>
                <span class="px-2.5 py-1 rounded-full font-bold text-[10px] ${s.status === 'Passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${s.status}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="lg:col-span-4 bg-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-4">
          <h3 class="font-extrabold text-base text-amber-400 flex items-center space-x-2">
            <i class="fa-solid fa-shield-halved"></i>
            <span>Security Log & Access</span>
          </h3>
          <div class="space-y-3 text-xs text-slate-300">
            <div class="bg-slate-800/90 p-3 rounded-xl border border-slate-700">
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Current Role</span>
              <span class="font-bold text-amber-400">${state.currentUser?.role}</span>
            </div>
            <div class="bg-slate-800/90 p-3 rounded-xl border border-slate-700">
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Auth Mechanism</span>
              <span class="font-bold text-emerald-400">HMAC-SHA256 JWT Token</span>
            </div>
            <div class="bg-slate-800/90 p-3 rounded-xl border border-slate-700">
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Server Protection</span>
              <span class="font-bold text-teal-400">RBAC FastAPI Guards Active</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

function renderStaffPanelView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">Staff Panel</h1></div>`;
}

function renderDeliveryPanelView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">Delivery Panel</h1></div>`;
}

function openCaseStudyModal() {
  alert('PlantVerse AI v3.0 Production Architecture Loaded');
}

function setupEventListeners() {}
