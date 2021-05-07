# v-vld

## 安装使用

```
npm i v-vld -S
```

```javascript
import Vld from 'v-vld'
Vue.use(Vld)
```

## 基础使用方法

```html
<input
  v-vld="'required'"
  name="test"
  scope="myScoped"
  v-model="waitForValidate"
/>
<div id="show-error">{{ errList['test'] }}</div>
```

- `v-vld` 指定校验方式，可以是变量，例子中的 `'required'` 意味着该字段必填
- `name` 用于展示错误提示，如 `${name}必填`，另外，也可以用于输入框定位（这个放在后面说）
- `scope` 规定校验范围，可不指定
- `{{ errList['test'] }}` 显示错误提示，需要传入 name

正确配置后，在输入框数据变动时会自动校验输入框内数据是否符合要求。

## 自定义校验

在使用自定义校验前，先通过 `Vld.extend` 拓展校验方法。

```javascript
Vld.extend(
  'lt999',
  (v) => Number(v) < 999,
  (field) => field + '需小于 999'
)
```

`Vld.extend` 需要按顺序传入：

- 校验名称
- 校验函数
- 对应错误提示

如上例自定义 `lteX` 即可在组件中使用：

```html
<el-input name="y" v-vld="'lt999'" v-model="y"></el-input>
<div id="show-error">{{ errList['y'] }}</div>
```

## 联动校验

```javascript
Vld.extend(
  'lteX',
  (v, x) => Number(v) <= Number(x),
  (field) => field + '不能大于 x'
)
```

传入校验函数的**第二个参数**是一个在 `v-vld` 传入的参数值。

举个例子：传入 `'lteX:999'`，校验函数就会在第二个参数收到 `'999'`（也就是冒号分割后的后者）。

既然 `v-vld` 传入的是变量，那就 `:` 后的值就当然不只能是固定的值：

```html
<el-input name="y" v-vld="'lteX:' + x" v-model="y"></el-input>
<div id="show-error">{{ errList['y'] }}</div>
```

你可以在冒号后传入变量 x，在 x 更新后，`'lteX:' + x` 也会跟着改变，这样就实现了**联动校验**的效果。

## 总体校验

在提交前往往需要校验整个表格是否按要求填好，这就需要使用校验函数 `$vld`。

```javascript
this.$vld()
```

如果你需要校验指定 scope 的话，向 `$vld` 函数传入 scope 即可：

```javascript
this.$vld(scope)
```

`$vld` 函数返回的校验结果会像这样：

```json
[
  {
    "field": "test",
    "msg": "test不能为空"
  },
  {
    "field": "el-test",
    "msg": "el-test不能为空"
  },
  {
    "field": "el-test2",
    "msg": "el-test不能为空"
  },
  {
    "field": "test2",
    "msg": "test不能为空"
  }
]
```

你可以利用 `field` 定位目标输入框：

```javascript
document.querySelector(`[name="${field}"]`).scrollIntoView()
```

## 清除校验

同样可以传入 scope：

```javascript
this.$vldClr()
this.$vldClr(scope)
```

## 不同作用域校验

在当前上下文（指组件实例）内不能校验其他上下文中的 field，你需要通过 `$parent`、`$children`、`$refs` 等方法获取其他上下文并校验：

```html
<InputGroup ref="inputGroup" />
<script>
  this.$refs.inputGroup.$vld()
</script>
```
