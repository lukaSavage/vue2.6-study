/*
 * @Descripttion: 重写array方法的模块
 * @Author: lukasavage
 * @Date: 2022-01-20 21:48:07
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-20 22:57:26
 */

/* note: 1、拿到数组原型里面的方法 */
let oldArrayMethods = Array.prototype;

/* note: 2、通过继承改写方法，如果没有改写方法，则使用数组的原生方法 */
export let arrayMethods = Object.create(oldArrayMethods);

let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
methods.forEach(item => {
	arrayMethods[item] = function (...args) {
		// 在这里做我们拓展的逻辑
		// 主要是针对于追加进来的对象添加get、set方法
		let inserted;
		switch (item) {
			case 'push':
			case 'unshift':
				inserted = args;
				break;
			case 'splice':
				inserted = args.slice(2); // arr.splice(1,0,{aaa: 11},{bbb: 22}),此时inserted为[{aaa: 11},{bbb: 22}]
				break;
			default:
				break;
		}
		if (inserted) this.__ob__.observeArray(inserted);

		// note: 3、做完我们自己的逻辑后，还要调用原来oldArrayMethods上的原生方法
		const res = oldArrayMethods[item].apply(this, args);
		return res;
	};
});
