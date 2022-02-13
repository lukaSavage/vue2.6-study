/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-01-25 21:56:40
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-02-13 17:14:06
 */

export function patch(oldVnode, vnode) {
	// 默认吃石化时，时直接用虚拟节点创建出的真实节点来,替换掉老节点
	if (oldVnode.nodeType === 1) {
		// 将虚拟节点转换成真实节点
		const el = createEl(vnode); // 产生真实dom
		let parentElm = oldVnode.parentNode; // 获取老的app的父亲 ==> body元素

		parentElm.insertBefore(el, oldVnode.nextSibling);
		parentElm.removeChild(oldVnode); // 删除老的
		return el;
	} else {
		// 在更新时，那老的虚拟节点和新的虚拟节点做对比，将不同对的地方更新真实dom

		// 1.比较两个元素的标签，标签不一样直接替换掉
		if (oldVnode.tag !== vnode.tag) {
			oldVnode.el.replaceChild(createElm(vnode), oldVnode.el);
		}
		// 2.有可能标签是一样，文本不一样   <div>1</div>   <div>2</div>
		if (!oldVnode.tag) {
			// 文本节点的tag都是undefined
			// 文本的比对
			if (oldVnode.text !== vnode.text) {
				return (oldVnode.el.textContent = vnode.text);
			}
		}
		// 3.标签一样 并且需要开始比对标签的属性和儿子
		// 标签一样，属性直接覆盖
		let el = (vnode.el = oldVnode.el); // 复用老节点

		// 更新属性，用新的虚拟节点的属性和老的比较，去更新节点

		// 新老属性做对比
		updateProperties(vnode, oldVnode.data);

		// 对比儿子
		let oldChildren = oldVnode.children || [];
		let newChildren = vnode.children || [];

		if (oldChildren.length > 0 && newChildren.length > 0) {
			// 老的有儿子 新的也有儿子 diff 算法
			updateChildren(oldChildren, newChildren, el);
		} else if (oldChildren.length > 0) {
			// 新的没有
			el.innerHTML = '';
		} else if (newChildren.length > 0) {
			// 老的没有
			for (let i = 0; i < newChildren.length; i++) {
				const child = newChildren[i];
				el.appendChild(createElm(child));
			}
		}
	}

	// 在更新时，那老的虚拟节点和新的虚拟节点做对比，将不同的地方更新真实dom
}

function isSameVnode(oldVnode, newVnode) {
	return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
}

// 儿子间的比较
function updateChildren(oldChildren, newChildren, parent) {
	// 开头指针
	let oldStartIndex = 0; // 老的索引
	let oldStartVnode = oldChildren[0]; // 老的索引指向的节点
	let oldEndIndex = oldChildren.length - 1;
	let oldEndVnode = oldChildren[oldEndIndex];

	let newStartIndex = 0; // 新的索引
	let newStartVnode = newChildren[0]; // 新的索引指向的节点
	let newEndIndex = newChildren.length - 1;
	let newEndVnode = newChildren[newEndIndex];

	// 比较谁先循环完停止
	while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
		if (isSameVnode(oldStartVnode, newStartVnode)) {
			// 如果两人是同一个元素，比对儿子
			patch(oldStartVnode, newStartVnode); // 更新属性和再去递归更新子节点
			oldStartVnode = oldChildren[++oldStartIndex];
			newStartVnode = newChildren[++newStartIndex];
		} else if (isSameVnode(oldEndVnode, newEndVnode)) {
			patch(oldEndVnode, newEndVnode);
			oldEndVnode = oldChildren[--oldEndVnode];
			newEndVnode = newChildren[--newEndVnode];
		} else if ((oldStartVnode, newEndVnode)) {
			patch(oldStartVnode, newEndVnode);
			// 将当前元素插入到尾部的下一个元素的前面
			parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
			oldStartVnode = oldChildren[++oldStartIndex];
			newEndVnode = newChildren[--newEndIndex];
		} else if (isSameVnode(oldEndVnode, newStartVnode)) {
			patch(oldEndVnode, newStartVnode);
			parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
			oldEndVnode = oldChildren[++newStartIndex];
			newStartVnode = newChildren[++newStartIndex];
		}
	}
	if (newStartIndex <= newEndIndex) {
		// 如果新的多，插入新的
		for (let i = 0; i <= newEndIndex.length; i++) {
			parent.appendChild(createElm(newChildren[i]));
		}
	}
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

function updateProperties(vnode, oldProps = {}) {
	// 新的有 那就直接用新的去做更新即可
	const el = vnode.el;
	const newProps = vnode.data || {};

	// 老的有新的没有，需要删除属性
	for (const key in oldProps) {
		if (!newProps[key]) {
			el.removeAttribute(key); // 移除真实dom的属性
		}
	}

	// 样式处理  老的   style = {color: red}    新的 style={background: red}
	let newStyle = newProps.style || {};
	let oldStyle = oldProps.style || {};
	// 老的样式没有，新的有，删除老的样式
	for (const key in oldStyle) {
		if (!newStyle[key]) {
			el.style[key] = '';
		}
	}

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
