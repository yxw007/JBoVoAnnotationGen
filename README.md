# 自动生成注解

> 避免 BO 对象定义变量，需要重复定义多次的情况，避免重复工作利用此工具自动生成注解

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
