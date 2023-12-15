// @ts-check

import * as child_process from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import * as esbuild from 'esbuild';

/**
 * @typedef {{
 *  sourcemap: boolean|'linked'|'external'|'inline'|'both';
 *  target: 'module'|'serve';
 * }} BuildArgs
 */

/**
 * @param {Record<String, any>} args
 * @returns {string|null}
 */
function isValidArgs(args) {
    if(![false, true, 'linked', 'external', 'inline', 'both'].includes(args.sourcemap)) return "invalid sourcemap specified";
    if(!['module', 'serve'].includes(args.target)) return "invalid target specified";
    return null;
}

export class Builder {
    /** @type {BuildArgs} */
    args;

    /**
     * @param {Partial<BuildArgs>} args 
     */
    constructor(args) {
        this.args = {
            sourcemap: 'linked',
            target: 'module',
            ...args,
        };

        const err = isValidArgs(this.args);
        if(err != null) {
            console.error("ERROR:", err);
            process.exit(1);
        }
    }

    async run() {
        console.log("Building...", this.args);

        const build_config = await this.createBuildConfig();

        switch(this.args.target) {
            case 'module':
                await esbuild.build(build_config);
                break;
            case 'serve': {
                const ctx = await esbuild.context(build_config);
                await this.startLiveReloadServer(ctx);
                break;
            }
        }
    }

    async createBuildConfig() {
        return /** @type {import('esbuild').BuildOptions} */ ({
            entryPoints: ["./src/index.ts"],
            bundle: true,
            outfile: this.opt_outfile,
            format: 'esm',
            target: ["chrome118", "firefox118"],
            
            plugins: this.opt_plugins,
            minify: this.opt_minify,
            sourcemap: this.opt_sourcemap,

            lineLimit: 1200,
        });
    }

    /**
     * @param {Awaited<ReturnType<typeof esbuild.context>>} ctx 
     */
    async startLiveReloadServer(ctx) {
        await ctx.watch();
        const {host, port} = await ctx.serve({
            servedir: "./serve/",
        });
        console.log(`Start debugging on http://${host === "0.0.0.0" ? "localhost" : host}:${port}/...`);

        await new Promise(() => {});
    }

    get opt_outfile() {
        if(this.args.target === 'serve') {
            return "./serve/build/index.js";
        } else {
            return "./dist/index.js";
        }
    }

    get opt_plugins() {
        return [];
    }

    get opt_minify() {
        return (this.args.target === 'serve' ? false : true);
    }

    /** @type {boolean|'linked'|'inline'|'external'|'both'} */
    get opt_sourcemap() {
        return this.args.sourcemap ?? false;
    }
}