#!/usr/bin/env tsx

/**
 * Build Numerology & Lucky Numbers website
 * Modern TypeScript + Tailwind CSS build system
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');

// Helper function to check if file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Load content
let contentData: any;

async function loadContent() {
  const data = await fs.readFile(path.join(rootDir, 'content.json'), 'utf8');
  contentData = JSON.parse(data);
}

// Generate Tailwind CSS
function generateCSS() {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply antialiased;
  }
}

@layer components {
  .gradient-text {
    @apply bg-gradient-to-r from-mystical-600 to-primary-600 bg-clip-text text-transparent;
  }
}
`;
}

// Generate JavaScript
function generateJS() {
  return `// Cookie Banner
document.addEventListener('DOMContentLoaded', function() {
  const cookieBanner = document.querySelector('.cookie-banner');
  const acceptButton = document.querySelector('.accept-button');
  
  if (!localStorage.getItem('cookieConsent')) {
    cookieBanner?.classList.remove('hidden');
  }
  
  acceptButton?.addEventListener('click', function() {
    localStorage.setItem('cookieConsent', 'true');
    cookieBanner?.classList.add('hidden');
  });
});
`;
}

// Generate HTML template
function generateHTML(title: string, content: string, isHomepage = false) {
  const basePath = isHomepage ? './' : '../';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Numerology & Lucky Numbers</title>
  <meta name="description" content="${contentData.site.description}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${basePath}css/style.css">
</head>
<body class="bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 min-h-screen">
  <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <a href="${basePath}index.html" class="text-2xl font-bold gradient-text">
          Numerology<span class="text-slate-700">Hub</span>
        </a>
        <ul class="flex gap-6 items-center">
          <li><a href="${basePath}index.html" class="text-slate-700 hover:text-mystical-600 font-medium transition-colors">Home</a></li>
          <li><a href="${basePath}blog/index.html" class="text-slate-700 hover:text-mystical-600 font-medium transition-colors">Blog</a></li>
          <li><a href="${basePath}about.html" class="text-slate-700 hover:text-mystical-600 font-medium transition-colors">About</a></li>
          <li><a href="${basePath}contact.html" class="bg-gradient-to-r from-mystical-600 to-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5">Contact</a></li>
        </ul>
      </div>
    </nav>
  </header>

  <main>
    ${content}
  </main>

  <footer class="bg-slate-900 text-slate-300 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="text-center md:text-left">
          <p class="text-slate-400 text-sm">&copy; 2025 Numerology Hub. All rights reserved.</p>
          <p class="text-slate-500 text-xs mt-2">For entertainment and educational purposes only.</p>
        </div>
        <div class="flex gap-6">
          <a href="${basePath}about.html" class="text-slate-400 hover:text-white transition-colors text-sm">About</a>
          <a href="${basePath}privacy.html" class="text-slate-400 hover:text-white transition-colors text-sm">Privacy</a>
          <a href="${basePath}terms.html" class="text-slate-400 hover:text-white transition-colors text-sm">Terms</a>
          <a href="${basePath}contact.html" class="text-slate-400 hover:text-white transition-colors text-sm">Contact</a>
        </div>
      </div>
    </div>
  </footer>

  <div class="cookie-banner hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-slate-600 text-sm">We use cookies to enhance your browsing experience. By continuing, you consent to our use of cookies.</p>
        <button class="accept-button bg-gradient-to-r from-mystical-600 to-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
          Accept
        </button>
      </div>
    </div>
  </div>

  <script src="${basePath}js/main.js"></script>
</body>
</html>`;
}

// Build homepage
async function buildHomepage() {
  console.log('🏠 Building modern homepage...');
  
  const posts = contentData.posts || [];
  const featured = posts[0];
  const recent = posts.slice(1, 4);
  
  // Check if images exist
  const featuredImageExists = featured ? await fileExists(path.join(buildDir, 'images', `${featured.slug}.png`)) : false;
  const recentImageChecks = await Promise.all(
    recent.map((post: any) => fileExists(path.join(buildDir, 'images', `${post.slug}.png`)))
  );
  
  const content = `
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-32">
      <div class="absolute inset-0 bg-gradient-to-br from-mystical-100/50 via-primary-100/30 to-purple-100/50"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span class="gradient-text">Discover Your</span><br>
            <span class="text-slate-800">Lucky Numbers</span>
          </h1>
          <p class="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Explore the mystical world of numerology and unlock the secrets of your personal numbers
          </p>
          <div class="flex gap-4 justify-center">
            <a href="blog/index.html" class="bg-gradient-to-r from-mystical-600 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              Explore Blog
            </a>
            <a href="about.html" class="bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-mystical-300 transition-all">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>

    ${featured ? `
    <!-- Featured Post -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-20">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-shadow">
        <a href="blog/${featured.slug}.html" class="block">
          <div class="md:flex">
            <div class="md:w-1/2">
              ${featuredImageExists 
                ? `<img src="images/${featured.slug}.png" alt="${featured.title}" class="w-full h-full object-cover aspect-video">`
                : `<div class="aspect-video bg-gradient-to-br from-mystical-400 to-primary-400 flex items-center justify-center">
                    <span class="text-white text-6xl font-bold">${featured.title.charAt(0)}</span>
                  </div>`}
            </div>
            <div class="md:w-1/2 p-8 md:p-12">
              <div class="flex gap-4 text-sm text-slate-500 mb-4">
                <span>${featured.date}</span>
                <span>•</span>
                <span>${featured.readTime}</span>
              </div>
              <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4 hover:text-mystical-600 transition-colors">
                ${featured.title}
              </h2>
              <p class="text-lg text-slate-600 mb-6 leading-relaxed">
                ${featured.metaDescription}
              </p>
              <span class="text-mystical-600 font-semibold inline-flex items-center gap-2">
                Read more →
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
    ` : ''}

    <!-- Recent Posts Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div class="flex justify-between items-center mb-12">
        <h2 class="text-4xl font-bold text-slate-800">Latest Articles</h2>
        <a href="blog/index.html" class="text-mystical-600 font-semibold hover:text-mystical-700 transition-colors">
          View all →
        </a>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${recent.map((post: any, index: number) => `
          <a href="blog/${post.slug}.html" class="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-slate-100 transform hover:-translate-y-2">
            ${recentImageChecks[index]
              ? `<img src="images/${post.slug}.png" alt="${post.title}" class="w-full aspect-video object-cover">`
              : `<div class="aspect-video bg-gradient-to-br from-mystical-300 to-primary-300 flex items-center justify-center">
                  <span class="text-white text-4xl font-bold opacity-80">${post.title.charAt(0)}</span>
                </div>`}
            <div class="p-6">
              <div class="flex gap-3 text-xs text-slate-500 mb-3">
                <span>${post.date}</span>
                <span>•</span>
                <span>${post.readTime}</span>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-mystical-600 transition-colors line-clamp-2">
                ${post.title}
              </h3>
              <p class="text-slate-600 text-sm leading-relaxed line-clamp-3">
                ${post.metaDescription}
              </p>
            </div>
          </a>
        `).join('')}
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div class="bg-gradient-to-r from-mystical-600 to-primary-600 rounded-2xl p-12 text-center text-white">
        <h2 class="text-4xl font-bold mb-4">Ready to Discover Your Numbers?</h2>
        <p class="text-xl mb-8 opacity-90">Explore our comprehensive guides and unlock the power of numerology</p>
        <a href="blog/index.html" class="bg-white text-mystical-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all inline-block">
          Start Your Journey
        </a>
      </div>
    </section>
  `;
  
  const html = generateHTML('Home', content, true);
  await fs.writeFile(path.join(buildDir, 'index.html'), html);
  console.log('✅ Homepage created');
}

// Build blog index
async function buildBlogIndex() {
  console.log('📚 Building blog index...');
  
  const posts = contentData.posts || [];
  
  // Check if images exist
  const imageChecks = await Promise.all(
    posts.map((post: any) => fileExists(path.join(buildDir, 'images', `${post.slug}.png`)))
  );
  
  const content = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          <span class="gradient-text">Numerology</span> Blog
        </h1>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto">
          Discover insights, guides, and wisdom about numbers and their meanings
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${posts.map((post: any, index: number) => `
          <a href="${post.slug}.html" class="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-slate-100 transform hover:-translate-y-2">
            ${imageChecks[index]
              ? `<img src="../images/${post.slug}.png" alt="${post.title}" class="w-full aspect-video object-cover">`
              : `<div class="aspect-video bg-gradient-to-br from-mystical-300 to-primary-300 flex items-center justify-center">
                  <span class="text-white text-4xl font-bold opacity-80">${post.title.charAt(0)}</span>
                </div>`}
            <div class="p-6">
              <div class="flex gap-3 text-xs text-slate-500 mb-3">
                <span>${post.date}</span>
                <span>•</span>
                <span>${post.readTime}</span>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-mystical-600 transition-colors line-clamp-2">
                ${post.title}
              </h3>
              <p class="text-slate-600 text-sm leading-relaxed line-clamp-3">
                ${post.metaDescription}
              </p>
            </div>
          </a>
        `).join('')}
      </div>
    </section>
  `;
  
  const html = generateHTML('Blog', content, false);
  await fs.mkdir(path.join(buildDir, 'blog'), { recursive: true });
  await fs.writeFile(path.join(buildDir, 'blog', 'index.html'), html);
  console.log('✅ Blog index created');
}

// Build blog posts
async function buildBlogPosts() {
  console.log('📝 Building blog post pages...');
  
  const posts = contentData.posts || [];
  
  for (const post of posts) {
    // Clean up content: remove self-referential links and fix relative paths
    let cleanedContent = post.content;
    
    // Remove self-referential links (links to the same post)
    cleanedContent = cleanedContent.replace(
      new RegExp(`<a href="${post.slug}\\.html"[^>]*>.*?</a>`, 'gi'),
      (match: string) => {
        // Remove the link but keep the text
        return match.replace(/<a[^>]*>|<\/a>/gi, '');
      }
    );
    
    // Ensure all internal blog links use correct relative paths
    const allSlugs = posts.map((p: any) => p.slug);
    allSlugs.forEach((slug: string) => {
      if (slug !== post.slug) {
        // Fix links that might be missing .html extension
        cleanedContent = cleanedContent.replace(
          new RegExp(`href="${slug}(?!\\.html)"`, 'gi'),
          `href="${slug}.html"`
        );
      }
    });
    
    // Check if images exist (before template string)
    const postImageExists = await fileExists(path.join(buildDir, 'images', `${post.slug}.png`));
    const authorImageExists = await fileExists(path.join(buildDir, 'images', 'author.png'));
    
    const content = `
      <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div class="text-center mb-12">
            <div class="flex gap-4 justify-center text-sm text-slate-500 mb-6">
              <span>${post.date}</span>
              <span>•</span>
              <span>${post.readTime}</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              ${post.title}
            </h1>
          </div>
          
          ${postImageExists
            ? `<img src="../images/${post.slug}.png" alt="${post.title}" class="w-full rounded-xl mb-8 aspect-video object-cover">`
            : ''}
          
          <div class="prose prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-a:text-mystical-600 prose-strong:text-slate-800 prose-ul:text-slate-700 prose-li:text-slate-700">
            ${cleanedContent}
          </div>
          
          <div class="mt-12 pt-8 border-t border-slate-200">
            <div class="flex items-center gap-4">
              ${authorImageExists
                ? `<img src="../images/author.png" alt="${contentData.site.author.name}" class="w-16 h-16 rounded-full object-cover">`
                : `<div class="w-16 h-16 rounded-full bg-gradient-to-br from-mystical-400 to-primary-400 flex items-center justify-center text-white text-2xl font-bold">
                    ${contentData.site.author.name.charAt(0)}
                  </div>`}
              <div>
                <h3 class="font-bold text-slate-800">${contentData.site.author.name}</h3>
                <p class="text-sm text-slate-600">${contentData.site.author.role}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
    
    const html = generateHTML(post.title, content, false);
    await fs.writeFile(path.join(buildDir, 'blog', `${post.slug}.html`), html);
    console.log(`  ✅ ${post.title}`);
  }
}

// Build static pages
async function buildStaticPages() {
  console.log('📄 Building static pages...');
  
  const pages = [
    {
      slug: 'about',
      title: 'About Us',
      content: `
        <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 class="text-4xl md:text-5xl font-bold mb-8 gradient-text">About Numerology Hub</h1>
            <div class="prose prose-lg max-w-none">
              <p class="text-lg text-slate-700 mb-6">
                Welcome to Numerology Hub, your trusted source for exploring the fascinating world of numerology and lucky numbers.
              </p>
              <h2 class="text-2xl font-bold text-slate-800 mt-8 mb-4">Our Mission</h2>
              <p class="text-slate-700 mb-6">
                We believe that numbers hold profound meaning and can offer insights into our lives, personalities, and destinies. Our mission is to make numerology accessible, understandable, and practical for everyone.
              </p>
              <h2 class="text-2xl font-bold text-slate-800 mt-8 mb-4">What We Offer</h2>
              <ul class="list-disc pl-6 text-slate-700 space-y-2">
                <li>Comprehensive guides on numerology basics</li>
                <li>Personal number calculations and meanings</li>
                <li>Lucky number insights for different purposes</li>
                <li>Educational content about number symbolism</li>
                <li>Practical applications of numerology</li>
              </ul>
            </div>
          </div>
        </section>
      `
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      content: `
        <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 class="text-4xl md:text-5xl font-bold mb-8 text-slate-800">Privacy Policy</h1>
            <div class="prose prose-lg max-w-none text-slate-700">
              <p><strong>Last updated:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h2 class="text-2xl font-bold text-slate-800 mt-8 mb-4">Introduction</h2>
              <p>We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information.</p>
              <h2 class="text-2xl font-bold text-slate-800 mt-8 mb-4">Information We Collect</h2>
              <p>We may collect usage data, technical information, and cookie data to improve your experience on our website.</p>
              <h2 class="text-2xl font-bold text-slate-800 mt-8 mb-4">How We Use Your Information</h2>
              <p>We use collected information to improve our website, analyze traffic, and provide a better user experience.</p>
            </div>
          </div>
        </section>
      `
    },
    {
      slug: 'terms',
      title: 'Terms & Conditions',
      content: `
        <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 class="text-4xl md:text-5xl font-bold mb-8 text-slate-800">Terms & Conditions</h1>
            <div class="prose prose-lg max-w-none text-slate-700">
              <p><strong>Last updated:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h2 class="text-2xl font-bold text-slate-800 mt-8 mb-4">Agreement to Terms</h2>
              <p>By accessing this website, you agree to be bound by these Terms and Conditions.</p>
              <h2 class="text-2xl font-bold text-slate-800 mt-8 mb-4">Use of Website</h2>
              <p>You may use our website for lawful purposes only. All content is provided for entertainment and educational purposes.</p>
              <h2 class="text-2xl font-bold text-slate-800 mt-8 mb-4">Disclaimer</h2>
              <p>Numerology information is provided for entertainment purposes only. We make no guarantees about the accuracy or effectiveness of numerology practices.</p>
            </div>
          </div>
        </section>
      `
    },
    {
      slug: 'contact',
      title: 'Contact Us',
      content: `
        <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 class="text-4xl md:text-5xl font-bold mb-8 gradient-text">Contact Us</h1>
            <div class="prose prose-lg max-w-none text-slate-700">
              <p class="text-lg mb-6">We'd love to hear from you! Reach out with questions, feedback, or suggestions.</p>
              <div class="bg-gradient-to-br from-mystical-50 to-primary-50 rounded-xl p-8 mt-8">
                <p class="font-semibold text-slate-800 mb-2">Email:</p>
                <p class="text-slate-600">contact@numerologyhub.example.com</p>
                <p class="font-semibold text-slate-800 mt-6 mb-2">Response Time:</p>
                <p class="text-slate-600">We typically respond within 24-48 hours</p>
              </div>
            </div>
          </div>
        </section>
      `
    }
  ];
  
  for (const page of pages) {
    const html = generateHTML(page.title, page.content, true);
    await fs.writeFile(path.join(buildDir, `${page.slug}.html`), html);
  }
  
  console.log('✅ Static pages created');
}

// Main build function
async function build() {
  try {
    console.log('🔮 Numerology Hub - Website Builder');
    console.log('='.repeat(50));
    
    await loadContent();
    
    // Create directories
    await fs.mkdir(path.join(buildDir, 'css'), { recursive: true });
    await fs.mkdir(path.join(buildDir, 'js'), { recursive: true });
    
    // Generate CSS (will be processed by Tailwind)
    console.log('\n🎨 Generating CSS...');
    await fs.writeFile(path.join(buildDir, 'css', 'style.css'), generateCSS());
    console.log('✅ CSS generated');
    
    // Generate JS
    console.log('\n📜 Generating JavaScript...');
    await fs.writeFile(path.join(buildDir, 'js', 'main.js'), generateJS());
    console.log('✅ JavaScript generated');
    
    // Build pages
    await buildHomepage();
    await buildBlogIndex();
    await buildBlogPosts();
    await buildStaticPages();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Website build complete!');
    console.log('\n📝 Note: Run Tailwind CLI to process CSS:');
    console.log('   npx tailwindcss -i ./build/css/style.css -o ./build/css/style.css --minify');
    console.log('\n🚀 To view your site:');
    console.log('   npm run serve');
    
  } catch (error: any) {
    console.error('\n❌ Build error:', error.message);
    process.exit(1);
  }
}

build();

