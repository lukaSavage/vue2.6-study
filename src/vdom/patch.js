/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-01-25 21:56:40
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-28 14:43:17
 */

export function patch(oldVnode, vnode) {
	// 将虚拟节点转换成真实节点
	const el = createEl(vnode); // 产生真实dom
	let parentElm = oldVnode.parentNode; // 获取老的app的父亲 ==> body元素

	parentElm.insertBefore(el, oldVnode.nextSibling);
	parentElm.removeChild(oldVnode); // 删除老的
	return el;
}

function createEl(vnode) {
	const { tag, children, key, data, text } = vnode;
	if (typeof tag === 'string') {
		vnode.el = document.createElement(tag); // 创建元素

		// todo: style样式的处理
		updateProperties(vnode);

		children.forEach(child => {
			// 遍历儿子，将儿子渲染后的结果扔到父亲中
			vnode.el.appendChild(createEl(child));
		});
	} else {
		// 创建文件，放到vnode.el上
		vnode.el = document.createTextNode(text);
	}
	return vnode.el;
}

function updateProperties(vnode) {
	const el = vnode.el;
	const newProps = vnode.data || {};
	for (const key in newProps) {
		// 这里我们只对class和style做处理
		if (key === 'style') {
			for (const styleName in newProps.style) {
				el.style[styleName] = newProps.style[styleName];
			}
		} else if (key === 'class') {
			el.className = el.class;
		} else {
			el.setAttribute(key, newProps[key]);
		}
	}
}
