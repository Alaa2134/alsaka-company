#!/bin/bash

# Alsaka Company - GitHub Setup Script
echo "Setting up Git repository for Alsaka Company..."

# Navigate to project directory
cd "$(dirname "$0")"

# Configure Git (update with your actual email)
echo "Configuring Git..."
git config --global user.name "ELSAKA"
git config --global user.email "elsaka@example.com"

# Initialize Git repository
echo "Initializing Git repository..."
git init

# Add all files
echo "Adding files..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Alsaka Company e-commerce website"

echo ""
echo "=========================================="
echo "Git repository initialized successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: alsaka-company"
echo "3. Keep it Public or Private (your choice)"
echo "4. DON'T check 'Initialize with README'"
echo "5. Click 'Create repository'"
echo ""
echo "Then run these commands (replace YOUR-USERNAME):"
echo ""
echo "git remote add origin https://github.com/YOUR-USERNAME/alsaka-company.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""
echo "Or if you want to use SSH:"
echo "git remote add origin git@github.com:YOUR-USERNAME/alsaka-company.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""

read -p "Press Enter to exit..."
