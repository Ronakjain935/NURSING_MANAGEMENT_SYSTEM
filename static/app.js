/**
 * PlantVerse AI v3.0 - Single Page Application (SPA) Client Engine
 * Production-Ready AI-Powered Nursery Management & Plant Care Ecosystem
 */

// Global Application State
const state = {
  currentView: 'landing',
  user: JSON.parse(localStorage.getItem('pv_user')) || {
    userId: 'usr_guest',
    fullName: 'Guest User',
    email: '',
    role: 'CUSTOMER',
    memberStatus: 'Gardener',
    rewardPoints: 100
  },
  token: localStorage.getItem('pv_token') || '',
  cart: JSON.parse(localStorage.getItem('pv_cart')) || [],
  plants: [],
  categories: [],
  selectedPlant: null,
  activeRole: localStorage.getItem('pv_role') || 'CUSTOMER'
};

// Initialize Application on Page Load
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  updateAuthHeaderUI();
  updateCartBadge();
  fetchInitialCatalog();
  
  // Set role selector header
  const roleSelect = document.getElementById('role-selector-header');
  if (roleSelect) {
    roleSelect.value = state.activeRole;
  }
  
  // Handle initial route
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    router(hash);
  } else {
    router('landing');
  }
}

// Client-Side Router
function router(view, params = {}) {
  state.currentView = view;
  window.location.hash = view;
  
  const main = document.getElementById('main-content');
  if (!main) return;

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update navigation active states
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.remove('bg-emerald-50', 'text-emerald-700', 'border', 'border-emerald-200/80', 'shadow-sm', 'font-extrabold');
    el.classList.add('text-slate-600', 'font-semibold');
  });
  
  const activeNav = document.getElementById(`nav-${view}`);
  if (activeNav) {
    activeNav.classList.remove('text-slate-600', 'font-semibold');
    activeNav.classList.add('bg-emerald-50', 'text-emerald-700', 'border', 'border-emerald-200/80', 'shadow-sm', 'font-extrabold');
  }

  // Render view template
  switch (view) {
    case 'landing':
      main.innerHTML = renderLandingView();
      break;
    case 'indian-quiz':
      main.innerHTML = renderIndianQuizView();
      break;
    case 'marketplace':
      main.innerHTML = renderMarketplaceView();
      fetchPlants();
      break;
    case 'ai-scan':
      main.innerHTML = renderAiScanView();
      break;
    case 'ai-bot':
      main.innerHTML = renderAiBotView();
      break;
    case 'watering-calc':
      main.innerHTML = renderWateringCalcView();
      break;
    case 'crop-ai':
      main.innerHTML = renderCropAiView();
      break;
    case 'cart':
      main.innerHTML = renderCartView();
      break;
    case 'dashboard':
    case 'dashboard-customer':
    case 'dashboard-staff':
    case 'dashboard-owner':
    case 'dashboard-expert':
    case 'dashboard-delivery':
    case 'dashboard-super-admin':
      renderRoleDashboard(view);
      break;
    default:
      main.innerHTML = renderLandingView();
  }
}

// Role Switcher Helper
async function switchDemoRole(newRole) {
  state.activeRole = newRole;
  state.user.role = newRole;
  localStorage.setItem('pv_role', newRole);
  
  try {
    const res = await fetch(`/api/auth/demo-switch/${newRole}`, { method: 'POST' });
    const data = await res.json();
    if (data.accessToken && data.user) {
      state.token = data.accessToken;
      state.user = data.user;
      localStorage.setItem('pv_token', data.accessToken);
      localStorage.setItem('pv_user', JSON.stringify(data.user));
      updateAuthHeaderUI();
    }
  } catch (err) {
    console.error('Demo role token error:', err);
  }
  
  const roleTitleMap = {
    'CUSTOMER': 'Customer Portal',
    'NURSERY_STAFF': 'Staff Dispatch',
    'NURSERY_OWNER': 'Owner Analytics',
    'PLANT_EXPERT': 'Expert Workbench',
    'DELIVERY_PARTNER': 'Delivery Route',
    'SUPER_ADMIN': 'Super Admin'
  };
  
  const titleEl = document.getElementById('nav-dashboard-title');
  if (titleEl) {
    titleEl.innerText = roleTitleMap[newRole] || 'Dashboard';
  }

  showToast(`Switched to ${newRole.replace('_', ' ')} Role Mode`, 'info');
  
  if (state.currentView.startsWith('dashboard')) {
    navigateToRoleDashboard();
  }
}

function navigateToRoleDashboard() {
  const role = state.activeRole;
  switch (role) {
    case 'NURSERY_STAFF':
      router('dashboard-staff');
      break;
    case 'NURSERY_OWNER':
      router('dashboard-owner');
      break;
    case 'PLANT_EXPERT':
      router('dashboard-expert');
      break;
    case 'DELIVERY_PARTNER':
      router('dashboard-delivery');
      break;
    case 'SUPER_ADMIN':
      router('dashboard-super-admin');
      break;
    case 'CUSTOMER':
    default:
      router('dashboard-customer');
      break;
  }
}

// --- VIEW RENDERERS ---

// 1. LANDING PAGE
function renderLandingView() {
  return `
    <div class="space-y-20 pb-20">
      
      <!-- SaaS Hero Section -->
      <section class="relative overflow-hidden bg-slate-950 text-white rounded-b-[40px] pt-16 pb-28 shadow-2xl">
        <div class="absolute inset-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div class="space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold px-4 py-2 rounded-full">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>v3.0 Commercial AI Platform for Indian Nurseries</span>
            </div>
            
            <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight font-display">
              India's Most Intelligent <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">AI Plant Ecosystem</span>
            </h1>
            
            <p class="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Transforming plant care and commercial nursery operations across India. Powered by PyTorch leaf computer vision, Groq LLaMA-3 RAG,Penman-Monteith ET irrigation, and real-time weather integration.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button onclick="router('indian-quiz')" class="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>Take Indian AI Plant Fit Quiz</span>
              </button>
              <button onclick="router('ai-scan')" class="w-full sm:w-auto bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-camera-viewfinder text-emerald-400"></i>
                <span>Scan Leaf Disease</span>
              </button>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0">
              <div>
                <span class="block text-2xl font-extrabold text-white">48+</span>
                <span class="text-[11px] text-slate-400">Nurseries Onboarded</span>
              </div>
              <div>
                <span class="block text-2xl font-extrabold text-amber-400">98.4%</span>
                <span class="text-[11px] text-slate-400">AI Scan Accuracy</span>
              </div>
              <div>
                <span class="block text-2xl font-extrabold text-emerald-400">50K+</span>
                <span class="text-[11px] text-slate-400">Plants Tracked</span>
              </div>
            </div>

          </div>

          <!-- Hero Image & Interactive Card -->
          <div class="relative">
            <div class="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/90 p-4">
              <img src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80" alt="Smart Nursery" class="w-full h-80 object-cover rounded-2xl">
              
              <!-- Floating AI Diagnosis Pill -->
              <div class="absolute bottom-8 left-8 right-8 glass-dark p-4 rounded-2xl border border-emerald-500/30 flex items-center space-x-4 shadow-2xl">
                <div class="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
                  <i class="fa-solid fa-microchip"></i>
                </div>
                <div>
                  <span class="block text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Grad-CAM Vision</span>
                  <span class="block text-sm font-extrabold text-white">Monstera Chlorosis Detected</span>
                  <span class="block text-[11px] text-slate-300">98.2% Match — Organic Neem Recommended</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- 15 Solved Indian Problems Carousel/Grid -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <span class="text-xs font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">Indian Agriculture & Urban Care</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">Solving Real Problems for Indian Gardeners & Nurseries</h2>
          <p class="text-sm text-slate-600">Specially engineered to overcome North Indian summer heatwaves, Western monsoons, apartment balcony space constraints, and high TDS water.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md hover-lift space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl font-bold">
              <i class="fa-solid fa-sun"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900">Extreme Heatwave Survival</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              AI evaluates city temperatures (40°C+ in Delhi, Rajasthan) and generates dynamic shade-cloth and double-misting schedules to prevent leaf sunburn.
            </p>
          </div>

          <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md hover-lift space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center text-2xl font-bold">
              <i class="fa-solid fa-building"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900">1BHK & 2BHK Balcony Fits</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Filters low-root depth, compact, non-invasive plants optimized for small balcony railings and low ambient sunlight conditions.
            </p>
          </div>

          <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md hover-lift space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
              <i class="fa-solid fa-wind"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900">Urban AQI Air Purifiers</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Calibrated to NASA air purification standards. Recommends top Areca Palm, Snake Plant & Money Plant sets tailored to city pollution levels.
            </p>
          </div>

        </div>
      </section>

      <!-- Role Portals Callout -->
      <section class="bg-gradient-to-r from-emerald-900 to-teal-900 text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 shadow-2xl relative overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="space-y-4 text-center md:text-left">
            <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest">Multi-Role Enterprise Ecosystem</span>
            <h2 class="text-3xl font-extrabold tracking-tight font-display">Dedicated Portals for Every Stakeholder</h2>
            <p class="text-slate-300 text-xs sm:text-sm max-w-xl">
              Experience custom dashboard workflows engineered specifically for Nursery Owners, Plant Experts, Delivery Partners, Staff, and Gardeners.
            </p>
          </div>
          <button onclick="navigateToRoleDashboard()" class="bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all">
            Open My Role Dashboard
          </button>
        </div>
      </section>

    </div>
  `;
}

// 2. INDIAN AI PLANT FIT QUIZ
function renderIndianQuizView() {
  return `
    <div class="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      <div class="text-center space-y-3">
        <span class="text-xs font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">AI Recommendation Wizard</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">Find Your Ideal Plant for Indian Conditions</h1>
        <p class="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Input your city, balcony sun exposure, space, and tap water TDS to receive customized species recommendations.
        </p>
      </div>

      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <form id="indian-quiz-form" onsubmit="handleIndianQuizSubmit(event)" class="space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Indian City</label>
              <select id="quiz-city" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500">
                <option value="New Delhi">New Delhi (Dry Extreme Summer & High AQI)</option>
                <option value="Mumbai">Mumbai (High Coastal Humidity & Monsoon)</option>
                <option value="Bengaluru">Bengaluru (Moderate Pleasant Climate)</option>
                <option value="Jaipur">Jaipur (Hot Semi-Arid Heatwaves)</option>
                <option value="Kolkata">Kolkata (Humid Tropical Monsoon)</option>
                <option value="Hyderabad">Hyderabad (Warm Dry-Humid Mix)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Balcony Sunlight</label>
              <select id="quiz-sun" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500">
                <option value="Direct Sun (4-6 Hours)">Direct Harsh Sunlight (4-6+ Hours)</option>
                <option value="Indirect Bright Light">Bright Indirect Light (Covered Balcony)</option>
                <option value="Shade / Low Light">Shade / Low Light (North Facing / Indoor)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Space / Apartment Layout</label>
              <select id="quiz-space" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500">
                <option value="1BHK Compact Balcony">1BHK Compact Balcony Railing</option>
                <option value="2BHK Medium Balcony">2BHK Medium Balcony & Living Window</option>
                <option value="Independent Villa Garden">Independent House Terrace / Yard</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tap Water Hardness (TDS)</label>
              <select id="quiz-tds" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500">
                <option value="350">Medium Hard Water (300 - 400 PPM TDS)</option>
                <option value="550">High Hard Saline Water (500+ PPM TDS)</option>
                <option value="150">RO / Soft Pure Water (&lt; 200 PPM TDS)</option>
              </select>
            </div>

          </div>

          <div class="flex items-center space-x-6 pt-2">
            <label class="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
              <input type="checkbox" id="quiz-pet" class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500">
              <span>Pet-Friendly Safe Plants Only (Cats & Dogs)</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
              <input type="checkbox" id="quiz-aqi" checked class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500">
              <span>Prioritize Air Purifiers (NASA AQI Index)</span>
            </label>
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2">
            <i class="fa-solid fa-sparkles"></i>
            <span>Calculate AI Plant Recommendations</span>
          </button>

        </form>
      </div>

      <!-- Quiz Output Container -->
      <div id="quiz-results-container" class="space-y-6 hidden">
        <!-- Rendered dynamically -->
      </div>

    </div>
  `;
}

async function handleIndianQuizSubmit(e) {
  e.preventDefault();
  const city = document.getElementById('quiz-city').value;
  const sun = document.getElementById('quiz-sun').value;
  const space = document.getElementById('quiz-space').value;
  const tds = parseInt(document.getElementById('quiz-tds').value);
  const pet = document.getElementById('quiz-pet').checked;
  const aqi = document.getElementById('quiz-aqi').checked;

  const container = document.getElementById('quiz-results-container');
  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
      <div class="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs font-bold text-slate-600">Evaluating AI vector matrices against ${city} climate dataset...</p>
    </div>
  `;

  try {
    const res = await fetch('/api/ai/indian-fit-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: city,
        balconySun: sun,
        experience: 'Beginner',
        petFriendly: pet,
        spaceSize: space,
        hardWaterTds: tds,
        aqiFocus: aqi,
        maxBudget: 2500.0
      })
    });

    const data = await res.json();
    if (data.status === 'success' && data.data) {
      renderQuizResults(data.data, city);
    }
  } catch (err) {
    showToast('Failed to run AI quiz: ' + err.message, 'error');
  }
}

function renderQuizResults(plants, city) {
  const container = document.getElementById('quiz-results-container');
  if (!container) return;

  let html = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-extrabold text-slate-900 font-display">Top AI Species Matches for ${city}</h3>
        <span class="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">${plants.length} Species Analyzed</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  `;

  plants.slice(0, 4).forEach(p => {
    html += `
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-md hover-lift">
        <div class="flex items-start space-x-4">
          <img src="${p.image}" alt="${p.name}" class="w-24 h-24 object-cover rounded-2xl shadow-sm">
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">${p.matchScore}% Match</span>
              <span class="text-xs font-extrabold text-slate-900">₹${Math.round(p.price * 50)}</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 mt-1">${p.name}</h4>
            <p class="text-[11px] text-slate-400 italic">${p.scientificName}</p>
            <p class="text-xs text-emerald-700 font-medium mt-2 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
              <i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i> ${p.indianFitReason || 'Great fit!'}
            </p>
          </div>
        </div>
        <button onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.image}')" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5">
          <i class="fa-solid fa-bag-shopping"></i>
          <span>Add to Nursery Order</span>
        </button>
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML = html;
}

// 3. MARKETPLACE VIEW
function renderMarketplaceView() {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Marketplace Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">Certified Green Nursery</span>
          <h1 class="text-3xl font-extrabold text-slate-900 font-display">Indian Plants, Saplings & Bio-Fertilizers</h1>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:w-80">
          <i class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400 text-xs"></i>
          <input type="text" id="plant-search-input" onkeyup="filterPlants()" placeholder="Search Tulsi, Neem, Areca Palm..." class="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm">
        </div>
      </div>

      <!-- Categories Filter Tabs -->
      <div class="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none" id="categories-bar">
        <button onclick="selectCategory('all')" class="cat-pill bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm">All Species</button>
        <button onclick="selectCategory('indoor')" class="cat-pill bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 transition-all">Indoor Foliage</button>
        <button onclick="selectCategory('outdoor')" class="cat-pill bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 transition-all">Outdoor & Landscape</button>
        <button onclick="selectCategory('flowering')" class="cat-pill bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 transition-all">Flowering & Orchids</button>
        <button onclick="selectCategory('medicinal')" class="cat-pill bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 transition-all">Medicinal & Tulsi</button>
        <button onclick="selectCategory('pots-tools')" class="cat-pill bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 transition-all">Fertilizers & Bio-Shield</button>
      </div>

      <!-- Plants Grid -->
      <div id="plants-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div class="col-span-full py-12 text-center text-slate-400">Loading verified plant catalog...</div>
      </div>

    </div>
  `;
}

async function fetchPlants() {
  try {
    const res = await fetch('/api/plants/');
    const data = await res.json();
    if (data.status === 'success' && data.data) {
      state.plants = data.data;
      renderPlantsGrid(state.plants);
    }
  } catch (err) {
    showToast('Error loading catalog: ' + err.message, 'error');
  }
}

function renderPlantsGrid(plants) {
  const grid = document.getElementById('plants-grid');
  if (!grid) return;

  if (!plants || plants.length === 0) {
    grid.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400 font-semibold">No plant species match your filter criteria.</div>`;
    return;
  }

  grid.innerHTML = plants.map(p => `
    <div class="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover-lift flex flex-col justify-between">
      <div>
        <div class="relative h-48 overflow-hidden bg-slate-100">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
          <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            ★ ${p.rating}
          </span>
          ${p.airPurificationScore > 90 ? `
            <span class="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
              <i class="fa-solid fa-wind mr-1"></i> NASA AQI 90+
            </span>
          ` : ''}
        </div>
        <div class="p-5 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${p.category}</span>
            <span class="text-xs font-extrabold text-emerald-600">${p.careDifficulty} Care</span>
          </div>
          <h3 class="text-sm font-bold text-slate-900 line-clamp-1">${p.name}</h3>
          <p class="text-[11px] text-slate-400 italic line-clamp-1">${p.scientificName}</p>
          <p class="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">${p.description}</p>
        </div>
      </div>

      <div class="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
        <div>
          <span class="block text-xs font-extrabold text-slate-900">₹${Math.round(p.price * 50)}</span>
          <span class="block text-[9px] text-slate-400 line-through">₹${Math.round((p.originalPrice || p.price * 1.2) * 50)}</span>
        </div>
        <button onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.image}')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center space-x-1.5">
          <i class="fa-solid fa-cart-plus"></i>
          <span>Add</span>
        </button>
      </div>
    </div>
  `).join('');
}

function selectCategory(cat) {
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.remove('bg-emerald-600', 'text-white');
    btn.classList.add('bg-white', 'text-slate-700');
  });

  if (cat === 'all') {
    renderPlantsGrid(state.plants);
  } else {
    const filtered = state.plants.filter(p => p.category === cat);
    renderPlantsGrid(filtered);
  }
}

function filterPlants() {
  const query = document.getElementById('plant-search-input').value.toLowerCase().trim();
  if (!query) {
    renderPlantsGrid(state.plants);
    return;
  }
  const filtered = state.plants.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.scientificName.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  renderPlantsGrid(filtered);
}

// 4. AI LEAF DISEASE SCANNER VIEW
function renderAiScanView() {
  return `
    <div class="max-w-5xl mx-auto px-4 py-10 space-y-8">
      
      <div class="text-center space-y-3">
        <span class="text-xs font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">PyTorch ResNet-50 Computer Vision</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">Leaf Disease Scanner with Grad-CAM Visual Heatmap</h1>
        <p class="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Upload a photo of an unhealthy leaf to detect pathology, view activation heatmaps, and obtain organic & chemical cures.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Upload Card -->
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <h3 class="text-base font-bold text-slate-900 flex items-center space-x-2">
            <i class="fa-solid fa-cloud-arrow-up text-emerald-600"></i>
            <span>Upload Leaf Image</span>
          </h3>

          <div id="drop-zone" onclick="document.getElementById('leaf-file-input').click()" class="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 text-center cursor-pointer bg-slate-50 transition-all space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
              <i class="fa-solid fa-leaf"></i>
            </div>
            <div>
              <span class="block text-xs font-bold text-slate-800">Click to select photo or drag & drop</span>
              <span class="block text-[10px] text-slate-400">Supports JPG, PNG, WEBP (Max 10MB)</span>
            </div>
            <input type="file" id="leaf-file-input" accept="image/*" class="hidden" onchange="handleLeafFileSelect(event)">
          </div>

          <div class="space-y-2">
            <span class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Or Select Sample Test Leaf</span>
            <div class="grid grid-cols-3 gap-2">
              <button onclick="runSampleScan('leaf_rust')" class="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-bold py-2 rounded-xl transition-all">Leaf Rust</button>
              <button onclick="runSampleScan('powdery_mildew')" class="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-bold py-2 rounded-xl transition-all">Powdery Mildew</button>
              <button onclick="runSampleScan('healthy')" class="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-bold py-2 rounded-xl transition-all">Healthy Leaf</button>
            </div>
          </div>

        </div>

        <!-- Results Card -->
        <div id="scan-results-card" class="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 flex flex-col justify-center text-center">
          <div class="space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto">
              <i class="fa-solid fa-camera-viewfinder"></i>
            </div>
            <h3 class="text-base font-bold text-slate-800">No Scan Active</h3>
            <p class="text-xs text-slate-400 max-w-xs mx-auto">Upload an image or click a sample leaf above to run the neural network diagnosis.</p>
          </div>
        </div>

      </div>

    </div>
  `;
}

async function handleLeafFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  renderScanningProgress();

  try {
    const res = await fetch('/api/ai/diagnose', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    renderScanResults(result);
  } catch (err) {
    showToast('Scan error: ' + err.message, 'error');
  }
}

async function runSampleScan(sampleKey) {
  renderScanningProgress();
  try {
    const res = await fetch(`/api/ai/diagnose?filename=${sampleKey}.jpg`, { method: 'POST' });
    const result = await res.json();
    renderScanResults(result);
  } catch (err) {
    showToast('Scan error: ' + err.message, 'error');
  }
}

function renderScanningProgress() {
  const card = document.getElementById('scan-results-card');
  if (!card) return;
  card.innerHTML = `
    <div class="space-y-4 py-8 text-center">
      <div class="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <span class="block text-xs font-extrabold text-slate-800">PyTorch ResNet-50 Analyzing Pixel Matrix...</span>
      <span class="block text-[11px] text-slate-400">Computing Grad-CAM gradient activations</span>
    </div>
  `;
}

function renderScanResults(data) {
  const card = document.getElementById('scan-results-card');
  if (!card) return;

  const isHealthy = data.detectedDisease && data.detectedDisease.toLowerCase().includes('healthy');

  card.innerHTML = `
    <div class="space-y-5 text-left">
      
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span class="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">${data.confidence || 98.4}% AI Confidence</span>
          <h3 class="text-lg font-bold text-slate-900 mt-1">${data.detectedDisease || data.name}</h3>
        </div>
        <span class="text-xs font-bold ${isHealthy ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'} px-3 py-1 rounded-xl">
          ${data.severity || 'Optimal'} Severity
        </span>
      </div>

      <!-- Grad-CAM Overlay Display -->
      ${data.gradcamHeatmapBase64 ? `
        <div class="space-y-2">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Grad-CAM Infection Heatmap</span>
          <div class="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner max-h-56">
            <img src="${data.gradcamHeatmapBase64}" alt="Grad-CAM Overlay" class="w-full h-56 object-cover">
          </div>
        </div>
      ` : ''}

      <!-- Cures & Treatment -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Organic Treatment Protocol</h4>
        <ul class="space-y-1.5 text-xs text-slate-600">
          ${(data.organicTreatment || data.organic || []).map(step => `
            <li class="flex items-start space-x-2">
              <i class="fa-solid fa-leaf text-emerald-600 mt-0.5 text-[10px]"></i>
              <span>${step}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <button onclick="router('marketplace')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Get Recommended Organic Bio-Shield Medicine</span>
      </button>

    </div>
  `;
}

// 5. AI BOTANICAL ASSISTANT (RAG)
function renderAiBotView() {
  return `
    <div class="max-w-4xl mx-auto px-4 py-10 space-y-6">
      
      <div class="text-center space-y-2">
        <span class="text-xs font-extrabold text-teal-600 uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full">Groq LLaMA-3.3 70B RAG Engine</span>
        <h1 class="text-3xl font-extrabold text-slate-900 font-display">AI Botanical Care Assistant</h1>
        <p class="text-xs text-slate-600">Ask any question about houseplant care, N-P-K fertilization, soil mix, or Indian crop agronomy.</p>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[540px]">
        
        <!-- Chat History -->
        <div id="chat-history-box" class="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
          <div class="flex items-start space-x-3">
            <div class="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-slate-200 max-w-lg space-y-2 shadow-sm">
              <p class="text-xs text-slate-800 leading-relaxed">
                Namaste! I am your PlantVerse AI Botanical Expert. How can I help you with your plants or nursery crop soil today?
              </p>
              <div class="flex flex-wrap gap-1.5 pt-1">
                <button onclick="sendQuickChatQuery('How to water Monstera in summer?')" class="text-[10px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200">How to water Monstera in summer?</button>
                <button onclick="sendQuickChatQuery('Best N-P-K fertilizer for Tulsi?')" class="text-[10px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200">Best N-P-K fertilizer for Tulsi?</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input Bar -->
        <div class="p-4 bg-white border-t border-slate-200 flex items-center space-x-3">
          <input type="text" id="chat-input-field" onkeypress="if(event.key==='Enter') sendChatMessage()" placeholder="Ask AI botanical assistant..." class="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500">
          <button onclick="sendChatMessage()" class="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center space-x-1.5">
            <i class="fa-solid fa-paper-plane"></i>
            <span>Send</span>
          </button>
        </div>

      </div>

    </div>
  `;
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input-field');
  const query = input.value.trim();
  if (!query) return;

  input.value = '';
  appendChatBubble('user', query);

  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query })
    });
    const data = await res.json();
    if (data.status === 'success') {
      appendChatBubble('bot', data.reply, data.source, data.suggestedFollowUps);
    }
  } catch (err) {
    showToast('Chat error: ' + err.message, 'error');
  }
}

function sendQuickChatQuery(query) {
  const input = document.getElementById('chat-input-field');
  if (input) {
    input.value = query;
    sendChatMessage();
  }
}

function appendChatBubble(sender, text, source = '', followups = []) {
  const box = document.getElementById('chat-history-box');
  if (!box) return;

  const isUser = sender === 'user';
  const html = `
    <div class="flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}">
      <div class="w-9 h-9 rounded-xl ${isUser ? 'bg-slate-900' : 'bg-teal-600'} text-white flex items-center justify-center font-bold text-sm shrink-0">
        <i class="fa-solid ${isUser ? 'fa-user' : 'fa-robot'}"></i>
      </div>
      <div class="${isUser ? 'bg-emerald-600 text-white' : 'bg-white text-slate-800 border border-slate-200'} p-4 rounded-2xl max-w-lg space-y-2 shadow-sm">
        <p class="text-xs leading-relaxed">${text}</p>
        ${source ? `<span class="block text-[9px] text-slate-400 border-t border-slate-100 pt-1">Source: ${source}</span>` : ''}
        ${followups && followups.length > 0 ? `
          <div class="flex flex-wrap gap-1.5 pt-2">
            ${followups.map(f => `<button onclick="sendQuickChatQuery('${f}')" class="text-[10px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-lg border border-teal-200">${f}</button>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;

  box.insertAdjacentHTML('beforeend', html);
  box.scrollTop = box.scrollHeight;
}

// 6. SMART PENMAN-MONTEITH WATERING CALCULATOR
function renderWateringCalcView() {
  return `
    <div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div class="text-center space-y-3">
        <span class="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">Evapotranspiration Engine</span>
        <h1 class="text-3xl font-extrabold text-slate-900 font-display">Penman-Monteith Smart Water Schedule</h1>
        <p class="text-xs text-slate-600">Calculates precise water volume (ml) and hydration interval based on city weather & humidity.</p>
      </div>

      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <form onsubmit="handleWaterCalc(event)" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">City</label>
            <input type="text" id="water-city" value="New Delhi" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Temperature (°C)</label>
            <input type="number" id="water-temp" value="34" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Humidity (%)</label>
            <input type="number" id="water-hum" value="45" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800">
          </div>
          <div class="md:col-span-3">
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all">
              Calculate Smart Hydration Schedule
            </button>
          </div>
        </form>

        <div id="water-res-box" class="hidden p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-3">
          <!-- Rendered dynamically -->
        </div>
      </div>
    </div>
  `;
}

async function handleWaterCalc(e) {
  e.preventDefault();
  const city = document.getElementById('water-city').value;
  const temp = parseFloat(document.getElementById('water-temp').value);
  const hum = parseFloat(document.getElementById('water-hum').value);

  try {
    const res = await fetch('/api/ai/watering', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plantId: 'monstera-deliciosa', city: city, tempC: temp, humidityPct: hum })
    });
    const data = await res.json();
    if (data.status === 'success' && data.data) {
      const box = document.getElementById('water-res-box');
      box.classList.remove('hidden');
      box.innerHTML = `
        <div class="flex items-center justify-between border-b border-blue-200 pb-3">
          <div>
            <span class="text-xs font-extrabold text-blue-900">${data.data.plantName} — ${city}</span>
            <span class="block text-[11px] text-blue-700">Recommended Water Volume: ${data.data.recommendedWaterMl} ml</span>
          </div>
          <span class="text-xs font-extrabold text-blue-800 bg-blue-200 px-3 py-1 rounded-xl">Interval: Every ${data.data.wateringIntervalDays} Days</span>
        </div>
        <p class="text-xs text-blue-800">Overwatering Risk: ${data.data.overwateringRisk} | Underwatering Risk: ${data.data.underwateringRisk}</p>
      `;
    }
  } catch (err) {
    showToast('Calculation error: ' + err.message, 'error');
  }
}

// 7. CROP AGRONOMY AI
function renderCropAiView() {
  return `
    <div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div class="text-center space-y-3">
        <span class="text-xs font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">Farmer & Orchard Matcher</span>
        <h1 class="text-3xl font-extrabold text-slate-900 font-display">Agricultural Crop Agronomy Recommender</h1>
        <p class="text-xs text-slate-600">Matches soil N-P-K-pH vectors against commercial crop data for maximum yield.</p>
      </div>

      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <form onsubmit="handleCropRecommend(event)" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nitrogen (N)</label>
            <input type="number" id="crop-n" value="90" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phosphorus (P)</label>
            <input type="number" id="crop-p" value="42" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Potassium (K)</label>
            <input type="number" id="crop-k" value="43" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Soil pH</label>
            <input type="number" step="0.1" id="crop-ph" value="6.5" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold">
          </div>
          <div class="col-span-full">
            <button type="submit" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-md">
              Recommend Optimal Farm Crops
            </button>
          </div>
        </form>

        <div id="crop-res-grid" class="hidden grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      </div>
    </div>
  `;
}

async function handleCropRecommend(e) {
  e.preventDefault();
  const n = parseFloat(document.getElementById('crop-n').value);
  const p = parseFloat(document.getElementById('crop-p').value);
  const k = parseFloat(document.getElementById('crop-k').value);
  const ph = parseFloat(document.getElementById('crop-ph').value);

  try {
    const res = await fetch('/api/ai/crop-recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nitrogen: n, phosphorus: p, potassium: k, ph: ph })
    });
    const data = await res.json();
    if (data.status === 'success' && data.data) {
      const grid = document.getElementById('crop-res-grid');
      grid.classList.remove('hidden');
      grid.innerHTML = data.data.slice(0, 4).map(c => `
        <div class="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-amber-900">${c.crop}</h4>
            <span class="text-xs font-extrabold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">${c.suitabilityScore}% Suitability</span>
          </div>
          <p class="text-xs text-amber-800">Expected Yield: ${c.expectedYield} | Duration: ${c.growthDuration}</p>
          <p class="text-[11px] text-amber-700 italic">${c.fertilizerAdvice}</p>
        </div>
      `).join('');
    }
  } catch (err) {
    showToast('Crop AI error: ' + err.message, 'error');
  }
}

// 8. CART & RAZORPAY CHECKOUT
function renderCartView() {
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalINR = Math.round(total * 50);

  return `
    <div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 class="text-3xl font-extrabold text-slate-900 font-display">Shopping Cart (${state.cart.length} items)</h1>

      ${state.cart.length === 0 ? `
        <div class="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <p class="text-sm font-bold text-slate-600">Your cart is currently empty.</p>
          <button onclick="router('marketplace')" class="bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl">Browse Plant Catalog</button>
        </div>
      ` : `
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div class="divide-y divide-slate-100">
            ${state.cart.map((item, idx) => `
              <div class="py-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl">
                  <div>
                    <h4 class="text-sm font-bold text-slate-900">${item.name}</h4>
                    <span class="text-xs font-semibold text-emerald-600">₹${Math.round(item.price * 50)} x ${item.qty}</span>
                  </div>
                </div>
                <button onclick="removeFromCart(${idx})" class="text-red-500 hover:text-red-700 text-xs font-bold"><i class="fa-solid fa-trash"></i></button>
              </div>
            `).join('')}
          </div>

          <div class="border-t border-slate-200 pt-4 flex items-center justify-between">
            <span class="text-sm font-bold text-slate-700">Total Amount:</span>
            <span class="text-xl font-extrabold text-slate-900">₹${totalINR}</span>
          </div>

          <button onclick="openRazorpayCheckoutModal(${totalINR})" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm py-4 rounded-2xl shadow-xl flex items-center justify-center space-x-2">
            <i class="fa-solid fa-lock"></i>
            <span>Proceed to Razorpay Checkout</span>
          </button>
        </div>
      `}
    </div>
  `;
}

function addToCart(id, name, price, image) {
  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id, name, price, image, qty: 1 });
  }
  localStorage.setItem('pv_cart', JSON.stringify(state.cart));
  updateCartBadge();
  showToast(`Added ${name} to Cart`, 'success');
}

function removeFromCart(idx) {
  state.cart.splice(idx, 1);
  localStorage.setItem('pv_cart', JSON.stringify(state.cart));
  updateCartBadge();
  router('cart');
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  if (count > 0) {
    badge.innerText = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// 9. ROLE DASHBOARD RENDERER
async function renderRoleDashboard(view) {
  const main = document.getElementById('main-content');
  if (!main) return;

  let endpoint = '/api/dashboard/customer';
  let roleTitle = 'Customer Portal';

  if (view === 'dashboard-staff' || state.activeRole === 'NURSERY_STAFF') {
    endpoint = '/api/dashboard/staff';
    roleTitle = 'Nursery Staff Dispatch Queue';
  } else if (view === 'dashboard-owner' || state.activeRole === 'NURSERY_OWNER') {
    endpoint = '/api/dashboard/owner';
    roleTitle = 'Nursery Owner Revenue & Demand Heatmap';
  } else if (view === 'dashboard-expert' || state.activeRole === 'PLANT_EXPERT') {
    endpoint = '/api/dashboard/expert';
    roleTitle = 'Plant Expert Tele-Consultation Workbench';
  } else if (view === 'dashboard-delivery' || state.activeRole === 'DELIVERY_PARTNER') {
    endpoint = '/api/dashboard/delivery';
    roleTitle = 'Delivery Partner Route Navigation';
  } else if (view === 'dashboard-super-admin' || state.activeRole === 'SUPER_ADMIN') {
    endpoint = '/api/dashboard/super-admin';
    roleTitle = 'Super Admin Platform Command Center';
  }

  main.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">${roleTitle}</h1>
        <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">Role: ${state.activeRole}</span>
      </div>
      <div id="role-dashboard-content" class="space-y-6">
        <div class="bg-white p-8 rounded-3xl border border-slate-200 text-center">Loading dashboard telemetry...</div>
      </div>
    </div>
  `;

  try {
    const res = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    const data = await res.json();
    if (data.status === 'success') {
      renderRoleDashboardContent(data);
    } else {
      const content = document.getElementById('role-dashboard-content');
      if (content) {
        content.innerHTML = `
          <div class="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold mx-auto">
              <i class="fa-solid fa-lock"></i>
            </div>
            <h3 class="text-lg font-extrabold text-slate-900 font-display">Access Restricted</h3>
            <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">${data.detail || `Please Sign In or Create an Account with ${state.activeRole.replace('_', ' ')} role to view this dashboard.`}</p>
            <div class="flex items-center justify-center space-x-3 pt-2">
              <button onclick="openAuthModal('${state.activeRole}', 'login')" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all">
                Sign In as ${state.activeRole.replace('_', ' ')}
              </button>
              <button onclick="openAuthModal('${state.activeRole}', 'register')" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all">
                Create Account
              </button>
            </div>
          </div>
        `;
      }
    }
  } catch (err) {
    showToast('Error loading dashboard: ' + err.message, 'error');
  }
}

function renderRoleDashboardContent(data) {
  const content = document.getElementById('role-dashboard-content');
  if (!content) return;

  const kpis = data.kpis || data.systemKpis || {};
  let kpiCardsHtml = '<div class="grid grid-cols-2 md:grid-cols-4 gap-4">';
  
  for (const [key, val] of Object.entries(kpis)) {
    kpiCardsHtml += `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${key.replace(/([A-Z])/g, ' $1')}</span>
        <span class="block text-xl font-extrabold text-slate-900">${val}</span>
      </div>
    `;
  }
  kpiCardsHtml += '</div>';

  let detailHtml = '';
  
  if (data.role === 'CUSTOMER') {
    detailHtml = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 class="text-base font-bold text-slate-900">My Digital Garden Twin</h3>
          <div class="space-y-3">
            ${(data.myGarden || []).map(g => `
              <div class="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-bold text-slate-800">${g.name}</h4>
                  <span class="text-[10px] text-slate-500">${g.location}</span>
                </div>
                <span class="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">${g.health}% Health</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 class="text-base font-bold text-slate-900">Care Reminders</h3>
          <div class="space-y-3">
            ${(data.careReminders || []).map(r => `
              <div class="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-bold text-amber-900">${r.plant}</h4>
                  <span class="text-[10px] text-amber-700">${r.action}</span>
                </div>
                <span class="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">${r.due}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (data.role === 'NURSERY_OWNER') {
    detailHtml = `
      <div class="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
        <h3 class="text-base font-bold text-slate-900">90-Day Demand Forecast Heatmap</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${(data.demandForecastHeatmap || []).map(m => `
            <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <span class="text-xs font-extrabold text-emerald-900">${m.month}</span>
              <span class="block text-lg font-extrabold text-emerald-700">₹${m.predictedSalesINR.toLocaleString()}</span>
              <span class="text-[10px] text-emerald-800">Category: ${m.highDemandCategory}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (data.role === 'SUPER_ADMIN') {
    detailHtml = `
      <div class="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
        <h3 class="text-base font-bold text-slate-900">Security Audit Logs</h3>
        <div class="space-y-2">
          ${(data.recentAuditLogs || []).map(l => `
            <div class="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-slate-800">${l.action}</span>
                <span class="text-slate-500 ml-2">by ${l.actor} (${l.role})</span>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">${l.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    detailHtml = `
      <div class="bg-white p-6 rounded-3xl border border-slate-200 text-slate-600 text-xs font-semibold">
        Operational queue actively updated in real time for ${data.role} session.
      </div>
    `;
  }

  content.innerHTML = kpiCardsHtml + detailHtml;
}

// 10. AUTH & SECURITY MODALS
function openAuthModal(targetRole = 'CUSTOMER', defaultTab = 'login') {
  if (targetRole) {
    state.activeRole = targetRole;
  }
  const container = document.getElementById('modal-container');
  if (!container) return;

  const roleTitleMap = {
    'CUSTOMER': 'User Portal',
    'NURSERY_OWNER': 'Nursery Owner Portal',
    'NURSERY_STAFF': 'Nursery Staff Dispatch',
    'PLANT_EXPERT': 'Plant Expert Workbench',
    'DELIVERY_PARTNER': 'Delivery Partner Navigation',
    'SUPER_ADMIN': 'Super Admin Governance'
  };

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full shadow-2xl relative space-y-6 animate-toast">
      <button onclick="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>

      <div class="text-center space-y-2">
        <h3 class="text-xl font-extrabold text-slate-900 font-display">${roleTitleMap[targetRole] || 'PlantVerse AI Portal'}</h3>
        <p class="text-xs text-slate-500">Sign in to your account or register a new account.</p>
      </div>

      <!-- Tab Switcher -->
      <div class="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
        <button id="auth-tab-login" onclick="switchAuthTab('login')" class="flex-1 py-2 rounded-lg text-center transition-all ${defaultTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}">
          Sign In
        </button>
        <button id="auth-tab-register" onclick="switchAuthTab('register')" class="flex-1 py-2 rounded-lg text-center transition-all ${defaultTab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}">
          Create Account
        </button>
      </div>

      <!-- Login Form -->
      <form id="auth-form-login" onsubmit="handleModalLogin(event)" class="space-y-4 ${defaultTab === 'login' ? '' : 'hidden'}">
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address</label>
          <input type="email" id="login-email" value="${targetRole === 'NURSERY_OWNER' ? 'owner@plantverse.ai' : (targetRole === 'SUPER_ADMIN' ? 'rjainabr@gmail.com' : '')}" placeholder="user@plantverse.ai" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Password</label>
          <input type="password" id="login-password" value="8209829945" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
        </div>
        
        <button type="submit" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all">
          Sign In as ${targetRole.replace('_', ' ')}
        </button>
      </form>

      <!-- Registration Form -->
      <form id="auth-form-register" onsubmit="handleModalRegister(event)" class="space-y-3 ${defaultTab === 'register' ? '' : 'hidden'}">
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
          <input type="text" id="reg-name" placeholder="Rahul Sharma" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address</label>
          <input type="email" id="reg-email" placeholder="rahul@example.com" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mobile Phone</label>
          <input type="tel" id="reg-phone" placeholder="+91 9876543210" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Account Role</label>
          <select id="reg-role" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
            <option value="CUSTOMER" ${targetRole === 'CUSTOMER' ? 'selected' : ''}>🧑‍🌾 Customer / Gardener</option>
            <option value="NURSERY_OWNER" ${targetRole === 'NURSERY_OWNER' ? 'selected' : ''}>🏢 Nursery Owner</option>
            <option value="NURSERY_STAFF" ${targetRole === 'NURSERY_STAFF' ? 'selected' : ''}>📦 Nursery Staff</option>
            <option value="PLANT_EXPERT" ${targetRole === 'PLANT_EXPERT' ? 'selected' : ''}>🩺 Plant Expert</option>
            <option value="DELIVERY_PARTNER" ${targetRole === 'DELIVERY_PARTNER' ? 'selected' : ''}>🚚 Delivery Partner</option>
            <option value="SUPER_ADMIN" ${targetRole === 'SUPER_ADMIN' ? 'selected' : ''}>👑 Super Admin</option>
          </select>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Password</label>
          <input type="password" id="reg-password" placeholder="At least 6 characters" minlength="6" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
        </div>
        
        <button type="submit" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all">
          Create Account
        </button>
      </form>
    </div>
  `;
}

function switchAuthTab(tab) {
  const loginTab = document.getElementById('auth-tab-login');
  const regTab = document.getElementById('auth-tab-register');
  const loginForm = document.getElementById('auth-form-login');
  const regForm = document.getElementById('auth-form-register');

  if (!loginTab || !regTab || !loginForm || !regForm) return;

  if (tab === 'login') {
    loginTab.classList.add('bg-white', 'text-slate-900', 'shadow-sm');
    loginTab.classList.remove('text-slate-500');
    regTab.classList.remove('bg-white', 'text-slate-900', 'shadow-sm');
    regTab.classList.add('text-slate-500');
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
  } else {
    regTab.classList.add('bg-white', 'text-slate-900', 'shadow-sm');
    regTab.classList.remove('text-slate-500');
    loginTab.classList.remove('bg-white', 'text-slate-900', 'shadow-sm');
    loginTab.classList.add('text-slate-500');
    regForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

async function handleModalLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.accessToken && data.user) {
      state.token = data.accessToken;
      state.user = data.user;
      state.activeRole = data.user.role;
      localStorage.setItem('pv_token', data.accessToken);
      localStorage.setItem('pv_user', JSON.stringify(data.user));
      localStorage.setItem('pv_role', data.user.role);

      updateAuthHeaderUI();
      closeModal();
      showToast(`Welcome back, ${data.user.fullName}!`, 'success');
      navigateToRoleDashboard();
    } else {
      showToast('Login failed: ' + (data.detail || 'Invalid credentials'), 'error');
    }
  } catch (err) {
    showToast('Login failed: ' + err.message, 'error');
  }
}

async function handleModalRegister(e) {
  e.preventDefault();
  const fullName = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const phone = document.getElementById('reg-phone').value;
  const role = document.getElementById('reg-role').value;
  const password = document.getElementById('reg-password').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phone, role, password })
    });
    const data = await res.json();
    if (res.ok && data.accessToken && data.user) {
      state.token = data.accessToken;
      state.user = data.user;
      state.activeRole = data.user.role;
      localStorage.setItem('pv_token', data.accessToken);
      localStorage.setItem('pv_user', JSON.stringify(data.user));
      localStorage.setItem('pv_role', data.user.role);

      updateAuthHeaderUI();
      closeModal();
      showToast(`Account created successfully! Welcome, ${data.user.fullName}`, 'success');
      navigateToRoleDashboard();
    } else {
      showToast('Registration failed: ' + (data.detail || 'Error creating account'), 'error');
    }
  } catch (err) {
    showToast('Registration failed: ' + err.message, 'error');
  }
}

function updateAuthHeaderUI() {
  const container = document.getElementById('auth-header-container');
  if (!container) return;

  if (state.token && state.user && state.user.email) {
    container.innerHTML = `
      <div class="flex items-center space-x-2">
        <button onclick="navigateToRoleDashboard()" class="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition-all">
          <i class="fa-solid fa-user-circle text-emerald-600 text-sm"></i>
          <span>${state.user.fullName.split(' ')[0]}</span>
        </button>
        <button onclick="handleLogout()" title="Log out" class="text-slate-400 hover:text-red-500 text-xs p-2 rounded-lg transition-colors"><i class="fa-solid fa-right-from-bracket"></i></button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button onclick="openAuthModal('CUSTOMER')" class="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-xs font-extrabold px-3.5 py-2.5 rounded-xl transition-all shadow-sm whitespace-nowrap">
        <i class="fa-solid fa-user text-emerald-600"></i>
        <span>User Login</span>
      </button>
      <button onclick="openAuthModal('NURSERY_OWNER')" class="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 text-xs font-extrabold px-3.5 py-2.5 rounded-xl shadow-sm transition-all whitespace-nowrap">
        <i class="fa-solid fa-user-shield text-amber-400"></i>
        <span>Owner Login</span>
      </button>
    `;
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function handleLogout() {
  state.token = '';
  state.user = { userId: 'usr_guest', fullName: 'Guest', role: 'CUSTOMER' };
  localStorage.removeItem('pv_token');
  localStorage.removeItem('pv_user');
  location.reload();
}

function closeModal() {
  const container = document.getElementById('modal-container');
  if (container) container.classList.add('hidden');
}

function openRazorpayCheckoutModal(totalINR) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full shadow-2xl relative space-y-6">
      <button onclick="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>

      <div class="text-center space-y-2">
        <span class="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Razorpay Gateway Test Mode</span>
        <h3 class="text-xl font-extrabold text-slate-900 font-display">Pay ₹${totalINR}</h3>
        <p class="text-xs text-slate-500">Instant UPI, Credit Card & Netbanking Verification</p>
      </div>

      <form onsubmit="handleCheckoutSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
          <input type="text" id="chk-name" value="${state.user.fullName || 'Gardener'}" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold">
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Delivery Address</label>
          <input type="text" id="chk-addr" value="Flat 402, Green Glen Layout, Bengaluru" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold">
        </div>
        
        <button type="submit" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md">
          Verify & Place Nursery Order
        </button>
      </form>
    </div>
  `;
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('chk-name').value;
  const addr = document.getElementById('chk-addr').value;

  try {
    const res = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name,
        email: state.user.email || 'customer@plantverse.ai',
        address: addr,
        items: state.cart,
        paymentMethod: 'Razorpay UPI'
      })
    });
    const data = await res.json();
    if (data.status === 'success') {
      state.cart = [];
      localStorage.setItem('pv_cart', JSON.stringify([]));
      updateCartBadge();
      closeModal();
      showToast('Order successfully placed and verified via Razorpay!', 'success');
      router('dashboard-customer');
    }
  } catch (err) {
    showToast('Checkout error: ' + err.message, 'error');
  }
}

// 11. TOAST NOTIFICATIONS
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const bgMap = {
    success: 'bg-emerald-900 border-emerald-500 text-emerald-100',
    error: 'bg-red-900 border-red-500 text-red-100',
    info: 'bg-slate-900 border-slate-700 text-slate-100'
  };

  const toast = document.createElement('div');
  toast.className = `animate-toast pointer-events-auto p-4 rounded-2xl border ${bgMap[type] || bgMap.info} shadow-2xl flex items-center space-x-3 max-w-sm text-xs font-semibold`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-info text-blue-400'} text-base"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function fetchInitialCatalog() {
  fetch('/api/plants/').then(r => r.json()).then(d => {
    if (d.status === 'success') state.plants = d.data;
  }).catch(() => {});
}
