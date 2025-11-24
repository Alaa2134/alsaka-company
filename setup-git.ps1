# Usage:
# 1. Install Git from https://git-scm.com/download/win
# 2. Create a new empty repo on GitHub (do NOT add README) e.g. https://github.com/USERNAME/alsaka-company
# 3. Replace the placeholder in $remoteUrl below.
# 4. Right‑click this file > Run with PowerShell OR run: powershell -ExecutionPolicy Bypass -File setup-git.ps1
# 5. If remote already exists, script will skip adding.

$ErrorActionPreference = 'Stop'

Write-Host '== Alsaka Company Git Setup ==' -ForegroundColor Yellow

# Root of site (current directory assumed to be script location)
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

# --- CONFIG ---
$remoteUrl = 'https://github.com/USERNAME/alsaka-company.git'  # <-- REPLACE USERNAME
$initialMessage = 'Initial commit: Alsaka Company website'

if ($remoteUrl -like '*USERNAME*') {
    Write-Warning 'Please edit setup-git.ps1 and set $remoteUrl before running.'
    exit 1
}

# Ensure git exists
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error 'Git not found. Install Git first.'
    exit 1
}

# Initialize repo if needed
if (Test-Path .git) {
    Write-Host 'Git repository already initialized.' -ForegroundColor Green
} else {
    git init
    Write-Host 'Initialized new git repository.' -ForegroundColor Green
}

# Add all files
Write-Host 'Staging files...' -ForegroundColor Cyan
git add .

# Commit (only if no commits yet or there are staged changes)
$needCommit = $true
try {
    git rev-parse --verify HEAD > $null 2>&1
    # If there are staged changes, commit; otherwise skip
    $status = git diff --cached --name-only
    if ([string]::IsNullOrWhiteSpace($status)) { $needCommit = $false }
} catch { $needCommit = $true }

if ($needCommit) {
    git commit -m $initialMessage
    Write-Host 'Created commit.' -ForegroundColor Green
} else {
    Write-Host 'No staged changes to commit.' -ForegroundColor Yellow
}

# Add remote if missing
$hasOrigin = git remote | Select-String -Pattern '^origin$'
if (-not $hasOrigin) {
    git remote add origin $remoteUrl
    Write-Host 'Added remote origin.' -ForegroundColor Green
} else {
    Write-Host 'Remote origin already exists.' -ForegroundColor Yellow
}

# Set main branch
Write-Host 'Setting main branch...' -ForegroundColor Cyan
try { git branch -M main } catch { Write-Host 'Branch rename skipped.' -ForegroundColor Yellow }

# Push
Write-Host 'Pushing to origin/main...' -ForegroundColor Cyan
try {
    git push -u origin main
    Write-Host 'Push successful!' -ForegroundColor Green
} catch {
    Write-Error 'Push failed. Check remote URL or authentication.'
    Write-Host 'If credentials dialog appears, enter your GitHub username and PAT (not password).' -ForegroundColor Yellow
}

Write-Host 'Done.' -ForegroundColor Green
