/* =====================================================================
   SITE CONTENT — edit this file to change what the site shows.
   Comments here are never shown on the page.
   ===================================================================== */

window.SITE = {
  name: "Omar Mostafa",
  role: "Full-stack & AI Engineer",
  yearsExperience: 4,
  available: true,      // shows "Available for new projects" in the hero
  // Anything left "" is hidden from the page automatically.
  // The contact form only appears once "email" is filled in.
  links: {
    email: "omar.mostafa082002@gmail.com",
    github: "https://github.com/microbe233",
    linkedin: "https://www.linkedin.com/in/omar-mostafa-349239209/",
    cv: "",             // e.g. "assets/omar-mostafa-cv.pdf"
  },
};

/* level: 1-5   years: how long you've used it
   cat: frontend | backend | mobile | ai | devops
   Skills marked "seen in repos" are backed by projects on GitHub. */
window.SKILLS = [
  { name: "HTML & CSS",     cat: "frontend", level: 5, years: 4, icon: "fa-brands fa-html5" },      // seen in repos
  { name: "JavaScript",     cat: "frontend", level: 5, years: 4, icon: "fa-brands fa-js" },         // seen in repos
  { name: "TypeScript",     cat: "frontend", level: 4, years: 3, icon: "fa-solid fa-code" },
  { name: "React",          cat: "frontend", level: 4, years: 3, icon: "fa-brands fa-react" },      // seen in repos
  { name: "Next.js",        cat: "frontend", level: 3, years: 2, icon: "fa-solid fa-n" },           // seen in repos
  { name: "Bootstrap",      cat: "frontend", level: 4, years: 3, icon: "fa-brands fa-bootstrap" },  // seen in repos
  { name: "Node.js",        cat: "backend",  level: 4, years: 3, icon: "fa-brands fa-node-js" },    // seen in repos
  { name: "Express",        cat: "backend",  level: 4, years: 3, icon: "fa-solid fa-route" },       // seen in repos
  { name: "MongoDB",        cat: "backend",  level: 4, years: 3, icon: "fa-solid fa-leaf" },        // seen in repos
  { name: "Supabase",       cat: "backend",  level: 3, years: 1, icon: "fa-solid fa-bolt" },        // seen in repos
  { name: "PostgreSQL",     cat: "backend",  level: 3, years: 2, icon: "fa-solid fa-database" },
  { name: "Python",         cat: "backend",  level: 4, years: 3, icon: "fa-brands fa-python" },     // seen in repos
  { name: "Auth & OAuth",   cat: "backend",  level: 4, years: 2, icon: "fa-solid fa-user-shield" }, // seen in YelpCamp (Passport, Google/Facebook)
  { name: "Stripe Payments", cat: "backend", level: 3, years: 1, icon: "fa-brands fa-stripe" },     // seen in YelpCamp
  { name: "C & Networking", cat: "backend",  level: 3, years: 2, icon: "fa-solid fa-network-wired" }, // seen in repos
  { name: "Kotlin",         cat: "mobile",   level: 4, years: 1, icon: "fa-brands fa-android" },    // seen in repos
  { name: "Jetpack Compose", cat: "mobile",  level: 4, years: 1, icon: "fa-solid fa-mobile-screen" }, // seen in repos
  { name: "Room & CameraX", cat: "mobile",   level: 3, years: 1, icon: "fa-solid fa-camera" },      // seen in repos
  { name: "scikit-learn",   cat: "ai",       level: 4, years: 2, icon: "fa-solid fa-chart-line" },  // seen in repos
  { name: "pandas & NumPy", cat: "ai",       level: 4, years: 2, icon: "fa-solid fa-table" },       // seen in repos
  { name: "ML Kit",         cat: "ai",       level: 3, years: 1, icon: "fa-solid fa-person-running" }, // seen in repos
  { name: "LLM APIs",       cat: "ai",       level: 4, years: 2, icon: "fa-solid fa-robot" },
  { name: "Git & GitHub",   cat: "devops",   level: 5, years: 4, icon: "fa-brands fa-github" },     // seen in repos
  { name: "GitHub Actions", cat: "devops",   level: 3, years: 1, icon: "fa-solid fa-infinity" },    // seen in repos
  { name: "Linux",          cat: "devops",   level: 4, years: 3, icon: "fa-brands fa-linux" },
  { name: "Docker",         cat: "devops",   level: 3, years: 2, icon: "fa-brands fa-docker" },
];

window.SKILL_CATS = {
  frontend: "Frontend",
  backend: "Backend & Data",
  mobile: "Mobile",
  ai: "AI & ML",
  devops: "DevOps & Tools",
};

/* PROJECTS — from github.com/microbe233. Newest first; the first one with featured: true gets the big card.
   cat: one or more of  mobile | ai | web | systems
   private: true  → shows "Code private" instead of a code link
   cover.kind: phone | map | camp | terminal | notebook | code   (or add  image: "assets/img/projects/x.webp")
   highlights: short bullet points shown on the card and in the case study */
window.PROJECTS = [
  {
    title: "Forge",
    tagline: "A Solo Leveling–style fitness app that punishes skipped workouts",
    featured: true,
    cat: ["mobile", "ai"], year: 2026, private: true,
    summary: "An Android app that turns daily workouts into RPG quests. The camera counts your reps with AI pose detection — and if you skip your quests, Instagram gets locked for 24 hours.",
    problem: "Fitness apps are easy to ignore: closing them costs nothing, so streaks die and habits never stick.",
    solution: "A native Android app in Kotlin and Jetpack Compose, inspired by the anime Solo Leveling. Every day you get quests — push-ups, sit-ups, squats and a run — sized to your fitness level. The camera verifies each rep with Google ML Kit pose detection, and runs are tracked with GPS. Completing quests earns XP, levels and stat points (STR, AGI, VIT). Miss them by midnight and the penalty starts: an accessibility service blocks Instagram and any other apps you chose, for 24 hours. Progress lives in a local Room database and syncs to the cloud with Supabase accounts.",
    highlights: [
      "AI rep counting with ML Kit pose detection + CameraX",
      "Real consequences: app blocking via accessibility & foreground services",
      "RPG system — XP, levels, stats, level-up animations",
      "GPS run tracking",
      "Offline-first (Room) with Supabase auth & cloud sync",
      "GitHub Actions job keeps the backend awake",
    ],
    stack: ["Kotlin", "Jetpack Compose", "ML Kit", "CameraX", "Room", "Supabase", "Coroutines", "GitHub Actions"],
    keywords: "android app mobile fitness workout habit gym solo leveling instagram block pose camera",
    links: { live: "", code: "" },
    cover: { kind: "phone", hue: 205 },
  },
  {
    title: "Coordinate Transformation Tool",
    tagline: "Click a photo, get GPS coordinates",
    cat: ["web"], year: 2025, private: true,
    summary: "Click anywhere on an aerial photo and get the real-world GPS coordinates of that spot — calculated from the photo's four corner coordinates.",
    problem: "Aerial and drone images show a place, but not where each point in them is on the map.",
    solution: "A browser tool that maps pixel positions to latitude/longitude. You enter the image size and the GPS coordinates of its corners; the tool computes the scale (degrees per pixel) and converts any click on the image into coordinates, with the corner reference points drawn on the image. The demo uses a real 12 cm-per-pixel aerial photo of Times Square, cropped to exactly the area between the corner coordinates — so every click returns that spot's true location.",
    highlights: ["Click-to-coordinate conversion with live hover preview", "Real aerial photo of Times Square with matching corner coordinates", "Copy result or open it in Google Maps", "Shows the full calculation for every click", "Responsive, dark UI with a strict Content Security Policy"],
    stack: ["JavaScript", "HTML", "CSS", "GitHub Pages"],
    keywords: "gps map coordinates latitude longitude aerial image drone geo",
    links: { live: "https://microbe233.github.io/GPS/", code: "" }, // repo: github.com/microbe233/GPS (hidden on the site for now)
    image: "assets/img/projects/gps-tool.webp", // real screenshot (aerial imagery: NYS ITS Geospatial Services)
    cover: { kind: "map", hue: 160 },
  },
  {
    title: "YelpCamp",
    tagline: "Campground platform with maps, accounts, a gear market and payments",
    cat: ["web"], year: 2025, private: true,
    summary: "A full-stack platform to discover, share and review campsites — with a 3D map of every campground, user accounts with Google & Facebook login, a camping-gear rental market with Stripe payments, and an admin dashboard.",
    problem: "Started as the classic Web Developer Bootcamp project — then grown into something closer to a real product: real accounts, maps, uploads, payments and the admin tools to run it.",
    solution: "An Express + MongoDB app with server-rendered EJS. Campgrounds are geocoded with Mapbox and shown on a 3D globe with clustered markers; photos upload to Cloudinary. Users sign up with email (verification codes, password reset via Nodemailer/SendGrid) or with Google and Facebook through Passport, keep favorites and leave star ratings. A gear market lets campers rent equipment with a basket and Stripe checkout; an hourly cron job moves finished rentals to 'return pending'. Admins get a dashboard for users, orders, market analytics, email usage and upgrade requests. Security is built in: Helmet with a Content Security Policy, MongoDB-injection sanitizing, HTML sanitizing, and sessions stored in MongoDB.",
    highlights: [
      "3D clustered map of all campgrounds (Mapbox)",
      "Accounts: email verification, password reset, Google & Facebook login",
      "Gear rental market with basket and Stripe payments",
      "Admin dashboard: users, orders, analytics, email usage",
      "Image uploads to Cloudinary, favorites and star ratings",
      "Hardened: Helmet CSP, Mongo sanitizing, HTML sanitizing",
    ],
    stack: ["Node.js", "Express", "MongoDB", "Passport", "Mapbox", "Stripe", "Cloudinary", "EJS"],
    keywords: "yelpcamp yelp camp camping campground campgrounds campsite reviews map maps mapbox stripe payment market rental admin dashboard login oauth google facebook full-stack fullstack website bootcamp to-do todo",
    // code link hidden on the site for now
    links: { live: "", code: "" },
    image: "assets/img/projects/yelpcamp.webp", // real screenshots (run locally)
    gallery: [
      { src: "assets/img/projects/yelpcamp-map.webp", caption: "3D globe with clustered campgrounds" },
      { src: "assets/img/projects/yelpcamp-campground.webp", caption: "Campground page: photos, rating, satellite map, contact owner" },
    ],
    cover: { kind: "camp", hue: 30 },
  },
  {
    title: "Chat Room in C",
    tagline: "Multi-user chat server over TCP",
    cat: ["systems"], year: 2024, private: true,
    summary: "A terminal chat server written in C: many users at once, public and private messages, and an integrity check on every message.",
    problem: "Understand how chat really works below the frameworks — sockets, threads and data integrity.",
    solution: "A TCP server that gives each connected client its own POSIX thread, with the client list protected by a mutex. Messages go to everyone or privately to one user. Each message carries a checksum and a CRC, which the server verifies to detect corrupted data before delivering it.",
    highlights: ["Concurrent clients with pthreads", "Public and private messages", "CRC + checksum error detection", "Thread-safe client list"],
    stack: ["C", "TCP sockets", "POSIX threads", "Linux"],
    keywords: "chat server socket network networking c language terminal cli threads",
    links: { live: "", code: "" }, // repo: github.com/microbe233/Chat-Room (hidden until the repo is cleaned up)
    cover: { kind: "terminal", hue: 140 },
  },
  {
    title: "Machine Learning Lab",
    tagline: "A semester of hands-on ML in Python",
    cat: ["ai"], year: 2024, private: true,
    summary: "Hands-on machine learning in Python — from cleaning data to classification, clustering and dimensionality reduction, on real datasets.",
    problem: "Learn how classic ML algorithms behave on real data, not just in theory.",
    solution: "A series of Jupyter notebooks working through the full workflow on datasets like Titanic, mushrooms, car evaluation and mall customers: exploring data with pandas and Seaborn/Plotly, training models with scikit-learn, and evaluating them properly. The cover shows customer segmentation with K-Means, choosing the number of clusters with the elbow method.",
    highlights: ["Customer segmentation with K-Means", "KNN, Naive Bayes, SVM, decision trees, random forest", "K-fold cross-validation and confusion matrices", "Linear, multiple and logistic regression", "PCA for dimensionality reduction"],
    stack: ["Python", "scikit-learn", "pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter"],
    keywords: "machine learning ml data science notebook jupyter clustering kmeans classification regression model",
    links: { live: "", code: "" }, // repo: github.com/microbe233/machinelearning (hidden until the repo is cleaned up)
    image: "assets/img/projects/ml-kmeans.webp",
    cover: { kind: "notebook", hue: 265 },
  },
  {
    title: "This Portfolio",
    tagline: "Hand-built, no frameworks",
    cat: ["web", "ai"], year: 2026, private: true,
    summary: "The site you're on: a particle portrait made from my photo, an \"Ask me\" search engine and an interactive terminal — hand-built and secured with a strict Content Security Policy.",
    problem: "Templates all look the same, and portfolios rarely show how you actually build.",
    solution: "Hand-built with vanilla JavaScript and canvas. The portrait is ~22k particles generated from a photo after AI background removal; the \"Ask me\" chat is a BM25 search engine over the site's own content; everything follows the OWASP cheat sheets (CSP, safe DOM updates, URL allow-lists).",
    highlights: ["~22k-particle portrait at 60fps", "In-browser search engine (BM25)", "Strict CSP, no third-party requests", "Responsive from phone to desktop"],
    stack: ["JavaScript", "Canvas", "CSS", "Python", "OWASP"],
    keywords: "website site made dots particles portfolio security",
    links: { live: "", code: "" }, // repo: github.com/microbe233/profile (hidden until the repo is cleaned up)
    image: "assets/img/projects/portfolio.webp", // real screenshot of the hero
    cover: { kind: "code", hue: 18 },
  },
];

window.PROJECT_CATS = { all: "All", mobile: "Mobile", ai: "AI & ML", web: "Web", systems: "Systems" };

/* EXPERIENCE — newest first.
   where: company / school — leave "" and nothing is shown. */
window.EXPERIENCE = [
  {
    when: "Jul 2022 — Now",
    role: "Freelance Full-stack Web Developer",
    where: "",
    text: "Building full-stack web applications for clients across different industries with React, Next.js, Node.js and Express — from the UI/UX to the back-end APIs, with clean, maintainable code delivered on time. Lately also Android apps with on-device AI.",
    tags: ["React", "Next.js", "Node.js", "Express", "MongoDB"],
  },
  {
    when: "Jul 2024 — Aug 2024",
    role: "Frontend Web Developer",
    where: "Bee Skills Center",
    text: "Built the front end of the Bee Skills training-center website in Lebanon with React and Next.js.",
    tags: ["React", "Next.js", "Bootstrap"],
  },
  {
    when: "Nov 2020 — Jun 2025",
    role: "B.Eng. Computer Engineering",
    where: "Karabük University",
    text: "Computer engineering degree in Türkiye — machine learning, networking and systems programming, plus web development. Certified in The Web Developer Bootcamp and Smart Cities.",
    tags: ["Machine Learning", "C", "Networking", "Web"],
  },
];
