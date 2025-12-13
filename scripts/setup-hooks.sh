#!/bin/bash

# Setup Git hooks for local development
# Run this script after cloning the repository: bash scripts/setup-hooks.sh

set -e

echo "Setting up Git hooks..."

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy hooks from .githooks to .git/hooks
for hook in .githooks/*; do
    if [ -f "$hook" ]; then
        filename=$(basename "$hook")
        cp "$hook" ".git/hooks/$filename"
        chmod +x ".git/hooks/$filename"
        echo "✅ Installed: $filename"
    fi
done

# Configure Git to use custom hooks path (alternative method)
git config core.hooksPath .githooks

echo "✅ Git hooks setup complete!"
echo ""
echo "Next steps:"
echo "1. Hooks are now active in .git/hooks/"
echo "2. You can also use: git config core.hooksPath .githooks"
echo "3. Test by running: git push (on feature branch to avoid blocking main)"
