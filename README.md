# Numerology & Lucky Numbers Website

A modern, beautiful website about numerology and lucky numbers, built with TypeScript and Tailwind CSS. Perfect for Facebook white ads and deployed on GitHub Pages.

🌐 **Live Site:** https://bestonlinegames07.github.io/luckynumbers/

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Create a `.env` file in the root directory:

```
GOOGLE_API_KEY=your_api_key_here
```

### 3. Generate Content

Generate blog posts using AI:

```bash
npm run generate-content
```

### 4. Build Website

Build the static website:

```bash
npm run build
```

### 5. View Locally

Serve the website locally:

```bash
npm run serve
```

## 📦 Deployment to GitHub Pages

### Option 1: Manual Deployment (Simple)

1. Build the website:
   ```bash
   npm run build
   ```

2. Deploy to docs folder:
   ```bash
   npm run deploy
   ```

3. Commit and push:
   ```bash
   git add docs/
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. Configure GitHub Pages:
   - Go to repository **Settings** > **Pages**
   - **Source**: Deploy from a branch
   - **Branch**: `main`, **Folder**: `/docs`
   - Click **Save**

### Option 2: Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically builds and deploys on every push to `main`.

**Setup:**
1. Add your `GOOGLE_API_KEY` as a GitHub Secret:
   - Go to repository **Settings** > **Secrets and variables** > **Actions**
   - Click **New repository secret**
   - Name: `GOOGLE_API_KEY`
   - Value: Your API key
   - Click **Add secret**

2. Push to main branch:
   ```bash
   git push origin main
   ```

3. The workflow will automatically:
   - Generate content
   - Build the website
   - Deploy to GitHub Pages

## 📁 Project Structure

```
numerology-lucky-numbers/
├── src/
│   ├── build.ts              # Main build script
│   └── generate-content.ts   # Content generation script
├── build/                    # Output directory (local)
├── docs/                     # GitHub Pages deployment folder
├── .github/workflows/        # GitHub Actions workflows
├── content.json             # Generated content data
├── package.json
└── tailwind.config.js
```

## 🎨 Features

- **Modern Design**: Beautiful gradient-based design with Tailwind CSS
- **TypeScript**: Type-safe build scripts
- **Responsive**: Mobile-first, fully responsive design
- **SEO-Friendly**: Proper meta tags and semantic HTML
- **Fast**: Static site generation for optimal performance
- **Facebook Compliant**: Safe for Facebook white ads
- **Auto-Deploy**: GitHub Actions workflow for automatic deployment

## 🔧 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme.

### Content

Edit `content.json` or regenerate with:

```bash
npm run generate-content
```

## 📝 License

For internal use only.
