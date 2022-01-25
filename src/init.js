/*
 * @Descripttion: Vue的初始化方法
 * @Author: lukasavage
 * @Date: 2022-01-19 21:48:36
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-25 09:19:54
 */

import { compileToFunctions } from './compiler';
import { mountComponent } from './lifecycle';
import { initState } from './state';

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // note: 1、在vue中挂载一个$option
    const vm = this;
    vm.$options = options;
    // note: 2、初始化状态(将数据做一个初始化的劫持，当数据改变时更新视图)
    initState(vm);
  };

  Vue.prototype.$mount = function (el) {
    // 挂载操作
    const vm = this;
    const options = vm.$options;
    el = document.querySelector('#app');
    // 优先级判断 render > template > el
    if (!options.render) {
      // 没render方法，将template转换成render方法
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML;
      }
      const render = compileToFunctions(template);
      options.render = render;
    }

    // 挂载组件
    mountComponent(vm, el);
  };
}
