#!/usr/bin/env bash

# Configuration
SOURCE_REPO="flixlix/power-flow-card-plus"
DEST_REPO="flixlix/flixlix-cards"
LABEL_TO_ADD="card:power-flow-card-plus"
DRY_RUN=false # Set to false to actually run

echo "Fetching issues from $SOURCE_REPO..."
issues=$(gh issue list --repo "$SOURCE_REPO" --limit 1000 --json number --jq '.[].number')

if [ -z "$issues" ]; then
    echo "No open issues found in $SOURCE_REPO."
    exit 0
fi

for issue in $issues; do
  if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN] Would transfer issue #$issue to $DEST_REPO and add label '$LABEL_TO_ADD'"
  else
    echo "Transferring issue #$issue..."
    
    # Transfer the issue and capture the new URL output
    # Example output: https://github.com/owner/monorepo/issues/34
    NEW_URL=$(gh issue transfer "$issue" "$DEST_REPO" --repo "$SOURCE_REPO")
    
    if [ $? -eq 0 ]; then
      # Extract the new issue number from the end of the URL
      NEW_NUMBER=$(echo "$NEW_URL" | grep -oE '[0-9]+$')
      
      echo "Transferred #$issue -> $DEST_REPO#$NEW_NUMBER"
      
      # Brief pause for GitHub indexing
      sleep 1
      
      # Add the label using the NEW number
      gh issue edit "$NEW_NUMBER" --add-label "$LABEL_TO_ADD" --repo "$DEST_REPO"
    else
      echo "Failed to transfer issue #$issue"
    fi
    
    echo "----------------------------"
  fi
done