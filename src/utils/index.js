/*
 * @Descripttion: 工具函数库
 * @Author: lukasavage
 * @Date: 2022-01-23 10:51:12
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-02-12 12:15:17
 */

/**
 * 实现代理的函数
 * @param {*} vm vm对象
 * @param {*} data 通常指_data
 * @param {*} key data函数中的属性key
 */
export function myProxy(vm, data, key) {
	Object.defineProperty(vm, key, {
		get() {
			return vm[data][key];
		},
		set(newValue) {
			vm[data][key] = newValue;
		},
	});
}

export function myDefineProperty(target, key, value) {
	Object.defineProperty(target, key, {
		enumerable: false, // 表示不能枚举，不能在循环当中展示出来
		configurable: false,
		value,
	});
}

export const LIFECYCLE_HOOKS = [
	'beforeCreate',
	'created',
	'beforeMount',
	'mounted',
	'beforeUpdate',
	'updated',
	'beforeDestroy',
	'destroyed',
];

const strats = {};
strats.data = function (parentVal, childVal) {
	return childVal;
};
strats.computed = function () {};
strats.watch = function () {};
function mergeHook(parentVal, childVal) {
	// 生命周期的合并
	if (childVal) {
		if (parentVal) {
			return parentVal.concat(childVal);
		} else {
			return [childVal];
		}
	} else {
		return parentVal; // 相当于不合并，使用父亲的
	}
}
LIFECYCLE_HOOKS.forEach(item => {
	strats[item] = mergeHook;
});

// 混入函数
export function mergeOptions(parent, child) {
	// 遍历父亲，可能是父亲有 儿子没有
	// console.log(parent, child.created());
	const options = {};
	// 儿子有，父亲没有
	for (const key in parent) {
		mergeField(key);
	}

	for (const key in child) {
		if (!parent.hasOwnProperty(key)) {
			mergeField(key);
		}
	}

	function mergeField(key) {
		// 合并字段
		if (strats[key]) {
			options[key] = strats[key](parent[key], child[key]);
		} else {
			// 默认合并
		}
	}

	return options;
}

let callbacks = []; // note: 用于存放回调的数组，其作用是将回调延迟到DOM更新之后执行
let pending = false;

function flushCallbacks() {
	callbacks.forEach(cb => cb());
	pending = false;
}

let timeFunc;
if (Promise) {
	timeFunc = () => {
		Promise.resolve().then(flushCallbacks); // 异步处理更新
	};
} else if (MutationObserver) {
	// MutationObserver可以监控dom变化，是异步更新
	let observe = new MutationObserver(flushCallbacks);
	let textNode = document.createTextNode(1);
	observe.observe(textNode, { characterData: true });
	timeFunc = () => {
		textNode.textContent = 2;
	};
} else if (setImmediate) {
	timeFunc = () => {
		setImmediate(flushCallbacks);
	};
} else {
	timeFunc = () => {
		setTimeout(flushCallbacks);
	};
}

export function nextTick(cb) {
	console.log(cb);
	// 因为内部会调用nextTick,用户也会调用，但是异步只需要一次
	callbacks.push(cb);
	if (!pending) {
		timeFunc(); // 这个方法是异步方法，做了兼容的。Vue3中直接使用了Promise.resolve().then()方法
        pending = true;
	}
}
