# MessiMinute — Every Minute, Every Goal 🐐

**Built by:** Clarita Maksoud  
**University:** Lebanese University, Faculty of Engineering, Branch 2 — Roumieh  
**Course:** Full Stack Development — Final Project 2026  

---

## About the Project

**MessiMinute** is an interactive website that explores Lionel Messi's 917+ career goals — organized by the minute they were scored. From minute 2' to minute 90', stoppage time, and extra time, every minute of a football match has seen a Messi goal.

The site features 95 real, verified goals (one per minute) with match data sourced from MessiStats.com, an Argentina-inspired design theme, and live team data from the API-Football API.

---

## API Used

**API-Football** (via [api-sports.io](https://www.api-football.com/))  
- Free tier: 100 requests/day  
- Used for: searching and fetching live team data (logos, stadium info, founding year) on the Opponents page  
- Includes: loading state, error state, and empty state handling  

---

## Pages

1. **Home** — Hero section with Argentina flag design, career goal counter (917 goals, 123 Argentina, 672 Barça, 8 Ballon d'Or), 8 "Did You Know?" record facts, featured iconic goals, and "Why Messi is the GOAT" hot takes section
2. **Goals by Minute** — Browse all 95 verified goals organized by minute. Search by typing a minute number (e.g. "23" shows the World Cup Final penalty) or by opponent name. Filter by competition, minute range (1-15, 16-30, etc.), or team (Barcelona, Argentina, PSG, Inter Miami)
3. **Opponents** — 18 curated opponent profiles showing how many goals Messi scored against each, with personal hot takes and key moments. Plus live API team search for any team in the API-Football database

---

## Custom Requirement

**Add a sidebar menu that collapses on smaller screens**

The sidebar is implemented as a fixed `<aside>` element that:
- Is always visible on desktop screens (≥992px)
- Collapses and hides on mobile/tablet screens (<992px)
- Can be toggled open via the ☰ hamburger button in the navbar
- Shows a dark overlay behind it when open on mobile
- Contains career stats, club goal counts, filters, and navigation links
- Different filter options per page (competition/minute/team on Goals page, opponent type/goals range on Opponents page)

The sidebar behavior is managed by the `SidebarManager` ES6 class in `js/app.js`, with CSS media queries handling the responsive show/hide behavior.

---

## Data Sources

- **Goal data:** Manually curated from [MessiStats.com](https://www.messistats.com) — each goal verified with date, opponent, result, competition, goal type, and foot used
- **Record statistics:** Cross-referenced with [Transfermarkt](https://www.transfermarkt.com) and Wikipedia
- **Live team data:** [API-Football](https://www.api-football.com/) API

---

## AI-Use Appendix

### Tools Used
- **Claude (Anthropic):** Used for project setup guidance (installing Node.js, Git, GitHub), code structure planning, generating HTML/CSS/JS boilerplate, and iterating on design/functionality

### Prompts Used

1. *"I have an assignment to create a website using JavaScript, Node.js, HTML, CSS, and using GitHub. Help me set up everything — install Node.js, Git, create a GitHub account, and initialize the project."*

2. *"Build me a Messi goals website where each minute of a match shows a goal he scored, with real data, Argentina flag colors, search by minute number, and filters by competition and team."*

3. *"The sidebar needs to collapse on smaller screens — that's my unique assignment requirement. Make it work with a hamburger button and overlay on mobile."*

### What the AI Got Wrong

1. **Topic indecision wasted time:** Claude kept pushing for a "Priced in Sats" (Bitcoin) website theme even when I wanted to do a World Cup site. Then it pushed the World Cup idea when I wanted to switch to a Messi goals concept. The AI was too insistent on sticking with earlier decisions, which cost planning time. I had to firmly redirect the conversation multiple times.

2. **Fake match data:** When building the World Cup version, Claude hardcoded fictional match results and brackets (e.g., "Argentina vs Spain in the Final") as if they were real 2026 World Cup data. I caught this because the matches didn't match real fixtures and called it out. The fix was to switch to real, verified data from MessiStats.com that I manually collected for every minute from 2' to 90'.

3. **API CORS issues:** Claude initially configured the API-Football calls to use direct browser requests, which caused CORS (Cross-Origin Request Blocked) errors in the console. The API's free tier doesn't support browser-to-API calls without proper headers. We had to debug this by checking the console, adjusting headers, and testing with different API configurations.

---

## Screenshots

*(Add screenshots at mobile, tablet, and desktop widths)*

- `screenshots/desktop.png`
- `screenshots/tablet.png`  
- `screenshots/mobile.png`

---

## How to Run

1. Clone the repository: `git clone https://github.com/cmaksoud1/messiminute.git`
2. Open `index.html` in a browser (or use VS Code Live Server)
3. Replace `YOUR_API_KEY_HERE` in `js/app.js` with your API-Football key from [api-sports.io](https://www.api-football.com/)

---

## Deployment

Live URL: *(Add your deployed URL here)*  
GitHub Repository: *(Add your repo URL here)*