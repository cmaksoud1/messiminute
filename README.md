# Predict26 — World Cup 2026 Predictions ⚽

**Built by:** Clarita Maksoud  
**University:** Lebanese University, Faculty of Engineering, Branch 2 — Roumieh  
**Course:** Full Stack Development — Final Project 2026  

---

## About the Project

**Predict26** is an interactive World Cup 2026 predictions website where users can browse live matches, make predictions on game outcomes, and explore curated team profiles with personal hot takes.

The site features a dark, stadium-inspired design with live data from the API-Football API, a collapsible sidebar navigation, and a prediction tracker that saves your picks locally.

---

## API Used

**API-Football** (via [api-sports.io](https://www.api-football.com/))  
- Free tier: 100 requests/day  
- Used for: fetching World Cup 2026 fixtures, team data, and search functionality  

---

## Pages

1. **Home** — Hero section with countdown timer, live/upcoming matches from API, fun facts, and personal hot takes
2. **Predictions** — Browse all World Cup matches, predict winners, filter by status, search by team name
3. **Teams** — 18 curated team profiles with hot takes, key players, and ratings. Plus live API team search.

---

## Custom Requirement

**Add a sidebar menu that collapses on smaller screens**

The sidebar is implemented as a fixed `<aside>` element that:
- Is always visible on screens ≥992px (desktop/tablet landscape)
- Collapses/hides on screens <992px (mobile/tablet portrait)
- Can be toggled via the hamburger button in the navbar
- Includes a dark overlay when open on mobile
- Contains quick stats, group links, filters, and navigation

The sidebar behavior is managed by the `SidebarManager` ES6 class in `js/app.js`.

---

## AI-Use Appendix

### Tools Used
- **Claude (Anthropic)**: Used for project setup guidance, code structure planning, and generating initial HTML/CSS/JS code

### Prompts Used

1. *"I have an assignment to create a website using JavaScript, Node.js, HTML, CSS, and using an AI model, and using GitHub. Help me set up everything."*
   
2. *"Build me a World Cup 2026 predictions website with a dark theme, live API data, prediction tracking, and curated team profiles with my personal hot takes."*

3. *"Make the sidebar collapsible on smaller screens — that's my unique assignment requirement."*

### What the AI Got Wrong

1. **Initial topic confusion**: Claude initially suggested a Bitcoin-themed website ("Priced in Sats") and kept pushing for it even when I wanted to switch to World Cup. The AI was persistent about not changing the topic, which wasted time in the planning phase. I had to firmly redirect the conversation to the World Cup theme.

2. **Node.js misunderstanding**: Claude initially described the project as needing a Node.js backend server, but the assignment is actually a front-end only project. I had to re-read the assignment requirements carefully to realize Node.js was only needed for npm/tooling, not as a server. The AI's initial architecture suggestion would have over-complicated the project.

---

## Screenshots

*(Add screenshots of your site at mobile, tablet, and desktop widths here)*

- `screenshots/desktop.png`
- `screenshots/tablet.png`
- `screenshots/mobile.png`

---

## How to Run

1. Clone the repository
2. Open `index.html` in a browser
3. Replace `YOUR_API_KEY_HERE` in `js/app.js` with your API-Football key

---

## Deployment

Live URL: *(Add your deployed URL here)*  
GitHub Repository: *(Add your repo URL here)*
