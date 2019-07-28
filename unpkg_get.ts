#!/usr/bin/env deno --allow-all

import { parse } from 'https://deno.land/std@v0.11.0/flags/mod.ts';
import * as path from "https://deno.land/std@v0.12/fs/path.ts";
import { copy, ensureDir } from "https://deno.land/std@v0.12/fs/mod.ts";

window.onload = async function() {
	const defaultArgs = {
		"UNPKG_DIR": "",
		"importmapping": "",
	};

	const denoArgs = [
		["importmapping", "importmap"]
	]
	const parsedArgs = Object.assign({}, defaultArgs, parse(Deno.args));
	const denoModulesPath = path.join(Deno.cwd(), "/deno_modules");
	// create subprocess
  const p = Deno.run({
		args: ["deno", "-A", ...denoArgs.map(([arg, name]) => parsedArgs[arg] && `--${name}=${parsedArgs[arg]}`).filter(x=>!!x), 'fetch', `https://unpkg.com/${parsedArgs._[1]}`, ...parsedArgs._.slice(2)],
		env: {
			"DENO_DIR": denoModulesPath
		}
  });

  // await its completion
	await p.status();

	const outDir = path.join(Deno.cwd(), "/unpkg.com");
	await ensureDir(outDir);

	await copy(path.join(denoModulesPath, "/deps/https/unpkg.com"), outDir, { overwrite: true });

	await Deno.remove(denoModulesPath, {
		recursive: true
	})
};
