/* The night sky. Everything here is painted once onto small canvases when the
   page opens; after that only cheap slides and fades run, so it stays smooth
   on a phone. The moon is a real photograph (NASA, public domain). */
(() => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Fixed seed: the same sky every time she opens it
  let seed = 20200214;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const between = (a, b) => a + rnd() * (b - a);
  const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) / 2;

  // Smooth 1D noise, and a layered version for natural-looking shapes
  const noise = (n = 64) => {
    const v = Array.from({ length: n }, rnd);
    return (x) => {
      x = ((x % n) + n) % n;
      const i = x | 0, f = x - i, t = f * f * (3 - 2 * f);
      return v[i] * (1 - t) + v[(i + 1) % n] * t;
    };
  };
  const layered = (octaves) => {
    const ns = Array.from({ length: octaves }, () => noise());
    return (x) => {
      let sum = 0, amp = 0.5, freq = 1, total = 0;
      for (const n of ns) { sum += n(x * freq) * amp; total += amp; amp *= 0.5; freq *= 2.1; }
      return sum / total;
    };
  };

  /* ---------- stars and the Milky Way ---------- */
  function paintStars() {
    const c = document.getElementById("starfield");
    if (!c) return;
    const W = Math.round(innerWidth * 1.06), H = Math.round(innerHeight * 1.06);
    c.width = W * dpr;
    c.height = H * dpr;
    const g = c.getContext("2d");
    g.scale(dpr, dpr);

    // The Milky Way: a faint dusty band from lower left to upper right
    const ax = -0.1 * W, ay = 0.72 * H, bx = 1.1 * W, by = 0.02 * H;
    const len = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / len, ny = (bx - ax) / len;
    for (let i = 0; i < 16; i++) {
      const t = i / 15, x = ax + (bx - ax) * t, y = ay + (by - ay) * t, r = H * between(0.12, 0.2);
      const glow = g.createRadialGradient(x, y, 0, x, y, r);
      glow.addColorStop(0, "rgba(150,165,230,0.05)");
      glow.addColorStop(1, "rgba(150,165,230,0)");
      g.fillStyle = glow;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    const dust = Math.round((W * H) / 260);
    for (let i = 0; i < dust; i++) {
      const t = rnd(), off = gauss() * H * 0.09;
      const x = ax + (bx - ax) * t + nx * off, y = ay + (by - ay) * t + ny * off;
      g.fillStyle = "rgba(215,225,255," + between(0.05, 0.3).toFixed(2) + ")";
      const s = between(0.3, 0.8);
      g.fillRect(x, y, s, s);
    }

    // Stars: many faint, few bright, in real star colours, dimmer near the horizon
    const tints = ["255,255,255", "255,255,255", "205,220,255", "185,205,255", "255,241,224", "255,216,186"];
    const count = Math.round((W * H) / 750);
    for (let i = 0; i < count; i++) {
      const x = rnd() * W, y = rnd() * H;
      const mag = Math.pow(rnd(), 7);
      const r = 0.35 + mag * 1.25;
      const a = (0.3 + rnd() * 0.5 + mag * 0.4) * (1 - 0.65 * Math.pow(y / H, 2));
      const tint = tints[(rnd() * tints.length) | 0];
      if (mag > 0.45) {
        const glow = g.createRadialGradient(x, y, 0, x, y, r * 3.2);
        glow.addColorStop(0, "rgba(" + tint + "," + (a * 0.22).toFixed(2) + ")");
        glow.addColorStop(1, "rgba(" + tint + ",0)");
        g.fillStyle = glow;
        g.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
      }
      g.fillStyle = "rgba(" + tint + "," + Math.min(1, a).toFixed(2) + ")";
      g.beginPath();
      g.arc(x, y, r, 0, 6.2832);
      g.fill();
    }
  }

  /* ---------- aurora curtains ---------- */
  // Each curtain is drawn column by column: a bright lower edge that follows a
  // wavy line, with rays of uneven height fading upward into a second colour.
  function paintAurora(curtains) {
    const c = document.createElement("canvas");
    const W = (c.width = 440), H = (c.height = 230);
    const g = c.getContext("2d");
    g.globalCompositeOperation = "lighter";
    const rgba = (col, a) => "rgba(" + col + "," + Math.max(0, Math.min(1, a)).toFixed(3) + ")";
    for (const cur of curtains) {
      const wobble = layered(3), broad = layered(2), rays = layered(2), height = layered(3);
      for (let x = 0; x < W; x++) {
        const u = x / W;
        const side = Math.pow(Math.sin(Math.PI * u), 0.8);
        const strength = Math.pow(broad(u * 5 + 3), 1.5) * (0.3 + 0.7 * rays(u * 58)) * side * cur.gain * 2.4;
        if (strength < 0.015) continue;
        const base = H * (cur.y + cur.amp * Math.sin(u * cur.waves * 6.2832 + cur.phase) + 0.08 * (wobble(u * 7) - 0.5));
        const tall = H * cur.len * (0.45 + height(u * 9));
        const top = base - tall, foot = base + tall * 0.07;
        const grad = g.createLinearGradient(0, foot, 0, top);
        grad.addColorStop(0, rgba(cur.low, 0));
        grad.addColorStop(0.07, rgba(cur.low, strength));
        grad.addColorStop(0.3, rgba(cur.mid, strength * 0.62));
        grad.addColorStop(0.66, rgba(cur.high, strength * 0.3));
        grad.addColorStop(1, rgba(cur.high, 0));
        g.fillStyle = grad;
        g.fillRect(x, top, 1, foot - top);
      }
    }
    // Soften once, by shrinking and enlarging, so the light looks like glowing
    // gas rather than drawn lines. Done here so nothing has to blur while moving.
    const small = document.createElement("canvas");
    small.width = W / 2;
    small.height = H / 2;
    const sg = small.getContext("2d");
    sg.imageSmoothingQuality = "high";
    sg.drawImage(c, 0, 0, small.width, small.height);
    g.globalCompositeOperation = "source-over";
    g.imageSmoothingQuality = "high";
    g.globalAlpha = 0.6;
    g.drawImage(small, 0, 0, W, H);
    g.globalAlpha = 1;
    return c;
  }
  function buildAurora() {
    const box = document.getElementById("aurora");
    if (!box) return;
    const green = "70,255,150", teal = "60,225,195", violet = "150,95,255", pink = "255,95,170", blue = "80,150,255";
    box.append(
      paintAurora([
        { y: 0.8, amp: 0.1, waves: 1.3, phase: 0.4, len: 0.62, gain: 0.5, low: green, mid: teal, high: violet },
        { y: 0.6, amp: 0.07, waves: 2.1, phase: 2.2, len: 0.42, gain: 0.3, low: green, mid: green, high: pink },
      ]),
      paintAurora([
        { y: 0.74, amp: 0.12, waves: 1.7, phase: 3.6, len: 0.66, gain: 0.42, low: teal, mid: violet, high: pink },
      ]),
      paintAurora([
        { y: 0.86, amp: 0.08, waves: 1.1, phase: 5.1, len: 0.5, gain: 0.4, low: green, mid: teal, high: blue },
        { y: 0.66, amp: 0.09, waves: 2.6, phase: 1.2, len: 0.36, gain: 0.26, low: teal, mid: blue, high: violet },
      ])
    );
  }

  /* ---------- mountains and pine forest along the bottom ---------- */
  function paintRidge() {
    const c = document.getElementById("ridge");
    if (!c) return;
    const W = innerWidth, H = Math.round(innerHeight * 0.24);
    c.width = W * dpr;
    c.height = H * dpr;
    const g = c.getContext("2d");
    g.scale(dpr, dpr);
    const range = (colour, level, rough, scale, shape) => {
      g.fillStyle = colour;
      g.beginPath();
      g.moveTo(0, H);
      for (let x = 0; x <= W; x += 2) g.lineTo(x, H * (level - rough * shape(x / scale)));
      g.lineTo(W, H);
      g.fill();
    };
    const far = layered(5), mid = layered(4), near = layered(3);
    range("#151c44", 0.62, 0.62, 260, far);   // distant peaks, lightened by haze
    range("#0b1030", 0.78, 0.5, 200, mid);    // closer range
    const ground = (x) => H * (0.93 - 0.3 * near(x / 300));
    g.fillStyle = "#02030a";
    g.beginPath();
    g.moveTo(0, H);
    for (let x = 0; x <= W; x += 2) g.lineTo(x, ground(x));
    g.lineTo(W, H);
    g.fill();

    // Pines standing on the nearest hill
    const clump = layered(2);
    for (let x = -4; x < W + 4; x += between(2.5, 6)) {
      if (clump(x / 40) < 0.34) continue;
      const h = between(9, 20) * (0.7 + clump(x / 90)), y = ground(x) + 2;
      g.beginPath();
      for (let k = 0; k < 4; k++) {
        const topY = y - h + k * h * 0.2, half = h * (0.1 + 0.07 * k);
        g.moveTo(x, topY);
        g.lineTo(x + half, topY + h * 0.36);
        g.lineTo(x - half, topY + h * 0.36);
      }
      g.fill();
    }
  }

  /* ---------- a few stars that really twinkle ---------- */
  function twinklers() {
    const box = document.getElementById("ambient");
    if (!box) return;
    for (let i = 0; i < 16; i++) {
      const s = document.createElement("i");
      s.className = "star";
      const size = between(1, 1.7);
      let x = between(2, 98);
      const y = Math.pow(rnd(), 1.4) * 70 + 2;
      if (x > 60 && y < 26) x -= 45; // never in front of the moon
      s.style.cssText = "left:" + x + "%;top:" + y + "%;width:" + size + "px;height:" + size +
        "px;animation-duration:" + between(2.2, 5.5).toFixed(1) + "s;animation-delay:-" + between(0, 5).toFixed(1) + "s";
      box.append(s);
    }
  }

  paintStars();
  buildAurora();
  paintRidge();
  twinklers();

  // Repaint only when the phone is rotated, not when the address bar slides
  let lastW = innerWidth;
  addEventListener("resize", () => {
    if (innerWidth === lastW) return;
    lastW = innerWidth;
    seed = 20200214;
    paintStars();
    paintRidge();
  });
})();
