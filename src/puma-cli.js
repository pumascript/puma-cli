#!/usr/bin/env node
'use strict';
const program = require('commander');
const puma = require('pumascript');
const fs = require("fs");
const injector = require('./injector');



let run = (req, op) => {
    puma.evalPuma(fs.readFileSync(req, 'Utf8'));
}


let compile = (req, op) => {
    if (req.split('.')[1] !== 'puma') {
        console.log('this file not is pumascript file');
    } else {
        if (typeof (op.name) !== 'string') {
            op.name = req.split('.')[0] + '.js';
        } else {
            if (op.name.split('.')[1] !== 'js') op.name = op.name + '.js';
        }

        fs.readFile(req, 'Utf8', (err, data) => {
            if (err) console.log(err);
            let result = puma.evalPuma(data);
            fs.writeFile(op.name, result.output, 'Utf8', (err) => {
                if (err) console.log(err);
            })
        })
    }
}


let test = (req, op) => {   
    injector(req,op.outdir,op.outname);
}

program
    .version('0.1.0', '-v, --version')
    .command('run <dir>')
    .description(`It allows to execute a file with puma extension passing as parameter the address of the file.`)
    .action(run);

program
    .command('compile <dir>')
    .option('-n, --name <filename>', 'name javascript program')
    .description(`It allows to execute and compile a file with .puma extension to a JavaScript file.`)
    .action(compile);

program
    .command('test <dir>')
    .option('-o, --outdir <filedir>', 'location where you want to save the error file.')
    .option('-n, --outname <filename>', 'name of the file where you want to record the errors.')
    .description(`It allows testing in PumaScript a set of CDNs that are entered by means of a .json extension file, recording the errors found.`)
    .action(test);

program.parse(process.argv);

