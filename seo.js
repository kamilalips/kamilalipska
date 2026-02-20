(function applyDefaultSeo() {
  const defaultRobots = "index, follow";
  const canonicalHref = `${window.location.origin}${window.location.pathname}`;

  let robots = document.querySelector('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement("meta");
    robots.setAttribute("name", "robots");
    document.head.appendChild(robots);
  }
  if (!robots.getAttribute("content")) {
    robots.setAttribute("content", defaultRobots);
  }

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", canonicalHref);
})();
