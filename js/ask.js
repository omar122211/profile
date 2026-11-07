/* =====================================================================
   ASK ME — a tiny search engine over everything in js/data.js.
   Same idea as an AI "chat with your documents" system:
     1. read the question (tokens)   2. search all facts (BM25 ranking)
     3. pick the best matches        4. build the answer from the top match
   Every answer comes from data.js, so it stays in sync with the site.
   ===================================================================== */
(() => {
  const log = document.getElementById("chat-log");
  if (!log) return;
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const chips = document.getElementById("chat-chips");
  const hood = document.getElementById("hood");
  const steps = document.getElementById("hood-steps");
  const { SITE, SKILLS, SKILL_CATS, PROJECTS, PROJECT_CATS, EXPERIENCE } = window;
  const { esc, url: safeUrl, email: safeEmail, vars, el } = window.SAFE;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- text processing ---------- */
  const STOP = new Set(("a an the is are am was were be been do does did you your yours i me my mine we our it its this that these those " +
    "what which whom how why when where can could would should will shall may might of to in on at for with about from by as and or " +
    "but if so any some tell show give please much many have has had there here than then also just really very get got want like ok okay").split(" "));
  const stem = (w) => w.length > 4 && w.endsWith("ing") ? w.slice(0, -3)
    : w.length > 3 && w.endsWith("ies") ? w.slice(0, -3) + "y"
    : w.length > 3 && w.endsWith("es") && /(sh|ch|x|ss)es$/.test(w) ? w.slice(0, -2)
    : w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1)
    : w.length > 4 && w.endsWith("ed") ? w.slice(0, -2) : w;
  const tokenize = (s) => String(s).toLowerCase()
    .replace(/next\.js/g, "nextjs").replace(/node\.js/g, "nodejs").replace(/ci\/cd/g, "cicd")
    .split(/[^a-z0-9+#]+/).filter((w) => w.length > 1 && !STOP.has(w)).map(stem);

  // words people use → words in the facts
  const SYN = {
    stack: ["skill", "technology"], tech: ["skill", "technology"], technology: ["skill"], tool: ["skill"],
    language: ["skill"], framework: ["skill"], know: ["skill"], use: ["skill"], good: ["skill", "level"], best: ["level"],
    experience: ["year", "career"], long: ["year"], old: ["year"], senior: ["year"], job: ["career", "role"], work: ["project", "career"],
    worked: ["career"], career: ["role"], company: ["career"], history: ["career"],
    ai: ["ml", "llm"], ml: ["ai"], machine: ["ai"], learning: ["ai"], llm: ["ai"], gpt: ["llm"], chatgpt: ["llm"], openai: ["llm"], chatbot: ["chat", "ai"], bot: ["chat"],
    project: ["work"], portfolio: ["project"], built: ["project", "build"], build: ["project"], made: ["project"], app: ["project"], example: ["project"],
    contact: ["email", "reach"], reach: ["contact"], email: ["contact"], mail: ["contact"], hire: ["contact", "available"], talk: ["contact"],
    available: ["availability"], freelance: ["available", "service"], free: ["available"],
    service: ["offer"], offer: ["service"], help: ["service"], do: ["service"],
    front: ["frontend"], frontend: ["ui"], ui: ["frontend"], design: ["frontend"], back: ["backend"], backend: ["server", "api"], server: ["backend"],
    database: ["db", "data"], db: ["database"], devops: ["deploy"], deploy: ["devops"], cloud: ["devops", "deploy"],
    js: ["javascript"], ts: ["typescript"], py: ["python"], postgres: ["postgresql"], mongo: ["mongodb"], node: ["nodejs"], next: ["nextjs"],
    hi: ["hello"], hey: ["hello"], salam: ["hello"], hello: ["greeting"],
    who: ["about"], yourself: ["about"], introduce: ["about"], background: ["about"],
    site: ["website"], website: ["site"], dot: ["particle"],
  };
  const expand = (tokens) => {
    const out = [];
    tokens.forEach((t) => {
      out.push({ t, w: 1 });
      if (Object.hasOwn(SYN, t)) SYN[t].forEach((s) => out.push({ t: stem(s), w: 0.5 })); // hasOwn: ignore "constructor", "__proto__"…
    });
    return out;
  };

  /* ---------- knowledge: built from data.js ---------- */
  const docs = [];
  const add = (title, text, keywords, answer, actions = []) => docs.push({ title, text, keywords, answer, actions });
  const catsOf = (p) => [].concat(p.cat || []);
  // "C & Networking" must match the stack item "C" — not "CSS" or "CameraX"
  const projectsUsing = (skill) => {
    const full = skill.toLowerCase(), first = full.split(/[ &]+/)[0];
    return PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) => p.stack.some((raw) => {
      const s = raw.toLowerCase();
      return s === full || s === first || s.startsWith(first + " ") || (first.length > 3 && s.startsWith(first));
    }));
  };
  const projBtn = (i) => ({ label: `Open “${PROJECTS[i].title}”`, run: () => window.openProject?.(i) });
  const goto = (id, label) => ({ label, run: () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }) });
  const list = (arr) => arr.length > 1 ? arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1] : arr[0] || "";
  const L = SITE.links || {};
  const current = EXPERIENCE[0];

  add("Greeting", "hello greeting", "hello hi hey greeting salam",
    `Hi! 👋 I'm ${esc(SITE.name.split(" ")[0])}. Ask me about my skills, projects or experience.`);

  add("About me", `${SITE.name} ${SITE.role} about`, "about who yourself introduce background omar name",
    `I'm ${esc(SITE.name)}, a ${esc(SITE.role)} with ${SITE.yearsExperience} years of experience. I build products end to end — interface, API, database — and wire AI into them so they actually get smarter.`,
    [goto("about", "Read more about me")]);

  add("Years of experience", `${SITE.yearsExperience} years experience career`, "year experience long senior career",
    `${SITE.yearsExperience} years of professional experience.` + (current ? ` Right now I work as a <b>${esc(current.role)}</b> (${esc(current.when)}).` : ""),
    [goto("experience", "See my timeline")]);

  add("My full stack", "skill technology stack all", "skill stack technology tool language framework",
    Object.entries(SKILL_CATS).map(([k, label]) =>
      `<b>${esc(label)}:</b> ${esc(list(SKILLS.filter((s) => s.cat === k).map((s) => s.name)))}`).join("<br>"),
    [goto("skills", "See all skills")]);

  Object.entries(SKILL_CATS).forEach(([k, label]) => {
    const items = SKILLS.filter((s) => s.cat === k);
    add(`${label} skills`, `${label} ${k} skill`, `${k} ${label} skill ${items.map((s) => s.name).join(" ")}`,
      `My ${esc(label.toLowerCase())} toolkit: ` + items.map((s) => `<b>${esc(s.name)}</b> (${s.years} yr${s.years > 1 ? "s" : ""})`).join(", ") + ".");
  });

  const ALIASES = {
    "JavaScript": "js es6", "TypeScript": "ts", "React": "reactjs", "Next.js": "nextjs next", "Node.js": "nodejs node",
    "PostgreSQL": "postgres sql", "MongoDB": "mongo nosql", "LLM APIs": "llm gpt openai claude chatgpt gemini",
    "RAG & Vector DBs": "rag vector embedding retrieval pinecone pgvector", "PyTorch": "torch deep learning",
    "Hugging Face": "huggingface transformer", "CI/CD": "cicd pipeline github action", "Docker": "container",
    "Linux & Nginx": "linux nginx server vps", "REST & GraphQL": "rest graphql api", "Tailwind CSS": "tailwind",
    "HTML & CSS": "html css", "Git & GitHub": "git github", "Kotlin": "android kotlin",
    "Jetpack Compose": "compose android ui", "Room & CameraX": "room camerax camera sqlite", "scikit-learn": "sklearn scikit",
    "pandas & NumPy": "pandas numpy dataframe", "ML Kit": "mlkit pose detection vision", "Supabase": "supabase auth",
    "C & Networking": "c socket sockets tcp network networking pthread threads",
    "Auth & OAuth": "auth authentication login signup oauth passport google facebook session", "Stripe Payments": "stripe payment payments checkout", "PHP": "php", "MySQL": "mysql mariadb sql", "GitHub Actions": "github action ci cd cicd pipeline workflow",
  };
  const LEVEL = ["", "learning it", "comfortable", "solid", "strong", "expert"];
  SKILLS.forEach((s) => {
    const used = projectsUsing(s.name);
    add(s.name, `${s.name} ${SKILL_CATS[s.cat]}`, `${s.name} ${s.name} ${ALIASES[s.name] || ""}`,
      `Yes — <b>${esc(s.name)}</b>: ${s.years} year${s.years > 1 ? "s" : ""} of use, ${LEVEL[s.level]} (${s.level}/5).` +
      (used.length ? ` I used it in ${list(used.map(({ p }) => `<b>${esc(p.title)}</b>`))}.` : ""),
      used.slice(0, 2).map(({ i }) => projBtn(i)));
  });

  add("All projects", "project work portfolio", "project portfolio made app example",
    `Here's what I've built: ` + PROJECTS.map((p) => `<b>${esc(p.title)}</b>`).join(", ") + `. Tap one to read the full story.`,
    [goto("work", "Browse all work"), ...PROJECTS.slice(0, 3).map((_, i) => projBtn(i))]);

  Object.entries(PROJECT_CATS).filter(([k]) => k !== "all").forEach(([k, label]) => {
    const ps = PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) => catsOf(p).includes(k));
    if (!ps.length) return;
    const extra = { ai: "ml llm machine learning", mobile: "android app phone kotlin", systems: "low level network c", web: "website site" }[k] || "";
    add(`${label} projects`, `${label} ${k} project`, `${k} ${label} project ${extra}`,
      `My ${esc(label)} projects: ` + ps.map(({ p }) => `<b>${esc(p.title)}</b> — ${esc(p.summary)}`).join("<br>"),
      ps.slice(0, 3).map(({ i }) => projBtn(i)));
  });

  PROJECTS.forEach((p, i) => {
    add(p.title, `${p.title} ${p.tagline || ""} ${p.summary} ${p.solution}`, `${p.title} ${p.title} ${p.stack.join(" ")} ${catsOf(p).join(" ")} ${p.keywords || ""} ${p.keywords || ""}`,
      `<b>${esc(p.title)}</b> (${esc(p.year)}) — ${esc(p.summary)}<br>Built with ${esc(list(p.stack))}.`,
      [projBtn(i)]);
  });

  add("Career history", "career history work experience", "career work worked before previous past job company history role role study studied university education degree school graduate freelance",
    EXPERIENCE.map((x) => `<b>${esc(x.role)}</b>${x.where ? ` at ${esc(x.where)}` : ""} · ${esc(x.when)}`).join("<br>"),
    [goto("experience", "See my timeline")]);

  EXPERIENCE.forEach((x) => {
    add(`${x.role} (${x.when})`, `${x.role} ${x.where} ${x.text}`, `career role job ${x.role} ${x.tags.join(" ")}`,
      `<b>${esc(x.role)}</b>${x.where ? ` at ${esc(x.where)}` : ""} · ${esc(x.when)}<br>${esc(x.text)}`,
      [goto("experience", "See my timeline")]);
  });

  add("What I do", "service offer help frontend backend ai devops", "service offer help hire freelance build build client",
    `I can help with: <b>web apps</b> (fast, animated interfaces plus Node.js/Express backends and databases), <b>Android apps</b> (Kotlin + Jetpack Compose with camera, GPS and cloud sync), and <b>AI features</b> (on-device vision like pose detection, machine-learning models, LLM-powered tools).`,
    [goto("contact", "Start a project")]);

  const mail = safeEmail(L.email), li = safeUrl(L.linkedin), gh = safeUrl(L.github);
  const contactBits = [
    mail && `email <a href="mailto:${esc(mail)}">${esc(mail)}</a>`,
    li && `<a href="${esc(li)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`,
    gh && `<a href="${esc(gh)}" target="_blank" rel="noopener noreferrer">GitHub</a>`,
  ].filter(Boolean);
  add("Contact", "contact email reach", "contact email reach hire talk message linkedin github",
    contactBits.length ? `You can reach me via ${list(contactBits)}.` : `The contact section has everything you need — I'd love to hear about your project.`,
    [goto("contact", "Go to contact")]);

  if (SITE.available) {
    add("Availability", "available availability freelance", "available availability hire freelance free open",
      `Yes — I'm currently available for new projects. Tell me what you're building!`,
      [goto("contact", "Get in touch")]);
  }

  /* ---------- BM25 search ---------- */
  docs.forEach((d) => {
    d.tokens = [...tokenize(d.title), ...tokenize(d.text), ...tokenize(d.keywords), ...tokenize(d.keywords)];
    d.tf = new Map();
    d.tokens.forEach((t) => d.tf.set(t, (d.tf.get(t) || 0) + 1));
  });
  const avgLen = docs.reduce((s, d) => s + d.tokens.length, 0) / docs.length;
  const df = new Map();
  docs.forEach((d) => new Set(d.tokens).forEach((t) => df.set(t, (df.get(t) || 0) + 1)));
  const idf = (t) => Math.log(1 + (docs.length - (df.get(t) || 0) + 0.5) / ((df.get(t) || 0) + 0.5));

  function search(q) {
    const tokens = tokenize(q);
    const terms = expand(tokens);
    const k1 = 1.3, b = 0.7;
    const scored = docs.map((d) => {
      let s = 0;
      terms.forEach(({ t, w }) => {
        const f = d.tf.get(t);
        if (f) s += w * idf(t) * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.tokens.length / avgLen));
      });
      // exact name match bonus (e.g. "docker", "react")
      // naming something exactly ("docker", "react", a project title) beats generic words like "experience"
      if (d.title.length > 1 && q.toLowerCase().includes(d.title.toLowerCase())) s += 12;
      return { d, s };
    }).filter((r) => r.s > 0).sort((a, b) => b.s - a.s);
    return { tokens, scored };
  }

  /* ---------- UI ---------- */
  // content: a DOM node (visitor text) or fixed answer markup built from data.js
  function bubble(content, who, actions = []) {
    const row = document.createElement("div");
    row.className = `msg ${who}`;
    if (who === "bot") {
      const img = document.createElement("img");
      img.className = "chat-avatar"; img.src = "assets/img/omar-cutout.webp"; img.alt = "";
      row.append(img);
    }
    const b = document.createElement("div");
    b.className = "bubble";
    if (content instanceof Node) b.append(content); else b.innerHTML = content;
    row.append(b);
    if (actions.length) {
      const wrap = document.createElement("div");
      wrap.className = "msg-actions";
      actions.forEach((a) => {
        const btn = document.createElement("button");
        btn.type = "button"; btn.textContent = a.label;
        btn.addEventListener("click", a.run);
        wrap.appendChild(btn);
      });
      row.querySelector(".bubble").appendChild(wrap);
    }
    log.appendChild(row);
    log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
    return row;
  }

  function showSteps(q, tokens, scored, ms) {
    const top = scored.slice(0, 3), max = top[0]?.s || 1;
    const html = [
      `<li><span class="n">1</span><div><b>Read the question</b><div class="tok"></div></div></li>`,
      `<li><span class="n">2</span><div><b>Searched ${docs.length} facts about me</b><p>in ${ms < 1 ? "under 1" : ms.toFixed(1)} ms, ranked with BM25 — the same scoring classic search engines use.</p></div></li>`,
      `<li><span class="n">3</span><div><b>Best matches</b>${top.length ? top.map((r) =>
        `<div class="match"><span>${esc(r.d.title)}</span><i data-w="${Math.max(6, (r.s / max) * 100).toFixed(0)}"></i><em>${r.s.toFixed(2)}</em></div>`).join("") : "<p>nothing relevant</p>"}</div></li>`,
      `<li><span class="n">4</span><div><b>Built the answer</b><p>${top[0] && top[0].s >= 1.2 ? `from “${esc(top[0].d.title)}”` : "no strong match, so I asked for a rephrase"}</p></div></li>`,
    ];
    steps.replaceChildren();
    html.forEach((h, i) => {
      const li = document.createElement("template");
      li.innerHTML = h;
      const node = li.content.firstChild;
      node.style.animationDelay = (reduceMotion ? 0 : i * 140) + "ms";
      steps.appendChild(vars(node));
    });
    // keywords come from what the visitor typed → textContent only
    const tok = steps.querySelector(".tok");
    if (tokens.length) tokens.forEach((t) => tok.append(el("code", t)));
    else tok.append(el("em", "no keywords found"));
  }

  let busy = false;
  function ask(q) {
    q = String(q).trim().slice(0, 200);
    if (!q || busy) return;
    busy = true;
    bubble(document.createTextNode(q), "user"); // visitor text → textContent only
    const t0 = performance.now();
    const { tokens, scored } = search(q);
    const ms = performance.now() - t0;
    showSteps(q, tokens, scored, ms);

    const typing = bubble(`<span class="typing"><span></span><span></span><span></span></span>`, "bot");
    setTimeout(() => {
      typing.remove();
      const top = scored[0];
      if (top && top.s >= 1.2) bubble(top.d.answer, "bot", top.d.actions);
      else bubble(`Hmm, I don't have an answer for that one. Try asking about my skills, projects or experience — or reach me directly.`, "bot", [goto("contact", "Contact me")]);
      busy = false;
    }, reduceMotion ? 50 : 550 + Math.random() * 400);
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); input.value = ""; });

  const SUGGESTIONS = ["Tell me about Forge", "What's your stack?", "Show me your AI projects", "Do you know Kotlin?", "What can you build for me?", "How can I contact you?"];
  chips.innerHTML = SUGGESTIONS.map((s) => `<button type="button">${esc(s)}</button>`).join("");
  chips.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) ask(b.textContent);
  });

  bubble(`Hi, I'm ${esc(SITE.name.split(" ")[0])} 👋 Ask me anything about my skills, projects or experience — or tap a suggestion below.`, "bot");

  // "under the hood" is open on wide screens, tucked away on phones
  const wide = matchMedia("(min-width: 1000px)");
  const syncHood = () => { hood.open = wide.matches; };
  syncHood();
  wide.addEventListener?.("change", syncHood);
})();
