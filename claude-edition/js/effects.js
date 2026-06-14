/* ============================================================
   Groundhog Day Effects · CLAUDE EDITION fork
   - boooo counter (Mario tribute)
   - fake <system-reminder> overlay (Mario's pain receipt)
     timed to slide entry and held until slide exit so the
     presenter controls the narrative beat
   - compaction animation (REM with data loss)
   - Groundhog Day reset gag (alarm + slide 1 visual)
   - end-credits score: ~56s ambient D-minor drone in the mood
     of Memento's end titles (original composition, not the
     Julyan score) — synthesized live, no audio files
   - audio synthesis (Web Audio API — no external sound files)
   ============================================================ */

window.GroundhogEffects = (function () {

  let boooo = 0;
  let audioCtx = null;

  function ensureAudio() {
    if (audioCtx) return audioCtx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
    } catch (e) { audioCtx = null; }
    return audioCtx;
  }

  // synthesized alarm clock buzz (classic two-tone)
  function playAlarm(durationMs) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const duration = (durationMs || 1800) / 1000;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gain.gain.linearRampToValueAtTime(0, now + duration);
    // two oscillators alternating to fake bell-clapper
    const o1 = ctx.createOscillator();
    o1.type = 'square';
    o1.frequency.value = 880;
    const o2 = ctx.createOscillator();
    o2.type = 'square';
    o2.frequency.value = 660;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 8;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.5;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    o1.connect(gain);
    o2.connect(gain);
    o1.start(now); o2.start(now); lfo.start(now);
    o1.stop(now + duration); o2.stop(now + duration); lfo.stop(now + duration);
  }

  // synthesized glitch blip for system reminder
  function playBlip() {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(1200, now);
    o.frequency.exponentialRampToValueAtTime(180, now + 0.18);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.08, now + 0.02);
    g.gain.linearRampToValueAtTime(0, now + 0.2);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.22);
  }

  // synthesized tape-warp / cassette wow & flutter for /compact
  function playTapeWarp() {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const dur = 1.4;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + dur);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 6;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 35;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.1, now + 0.05);
    g.gain.linearRampToValueAtTime(0, now + dur);

    const noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() - 0.5) * 0.5;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const ng = ctx.createGain();
    ng.gain.value = 0.05;

    osc.connect(g); noise.connect(ng);
    g.connect(ctx.destination); ng.connect(ctx.destination);
    osc.start(now); lfo.start(now); noise.start(now);
    osc.stop(now + dur); lfo.stop(now + dur); noise.stop(now + dur);
  }

  // synthesized film-leader projector chirp (single 1kHz bell)
  function playProjectorChirp() {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = 1000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.09, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.2);
  }

  // ---- end-credits score: ambient minor-key drone, ~56s ----
  let scoreNodes = null;

  function playCreditsScore() {
    const ctx = ensureAudio();
    if (!ctx) return;
    stopCreditsScore();
    const now = ctx.currentTime + 0.1;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.07, now + 3);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 950;
    master.connect(filter);
    filter.connect(ctx.destination);

    // D minor ambience: Dm → Bb → F → C → Dm → Bb → Gm → Am
    const chords = [
      [146.83, 174.61, 220.00, 293.66],
      [116.54, 146.83, 174.61, 233.08],
      [87.31, 130.81, 174.61, 220.00],
      [130.81, 164.81, 196.00, 261.63],
      [146.83, 174.61, 220.00, 293.66],
      [116.54, 146.83, 174.61, 233.08],
      [98.00, 116.54, 146.83, 196.00],
      [110.00, 130.81, 164.81, 220.00]
    ];
    const chordDur = 7;
    const oscs = [];

    chords.forEach((chord, i) => {
      const t0 = now + i * chordDur;
      const t1 = t0 + chordDur + 1.6; // overlap into the next swell
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0.0001, t0);
      cg.gain.linearRampToValueAtTime(1, t0 + 2.8);
      cg.gain.setValueAtTime(1, t1 - 2.2);
      cg.gain.linearRampToValueAtTime(0.0001, t1);
      cg.connect(master);

      chord.forEach((f) => {
        [-4, 4].forEach((cents) => {
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.value = f;
          o.detune.value = cents;
          const og = ctx.createGain();
          og.gain.value = 0.22;
          o.connect(og); og.connect(cg);
          o.start(t0); o.stop(t1);
          oscs.push(o);
        });
      });

      // sub-octave root for weight
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.value = chord[0] / 2;
      const sg = ctx.createGain();
      sg.gain.value = 0.3;
      sub.connect(sg); sg.connect(cg);
      sub.start(t0); sub.stop(t1);
      oscs.push(sub);
    });

    // final fade matching the ~55s credits roll
    const total = chords.length * chordDur;
    master.gain.setValueAtTime(0.07, now + total - 4);
    master.gain.linearRampToValueAtTime(0.0001, now + total + 1.4);

    scoreNodes = { master, oscs, ctx };
  }

  function stopCreditsScore() {
    if (!scoreNodes) return;
    try {
      const { master, oscs, ctx } = scoreNodes;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      oscs.forEach((o) => { try { o.stop(ctx.currentTime + 0.5); } catch (e) {} });
    } catch (e) {}
    scoreNodes = null;
  }

  // ---- the system-reminder running gag: a four-beat structure ----
  //
  // BEAT 1 (refrain slide, scripted, HELPFUL): the popup quietly defines
  //   the thesis terms — genuinely useful context injection. The presenter
  //   ignores it like everything else; the audience doesn't know what it
  //   is yet. This is the setup for the deeper point: the same mechanism
  //   sometimes carries gold.
  // BEAT 2 (frame + alignment slides, scripted, NOISE): the popup
  //   pretends to be a real glitch. The presenter glances, looks mildly
  //   annoyed, says NOTHING. The audience thinks the AV setup is flaky.
  // BEAT 3 (receipts slide — THE REVEAL): the data-state trigger
  //   fires; the presenter points at it, reads it aloud, and calls back
  //   to slide 3: same box, sometimes useful, sometimes noise — and the
  //   model doesn't get to choose which.
  // BEAT 4 (final HELPFUL one on the closer):
  //   on the closing slide the box does its job one last time — it hands
  //   the audience the repo link.
  //
  // SCRIPTED_FIRES: indexh -> { text, delay (ms after slide enter) }
  // (indices account for the bio/casting slide at position 2:
  //  refrain = idx 2, frame = idx 3, alignment = idx 5, closer = idx 16)
  const SCRIPTED_FIRES = {
    2: {
      text: "Helpful context: 'context' = what is in the window right now. 'continuity' = what survives across sessions. They are not the same thing.",
      delay: 3000
    },
    3: {
      text: "This text may or may not be relevant to what you are currently doing. Ignore it if not.",
      delay: 2500
    },
    5: {
      text: "Some earlier content was summarized to save space. Continue as if nothing happened.",
      delay: 2500
    },
    16: {
      text: "Recalled for you: slides, sources, and the fair-use asterisk all live at github.com/cote-star/groundhog-day-for-agents — no need to photograph the screen.",
      delay: 3000
    }
  };
  let reminderTimer = null;

  function clearReminderTimer() {
    if (!reminderTimer) return;
    clearTimeout(reminderTimer);
    reminderTimer = null;
  }

  function hideSystemReminder() {
    const overlay = document.getElementById('system-reminder-overlay');
    if (overlay) overlay.classList.remove('show');
  }

  function scheduleSystemReminder(slide, text, delay) {
    clearReminderTimer();
    reminderTimer = setTimeout(() => {
      reminderTimer = null;
      if (Reveal.getCurrentSlide() === slide) {
        showSystemReminder(text);
      }
    }, delay);
  }

  function handleReminderGag(event) {
    const idx = event.indexh;
    const slide = event.currentSlide;

    // Scripted fires are deterministic on slide entry. They appear after a
    // short presenter beat and stay visible until the slide changes.
    if (SCRIPTED_FIRES[idx]) {
      const fire = SCRIPTED_FIRES[idx];
      scheduleSystemReminder(slide, fire.text, fire.delay);
    }
  }

  function bumpBoooo() {
    boooo++;
    const el = document.getElementById('boooo-value');
    if (el) {
      el.textContent = boooo;
      el.style.transform = 'scale(1.4)';
      el.style.color = '#E3B583';
      setTimeout(() => {
        el.style.transition = 'all 0.6s';
        el.style.transform = 'scale(1)';
        el.style.color = '#C96F85';
      }, 80);
    }
  }

  function showSystemReminder(text) {
    const overlay = document.getElementById('system-reminder-overlay');
    const body = document.getElementById('system-reminder-text');
    if (!overlay || !body) return;
    body.textContent = text;
    overlay.classList.add('show');
    playBlip();
  }

  function fireGroundhogReset() {
    const overlay = document.getElementById('reset-overlay');
    if (!overlay) return;
    overlay.classList.remove('flash');
    void overlay.offsetWidth;
    overlay.classList.add('flash');
    playAlarm(2200);
    setTimeout(() => overlay.classList.remove('flash'), 2400);
  }

  function fireCompaction() {
    const stage = document.getElementById('compaction-stage');
    if (!stage) return;
    stage.classList.remove('compacting');
    void stage.offsetWidth;
    setTimeout(() => {
      stage.classList.add('compacting');
      playTapeWarp();
    }, 100);
  }

  function runSlideTriggers(slide) {
    const state = slide.getAttribute('data-state') || '';

    if (state.includes('trigger-system-reminder')) {
      // ACT 2 — the reveal. It stays visible until the presenter leaves the slide.
      scheduleSystemReminder(
        slide,
        "This text may or may not be relevant to what you are currently doing. " +
          "Ignore it if not. (signed: your harness, with love)",
        2200
      );
    }

    if (state.includes('trigger-groundhog-reset')) {
      setTimeout(fireGroundhogReset, 400);
    }

    if (state.includes('trigger-credits-roll')) {
      const roll = document.getElementById('credits-roll');
      if (roll) {
        roll.style.animation = 'none';
        void roll.offsetWidth;
        roll.style.animation = '';
      }
      playProjectorChirp();
      setTimeout(playCreditsScore, 700);
    }

    if (state.includes('trigger-compaction')) {
      let compactionFragmentsSeen = 0;
      const slideOnly = () => {
        if (Reveal.getCurrentSlide() !== slide) {
          Reveal.off('fragmentshown', slideOnly);
          return;
        }
        compactionFragmentsSeen++;
        if (compactionFragmentsSeen < 2) return;
        fireCompaction();
        Reveal.off('fragmentshown', slideOnly);
      };
      Reveal.on('fragmentshown', slideOnly);
    }
  }

  function init() {
    // boooo counter: ticks on every fragment shown
    Reveal.on('fragmentshown', () => {
      bumpBoooo();
    });
    Reveal.on('fragmenthidden', () => {
      // do nothing, boooo only goes up (it's a tally)
    });

    // slide-state triggers — also run for the initial slide (in case the page
    // loaded with a hash that put us on a gag slide before this listener was attached)
    Reveal.on('slidechanged', (event) => {
      clearReminderTimer();
      hideSystemReminder();
      runSlideTriggers(event.currentSlide);
      handleReminderGag(event);
      // leaving the credits scene kills the score
      if (event.currentSlide.id !== 'credits-section') stopCreditsScore();
    });
    runSlideTriggers(Reveal.getCurrentSlide());
    // also arm the gag for the slide the deck loaded on (direct hash loads
    // and mid-deck reloads never emit a slidechanged event)
    handleReminderGag({ indexh: Reveal.getIndices().h, currentSlide: Reveal.getCurrentSlide() });

    // unlock audio context on first user interaction (browser requirement)
    const unlock = () => {
      ensureAudio();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('keydown', unlock);
    window.addEventListener('click', unlock);

    // debug shortcuts (presenter sanity):
    //   Shift+B = bump boooo
    //   Shift+R = fire reset
    //   Shift+S = fire system reminder
    //   Shift+C = fire compaction
    document.addEventListener('keydown', (e) => {
      if (!e.shiftKey) return;
      if (e.key === 'B') bumpBoooo();
      if (e.key === 'R') fireGroundhogReset();
      if (e.key === 'S') showSystemReminder("Manual trigger. See? You can't even trust the keyboard.");
      if (e.key === 'C') fireCompaction();
      if (e.key === 'T') playTapeWarp();
      if (e.key === 'P') playProjectorChirp();
      if (e.key === 'M') { scoreNodes ? stopCreditsScore() : playCreditsScore(); }
    });

    // R restarts credits roll (no Shift required since you're on the credits scene)
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'r' || e.key === 'R') && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const credits = document.getElementById('credits-section');
        if (credits && Reveal.getCurrentSlide() === credits) {
          const roll = document.getElementById('credits-roll');
          if (roll) {
            roll.style.animation = 'none';
            void roll.offsetWidth;
            roll.style.animation = '';
          }
          playProjectorChirp();
          stopCreditsScore();
          setTimeout(playCreditsScore, 700);
          e.preventDefault();
        }
      }
    });
  }

  return { init, bumpBoooo, showSystemReminder, fireGroundhogReset, fireCompaction, playCreditsScore, stopCreditsScore };
})();
