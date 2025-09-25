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
        // Fetch the blog posts from crypto-mum.com
        const response = await fetch('https://crypto-mum.com/wp-json/wp/v2/posts?per_page=6&_embed=true');
        
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
                title: "From Impatience to Innovation: Building a SaaS Product in 12 Hours",
                excerpt: "At 40, I've learned that impatience isn't always a vice, sometimes it's the fuel that drives breakthrough innovation. While I've been watching Web3 opportunities in the US unfold at what feels like glacial pace, I decided to channel that restless energy into something tangible.",
                url: "https://crypto-mum.com/from-impatience-to-innovation-building-a-saas-product-in-12-hours/",
                image: "",
                emoji: "🚀",
                date: "2024-01-15"
            },
            {
                title: "AI SEO: When Your 'Revolution' Loses to Bing",
                excerpt: "Your CEO just pinged you on Slack. The message is clear: 'We're behind on AI search. Everyone's doing it. We need to move fast.' Sound familiar? Here's what nobody's telling you: the AI search revolution is losing to the search engine that everyone forgot exists.",
                url: "https://crypto-mum.com/ai-seo-when-your-revolution-loses-to-bing/",
                image: "",
                emoji: "🤖",
                date: "2024-01-10"
            },
            {
                title: "The Credibility Bluff: Why Growth Is Often Just Theater",
                excerpt: "Every company claims it hires for impact. But most hire just for credibility, not the real kind. They want people who 'look smart,' not those who actually build. It's all about the appearance: sharp jargon, slick dashboards, and the ability to sound right in a room.",
                url: "https://crypto-mum.com/the-credibility-bluff-why-growth-is-often-just-theater/",
                image: "",
                emoji: "🎭",
                date: "2024-01-05"
            },
            {
                title: "Web3 Keeps Rediscovering What SaaS Learned a Decade Ago",
                excerpt: "Why foundational growth work gets sidelined, and what that reveals about organizational maturity in a fast-moving industry. Web3 teams hire me to solve a growth problem they can't name: they want predictable user acquisition, but they've built organizations that can only execute campaigns.",
                url: "https://crypto-mum.com/web3-keeps-rediscovering-what-saas-learned-a-decade-ago/",
                image: "",
                emoji: "🌐",
                date: "2024-01-01"
            },
            {
                title: "Why HubSpot Fails Growth Architects, and How I Build Around It",
                excerpt: "HubSpot feels like the Apple of B2B platforms, but not in a good way. Closed, controlling, and beautifully packaged, until you try doing real work. Built for sales, marketed to marketers, and priced for finance departments, it promises a unified go-to-market engine.",
                url: "https://crypto-mum.com/why-hubspot-fails-growth-architects-and-how-i-build-around-it/",
                image: "",
                emoji: "🔧",
                date: "2023-12-28"
            },
            {
                title: "How I Fixed Attribution Without Being a Developer (But Thinking Like One)",
                excerpt: "What I learned building signal integrity across stacks when no one else would prioritize it. Attribution was failing because the stack was fragmented, and dev didn't care. We weren't missing tools. We had GA4, Segment, Webflow, GTM, and Zapier.",
                url: "https://crypto-mum.com/how-i-fixed-attribution-without-being-a-developer-but-thinking-like-one/",
                image: "",
                emoji: "📊",
                date: "2023-12-25"
            },
            {
                title: "When You're the Only One Watching the Crawl Logs",
                excerpt: "What a broken sitemap taught me about technical SEO, ignored systems, and working in spaces where urgency is defined by someone else. A recent lesson in invisible failures - not long ago, I flagged a critical SEO issue in a project I was supporting.",
                url: "https://crypto-mum.com/when-youre-the-only-one-watching-the-crawl-logs/",
                image: "",
                emoji: "🔍",
                date: "2023-12-20"
            },
            {
                title: "When to Take Profits: A Busy Mum's Guide to Crypto Exit Strategies",
                excerpt: "Hey crypto mums (and dads)! It's been way too long since my last post – between juggling the kids, work campaigns launching left and right, and trying to keep up with this wild crypto market, time just seems to vanish.",
                url: "https://crypto-mum.com/when-to-take-profits-a-busy-mums-guide-to-crypto-exit-strategies/",
                image: "",
                emoji: "💰",
                date: "2023-12-15"
            }
        ];
        
        return res.status(200).json(fallbackPosts);
    }
}
