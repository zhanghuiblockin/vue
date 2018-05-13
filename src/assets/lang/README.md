# 语言包命名规则

| 区域性名称 | 区域性标识符 | 语言-国家/地区 | 支持 |
|:----------:|:------------:|:--------------:|------|
|    zh-CN   |    0x0804    |   中文 - 中国  | yes  |
|    en-US   |    0x0409    |   英语 - 美国  | yes  |

> 信息来源:https://blog.csdn.net/dwp008/article/details/1815680

# 存在问题

* 全部放在一起有些乱，不太容易根据不同的路由页面进行有效的管理(有待改进)
* 下面是根据不同路由来管理各页面的语言包的基础结构
```
export const zhCN={
    // 公共
    Common:{},
    Index:{},
    Stats:{},
    SubAccount:{},
    Dashboard:{},
    Miners:{},
    Earnings:{},
    SubAccountList:{},
    SubAccountCreate:{}
}
```
# 技巧
* {{ $t('text.t6').replace(/\$a/g, subaccountName) }}
* {{ $t('text.t7').replace('{$a}', subaccountName).replace('{$b}',"替换b") }}