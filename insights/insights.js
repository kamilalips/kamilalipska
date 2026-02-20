async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed fetch: ${url}`);
  return response.json();
}

function card(post, external = false) {
  const article = document.createElement('article');
  article.className = 'insight-card';
  const href = external ? post.url : `/insights/${post.slug}.html`;
  const target = external ? ' target="_blank" rel="noopener"' : '';
  article.innerHTML = `
    <h3>${post.title}</h3>
    <div class="insight-meta">${(post.date || '').slice(0, 10)}${post.primaryKeyword ? ` · ${post.primaryKeyword}` : ''}</div>
    <p>${post.excerpt || ''}</p>
    <a href="${href}"${target}>Read</a>
  `;
  return article;
}

async function loadNative() {
  const container = document.getElementById('nativeInsights');
  try {
    const posts = await fetchJson('/insights/posts.json');
    if (!Array.isArray(posts) || posts.length === 0) {
      container.innerHTML = '<p>No native insights published yet.</p>';
      return;
    }
    posts
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .forEach((post) => container.appendChild(card(post, false)));
  } catch {
    container.innerHTML = '<p>Could not load native insights.</p>';
  }
}

async function loadLegacy() {
  const container = document.getElementById('legacyInsights');
  try {
    const posts = await fetchJson('/api/blog-posts');
    if (!Array.isArray(posts) || posts.length === 0) {
      container.innerHTML = '<p>No legacy references available.</p>';
      return;
    }
    posts.forEach((post) => {
      container.appendChild(
        card(
          {
            title: post.title,
            excerpt: post.excerpt,
            date: post.date,
            url: post.url,
          },
          true
        )
      );
    });
  } catch {
    container.innerHTML = '<p>Could not load legacy references.</p>';
  }
}

loadNative();
loadLegacy();
