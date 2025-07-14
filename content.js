(() => {
  const INITIAL_TIME = 30;
  let remaining = INITIAL_TIME;
  let timer = null;
  let running = true;

  const bar = document.createElement('div');
  bar.id = 'sns-auto-loader-bar';
  bar.style.position = 'fixed';
  bar.style.top = '0';
  bar.style.left = '0';
  bar.style.height = '4px';
  bar.style.backgroundColor = '#33AAFF';
  bar.style.zIndex = '9999';
  bar.style.transition = 'width 1s linear';
  bar.style.width = '100%';
  document.body.appendChild(bar);

  function updateBar() {
    bar.style.width = `${(remaining / INITIAL_TIME) * 100}%`;
  }

  function attemptPageUpdate() {
    const keywords = ['件のポストを表示'];
    const buttons = document.querySelectorAll('button, div[role="button"], a[role="button"]');
    for (const b of buttons) {
      const text = (b.innerText || '') + ' ' + (b.getAttribute('aria-label') || '');
      const style = window.getComputedStyle(b);
      const visible = style.display !== 'none' && style.visibility !== 'hidden' && b.offsetParent !== null;
      if (visible && keywords.some(k => text.includes(k))) {
        b.click();
        return;
      }
    }
    location.reload();
  }

  function tick() {
    if (!running) return;
    remaining -= 1;
    if (remaining <= 0) {
      attemptPageUpdate();
      remaining = INITIAL_TIME;
    }
    updateBar();
  }

  function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 1000);
  }

  function pauseTimer() {
    running = false;
  }

  function resumeTimer() {
    if (!running) {
      running = true;
      remaining += 5;
      updateBar();
    }
  }

  function checkState() {
    const active = document.activeElement;
    const inputFocused = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
    const scrolled = window.scrollY > 40;
    if (inputFocused || scrolled) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  }

  startTimer();
  updateBar();
  document.addEventListener('focusin', checkState, true);
  document.addEventListener('focusout', () => setTimeout(checkState, 0), true);
  window.addEventListener('scroll', checkState);
})();
