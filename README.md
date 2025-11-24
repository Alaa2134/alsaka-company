# Alsaka Company Website

Static web project containing multiple HTML pages (home, products, cart, profile, admin dashboard, etc.) along with a shared stylesheet and JavaScript.

## Directory Structure
- HTML pages: `*.html`
- Styles: `style.css`
- Scripts: `script.js`, `app.js`
- Assets: `images/`, `icons/`
- Git helper script: `setup-git.ps1`

## Getting Started
Open `index.html` in a browser or serve the folder with a simple HTTP server.

### Quick Local Preview (PowerShell)
```powershell
# Using Python (if installed)
python -m http.server 8080
# Then visit: http://localhost:8080
```

## Git Setup
You can either run the provided PowerShell script or do it manually.

### Option 1: Script
1. Create an empty repo on GitHub (no README) named `alsaka-company`.
2. Edit `setup-git.ps1` and replace `USERNAME` in `$remoteUrl` with your GitHub username.
3. Run the script:
```powershell
powershell -ExecutionPolicy Bypass -File setup-git.ps1
```

### Option 2: Manual
```powershell
git init
git add .
git commit -m "Initial commit: Alsaka Company website"
git branch -M main
git remote add origin https://github.com/USERNAME/alsaka-company.git
git push -u origin main
```
Replace `USERNAME` with your GitHub username.

## Updating
After changes:
```powershell
git add .
git commit -m "Describe your change"
git push
```

## License
Specify a license if needed (e.g., MIT). Currently none declared.
