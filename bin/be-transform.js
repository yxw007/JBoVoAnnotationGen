#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import transform from "../src/main.js"

let questions = [
	{
		name: "path",
		type: "input",
		message: "please input need transform absolute file path or dir path (just support single path)",
		validate(val) {
			if (!!!val) {
				return "please input path"
			} else if (!fs.existsSync(val)) {
				return "input path is not exsist !"
			} else {
				return true;
			}
		}
	}
]

inquirer.prompt(questions).then((answer) => {
	let { path } = answer;
	transform(path);
});
