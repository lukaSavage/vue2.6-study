/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-01-25 09:31:25
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-02-02 15:21:09
 * @FilePath: \vue-demo\src\vdom\index.js
 */

export function renderMixin(Vue) {
	Vue.prototype._c = function () {
		// 创建元素
		return createElement(...arguments);
	};
	Vue.prototype._s = function (val) {
		// {{}}双括号语法
		return val === null
			? ''
			: typeof val === 'object'
			? JSON.stringify(val)
			: val;
	};
	Vue.prototype._v = function (text) {
		// 创建文本元素
		return createTextNode(text);
	};
	Vue.prototype._render = function () {
		const vm = this;
		const render = vm.$options.render;
		const vnode = render.call(this);
        console.log(vnode);
		return vnode;
	};
}

function createElement(tag, data = {}, ...children) {
	return vnode(tag, data, data.key, children);
}

function createTextNode(text) {
	return vnode(undefined, undefined, undefined, undefined, text);
}

// 以下时生产虚拟dom的函数
function vnode(tag, data, key, children, text) {
	return {
		tag,
		data,
		key,
		children,
		text,
	};
}
