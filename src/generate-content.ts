#!/usr/bin/env tsx

/**
 * Generate Numerology & Lucky Numbers blog content
 * Uses Google Gemini AI to create unique, engaging posts
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ ERROR: GOOGLE_API_KEY or GEMINI_API_KEY environment variable not set');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Retry helper
async function retryAPI<T>(fn: () => Promise<T>, maxRetries = 5): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if ((error.status === 503 || error.status === 429) && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`⏳ Rate limited, waiting ${delay/1000}s before retry ${i+1}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

// Generate blog posts
async function generateBlogPosts() {
  console.log('📝 Generating numerology blog posts...\n');
  
  const topics = [
    {
      title: "Understanding Your Life Path Number: A Complete Guide",
      slug: "life-path-number-guide",
      focus: "life path number calculation, meaning, personality traits, destiny"
    },
    {
      title: "Lucky Numbers by Date of Birth: Discover Your Personal Numbers",
      slug: "lucky-numbers-date-of-birth",
      focus: "birth date numerology, personal lucky numbers, date calculations"
    },
    {
      title: "The Meaning of Master Numbers in Numerology: 11, 22, 33",
      slug: "master-numbers-numerology",
      focus: "master numbers, spiritual significance, special numbers, power numbers"
    },
    {
      title: "How to Calculate Your Expression Number: Unlock Your Talents",
      slug: "expression-number-calculation",
      focus: "expression number, name numerology, talents, abilities, career path"
    },
    {
      title: "Lucky Numbers for Different Purposes: Love, Career, and Wealth",
      slug: "lucky-numbers-different-purposes",
      focus: "lucky numbers for love, career success, wealth, specific purposes"
    },
    {
      title: "Numerology and Compatibility: Finding Your Perfect Match",
      slug: "numerology-compatibility",
      focus: "relationship compatibility, partner numbers, love numerology, soulmate numbers"
    }
  ];

  const posts = [];

  for (const topic of topics) {
    console.log(`\n📄 Generating: ${topic.title}`);
    
    const prompt = `Write a comprehensive, engaging blog post about "${topic.title}".

Focus areas: ${topic.focus}

Requirements:
- Write in English
- 1000-1200 words
- Friendly, engaging, and informative tone
- Include practical examples and calculations
- Add helpful tips and insights
- Educational and Facebook Ad policy compliant
- Structure with clear H2 and H3 headings
- Include lists, bullet points, and examples
- Write for beginners and intermediate readers
- Make it feel mystical but accessible
- Include step-by-step instructions where relevant
- Add INTERNAL LINKS: Naturally link to related topics using anchor text like "Learn more about [topic]" or "Check out our guide on [topic]" - use these internal link opportunities:
  * "Understanding Your Life Path Number" -> link to life-path-number-guide.html
  * "Master Numbers" -> link to master-numbers-numerology.html
  * "Expression Number" -> link to expression-number-calculation.html
  * "Lucky Numbers by Date of Birth" -> link to lucky-numbers-date-of-birth.html
  * "Numerology Compatibility" -> link to numerology-compatibility.html
  * "Lucky Numbers for Different Purposes" -> link to lucky-numbers-different-purposes.html
- Add EXTERNAL LINKS: Include 2-3 natural external links to reputable numerology resources, calculators, or educational sites (use <a href="https://..." target="_blank" rel="noopener noreferrer"> format)
- Links should feel natural and contextual, not forced

Return ONLY the HTML content (h2, h3, p, ul, li, a tags). Start with an engaging introduction paragraph, then use proper heading hierarchy. NO <article> wrapper, NO <h1>.`;

    const content = await retryAPI(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });

    // Generate meta description
    const metaPrompt = `Create a compelling 150-character meta description for this blog post title: "${topic.title}". Make it SEO-friendly and engaging.`;
    
    const metaDesc = await retryAPI(async () => {
      const result = await model.generateContent(metaPrompt);
      return result.response.text().trim().replace(/"/g, '');
    });

    // Generate dates (spread over last 2 months)
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    posts.push({
      title: topic.title,
      slug: topic.slug,
      content: content,
      metaDescription: metaDesc,
      date: formattedDate,
      readTime: `${Math.floor(Math.random() * 3) + 7} min read`
    });

    console.log(`✅ Generated: ${topic.title}`);
  }

  return posts;
}

// Generate author bio
async function generateAuthorBio() {
  console.log('\n👤 Generating author bio...');
  
  const prompt = `Create a friendly, professional bio for a numerology blog author. 
  
Requirements:
- Name: Sarah Chen
- Role: Numerology Expert & Spiritual Guide
- 2-3 sentences
- Mentions passion for numerology, helping others discover their numbers, and spiritual guidance
- Friendly and approachable tone
- Mystical but professional

Return ONLY the bio text.`;

  const bio = await retryAPI(async () => {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  });

  console.log('✅ Generated author bio');
  return bio;
}

// Save posts data
async function savePosts(posts: any[], authorBio: string) {
  const data = {
    site: {
      title: "Numerology Hub",
      description: "Discover the power of numerology and unlock the secrets of your lucky numbers. Comprehensive guides, calculations, and insights.",
      author: {
        name: "Sarah Chen",
        role: "Numerology Expert & Spiritual Guide",
        bio: authorBio
      }
    },
    posts: posts
  };

  await fs.writeFile(
    path.join(rootDir, 'content.json'),
    JSON.stringify(data, null, 2)
  );

  console.log('\n✅ Saved content to content.json');
}

// Main execution
async function main() {
  try {
    console.log('🔮 Numerology Hub - Content Generator\n');
    console.log('='.repeat(50));
    
    const posts = await generateBlogPosts();
    const authorBio = await generateAuthorBio();
    await savePosts(posts, authorBio);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Content generation complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run build');
    console.log('2. Process Tailwind CSS: npx tailwindcss -i ./build/css/style.css -o ./build/css/style.css --minify');
    console.log('3. Run: npm run serve');
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

