type DD = {
  trigger: HTMLElement;
  panel: HTMLElement;
  root: HTMLElement;
  openTimer?: number;
  closeTimer?: number;
};

const OPEN_DELAY = 200;
const CLOSE_DELAY = 350;

function setupDropdown(root: HTMLElement) {
  const name = root.getAttribute("data-dropdown")!;
  const trigger = root.querySelector<HTMLElement>(
    `[data-dd-trigger="${name}"]`,
  )!;
  const panel = root.querySelector<HTMLElement>(`[data-dd-panel="${name}"]`)!;

  const dd: DD = { trigger, panel, root };

  const open = () => {
    clearTimeout(dd.closeTimer);
    dd.openTimer = window.setTimeout(() => {
      panel.setAttribute("data-open", "true");
      trigger.setAttribute("aria-expanded", "true");
      if (document.activeElement === trigger) {
        const first = panel.querySelector<HTMLElement>('[role="menuitem"]');
        first?.setAttribute("tabindex", "0");
      }
    }, OPEN_DELAY);
  };

  const close = () => {
    clearTimeout(dd.openTimer);
    dd.closeTimer = window.setTimeout(() => {
      panel.removeAttribute("data-open");
      trigger.setAttribute("aria-expanded", "false");
      panel
        .querySelectorAll<HTMLElement>('[role="menuitem"]')
        .forEach((el) => el.setAttribute("tabindex", "-1"));
    }, CLOSE_DELAY);
  };

  const inside = (el: EventTarget | null) =>
    el instanceof Node && (root.contains(el) || panel.contains(el));

  trigger.addEventListener("mouseenter", open);
  panel.addEventListener("mouseenter", open);
  trigger.addEventListener("mouseleave", close);
  panel.addEventListener("mouseleave", close);

  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    const openNow = panel.getAttribute("data-open") === "true";
    if (openNow) {
      close();
    } else {
      open();
    }
  });

  trigger.addEventListener("focus", open);
  trigger.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
      setTimeout(
        () => panel.querySelector<HTMLElement>('[role="menuitem"]')?.focus(),
        OPEN_DELAY + 10,
      );
    }
    if (e.key === "Escape") {
      close();
      (trigger as HTMLElement).focus();
    }
  });

  panel.addEventListener("keydown", (e: KeyboardEvent) => {
    const items = Array.from(
      panel.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      (items[i + 1] ?? items[0])?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      (items[i - 1] ?? (items.at(-1) as HTMLElement))?.focus();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      (trigger as HTMLElement).focus();
    }
  });

  document.addEventListener(
    "click",
    (e) => {
      if (!inside(e.target)) close();
    },
    { capture: true },
  );

  root.addEventListener("pointerenter", () => clearTimeout(dd.closeTimer));
  panel.addEventListener("pointerenter", () => clearTimeout(dd.closeTimer));
}

document
  .querySelectorAll<HTMLElement>("[data-dropdown]")
  .forEach(setupDropdown);
