const fs = require("fs");
const path = require("path");
let content = fs.readFileSync(path.join(__dirname, "./res/source.java"), "utf8");

function autoGen(content) {

	function formatFieldName(names) {
		let ret = "";
		for (const name of names) {
			let firstChar = name.substring(0, 1);
			let surplus = name.substring(1);
			ret += firstChar.toUpperCase() + surplus;
		}
		return ret;
	}

	return content.replace(/^\s+private.*;/gm, (match) => {
		if (!match) {
			return match;
		}
		let arr = match.trim().split(" ");
		if (arr.length < 3) {
			return match;
		}

		let variableName = arr.pop().slice(0, -1);

		let fieldName = formatFieldName(variableName.split("_"));
		arr.push(fieldName);

		let fragment = arr.join(" ");
		let res = `    @ApiModelProperty("")\n    @JsonProperty("${variableName}")\n    @JSONField(name="${variableName}")\n    ${fragment};`

		return res;
	})
}

let result = autoGen(content);
let targetPath = path.join(__dirname, "./dist/target.java");
fs.writeFileSync(targetPath, result);

console.log("生成成功：", targetPath);
