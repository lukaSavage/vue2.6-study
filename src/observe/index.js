/*
 * @Descripttion: vue的数据劫持
 * @Author: lukasavage
 * @Date: 2022-01-19 23:03:22
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-20 09:50:31
 */

class Observe {
  constructor(data) {
    console.log(data);
  }
}

/**
 *
 * @param {object} data 用户传递过来的属性
 */
export function observe(data) {
  console.log('当前data类型', Object.prototype.toString.call(data).slice(8, -1));
  // note: 1、先判断是不是对象，并且不是null
  if (Object.prototype.toString.call(data).slice(8, -1) !== 'Object') return;
  return new Observe(data);
}
