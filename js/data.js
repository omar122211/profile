/* =====================================================================
   SITE CONTENT — edit this file to change what the site shows.
   Comments here are never shown on the page.
   ===================================================================== */

window.SITE = {
  name: "Omar Mostafa",
  role: "AI Engineer · Full-stack",
  yearsExperience: 4,
  available: true,      // shows "Available for new projects" in the hero
  // Anything left "" is hidden from the page automatically.
  // The contact form only appears once "email" is filled in.
  links: {
    email: "omar.mostafa082002@gmail.com",
    github: "https://github.com/omar122211",
    linkedin: "https://www.linkedin.com/in/omar-mostafa-349239209/",
    cv: "",             // e.g. "assets/omar-mostafa-cv.pdf"
  },
};

/* level: 1-5   years: how long you've used it
   cat: ai | frontend | backend | devops
   Skills marked "seen in repos" are backed by projects on GitHub. */
window.SKILLS = [
  { name: "scikit-learn",   cat: "ai",       level: 4, years: 2, icon: "fa-solid fa-chart-line" },  // coursework (Karabük University)
  { name: "pandas & NumPy", cat: "ai",       level: 4, years: 2, icon: "fa-solid fa-table" },       // coursework (Karabük University)
  { name: "LLM APIs",       cat: "ai",       level: 4, years: 2, icon: "fa-solid fa-robot" },
  { name: "RAG & embeddings", cat: "ai",     level: 4, years: 1, icon: "fa-solid fa-magnifying-glass" }, // seen in repos (gym-ai-assistant)
  { name: "LangGraph agents", cat: "ai",     level: 3, years: 1, icon: "fa-solid fa-diagram-project" }, // seen in repos (gym-ai-assistant)
  { name: "PyTorch & computer vision", cat: "ai", level: 3, years: 1, icon: "fa-solid fa-eye" },    // seen in repos (docsort-ai)
  { name: "NLP & transformers", cat: "ai",   level: 3, years: 1, icon: "fa-solid fa-language" },    // seen in repos (review-intelligence)
  { name: "FastAPI",        cat: "backend",  level: 4, years: 1, icon: "fa-solid fa-bolt" },        // seen in repos (gym-ai-assistant)
  { name: "HTML & CSS",     cat: "frontend", level: 5, years: 4, icon: "fa-brands fa-html5" },      // seen in repos
  { name: "JavaScript",     cat: "frontend", level: 5, years: 4, icon: "fa-brands fa-js" },         // seen in repos
  { name: "TypeScript",     cat: "frontend", level: 4, years: 3, icon: "fa-solid fa-code" },
  { name: "React",          cat: "frontend", level: 4, years: 3, icon: "fa-brands fa-react" },      // seen in repos
  { name: "Next.js",        cat: "frontend", level: 3, years: 2, icon: "fa-solid fa-n" },           // seen in repos
  { name: "Bootstrap",      cat: "frontend", level: 4, years: 3, icon: "fa-brands fa-bootstrap" },  // seen in repos
  { name: "Node.js",        cat: "backend",  level: 4, years: 3, icon: "fa-brands fa-node-js" },    // seen in repos
  { name: "Express",        cat: "backend",  level: 4, years: 3, icon: "fa-solid fa-route" },       // seen in repos
  { name: "MongoDB",        cat: "backend",  level: 4, years: 3, icon: "fa-solid fa-leaf" },        // seen in repos
  { name: "PHP",            cat: "backend",  level: 3, years: 2, icon: "fa-brands fa-php" },        // seen in repos (Fitness Abbas)
  { name: "MySQL",          cat: "backend",  level: 3, years: 2, icon: "fa-solid fa-database" },   // seen in repos (Fitness Abbas)
  { name: "Supabase",       cat: "backend",  level: 3, years: 1, icon: "fa-solid fa-bolt" },        // seen in repos
  { name: "PostgreSQL",     cat: "backend",  level: 3, years: 2, icon: "fa-solid fa-database" },
  { name: "Python",         cat: "backend",  level: 4, years: 3, icon: "fa-brands fa-python" },     // seen in repos
  { name: "Auth & OAuth",   cat: "backend",  level: 4, years: 2, icon: "fa-solid fa-user-shield" }, // seen in YelpCamp (Passport, Google/Facebook)
  { name: "Stripe Payments", cat: "backend", level: 3, years: 1, icon: "fa-brands fa-stripe" },     // seen in YelpCamp
  { name: "C & Networking", cat: "backend",  level: 3, years: 2, icon: "fa-solid fa-network-wired" }, // seen in repos
  { name: "Git & GitHub",   cat: "devops",   level: 5, years: 4, icon: "fa-brands fa-github" },     // seen in repos
  { name: "GitHub Actions", cat: "devops",   level: 3, years: 1, icon: "fa-solid fa-infinity" },    // seen in repos
  { name: "Linux",          cat: "devops",   level: 4, years: 3, icon: "fa-brands fa-linux" },
  { name: "Docker",         cat: "devops",   level: 3, years: 2, icon: "fa-brands fa-docker" },
];

window.SKILL_CATS = {
  ai: "AI & ML",
  frontend: "Frontend",
  backend: "Backend & Data",
  devops: "DevOps & Tools",
};

/* PROJECTS — from github.com/omar122211. Newest first; the first one with featured: true gets the big card.
   cat: one or more of  ai | web | systems
   private: true  → shows "Code private" instead of a code link
   cover.kind: phone | map | camp | terminal | notebook | code   (or add  image: "assets/img/projects/x.webp")
   highlights: short bullet points shown on the card and in the case study */
window.PROJECTS = [
  {
    title: "Gym AI Assistant",
    tagline: "A multilingual AI receptionist that answers, books classes and remembers",
    featured: true,
    cat: ["ai", "web"], year: 2026,
    summary: "An AI agent for the Fitness Abbas gym: members chat in Arabic, Turkish or English, and it answers from the gym's own knowledge base with sources, shows the timetable, books classes over several messages and files complaints for staff.",
    problem: "A gym gets the same questions every day — prices, trainers, class times — in several languages, and a plain chatbot either knows nothing about the gym or confidently makes things up.",
    solution: "A LangGraph agent behind a FastAPI service. Each message goes through a router (Gemini with Pydantic-validated structured output) that picks the intent and pulls out the class, day and name — using the conversation so far, so \"Friday works\" continues a booking. Questions go to a RAG pipeline: the knowledge base is embedded once in English with gemini-embedding-2 and stored in Chroma, so Arabic and Turkish questions still find the right sections; anything below a measured similarity cutoff is dropped and the model must answer only from the sources or say it doesn't know. Schedules, bookings and complaints are plain Python tools over SQLite — the model never writes SQL or decides availability. Memory is saved per conversation, a fallback model takes over when the main one is overloaded, and a 51-case evaluation set (3 languages, prompt-injection and multi-turn cases) measures it.",
    highlights: [
      "RAG with sources: Gemini embeddings + Chroma, similarity cutoff, \"I don't know\" instead of guessing",
      "LangGraph agent: router → tools → reply, with memory per conversation",
      "Books classes over several messages, files complaint tickets (SQLite tools)",
      "Arabic, Turkish and English from one English knowledge base",
      "51-case evaluation set incl. prompt injection and multi-turn memory",
      "FastAPI + Streamlit, Docker Compose, 24 offline tests",
    ],
    stack: ["Python", "LangGraph", "Gemini API", "RAG", "Chroma", "FastAPI", "Pydantic", "Streamlit", "SQLite", "Docker"],
    keywords: "ai agent chatbot assistant rag llm gemini langgraph retrieval embeddings vector chroma fastapi streamlit gym booking multilingual arabic turkish receptionist",
    links: { live: "", code: "https://github.com/omar122211/gym-ai-assistant" },
    image: "assets/img/projects/gym-ai.webp", // real screenshots of the Streamlit chat (run with Docker)
    gallery: [
      { src: "assets/img/projects/gym-ai-booking.webp", caption: "Booking over three messages, live timetable with free spots" },
      { src: "assets/img/projects/gym-ai-multilingual.webp", caption: "Arabic schedule + Turkish question answered with sources" },
      { src: "assets/img/projects/gym-ai-mobile.webp", caption: "On a phone" },
    ],
    cover: { kind: "code", hue: 22 },
  },
  {
    title: "DocSort AI",
    tagline: "Sorts scanned documents with a model I trained, then reads their fields",
    cat: ["ai", "web"], year: 2026,
    summary: "Drop in a pile of scans: a document classifier I trained sorts them into 7 types, Gemini reads the key fields — totals, dates and line items from receipts and invoices, sender and a summary from the rest — and everything exports to Excel.",
    problem: "Offices still sort and re-type paperwork by hand. Sending every page to a large AI model is slow and costs money for each page, and it is not even the most accurate way to sort.",
    solution: "I fine-tuned an ImageNet-pretrained MobileNetV3 in PyTorch on 4,500 pages from two public datasets (RVL-CDIP office scans and CORD receipt photos), in two phases: first only a new 7-class head, then the whole network. Every page is converted to grayscale the same way so the model learns layout, not \"photo vs. scan\". It reaches 89% on 1,120 unseen test pages and runs offline in about 60 ms per page. On the same pages it beat asking Gemini directly (89% vs 84%) while being ~37× faster — so the LLM is used only for what it is good at: reading the fields, into a Pydantic schema per document type. On 100 labelled receipt photos it got the total exactly right 97% of the time. A FastAPI service and a Streamlit page wrap it all, with upload validation, prompt-injection rules and protection against spreadsheet formula injection in the Excel export.",
    highlights: [
      "Trained my own classifier: 89% accuracy on 1,120 unseen pages, ~60 ms on CPU",
      "Beats zero-shot Gemini at sorting (89% vs 84%) and is ~37× faster",
      "Gemini vision field extraction: 97% exact totals on 100 labelled receipts",
      "Excel export with formula-injection protection; PDF and image uploads",
      "Measured honestly: confusion matrix, error analysis, no tuning on the test set",
      "FastAPI + Streamlit, Docker Compose, 15 offline tests",
    ],
    stack: ["Python", "PyTorch", "Transfer learning", "Gemini API", "scikit-learn", "FastAPI", "Streamlit", "openpyxl", "Docker"],
    keywords: "document classification ocr scan scanned receipt invoice extraction excel computer vision cnn mobilenet pytorch deep learning transfer learning rvl-cdip gemini vision rpa automation",
    links: { live: "", code: "https://github.com/omar122211/docsort-ai" },
    image: "assets/img/projects/docsort.webp", // real screenshots of the Streamlit page (run with Docker)
    gallery: [
      { src: "assets/img/projects/docsort-app.webp", caption: "A batch of sample pages sorted, with the Excel export" },
      { src: "assets/img/projects/docsort-confusion.webp", caption: "Test-set confusion matrix: forms vs. invoices are the hard pair" },
      { src: "assets/img/projects/docsort-mobile.webp", caption: "On a phone" },
    ],
    cover: { kind: "code", hue: 200 },
  },
  {
    title: "YelpCamp Review Intelligence",
    tagline: "NLP that tells campground owners what campers really say",
    cat: ["ai", "web"], year: 2026,
    summary: "An NLP service for my YelpCamp platform: sentiment for every review, opinions on five aspects (cleanliness, value, location, facilities, quiet) backed by quotes, a pros-and-cons summary that cites its reviews, search by meaning, and polite owner-reply drafts.",
    problem: "A campground with hundreds of reviews can't read them all, star averages hide why people are unhappy, and a general chatbot summary can quietly make things up.",
    solution: "I compared four ways to read sentiment on the same real, human-written reviews (200k TripAdvisor reviews where each reviewer also rated cleanliness, value, location, rooms and sleep — human labels per aspect), with balanced classes and no reviewer in both training and test. TF-IDF + logistic regression reached 78%, frozen MiniLM sentence embeddings 73%, and MiniLM fine-tuned by me in PyTorch 79.4% — slightly ahead of zero-shot Gemini on the same reviews, ~20× faster and free, so it runs on every review. Aspects are where the LLM earns its cost: Gemini lists only the aspects a review mentions, with a quote, and agrees with the reviewers' own aspect ratings 81–97% of the time. Quotes must appear word-for-word in the review and summary points must cite real review numbers, otherwise they are dropped — so the AI can't invent evidence.",
    highlights: [
      "Fine-tuned MiniLM: 79.4% on balanced real reviews, 46 ms on CPU — beats zero-shot Gemini",
      "Honest baselines: TF-IDF 78% beat frozen embeddings 73%",
      "Aspect opinions with exact quotes: 81–97% agreement with reviewers' own aspect ratings",
      "Cited pros/cons summaries; invented quotes and citations are filtered out",
      "Semantic search over reviews and owner-reply drafts with guardrails",
      "FastAPI + Streamlit, Docker (models baked in, runs offline), 11 offline tests",
    ],
    stack: ["Python", "PyTorch", "Transformers", "Fine-tuning", "sentence-transformers", "scikit-learn", "Gemini API", "FastAPI", "Streamlit", "Docker"],
    keywords: "nlp sentiment analysis reviews aspect based sentiment absa transformer fine-tuning bert minilm tf-idf embeddings semantic search summarization yelpcamp campground hotel tripadvisor",
    links: { live: "", code: "https://github.com/omar122211/review-intelligence" },
    image: "assets/img/projects/review-intel.webp", // real screenshots of the dashboard (run with Docker; demo reviews are AI-generated)
    gallery: [
      { src: "assets/img/projects/review-intel-analyze.webp", caption: "Analyse a review: local sentiment, aspects with quotes, owner reply draft" },
      { src: "assets/img/projects/review-intel-aspects.webp", caption: "Aspect breakdown for a campground" },
      { src: "assets/img/projects/review-intel-search.webp", caption: "Search reviews by meaning" },
      { src: "assets/img/projects/review-intel-mobile.webp", caption: "On a phone" },
    ],
    cover: { kind: "code", hue: 140 },
  },
  {
    title: "Form Coach",
    tagline: "AI rep counter & form checker that runs entirely in your browser",
    cat: ["ai", "web"], year: 2026,
    summary: "Point your camera at yourself and it recognises the exercise, counts your reps and gives a form tip after every rep — all on-device, so the video never leaves your browser. The open, measured version of the rep counting in my Forge app.",
    problem: "Fitness apps either count reps badly or send your camera feed to a server. And general AI video models turn out to be poor at counting reps.",
    solution: "MediaPipe Pose (WebAssembly) finds 33 body points 10 times a second. From them I compute joint angles and body-relative positions, and a small neural network I trained in PyTorch recognises squats, push-ups, curls and presses from 2-second windows — 97.5% of real test videos correct (the MLP beat a 1D-CNN; adding 12 real videos per exercise to 400 synthetic ones lifted accuracy from 80%). Reps are counted from one movement signal with detrending and two adaptive thresholds, tuned on a separate slice of PushUpBench: on unseen clips it gets 42% exactly right and 67% within one rep, against 3% and 15% for Gemini given the same videos. Form cues come from joint angles, with thresholds calibrated on real trainer videos so correct reps rarely get flagged. The whole pipeline is re-implemented in plain JavaScript (parity-tested against Python) and served from GitHub Pages under a strict CSP — which even blocks MediaPipe's own telemetry.",
    highlights: [
      "Live demo: camera, video upload or skeleton replay — nothing leaves the browser",
      "Exercise classifier I trained: 97.5% of unseen real videos (39/40)",
      "Rep counting beats Gemini on PushUpBench: 42% vs 3% exact, 67% vs 15% within one",
      "Form cues calibrated on trainer videos, false alarms measured",
      "Python ↔ JavaScript parity tests; strict CSP, self-hosted WebAssembly",
      "Honest limits: push-ups and very fast moves are the weak spots",
    ],
    stack: ["Python", "PyTorch", "MediaPipe", "Computer vision", "JavaScript", "WebAssembly", "Canvas", "scikit-learn", "Gemini API"],
    keywords: "pose estimation rep counter form checker fitness workout squat push up curl press camera mediapipe on-device webassembly browser privacy computer vision forge pushupbench",
    links: { live: "https://omar122211.github.io/form-coach/", code: "https://github.com/omar122211/form-coach" },
    image: "assets/img/projects/form-coach.webp", // real screenshots of the live demo (skeleton replay — no one's video)
    gallery: [
      { src: "assets/img/projects/form-coach-vs-gemini.webp", caption: "Rep counting vs Gemini on the same 60 real clips" },
      { src: "assets/img/projects/form-coach-curls.webp", caption: "Biceps-curl set: exercise detected, reps counted, every rep checked" },
      { src: "assets/img/projects/form-coach-mobile.webp", caption: "On a phone" },
    ],
    cover: { kind: "code", hue: 25 },
  },
  {
    title: "Forge",
    tagline: "A Solo Leveling–style fitness app that punishes skipped workouts",
    featured: true,
    cat: ["ai"], year: 2026, private: true,
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
    title: "This Portfolio",
    tagline: "Hand-built, no frameworks",
    cat: ["web", "ai"], year: 2026,
    summary: "The site you're on: a particle portrait made from my photo, an \"Ask me\" search engine and an interactive terminal — hand-built and secured with a strict Content Security Policy.",
    problem: "Templates all look the same, and portfolios rarely show how you actually build.",
    solution: "Hand-built with vanilla JavaScript and canvas. The portrait is ~22k particles generated from a photo after AI background removal; the \"Ask me\" chat is a BM25 search engine over the site's own content; everything follows the OWASP cheat sheets (CSP, safe DOM updates, URL allow-lists).",
    highlights: ["~22k-particle portrait at 60fps", "In-browser search engine (BM25)", "Strict CSP, no third-party requests", "Responsive from phone to desktop"],
    stack: ["JavaScript", "Canvas", "CSS", "Python", "OWASP"],
    keywords: "website site made dots particles portfolio security",
    links: { live: "https://omar122211.github.io/profile/", code: "https://github.com/omar122211/profile" },
    image: "assets/img/projects/portfolio.webp", // real screenshot of the hero
    cover: { kind: "code", hue: 18 },
  },
  {
    title: "Coordinate Transformation Tool",
    tagline: "Click a photo, get GPS coordinates",
    cat: ["web"], year: 2025,
    summary: "Click anywhere on an aerial photo and get the real-world GPS coordinates of that spot — calculated from the photo's four corner coordinates.",
    problem: "Aerial and drone images show a place, but not where each point in them is on the map.",
    solution: "A browser tool that maps pixel positions to latitude/longitude. You enter the image size and the GPS coordinates of its corners; the tool computes the scale (degrees per pixel) and converts any click on the image into coordinates, with the corner reference points drawn on the image. The demo uses a real 12 cm-per-pixel aerial photo of Times Square, cropped to exactly the area between the corner coordinates — so every click returns that spot's true location.",
    highlights: ["Click-to-coordinate conversion with live hover preview", "Real aerial photo of Times Square with matching corner coordinates", "Copy result or open it in Google Maps", "Shows the full calculation for every click", "Responsive, dark UI with a strict Content Security Policy"],
    stack: ["JavaScript", "HTML", "CSS", "GitHub Pages"],
    keywords: "gps map coordinates latitude longitude aerial image drone geo",
    links: { live: "https://omar122211.github.io/GPS/", code: "https://github.com/omar122211/GPS" },
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
    cat: ["systems"], year: 2024,
    summary: "A terminal chat server written in C: many users at once, public and private messages, and an integrity check on every message.",
    problem: "Understand how chat really works below the frameworks — sockets, threads and data integrity.",
    solution: "A TCP server that gives each connected client its own POSIX thread, with the client list protected by a mutex. Messages go to everyone or privately to one user. Each message carries a checksum and a CRC, which the server verifies to detect corrupted data before delivering it.",
    highlights: ["Concurrent clients with pthreads", "Public and private messages", "CRC + checksum error detection", "Thread-safe client list"],
    stack: ["C", "TCP sockets", "POSIX threads", "Linux"],
    keywords: "chat server socket network networking c language terminal cli threads",
    links: { live: "", code: "https://github.com/omar122211/Chat-Room" },
    cover: { kind: "terminal", hue: 140 },
  },
  {
    title: "Fitness Abbas",
    tagline: "Gym website with member accounts and an admin panel",
    cat: ["web"], year: 2023,
    summary: "A full gym website in PHP and MySQL: a public site with workouts, trainers and diet plans, member accounts with a personal dashboard, and an admin panel to manage members.",
    problem: "A gym needs more than a brochure site: members should be able to sign up, pick a plan and follow their progress, and staff need a place to manage them.",
    solution: "Built as a university web programming project: a public site (home, workout programs, trainers, diet plans, contact), sign-up and sign-in with plans of 3, 6 or 12 months, a member dashboard with progress charts and a profile, and an admin panel with a searchable members table to add, update and delete members. In 2026 I hardened it following the OWASP cheat sheets: prepared statements for every query, role-based access control, hashed passwords only, output escaping against XSS and secure session cookies — verified by 51 automated checks.",
    highlights: [
      "Public site, member dashboard and admin panel",
      "Sign-up, sign-in, plans and password change",
      "Admin: searchable members table, add / update / delete",
      "Hardened per OWASP: prepared statements, access control, XSS escaping",
      "Passwords hashed with password_hash(), never stored in plain text",
    ],
    stack: ["PHP", "MySQL", "JavaScript", "Bootstrap", "Chart.js"],
    keywords: "gym fitness php mysql website members admin panel dashboard workout trainers diet abbas sql injection security owasp",
    links: { live: "", code: "https://github.com/omar122211/webproject" },
    image: "assets/img/projects/gym.webp", // real screenshots (run locally)
    gallery: [
      { src: "assets/img/projects/gym-workouts.webp", caption: "Workout programs" },
      { src: "assets/img/projects/gym-signin.webp", caption: "Sign in" },
      { src: "assets/img/projects/gym-admin.webp", caption: "Admin dashboard" },
      { src: "assets/img/projects/gym-members.webp", caption: "Admin: members table (no passwords shown)" },
    ],
    cover: { kind: "shop", hue: 130 },
  },
];

window.PROJECT_CATS = { all: "All", ai: "AI & ML", web: "Web", systems: "Systems" };

/* EXPERIENCE — newest first.
   where: company / school — leave "" and nothing is shown. */
window.EXPERIENCE = [
  {
    when: "Jul 2022 — Now",
    role: "Freelance Full-stack Web Developer",
    where: "",
    text: "Building full-stack web applications for clients across different industries with React, Next.js, Node.js and Express — from the UI/UX to the back-end APIs, with clean, maintainable code delivered on time. Since 2026 focused on AI engineering: RAG assistants, NLP and computer vision.",
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
