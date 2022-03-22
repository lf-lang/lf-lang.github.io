/**
 * This file contains a Node.js program to preprocess markdown files that use
 * specialized annotations for Lingua Franca documentation.
 * 
 * @author Edward A. Lee
 */

const fs = require('fs');
const path = require('path');
const { exit } = require("process");

/** Regular expression that matches $start(name)$. */
const startMatcher = new RegExp('\\$start\\((.*)\\)\\$');

/** Regular expression that matches $end(name)$. */
const endMatcher = new RegExp('\\$end\\((.*)\\)\\$');

/**
 * Given the content of a markdown file, search for single-line annotations of the form
 * $start(name)$ and $end(name)$ and replace code blocks in between the two with
 * source code retrieved from source files.  If any non-blank line between the two
 * is not within a code block, then the operation is cancelled and further text is unchanged.
 * If any source file is not found, this will
 * insert a default error text ahead of whatever code is already specified.
 * @param body The text of a markdown file.
 */
const updateCodeblocksFromSource = (body) => {
  var mode = 'text';
  var programName = null;
  var result = '';
  var lineCount = 0;
  const lines = body.split(/\r?\n/);
  lines.forEach(line =>  {
    lineCount++;
    // If the mode is not 'swallow', then echo the current line to the output.
    if (mode != 'swallow') {
      result += line;
      // Do not add a newline on the last line.
      if (lineCount < lines.length) result += "\n";
    }
    if (mode == 'text') {
      var match = line.match(startMatcher);
      if (match) {
        programName = match[1];
        mode = 'code'
      }
    } else if (mode == 'swallow') {
      // Check for end of code block.
      if (line.match(/^```$/)) {
        mode = 'code';
        result += line + "\n"; // Do not swallow the close of the code block.
      }
    } else if (mode == 'echocode') {
      // Check for end of code block.
      if (line.match(/^```$/)) mode = 'code';
    } else if (mode == 'code') {
      // Check for the beginning of a code block.
      var lang = line.match(/^```lf-(.+)$/);
      if (lang) {
        var filename = "../code/" + lang[1] + "/src/" + programName + ".lf";
        try {
          const code = fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');
          if (code) {
            // Write the code line by line to ensure correct line breaks.
            code.split(/\r?\n/).forEach(codeLine => {
              result += codeLine + "\n";
            })
            mode = 'swallow';
          } else {
            // This should probably not happen.
            result += "WARNING: file read returned null!\n";
            mode = 'echocode';
          }
        } catch(error) {
            // If no source file is found, then insert a warning and echo the code.
            const message = "WARNING: No source file found: " + filename;
            console.log(message);
            result += message + "\n";
            mode = 'echocode';
        }
      } else if (line.match(endMatcher)) {
        mode = 'text';
      }
    }
  });
  return result;
}

if (!(process.argv.length >= 3)) {
  console.log("Usage: node preprocessMarkdown.js [markdown_files]");
  exit(1);
}

for (let i = 2; i < process.argv.length; i++) {
  console.log("*** Reading: " + process.argv[i]);
  const allFileContents = fs.readFileSync(process.argv[i], 'utf-8');
  const newFileContents = updateCodeblocksFromSource(allFileContents);
  fs.writeFileSync(process.argv[i], newFileContents);
  console.log("*** Successfully updated " + process.argv[i]);
}
