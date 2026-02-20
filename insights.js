class InsightsPage {
  constructor() {
    this.filtersContainer = document.getElementById("insightsFilters");
    this.gridContainer = document.getElementById("insightsGrid");
    this.resultsSummary = document.getElementById("insightsResultsSummary");
    this.posts = [];
    this.activeCategory = "all";
  }

  async init() {
    try {
      const response = await fetch("/api/blog-posts");
      if (!response.ok) throw new Error("Failed to load posts");
      this.posts = await response.json();
      this.applyInitialCategoryFromUrl();
      this.renderFilters();
      this.renderPosts();
    } catch (error) {
      console.error(error);
      this.gridContainer.innerHTML = "<p>Unable to load insights right now.</p>";
    }
  }

  getCategories() {
    const unique = [...new Set(this.posts.map((post) => post.category).filter(Boolean))];
    return ["all", ...unique];
  }

  applyInitialCategoryFromUrl() {
    const query = new URLSearchParams(window.location.search);
    const requestedCategory = query.get("category");
    if (!requestedCategory) return;

    const categories = this.getCategories();
    if (categories.includes(requestedCategory)) {
      this.activeCategory = requestedCategory;
    }
  }

  renderFilters() {
    const categories = this.getCategories();
    this.filtersContainer.innerHTML = "";

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = `insights-filter${category === this.activeCategory ? " active" : ""}`;
      button.textContent = category === "all" ? "All categories" : category;
      button.type = "button";

      button.addEventListener("click", () => {
        this.activeCategory = category;
        this.renderFilters();
        this.renderPosts();
      });

      this.filtersContainer.appendChild(button);
    });
  }

  renderPosts() {
    const visible =
      this.activeCategory === "all"
        ? this.posts
        : this.posts.filter((post) => post.category === this.activeCategory);

    this.gridContainer.innerHTML = "";
    this.updateResultsSummary(visible.length);

    if (visible.length === 0) {
      this.gridContainer.innerHTML = `
        <article class="insight-card">
          <h2>No insights in this category yet</h2>
          <p>Try another category or return to all insights.</p>
        </article>
      `;
      return;
    }

    visible.forEach((post) => {
      const card = document.createElement("article");
      card.className = "insight-card";
      const detailUrl = `/insights/${post.slug}`;
      const categoryUrl = `/insights?category=${encodeURIComponent(post.category)}`;
      const image = post.image || "/avatar.svg";
      const emoji = post.emoji || "📝";
      const title = this.escapeHtml(post.title || "Untitled insight");
      const category = this.escapeHtml(post.category || "Growth Strategy");
      const excerpt = this.escapeHtml(this.formatExcerpt(post.excerpt));

      card.innerHTML = `
        <a href="${detailUrl}" class="insight-image-wrap">
          <img class="insight-image" src="${image}" alt="${title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="insight-image-placeholder">${emoji}</div>
        </a>
        <a href="${categoryUrl}" class="insight-category">${category}</a>
        <h2>${title}</h2>
        <p>${excerpt}</p>
        <div class="insight-meta">
          <span>${new Date(post.publishedAt || Date.now()).toLocaleDateString()}</span>
          <a class="insight-read" href="${detailUrl}">Read insight</a>
        </div>
      `;

      this.gridContainer.appendChild(card);
    });
  }

  updateResultsSummary(count) {
    if (!this.resultsSummary) return;
    const label = this.activeCategory === "all" ? "all categories" : this.activeCategory;
    this.resultsSummary.textContent = `${count} insight${count === 1 ? "" : "s"} in ${label}`;
  }

  formatExcerpt(value = "") {
    const cleaned = value
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleaned) return "Read this insight for practical strategies and implementation takeaways.";
    if (cleaned.length <= 180) return cleaned;

    const shortened = cleaned.slice(0, 177).trim();
    return `${shortened}...`;
  }

  escapeHtml(value = "") {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const page = new InsightsPage();
  page.init();
});
