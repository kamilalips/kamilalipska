// Serverless function to fetch blog posts from crypto-mum.com
// This would be deployed as a Vercel serverless function

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Fetch growth-architect tag id first
        const tagResponse = await fetch('https://www.crypto-mum.com/wp-json/wp/v2/tags?slug=growth-architect');
        if (!tagResponse.ok) {
            throw new Error(`Tag lookup failed: ${tagResponse.status}`);
        }
        const tags = await tagResponse.json();
        const growthArchitectTagId = tags?.[0]?.id;
        if (!growthArchitectTagId) {
            throw new Error('growth-architect tag not found');
        }

        // Fetch posts filtered by growth-architect tag
        const response = await fetch(`https://www.crypto-mum.com/wp-json/wp/v2/posts?per_page=8&tags=${growthArchitectTagId}&_embed=true`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        
        // Transform the WordPress posts to our format
        const transformedPosts = posts.map(post => {
            // Extract featured image
            let imageUrl = '';
            let emoji = '📝';
            
            if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
                imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
            }
            
            // Set emoji based on post title/content
            const title = post.title.rendered.toLowerCase();
            if (title.includes('ai') || title.includes('artificial intelligence')) emoji = '🤖';
            else if (title.includes('web3') || title.includes('crypto') || title.includes('blockchain')) emoji = '🌐';
            else if (title.includes('saas') || title.includes('product')) emoji = '🚀';
            else if (title.includes('growth') || title.includes('marketing')) emoji = '📈';
            else if (title.includes('seo') || title.includes('search')) emoji = '🔍';
            else if (title.includes('data') || title.includes('analytics')) emoji = '📊';
            else if (title.includes('automation') || title.includes('workflow')) emoji = '⚙️';
            else if (title.includes('profit') || title.includes('revenue')) emoji = '💰';
            
            return {
                title: post.title.rendered,
                excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                url: post.link,
                image: imageUrl,
                emoji: emoji,
                date: post.date
            };
        });
        
        // Cache the response for 1 hour
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
        
        return res.status(200).json(transformedPosts);
        
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        
        // Return fallback posts if the API fails
        const fallbackPosts = [
            {
                title: "How X Ranks Content – A Code-Based Analysis for Organic Growth",
                excerpt: "Code-level review of X ranking logic translated into practical growth implications.",
                url: "https://www.crypto-mum.com/blog/how-x-ranks-content-a-code-based-analysis-for-organic-growth/",
                image: "",
                emoji: "📈",
                date: "2026-02-20"
            },
            {
                title: "Cookie Consent: The €5.65 Billion Reality Check Nobody Wants to Face",
                excerpt: "Technical analysis of consent, compliance risk, and data quality impact on growth systems.",
                url: "https://www.crypto-mum.com/blog/cookie-consent-the-e5-65-billion-reality-check-nobody-wants-to-face/",
                image: "",
                emoji: "🔍",
                date: "2025-10-15"
            },
            {
                title: "How I Fixed Attribution Without Being a Developer (But Thinking Like One)",
                excerpt: "Practical attribution systems thinking when engineering support is limited.",
                url: "https://www.crypto-mum.com/blog/how-i-fixed-attribution-without-being-a-developer-but-thinking-like-one/",
                image: "",
                emoji: "📊",
                date: "2025-07-14"
            },
            {
                title: "Web3 Keeps Rediscovering What SaaS Learned a Decade Ago",
                excerpt: "Why foundational growth architecture keeps getting skipped and how to fix it.",
                url: "https://www.crypto-mum.com/blog/web3-keeps-rediscovering-what-saas-learned-a-decade-ago/",
                image: "",
                emoji: "🌐",
                date: "2025-07-31"
            },
            {
                title: "Why HubSpot Fails Growth Architects, and How I Build Around It",
                excerpt: "System-level critique of GTM stack constraints and practical alternatives.",
                url: "https://www.crypto-mum.com/blog/why-hubspot-fails-growth-architects-and-how-i-build-around-it/",
                image: "",
                emoji: "🔧",
                date: "2025-07-22"
            },
            {
                title: "AI SEO: When Your Revolution Loses to Bing",
                excerpt: "A practical view on AI search hype vs measurable distribution outcomes.",
                url: "https://www.crypto-mum.com/blog/ai-seo-when-your-revolution-loses-to-bing/",
                image: "",
                emoji: "🤖",
                date: "2025-09-10"
            }
        ];
        
        return res.status(200).json(fallbackPosts);
    }
}
