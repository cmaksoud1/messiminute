/* ============================================
   PREDICT26 — Main JavaScript (ES6 Classes)
   All JS uses ES6 classes as required
   ============================================ */

// ========== YOUR API KEY ==========
// Replace with your actual API-Football key
const API_KEY = 'ad8f85c07673f75c4fea70fe580302aa';
const API_HOST = 'v3.football.api-sports.io';
const WC_LEAGUE_ID = 1; // FIFA World Cup
const WC_SEASON = 2022;

// ============================================
// CLASS: SidebarManager
// Handles the collapsible sidebar (unique requirement)
// The sidebar collapses on screens smaller than 992px
// and can be toggled via the hamburger button
// ============================================
class SidebarManager {
  constructor() {
    this.sidebar = document.getElementById('sidebar');
    this.overlay = document.getElementById('sidebarOverlay');
    this.toggleBtn = document.getElementById('sidebarToggle');
    this.closeBtn = document.getElementById('sidebarClose');
    this.init();
  }

  init() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }
    // Close sidebar on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.sidebar) {
      this.sidebar.classList.toggle('active');
      this.overlay.classList.toggle('active');
    }
  }

  close() {
    if (this.sidebar) {
      this.sidebar.classList.remove('active');
      this.overlay.classList.remove('active');
    }
  }
}

// ============================================
// CLASS: CountdownTimer
// Displays countdown to the World Cup Final
// ============================================
class CountdownTimer {
  constructor() {
    // World Cup 2026 Final: July 19, 2026 at MetLife Stadium
    this.targetDate = new Date('2026-07-19T20:00:00-04:00');
    this.daysEl = document.getElementById('countDays');
    this.hoursEl = document.getElementById('countHours');
    this.minsEl = document.getElementById('countMins');
    this.secsEl = document.getElementById('countSecs');
    if (this.daysEl) {
      this.start();
    }
  }

  start() {
    this.update();
    setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date();
    const diff = this.targetDate - now;

    if (diff <= 0) {
      this.daysEl.textContent = '00';
      this.hoursEl.textContent = '00';
      this.minsEl.textContent = '00';
      this.secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    this.daysEl.textContent = String(days).padStart(2, '0');
    this.hoursEl.textContent = String(hours).padStart(2, '0');
    this.minsEl.textContent = String(mins).padStart(2, '0');
    this.secsEl.textContent = String(secs).padStart(2, '0');
  }
}

// ============================================
// CLASS: APIService
// Handles all API-Football requests
// ============================================
class APIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = `https://${API_HOST}`;
  }

  async fetchData(endpoint, params = {}) {
    const url = new URL(`https://v3.football.api-sports.io${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-apisports-key': this.apiKey,
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Fetch Error:', error);
      throw error;
    }
  }

  async getMatches() {
    return this.fetchData('/fixtures', {
      league: WC_LEAGUE_ID,
      season: WC_SEASON
    });
  }

  async getTeams() {
    return this.fetchData('/teams', {
      league: WC_LEAGUE_ID,
      season: WC_SEASON
    });
  }

  async searchTeam(teamName) {
    return this.fetchData('/teams', {
      search: teamName
    });
  }

  async getStandings() {
    return this.fetchData('/standings', {
      league: WC_LEAGUE_ID,
      season: WC_SEASON
    });
  }
}

// ============================================
// CLASS: MatchRenderer
// Renders match cards in the DOM
// ============================================
class MatchRenderer {
  constructor(containerId, loadingId, errorId, emptyId) {
    this.container = document.getElementById(containerId);
    this.loading = document.getElementById(loadingId);
    this.error = document.getElementById(errorId);
    this.empty = document.getElementById(emptyId);
  }

  showLoading() {
    if (this.loading) this.loading.classList.remove('d-none');
    if (this.error) this.error.classList.add('d-none');
    if (this.empty) this.empty.classList.add('d-none');
    if (this.container) this.container.classList.add('d-none');
  }

  showError() {
    if (this.loading) this.loading.classList.add('d-none');
    if (this.error) this.error.classList.remove('d-none');
    if (this.empty) this.empty.classList.add('d-none');
    if (this.container) this.container.classList.add('d-none');
  }

  showEmpty() {
    if (this.loading) this.loading.classList.add('d-none');
    if (this.error) this.error.classList.add('d-none');
    if (this.empty) this.empty.classList.remove('d-none');
    if (this.container) this.container.classList.add('d-none');
  }

  showContent() {
    if (this.loading) this.loading.classList.add('d-none');
    if (this.error) this.error.classList.add('d-none');
    if (this.empty) this.empty.classList.add('d-none');
    if (this.container) this.container.classList.remove('d-none');
  }

  renderMatches(matches) {
    if (!this.container) return;
    this.container.innerHTML = '';

    matches.forEach(match => {
      const fixture = match.fixture;
      const teams = match.teams;
      const goals = match.goals;
      const statusShort = fixture.status.short;

      let statusClass = 'upcoming';
      let statusText = 'Upcoming';

      if (['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'].includes(statusShort)) {
        statusClass = 'live';
        statusText = 'LIVE';
      } else if (['FT', 'AET', 'PEN'].includes(statusShort)) {
        statusClass = 'finished';
        statusText = 'Finished';
      }

      const matchDate = new Date(fixture.date);
      const dateStr = matchDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const scoreHTML = goals.home !== null
        ? `<span class="match-score">${goals.home} - ${goals.away}</span>`
        : `<span class="match-vs">VS</span>`;

      const card = document.createElement('div');
      card.className = 'match-card';
      card.setAttribute('data-status', statusShort);
      card.setAttribute('data-home', teams.home.name.toLowerCase());
      card.setAttribute('data-away', teams.away.name.toLowerCase());

      card.innerHTML = `
        <span class="match-status ${statusClass}">${statusText}</span>
        <div class="match-teams">
          <div class="match-team">
            <img src="${teams.home.logo}" alt="${teams.home.name}" class="team-logo">
            <span class="team-name">${teams.home.name}</span>
          </div>
          ${scoreHTML}
          <div class="match-team">
            <img src="${teams.away.logo}" alt="${teams.away.name}" class="team-logo">
            <span class="team-name">${teams.away.name}</span>
          </div>
        </div>
        <p class="match-info">${dateStr} • ${fixture.venue?.name || 'TBD'}</p>
      `;

      this.container.appendChild(card);
    });
  }
}

// ============================================
// CLASS: PredictionManager
// Handles user predictions with localStorage
// ============================================
class PredictionManager {
  constructor() {
    this.predictions = this.loadPredictions();
  }

  loadPredictions() {
    const saved = localStorage.getItem('predict26_predictions');
    return saved ? JSON.parse(saved) : {};
  }

  savePredictions() {
    localStorage.setItem('predict26_predictions', JSON.stringify(this.predictions));
  }

  setPrediction(matchId, teamId) {
    this.predictions[matchId] = teamId;
    this.savePredictions();
    this.updateScore();
  }

  getPrediction(matchId) {
    return this.predictions[matchId] || null;
  }

  updateScore() {
    const totalEl = document.getElementById('totalScore');
    const countEl = document.getElementById('totalPredictions');
    if (totalEl) {
      totalEl.textContent = Object.keys(this.predictions).length;
    }
    if (countEl) {
      countEl.textContent = Object.keys(this.predictions).length;
    }
  }

  renderPredictionCards(matches, container) {
    if (!container) return;
    container.innerHTML = '';

    matches.forEach(match => {
      const fixture = match.fixture;
      const teams = match.teams;
      const goals = match.goals;
      const statusShort = fixture.status.short;
      const prediction = this.getPrediction(fixture.id);

      let statusClass = 'upcoming';
      let statusText = 'Upcoming';

      if (['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'].includes(statusShort)) {
        statusClass = 'live';
        statusText = 'LIVE';
      } else if (['FT', 'AET', 'PEN'].includes(statusShort)) {
        statusClass = 'finished';
        statusText = 'Finished';
      }

      const matchDate = new Date(fixture.date);
      const dateStr = matchDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const scoreHTML = goals.home !== null
        ? `<span class="match-score">${goals.home} - ${goals.away}</span>`
        : `<span class="match-vs">VS</span>`;

      // Determine prediction result for finished matches
      let homeClass = prediction === teams.home.id ? 'selected' : '';
      let awayClass = prediction === teams.away.id ? 'selected' : '';
      let drawClass = prediction === 'draw' ? 'selected' : '';

      if (statusClass === 'finished' && prediction) {
        const homeWon = goals.home > goals.away;
        const awayWon = goals.away > goals.home;
        const isDraw = goals.home === goals.away;

        if (prediction === teams.home.id) {
          homeClass = homeWon ? 'correct' : 'wrong';
        } else if (prediction === teams.away.id) {
          awayClass = awayWon ? 'correct' : 'wrong';
        } else if (prediction === 'draw') {
          drawClass = isDraw ? 'correct' : 'wrong';
        }
      }

      const isFinished = statusClass === 'finished';
      const disabledAttr = isFinished ? 'disabled' : '';

      const card = document.createElement('div');
      card.className = 'prediction-card';
      card.setAttribute('data-status', statusShort);
      card.setAttribute('data-home', teams.home.name.toLowerCase());
      card.setAttribute('data-away', teams.away.name.toLowerCase());

      card.innerHTML = `
        <span class="match-status ${statusClass}">${statusText}</span>
        <div class="match-teams">
          <div class="match-team">
            <img src="${teams.home.logo}" alt="${teams.home.name}" class="team-logo">
            <span class="team-name">${teams.home.name}</span>
          </div>
          ${scoreHTML}
          <div class="match-team">
            <img src="${teams.away.logo}" alt="${teams.away.name}" class="team-logo">
            <span class="team-name">${teams.away.name}</span>
          </div>
        </div>
        <p class="match-info">${dateStr}</p>
        <div class="prediction-actions">
          <button class="btn-predict ${homeClass}" ${disabledAttr}
            onclick="app.predict(${fixture.id}, ${teams.home.id})">${teams.home.name}</button>
          <button class="btn-predict ${drawClass}" ${disabledAttr}
            onclick="app.predict(${fixture.id}, 'draw')">Draw</button>
          <button class="btn-predict ${awayClass}" ${disabledAttr}
            onclick="app.predict(${fixture.id}, ${teams.away.id})">${teams.away.name}</button>
        </div>
      `;

      container.appendChild(card);
    });
  }
}

// ============================================
// CLASS: TeamDatabase
// Curated data — 16+ real team items (assignment requirement)
// ============================================
class TeamDatabase {
  constructor() {
    this.teams = [
      {
        name: "Argentina",
        flag: "🇦🇷",
        region: "South America",
        rating: "contender",
        ratingLabel: "🏆 Contender",
        keyPlayer: "Lionel Messi",
        hotTake: "The defending champions and MY team. Messi at 39 might be playing his last World Cup, and La Scaloneta will fight to the death for him. Back-to-back? Absolutely possible. 🐐",
        group: "TBD"
      },
      {
        name: "Spain",
        flag: "🇪🇸",
        region: "Europe",
        rating: "contender",
        ratingLabel: "🏆 Contender",
        keyPlayer: "Lamine Yamal",
        hotTake: "Euro 2024 champions with the youngest, most exciting squad in the world. Yamal + Pedri + Gavi = Barça DNA running through the national team. My second favorite. Visca! 🇪🇸",
        group: "TBD"
      },
      {
        name: "France",
        flag: "🇫🇷",
        region: "Europe",
        rating: "contender",
        ratingLabel: "🏆 Contender",
        keyPlayer: "Kylian Mbappé",
        hotTake: "Always dangerous but always drama. Mbappé is a monster, but can France's ego fit in one locker room? They'll either win it all or implode. No in between.",
        group: "TBD"
      },
      {
        name: "Brazil",
        flag: "🇧🇷",
        region: "South America",
        rating: "contender",
        ratingLabel: "🏆 Contender",
        keyPlayer: "Vinicius Jr.",
        hotTake: "Five-time champions always show up when it matters. Vinicius Jr. is the most exciting player on the planet, but Brazil's defense gives me anxiety. Samba football is back though.",
        group: "TBD"
      },
      {
        name: "England",
        flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        region: "Europe",
        rating: "contender",
        ratingLabel: "🏆 Contender",
        keyPlayer: "Jude Bellingham",
        hotTake: "It's never coming home. I said what I said. Incredible squad on paper but they find new ways to disappoint every single tournament. Bellingham can't carry them alone. 💀",
        group: "TBD"
      },
      {
        name: "Germany",
        flag: "🇩🇪",
        region: "Europe",
        rating: "dark-horse",
        ratingLabel: "🐴 Dark Horse",
        keyPlayer: "Florian Wirtz",
        hotTake: "Die Mannschaft is rebuilding and Wirtz is the real deal. After embarrassing group exits recently, they have something to prove. Never count out German efficiency.",
        group: "TBD"
      },
      {
        name: "Portugal",
        flag: "🇵🇹",
        region: "Europe",
        rating: "dark-horse",
        ratingLabel: "🐴 Dark Horse",
        keyPlayer: "Cristiano Ronaldo",
        hotTake: "Ronaldo at 41 in a World Cup? Respect the dedication but it's time to pass the torch. Portugal has incredible depth now — they might be better without him starting. Hot take, I know.",
        group: "TBD"
      },
      {
        name: "Netherlands",
        flag: "🇳🇱",
        region: "Europe",
        rating: "dark-horse",
        ratingLabel: "🐴 Dark Horse",
        keyPlayer: "Xavi Simons",
        hotTake: "Total football is alive and well. Xavi Simons is a baller and this Dutch team has the perfect mix of youth and experience. Semi-finals at minimum.",
        group: "TBD"
      },
      {
        name: "Mexico",
        flag: "🇲🇽",
        region: "North America",
        rating: "dark-horse",
        ratingLabel: "🐴 Dark Horse",
        keyPlayer: "Santiago Giménez",
        hotTake: "Co-hosts with home advantage and passionate fans. Can they finally break the Round of 16 curse? Playing at home might just be the push they need. ¡Vamos México!",
        group: "TBD"
      },
      {
        name: "USA",
        flag: "🇺🇸",
        region: "North America",
        rating: "dark-horse",
        ratingLabel: "🐴 Dark Horse",
        keyPlayer: "Christian Pulisic",
        hotTake: "Home nation advantage is REAL. Pulisic leading the charge in front of American crowds? The hype will be insane. They could surprise a lot of people. Quarter-finals is realistic.",
        group: "TBD"
      },
      {
        name: "Japan",
        flag: "🇯🇵",
        region: "Asia",
        rating: "underdog",
        ratingLabel: "🔥 Underdog",
        keyPlayer: "Takefusa Kubo",
        hotTake: "The giant killers. Beat Germany and Spain in 2022, and they've only gotten better. Japanese precision + European league experience = dangerous. Watch out.",
        group: "TBD"
      },
      {
        name: "Morocco",
        flag: "🇲🇦",
        region: "Africa",
        rating: "underdog",
        ratingLabel: "🔥 Underdog",
        keyPlayer: "Achraf Hakimi",
        hotTake: "2022 semi-finalists who proved Africa belongs at the top table. Hakimi is world class, the defense is rock solid, and they play with insane heart. Don't sleep on the Atlas Lions.",
        group: "TBD"
      },
      {
        name: "South Korea",
        flag: "🇰🇷",
        region: "Asia",
        rating: "underdog",
        ratingLabel: "🔥 Underdog",
        keyPlayer: "Son Heung-min",
        hotTake: "Son is one of the best in the world and he'll give everything. South Korea always fights — remember 2002? They can upset anyone on their day.",
        group: "TBD"
      },
      {
        name: "Canada",
        flag: "🇨🇦",
        region: "North America",
        rating: "wild-card",
        ratingLabel: "🃏 Wild Card",
        keyPlayer: "Alphonso Davies",
        hotTake: "Co-hosts with Davies tearing down the left flank at home? Yes please. First World Cup since 1986 and they'll have the crowd behind them. Anything can happen.",
        group: "TBD"
      },
      {
        name: "Saudi Arabia",
        flag: "🇸🇦",
        region: "Asia",
        rating: "wild-card",
        ratingLabel: "🃏 Wild Card",
        keyPlayer: "Salem Al-Dawsari",
        hotTake: "They beat Argentina in 2022. ARGENTINA. Al-Dawsari scored one of the greatest World Cup goals ever. Never underestimate Saudi football. They have nothing to lose.",
        group: "TBD"
      },
      {
        name: "Senegal",
        flag: "🇸🇳",
        region: "Africa",
        rating: "underdog",
        ratingLabel: "🔥 Underdog",
        keyPlayer: "Sadio Mané",
        hotTake: "AFCON champions with incredible talent across European leagues. Physical, fast, and organized. Senegal is the team nobody wants to face in the group stage.",
        group: "TBD"
      },
      {
        name: "Colombia",
        flag: "🇨🇴",
        region: "South America",
        rating: "dark-horse",
        ratingLabel: "🐴 Dark Horse",
        keyPlayer: "Luis Díaz",
        hotTake: "Luis Díaz is pure magic on the wing. Colombia plays with passion and flair — when they're on, they can beat anyone. Copa América 2024 finalists for a reason.",
        group: "TBD"
      },
      {
        name: "Croatia",
        flag: "🇭🇷",
        region: "Europe",
        rating: "dark-horse",
        ratingLabel: "🐴 Dark Horse",
        keyPlayer: "Luka Modrić",
        hotTake: "Modrić is eternal. Finalist in 2018, third in 2022 — Croatia just refuses to lose. The smallest country with the biggest heart. Post-Modrić era is scary though.",
        group: "TBD"
      }
    ];
  }

  getAll() {
    return this.teams;
  }

  filterByRegion(region) {
    if (region === 'all') return this.teams;
    return this.teams.filter(t => t.region === region);
  }

  filterByRating(rating) {
    if (rating === 'all') return this.teams;
    return this.teams.filter(t => t.rating === rating);
  }

  search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return this.teams;
    return this.teams.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.region.toLowerCase().includes(q) ||
      t.keyPlayer.toLowerCase().includes(q)
    );
  }

  filter(query, region, rating) {
    let results = this.teams;

    if (query) {
      const q = query.toLowerCase().trim();
      results = results.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q) ||
        t.keyPlayer.toLowerCase().includes(q)
      );
    }

    if (region && region !== 'all') {
      results = results.filter(t => t.region === region);
    }

    if (rating && rating !== 'all') {
      results = results.filter(t => t.rating === rating);
    }

    return results;
  }
}

// ============================================
// CLASS: TeamRenderer
// Renders team cards from curated data
// ============================================
class TeamRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(teams) {
    if (!this.container) return;
    this.container.innerHTML = '';

    if (teams.length === 0) {
      this.container.innerHTML = `
        <div class="empty-container">
          <p class="empty-icon">🔍</p>
          <p class="empty-text">No teams match your search.</p>
        </div>
      `;
      return;
    }

    teams.forEach(team => {
      const card = document.createElement('div');
      card.className = 'team-card';

      card.innerHTML = `
        <div class="team-card-header">
          <span class="team-flag">${team.flag}</span>
          <div>
            <h4 class="team-card-name">${team.name}</h4>
            <span class="team-card-region">${team.region}</span>
          </div>
        </div>
        <span class="team-rating-badge ${team.rating}">${team.ratingLabel}</span>
        <p class="team-hot-take">"${team.hotTake}"</p>
        <p class="team-key-player">⭐ Key Player: <strong>${team.keyPlayer}</strong></p>
      `;

      this.container.appendChild(card);
    });
  }
}

// ============================================
// CLASS: App
// Main application controller
// ============================================
class App {
  constructor() {
    this.sidebarManager = new SidebarManager();
    this.countdown = new CountdownTimer();
    this.api = new APIService(API_KEY);
    this.predictionManager = new PredictionManager();
    this.teamDatabase = new TeamDatabase();
    this.matchesData = [];
    this.init();
  }

  init() {
    // Determine which page we're on
    const path = window.location.pathname;

    if (path.includes('predictions.html')) {
      this.initPredictionsPage();
    } else if (path.includes('teams.html')) {
      this.initTeamsPage();
    } else {
      // Home page
      this.loadMatches();
    }

    // Update prediction score in sidebar
    this.predictionManager.updateScore();
  }

  // ---- HOME PAGE ----
  async loadMatches() {
    const renderer = new MatchRenderer('matchesGrid', 'matchesLoading', 'matchesError', 'matchesEmpty');
    renderer.showLoading();

    try {
      const data = await this.api.getMatches();

      if (!data.response || data.response.length === 0) {
        renderer.showEmpty();
        return;
      }

      this.matchesData = data.response;
      // Show first 6 matches
      const displayMatches = data.response.slice(0, 6);
      renderer.renderMatches(displayMatches);
      renderer.showContent();
    } catch (error) {
      console.error('Error loading matches:', error);
      renderer.showError();
    }
  }

  // ---- PREDICTIONS PAGE ----
  initPredictionsPage() {
    this.loadPredictionMatches();
    this.setupPredictionFilters();
  }

  async loadPredictionMatches() {
    const container = document.getElementById('predictionsGrid');
    const loading = document.getElementById('predictLoading');
    const error = document.getElementById('predictError');
    const empty = document.getElementById('predictEmpty');

    if (loading) loading.classList.remove('d-none');
    if (error) error.classList.add('d-none');
    if (empty) empty.classList.add('d-none');
    if (container) container.classList.add('d-none');

    try {
      const data = await this.api.getMatches();

      if (!data.response || data.response.length === 0) {
        if (loading) loading.classList.add('d-none');
        if (empty) empty.classList.remove('d-none');
        return;
      }

      this.matchesData = data.response;
      this.predictionManager.renderPredictionCards(data.response, container);
      if (loading) loading.classList.add('d-none');
      if (container) container.classList.remove('d-none');
    } catch (err) {
      console.error('Error loading prediction matches:', err);
      if (loading) loading.classList.add('d-none');
      if (error) error.classList.remove('d-none');
    }
  }

  setupPredictionFilters() {
    const searchInput = document.getElementById('matchSearch');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
      searchInput.addEventListener('input', () => this.filterPredictions());
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', () => this.filterPredictions());
    }
  }

  filterPredictions() {
    const query = document.getElementById('matchSearch')?.value.toLowerCase() || '';
    const status = document.getElementById('statusFilter')?.value || 'all';
    const cards = document.querySelectorAll('.prediction-card');

    cards.forEach(card => {
      const home = card.getAttribute('data-home');
      const away = card.getAttribute('data-away');
      const cardStatus = card.getAttribute('data-status');

      const matchesSearch = !query || home.includes(query) || away.includes(query);

      let matchesStatus = true;
      if (status === 'NS') {
        matchesStatus = cardStatus === 'NS';
      } else if (status === 'LIVE') {
        matchesStatus = ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'].includes(cardStatus);
      } else if (status === 'FT') {
        matchesStatus = ['FT', 'AET', 'PEN'].includes(cardStatus);
      }

      card.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
    });
  }

  predict(matchId, teamId) {
    this.predictionManager.setPrediction(matchId, teamId);
    // Re-render predictions
    const container = document.getElementById('predictionsGrid');
    if (container && this.matchesData.length > 0) {
      this.predictionManager.renderPredictionCards(this.matchesData, container);
      this.filterPredictions();
    }
  }

  // ---- TEAMS PAGE ----
  initTeamsPage() {
    this.teamRenderer = new TeamRenderer('teamsGrid');
    this.renderTeams();
    this.setupTeamFilters();
    this.setupAPITeamSearch();
  }

  renderTeams(teams = null) {
    const displayTeams = teams || this.teamDatabase.getAll();
    if (this.teamRenderer) {
      this.teamRenderer.render(displayTeams);
    }
    const countEl = document.getElementById('resultsCount');
    if (countEl) {
      countEl.textContent = `Showing ${displayTeams.length} team${displayTeams.length !== 1 ? 's' : ''}`;
    }
  }

  setupTeamFilters() {
    const searchInput = document.getElementById('teamSearch');
    const regionFilter = document.getElementById('regionFilter');
    const ratingFilter = document.getElementById('ratingFilter');

    const applyFilters = () => {
      const query = searchInput?.value || '';
      const region = regionFilter?.value || 'all';
      const rating = ratingFilter?.value || 'all';
      const results = this.teamDatabase.filter(query, region, rating);
      this.renderTeams(results);
    };

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (regionFilter) regionFilter.addEventListener('change', applyFilters);
    if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);
  }

  setupAPITeamSearch() {
    const searchBtn = document.getElementById('apiSearchBtn');
    const searchInput = document.getElementById('apiTeamSearch');

    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.searchAPITeam());
    }

    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.searchAPITeam();
      });
    }
  }

  async searchAPITeam() {
    const input = document.getElementById('apiTeamSearch');
    const loading = document.getElementById('apiTeamLoading');
    const error = document.getElementById('apiTeamError');
    const errorText = document.getElementById('apiTeamErrorText');
    const results = document.getElementById('apiTeamResults');
    const query = input?.value.trim();

    if (!query) return;

    // Show loading
    if (loading) loading.classList.remove('d-none');
    if (error) error.classList.add('d-none');
    if (results) results.classList.add('d-none');

    try {
      const data = await this.api.searchTeam(query);

      if (!data.response || data.response.length === 0) {
        if (loading) loading.classList.add('d-none');
        if (error) error.classList.remove('d-none');
        if (errorText) errorText.textContent = `No team found for "${query}". Try another name.`;
        return;
      }

      // Display first result
      const team = data.response[0].team;
      const venue = data.response[0].venue;

      if (results) {
        results.innerHTML = `
          <div class="api-team-card">
            <img src="${team.logo}" alt="${team.name}" class="api-team-logo">
            <div class="api-team-info">
              <h3>${team.name}</h3>
              <p>${team.country || 'Unknown country'} • Founded: ${team.founded || 'N/A'}</p>
              ${venue ? `<p>🏟️ ${venue.name} (${venue.city}) — Capacity: ${venue.capacity?.toLocaleString() || 'N/A'}</p>` : ''}
              <div class="api-team-stats">
                <div class="api-stat">
                  <span class="api-stat-value">${team.id}</span>
                  <span class="api-stat-label">API ID</span>
                </div>
                <div class="api-stat">
                  <span class="api-stat-value">${team.national ? 'Yes' : 'No'}</span>
                  <span class="api-stat-label">National Team</span>
                </div>
              </div>
            </div>
          </div>
        `;
        results.classList.remove('d-none');
      }

      if (loading) loading.classList.add('d-none');
    } catch (err) {
      console.error('API Team search error:', err);
      if (loading) loading.classList.add('d-none');
      if (error) error.classList.remove('d-none');
      if (errorText) errorText.textContent = 'Failed to fetch team data. Check your API key or try again.';
    }
  }
}

// ============================================
// Initialize the app when DOM is ready
// ============================================
const app = new App();
