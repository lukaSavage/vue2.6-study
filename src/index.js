/*
 * @Descripttion: vue核心文件(打包后编译成vue.js)
 * @Author: lukasavage
 * @Date: 2022-01-19 21:04:45
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-25 09:33:23
 */

import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './vdom';

function Vue(options) {
  // console.log(options, this);
  this._init(options);
}
initMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);



export default Vue;
