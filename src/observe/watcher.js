/*
 * @Descripttion: 渲染watcher，用于更新视图
 * @Author: lukasavage
 * @Date: 2022-01-28 14:53:48
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-02-10 22:34:59
 * @FilePath: \vue-demo\src\observe\watcher.js
 */
import { nextTick } from '../utils';
import { popTarget, pushTarget } from './dep';

let id = 0;
class Watcher {
	constructor(vm, exprOrFn, cb, options) {
		this.vm = vm;
		this.exprOrFn = exprOrFn;
		this.cb = cb;
		this.options = options;
		this.id = id++; // watcher的唯一标识
		this.deps = []; // 盛放dep的容器
		this.depsId = new Set();

		if (typeof exprOrFn === 'function') {
			this.getters = exprOrFn;
		}
		this.get(); // 默认会调用get方法
	}

	addDep(dep) {
		let id = dep.id;
		if (!this.depsId.has(id)) {
			this.deps.push(dep);
			this.depsId.add(id);
			dep.addSubs(this);
		}
	}

	get() {
		pushTarget(this);
		this.getters();
		popTarget();
	}
	update() {
		// 这里不要每次调用get方法，get方法会重新渲染页面
		queueWatcher(this);

		// this.get(); // todo: 这种写法是直接更新的方法，后续我们需要把它变成批量更新的方法
	}

	run() {
		this.get(); // 渲染逻辑
	}
}

// 实现批量更新watcher
let queue = []; // 将需要批量更新的watcher存到一个队列中，稍后让watcher执行
let has = {}; // 源码中也是用对象来去重，我们也用之
let pending = false; //相当于做一次防抖节流

function flushSchedulerQueue() {
	queue.forEach(watcher => watcher.run());
	queue = []; // 清空队列是为了下次使用
	has = {};
	pending = false;
}

function queueWatcher(watcher) {
	const id = watcher.id;
	if (has[id] == null) {
		queue.push(watcher);
		console.log(queue[0].run);
		has[id] = true;

		// 等待所有代码执行完后执行
		if (!pending) {
			setTimeout(() => {
				nextTick(flushSchedulerQueue);
			});
			pending = true;
		}
	}
}

export default Watcher;
