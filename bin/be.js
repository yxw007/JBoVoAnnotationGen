#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

//说明：由于es模式无法使用__filename 和 __dirname，所以通过import.meta.url和fileURLToPath来解决路径问题
//相关文章：https://bobbyhadz.com/blog/javascript-dirname-is-not-defined-in-es-module-scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pk = fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8");

const program = new Command(pk.name);
program.version(pk.version);
program.usage("<command> [options]");
program.command("transform", "transform bean object");

program.parse(process.argv);
