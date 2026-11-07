/* =====================================================================
   HERO — portrait made of particles.
   - Every visit picks a random intro (the "unpredictable" part).
   - Dots spread away from the cursor and spring back.
   - Click = shockwave.  "Reveal" = dots blow away and the real photo wipes in.
   Dot positions come from js/portrait-data.js (generated from the photo).
   ===================================================================== */
(() => {
  const P = window.PORTRAIT;
  const stage = document.getElementById("hero-stage");
  const canvas = document.getElementById("hero-canvas");
  if (!P || !stage || !canvas) return;

  const ctx = canvas.getContext("2d");
  const photo = document.getElementById("hero-photo");
  const revealBtn = document.getElementById("reveal-btn");
  const hint = document.getElementById("hero-hint");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- decode dots ---------- */
  const raw = Uint8Array.from(atob(P.data), (c) => c.charCodeAt(0));
  const total = raw.length / 4;
  // phones draw half the dots, picked in a checkerboard so there are no stripes
  const phone = innerWidth < 700;
  const pick = [];
  for (let k = 0; k < total; k++) {
    if (!phone || (raw[k * 4] + raw[k * 4 + 1]) % 2 === 0) pick.push(k * 4);
  }
  const N = pick.length;
  const aspect = P.w / P.h;

  const gx = new Float32Array(N), gy = new Float32Array(N);   // grid position
  const hx = new Float32Array(N), hy = new Float32Array(N);   // home position (px)
  const x = new Float32Array(N), y = new Float32Array(N);
  const vx = new Float32Array(N), vy = new Float32Array(N);
  const delay = new Float32Array(N);   // ms before a dot starts flying home
  const rnd = new Float32Array(N);     // per-dot random 0..1
  const phase = new Float32Array(N);   // idle shimmer
  const bucketOf = new Uint8Array(N);

  const BUCKETS = 10;
  for (let i = 0; i < N; i++) {
    const k = pick[i];
    gx[i] = raw[k] + Math.random() * 0.6 - 0.3;
    gy[i] = raw[k + 1] + Math.random() * 0.6 - 0.3;
    const tone = raw[k + 2] / 255, rim = raw[k + 3] / 255;
    const v = Math.max(tone, rim * 0.95);
    bucketOf[i] = Math.min(BUCKETS - 1, Math.floor(v * BUCKETS));
    rnd[i] = Math.random();
    phase[i] = Math.random() * Math.PI * 2;
  }

  // group dots by brightness so we set fillStyle only 10 times per frame
  const buckets = Array.from({ length: BUCKETS }, () => []);
  for (let i = 0; i < N; i++) buckets[bucketOf[i]].push(i);
  const bucketIdx = buckets.map((b) => Int32Array.from(b));
  const bucketColor = [], bucketSize = [];
  for (let b = 0; b < BUCKETS; b++) {
    const v = (b + 0.5) / BUCKETS;
    const r = Math.round(110 + 145 * v);
    const g = Math.round(28 + 125 * Math.pow(v, 1.6));
    const bl = Math.round(10 + 70 * Math.pow(v, 3));
    bucketColor.push(`rgba(${r},${g},${bl},${(0.22 + 0.78 * v).toFixed(3)})`);
    bucketSize.push((phone ? 0.55 : 0.38) + 0.4 * v); // fraction of one grid cell
  }

  /* ---------- layout ---------- */
  let W = 0, H = 0, dpr = 1, scale = 1, box = { x: 0, y: 0, w: 0, h: 0 };

  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = stage.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    const wide = W >= 1000;
    let bw, bh;
    if (wide) {
      // leave room on the left for the name/intro text (same widths as the CSS)
      const gutter = Math.min(56, Math.max(16, W * 0.04));
      const introW = Math.min(460, W * 0.36);
      bh = H * 0.86; bw = bh * aspect;
      const maxW = W - introW - gutter - 16;
      if (bw > maxW) { bw = maxW; bh = bw / aspect; }
      box = { x: W - bw - W * 0.01, y: H - bh, w: bw, h: bh };
    } else {
      bw = Math.min(W * 1.02, H * 0.92 * aspect); bh = bw / aspect;
      box = { x: (W - bw) / 2, y: H - bh, w: bw, h: bh };
    }
    scale = box.w / P.w;

    for (let i = 0; i < N; i++) {
      hx[i] = (box.x + (gx[i] + 0.5) * scale) * dpr;
      hy[i] = (box.y + (gy[i] + 0.5) * scale) * dpr;
    }
    Object.assign(photo.style, { left: box.x + "px", top: box.y + "px", width: box.w + "px", height: box.h + "px" });
    revealBtn.style.left = box.x + box.w / 2 + "px";
    revealBtn.style.top = Math.min(box.y + box.h * 0.78, H - 70) + "px";
  }
  if (matchMedia("(hover: none)").matches) hint.textContent = "tap the dots for a shockwave";

  /* ---------- intros: one is picked at random each visit ---------- */
  const INTROS = {
    // dust scattered everywhere drifts together
    converge() {
      for (let i = 0; i < N; i++) {
        x[i] = Math.random() * W * dpr; y[i] = Math.random() * H * dpr;
        delay[i] = rnd[i] * 700;
      }
      return "converge";
    },
    // everything starts in one point and explodes into a face
    bigbang() {
      const cx = (box.x + box.w * 0.5) * dpr, cy = (box.y + box.h * 0.3) * dpr;
      for (let i = 0; i < N; i++) {
        x[i] = cx; y[i] = cy;
        const a = Math.random() * Math.PI * 2, s = (4 + Math.random() * 22) * dpr;
        vx[i] = Math.cos(a) * s; vy[i] = Math.sin(a) * s;
        delay[i] = 250 + rnd[i] * 250;
      }
      return "bigbang";
    },
    // dots fall from the top like rain, row by row
    rain() {
      for (let i = 0; i < N; i++) {
        x[i] = hx[i] + (Math.random() - 0.5) * 40 * dpr;
        y[i] = -Math.random() * H * dpr * 0.6 - 20;
        delay[i] = (1 - gy[i] / P.h) * 900 + rnd[i] * 400;
      }
      return "rain";
    },
    // an "AI render" scan line draws the face top to bottom
    scan() {
      for (let i = 0; i < N; i++) {
        x[i] = hx[i] + (Math.random() - 0.5) * 70 * dpr; y[i] = hy[i];
        delay[i] = (gy[i] / P.h) * 1700 + rnd[i] * 60;
      }
      scanUntil = 1900;
      return "ai_render";
    },
    // the dots first spell HELLO, then turn into the face
    hello() {
      const pts = textPoints(W < 700 ? "HI!" : "HELLO");
      for (let i = 0; i < N; i++) {
        const p = pts[(Math.random() * pts.length) | 0];
        x[i] = (p[0] + (Math.random() - 0.5) * 3) * dpr;
        y[i] = (p[1] + (Math.random() - 0.5) * 3) * dpr;
        delay[i] = 1300 + rnd[i] * 700;
      }
      return "hello";
    },
  };

  function textPoints(word) {
    const c = document.createElement("canvas");
    c.width = Math.ceil(W); c.height = Math.ceil(H);
    const g = c.getContext("2d");
    const size = Math.min(W / (word.length * 0.62), H * 0.38);
    g.font = `${size}px Anton, Impact, sans-serif`;
    g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff";
    const cx = W >= 1000 ? box.x + box.w / 2 : W / 2;
    g.fillText(word, cx, H * 0.45);
    const d = g.getImageData(0, 0, c.width, c.height).data, pts = [];
    for (let yy = 0; yy < c.height; yy += 3)
      for (let xx = 0; xx < c.width; xx += 3)
        if (d[(yy * c.width + xx) * 4 + 3] > 128) pts.push([xx, yy]);
    return pts.length ? pts : [[W / 2, H / 2]];
  }

  function pickIntro() {
    const names = Object.keys(INTROS);
    let last = null;
    try { last = sessionStorage.getItem("hero-intro"); } catch (e) {}
    let name;
    do { name = names[(Math.random() * names.length) | 0]; } while (name === last && names.length > 1);
    try { sessionStorage.setItem("hero-intro", name); } catch (e) {}
    return name;
  }

  /* ---------- interaction ---------- */
  const mouse = { x: -1e4, y: -1e4, active: false };
  let releaseTimer = 0, userTouched = false;
  const setPointer = (e) => {
    const r = stage.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) * dpr; mouse.y = (e.clientY - r.top) * dpr; mouse.active = true;
    userTouched = true;
    clearTimeout(releaseTimer);
  };
  const release = (delay = 0) => {
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(() => { mouse.active = false; mouse.x = mouse.y = -1e4; }, delay);
  };
  stage.addEventListener("pointermove", setPointer);
  stage.addEventListener("pointerdown", setPointer);          // finger down on phones/tablets
  stage.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") release(350); });
  stage.addEventListener("pointercancel", () => release(200)); // page started scrolling
  stage.addEventListener("pointerleave", (e) => release(e.pointerType === "mouse" ? 0 : 350));

  // one "ghost finger" sweep across the face after the intro, so visitors see the dots react
  let ghostStart = -1;
  const GHOST_MS = 1600;
  function ghostPointer(t) {
    if (ghostStart < 0 || userTouched || t < ghostStart || t > ghostStart + GHOST_MS) return false;
    const p = (t - ghostStart) / GHOST_MS, e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    mouse.x = (box.x + box.w * (0.2 + 0.6 * e)) * dpr;
    mouse.y = (box.y + box.h * (0.36 + Math.sin(e * Math.PI) * 0.08)) * dpr;
    return true;
  }

  stage.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    const r = stage.getBoundingClientRect();
    const cx = (e.clientX - r.left) * dpr, cy = (e.clientY - r.top) * dpr;
    const R = 260 * dpr;
    for (let i = 0; i < N; i++) {
      const dx = x[i] - cx, dy = y[i] - cy, d = Math.hypot(dx, dy) || 1;
      if (d < R) {
        const f = (1 - d / R) * 26 * dpr;
        vx[i] += (dx / d) * f; vy[i] += (dy / d) * f;
      }
    }
    hint.classList.add("used");
  });

  let revealed = false, rv = 0;
  revealBtn.addEventListener("click", () => {
    revealed = !revealed;
    revealBtn.setAttribute("aria-pressed", revealed);
    revealBtn.querySelector("span").textContent = revealed ? "Particles" : "Reveal";
    revealBtn.querySelector("i").className = revealed ? "fa-solid fa-wand-magic-sparkles" : "fa-solid fa-braille";
  });

  /* ---------- simulation ---------- */
  let start = 0, scanUntil = 0, running = true, rafId = 0;
  const SPRING = 0.055, DAMP = 0.84;

  function frame(now) {
    if (!start) start = now;
    const t = now - start;

    rv += ((revealed ? 1 : 0) - rv) * 0.07;
    const rvEase = rv * rv;

    const mR = 90 * dpr, mR2 = mR * mR, mForce = 2.6 * dpr;
    const cx = (box.x + box.w / 2) * dpr, cy = (box.y + box.h * 0.4) * dpr;
    const shimmer = reduceMotion ? 0 : 0.35 * dpr;
    const ghost = ghostPointer(t);
    const pushing = mouse.active || ghost;

    for (let i = 0; i < N; i++) {
      if (t < delay[i]) {
        // waiting to launch: bigbang dots still fly outward with friction
        vx[i] *= 0.93; vy[i] *= 0.93; x[i] += vx[i]; y[i] += vy[i];
        continue;
      }
      let tx = hx[i], ty = hy[i];
      if (rvEase > 0.001) {
        // reveal: blow dots outward from the face
        const dx = hx[i] - cx, dy = hy[i] - cy, d = Math.hypot(dx, dy) || 1;
        const push = rvEase * (180 + rnd[i] * 420) * dpr;
        tx += (dx / d) * push; ty += (dy / d) * push - rvEase * rnd[i] * 200 * dpr;
      }
      vx[i] += (tx - x[i]) * SPRING;
      vy[i] += (ty - y[i]) * SPRING;

      if (pushing) {
        const dx = x[i] - mouse.x, dy = y[i] - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < mR2) {
          const d = Math.sqrt(d2) || 1, f = (1 - d / mR) * mForce;
          vx[i] += (dx / d) * f; vy[i] += (dy / d) * f;
        }
      }
      vx[i] *= DAMP; vy[i] *= DAMP;
      x[i] += vx[i]; y[i] += vy[i];
    }

    /* draw */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = Math.max(0, 1 - rv * 1.1);
    const scanY = scanUntil && t < scanUntil ? ((t / 1700) * P.h * scale + box.y) * dpr : -1;
    const tw = t * 0.0016;
    if (ctx.globalAlpha > 0.002) {
      for (let b = 0; b < BUCKETS; b++) {
        ctx.fillStyle = bucketColor[b];
        const s = Math.max(1, bucketSize[b] * scale * dpr), hs = s / 2;
        const idx = bucketIdx[b];
        for (let j = 0; j < idx.length; j++) {
          const i = idx[j];
          if (scanY >= 0 && t < delay[i]) continue; // scan intro: hidden until the line passes
          const jx = shimmer ? Math.sin(tw + phase[i]) * shimmer : 0;
          ctx.fillRect(x[i] - hs + jx, y[i] - hs, s, s);
        }
      }
    }
    if (scanY >= 0) {
      ctx.globalAlpha = 1;
      const grd = ctx.createLinearGradient(0, scanY - 30 * dpr, 0, scanY + 2 * dpr);
      grd.addColorStop(0, "rgba(255,120,40,0)");
      grd.addColorStop(1, "rgba(255,170,90,0.55)");
      ctx.fillStyle = grd;
      ctx.fillRect(box.x * dpr, scanY - 30 * dpr, box.w * dpr, 32 * dpr);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    // real photo wipes in from the top during reveal
    photo.style.opacity = Math.min(1, rv * 1.4).toFixed(3);
    photo.style.clipPath = `inset(0 0 ${((1 - rv) * 100).toFixed(2)}% 0)`;

    if (running) rafId = requestAnimationFrame(frame);
  }

  /* ---------- big word behind the face (scramble effect) ---------- */
  function startWord() {
    const el = document.getElementById("hero-word");
    if (!el) return;
    const words = ["DEVELOPER", "AI ENGINEER", "FULL STACK", "BUILDER"];
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/<>";
    let w = 0;
    setInterval(() => {
      w = (w + 1) % words.length;
      const target = words[w];
      if (reduceMotion) { el.textContent = target; return; }
      const from = el.textContent;
      const len = Math.max(from.length, target.length);
      let f = 0;
      const step = () => {
        f++;
        let out = "";
        for (let i = 0; i < len; i++) {
          const settleAt = 4 + i * 2;
          if (f >= settleAt) out += target[i] || "";
          else out += (target[i] === " " ? " " : chars[(Math.random() * chars.length) | 0]);
        }
        el.textContent = out;
        if (f < 4 + len * 2) requestAnimationFrame(step);
      };
      step();
    }, 3600);
  }

  /* ---------- start ---------- */
  function init() {
    layout();
    const name = reduceMotion ? null : pickIntro();
    if (name) {
      INTROS[name]();
      ghostStart = (name === "hello" ? 3600 : 2800);
    } else {
      for (let i = 0; i < N; i++) { x[i] = hx[i]; y[i] = hy[i]; }
    }
    stage.classList.add("is-live");
    rafId = requestAnimationFrame(frame);
    startWord();
  }

  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 120);
  });

  // pause when the hero is off screen (saves battery)
  new IntersectionObserver(([entry]) => {
    const visible = entry.isIntersecting;
    if (visible && !running) { running = true; rafId = requestAnimationFrame(frame); }
    else if (!visible && running) { running = false; cancelAnimationFrame(rafId); }
  }, { threshold: 0 }).observe(stage);

  // wait for the Anton font so the HELLO intro uses it
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(init);
})();
