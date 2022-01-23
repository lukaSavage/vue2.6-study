/*
 * @Descripttion: 工具函数库
 * @Author: lukasavage
 * @Date: 2022-01-23 10:51:12
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-23 11:25:47
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


export function myDefineProperty(target, key , value) {
    Object.defineProperty(target, key, {
        enumerable: false,   // 表示不能枚举，不能在循环当中展示出来
        configurable: false, 
        value,
    });
}