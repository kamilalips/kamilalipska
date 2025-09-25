# Kamila Lipska - Growth Systems Architect

A modern, dynamic website showcasing expertise in growth systems, Web3, and SaaS architecture.

## Features

- **Dynamic Blog Integration**: Automatically fetches latest blog posts from crypto-mum.com
- **Global Visual Elements**: Floating particles, connection lines, and geometric shapes across the entire website
- **Responsive Design**: Optimized for all devices with Vercel-style minimal aesthetics
- **Performance Optimized**: Caching system for blog posts with weekly updates

## Blog Fetching System

The website automatically fetches and displays the latest blog posts from [crypto-mum.com](https://crypto-mum.com) with the following features:

### Automatic Updates
- **Weekly Refresh**: GitHub Actions workflow runs every Monday at 9 AM UTC
- **Smart Caching**: 7-day localStorage cache for fast loading
- **Fallback System**: Static content if API fails
- **Image Optimization**: Automatic image fetching with emoji fallbacks

### Technical Implementation
- **Serverless API**: `/api/blog-posts.js` handles WordPress API calls
- **CORS Handling**: Proper headers for cross-origin requests
- **Error Handling**: Graceful degradation to static content
- **Performance**: 1-hour server-side caching with Vercel

### Manual Updates
To manually update the blog cache:

```bash
# Run the update script locally
node scripts/update-blog-cache.js

# Or trigger GitHub Action manually
# Go to Actions tab in GitHub and click "Run workflow"
```

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Deploy to production
npm run deploy
```

### Project Structure
```
├── index.html              # Main website
├── styles.css              # All styling
├── script.js               # Client-side functionality
├── api/
│   └── blog-posts.js       # Serverless function for blog fetching
├── scripts/
│   └── update-blog-cache.js # Weekly cache update script
├── .github/workflows/
│   └── update-blog-cache.yml # GitHub Actions workflow
└── vercel.json             # Vercel configuration
```

## Deployment

The website is deployed on Vercel with automatic deployments from the main branch.

### Environment Setup
- **Framework**: Static HTML/CSS/JS
- **Platform**: Vercel
- **Domain**: Custom domain configured
- **SSL**: Automatic HTTPS

### Performance Features
- **Global Visual Elements**: Animated particles and shapes
- **Smooth Scrolling**: Enhanced navigation experience
- **Intersection Observer**: Scroll-triggered animations
- **Optimized Images**: Automatic image optimization
- **Caching Strategy**: Multi-layer caching system

## Blog Content Management

The blog system automatically:
1. Fetches latest 8 posts from crypto-mum.com WordPress API
2. Extracts featured images and metadata
3. Assigns appropriate emojis based on content
4. Caches results for 7 days
5. Updates weekly via GitHub Actions

### Content Types Supported
- **AI & Automation**: 🤖
- **Web3 & Crypto**: 🌐
- **SaaS & Products**: 🚀
- **Growth & Marketing**: 📈
- **SEO & Search**: 🔍
- **Data & Analytics**: 📊
- **Automation & Workflows**: ⚙️
- **Revenue & Profits**: 💰

## Contact

- **Email**: hello@kamilalipska.com
- **LinkedIn**: [linkedin.com/in/kamilalipska](https://linkedin.com/in/kamilalipska)
- **Blog**: [crypto-mum.com](https://crypto-mum.com)

---

Built with modern web technologies and deployed on Vercel for optimal performance and reliability.
