#!/bin/bash

# Branch Cleanup Script
# All branches listed below are fully merged into main

echo "🧹 Cleaning up merged branches..."
echo ""

# Local branches to delete (all merged into main)
LOCAL_BRANCHES=(
  "batch-1-bootstrap-core-logic"
  "batch-2-backend-api-local"
  "batch-3-api-client-state"
  "batch-4-routing-steering"
  "batch-4-routing-styles"
  "batch-5-mvp-screens"
  "batch-6-ux-polish"
  "batch-7-e2e-smoke"
  "batch-8-deployment-config"
  "batch-9-final-validation"
  "development"
  "docs/cleanup-redundant-files"
  "feature/smooth-animations"
  "figma-design-tweaks"
  "login-screen"
  "project-organization"
  "star-lore-batch-3"
  "star-lore-batch-4"
  "star-lore-batch-5"
  "star-lore-batch-6"
  "star-lore-batch-7"
  "star-lore-batch-8"
  "star-lore-implementation"
  "ui-dossier"
  "ui-experiments"
)

echo "📍 Deleting ${#LOCAL_BRANCHES[@]} local branches..."
for branch in "${LOCAL_BRANCHES[@]}"; do
  git branch -d "$branch" 2>/dev/null && echo "  ✓ Deleted: $branch" || echo "  ⚠ Skipped: $branch"
done

echo ""
echo "🌐 Deleting remote branches..."
for branch in "${LOCAL_BRANCHES[@]}"; do
  git push origin --delete "$branch" 2>/dev/null && echo "  ✓ Deleted remote: $branch" || echo "  ⚠ Skipped remote: $branch"
done

echo ""
echo "🧼 Pruning remote references..."
git remote prune origin

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Remaining branches:"
git branch -a
