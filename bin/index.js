#!/usr/bin/env node

const program = require('commander');
const version = require('../lib/version');
const listFiles = require('../lib/list-xml');

program
    .usage('[option] <folder>')
    .option('-d --debug', '')
    .option('-v, --version', 'Show version', version, '')
    .option('-f, --file <file>', 'xml file regex')
    .option('-t, --template <template>')
    .option('-p, --property <property>', 'xml property')
    .action(listFiles)
    .parse(process.argv);

if (program.debug) console.log(program.opts());

