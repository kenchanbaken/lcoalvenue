// https://github.com/cheeriojs/cheerio

// HOWTO:insatall on windows
//  1. install node.js,npm,vnm
//  2. Open Comand Prompt type this 
// npm install cheerio
// npm install -g cheerio

// 1.Hello
/*
const cheerio = require('cheerio');
const $ = cheerio.load('<h2 class="title">Hello world</h2>');
$('h2.title').text('Hello there!');
$('h2').addClass('welcome');
console.log($.html());
*/

// 2.Loading
// ES6 or TypeScript:
// Commonjsとして使う場合は拡張子.cjsを使う
/*
const cheerio = require('cheerio');
const $ = cheerio.load('<ul id="fruits">...</ul>');
console.log($.html());
*/

// moduleとして使う場合はpackage.jsonに"type": "module",を追加しておく。で以下を実行
/*
import * as cheerio from 'cheerio';
const $ = cheerio.load('<ul id="fruits">...</ul>');
console.log($.html());
*/


