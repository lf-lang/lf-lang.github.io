#!/usr/bin/env node

/**
 * Post-build script to fix links in Docusaurus-generated HTML files
 * to work without a web server (file:// protocol).
 * 
 * This script converts directory links (ending with /) to explicit
 * index.html links so they work when opening HTML files directly.
 */

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');

function getRelativePath(fromFile, toPath) {
  // Convert absolute path to relative path
  // fromFile: absolute path to the current HTML file
  // toPath: absolute path or URL starting with /
  
  if (!toPath.startsWith('/')) {
    // Already relative, return as is
    return toPath;
  }
  
  // Remove leading slash and build directory path
  const toPathRelative = toPath.substring(1);
  const fromDir = path.dirname(path.relative(buildDir, fromFile));
  
  // Calculate relative path
  if (fromDir === '.') {
    return toPathRelative;
  }
  
  const fromParts = fromDir.split(path.sep).filter(p => p !== '.');
  const toParts = toPathRelative.split('/').filter(p => p !== '');
  
  // Find common prefix
  let commonLength = 0;
  while (commonLength < fromParts.length && 
         commonLength < toParts.length && 
         fromParts[commonLength] === toParts[commonLength]) {
    commonLength++;
  }
  
  // Build relative path
  const upLevels = fromParts.length - commonLength;
  const downPath = toParts.slice(commonLength).join('/');
  const relativePath = '../'.repeat(upLevels) + (downPath || 'index.html');
  
  return relativePath || 'index.html';
}

function fixLinksInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern 1: href="/path/to/dir/" -> href="relative/path/to/dir/index.html"
  // Pattern 2: href="/path/to/dir" (no trailing slash) -> href="relative/path/to/dir/index.html" (if it's a directory)
  // Pattern 3: href="relative/path/to/dir/" -> href="relative/path/to/dir/index.html"
  // Pattern 4: href="relative/path/to/dir" -> href="relative/path/to/dir/index.html"
  
  // We need to be careful not to break:
  // - External links (http://, https://, mailto:, etc.)
  // - Anchor links (#)
  // - Links to files with extensions (.css, .js, .png, etc.)
  // - Data URLs and other special protocols

  // Replace href attributes that point to directories
  // Match: href="/path/" or href="path/" or href="/path" or href="path"
  // But exclude: external URLs, anchors, files with extensions, data URLs
  
  const hrefPattern = /href=(["'])((?:(?!\1)[^#?])+?)(\/?)(\1)/g;
  
  content = content.replace(hrefPattern, (match, quote, url, trailingSlash, endQuote) => {
    // Skip external URLs
    if (url.match(/^(https?:|mailto:|tel:|data:|#)/)) {
      return match;
    }
    
    // Convert absolute asset paths to relative (but keep .html handling separate)
    if (url.match(/\.[a-zA-Z0-9]+$/) && !url.endsWith('.html')) {
      // Asset file (CSS, JS, images, etc.) - convert absolute to relative
      if (url.startsWith('/')) {
        const relativeUrl = getRelativePath(filePath, url);
        modified = true;
        return `href=${quote}${relativeUrl}${endQuote}`;
      }
      return match;
    }
    
    // Skip URLs that have query parameters or fragments (we'll handle those separately)
    if (url.includes('?') || url.includes('#')) {
      return match;
    }
    
    // If URL ends with /, replace with /index.html
    // If URL doesn't end with / and doesn't have an extension, add /index.html
    let newUrl = url;
    if (url.endsWith('/')) {
      newUrl = url + 'index.html';
    } else if (!url.match(/\.[a-zA-Z0-9]+$/)) {
      // No extension, so it's likely a directory
      newUrl = url + '/index.html';
    } else {
      return match; // Has extension, leave as is
    }
    
    // Convert absolute paths to relative paths for file:// protocol support
    if (newUrl.startsWith('/')) {
      newUrl = getRelativePath(filePath, newUrl);
    }
    
    modified = true;
    return `href=${quote}${newUrl}${endQuote}`;
  });

  // Also fix src attributes for similar cases (though less common)
  const srcPattern = /src=(["'])((?:(?!\1)[^#?])+?)(\/?)(\1)/g;
  
  content = content.replace(srcPattern, (match, quote, url, trailingSlash, endQuote) => {
    // Skip external URLs
    if (url.match(/^(https?:|data:)/)) {
      return match;
    }
    
    // Skip URLs that already have file extensions
    if (url.match(/\.[a-zA-Z0-9]+$/)) {
      // Convert absolute paths to relative paths
      if (url.startsWith('/')) {
        const relativeUrl = getRelativePath(filePath, url);
        modified = true;
        return `src=${quote}${relativeUrl}${endQuote}`;
      }
      return match;
    }
    
    // Skip URLs that have query parameters
    if (url.includes('?')) {
      return match;
    }
    
    let newUrl = url;
    if (url.endsWith('/')) {
      newUrl = url + 'index.html';
    } else if (!url.match(/\.[a-zA-Z0-9]+$/)) {
      newUrl = url + '/index.html';
    } else {
      return match;
    }
    
    // Convert absolute paths to relative paths for file:// protocol support
    if (newUrl.startsWith('/')) {
      newUrl = getRelativePath(filePath, newUrl);
    }
    
    modified = true;
    return `src=${quote}${newUrl}${endQuote}`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let fixedCount = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      fixedCount += processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      if (fixLinksInFile(fullPath)) {
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

console.log('Fixing links in HTML files for static file serving...');
const fixedCount = processDirectory(buildDir);
console.log(`Fixed links in ${fixedCount} HTML file(s).`);

