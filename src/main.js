import fs from "fs";
import path from "path";

function autoGen(content, isExistFileTransform) {

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

	/**
	 * 驼峰命名转下划线命名
	 * @param {*} str 
	 * @returns 
	 */
	function camelToUnderFieldName(str) {
		if (!str) {
			return str
		}

		const regex = /[A-Z]/gm;
		let m, preIndex = 0;
		let result = [];
		while ((m = regex.exec(str)) !== null) {
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}
			result.push(str.substring(preIndex, m.index));
			preIndex = m.index;
		}

		//没有到最后则截取最后一段
		if (preIndex != str.length - 1) {
			let lastContent = str.substring(preIndex);
			result.push(lastContent);
		}

		return result.join("_").toLocaleLowerCase();
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

			let fieldName = "";
			let res = "";
			if (variableName.includes("_")) {
				fieldName = formatFieldName(variableName.split("_"));
				arr.push(fieldName);

				fieldName = variableName;
			} else {
				fieldName = camelToUnderFieldName(variableName);
				arr.push(variableName);
			}

			let fragment = arr.join(" ");
			if (isExistFileTransform) {
				res = `    @JsonProperty("${fieldName}")\n    @JSONField(name="${fieldName}")\n    ${fragment};\n`
			} else {
				res = `    @ApiModelProperty("")\n    @JsonProperty("${fieldName}")\n    @JSONField(name="${fieldName}")\n    ${fragment};\n`
			}

			return res;
		})

		return res;
	}

	let convert1 = convertImport(content);
	let convert2 = convertField(convert1);

	return convert2;
}

async function transform(filePath, isExistFileTransform) {
	return new Promise((resolve) => {
		let content = fs.readFileSync(filePath, "utf8");
		//包含：JSONField or JsonProperty or ApiModelProperty 就说明已转换过
		// if (!/JSONField|JsonProperty|ApiModelProperty/mg.test(content)) {
		let result = autoGen(content, isExistFileTransform);
		fs.writeFileSync(filePath, result);
		// }
		resolve();
	})
}

export default async function (fileOrDirPath, isExistFileTransform) {
	let state = fs.statSync(fileOrDirPath);
	if (state.isDirectory()) {
		let fileNames = fs.readdirSync(fileOrDirPath);
		console.log("wait transfrom file names:", fileNames);
		for (const fileName of fileNames) {
			await transform(path.resolve(fileOrDirPath, fileName), isExistFileTransform);
		}
	} else {
		await transform(path.resolve(fileOrDirPath), isExistFileTransform);
	}

	console.log("transfrom is complete !");
}
