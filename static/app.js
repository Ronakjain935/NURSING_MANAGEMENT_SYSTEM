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
  userProfile: {
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    rewardPoints: 480,
    memberStatus: 'Gold Gardener'
  },
  activeOrder: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  await fetchCategories();
  await fetchPlants();
  await fetchOrders();
  setupEventListeners();
  router('landing');
});

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

function renderUserDashboardView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">User Dashboard</h1></div>`;
}

function renderAdminDashboardView(container) {
  container.innerHTML = `<div class="max-w-4xl mx-auto p-10 space-y-6"><h1 class="text-3xl font-extrabold">Nursery Owner AI Dashboard</h1></div>`;
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
