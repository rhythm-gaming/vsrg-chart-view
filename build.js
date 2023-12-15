// @ts-check

import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Builder } from "./scripts/builder.js";

import { default as parseArgs } from 'args-parser';

/** @type {any} */
const args = parseArgs(process.argv);

if(args.sourcemap === 'true') args.sourcemap = true;
if(args.sourcemap === 'false') args.sourcemap = false;

async function main() {
    try {
        const builder = new Builder(args);
        await builder.run();
        process.exit(0);
    } catch(e) {
        console.error("ERROR:", e);
        process.exit(1);
    }
}

process.chdir(path.dirname(fileURLToPath(import.meta.url)));
main();