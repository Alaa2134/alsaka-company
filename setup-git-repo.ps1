# Alsaka Company - GitHub Setup Script
Write-Host "Setting up Git repository for Alsaka Company..." -ForegroundColor Green

# Configure Git
Write-Host "`nConfiguring Git..." -ForegroundColor Yellow
git config --global user.name "ELSAKA"
git config --global user.email "elsaka@github.com"

# Initialize Git repository
Write-Host "Initializing Git repository..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "Adding files..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Alsaka Company e-commerce website"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Git repository initialized successfully!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Repository is ready! Now I need your GitHub username to complete the upload." -ForegroundColor Cyan
