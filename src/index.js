/*
 * @Descripttion: vue核心文件(打包后编译成vue.js)
 * @Author: lukasavage
 * @Date: 2022-01-19 21:04:45
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-19 22:35:18
 */

import { initMixin } from './init';

function Vue(options) {
	// console.log(options, this);
    
}

initMixin(Vue);

export default Vue;
