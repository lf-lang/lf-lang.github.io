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

function setDefaultLanguage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Find tab containers that have language tabs (c, cpp, py, rs, ts)
  // We'll look for the pattern: tabs-container with tabs containing these values
  
  // Step 1: Find and reorder tabs to put target language first and make it active
  const tabListPattern = /(<ul[^>]*role="tablist"[^>]*class="tabs">)([\s\S]*?)(<\/ul>)/g;
  
  content = content.replace(tabListPattern, (match, openTag, tabContent, closeTag) => {
    // Check if this is a language selector tab list
    if (!tabContent.match(/>\s*(c|cpp|py|rs|ts)\s*</i)) {
      return match; // Not a language tab list
    }
    
    // Extract all tab items
    const tabItemPattern = /<li[^>]*role="tab"[^>]*>([^<]+)<\/li>/g;
    const tabs = [];
    let tabMatch;
    
    while ((tabMatch = tabItemPattern.exec(tabContent)) !== null) {
      tabs.push({
        full: tabMatch[0],
        value: tabMatch[1].trim().toLowerCase()
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
  const tabpanelContainerPattern = /<div class="margin-top--md">([\s\S]*?)<\/div>\s*<\/div>/g;
  
  content = content.replace(tabpanelContainerPattern, (match, panelsContent) => {
    // Check if this follows a language tab list (look backwards in content)
    const beforeMatch = content.substring(0, content.indexOf(match));
    if (!beforeMatch.match(/tabs__item[^>]*>\s*(c|cpp|py|rs|ts)\s*</i)) {
      return match; // Not a language tabpanel container
    }
    
    // Extract all tabpanels
    const tabpanelPattern = /<div([^>]*role="tabpanel"[^>]*)>([\s\S]*?)<\/div>/g;
    const panels = [];
    let panelMatch;
    
    while ((panelMatch = tabpanelPattern.exec(panelsContent)) !== null) {
      const attrs = panelMatch[1];
      const content = panelMatch[2];
      panels.push({
        full: panelMatch[0],
        attrs: attrs,
        content: content,
        detectedLang: null
      });
    }
    
    if (panels.length === 0) return match;
    
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
    if (!targetPanel) return match;
    
    // Reorder: target language first, then others
    const otherPanels = panels.filter(p => p.detectedLang !== targetLanguage);
    const reorderedPanels = [targetPanel, ...otherPanels];
    
    // Rebuild tabpanels
    let newPanelsContent = '';
    reorderedPanels.forEach((panel, index) => {
      const isActive = panel.detectedLang === targetLanguage;
      let panelHtml = panel.full;
      
      if (isActive) {
        // Remove hidden attribute and clean up any malformed attributes
        panelHtml = panelHtml.replace(/\s*hidden\s*/g, ' ')
                             .replace(/\s*=\s*""\s*/g, ' ')
                             .replace(/\s+/g, ' ')
                             .trim();
      } else {
        // Add hidden attribute if not present
        if (!panelHtml.includes('hidden')) {
          panelHtml = panelHtml.replace(/<div([^>]*role="tabpanel")/i, '<div$1 hidden');
        }
      }
      
      newPanelsContent += panelHtml;
    });
    
    modified = true;
    return `<div class="margin-top--md">${newPanelsContent}</div></div>`;
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

const languageName = {
  'c': 'C',
  'cpp': 'C++',
  'py': 'Python',
  'rs': 'Rust',
  'ts': 'TypeScript'
}[targetLanguage];

console.log(`Setting default language to ${languageName} (${targetLanguage}) in HTML files...`);
const fixedCount = processDirectory(buildDir);
console.log(`Updated ${fixedCount} HTML file(s).`);
