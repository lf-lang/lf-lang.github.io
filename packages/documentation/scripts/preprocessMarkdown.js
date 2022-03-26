/**
 * This file contains a Node.js program to preprocess markdown files that use
 * specialized annotations for Lingua Franca documentation.
 * 
 * @author Edward A. Lee
 */

/* Supported target languages. */
const targetLanguages = ["c", "cpp", "py", "ts", "rs"];

const fs = require('fs');
const path = require('path');
const { exit } = require("process");

/** Regular expression that matches $insert(name)$. */
const insertMatcher = new RegExp('\\$insert\\((.*)\\)\\$');

/** Regular expression that matches $start(name)$. */
const startMatcher = new RegExp('\\$start\\((.*)\\)\\$');

/** Regular expression that matches $end(name)$. */
const endMatcher = new RegExp('\\$end\\((.*)\\)\\$');

/**
 * Return the code block matching the specified target language and program name.
 * @param target The target language.
 * @param programName The program name. 
 * @throws Exception if no matching file is found. 
 */
const readSourceFile = (target, programName) => {
  var result = "";
  var filename = "../code/" + target + "/src/" + programName + ".lf";
  try {
    const code = fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');
    if (code) {
      // Write the code line by line to ensure correct line breaks.
      code.split(/\r?\n/).forEach(codeLine => {
        result += codeLine + "\n";
      })
    } else {
      // This should probably not happen.
      throw("WARNING: File read returned null: " + filename);
    }
  } catch(error) {
      // If no source file is found, then insert a warning and echo the code.
      throw("WARNING: No source file found: " + filename);
  }
  return result;
}

/**
 * Given the content of a markdown file, search for single-line annotations of the form
 * `$insert(name)$` or delimiter lines `$start(name)$` and `$end(name)$` and insert or replace
 * code blocks with source code found in files located in
 * `packages/documentation/code/T/src`, where `T` is one of the target languages
 * in targetLanguages and `
 * 
 * If the line found is a line by itself of the form `$insert(name)$`, then replace that line
 * with with the delimited form starting with `$start(name)$` and ending with `$end(name)$`
 * and automatically insert all the code blocks for target laguages in targetLanguages.
 * 
 * If the lines found are the delimiter lines `$start(name)$` and `$end(name)$`, then
 * any code blocks in between these delimiters will be replaced with updated code in the
 * `packages/documentation/code/T/src` directory.
 * 
 * In both cases, if any target language is missing a file in the
 * `packages/documentation/code/T/src` directory, then this function will insert
 * a default error message.
 *
 * @param body The text of a markdown file.
 */
const updateCodeblocksFromSource = (body) => {
  var mode = 'text';
  var programName = null;
  var result = '';
  var lineCount = 0;
  var remainingTargets;

  const lines = body.split(/\r?\n/);
  lines.forEach(line =>  {
    lineCount++;

    var insertMatch = line.match(insertMatcher);
    var endMatch = line.match(endMatcher);

    if (mode != 'swallow' && mode != 'echocode' && !insertMatch && !endMatch) {
      result += line;
      // Do not add a newline on the last line.
      if (lineCount < lines.length) result += "\n";
    }
    if (mode == 'text') {
      var match = line.match(startMatcher);
      if (match) {
        mode = 'code'
        programName = match[1];
        remainingTargets = [...targetLanguages];
      } else {
        if (insertMatch) {
          programName = insertMatch[1];
          result += "$start(" + programName + ")$\n\n";
          for (var i = 0; i < targetLanguages.length; i++) {
            result += "```lf-" + targetLanguages[i] + "\n"
            try {
              result += readSourceFile(targetLanguages[i], programName);
            } catch (error) {
              console.log(error);
              result += error + "\n";
            }
            result += "```\n\n"
          }
          result += "$end(" + programName + ")$\n\n";
        }
      }
    } else if (mode == 'swallow') {
      // Check for end of code block.
      if (line.match(/^```$/)) {
        mode = 'code';
        result += line + "\n"; // Do not swallow the close of the code block.
      }
    } else if (mode == 'echocode') {
      // Swallow previously generated warnings.
      if (!line.match(/^WARNING: No source file found:/)) {
        result += line + "\n";
      }
      // Check for end of code block.
      if (line.match(/^```$/)) mode = 'code';
    } else if (mode == 'code') {
      // Check for the beginning of a code block.
      var lang = line.match(/^```lf-(.+)$/);
      if (lang) {
        const index = remainingTargets.indexOf(lang[1]);
        if (index >= 0) {
          remainingTargets.splice(index, 1);
        } else {
          console.log("WARNING: Unrecognized target language: " + lang[1]);
        }
        try {
          result += readSourceFile(lang[1], programName);
          mode = 'swallow';
        } catch(error) {
            // If no source file is found, then insert a warning and echo the code.
            console.log(error);
            result += error + "\n";
            mode = 'echocode';
        }
      } else if (endMatch) {
        // Insert any missing languages.
        console.log("**************** remaining: " + remainingTargets);
        remainingTargets.forEach((lang) => {
          result += "```lf-" + lang + "\n"
          try {
            result += readSourceFile(lang, programName);
          } catch (error) {
            console.log(error);
            result += error + "\n";
          }
          result += "```\n\n"
        })
        result += line;
        // Do not add a newline on the last line.
        if (lineCount < lines.length) result += "\n";

        mode = 'text';
        remainingTargets = [];
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
