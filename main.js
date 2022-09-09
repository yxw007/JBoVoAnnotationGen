const fs = require("fs");
const path = require("path");
let content = fs.readFileSync(path.join(__dirname, "./res/source.java"), "utf8");

function autoGen(content) {

	function formatFieldName(names) {
		let ret = "";
		for (let i = 0; i < names.length; i++) {
			let name = names[i];
			if (i === 0) {
				ret += name;
			} else {
				let firstChar = name.substring(0, 1);
				let surplus = name.substring(1);
				ret += firstChar.toUpperCase() + surplus;
			}
		}
		return ret;
	}

	function convertImport(content) {
		let res = content.replace(/(@Data\s+)?(public class)/gmi, (match, p1, p2) => {
			const importCode = "import com.alibaba.fastjson.annotation.JSONField;\n"
				+ "import com.fasterxml.jackson.annotation.JsonProperty;\n"
				+ "import io.swagger.annotations.ApiModelProperty;\n"
				+ `import lombok.Data;\n\n@Data\n${p2}`
			return importCode;
		});
		return res;
	}

	function convertField(content) {
		let res = content.replace(/^\s+private.*;/gm, (match) => {
			let arr = match.trim().split(" ");
			if (arr.length < 3) {
				return match;
			}

			let variableName = arr.pop().slice(0, -1);

			let fieldName = formatFieldName(variableName.split("_"));
			arr.push(fieldName);

			let fragment = arr.join(" ");
			let res = `    @ApiModelProperty("")\n    @JsonProperty("${variableName}")\n    @JSONField(name="${variableName}")\n    ${fragment};\n`

			return res;
		})

		return res;
	}

	let convert1 = convertImport(content);
	let convert2 = convertField(convert1);

	return convert2;
}

let result = autoGen(content);
let targetPath = path.join(__dirname, "./dist/target.java");
fs.writeFileSync(targetPath, result);

console.log("生成成功：", targetPath);
