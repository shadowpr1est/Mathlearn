function getBasePath() {
  const path = window.location.pathname;
  if (path.includes("/topics/")) {
    const parts = path.split("/").filter(Boolean);
    return parts.length > 2 ? "../../" : "../";
  }
  return "";
}

function isTopicsActive() {
  const p = window.location.pathname;
  return p.endsWith("/") || p.endsWith("/index.html") || p.includes("/topics/");
}

export function asset(path) {
  return `${getBasePath()}${path}`;
}

export function initHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const base = getBasePath();
  const active = isTopicsActive();

  header.innerHTML = `
    <div class="header-inner">
      <a href="${base}index.html" class="brand">
        <span class="brand-icon">∑</span>
        <span>Математика<span class="brand-sub">9 класс</span></span>
      </a>
      <nav aria-label="Основное меню">
        <a href="${base}index.html" class="nav-link ${active ? "nav-link-active" : "nav-link-inactive"}">Темы</a>
      </nav>
    </div>
  `;
}

initHeader();
