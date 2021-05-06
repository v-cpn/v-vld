/**
 * usage:
 * <input v-vld="'required'" scope="myScoped" />
 * validate when data is changed
 * or use this.$vld('myScope') to validate all fields in 'myScope'
 */

let Vld = {}
let vldType = {
  required: (v) => v !== null && v !== undefined && v !== '',
  gt0: (v) => v > 0,
  gtX: (v, x) => v > x,
  ltX: (v, x) => v < x,
}
let vldMsg = {
  required: (name) => name + '不能为空',
  gt0: (name) => name + '必须大于 0',
  gtX: (name) => name + '必须大于 X',
  ltX: (name) => name + '必须小于 X',
}
let fieldList = {}

const trimNumber = (name) => {
  return name.match(/^\D+/)[0]
}

const validate = (val, vldsName) => {
  // vldsName eg. required|gt0|gtX:3000
  console.log('validate', val, vldsName)
  const vlds = vldsName.split('|')
  for (let i = 0; i < vlds.length; i++) {
    let vldItem = vlds[i]
    const [vldName, ...params] = vldItem.split(':')
    if (!vldType[vldName])
      return console.error('unknow validate type: ' + vldName)
    if (!vldType[vldName](val, params)) return [false, vldName]
  }
  return [true]
}

const createMessage = (propName, vldName) => {
  // vldName eg. gtX
  if (!vldType[vldName]) return console.error('unknow message type: ' + vldName)
  return vldMsg[vldName](trimNumber(propName))
}

const createInfo = (binding, vnode) => {
  const vm = vnode.componentInstance
  const elm = vnode.elm
  const ctx = vnode.context
  let name, id, scope
  if (vm) {
    name = vm.$props.name || vm.$attrs.name
    scope = vm.$props.scope || vm.$attrs.scope
    id = vm._uid
  } else {
    name = elm.getAttribute('name')
    scope = elm.getAttribute('scope')
    if (elm._uid) id = elm._uid
    else id = elm._uid = +new Date()
  }
  return { id, vm, elm, ctx, scope, name, vld: binding.value }
}

Vld.extend = function (name, validateFunc, messageFunc) {
  vldType[name] = validateFunc
  vldMsg[name] = messageFunc
}
Vld.install = function (Vue) {
  Vue.directive('vld', {
    bind(el, binding, vnode) {
      const data = createInfo(binding, vnode)
      const { id, vm, ctx, name, elm } = data
      // 用 id 区分不同组件
      fieldList[id] = data
      ctx.$delete(ctx.errList, name)
      if (vm) {
        vm.$watch('value', function (val) {
          // vld must be dynamic
          if (!data.vld) return
          let [res, resType] = validate(val, data.vld)
          console.log(res, resType)
          if (res) {
            ctx.$delete(ctx.errList, name)
          } else {
            ctx.$set(ctx.errList, name, createMessage(name, resType))
          }
        })
      } else {
        elm.addEventListener('change', (e) => {
          if (!data.vld) return
          const val = e.target.value
          let [res, resType] = validate(val, data.vld)
          if (res) {
            ctx.$delete(ctx.errList, name)
          } else {
            ctx.$set(ctx.errList, name, createMessage(name, resType))
          }
        })
      }
    },
    // inserted: function() {
    //   console.log('inserted')
    // },
    // update: function(el, binding, vnode) {
    //   console.log('update')
    // },
    componentUpdated: function (el, binding, vnode) {
      // createInfo 在 element UI 的 table 的 scope 作用域中使用时会触发无限更新，原因未明
      // const { id, ctx, name } = createInfo(binding, vnode)
      const vm = vnode.componentInstance
      const elm = vnode.elm
      const id = vm ? vm._uid : elm._uid
      const data = fieldList[id]
      const ctx = vnode.context
      // 不知道为什么会在没 bind 的情况下先运行 componentUpdated，所以没有找到 data
      if (data && binding.value !== data.vld) {
        data.vld = binding.value
        const name = vm
          ? vm.$props.name || vm.$attrs.name
          : elm.getAttribute('name')
        ctx.$delete(ctx.errList, name)
      }
    },
    unbind: function (el, binding, vnode) {
      const { id, ctx, name } = createInfo(binding, vnode)
      ctx.$delete(ctx.errList, name) // 清除现有的错误记录
      delete fieldList[id]
    },
  })

  Vue.mixin({
    data: function () {
      return {
        errList: {},
      }
    },
  })

  // validate all fields
  Vue.prototype.$vld = function (curScope) {
    for (const id in fieldList) {
      const { vm, elm, ctx, name, vld, scope } = fieldList[id]
      if (ctx !== this) continue
      if (curScope && scope !== curScope) continue
      if (!vld) {
        // vld 为空时跳过校验并删除原来的校验结果（针对 vld 可变的情况）
        ctx.$delete(ctx.errList, name)
        continue
      }
      let val
      if (vm) {
        val = vm.value
      } else {
        val = elm.value
      }
      let [res, resType] = validate(val, vld)
      if (res) {
        ctx.$delete(ctx.errList, name)
      } else {
        ctx.$set(ctx.errList, name, createMessage(name, resType))
      }
    }
    return Object.keys(this.errList).map((errName) => {
      return {
        field: errName,
        msg: this.errList[errName],
      }
    })
  }

  Vue.prototype.$vldClr = function (curScope) {
    for (const id in fieldList) {
      const { ctx, name, scope } = fieldList[id]
      if (ctx !== this) continue
      if (curScope && scope !== curScope) continue
      ctx.$delete(ctx.errList, name)
    }
  }
}

export default Vld
