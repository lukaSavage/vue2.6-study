/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-01-25 09:31:25
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-25 09:44:53
 * @FilePath: \vue-demo\src\vdom\index.js
 */

export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    // 创建元素
  };
  Vue.prototype._v = function () {
    // 创建文本元素
  };
  Vue.prototype._s = function (val) {
    // {{}}双括号语法
    return val === null
      ? ''
      : typeof val === 'object'
      ? JSON.stringify(val)
      : val;
  };
  Vue.prototype._render = function () {
    const vm = this;
    const render = vm.$options.render;
    console.log(render);
    const vnode = render.call(this);

    return vnode;
  };
}
