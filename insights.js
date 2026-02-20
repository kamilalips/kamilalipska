class InsightsPage {
  constructor() {
    this.filtersContainer = document.getElementById("insightsFilters");
    this.gridContainer = document.getElementById("insightsGrid");
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
    visible.forEach((post) => {
      const card = document.createElement("article");
      card.className = "insight-card";
      const detailUrl = `/insights/${post.slug}`;
      const categoryUrl = `/insights?category=${encodeURIComponent(post.category)}`;

      card.innerHTML = `
        <a href="${categoryUrl}" class="insight-category">${post.category}</a>
        <h2>${post.title}</h2>
        <p>${post.excerpt || ""}</p>
        <div class="insight-meta">
          <span>${new Date(post.publishedAt || Date.now()).toLocaleDateString()}</span>
          <a class="insight-read" href="${detailUrl}">Read insight</a>
        </div>
      `;

      this.gridContainer.appendChild(card);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const page = new InsightsPage();
  page.init();
});
