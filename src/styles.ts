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
  `;
  document.head.appendChild(style);
}
