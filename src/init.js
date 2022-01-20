/*
 * @Descripttion: Vue的初始化方法
 * @Author: lukasavage
 * @Date: 2022-01-19 21:48:36
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-20 09:38:53
 */

import { initState } from './state';

export function initMixin(Vue) {
	Vue.prototype._init = function (options) {
		// note: 1、在vue中挂载一个$option
		const vm = this;
		vm.$options = options;
		// note: 2、初始化状态(将数据做一个初始化的劫持，当数据改变时更新视图)
		initState(vm);
	};
}
