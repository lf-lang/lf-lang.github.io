import re
import os, sys

# The directory to start searching from
search_dir = "."

# File containing the permalinks and file paths
permalinks_file = "permalinks.txt"

# Read permalinks and file paths into a dictionary
permalink_dict = {}
with open(permalinks_file, 'r') as f:
    for line in f.readlines():
        file_path, permalink = line.strip().split(' : permalink: ')
        # Standardize to remove leading `/` and potential differences
        normalized_permalink = '/docs/handbook/' + permalink.split('/docs/handbook/')[1]
        permalink_dict[normalized_permalink] = f"<{file_path}>"
        print(normalized_permalink, file_path)

# Function to replace permalinks with file paths in MDX files
def replace_permalinks(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.mdx'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as mdx_file:
                    content = mdx_file.read()

                # Replace all permalinks in content
                modified = False
                for permalink in permalink_dict.keys():
                    # Regular expression pattern to capture links and optional anchors
                    link_pattern = re.compile(r'\[([^\]]+)\]\(' + re.escape(permalink) + r'(#[^)]*)?\)')
                    matches = link_pattern.findall(content)

                    if matches:
                        modified = True
                        # We need to get the relative path from current file to target MDX file
                        relative_mdx_path = os.path.relpath(permalink_dict[permalink], root)
                        
                        # Replace function that includes the anchor if it exists
                        def replace_link_with_anchor(match):
                            anchor = match.group(2) if match.group(2) else ''
                            return f'[{match.group(1)}](./{relative_mdx_path}{anchor})'
                        
                        content = link_pattern.sub(replace_link_with_anchor, content)

                # Save the file only if modifications were made
                if modified:
                    with open(file_path, 'w') as mdx_file:
                        mdx_file.write(content)

replace_permalinks(search_dir)