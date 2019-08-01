import { ncp } from 'ncp';
import * as fs from 'fs';
import { execSync } from 'child_process';
import program from 'commander';
import path from 'path';

program.option('-s, --step <type>', 'build step')
program.parse(process.argv);

switch (program.step) {
    case "prebuild": {
        prebuild();
        break;
    }
    case "build": {
        build();
        break;
    }
    case "postbuild": {
        postbuild();
        break;
    }
}

function prebuild() {
    if (!fs.existsSync("./build")) {
        fs.mkdirSync("./build")
    }
}

function build() {
}

function postbuild() {
    var findRemoveSync = require('find-remove')
    var result = findRemoveSync('./src', { extensions: ['.js'] })
    fs.writeFileSync("./build/package.json", fs.readFileSync("./package.json"))
}