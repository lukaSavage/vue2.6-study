/*
 * @Descripttion: vue的数据劫持
 * @Author: lukasavage
 * @Date: 2022-01-19 23:03:22
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-28 16:59:51
 */

import { myDefineProperty } from '../utils';
import { arrayMethods } from './array';
import Dep from './dep';

class Observe {
    constructor(data) {
        console.log(data);

        // 在data上添加一个属性__ob__,用于挂载observeArray方法给arrays.js文件使用
        /* done: 为什么要使用Object.defineProperty而不是直接 data.__ob__ = this */
        /* done: 答：如果直接赋值的话，因为__ob__会在循环中遍历出来，会造成死循环 */
        // Object.defineProperty(data, '__ob__', {
        // 	enumerable: false,   // 表示不能枚举，不能在循环当中展示出来
        // 	configurable: false,
        // 	value: this,
        // });
        myDefineProperty(data, '__ob__', this);
        // 使用defineProperty重新定义属性
        if (!Array.isArray(data)) {
            this.walk(data);
        } else {
            // 重写数组的push、pop、shift、unshift、splice、reverse、sort等等方法
            // 重写的目的主要是：在调用原生方法之前做一些事情
            data.__proto__ = arrayMethods;
            // 如果数组中存在对象元素，也得让该对象也有响应式
            this.observeArray(data);
        }
    }

    observeArray(arr) {
        arr.forEach(item => {
            observe(item);
        });
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

    let dep = new Dep(); // 每个属性都有一个dep
    Object.defineProperty(data, key, {
        get() {
            console.log('用户获取值了！', value);
            if (Dep.target) {
                // 让这个属性记住
                dep.depend();
            }
            return value;
        },
        set(newVal) {
            console.log('用户改值了~', newVal);
            // 在赋值的时候可能会给响应式数据赋值一个新对象，这个时候也要递归添加get、set方法
            observe(newVal);
            if (value === newVal) return;
            value = newVal;
            dep.notify();
        },
    });
}

/**
 *
 * @param {object} data 用户传递过来的属性
 */
export function observe(data) {
    // 先判断是不是对象,如果不是对象，不观察
    if (typeof data !== 'object' || data === null) return;
    if (data.__ob__) return;
    return new Observe(data);
}
