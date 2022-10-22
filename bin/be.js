#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pk = fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8");

const program = new Command(pk.name);
program.version(pk.version);
program.usage("<command> [options]");
program.command("transform", "transform bean object");

program.parse(process.argv);
