#!/usr/bin/env node

/**
 * Post-build script to set a specific language as the default active tab
 * in static HTML files.
 * 
 * Usage: node set-default-language.js <language>
 * Example: node set-default-language.js py
 * 
 * Valid languages: c, cpp, py, rs, ts
 */

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');

// Get target language from command line argument
const targetLanguage = process.argv[2]?.toLowerCase();

// Validate language
const validLanguages = ['c', 'cpp', 'py', 'rs', 'ts'];
if (!targetLanguage || !validLanguages.includes(targetLanguage)) {
  console.error('Error: Please specify a valid target language.');
  console.error('Usage: node set-default-language.js <language>');
  console.error('Valid languages:', validLanguages.join(', '));
  process.exit(1);
}

// Mapping from short codes to full names (for header language selector tabs)
const languageNameMap = {
  'c': 'C',
  'cpp': 'C++',
  'py': 'Python',
  'rs': 'Rust',
  'ts': 'TypeScript'
};

// Mapping from full names to short codes (for reverse lookup)
const languageCodeMap = {
  'C': 'c',
  'C++': 'cpp',
  'Python': 'py',
  'Rust': 'rs',
  'TypeScript': 'ts'
};

function setDefaultLanguage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Find tab containers that have language tabs (c, cpp, py, rs, ts)
  // We'll look for the pattern: tabs-container with tabs containing these values
  
  // Step 1: Find and reorder tabs to put target language first and make it active
  const tabListPattern = /(<ul[^>]*role="tablist"[^>]*class="tabs">)([\s\S]*?)(<\/ul>)/g;
  
  content = content.replace(tabListPattern, (match, openTag, tabContent, closeTag) => {
    // Check if this is a language selector tab list (either short codes or full names)
    const hasShortCodes = tabContent.match(/>\s*(c|cpp|py|rs|ts)\s*</i);
    const hasFullNames = tabContent.match(/>\s*(C|C\+\+|Python|Rust|TypeScript)\s*</);
    
    if (!hasShortCodes && !hasFullNames) {
      return match; // Not a language tab list
    }
    
    // Extract all tab items
    const tabItemPattern = /<li[^>]*role="tab"[^>]*>([^<]+)<\/li>/g;
    const tabs = [];
    let tabMatch;
    
    while ((tabMatch = tabItemPattern.exec(tabContent)) !== null) {
      const label = tabMatch[1].trim();
      // Normalize: convert to lowercase short code
      let normalizedValue = label.toLowerCase();
      // If it's a full name, convert to short code
      if (languageCodeMap[label]) {
        normalizedValue = languageCodeMap[label];
      }
      
      tabs.push({
        full: tabMatch[0],
        value: normalizedValue,
        originalLabel: label
      });
    }
    
    if (tabs.length === 0) return match;
    
    // Check if target language exists
    const targetTab = tabs.find(t => t.value === targetLanguage);
    if (!targetTab) return match;
    
    // Reorder: target language first, then others
    const otherTabs = tabs.filter(t => t.value !== targetLanguage);
    const reorderedTabs = [targetTab, ...otherTabs];
    
    // Rebuild tab list
    let newTabContent = '';
    reorderedTabs.forEach((tab, index) => {
      const isActive = tab.value === targetLanguage;
      // Update the tab HTML
      let tabHtml = tab.full;
      
      // Set active class
      if (isActive) {
        tabHtml = tabHtml.replace(/class="([^"]*)"/, (m, classes) => {
          const newClasses = classes.replace(/\s*tabs__item--active\s*/g, ' ').trim() + ' tabs__item--active';
          return `class="${newClasses}"`;
        });
        tabHtml = tabHtml.replace(/aria-selected="[^"]*"/, 'aria-selected="true"');
        tabHtml = tabHtml.replace(/tabindex="[^"]*"/, 'tabindex="0"');
      } else {
        tabHtml = tabHtml.replace(/\s*tabs__item--active\s*/g, ' ');
        tabHtml = tabHtml.replace(/aria-selected="[^"]*"/, 'aria-selected="false"');
        tabHtml = tabHtml.replace(/tabindex="[^"]*"/, 'tabindex="-1"');
      }
      
      newTabContent += tabHtml;
    });
    
    modified = true;
    return openTag + newTabContent + closeTag;
  });
  
  // Step 2: Find and reorder tabpanels to match the new tab order
  // Look for the tabpanel container that follows the tab list
  // We need to match the entire margin-top--md div by tracking nested divs
  // Use a while loop instead of replace to avoid issues with modifying content during iteration
  const tabpanelContainerPattern = /<div class="margin-top--md">/g;
  let lastIndex = 0;
  const replacements = [];
  
  while (true) {
    const match = tabpanelContainerPattern.exec(content);
    if (!match) break;
    
    const offset = match.index;
    
    // Check if this follows a language tab list (look backwards in content)
    const beforeMatch = content.substring(0, offset);
    if (!beforeMatch.match(/tabs__item[^>]*>\s*(c|cpp|py|rs|ts|C|C\+\+|Python|Rust|TypeScript)\s*</i)) {
      continue; // Not a language tabpanel container
    }
    
    // Find the matching closing tag for this margin-top--md div by tracking depth
    let depth = 1;
    let pos = offset + match[0].length;
    let closeTagPos = -1;
    
    while (pos < content.length && depth > 0) {
      const nextOpen = content.indexOf('<div', pos);
      const nextClose = content.indexOf('</div>', pos);
      
      if (nextClose === -1) break; // No more closing tags
      
      if (nextOpen !== -1 && nextOpen < nextClose) {
        // Found an opening tag before the closing tag - increase depth
        depth++;
        pos = nextOpen + 4;
      } else {
        // Found a closing tag
        depth--;
        if (depth === 0) {
          closeTagPos = nextClose;
          break;
        }
        pos = nextClose + 6;
      }
    }
    
    if (closeTagPos === -1) continue; // Couldn't find matching closing tag
    
    // Extract the panelsContent (everything between the opening and closing tags)
    const panelsContent = content.substring(offset + match[0].length, closeTagPos);
    const fullMatch = content.substring(offset, closeTagPos + 6);
    
    replacements.push({ offset, fullMatch, panelsContent, closeTagPos });
  }
  
  // Process replacements in reverse order to maintain correct offsets
  replacements.reverse().forEach(({ offset, fullMatch, panelsContent, closeTagPos }) => {
    
    // Extract all tabpanels
    // We need to match the entire tabpanel including nested content
    // Strategy: find opening tag, then match until we find the matching closing tag
    const panels = [];
    let searchStart = 0;
    
    while (true) {
      // Find the next tabpanel opening tag
      const openTagMatch = panelsContent.substring(searchStart).match(/<div([^>]*role="tabpanel"[^>]*)>/i);
      if (!openTagMatch) break;
      
      const openTagStart = searchStart + openTagMatch.index;
      const openTagEnd = openTagStart + openTagMatch[0].length;
      const attrs = openTagMatch[1];
      
      // Now find the matching closing tag by tracking nested divs
      let depth = 1;
      let pos = openTagEnd;
      let closeTagPos = -1;
      
      while (pos < panelsContent.length && depth > 0) {
        const nextOpen = panelsContent.indexOf('<div', pos);
        const nextClose = panelsContent.indexOf('</div>', pos);
        
        if (nextClose === -1) break; // No more closing tags
        
        if (nextOpen !== -1 && nextOpen < nextClose) {
          // Found an opening tag before the closing tag - increase depth
          depth++;
          pos = nextOpen + 4;
        } else {
          // Found a closing tag
          depth--;
          if (depth === 0) {
            closeTagPos = nextClose;
            break;
          }
          pos = nextClose + 6;
        }
      }
      
      if (closeTagPos === -1) break; // Couldn't find matching closing tag
      
      const fullMatch = panelsContent.substring(openTagStart, closeTagPos + 6);
      const content = panelsContent.substring(openTagEnd, closeTagPos);
      
      panels.push({
        full: fullMatch,
        attrs: attrs,
        content: content,
        detectedLang: null
      });
      
      searchStart = closeTagPos + 6;
    }
    
    if (panels.length === 0) {
      // No panels found, don't modify this container
      return;
    }
    
    // Language detection patterns
    const languagePatterns = {
      'c': /target\s+C\b/i,
      'cpp': /target\s+(Cpp|C\+\+)/i,
      'py': /target\s+(Python|py)\b/i,
      'rs': /target\s+(Rust|rs)\b/i,
      'ts': /target\s+(TypeScript|ts)\b/i
    };
    
    // Detect language for each panel
    panels.forEach(panel => {
      panel.detectedLang = null;
      for (const [lang, pattern] of Object.entries(languagePatterns)) {
        if (pattern.test(panel.content)) {
          panel.detectedLang = lang;
          break;
        }
      }
    });
    
    // Find target language panel
    const targetPanel = panels.find(p => p.detectedLang === targetLanguage);
    if (!targetPanel) {
      // No target panel found, don't modify this container
      return;
    }
    
    // Reorder: target language first, then others
    const otherPanels = panels.filter(p => p.detectedLang !== targetLanguage);
    const reorderedPanels = [targetPanel, ...otherPanels];
    
    // Rebuild tabpanels
    let newPanelsContent = '';
    reorderedPanels.forEach((panel, index) => {
      const isActive = panel.detectedLang === targetLanguage;
      let panelHtml = panel.full;
      
      if (isActive) {
        // Remove hidden attribute and style="display: none" from the opening tag only
        // Use a more precise approach: find the opening tag position and modify only that part
        const openTagMatch = panelHtml.match(/<div([^>]*role="tabpanel"[^>]*)>/i);
        if (openTagMatch) {
          const openTagStart = openTagMatch.index;
          const openTagEnd = openTagStart + openTagMatch[0].length;
          let attrs = openTagMatch[1];
          
          // Clean up only the attributes - remove hidden, style="display: none", and malformed attributes
          attrs = attrs.replace(/\s*hidden\s*/g, ' ')
                      .replace(/\s*style\s*=\s*["']display\s*:\s*none["']\s*/gi, ' ')
                      .replace(/\s*=\s*""\s*/g, ' ')
                      .replace(/[ \t]+/g, ' ')
                      .trim();
          
          // Ensure there's a space before attributes if attrs is not empty
          const attrsStr = attrs ? ' ' + attrs : '';
          
          // Reconstruct: opening tag (modified) + rest of content (unchanged)
          panelHtml = panelHtml.substring(0, openTagStart) + 
                     `<div${attrsStr}>` + 
                     panelHtml.substring(openTagEnd);
        }
      } else {
        // Add style="display: none" to hide inactive tabpanels (more reliable than hidden attribute)
        const openTagMatch = panelHtml.match(/<div([^>]*role="tabpanel"[^>]*)>/i);
        if (openTagMatch) {
          const openTagStart = openTagMatch.index;
          const openTagEnd = openTagStart + openTagMatch[0].length;
          let attrs = openTagMatch[1];
          
          // Check if already has display: none
          if (!attrs.match(/style\s*=\s*["'][^"']*display\s*:\s*none/i)) {
            // Clean up attributes first
            attrs = attrs.replace(/\s*hidden\s*/g, ' ')
                        .replace(/\s*=\s*""\s*/g, ' ')
                        .replace(/[ \t]+/g, ' ')
                        .trim();
            
            // Add style="display: none" with proper spacing
            const styleAttr = 'style="display: none"';
            const attrsStr = attrs ? attrs + ' ' + styleAttr : styleAttr;
            
            // Reconstruct with style="display: none"
            panelHtml = panelHtml.substring(0, openTagStart) + 
                       `<div ${attrsStr}>` + 
                       panelHtml.substring(openTagEnd);
          }
        }
      }
      
      newPanelsContent += panelHtml;
    });
    
    modified = true;
    const replacement = `<div class="margin-top--md">${newPanelsContent}</div>`;
    content = content.substring(0, offset) + replacement + content.substring(closeTagPos + 6);
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
      if (setDefaultLanguage(fullPath)) {
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

const languageName = languageNameMap[targetLanguage];

console.log(`Setting default language to ${languageName} (${targetLanguage}) in HTML files...`);
const fixedCount = processDirectory(buildDir);
console.log(`Updated ${fixedCount} HTML file(s).`);
