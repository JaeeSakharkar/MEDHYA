# Simple Deployment Guide - No AWS Permissions Required

Since you're using AWS Academy/Learner Lab with restricted permissions, let's use the simplest approach that works with your constraints.

## 🎯 Solution: Pure Frontend + Manual Data Management

### Architecture
```
React App (Static Files) + LocalStorage (Data) + Manual Export/Import
```

## Step 1: Use GitHub Pages (Free Hosting)

Since AWS permissions are limited, let's use GitHub Pages for hosting:

### 1.1 Push to GitHub
```bash
git add .
git commit -m "QuizMaster V2 - LocalStorage version"
git push origin main
```

### 1.2 Enable GitHub Pages
1. Go to your GitHub repo → Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `docs` (we'll create this)
4. Save

### 1.3 Create GitHub Pages Build
```bash
# Build for production
cd frontend
npm run build

# Copy dist to docs folder (GitHub Pages)
mkdir ../docs
cp -r dist/* ../docs/

# Commit and push
git add ../docs
git commit -m "Add GitHub Pages build"
git push origin main
```

## Step 2: Update Cognito URLs

Update your Cognito App Client with GitHub Pages URL:

**Callback URLs:**
```
https://your-username.github.io/your-repo-name/callback
```

**Sign out URLs:**
```
https://your-username.github.io/your-repo-name/login
```

## Step 3: Update Frontend Environment

Update `frontend/.env.production`:

```env
# GitHub Pages URLs
VITE_REDIRECT_URI=https://your-username.github.io/your-repo-name/callback
VITE_LOGOUT_URI=https://your-username.github.io/your-repo-name/login

# No backend needed
VITE_API_BASE_URL=http://localhost:5000

# Cognito settings (keep existing)
VITE_COGNITO_DOMAIN=medhya.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=6npa9g9it0o66diikabm29j9je
```

## Step 4: Data Management Features

Add data export/import functionality to your app:

### 4.1 Export Data Button
```typescript
const exportData = () => {
  const data = {
    quizzes: quizStorage.getAll(),
    questions: questionStorage.getByQuizId('all'), // Get all questions
    scores: scoreStorage.getAll(),
    users: userStorage.getAll(),
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quizmaster-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};
```

### 4.2 Import Data Button
```typescript
const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      
      // Import data to localStorage
      localStorage.setItem('quizmaster_quizzes', JSON.stringify(data.quizzes || []));
      localStorage.setItem('quizmaster_questions', JSON.stringify(data.questions || []));
      localStorage.setItem('quizmaster_scores', JSON.stringify(data.scores || []));
      localStorage.setItem('quizmaster_users', JSON.stringify(data.users || []));
      
      alert('Data imported successfully!');
      window.location.reload();
    } catch (error) {
      alert('Error importing data: ' + error.message);
    }
  };
  reader.readAsText(file);
};
```

## Step 5: Alternative Hosting Options

If GitHub Pages doesn't work with Cognito:

### Option A: Netlify (Free)
1. Connect your GitHub repo to Netlify
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/dist`
4. Update Cognito URLs with Netlify domain

### Option B: Vercel (Free)
1. Connect your GitHub repo to Vercel
2. Framework preset: Vite
3. Root directory: `frontend`
4. Update Cognito URLs with Vercel domain

### Option C: Firebase Hosting (Free)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Deploy: `firebase deploy`
4. Update Cognito URLs with Firebase domain

## Step 6: Manual S3 Upload (If You Get Permissions)

If you eventually get S3 permissions, manually upload these files:

### Upload to S3 Bucket:
```
📁 S3 Bucket/
├── 📁 assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── index.html
├── favicon.ico
└── ...other files from frontend/dist/
```

### S3 Bucket Settings:
- **Static website hosting**: Enabled
- **Index document**: `index.html`
- **Error document**: `index.html`
- **Block public access**: Disabled
- **Bucket policy**: Public read access

## Benefits of This Approach

✅ **No AWS Permissions Required** - Works with any hosting
✅ **Free Hosting** - GitHub Pages, Netlify, Vercel are free
✅ **Data Portability** - Export/import your data anytime
✅ **Simple Deployment** - Just push to GitHub
✅ **Still Secure** - Cognito handles authentication
✅ **Offline Capable** - Works without internet after first load

## Limitations

❌ **No Real-time Sync** - Data is per-browser
❌ **Manual Backup** - Need to export data manually
❌ **Single User** - Each browser has its own data

## Data Backup Strategy

1. **Regular Exports**: Export data weekly/monthly
2. **Version Control**: Keep exported JSON files in Git
3. **Multiple Browsers**: Import data to different browsers as needed
4. **Cloud Storage**: Store exported files in Google Drive/Dropbox

This approach gives you a fully functional quiz app without any AWS permission issues!