#!/bin/bash

# The directory to start searching from
SEARCH_DIR="."

# Output file to save paths and permalinks
OUTPUT_FILE="permalinks.txt"

# Empty the output file if it exists
echo "" > "$OUTPUT_FILE"

# Find all .mdx files and extract the pathname and permalinks
find "$SEARCH_DIR" -type f -name "*.mdx" | while read -r FILE; do
    # Extract the permalink line from the file
    PERMALINK=$(grep "permalink:" "$FILE")
    
    # Check if a permalink was found
    if [[ -n "$PERMALINK" ]]; then
        # Write the file path and permalink to the output file
        echo "$FILE : $PERMALINK" >> "$OUTPUT_FILE"
    fi
done

echo "Permalinks have been extracted to $OUTPUT_FILE."