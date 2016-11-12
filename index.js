#!/usr/bin/env node
'use strict';

const program = require('commander');
const git = require('./scripts/githelper');

const available_languages = {
  'javascript': '.js',
  'php': '.php',
  'perl': '.prl',
  'fortran': '.f',
  'python': '.py',
  'asp.net': '.aspx',
  'lua': '.lua',
  'f#': '.fs',
  'fsharp': '.fs',
  'html': '.html',
  'go': '.go',
  'java': '.java',
  'c++': '.cpp',
  'c': '.c' 
};

const extension_picker = function (language) {
  let extension;
  if (!language) extension = 'javascript';
  if (!available_languages[language]) extension = `.${language}`
  else extension = available_languages[language]

  return extension;
};

program
  .version(require('./package.json').version);


program
  .command('run [language]')
  .alias('r')
  .option('--noweekends', 'Include weekends?')
  .option('--random', 'Skip days randomly')
  .option('--even', 'Skip odd number days')
  .option('--odd', 'Skip even number days')
  .option('--days [number]', 'Specify number of days to make commits for')
  .description('Runs Greybeard script for 400 days on set language (default JavaScript)')
  .action((language, options) => {
    let extension = extension_picker(language.toLowerCase());
    git.rockon(extension, options);
  });

program.parse(process.argv);