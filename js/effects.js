/* ============================================================
   Groundhog Day Effects
   - boooo counter (Mario tribute)
   - fake <system-reminder> overlay (Mario's pain receipt)
   - compaction animation (REM with data loss)
   - Groundhog Day reset gag (alarm + slide 1 visual)
   - audio synthesis (Web Audio API — no external sound files)
   ============================================================ */

window.GroundhogEffects = (function () {

  let boooo = 0;
  let resetUsed = false;
  let systemReminderFired = false;
  let compactionFired = false;
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

  function bumpBoooo() {
    boooo++;
    const el = document.getElementById('boooo-value');
    if (el) {
      el.textContent = boooo;
      el.style.transform = 'scale(1.4)';
      el.style.color = '#f7d046';
      setTimeout(() => {
        el.style.transition = 'all 0.6s';
        el.style.transform = 'scale(1)';
        el.style.color = '#ff2e88';
      }, 80);
    }
  }

  function showSystemReminder(text, autoHideMs) {
    const overlay = document.getElementById('system-reminder-overlay');
    const body = document.getElementById('system-reminder-text');
    if (!overlay || !body) return;
    body.textContent = text;
    overlay.classList.add('show');
    playBlip();
    if (autoHideMs) {
      setTimeout(() => overlay.classList.remove('show'), autoHideMs);
    }
  }

  function fireGroundhogReset() {
    if (resetUsed) return;
    resetUsed = true;
    const overlay = document.getElementById('reset-overlay');
    if (!overlay) return;
    overlay.classList.add('flash');
    playAlarm(2200);
    setTimeout(() => overlay.classList.remove('flash'), 2400);
  }

  function fireCompaction() {
    if (compactionFired) return;
    const stage = document.getElementById('compaction-stage');
    if (!stage) return;
    setTimeout(() => {
      stage.classList.add('compacting');
      playTapeWarp();
      compactionFired = true;
    }, 100);
  }

  function init() {
    // boooo counter: ticks on every fragment shown
    Reveal.on('fragmentshown', () => {
      bumpBoooo();
    });
    Reveal.on('fragmenthidden', () => {
      // do nothing, boooo only goes up (it's a tally)
    });

    // slide-state triggers
    Reveal.on('slidechanged', (event) => {
      const slide = event.currentSlide;
      const state = slide.getAttribute('data-state') || '';

      if (state.includes('trigger-system-reminder') && !systemReminderFired) {
        systemReminderFired = true;
        setTimeout(() => {
          showSystemReminder(
            "This text may or may not be relevant to what you are currently doing. " +
            "Ignore it if not. (signed: your harness, with love)",
            6500
          );
        }, 1800);
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
      }

      if (state.includes('trigger-compaction')) {
        // compaction fires after the second fragment is revealed
        // we set up a one-time listener
        const onFragShown = () => {
          fireCompaction();
          Reveal.off('fragmentshown', onFragShown);
        };
        // re-arm only if not done
        if (!compactionFired) {
          let fragCount = 0;
          const armed = () => {
            fragCount++;
            if (fragCount >= 1) {
              fireCompaction();
              Reveal.off('fragmentshown', armed);
            }
          };
          // attach but make sure it fires after the "Compaction is summarization, and summarization is lossy" fragment
          // We use a slight delay to wait for the user to click the first fragment.
          // Easier: just fire compaction after a delay if the user lingers, OR on first fragment click in this slide.
          const slideOnly = (e) => {
            if (Reveal.getCurrentSlide() !== slide) {
              Reveal.off('fragmentshown', slideOnly);
              return;
            }
            fireCompaction();
            Reveal.off('fragmentshown', slideOnly);
          };
          Reveal.on('fragmentshown', slideOnly);
        }
      }
    });

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
      if (e.key === 'R') { resetUsed = false; fireGroundhogReset(); }
      if (e.key === 'S') {
        systemReminderFired = false;
        showSystemReminder("Manual trigger. See? You can't even trust the keyboard.", 4500);
      }
      if (e.key === 'C') {
        compactionFired = false;
        fireCompaction();
      }
      if (e.key === 'T') playTapeWarp();
      if (e.key === 'P') playProjectorChirp();
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
          e.preventDefault();
        }
      }
    });
  }

  return { init, bumpBoooo, showSystemReminder, fireGroundhogReset, fireCompaction };
})();
