'use strict';

const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const cwd = process.cwd();
const project_folder = path.join(cwd, 'project');
const ProgressBar = require('progress');
const colors = require('colors');
let bar;
let num = 1;
let DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ';
let contentLength;

const getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};



const again_and_again = function (extension, options) {
  let date = moment().subtract(num, 'days').format(DATE_RFC2822);
  let num_commits = getRandomIntInclusive(2, 10);
  let day_of_week = date.substring(0, 3);
  let num_day = date.substring(5,7);
  
  if (options.noweekends) {
    if (day_of_week === 'Sun' || day_of_week === 'Sat') num_commits = 0;  
  }

  if (options.random) {
    if (Math.random() >= 0.5) num_commits = 0;
  }

  if (options.odd) {
    if (Number(num_day) % 2 === 0) num_commits = 0; 
  }

  if (options.even) {
    if (Number(num_day) % 2 === 1) num_commits = 0;
  }

  if (options.powermode) {
    num_commits *= 2;
  }
  
  while (num_commits > 0) {
    fs.writeFileSync(path.join(project_folder, `script${num}${extension}`), `Rock on ${num * num_commits}!`); 
    execSync(`git add . && git commit -am "Rock on ${num * num_commits}!"`);
    execSync(`git commit --amend --no-edit --date="${date}"`);
    fs.removeSync(path.join(project_folder, `script${num}${extension}`));
    num_commits--;
  }
};

const initializeProgressbar = function (length) {
  bar = new ProgressBar('Rewriting History [:bar] :percent :etas', {
    complete: '='.green,
    incomplete: ' ',
    width: 50,
    total: Number(length)
  });
};

const rockon = function (extension, options) {
  if (options.days) contentLength = options.days;
  else contentLength = 400;

  execSync('git init');
  fs.mkdirsSync(project_folder);
  initializeProgressbar(contentLength);
  while(num < contentLength) {
    again_and_again(extension, options);
    if (!bar.complete) bar.tick();
    num++;
  }
};

module.exports = { rockon };