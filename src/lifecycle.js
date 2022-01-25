/*
 * @Descripttion: 生命周期
 * @Author: lukasavage
 * @Date: 2022-01-25 09:19:31
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-25 22:01:57
 * @FilePath: \vue-demo\src\lifecycle.js
 */

import { patch } from "./vdom/patch";

export function lifecycleMixin(Vue) {
	Vue.prototype._update = function (vnode) {
		// 将虚拟dom节点变成真实dom
        const vm = this;
		patch(vm.$el, vnode);
	};
}

export function mountComponent(vm, el) {
	// 调用render方法后挂载到el属性上

	// _update方法负责将虚拟dom变成真实dom,_render方法将ast语法树转变成render方法
	vm._update(vm._render());
}
