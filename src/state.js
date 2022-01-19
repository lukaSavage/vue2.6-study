/*
 * @Descripttion: 用于状态的初始化文件
 * @Author: lukasavage
 * @Date: 2022-01-19 22:33:20
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-19 23:06:23
 */

import { observe } from './observe';

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
	const data = vm.$options.data;
	typeof data === 'function' ? data.call(vm) : data;
	// tag: 拿到data后，进行数据的劫持
	observe(data);
}
function initComputed() {}
function initWatch() {}
