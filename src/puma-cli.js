#!/usr/bin/env node
'use strict';
const program = require('commander');
const puma = require('pumascript');
const fs = require("fs");
const injector = require('./injector');

let run = (req, op) => {
    try {
        puma.evalPuma(fs.readFileSync(req, 'Utf8'));
    } catch (error) {
        console.error(`ERROR [puma-cli <run>]: ${error.message}`);
    }
}

let compile = (req, op) => {
    let aux = req.split('.');   
    if (!aux.slice(1, aux.length).includes('puma')) {
        console.warn('The file entered does not have a .puma extension.');
    } else {
        if (typeof (op.name) !== 'string') {
            op.name = `${req.split('.')[0]}.js`;
        } else {
            if (op.name.split('.')[1] !== 'js') op.name = `${op.name}.js`;
        }
        fs.readFile(req, 'Utf8', (err, data) => {
            if (err) console.error(err);
            let result = puma.evalPuma(data);
            fs.writeFile(op.name, result.output, 'Utf8', (err) => {
                if (err) console.error(err);
            })
        })
    }
}

let test = (req, op) => {
    injector.testIntegration(req, op.outdir, op.outname);
}

program
    .version('1.0.0', '-v, --version')
    .command('run <dir>')
    .description(`It allows to execute a file with puma extension passing as parameter the address of the file.`)
    .action(run);

program
    .command('compile <dir>')
    .option('-n, --name <filename>', 'Name javascript program')
    .description(`It allows to execute and compile a file with .puma extension to a JavaScript file.`)
    .action(compile);

program
    .command('test <dir>')
    .option('-o, --outdir <filedir>', 'Location where you want to save the error file.')
    .option('-n, --outname <filename>', 'Name of the file where you want to record the errors.')
    .description(`It allows testing in PumaScript a set of CDNs that are entered by means of a .json extension file, recording the errors found.`)
    .action(test);

program.parse(process.argv);
