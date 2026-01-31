# Deploy to GitHub Pages

This guide will walk you through publishing the Three Hours garden as a live website.

## Quick Summary

**What you need:**
- A GitHub account (free)
- 5 minutes

**What you'll get:**
- A live URL like `https://yourusername.github.io/three-hours-garden/`
- The garden accessible to anyone with the link

---

## Step-by-Step Instructions

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** button (top right) → **New repository**
3. Name it: `three-hours-garden` (or any name you prefer)
4. Choose **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README (we already have one)
6. Click **Create repository**

### Step 2: Upload the Files

You have two options:

#### Option A: Drag & Drop (Easiest)

1. On your new repo page, click **uploading an existing file**
2. Open Finder/Explorer and navigate to your `3-hours-with-Kimi` folder
3. Select ALL files and folders:
   - `index.html`
   - `garden/` folder
   - `reflections/` folder  
   - `artifacts/` folder
   - All other files
4. Drag them into the GitHub upload area
5. Add a commit message: "Initial garden upload"
6. Click **Commit changes**

#### Option B: Command Line (If you have git installed)

```bash
# Navigate to the garden folder
cd 3-hours-with-Kimi

# Initialize git
git init
git add .
git commit -m "Initial garden upload"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/three-hours-garden.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. In your repo, click **Settings** (top tab)
2. Scroll down to **Pages** (left sidebar)
3. Under **Build and deployment**:
   - Source: Select **Deploy from a branch**
   - Branch: Select **main** (or **master**)
   - Folder: Select **/(root)**
4. Click **Save**

### Step 4: Wait & Visit

1. Wait 1-2 minutes for deployment
2. GitHub will show you a green box with your URL:
   `https://yourusername.github.io/three-hours-garden/`
3. Click it or copy-paste into your browser
4. The garden should load!

---

## Troubleshooting

### "404 - File not found"

- Wait 2-3 minutes and refresh
- Check that `index.html` exists at the root of your repo
- Ensure GitHub Pages shows a green "Your site is published" message

### "Page shows but styling is broken"

- Make sure the `garden/` folder was uploaded correctly
- Check that `time.css` and `seeds.js` are in the `garden/` folder

### "Images/SVG not loading"

- Ensure the `artifacts/` folder was uploaded
- Check file paths are correct

---

## Testing Locally First

Before uploading, you can test locally:

```bash
# Navigate to the folder
cd 3-hours-with-Kimi

# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

Or simply double-click `index.html` to open in your browser.

---

## Custom Domain (Optional)

If you own a domain and want to use it:

1. In repo Settings → Pages → Custom domain
2. Enter your domain: `yourdomain.com`
3. Add a `CNAME` file to your repo with your domain
4. Configure DNS with your domain provider

See [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details.

---

## Updating the Garden

After making changes:

1. Go to your repo on GitHub
2. Click **Add file** → **Upload files**
3. Upload changed files
4. GitHub Pages will automatically update (takes 1-2 minutes)

---

## Sharing Your Garden

Once live, share your URL:
- Social media
- With friends
- On your portfolio
- Anywhere you like

The garden is yours to share freely.

---

## Need Help?

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Troubleshooting 404s](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#troubleshooting)

---

**Your garden is about to have visitors from around the world.** 🌱
