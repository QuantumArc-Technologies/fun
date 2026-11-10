(() => {
  const G = window.GIFT;
  const stage = document.getElementById("stage");
  const progress = document.getElementById("progress");
  const progressPath = document.getElementById("progressPath");
  const HEART = "M50 86 C20 62 4 46 4 27 C4 13 15 4 27 4 C37 4 45 9 50 18 C55 9 63 4 73 4 C85 4 96 13 96 27 C96 46 80 62 50 86 Z";

  /* ---------- small helpers ---------- */
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, " ");
  const pick = (list, i) => list[i % list.length];
  const rand = (a, b) => a + Math.random() * (b - a);
  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const shake = (node) => {
    node.classList.remove("shake");
    void node.offsetWidth;
    node.classList.add("shake");
  };

  // 0 to 1: how much of the little heart at the top is drawn
  const setProgress = (p) => {
    progressPath.style.strokeDashoffset = String(100 - Math.max(0, Math.min(1, p)) * 100);
    progress.classList.remove("pulse");
    void progress.offsetWidth;
    progress.classList.add("pulse");
  };

  // Swap the visible screen, with a short fade between them
  function show(build) {
    const old = stage.firstElementChild;
    const swap = () => {
      stage.innerHTML = "";
      const screen = el("section", "screen");
      stage.append(screen);
      build(screen);
      window.scrollTo(0, 0);
      const h = screen.querySelector("h1");
      if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
    };
    if (old) {
      old.classList.add("leaving");
      setTimeout(swap, 180);
    } else swap();
  }

  function heading(screen, title, text, step) {
    if (step) screen.append(el("p", "step", step));
    screen.append(el("h1", "", title));
    if (text) screen.append(el("p", "lead", text));
  }

  // A quiet in-between page: a line of the story, and one button onward
  function note(title, text, button, next, p) {
    show((s) => {
      setProgress(p);
      heading(s, title, text);
      const b = el("button", "btn", button);
      b.onclick = next;
      s.append(b);
    });
  }

  function burst(x, y, n = 18, spread = 140) {
    const colors = ["#f7d3d6", "#e88fa2", "#e6c08a", "#fff6f0"];
    for (let i = 0; i < n; i++) {
      const p = el("i", "petal");
      const a = rand(0, Math.PI * 2), d = rand(spread * 0.35, spread);
      p.style.left = x - 7 + "px";
      p.style.top = y - 6 + "px";
      p.style.background = pick(colors, i);
      p.style.setProperty("--dx", Math.cos(a) * d + "px");
      p.style.setProperty("--dy", Math.sin(a) * d - spread * 0.25 + "px");
      p.style.setProperty("--r", rand(-200, 200) + "deg");
      p.style.setProperty("--s", rand(0.7, 1.8).toFixed(2));
      p.style.setProperty("--t", rand(0.9, 1.7).toFixed(2) + "s");
      document.body.append(p);
      setTimeout(() => p.remove(), 1800);
    }
  }
  const burstFrom = (node, n, spread) => {
    const r = node.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, n, spread);
  };

  /* ---------- media (photo, video, or placeholder) ---------- */
  function placeholder(item, i) {
    const ph = el("div", "ph");
    ph.style.setProperty("--i", i % 4);
    ph.dataset.n = i + 1;
    const icon = item.type === "video"
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
      : '<svg viewBox="0 0 100 90" aria-hidden="true"><path d="' + HEART + '"/></svg>';
    ph.innerHTML = icon;
    ph.append(el("span", "", item.type === "video" ? "Your video goes here" : "Your photo goes here"));
    return ph;
  }
  function mediaNode(item, i) {
    if (!item.src) return placeholder(item, i);
    let n;
    if (item.type === "video") {
      n = el("video");
      n.controls = true;
      n.playsInline = true;
      n.preload = "metadata";
      n.onerror = () => n.replaceWith(placeholder(item, i));
      n.src = item.src + "#t=0.1"; // shows the first frame on phones instead of a black box
      return n;
    }
    n = el("img");
    n.alt = item.caption || "";
    n.decoding = "async";
    n.onerror = () => n.replaceWith(placeholder(item, i));
    n.src = item.src;
    return n;
  }

  // Quietly fetch the photos one by one while she is busy with the questions,
  // so the games and the gift open without waiting.
  let preloaded = false;
  function preloadPhotos() {
    if (preloaded) return;
    preloaded = true;
    const list = allMedia().filter((m) => m.src && m.type !== "video").map((m) => m.src);
    if (G.him.photo) list.unshift(G.him.photo);
    const next = () => {
      const src = list.shift();
      if (!src) return;
      const img = new Image();
      img.onload = img.onerror = next;
      img.src = src;
    };
    next();
  }
  const allMedia = () => G.story.chapters.flatMap((c) => c.media);

  /* ---------- 1. intro ---------- */
  function intro() {
    note(G.intro.title, G.intro.text, G.intro.button, nameGate, 0);
  }

  /* ---------- 2. name gate ---------- */
  function nameGate() {
    const c = G.nameGate;
    let tries = 0;
    show((s) => {
      setProgress(0.04);
      heading(s, c.title, c.text);
      const form = el("form");
      const input = el("input", "field");
      input.type = "text";
      input.placeholder = "Your name";
      input.autocomplete = "off";
      input.setAttribute("aria-label", "Your name");
      const says = el("p", "says");
      says.setAttribute("role", "status");
      const b = el("button", "btn", c.button);
      b.style.marginTop = "0.4rem";
      form.append(input, says, b);
      s.append(form);
      form.onsubmit = (e) => {
        e.preventDefault();
        const v = norm(input.value);
        if (!v) { says.textContent = c.empty; shake(input); return; }
        if (G.her.names.map(norm).includes(v)) {
          burstFrom(input, 22);
          preloadPhotos();
          note(c.welcomeTitle + ", " + G.her.display, c.welcomeText, c.welcomeButton, () => quiz(0), 0.12);
        } else {
          says.textContent = pick(c.wrong, tries++);
          shake(input);
          input.select();
        }
      };
      setTimeout(() => input.focus({ preventScroll: true }), 400);
    });
  }

  /* ---------- 3. questions ---------- */
  function quiz(i) {
    const total = G.questions.length;
    if (i >= total) {
      const d = G.quizDone;
      return note(d.title, d.text, d.button, catchGame, 0.5);
    }
    const q = G.questions[i];
    let tries = 0;
    show((s) => {
      setProgress(0.12 + (i / total) * 0.36);
      heading(s, q.q, null, "Question " + (i + 1) + " of " + total);
      const says = el("p", "says");
      says.setAttribute("role", "status");
      let locked = false;

      const right = (node) => {
        locked = true;
        says.className = "says good";
        says.textContent = q.yes || "Yes.";
        burstFrom(node, 14, 110);
        setTimeout(() => quiz(i + 1), 1500);
      };
      const wrong = (node) => {
        says.className = "says";
        says.textContent = pick(G.quizWrong, tries++);
        shake(node);
      };

      if (q.type === "choice") {
        const box = el("div", "choices");
        q.options.forEach((o) => {
          const b = el("button", "choice", o);
          b.type = "button";
          b.onclick = () => {
            if (locked) return;
            if (o === q.answer) { b.classList.add("right"); right(b); } else wrong(b);
          };
          box.append(b);
        });
        s.append(box, says);
      } else if (q.type === "date") {
        const form = el("form");
        const row = el("div", "date-row");
        const sel = (label, items) => {
          const n = el("select", "field");
          n.setAttribute("aria-label", label);
          n.append(new Option(label, ""));
          items.forEach(([text, value]) => n.append(new Option(text, value)));
          row.append(n);
          return n;
        };
        const two = (v) => String(v).padStart(2, "0");
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const thisYear = new Date().getFullYear();
        const day = sel("Day", Array.from({ length: 31 }, (_, k) => [k + 1, two(k + 1)]));
        const month = sel("Month", months.map((m, k) => [m, two(k + 1)]));
        const year = sel("Year", Array.from({ length: thisYear - 1999 }, (_, k) => [thisYear - k, thisYear - k]));
        const b = el("button", "btn", "That is my answer");
        b.style.marginTop = "0.4rem";
        form.append(row, says, b);
        s.append(form);
        form.onsubmit = (e) => {
          e.preventDefault();
          if (locked) return;
          if (!day.value || !month.value || !year.value) {
            says.className = "says"; says.textContent = "Pick the day, month and year."; shake(row); return;
          }
          year.value + "-" + month.value + "-" + day.value === q.answer ? right(row) : wrong(row);
        };
      } else {
        const form = el("form");
        const input = el("input", "field");
        input.type = q.type === "number" ? "number" : "text";
        if (q.type === "number") input.inputMode = "numeric";
        if (q.type === "text") input.placeholder = "Type it here";
        input.autocomplete = "off";
        input.setAttribute("aria-label", q.q);
        const b = el("button", "btn", "That is my answer");
        b.style.marginTop = "0.4rem";
        form.append(input, says, b);
        s.append(form);
        form.onsubmit = (e) => {
          e.preventDefault();
          if (locked) return;
          const v = input.value;
          if (!v.trim()) { says.className = "says"; says.textContent = "Give me an answer first."; shake(input); return; }
          const ok = q.type === "number" ? Number(v) === Number(q.answer)
            : [].concat(q.answer).map(norm).includes(norm(v));
          ok ? right(input) : wrong(input);
        };
        setTimeout(() => input.focus({ preventScroll: true }), 400);
      }
    });
  }

  /* ---------- 4. catch me ---------- */
  function catchGame() {
    const c = G.catchGame;
    show((s) => {
      setProgress(0.52);
      heading(s, c.title, c.text);
      const arena = el("div", "arena");
      const runner = el("button", "runner", G.him.photo ? "" : G.him.initial);
      runner.type = "button";
      runner.setAttribute("aria-label", "Catch " + G.him.name);
      if (G.him.photo) runner.style.backgroundImage = "url(" + JSON.stringify(G.him.photo) + ")";
      arena.append(runner);
      const tally = el("div", "tally");
      for (let k = 0; k < c.target; k++) tally.append(el("i"));
      s.append(arena, tally);

      let caught = 0, timer, pos = { x: 0, y: 0 }, moves = 0;
      const say = (text) => {
        const b = el("span", "bubble", text);
        b.style.transform = "translate(" + Math.max(4, Math.min(pos.x, arena.clientWidth - 110)) + "px," + Math.max(4, pos.y - 30) + "px)";
        arena.append(b);
        setTimeout(() => b.remove(), 1000);
      };
      const move = () => {
        const w = arena.clientWidth - runner.offsetWidth - 8;
        const h = arena.clientHeight - runner.offsetHeight - 8;
        let x, y, k = 0;
        do { x = rand(4, w); y = rand(4, h); } while (Math.hypot(x - pos.x, y - pos.y) < 110 && ++k < 12);
        pos = { x, y };
        runner.style.transform = "translate(" + x + "px," + y + "px)";
      };
      const loop = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (!runner.isConnected) return;
          if (++moves % 3 === 0) say(pick(c.teases, moves / 3));
          move();
          loop();
        }, Math.max(620, 1250 - caught * 80));
      };
      const hit = () => {
        if (caught >= c.target) return;
        caught++;
        tally.children[caught - 1].classList.add("on");
        burstFrom(runner, 10, 90);
        setProgress(0.52 + (caught / c.target) * 0.12);
        if (caught >= c.target) {
          clearTimeout(timer);
          return setTimeout(() => note(c.doneTitle, c.doneText, c.doneButton, matchGame, 0.66), 500);
        }
        say(pick(c.caught, caught));
        move();
        loop();
      };
      // Counts the moment her finger lands, not when it lifts
      runner.addEventListener("pointerdown", (e) => { e.preventDefault(); hit(); });
      runner.addEventListener("click", (e) => { if (e.detail === 0) hit(); });
      requestAnimationFrame(() => { move(); loop(); });
    });
  }

  /* ---------- 5. find the pairs ---------- */
  function matchGame() {
    const c = G.matchGame;
    show((s) => {
      setProgress(0.68);
      heading(s, c.title, c.text);
      const photos = allMedia().map((m, i) => ({ m, i })).filter((x) => x.m.type !== "video").slice(0, 6);
      const deck = shuffle(photos.concat(photos).map((x, k) => ({ ...x, k })));
      const board = el("div", "board");
      let open = [], done = 0, busy = false;

      deck.forEach((d, k) => {
        const card = el("button", "card");
        card.style.setProperty("--d", 120 + k * 45 + "ms");
        card.type = "button";
        card.setAttribute("aria-label", "Card");
        const inner = el("span", "card-inner");
        const back = el("span", "card-face card-back", G.him.initial);
        const front = el("span", "card-face card-front");
        front.append(mediaNode(d.m, d.i));
        inner.append(back, front);
        card.append(inner);
        card.onclick = () => {
          if (busy || card.classList.contains("up")) return;
          card.classList.add("up");
          open.push({ card, id: d.i });
          if (open.length < 2) return;
          const [a, b] = open;
          open = [];
          if (a.id === b.id) {
            a.card.classList.add("done");
            b.card.classList.add("done");
            burstFrom(b.card, 10, 90);
            done++;
            setProgress(0.68 + (done / photos.length) * 0.12);
            if (done === photos.length) {
              setTimeout(() => note(c.doneTitle, c.doneText, c.doneButton, love, 0.82), 900);
            }
          } else {
            busy = true;
            setTimeout(() => {
              a.card.classList.remove("up");
              b.card.classList.remove("up");
              busy = false;
            }, 850);
          }
        };
        board.append(card);
      });
      s.append(board);
    });
  }

  /* ---------- 6. how much do you love me ---------- */
  function love() {
    const c = G.love;
    show((s) => {
      setProgress(0.84);
      heading(s, c.title, c.text);
      const arena = el("div", "love-arena");
      const says = el("p", "says");
      says.setAttribute("role", "status");
      let yes, dodged = 0;

      const flee = (btn) => {
        const bw = btn.offsetWidth, bh = btn.offsetHeight;
        const cur = btn._at || { x: btn.offsetLeft, y: btn.offsetTop };
        let x, y;
        for (let k = 0; k < 30; k++) {
          x = rand(0, arena.clientWidth - bw);
          y = rand(0, arena.clientHeight - bh);
          const onYes = x < yes.offsetLeft + yes.offsetWidth + 14 && x + bw > yes.offsetLeft - 14 &&
                        y < yes.offsetTop + yes.offsetHeight + 14 && y + bh > yes.offsetTop - 14;
          if (!onYes && Math.hypot(x - cur.x, y - cur.y) > 100) break;
        }
        btn._at = { x, y };
        btn.style.transform = "translate(" + (x - btn.offsetLeft) + "px," + (y - btn.offsetTop) + "px)";
        says.textContent = pick(c.dodges, dodged++);
      };

      c.options.forEach((o) => {
        const b = el("button", "choice", o);
        b.type = "button";
        if (o === c.answer) {
          yes = b;
          b.classList.add("yes");
          b.onclick = () => {
            says.className = "says good";
            says.textContent = c.yes;
            burstFrom(b, 40, 220);
            setTimeout(heart, 1500);
          };
        } else {
          // Runs from the mouse, from a finger, and from the keyboard too
          b.addEventListener("pointerenter", () => flee(b));
          b.addEventListener("pointerdown", (e) => { e.preventDefault(); flee(b); });
          b.addEventListener("click", (e) => { e.preventDefault(); flee(b); });
        }
        arena.append(b);
      });
      s.append(arena, says);
    });
  }

  /* ---------- 7. the heart opens ---------- */
  function heart() {
    const c = G.heart;
    show((s) => {
      setProgress(1);
      const big = el("div", "bigheart");
      const svg = '<svg viewBox="0 0 100 90" aria-hidden="true"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#f7d3d6"/><stop offset=".55" stop-color="#e88fa2"/><stop offset="1" stop-color="#b4476a"/></linearGradient></defs>' +
        '<path fill="url(#hg)" d="' + HEART + '"/></svg>';
      big.innerHTML = '<div class="light"></div><div class="half l">' + svg + '</div><div class="half r">' + svg + "</div>";
      s.append(big);
      heading(s, c.title, c.text);
      const b = el("button", "btn", c.button);
      b.onclick = () => {
        b.disabled = true;
        s.classList.add("opening");
        burstFrom(big, 44, Math.max(innerWidth, innerHeight) * 0.6);
        setTimeout(story, 1500);
      };
      s.append(b);
    });
  }

  /* ---------- 8. the gift ---------- */
  function story() {
    const c = G.story;
    progress.classList.add("hidden");
    stage.innerHTML = "";
    const root = el("article", "story");

    const head = el("header", "story-head");
    head.append(el("p", "step", "For " + G.her.display), el("h1", "", c.title), el("p", "lead", c.intro));
    root.append(head);

    const chapters = el("div", "chapters");
    let n = 0;
    c.chapters.forEach((ch) => {
      const sec = el("section", "chapter");
      const text = el("div", "chapter-text reveal");
      text.append(el("p", "when", ch.when), el("h2", "", ch.title), el("p", "", ch.text));
      const mosaic = el("div", "mosaic");
      ch.media.forEach((m, k) => {
        const fig = el("figure", "media reveal");
        fig.style.transitionDelay = k * 120 + "ms";
        const zoomable = m.src && m.type !== "video";
        const frame = el(zoomable ? "button" : "div", "frame");
        frame.append(mediaNode(m, n++));
        if (zoomable) {
          frame.type = "button";
          frame.setAttribute("aria-label", "Open photo: " + (m.caption || ""));
          frame.onclick = () => openLightbox(m);
        }
        fig.append(frame);
        if (m.caption) fig.append(el("figcaption", "", m.caption));
        mosaic.append(fig);
      });
      sec.append(text, mosaic);
      chapters.append(sec);
    });
    root.append(chapters);

    const letter = el("section", "letter reveal");
    letter.append(el("h2", "", c.letterTitle));
    c.letter.forEach((p) => letter.append(el("p", "", p)));
    letter.append(el("p", "sign", c.signoff), el("p", "name", G.him.name));
    root.append(letter);

    stage.append(root);
    window.scrollTo(0, 0);

    // Each photo and paragraph arrives as she scrolls to it
    const items = root.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) return items.forEach((n) => n.classList.add("in"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach((n) => io.observe(n));
  }

  const lightbox = document.getElementById("lightbox");
  function openLightbox(m) {
    lightbox.querySelector("img").src = m.src;
    lightbox.querySelector("img").alt = m.caption || "";
    lightbox.querySelector("p").textContent = m.caption || "";
    lightbox.showModal();
  }
  lightbox.addEventListener("click", () => lightbox.close());

  /* ---------- start ----------
     While you are building, jump straight to a part with ?go=name, quiz,
     catch, match, love, heart or story at the end of the address. */
  const jump = { name: nameGate, quiz: () => quiz(0), catch: catchGame, match: matchGame, love, heart, story };
  const go = new URLSearchParams(location.search).get("go");
  (jump[go] || intro)();
})();
