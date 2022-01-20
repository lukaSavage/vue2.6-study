/*
 * @Descripttion: vue的数据劫持
 * @Author: lukasavage
 * @Date: 2022-01-19 23:03:22
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-20 21:20:42
 */

class Observe {
	constructor(data) {
		console.log(data);
		// 使用defineProperty重新定义属性
		this.walk(data);
	}
	walk(data) {
		let keys = Object.keys(data);
		keys.forEach(key => {
			defineReactive(data, key, data[key]); // defineReactive在vue中是放在Vue.utils.defineReactive
		});
	}
}

function defineReactive(data, key, value) {
	// 递归遍历添加get、set方法
	observe(value);
	Object.defineProperty(data, key, {
		get() {
			console.log('用户获取值了！', value);
			return value;
		},
		set(newVal) {
			console.log('用户改值了~', newVal);
			// note: 在赋值的时候可能会给响应式数据赋值一个新对象，这个时候也要递归添加get、set方法
			observe(newVal);
			if (value === newVal) return;
			value = newVal;
		},
	});
}

/**
 *
 * @param {object} data 用户传递过来的属性
 */
export function observe(data) {
	console.log(
		'当前data类型',
		Object.prototype.toString.call(data).slice(8, -1)
	);
	// note: 1、先判断是不是对象,如果不是对象，不观察
	if (Object.prototype.toString.call(data).slice(8, -1) !== 'Object') return;
	return new Observe(data);
}
