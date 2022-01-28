/*
 * @Descripttion: 生命周期
 * @Author: lukasavage
 * @Date: 2022-01-25 09:19:31
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-28 14:43:29
 * @FilePath: \vue-demo\src\lifecycle.js
 */

import { patch } from './vdom/patch';

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        // 将虚拟dom节点变成真实dom
        const vm = this;
        vm.$el = patch(vm.$el, vnode);
    };
}

export function mountComponent(vm, el) {
    // 调用render方法后挂载到el属性上

    vm.$el = el;
    // _update方法负责将虚拟dom变成真实dom,_render方法将ast语法树转变成render方法
    callHook(vm, 'beforeCreate');
    vm._update(vm._render());
    callHook(vm, 'mounted');
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]; // vm.$options.created = [a1, a2, a3]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm); // 更改生命周期的this
        }
    }
}
