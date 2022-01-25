/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-01-25 21:56:40
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-25 22:21:55
 */

export function patch(oldVnode, vnode) {
	// 将虚拟节点转换成真实节点
	console.log(vnode);
	const el = createEl(vnode); // 产生真实dom
	let parentElm = oldVnode.parentNode; // 获取老的app的父亲 ==> body元素

	parentElm.insertBefore(el, oldVnode.nextSibling);
	parentElm.removeChild(oldVnode); // 删除老的
}

function createEl(vnode) {
	const { tag, children, key, data, text } = vnode;
	if (typeof tag === 'string') {
		vnode.el = document.createElement(tag); // 创建元素
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
