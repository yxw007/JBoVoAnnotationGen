# 自动生成注解

> 避免 BO、VO 对象定义变量，需要重复定义多次的情况，避免重复工作利用此工具自动生成注解

- 编写方式
	```
	@Data
	public class CartAddBO {
			private String product_types;
	}
	```

- 生成结果
	
	```
		@Data
		public class CartAddBO {
				@ApiModelProperty("")
				@JsonProperty("product_types")
				@JSONField(name="product_types")
				private String ProductTypes;
		}
	```

## 快速开始

- 全局安装
	```
	npm install bean-transform -g
	```

- 执行命令
	```
	Usage: be <path> [options]

	transform bean object

	Arguments:
		path         need transform file path or directory path

	Options:
		-e, --exist  transform file is not exist, exit pass -e,otherwise don't have to pass any values, default false (default: false)
		-h, --help   display help for command
	```

- 示例
	```
	$ be D:/Work/java_workspace/iwjw-server/com/xxmodular/bo/product 
	transform path: D:/Work/java_workspace/iwjw-server/com/xxmodular/bo/product 
	is exist file transform: false
	wait transfrom file names: [ 'PmsProductCategorySaveOrUpdateBO.java', 'Test.java' ]
	transfrom is complete !
	```
- 生成前效果
	
	```java
	package com.e7show.kh.iwjw.modular.bo.product;

	public class Test {
			private String user_id;

			private Integer ageName;
	}

	```

- 生成后效果
  
	```java

	package com.e7show.kh.iwjw.modular.bo.product;

	import com.alibaba.fastjson.annotation.JSONField;
	import com.fasterxml.jackson.annotation.JsonProperty;
	import io.swagger.annotations.ApiModelProperty;
	import lombok.Data;

	@Data
	public class Test {
			@ApiModelProperty("")
			@JsonProperty("user_id")
			@JSONField(name="user_id")
			private String userId;

			@ApiModelProperty("")
			@JsonProperty("age_name")
			@JSONField(name="age_name")
			private Integer ageName;

	}

	```
