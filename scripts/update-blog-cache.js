#!/usr/bin/env node

/**
 * Weekly blog cache update script
 * This script can be run via GitHub Actions or a cron job
 * to refresh the blog post cache weekly
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TAG_LOOKUP_URL = 'https://www.crypto-mum.com/wp-json/wp/v2/tags?slug=growth-architect';
const CACHE_FILE = path.join(__dirname, '../cache/blog-posts.json');

// Ensure cache directory exists
const cacheDir = path.dirname(CACHE_FILE);
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                try {
                    const posts = JSON.parse(data);
                    resolve(posts);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

async function fetchBlogPosts() {
    const tags = await fetchJson(TAG_LOOKUP_URL);
    const tagId = tags?.[0]?.id;
    if (!tagId) {
        throw new Error('growth-architect tag not found');
    }
    const blogUrl = `https://www.crypto-mum.com/wp-json/wp/v2/posts?per_page=8&tags=${tagId}&_embed=true`;
    return fetchJson(blogUrl);
}

function transformPosts(posts) {
    return posts.map(post => {
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
            date: post.date,
            lastUpdated: new Date().toISOString()
        };
    });
}

async function updateBlogCache() {
    try {
        console.log('🔄 Fetching latest blog posts from crypto-mum.com...');
        
        const posts = await fetchBlogPosts();
        const transformedPosts = transformPosts(posts);
        
        const cacheData = {
            posts: transformedPosts,
            lastUpdated: new Date().toISOString(),
            source: 'crypto-mum.com'
        };
        
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
        
        console.log(`✅ Successfully cached ${transformedPosts.length} blog posts`);
        console.log(`📅 Last updated: ${cacheData.lastUpdated}`);
        console.log(`💾 Cache saved to: ${CACHE_FILE}`);
        
        // Log the titles of cached posts
        console.log('\n📝 Cached posts:');
        transformedPosts.forEach((post, index) => {
            console.log(`${index + 1}. ${post.title}`);
        });
        
    } catch (error) {
        console.error('❌ Error updating blog cache:', error.message);
        process.exit(1);
    }
}

// Run the update if this script is executed directly
if (require.main === module) {
    updateBlogCache();
}

module.exports = { updateBlogCache, transformPosts };
