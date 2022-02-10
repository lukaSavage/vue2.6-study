/*
 * @Descripttion: vue核心文件(打包后编译成vue.js)
 * @Author: lukasavage
 * @Date: 2022-01-19 21:04:45
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-02-10 22:41:00
 */

import { initGlobalAPI } from './global';
import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './vdom';
import { stateMixin } from './state'

function Vue(options) {
	// console.log(options, this);
	this._init(options);
}

// 原型方法
initMixin(Vue); // note: 1.init初始化
lifecycleMixin(Vue); // note: 2.组件的更新、渲染与挂载(_update)
renderMixin(Vue); // note: 3.render方法
stateMixin(Vue); // note: 4.处理状态的方法

// 静态方法
initGlobalAPI(Vue);

export default Vue;
