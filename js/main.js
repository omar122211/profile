/* =====================================================================
   MAIN — builds the sections from js/data.js and wires up interactions.
   ===================================================================== */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const { esc, url: safeUrl, email: safeEmail, vars, frag, el } = window.SAFE;
  const SITE = window.SITE, SKILLS = window.SKILLS, PROJECTS = window.PROJECTS, EXPERIENCE = window.EXPERIENCE;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav ---------- */
  const nav = $("#nav"), toggle = $("#nav-toggle"), links = $("#nav-links");
  const progress = $("#scroll-progress");
  const onScroll = () => {
    nav.classList.toggle("scrolled", scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", open);
    nav.classList.toggle("open", open);
  });
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("open"); }
  });

  // highlight the section you're in
  const navMap = new Map($$("a", links).map((a) => [a.getAttribute("href").slice(1), a]));
  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navMap.forEach((a) => a.classList.remove("active"));
      navMap.get(en.target.id)?.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => secObserver.observe(s));

  /* ---------- marquee ---------- */
  const track = $("#marquee-track");
  const items = SKILLS.map((s) => `<span><i class="${esc(s.icon)}"></i>${esc(s.name)}</span>`).join("");
  track.innerHTML = items + items; // doubled for a seamless loop

  /* ---------- stats with count-up ---------- */
  const stats = [
    { n: SITE.yearsExperience, suffix: "+", label: "years experience" },
    { n: PROJECTS.length, suffix: "", label: "featured projects" },
    { n: SKILLS.length, suffix: "", label: "technologies" },
    { n: 2, suffix: "", label: "worlds: web + AI" },
  ];
  $("#stats").innerHTML = stats.map((s) =>
    `<div class="stat"><b data-count="${s.n}" data-suffix="${s.suffix}">0</b><span>${esc(s.label)}</span></div>`).join("");

  const countUp = (el) => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const t0 = performance.now(), dur = 1200;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- reveal on scroll ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      $$("[data-count]", en.target).forEach(countUp);
      revealObs.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  const watchReveal = (root = document) => $$(".reveal:not(.in)", root).forEach((el) => revealObs.observe(el));

  /* ---------- spotlight cards (glow follows the mouse) ---------- */
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest(".spotlight");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });

  /* ---------- tabs helper ---------- */
  function makeTabs(container, options, onChange, initial) {
    const first = initial in options ? initial : Object.keys(options)[0];
    container.innerHTML = Object.entries(options).map(([k, label]) =>
      `<button role="tab" data-key="${esc(k)}" aria-selected="${k === first}">${esc(label)}</button>`).join("");
    container.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      $$("button", container).forEach((x) => x.setAttribute("aria-selected", x === b));
      onChange(b.dataset.key);
    });
  }

  /* ---------- skills ---------- */
  const skillGrid = $("#skill-grid");
  function renderSkills(cat = "all") {
    const list = cat === "all" ? SKILLS : SKILLS.filter((s) => s.cat === cat);
    skillGrid.innerHTML = list.map((s, i) => `
      <div class="skill spotlight" data-i="${i}">
        <i class="${esc(s.icon)}"></i>
        <div class="skill-info">
          <b>${esc(s.name)}</b>
          <span class="mono">${s.years} yr${s.years > 1 ? "s" : ""} · ${esc(window.SKILL_CATS[s.cat])}</span>
          <span class="level" aria-label="Level ${s.level} of 5">${"<i class='on'></i>".repeat(s.level)}${"<i></i>".repeat(5 - s.level)}</span>
        </div>
      </div>`).join("");
    vars(skillGrid);
  }
  // AI & ML is shown first; "All" is one click away
  makeTabs($("#skill-tabs"), { all: "All", ...window.SKILL_CATS }, renderSkills, "ai");
  renderSkills("ai");

  /* ---------- terminal ---------- */
  const out = $("#term-out"), input = $("#term-input"), termBody = $("#term-body");
  const history = []; let hIdx = 0;
  // content is either a DOM node (anything containing visitor input) or fixed markup built from data.js
  const print = (content, cls = "") => {
    const div = document.createElement("div");
    div.className = "term-row " + cls;
    if (content instanceof Node) div.append(content);
    else div.innerHTML = content;
    out.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  };
  const COMMANDS = {
    help: () => print(
      `Available commands:<br>` +
      `  <b>whoami</b>       who is this guy<br>` +
      `  <b>skills</b> [cat] list skills (frontend | backend | ai | devops)<br>` +
      `  <b>projects</b>     list projects<br>` +
      `  <b>open</b> &lt;n&gt;     open project n<br>` +
      `  <b>contact</b>      how to reach me<br>` +
      `  <b>clear</b>        clear the screen`),
    whoami: () => print(`${esc(SITE.name)} — ${esc(SITE.role)}.<br>${SITE.yearsExperience} years shipping web apps &amp; AI products. Likes clean APIs, fast UIs and models that actually ship.`),
    skills: (arg) => {
      const list = arg ? SKILLS.filter((s) => s.cat === arg) : SKILLS;
      if (!list.length) return print(frag(`unknown category "${arg}". try: frontend, backend, ai, devops`), "err");
      print(list.map((s) => `<span class="t-skill">${esc(s.name.padEnd(17, " "))}</span>${"█".repeat(s.level)}${"░".repeat(5 - s.level)}`).join("<br>"));
    },
    projects: () => print(PROJECTS.map((p, i) => `[${i + 1}] ${esc(p.title)} <span class="dim">(${esc([].concat(p.cat).join(", "))}, ${esc(p.year)})</span>`).join("<br>") + `<br><span class="dim">type "open 1" to read more</span>`),
    open: (arg) => {
      const p = PROJECTS[+arg - 1];
      if (!p) return print(`usage: open &lt;1-${PROJECTS.length}&gt;`, "err");
      print(`opening ${esc(p.title)}…`);
      openProject(+arg - 1);
    },
    contact: () => {
      const mail = safeEmail(SITE.links.email), gh = safeUrl(SITE.links.github), li = safeUrl(SITE.links.linkedin);
      const rows = [];
      if (mail) rows.push(`email    <a href="mailto:${esc(mail)}">${esc(mail)}</a>`);
      if (gh) rows.push(`github   <a href="${esc(gh)}" target="_blank" rel="noopener noreferrer">${esc(gh)}</a>`);
      if (li) rows.push(`linkedin <a href="${esc(li)}" target="_blank" rel="noopener noreferrer">${esc(li)}</a>`);
      rows.push(`or jump to the <a href="#contact">contact section</a>`);
      print(rows.join("<br>"));
    },
    clear: () => { out.replaceChildren(); },
    sudo: (arg) => {
      if (/hire/.test(arg)) {
        print("[sudo] permission granted ✨ redirecting to contact…", "ok");
        setTimeout(() => $("#contact").scrollIntoView({ behavior: "smooth" }), 700);
      } else print("nice try 😄 (hint: sudo hire omar)", "err");
    },
    ls: () => print("about.md  skills.json  projects/  ask-me/  contact.txt"),
    cat: () => print("meow 🐈 — try <b>whoami</b> instead"),
  };
  function run(cmdLine) {
    const line = cmdLine.trim();
    print(frag(el("span", "$", "prompt"), line), "cmd"); // visitor text → textContent only
    if (!line) return;
    history.push(line); hIdx = history.length;
    const [cmd, ...rest] = line.split(/\s+/);
    const fn = Object.hasOwn(COMMANDS, cmd.toLowerCase()) ? COMMANDS[cmd.toLowerCase()] : null;
    fn ? fn(rest.join(" ").toLowerCase()) : print(frag(`command not found: ${cmd} — type `, el("b", "help")), "err");
  }
  $("#term-form").addEventListener("submit", (e) => { e.preventDefault(); run(input.value); input.value = ""; });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hIdx > 0) { input.value = history[--hIdx]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ""; }
  });
  termBody.addEventListener("click", () => input.focus({ preventScroll: true }));

  // auto-type a first command when the terminal scrolls into view
  let termStarted = false;
  new IntersectionObserver(([en], obs) => {
    if (!en.isIntersecting || termStarted) return;
    termStarted = true; obs.disconnect();
    print(`<span class="dim">Welcome! This is a real (tiny) shell. Try a command below.</span>`);
    const demo = "whoami";
    let i = 0;
    const typeIt = () => {
      input.value = demo.slice(0, ++i);
      if (i < demo.length) setTimeout(typeIt, 90);
      else setTimeout(() => { run(demo); input.value = ""; print(`<span class="dim">type <b>help</b> to see everything</span>`); }, 350);
    };
    setTimeout(typeIt, 500);
  }, { threshold: 0.5 }).observe($("#terminal"));

  /* ---------- project covers (drawn with HTML/CSS, no images needed) ---------- */
  const catsOf = (p) => [].concat(p.cat || []);
  const catLabel = (p) => catsOf(p).map((c) => window.PROJECT_CATS[c] || c).join(" / ");

  function cover(p) {
    const img = safeUrl(p.image);
    const k = p.cover?.kind || "code";
    if (img && k !== "notebook") return `<img src="${esc(img)}" alt="" loading="lazy">`;
    const bar = (label, val, pct) => `<li><span>${label}</span><b>${val}</b><i data-w="${pct}"></i></li>`;
    const special = {
      phone: `<div class="m-phone">
          <div class="phone">
            <p class="ph-sys">[ SYSTEM ]</p>
            <p class="ph-title">DAILY QUEST</p>
            <ul class="ph-q">${bar("Push-ups", "40/40", 100)}${bar("Sit-ups", "28/40", 70)}${bar("Squats", "12/50", 24)}${bar("Run", "2.1/5 km", 42)}</ul>
            <div class="ph-xp"><span>LV 12</span><i data-w="64"></i></div>
          </div>
          <div class="ph-float ph-pen"><i class="fa-solid fa-lock"></i><div><b>PENALTY</b><span>Instagram locked · 23:59:12</span></div></div>
          <div class="ph-float ph-ai"><i class="fa-solid fa-person-running"></i><div><b>Pose detected</b><span>rep 28 counted</span></div></div>
        </div>`,
      map: `<div class="m-map"><span class="corner tl">40.7589°, -73.9851°</span><span class="corner br">40.7579°, -73.9841°</span>
          <i class="fa-solid fa-location-dot pin"></i>
          <div class="readout mono"><b>pixel (182, 337)</b><span>40.758399°, -73.984599°</span></div></div>`,
      camp: `<div class="m-camp">${[["Pine Ridge", "★★★★★", 34], ["Lakeside", "★★★★☆", 24], ["Red Canyon", "★★★★☆", 28]].map(([n, s, pr]) =>
          `<div><span class="pic"></span><b>${n}</b><em>${s}</em><small>$${pr} / night</small></div>`).join("")}</div>`,
      terminal: `<div class="m-term mono"><p class="dim">$ ./server</p><p class="dim">[server] waiting for clients…</p>
          <p><span class="u1">omar</span> joined the chat</p><p><span class="u1">omar:</span> hey everyone</p>
          <p><span class="u2">sara:</span> hi! 👋</p><p class="prv">[private] sara → omar: meet at 5?</p>
          <p class="ok">✓ CRC ok · checksum ok</p></div>`,
      notebook: `<div class="m-nb"><p class="mono"><span class="in">In [14]:</span> kmeans = KMeans(n_clusters=5).fit(X)</p>${img ? `<img src="${esc(img)}" alt="K-Means customer segmentation chart" loading="lazy">` : ""}</div>`,
    }[k];
    if (special) return `<div class="mock mock-${k}">${k === "phone" ? "" : `<div class="mock-bar"><i></i><i></i><i></i></div>`}${special}</div>`;
    const bars = (n) => Array.from({ length: n }, () => `<i data-h="${Math.round(20 + Math.random() * 75)}"></i>`).join("");
    const inner = {
      chat: `<div class="m-chat"><p class="u">How do I reset my password?</p><p class="a">Go to Settings → Security → Reset. <em>Source: help-center.md §4</em></p><p class="u">Thanks!</p><p class="a typing"><span></span><span></span><span></span></p></div>`,
      dashboard: `<div class="m-dash"><div class="kpis"><b>12.4k</b><b>+18%</b><b>3.2s</b></div><div class="bars">${bars(14)}</div></div>`,
      shop: `<div class="m-shop">${Array.from({ length: 6 }, () => `<div><span></span><i></i><b></b></div>`).join("")}</div>`,
      vision: `<div class="m-vision"><div class="box b1"><em>person 0.98</em></div><div class="box b2"><em>laptop 0.91</em></div><div class="box b3"><em>cup 0.87</em></div></div>`,
      api: `<div class="m-code"><p><span class="k">POST</span> /v1/keys</p><p>{</p><p>&nbsp;&nbsp;<span class="s">"limit"</span>: <span class="n">1000</span>,</p><p>&nbsp;&nbsp;<span class="s">"scope"</span>: <span class="s">"read"</span></p><p>}</p><p class="ok">← 201 Created · 12ms</p></div>`,
      code: `<div class="m-code"><p><span class="k">const</span> me = {</p><p>&nbsp;&nbsp;role: <span class="s">"full-stack"</span>,</p><p>&nbsp;&nbsp;ai: <span class="k">true</span>,</p><p>&nbsp;&nbsp;years: <span class="n">4</span></p><p>};</p><p class="ok">// ✓ compiled</p></div>`,
    }[k] || "";
    return `<div class="mock"><div class="mock-bar"><i></i><i></i><i></i></div>${inner}</div>`;
  }

  /* ---------- work ---------- */
  const workGrid = $("#work-grid");
  function renderWork(cat = "all") {
    const list = PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) => cat === "all" || catsOf(p).includes(cat));
    const featuredIdx = list.findIndex(({ p }) => p.featured);
    workGrid.innerHTML = list.map(({ p, i }, n) => {
      const big = n === featuredIdx;
      // private code: no badge on the card (the case study explains); public code: "Open source"
      const badge = !p.private && safeUrl(p.links?.code) ? `<span class="badge open"><i class="fa-brands fa-github"></i> Open source</span>` : "";
      const live = safeUrl(p.links?.live) ? `<span class="badge live"><i class="fa-solid fa-circle"></i> Live</span>` : "";
      return `
      <article class="project reveal${big ? " featured" : ""}" data-hue="${esc(p.cover?.hue ?? 20)}" data-index="${i}" tabindex="0" role="button" aria-label="Open ${esc(p.title)} case study">
        <div class="project-cover">${cover(p)}<span class="glare"></span></div>
        <div class="project-body">
          <p class="project-meta mono">${big ? `<span class="star">★ Featured</span> · ` : ""}${esc(catLabel(p))} · ${esc(p.year)}</p>
          <h3>${esc(p.title)}</h3>
          ${p.tagline ? `<p class="tagline">${esc(p.tagline)}</p>` : ""}
          <p>${esc(p.summary)}</p>
          ${big && p.highlights ? `<ul class="hl">${p.highlights.slice(0, 4).map((h) => `<li><i class="fa-solid fa-check"></i>${esc(h)}</li>`).join("")}</ul>` : ""}
          <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          <div class="project-foot"><span class="project-more">Read case study <i class="fa-solid fa-arrow-right"></i></span><span class="badges">${live}${badge}</span></div>
        </div>
      </article>`;
    }).join("");
    vars(workGrid);
    watchReveal(workGrid);
  }
  makeTabs($("#work-tabs"), window.PROJECT_CATS, renderWork);
  renderWork();

  workGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".project");
    if (card) openProject(+card.dataset.index);
  });
  workGrid.addEventListener("keydown", (e) => {
    const card = e.target.closest(".project");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProject(+card.dataset.index); }
  });

  // 3D tilt
  if (!reduceMotion) {
    workGrid.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".project");
      if (!card || e.pointerType === "touch") return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--rx", (-py * 7).toFixed(2) + "deg");
      card.style.setProperty("--ry", (px * 9).toFixed(2) + "deg");
      card.style.setProperty("--gx", (px + 0.5) * 100 + "%");
      card.style.setProperty("--gy", (py + 0.5) * 100 + "%");
    });
    workGrid.addEventListener("pointerout", (e) => {
      const card = e.target.closest(".project");
      if (card && !card.contains(e.relatedTarget)) { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); }
    });
  }

  /* ---------- project modal ---------- */
  const modal = $("#project-modal"), modalContent = $("#modal-content");
  function openProject(i) {
    const p = PROJECTS[i];
    if (!p) return;
    const link = (href, label, icon) => {
      const u = safeUrl(href);
      return u ? `<a class="btn btn-ghost" href="${esc(u)}" target="_blank" rel="noopener noreferrer"><i class="${icon}"></i> ${label}</a>` : "";
    };
    modalContent.innerHTML = `
      <div class="modal-cover" data-hue="${esc(p.cover?.hue ?? 20)}">${cover(p)}</div>
      <div class="modal-body">
        <p class="project-meta mono">${esc(catLabel(p))} · ${esc(p.year)}</p>
        <h3>${esc(p.title)}</h3>
        <p class="lead">${esc(p.summary)}</p>
        <div class="case">
          <div><h4>The problem</h4><p>${esc(p.problem)}</p></div>
          <div><h4>What I built</h4><p>${esc(p.solution)}</p></div>
        </div>
        <h4>Highlights</h4>
        <ul class="results">${(p.highlights || p.results || []).map((r) => `<li><i class="fa-solid fa-check"></i> ${esc(r)}</li>`).join("")}</ul>
        ${(p.gallery || []).filter((g) => safeUrl(g.src)).length ? `<h4>Screenshots</h4>
        <div class="gallery">${p.gallery.filter((g) => safeUrl(g.src)).map((g) =>
          `<figure><img src="${esc(safeUrl(g.src))}" alt="${esc(g.caption || "")}" loading="lazy"><figcaption>${esc(g.caption || "")}</figcaption></figure>`).join("")}</div>` : ""}
        <h4>Stack</h4>
        <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        <div class="modal-links">${link(p.links?.live, "Live demo", "fa-solid fa-arrow-up-right-from-square")}${link(p.links?.code, "Source code", "fa-brands fa-github")}${p.liveNote && safeUrl(p.links?.live) ? `<span class="private-note"><i class="fa-solid fa-hourglass-half"></i> ${esc(p.liveNote)}</span>` : ""}${p.private ? `<span class="private-note"><i class="fa-solid fa-lock"></i> Source code is private — happy to walk through it in an interview.</span>` : ""}</div>
      </div>`;
    vars(modalContent);
    modal.showModal();
  }
  $("#modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  /* ---------- timeline ---------- */
  const timeline = $("#timeline");
  timeline.insertAdjacentHTML("beforeend", EXPERIENCE.map((x) => `
    <li class="tl-item reveal">
      <span class="tl-dot"></span>
      <p class="tl-when mono">${esc(x.when)}</p>
      <h3>${esc(x.role)}${x.where ? ` <span>@ ${esc(x.where)}</span>` : ""}</h3>
      <p>${esc(x.text)}</p>
      <ul class="tags">${x.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    </li>`).join(""));
  const updateTimeline = () => {
    const r = timeline.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    timeline.style.setProperty("--p", p.toFixed(3));
  };
  addEventListener("scroll", updateTimeline, { passive: true });
  updateTimeline();

  /* ---------- contact ---------- */
  // every link from data.js goes through the URL allow-list (no javascript: links)
  const L = {
    email: safeEmail(SITE.links.email), github: safeUrl(SITE.links.github),
    linkedin: safeUrl(SITE.links.linkedin), cv: safeUrl(SITE.links.cv),
  };
  const ext = `target="_blank" rel="noopener noreferrer"`;
  const contactItems = [
    L.email && `<li><a href="mailto:${esc(L.email)}"><i class="fa-solid fa-envelope"></i> ${esc(L.email)}</a></li>`,
    L.github && `<li><a href="${esc(L.github)}" ${ext}><i class="fa-brands fa-github"></i> GitHub</a></li>`,
    L.linkedin && `<li><a href="${esc(L.linkedin)}" ${ext}><i class="fa-brands fa-linkedin"></i> LinkedIn</a></li>`,
    L.cv && `<li><a href="${esc(L.cv)}" ${ext}><i class="fa-solid fa-file-arrow-down"></i> Download CV</a></li>`,
  ].filter(Boolean);
  $("#contact-links").innerHTML = contactItems.join("");

  const form = $("#contact-form");
  form.hidden = !L.email; // the form sends through email, so it only shows once an email is set
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const f = new FormData(form), note = $("#form-note");
    const clean = (k, max) => String(f.get(k) || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
    const name = clean("name", 80), from = clean("email", 120), message = clean("message", 4000);
    const subject = `Project inquiry from ${name}`;
    const body = `${message}\n\n— ${name} (${from})`;
    // every value is URL-encoded, so nothing typed can add extra mail headers (cc, bcc…)
    location.href = `mailto:${L.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = "Opening your email app…";
  });

  $("#hero-available").hidden = !SITE.available;
  $("#year").textContent = new Date().getFullYear();
  window.openProject = openProject; // used by the "Ask me" chat
  watchReveal();
})();
