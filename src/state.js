/*
 * @Descripttion: 用于状态的初始化文件
 * @Author: lukasavage
 * @Date: 2022-01-19 22:33:20
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-02-10 22:45:35
 */

import { observe } from './observe';
import { myProxy, nextTick } from './utils';

export function initState(vm) {
	const opts = vm.$options;
	// 针对不同的情况做不同的初始化
	if (opts.props) {
		initProps(vm);
	}
	if (opts.methods) {
		initMethods(vm);
	}
	if (opts.data) {
		initData(vm);
	}
	if (opts.computed) {
		initComputed(vm);
	}
	if (opts.watch) {
		initWatch(vm);
	}
}

function initProps() {}
function initMethods() {}
function initData(vm) {
	let data = vm.$options.data;
	vm._data = data = typeof data === 'function' ? data.call(vm) : data;
	// tag: 1、拿到data后，进行数据的劫持

	// note: 实现属性代理：vm._data.xxx = vm.xxx
	for (const key in data) {
		myProxy(vm, '_data', key);
	}
	observe(data);
}
function initComputed() {}
function initWatch() {}

export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function(cb) {
        nextTick(cb)
    }
}


