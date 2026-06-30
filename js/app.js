/* ============================================
   MESSIMINUTE — Main JavaScript (ES6 Classes)
   All JS uses ES6 classes as required
   ============================================ */

const API_KEY = 'ad8f85c07673f75c4fea70fe580302aa';
const API_HOST = 'v3.football.api-sports.io';

// ============================================
// CLASS: SidebarManager
// Handles the collapsible sidebar (unique requirement)
// The sidebar collapses on screens smaller than 992px
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
    if (this.toggleBtn) this.toggleBtn.addEventListener('click', () => this.toggle());
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.overlay) this.overlay.addEventListener('click', () => this.close());
    window.addEventListener('resize', () => { if (window.innerWidth >= 992) this.close(); });
  }
  toggle() { if (this.sidebar) { this.sidebar.classList.toggle('active'); this.overlay.classList.toggle('active'); } }
  close() { if (this.sidebar) { this.sidebar.classList.remove('active'); this.overlay.classList.remove('active'); } }
}

// ============================================
// CLASS: APIService
// Handles API-Football requests (API requirement)
// ============================================
class APIService {
  constructor(apiKey) { this.apiKey = apiKey; }
  async searchTeam(teamName) {
    const url = new URL('https://' + API_HOST + '/teams');
    url.searchParams.append('search', teamName);
    try {
      const response = await fetch(url, { method:'GET', headers:{ 'x-apisports-key':this.apiKey, 'Accept':'application/json' }, mode:'cors' });
      if (!response.ok) throw new Error('API Error: ' + response.status);
      return await response.json();
    } catch (error) { console.error('API Fetch Error:', error); throw error; }
  }
}

// ============================================
// CLASS: GoalDatabase
// 95 REAL verified Messi goals from MessiStats.com
// One goal per minute: 2' to 90' + stoppage + extra time
// Manually curated & verified by the site creator
// ============================================
class GoalDatabase {
  constructor() {
    this.goals = [
      // ===== FIRST HALF: Minutes 2-45 =====
      { id:1, minute:"2'", minuteNum:2, date:"2023-06-15", opponent:"Australia", result:"Argentina 2-0 Australia", competition:"Friendly", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:2, minute:"3'", minuteNum:3, date:"2018-03-14", opponent:"Chelsea", result:"Barcelona 3-0 Chelsea", competition:"Champions League", team:"FC Barcelona", type:"Field goal", foot:"Right foot" },
      { id:3, minute:"4'", minuteNum:4, date:"2008-10-22", opponent:"FC Basel", result:"FC Basel 0-5 Barcelona", competition:"Champions League", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:4, minute:"5'", minuteNum:5, date:"2013-03-12", opponent:"AC Milan", result:"Barcelona 4-0 AC Milan", competition:"Champions League", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:5, minute:"6'", minuteNum:6, date:"2006-03-01", opponent:"Croatia", result:"Croatia 3-2 Argentina", competition:"Friendly", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:6, minute:"7'", minuteNum:7, date:"2015-08-11", opponent:"Sevilla", result:"Barcelona 5-4 Sevilla", competition:"UEFA Super Cup", team:"FC Barcelona", type:"Free kick", foot:"Left foot" },
      { id:7, minute:"8'", minuteNum:8, date:"2022-06-05", opponent:"Estonia", result:"Argentina 5-0 Estonia", competition:"Friendly", team:"Argentina", type:"Penalty", foot:"Left foot" },
      { id:8, minute:"9'", minuteNum:9, date:"2009-04-08", opponent:"Bayern Munich", result:"Barcelona 4-0 Bayern Munich", competition:"Champions League", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:9, minute:"10'", minuteNum:10, date:"2010-09-07", opponent:"Spain", result:"Argentina 4-1 Spain", competition:"Friendly", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:10, minute:"11'", minuteNum:11, date:"2007-03-10", opponent:"Real Madrid", result:"Barcelona 3-3 Real Madrid", competition:"La Liga", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:11, minute:"12'", minuteNum:12, date:"2013-09-11", opponent:"Paraguay", result:"Paraguay 2-5 Argentina", competition:"WC Qualifier", team:"Argentina", type:"Penalty", foot:"Left foot" },
      { id:12, minute:"13'", minuteNum:13, date:"2009-01-06", opponent:"Atlético Madrid", result:"Atlético Madrid 1-3 Barcelona", competition:"Copa del Rey", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:13, minute:"14'", minuteNum:14, date:"2018-06-26", opponent:"Nigeria", result:"Nigeria 1-2 Argentina", competition:"World Cup", team:"Argentina", type:"Field goal", foot:"Right foot" },
      { id:14, minute:"15'", minuteNum:15, date:"2015-02-08", opponent:"Athletic Bilbao", result:"Athletic Bilbao 2-5 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Free kick", foot:"Left foot" },
      { id:15, minute:"16'", minuteNum:16, date:"2017-03-23", opponent:"Chile", result:"Argentina 1-0 Chile", competition:"WC Qualifier", team:"Argentina", type:"Penalty", foot:"Left foot" },
      { id:16, minute:"17'", minuteNum:17, date:"2026-06-16", opponent:"Algeria", result:"Argentina 3-0 Algeria", competition:"World Cup", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:17, minute:"18'", minuteNum:18, date:"2013-03-02", opponent:"Real Madrid", result:"Real Madrid 2-1 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:18, minute:"19'", minuteNum:19, date:"2025-10-24", opponent:"Nashville SC", result:"Inter Miami 3-1 Nashville SC", competition:"MLS", team:"Inter Miami", type:"Field goal", foot:"Head" },
      { id:19, minute:"20'", minuteNum:20, date:"2015-05-30", opponent:"Athletic Bilbao", result:"Athletic Bilbao 1-3 Barcelona", competition:"Copa del Rey", team:"FC Barcelona", type:"Solo run", foot:"Left foot" },
      { id:20, minute:"21'", minuteNum:21, date:"2016-11-01", opponent:"Manchester City", result:"Manchester City 3-1 Barcelona", competition:"Champions League", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:21, minute:"22'", minuteNum:22, date:"2022-10-05", opponent:"Benfica", result:"Benfica 1-1 PSG", competition:"Champions League", team:"PSG", type:"Field goal", foot:"Left foot" },
      { id:22, minute:"23'", minuteNum:23, date:"2022-12-18", opponent:"France", result:"Argentina 3-3 France (pen 4-2)", competition:"World Cup", team:"Argentina", type:"Penalty", foot:"Left foot" },
      { id:23, minute:"24'", minuteNum:24, date:"2017-03-04", opponent:"Celta de Vigo", result:"Barcelona 5-0 Celta de Vigo", competition:"La Liga", team:"FC Barcelona", type:"Solo run", foot:"Left foot" },
      { id:24, minute:"25'", minuteNum:25, date:"2012-03-24", opponent:"Real Mallorca", result:"Real Mallorca 0-2 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Free kick", foot:"Left foot" },
      { id:25, minute:"26'", minuteNum:26, date:"2023-04-08", opponent:"OGC Nice", result:"OGC Nice 0-2 PSG", competition:"Ligue 1", team:"PSG", type:"Field goal", foot:"Left foot" },
      { id:26, minute:"27'", minuteNum:27, date:"2012-02-19", opponent:"Valencia", result:"Barcelona 5-1 Valencia", competition:"La Liga", team:"FC Barcelona", type:"Rebound", foot:"Left foot" },
      { id:27, minute:"28'", minuteNum:28, date:"2021-02-16", opponent:"PSG", result:"Barcelona 1-4 PSG", competition:"Champions League", team:"FC Barcelona", type:"Penalty", foot:"Left foot" },
      { id:28, minute:"29'", minuteNum:29, date:"2022-10-01", opponent:"OGC Nice", result:"PSG 2-1 OGC Nice", competition:"Ligue 1", team:"PSG", type:"Free kick", foot:"Left foot" },
      { id:29, minute:"30'", minuteNum:30, date:"2018-02-24", opponent:"Girona", result:"Barcelona 6-1 Girona", competition:"La Liga", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:30, minute:"31'", minuteNum:31, date:"2012-06-09", opponent:"Brazil", result:"Argentina 4-3 Brazil", competition:"Friendly", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:31, minute:"32'", minuteNum:32, date:"2018-09-18", opponent:"PSV Eindhoven", result:"Barcelona 4-0 PSV Eindhoven", competition:"Champions League", team:"FC Barcelona", type:"Free kick", foot:"Left foot" },
      { id:32, minute:"33'", minuteNum:33, date:"2010-04-10", opponent:"Real Madrid", result:"Real Madrid 0-2 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Field goal", foot:"Right foot" },
      { id:33, minute:"34'", minuteNum:34, date:"2022-12-13", opponent:"Croatia", result:"Argentina 3-0 Croatia", competition:"World Cup", team:"Argentina", type:"Penalty", foot:"Left foot" },
      { id:34, minute:"35'", minuteNum:35, date:"2015-06-13", opponent:"Paraguay", result:"Argentina 2-2 Paraguay", competition:"Copa América", team:"Argentina", type:"Penalty", foot:"Left foot" },
      { id:35, minute:"36'", minuteNum:36, date:"2009-05-02", opponent:"Real Madrid", result:"Real Madrid 2-6 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:36, minute:"37'", minuteNum:37, date:"2010-11-20", opponent:"UD Almería", result:"UD Almería 0-8 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Rebound", foot:"Left foot" },
      { id:37, minute:"38'", minuteNum:38, date:"2013-04-02", opponent:"PSG", result:"PSG 2-2 Barcelona", competition:"Champions League", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:38, minute:"39'", minuteNum:39, date:"2013-02-03", opponent:"Valencia", result:"Valencia 1-1 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Penalty", foot:"Left foot" },
      { id:39, minute:"40'", minuteNum:40, date:"2023-04-15", opponent:"RC Lens", result:"PSG 3-1 RC Lens", competition:"Ligue 1", team:"PSG", type:"Field goal", foot:"Left foot" },
      { id:40, minute:"41'", minuteNum:41, date:"2012-04-03", opponent:"AC Milan", result:"Barcelona 3-1 AC Milan", competition:"Champions League", team:"FC Barcelona", type:"Penalty", foot:"Left foot" },
      { id:41, minute:"42'", minuteNum:42, date:"2021-06-28", opponent:"Bolivia", result:"Bolivia 1-4 Argentina", competition:"Copa América", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:42, minute:"43'", minuteNum:43, date:"2016-09-01", opponent:"Uruguay", result:"Argentina 1-0 Uruguay", competition:"WC Qualifier", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:43, minute:"44'", minuteNum:44, date:"2022-10-25", opponent:"Maccabi Haifa", result:"PSG 7-2 Maccabi Haifa", competition:"Champions League", team:"PSG", type:"Field goal", foot:"Left foot" },
      { id:44, minute:"45'", minuteNum:45, date:"2011-08-17", opponent:"Real Madrid", result:"Barcelona 3-2 Real Madrid", competition:"Spanish Super Cup", team:"FC Barcelona", type:"Field goal", foot:"Right foot" },

      // ===== SECOND HALF: Minutes 46-90 =====
      { id:45, minute:"46'", minuteNum:46, date:"2015-05-02", opponent:"Córdoba", result:"Córdoba 0-8 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Field goal", foot:"Head" },
      { id:46, minute:"47'", minuteNum:47, date:"2022-06-05", opponent:"Estonia", result:"Argentina 5-0 Estonia", competition:"Friendly", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:47, minute:"48'", minuteNum:48, date:"2019-11-09", opponent:"Celta de Vigo", result:"Barcelona 4-1 Celta de Vigo", competition:"La Liga", team:"FC Barcelona", type:"Free kick", foot:"Left foot" },
      { id:48, minute:"50'", minuteNum:50, date:"2017-03-08", opponent:"PSG", result:"Barcelona 6-1 PSG", competition:"Champions League", team:"FC Barcelona", type:"Penalty", foot:"Left foot" },
      { id:49, minute:"51'", minuteNum:51, date:"2024-04-13", opponent:"Sporting KC", result:"Sporting KC 2-3 Inter Miami", competition:"MLS", team:"Inter Miami", type:"Field goal", foot:"Left foot" },
      { id:50, minute:"52'", minuteNum:52, date:"2013-09-11", opponent:"Paraguay", result:"Paraguay 2-5 Argentina", competition:"WC Qualifier", team:"Argentina", type:"Penalty", foot:"Left foot" },
      { id:51, minute:"53'", minuteNum:53, date:"2011-04-16", opponent:"Real Madrid", result:"Real Madrid 1-1 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Penalty", foot:"Left foot" },
      { id:52, minute:"54'", minuteNum:54, date:"2025-06-19", opponent:"FC Porto", result:"Inter Miami 2-1 FC Porto", competition:"Club World Cup", team:"Inter Miami", type:"Free kick", foot:"Left foot" },
      { id:53, minute:"55'", minuteNum:55, date:"2022-10-29", opponent:"ES Troyes AC", result:"PSG 4-3 ES Troyes AC", competition:"Ligue 1", team:"PSG", type:"Field goal", foot:"Left foot" },
      { id:54, minute:"56'", minuteNum:56, date:"2015-03-08", opponent:"Rayo Vallecano", result:"Barcelona 6-1 Rayo Vallecano", competition:"La Liga", team:"FC Barcelona", type:"Penalty", foot:"Left foot" },
      { id:55, minute:"57'", minuteNum:57, date:"2024-03-02", opponent:"Orlando City", result:"Inter Miami 5-0 Orlando City", competition:"MLS", team:"Inter Miami", type:"Rebound", foot:"Chest" },
      { id:56, minute:"58'", minuteNum:58, date:"2023-02-04", opponent:"Toulouse FC", result:"PSG 2-1 Toulouse FC", competition:"Ligue 1", team:"PSG", type:"Field goal", foot:"Left foot" },
      { id:57, minute:"59'", minuteNum:59, date:"2015-11-24", opponent:"AS Roma", result:"Barcelona 6-1 AS Roma", competition:"Champions League", team:"FC Barcelona", type:"Rebound", foot:"Left foot" },
      { id:58, minute:"60'", minuteNum:60, date:"2011-11-15", opponent:"Colombia", result:"Colombia 1-2 Argentina", competition:"WC Qualifier", team:"Argentina", type:"Rebound", foot:"Left foot" },
      { id:59, minute:"61'", minuteNum:61, date:"2009-11-14", opponent:"Spain", result:"Spain 2-1 Argentina", competition:"Friendly", team:"Argentina", type:"Penalty", foot:"Left foot" },
      { id:60, minute:"62'", minuteNum:62, date:"2024-03-02", opponent:"Orlando City", result:"Inter Miami 5-0 Orlando City", competition:"MLS", team:"Inter Miami", type:"Field goal", foot:"Head" },
      { id:61, minute:"63'", minuteNum:63, date:"2012-09-08", opponent:"Paraguay", result:"Argentina 3-1 Paraguay", competition:"WC Qualifier", team:"Argentina", type:"Free kick", foot:"Left foot" },
      { id:62, minute:"64'", minuteNum:64, date:"2017-03-04", opponent:"Celta de Vigo", result:"Barcelona 5-0 Celta de Vigo", competition:"La Liga", team:"FC Barcelona", type:"Solo run", foot:"Left foot" },
      { id:63, minute:"65'", minuteNum:65, date:"2012-10-13", opponent:"Uruguay", result:"Argentina 3-0 Uruguay", competition:"WC Qualifier", team:"Argentina", type:"Field goal", foot:"Right foot" },
      { id:64, minute:"66'", minuteNum:66, date:"2014-10-14", opponent:"Hong Kong", result:"Hong Kong 0-7 Argentina", competition:"Friendly", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:65, minute:"67'", minuteNum:67, date:"2021-10-19", opponent:"RB Leipzig", result:"PSG 3-2 RB Leipzig", competition:"Champions League", team:"PSG", type:"Rebound", foot:"Left foot" },
      { id:66, minute:"68'", minuteNum:68, date:"2016-06-10", opponent:"Panama", result:"Argentina 5-0 Panama", competition:"Copa América", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:67, minute:"69'", minuteNum:69, date:"2017-09-12", opponent:"Juventus", result:"Barcelona 3-0 Juventus", competition:"Champions League", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:68, minute:"70'", minuteNum:70, date:"2012-08-23", opponent:"Real Madrid", result:"Barcelona 3-2 Real Madrid", competition:"Spanish Super Cup", team:"FC Barcelona", type:"Penalty", foot:"Left foot" },
      { id:69, minute:"71'", minuteNum:71, date:"2011-03-08", opponent:"Arsenal", result:"Barcelona 3-1 Arsenal", competition:"Champions League", team:"FC Barcelona", type:"Penalty", foot:"Left foot" },
      { id:70, minute:"72'", minuteNum:72, date:"2023-01-11", opponent:"Angers SCO", result:"PSG 2-0 Angers SCO", competition:"Ligue 1", team:"PSG", type:"Field goal", foot:"Right foot" },
      { id:71, minute:"73'", minuteNum:73, date:"2022-12-09", opponent:"Netherlands", result:"Netherlands 2-2 Argentina (pen 3-4)", competition:"World Cup", team:"Argentina", type:"Penalty", foot:"Left foot" },
      { id:72, minute:"74'", minuteNum:74, date:"2016-02-03", opponent:"Valencia", result:"Barcelona 7-0 Valencia", competition:"Copa del Rey", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:73, minute:"75'", minuteNum:75, date:"2026-05-09", opponent:"Toronto FC", result:"Toronto FC 2-4 Inter Miami", competition:"MLS", team:"Inter Miami", type:"Field goal", foot:"Left foot" },
      { id:74, minute:"76'", minuteNum:76, date:"2021-12-07", opponent:"Club Brugge", result:"PSG 4-1 Club Brugge", competition:"Champions League", team:"PSG", type:"Penalty", foot:"Left foot" },
      { id:75, minute:"77'", minuteNum:77, date:"2025-08-27", opponent:"Orlando City", result:"Inter Miami 3-1 Orlando City", competition:"CONCACAF Champions Cup", team:"Inter Miami", type:"Penalty", foot:"Left foot" },
      { id:76, minute:"78'", minuteNum:78, date:"2016-06-10", opponent:"Panama", result:"Argentina 5-0 Panama", competition:"Copa América", team:"Argentina", type:"Free kick", foot:"Left foot" },
      { id:77, minute:"79'", minuteNum:79, date:"2012-05-05", opponent:"Espanyol", result:"Barcelona 4-0 Espanyol", competition:"La Liga", team:"FC Barcelona", type:"Penalty", foot:"Left foot" },
      { id:78, minute:"80'", minuteNum:80, date:"2007-05-20", opponent:"Atlético Madrid", result:"Atlético Madrid 0-6 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:79, minute:"81'", minuteNum:81, date:"2025-10-19", opponent:"Nashville SC", result:"Nashville SC 2-5 Inter Miami", competition:"MLS", team:"Inter Miami", type:"Field goal", foot:"Left foot" },
      { id:80, minute:"82'", minuteNum:82, date:"2019-05-01", opponent:"Liverpool", result:"Barcelona 3-0 Liverpool", competition:"Champions League", team:"FC Barcelona", type:"Free kick", foot:"Left foot" },
      { id:81, minute:"83'", minuteNum:83, date:"2009-02-11", opponent:"France", result:"France 0-2 Argentina", competition:"Friendly", team:"Argentina", type:"Solo run", foot:"Left foot" },
      { id:82, minute:"84'", minuteNum:84, date:"2014-03-23", opponent:"Real Madrid", result:"Real Madrid 3-4 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Penalty", foot:"Left foot" },
      { id:83, minute:"85'", minuteNum:85, date:"2012-06-09", opponent:"Brazil", result:"Argentina 4-3 Brazil", competition:"Friendly", team:"Argentina", type:"Solo run", foot:"Left foot" },
      { id:84, minute:"86'", minuteNum:86, date:"2022-08-06", opponent:"Clermont Foot", result:"Clermont Foot 0-5 PSG", competition:"Ligue 1", team:"PSG", type:"Field goal", foot:"Left foot" },
      { id:85, minute:"87'", minuteNum:87, date:"2022-09-27", opponent:"Jamaica", result:"Argentina 3-0 Jamaica", competition:"Friendly", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:86, minute:"88'", minuteNum:88, date:"2015-09-08", opponent:"Mexico", result:"Argentina 2-2 Mexico", competition:"Friendly", team:"Argentina", type:"Field goal", foot:"Left foot" },
      { id:87, minute:"89'", minuteNum:89, date:"2020-01-30", opponent:"Leganés", result:"Barcelona 5-0 Leganés", competition:"Copa del Rey", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:88, minute:"90'", minuteNum:90, date:"2011-02-09", opponent:"Portugal", result:"Argentina 2-1 Portugal", competition:"Friendly", team:"Argentina", type:"Penalty", foot:"Left foot" },

      // ===== STOPPAGE TIME (90+) — Verified from MessiStats =====
      { id:89, minute:"90+1'", minuteNum:91, date:"2008-12-13", opponent:"Real Madrid", result:"Barcelona 2-0 Real Madrid", competition:"La Liga", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:90, minute:"90+2'", minuteNum:92, date:"2017-04-23", opponent:"Real Madrid", result:"Real Madrid 2-3 Barcelona", competition:"La Liga", team:"FC Barcelona", type:"Field goal", foot:"Left foot" },
      { id:91, minute:"90+3'", minuteNum:93, date:"2021-07-03", opponent:"Ecuador", result:"Argentina 3-0 Ecuador", competition:"Copa América", team:"Argentina", type:"Free kick", foot:"Left foot" },
      { id:92, minute:"90+4'", minuteNum:94, date:"2023-07-22", opponent:"Cruz Azul", result:"Cruz Azul 1-2 Inter Miami", competition:"Leagues Cup", team:"Inter Miami", type:"Free kick", foot:"Left foot" },
      { id:93, minute:"90+5'", minuteNum:95, date:"2026-06-22", opponent:"Austria", result:"Argentina 2-0 Austria", competition:"World Cup", team:"Argentina", type:"Rebound", foot:"Left foot" },
      { id:94, minute:"90+6'", minuteNum:96, date:"2025-10-24", opponent:"Nashville SC", result:"Inter Miami 3-1 Nashville SC", competition:"MLS", team:"Inter Miami", type:"Field goal", foot:"Left foot" },

      // ===== EXTRA TIME =====
      { id:95, minute:"108'", minuteNum:108, date:"2022-12-18", opponent:"France", result:"Argentina 3-3 France (pen 4-2)", competition:"World Cup", team:"Argentina", type:"Rebound", foot:"Left foot" },
    ];
  }

  getAll() { return this.goals; }
  getFeatured() { return this.goals.filter(g => [22, 19, 80, 48, 90, 92, 95].includes(g.id)); }

  filter(query, comp, minuteRange, team) {
    let results = this.goals;
    if (query) {
      const q = query.toLowerCase().trim();
      const numQuery = parseInt(q);
      if (!isNaN(numQuery)) {
        results = results.filter(g => g.minuteNum === numQuery || g.minute.startsWith(numQuery + "'"));
      } else {
        results = results.filter(g =>
          g.opponent.toLowerCase().includes(q) ||
          g.competition.toLowerCase().includes(q) ||
          g.result.toLowerCase().includes(q) ||
          g.team.toLowerCase().includes(q) ||
          g.type.toLowerCase().includes(q) ||
          g.minute.includes(q)
        );
      }
    }
    if (comp && comp !== 'all') {
      results = results.filter(g => g.competition.toLowerCase().includes(comp.toLowerCase()));
    }
    if (minuteRange && minuteRange !== 'all') {
      if (minuteRange === '90+') results = results.filter(g => g.minuteNum >= 90 && g.minuteNum <= 100);
      else if (minuteRange === 'extra') results = results.filter(g => g.minuteNum > 100);
      else {
        const [min, max] = minuteRange.split('-').map(Number);
        results = results.filter(g => g.minuteNum >= min && g.minuteNum <= max);
      }
    }
    if (team && team !== 'all') results = results.filter(g => g.team.includes(team));
    return results;
  }
}

// ============================================
// CLASS: GoalRenderer
// ============================================
class GoalRenderer {
  constructor(containerId) { this.container = document.getElementById(containerId); }
  render(goals) {
    if (!this.container) return;
    this.container.innerHTML = '';
    if (goals.length === 0) {
      this.container.innerHTML = '<div class="empty-container"><p class="empty-icon">🔍</p><p class="empty-text">No goals match your filters.</p></div>';
      return;
    }
    goals.forEach(goal => {
      const card = document.createElement('div');
      card.className = 'goal-card';
      card.innerHTML =
        '<div class="goal-minute-badge">' + goal.minute + '</div>' +
        '<span class="goal-comp">' + goal.competition + '</span>' +
        '<h4 class="goal-matchup">' + goal.result + '</h4>' +
        '<p class="goal-date">📅 ' + new Date(goal.date).toLocaleDateString('en-US',{year:"numeric",month:"long",day:"numeric"}) + ' — ' + goal.team + '</p>' +
        '<div class="goal-meta">' +
          '<span class="goal-tag">' + goal.type + '</span>' +
          '<span class="goal-tag">' + goal.foot + '</span>' +
          '<span class="goal-tag">vs ' + goal.opponent + '</span>' +
        '</div>';
      this.container.appendChild(card);
    });
  }
}

// ============================================
// CLASS: OpponentDatabase — 18 curated opponents (15+ requirement)
// ============================================
class OpponentDatabase {
  constructor() {
    this.opponents = [
      { name:"Real Madrid", flag:"🇪🇸", type:"club", goals:26, matches:45, hotTake:"Messi's favorite punching bag. 26 goals in El Clásico including THAT shirt celebration at the Bernabéu. He owns them.", keyMoment:"90+2' winner at Bernabéu (2017)" },
      { name:"Sevilla", flag:"🇪🇸", type:"club", goals:38, matches:42, hotTake:"Messi has scored more goals against Sevilla than any other club team. They see him in their nightmares.", keyMoment:"Hat-trick to reach 50 La Liga hat-tricks" },
      { name:"Athletic Bilbao", flag:"🇪🇸", type:"club", goals:26, matches:38, hotTake:"The Copa del Rey final solo goal in 2015 is arguably the greatest goal of all time. Bilbao never stood a chance.", keyMoment:"Solo run goal, Copa del Rey Final (2015)" },
      { name:"Atlético Madrid", flag:"🇪🇸", type:"club", goals:32, matches:46, hotTake:"Even Simeone's defensive masterclasses couldn't stop Messi. 32 goals against the toughest defense in Spain.", keyMoment:"Minute 13' goal in Copa del Rey (2009)" },
      { name:"Valencia", flag:"🇪🇸", type:"club", goals:30, matches:40, hotTake:"Messi treats Valencia like his personal playground. 30 goals against them including a 7-0 demolition.", keyMoment:"Barcelona 7-0 Valencia, Copa del Rey (2016)" },
      { name:"Arsenal", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", type:"club", goals:9, matches:8, hotTake:"FOUR goals in one Champions League night in 2010. Wenger called it the best individual display he'd ever seen.", keyMoment:"4 goals in CL quarter-final (2010)" },
      { name:"Bayern Munich", flag:"🇩🇪", type:"club", goals:8, matches:10, hotTake:"Made Boateng fall down, then chipped Neuer. Also scored in minute 9 in a 4-0 CL destruction. Bayern fears him.", keyMoment:"Boateng humiliation, CL Semi (2015)" },
      { name:"PSG", flag:"🇫🇷", type:"club", goals:5, matches:6, hotTake:"La Remontada. 6-1. Minute 50 penalty. Barcelona's greatest comeback ever. PSG fans still have nightmares.", keyMoment:"Penalty in 6-1 La Remontada (2017)" },
      { name:"AC Milan", flag:"🇮🇹", type:"club", goals:8, matches:7, hotTake:"That 4-0 comeback after losing 2-0 in the first leg. Plus a minute 5 goal in 2013. Milan was just a victim.", keyMoment:"2 goals in 4-0 CL comeback (2013)" },
      { name:"Liverpool", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", type:"club", goals:4, matches:6, hotTake:"That minute 82 free kick in the Champions League semi-final at Camp Nou. A goal so perfect, physics cried.", keyMoment:"Iconic free kick, CL Semi (2019)" },
      { name:"Bolivia", flag:"🇧🇴", type:"national", goals:11, matches:10, hotTake:"Messi's most-scored-against national team. Even at 3,600m altitude in La Paz, the man finds a way.", keyMoment:"Hat-trick to pass Pelé's record (2021)" },
      { name:"Paraguay", flag:"🇵🇾", type:"national", goals:8, matches:11, hotTake:"Messi has demolished Paraguay in qualifiers multiple times. Minutes 12, 52, 63 — he scores at will against them.", keyMoment:"Two goals in a 5-2 WCQ win (2013)" },
      { name:"Brazil", flag:"🇧🇷", type:"national", goals:5, matches:14, hotTake:"Minutes 31 and 85 against Brazil in a single match in 2012. The Superclásico de las Américas belongs to Messi.", keyMoment:"Two goals in Argentina 4-3 Brazil (2012)" },
      { name:"France", flag:"🇫🇷", type:"national", goals:4, matches:6, hotTake:"Two goals in the World Cup Final. Including THAT minute 108 extra time rebound. Mbappé scored a hat-trick but Messi still won.", keyMoment:"2 goals in WC Final (2022)" },
      { name:"Estonia", flag:"🇪🇪", type:"national", goals:5, matches:1, hotTake:"FIVE goals in ONE match. Minutes 8, 47, and more. Estonia was used for target practice. Sorry Estonia.", keyMoment:"5 goals in one match (2022)" },
      { name:"Panama", flag:"🇵🇦", type:"national", goals:5, matches:2, hotTake:"Minutes 68 and 78 in a single Copa América demolition. A hat-trick in 19 minutes. Panama never recovered.", keyMoment:"Hat-trick in Copa América (2016)" },
      { name:"Uruguay", flag:"🇺🇾", type:"national", goals:6, matches:12, hotTake:"Minute 43 WC qualifier winner in 2016. Messi always shows up against the Celeste. Suárez couldn't save them.", keyMoment:"Minute 43 WCQ winner (2016)" },
      { name:"Croatia", flag:"🇭🇷", type:"national", goals:3, matches:4, hotTake:"Minute 34 penalty in the World Cup semi-final to break Batistuta's WC scoring record. History, live.", keyMoment:"Record-breaking WC semi penalty (2022)" },
    ];
  }
  getAll() { return this.opponents; }
  filter(query, type, goalsRange) {
    let results = this.opponents;
    if (query) { const q = query.toLowerCase(); results = results.filter(o => o.name.toLowerCase().includes(q) || o.hotTake.toLowerCase().includes(q)); }
    if (type && type !== 'all') results = results.filter(o => o.type === type);
    if (goalsRange && goalsRange !== 'all') {
      if (goalsRange === '10+') results = results.filter(o => o.goals >= 10);
      else if (goalsRange === '5+') results = results.filter(o => o.goals >= 5);
      else if (goalsRange === '1-4') results = results.filter(o => o.goals <= 4);
    }
    return results;
  }
}

// ============================================
// CLASS: OpponentRenderer
// ============================================
class OpponentRenderer {
  constructor(containerId) { this.container = document.getElementById(containerId); }
  render(opponents) {
    if (!this.container) return;
    this.container.innerHTML = '';
    if (opponents.length === 0) { this.container.innerHTML = '<div class="empty-container"><p class="empty-icon">🔍</p><p class="empty-text">No opponents match your search.</p></div>'; return; }
    opponents.forEach(opp => {
      const card = document.createElement('div');
      card.className = 'team-card';
      card.innerHTML =
        '<div class="team-card-header"><span class="team-flag">' + opp.flag + '</span><div><h4 class="team-card-name">' + opp.name + '</h4><span class="team-card-region">' + (opp.type==='club'?'Club':'National Team') + '</span></div></div>' +
        '<span class="team-rating-badge contender">⚽ ' + opp.goals + ' goals in ' + opp.matches + ' matches</span>' +
        '<p class="team-hot-take">"' + opp.hotTake + '"</p>' +
        '<p class="team-key-player">🎯 Key Moment: <strong>' + opp.keyMoment + '</strong></p>';
      this.container.appendChild(card);
    });
  }
}

// ============================================
// CLASS: App — Main controller
// ============================================
class App {
  constructor() {
    this.sidebarManager = new SidebarManager();
    this.api = new APIService(API_KEY);
    this.goalDatabase = new GoalDatabase();
    this.opponentDatabase = new OpponentDatabase();
    this.init();
  }
  init() {
    const path = window.location.pathname;
    if (path.includes('goals.html')) this.initGoalsPage();
    else if (path.includes('opponents.html')) this.initOpponentsPage();
    else this.initHomePage();
  }

  // HOME
  initHomePage() {
    const renderer = new GoalRenderer('featuredGoals');
    if (renderer.container) renderer.render(this.goalDatabase.getFeatured());
  }

  // GOALS PAGE
  initGoalsPage() {
    this.goalRenderer = new GoalRenderer('goalsGrid');
    this.renderGoals();
    this.setupGoalFilters();
  }
  renderGoals(goals) {
    const display = goals || this.goalDatabase.getAll();
    this.goalRenderer.render(display);
    const c = document.getElementById('goalCount');
    if (c) c.textContent = 'Showing ' + display.length + ' goal' + (display.length !== 1 ? 's' : '');
  }
  setupGoalFilters() {
    const s = document.getElementById('goalSearch');
    const c = document.getElementById('compFilter');
    const m = document.getElementById('minuteFilter');
    const t = document.getElementById('teamFilter');
    const apply = () => this.renderGoals(this.goalDatabase.filter(s?.value, c?.value, m?.value, t?.value));
    if (s) s.addEventListener('input', apply);
    if (c) c.addEventListener('change', apply);
    if (m) m.addEventListener('change', apply);
    if (t) t.addEventListener('change', apply);
  }

  // OPPONENTS PAGE
  initOpponentsPage() {
    this.opponentRenderer = new OpponentRenderer('opponentsGrid');
    this.renderOpponents();
    this.setupOpponentFilters();
    this.setupAPITeamSearch();
  }
  renderOpponents(opponents) {
    const display = opponents || this.opponentDatabase.getAll();
    this.opponentRenderer.render(display);
    const c = document.getElementById('resultsCount');
    if (c) c.textContent = 'Showing ' + display.length + ' opponent' + (display.length !== 1 ? 's' : '');
  }
  setupOpponentFilters() {
    const s = document.getElementById('opponentSearch');
    const t = document.getElementById('typeFilter');
    const g = document.getElementById('goalsFilter');
    const apply = () => this.renderOpponents(this.opponentDatabase.filter(s?.value, t?.value, g?.value));
    if (s) s.addEventListener('input', apply);
    if (t) t.addEventListener('change', apply);
    if (g) g.addEventListener('change', apply);
  }
  setupAPITeamSearch() {
    const btn = document.getElementById('apiSearchBtn');
    const input = document.getElementById('apiTeamSearch');
    if (btn) btn.addEventListener('click', () => this.searchAPITeam());
    if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.searchAPITeam(); });
  }
  async searchAPITeam() {
    const input = document.getElementById('apiTeamSearch');
    const loading = document.getElementById('apiTeamLoading');
    const error = document.getElementById('apiTeamError');
    const errorText = document.getElementById('apiTeamErrorText');
    const results = document.getElementById('apiTeamResults');
    const query = input?.value.trim();
    if (!query) return;
    if (loading) loading.classList.remove('d-none');
    if (error) error.classList.add('d-none');
    if (results) results.classList.add('d-none');
    try {
      const data = await this.api.searchTeam(query);
      if (!data.response || data.response.length === 0) {
        if (loading) loading.classList.add('d-none');
        if (error) error.classList.remove('d-none');
        if (errorText) errorText.textContent = 'No team found for "' + query + '".';
        return;
      }
      const team = data.response[0].team;
      const venue = data.response[0].venue;
      if (results) {
        results.innerHTML = '<div class="api-team-card"><img src="' + team.logo + '" alt="' + team.name + '" class="api-team-logo"><div class="api-team-info"><h3>' + team.name + '</h3><p>' + (team.country||'Unknown') + ' • Founded: ' + (team.founded||'N/A') + '</p>' + (venue ? '<p>🏟️ ' + venue.name + ' (' + venue.city + ') — Capacity: ' + (venue.capacity?.toLocaleString()||'N/A') + '</p>' : '') + '<div class="api-team-stats"><div class="api-stat"><span class="api-stat-value">' + (team.national?'National':'Club') + '</span><span class="api-stat-label">Type</span></div><div class="api-stat"><span class="api-stat-value">' + (team.founded||'?') + '</span><span class="api-stat-label">Founded</span></div></div></div></div>';
        results.classList.remove('d-none');
      }
      if (loading) loading.classList.add('d-none');
    } catch (err) {
      if (loading) loading.classList.add('d-none');
      if (error) error.classList.remove('d-none');
      if (errorText) errorText.textContent = 'Failed to fetch. Check API key or try again.';
    }
  }
}

const app = new App();