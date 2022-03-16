/**
 * This file contains Lingua Franca definitions and utility functions used in generating
 * documentation pages by the gatsby infrastructure.
 * 
 * @author Edward A. Lee
 */

/******** Constants defining policies and language features. */

/** Lingua Franca keywords in alphabetical order. */
const keywords = [
  "action", "after", "as", "at",
  "const", 
  "deadline", 
  "federated", "from", 
  "import", "initial", "input", "interleaved", 
  "logical", 
  "main", "method", "mode", "msec", "msecs", "mutable", "mutation", 
  "new", 
  "output", 
  "physical", "preamble",
  "reaction", "reactor", "realtime", 
  "sec", "secs", "shutdown", "startup", "state",
  "target", "timer", "time", 
  "usec", "usecs", 
  "widthof",
]

/** Dictionary of features with a list of targets that support the feature. */
const supportingTargets = {
  "federated": ["lf-c", "lf-py", "lf-ts"],
}

/** Text used on multiple web pages. */

const textSubstitutions = {
  "page-showing-target" : `
This page is showing examples in the target language 
  [C]{lf-c}
  [C++]{lf-cpp}
  [Python]{lf-py}
  [TypeScript]{lf-ts}
  [Rust]{lf-rs}.
You can change the target language in left sidebar.`,
}

/******** Regex patterns. */

/** Regular expression that matches LF keywords that are whole words. */
const keywordMatcher = new RegExp('\\b(?:' + keywords.join('|') + ')\\b');
// NOTE: The ?: means that the pattern is not captured, even though it is parentheses.

/** Regular expression that matches LF keywords surrounded by a delimitter $. */
const delimitedKeywordMatcher = new RegExp('\\$(' + keywords.join('|') + ')\\$', 'gm');

/** Regular expression that matches text substitution name surrounded by a delimitter $. */
const textSubstitutionsMatcher = new RegExp('\\$(' + Object.keys(textSubstitutions).join('|') + ')\\$', 'gm');

/** Regular expression that matches "[ p1 ]{ p2 }", where p1 and p2 are arbitrary strings. */
const spanMatcher = /\[([^\]]*)\]\{([^\}]*)\}/gm

/******** Functions used internally and not exported. */

/**
 * Return an HTML <span> with classes given by p2 and body given by p1.
 * If any class given in p2 has an entry in supportingTargets, then that class name
 * is replaced with the list of class names given by supportingTargets.
 * @param {*} match The matching string, including delimitters.
 * @param {*} p1 The substring containing the body.
 * @param {*} p2 The substring containing the class list (separated by spaces).
 */
 function spanClassifier(match, p1, p2) {
   var classes = p2.split(' ');
   var newClasses = [];
   for (c of classes) {
    if (supportingTargets[c]) {
      Array.prototype.push.apply(newClasses, supportingTargets[c]);
    } else {
      newClasses.push(c);
    }
   }
  const result = "<span class=\"" + newClasses.join(" ") + "\">" + p1 + "</span>"
  return result;
}

/**
 * Return an HTML span of class "lf_keywords" with the body given by p1.
 * @param {*} match The matching string, including delimitters.
 * @param {*} p1 The substring containing the keyword.
 */
function delimitedKeywordReplacer(match, p1) {
  return "<span class=\"lf_keywords\">" + p1 + "</span>"
}

/**
 * Return the text defined by the name given by p1.
 * @param {*} match The matching string, including delimitters.
 * @param {*} p1 The name of the textSubstitutions key.
 */
 function textSubstitutionsReplacer(match, p1) {
   if (textSubstitutions[p1]) {
    return textSubstitutions[p1];
   } else {
     return '<span class="web-page-error">ERROR: textSubstitutions key not found.</span>';
   }
}

/******** Functions exported. */

/**
 * Given HTML to render, process it with any specific Lingua Franca modifications.
 * These include:
 * - Replacing $k$ with a span of class "lf_keyword" when k is an LF keyword.
 * - Replacing [ p1 ]{ p2 } with a span of class(es) p2 and body p1.
 * 
 * @param {*} html The HTML to process.
 * @returns Possibly modified HTML.
 */
const postProcessHTML = (html) => {
  var result = html.replace(textSubstitutionsMatcher, textSubstitutionsReplacer);
  result = result.replace(spanMatcher, spanClassifier);
  result = result.replace(delimitedKeywordMatcher, delimitedKeywordReplacer);
  return result;
}

/********* Module exports. */
module.exports = {
  postProcessHTML: postProcessHTML,
  keywordMatcher: keywordMatcher,
}
