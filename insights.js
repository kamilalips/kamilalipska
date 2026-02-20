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
      const rawPosts = await response.json();
      this.posts = (rawPosts || []).map((post) => ({
        ...post,
        category: this.normalizeCategory(post),
      }));
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
      const slug = this.deriveSlug(post);
      const detailUrl = slug ? `/insights/${slug}` : (post.sourceUrl || post.url || "/insights");
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

  normalizeCategory(post = {}) {
    if (post.category && String(post.category).trim()) return String(post.category).trim();

    const signals = `${post.primaryKeyword || ""} ${post.title || ""}`.toLowerCase();
    if (signals.includes("ai") || signals.includes("llm") || signals.includes("automation")) return "AI & Automation";
    if (signals.includes("seo") || signals.includes("content") || signals.includes("serp")) return "SEO & Content";
    if (signals.includes("data") || signals.includes("attribution") || signals.includes("tracking")) return "Data & Attribution";
    if (signals.includes("web3") || signals.includes("crypto") || signals.includes("blockchain")) return "Web3 Growth";
    if (signals.includes("saas") || signals.includes("b2b") || signals.includes("product")) return "SaaS Growth";
    return "Growth Strategy";
  }

  deriveSlug(post = {}) {
    if (post.slug && String(post.slug).trim()) return String(post.slug).trim();

    const source = `${post.url || ""} ${post.sourceUrl || ""}`;
    const match = source.match(/\/insights\/([^/?#]+)|\/blog\/([^/?#]+)/i);
    const raw = match ? (match[1] || match[2] || "") : "";
    if (raw) return raw.replace(/\.html$/i, "").trim();

    const title = (post.title || "").toLowerCase().trim();
    if (!title) return "";
    return title
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
}

function initMobileMenu() {
  const menuToggle = document.getElementById("mobileMenuToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (!menuToggle || !mobileNav) return;

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    mobileNav.classList.toggle("active");
    document.body.style.overflow = mobileNav.classList.contains("active") ? "hidden" : "";
  });

  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      mobileNav.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  const page = new InsightsPage();
  page.init();
});
