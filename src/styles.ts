let injected = false;

/**
 * Injects the split-flap CSS keyframes into <head> exactly once.
 * Safe to call multiple times and in SSR (no-ops when document is unavailable).
 */
export function injectStyles(): void {
  if (injected || typeof document === "undefined") return;
  injected = true;

  const style = document.createElement("style");
  style.setAttribute("data-split-flap", "");
  style.textContent = `
    @keyframes sf-fold-down {
      0%   { transform: rotateX(0deg); }
      100% { transform: rotateX(-90deg); }
    }
    @keyframes sf-fold-up {
      0%   { transform: rotateX(90deg); }
      100% { transform: rotateX(0deg); }
    }

    /* ── Linear easing (default) ── */
    .sf-flip-top {
      animation-name: sf-fold-down;
      animation-timing-function: ease-in;
      animation-fill-mode: forwards;
      will-change: transform;
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }
    .sf-flip-bot {
      animation-name: sf-fold-up;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;
      will-change: transform;
      transform-style: preserve-3d;
      backface-visibility: hidden;
      transform: rotateX(90deg);
    }

    /* ── Decelerate easing (mechanical inertia) ── */
    .sf-flip-top-decel {
      animation-name: sf-fold-down;
      animation-timing-function: cubic-bezier(0.1, 0, 0.25, 1);
      animation-fill-mode: forwards;
      will-change: transform;
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }
    .sf-flip-bot-decel {
      animation-name: sf-fold-up;
      animation-timing-function: cubic-bezier(0.0, 0, 0.2, 1);
      animation-fill-mode: forwards;
      will-change: transform;
      transform-style: preserve-3d;
      backface-visibility: hidden;
      transform: rotateX(90deg);
    }

    /* ── Settle bounce (standard) ── */
    @keyframes sf-settle {
      0%   { transform: rotateX(-3deg); }
      40%  { transform: rotateX(1.2deg); }
      70%  { transform: rotateX(-0.4deg); }
      100% { transform: rotateX(0deg); }
    }
    .sf-settle {
      animation-name: sf-settle;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;
      will-change: transform;
      transform-origin: top center;
    }

    /* ── Settle bounce (spring — enhanced oscillation) ── */
    @keyframes sf-settle-spring {
      0%   { transform: rotateX(-5deg); }
      20%  { transform: rotateX(3deg); }
      38%  { transform: rotateX(-2deg); }
      54%  { transform: rotateX(1.2deg); }
      70%  { transform: rotateX(-0.5deg); }
      85%  { transform: rotateX(0.2deg); }
      100% { transform: rotateX(0deg); }
    }
    .sf-settle-spring {
      animation-name: sf-settle-spring;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;
      will-change: transform;
      transform-origin: top center;
    }
  `;
  document.head.appendChild(style);
}
