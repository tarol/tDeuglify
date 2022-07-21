# 基本说明

`deuglify`和核心是恢复代码的可读性，恢复可读性的关键是两点：`rename`和`detransformer`

所谓`rename`就是对变量名进行替换，当然不是简单的替换，而是要考虑对作用域的分析

所谓`detransformer`就是对ast结构的转化，比如把`return`语句中的逗号表达式进行拆解（uglify会把return语句前面的语句和`return`语句进行合并，形成逗号表达式）。`detransformer`的难点在于规则是发散的，uglify把A/B/C/D四种语法收敛成E，不意味着`deuglify`可以把E语法恢复成A/B/C/D。E语法就是E语法，要恢复成A/B都需要考虑上下文，也就是说`“上下文无关文法”`变成了`“上下文有关文法”`
