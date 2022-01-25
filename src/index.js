/*
 * @Descripttion: vue核心文件(打包后编译成vue.js)
 * @Author: lukasavage
 * @Date: 2022-01-19 21:04:45
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-25 22:38:07
 */

import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './vdom';

function Vue(options) {
  // console.log(options, this);
  this._init(options);
}
initMixin(Vue);          // note: 1.init初始化
lifecycleMixin(Vue);     // note: 2.组件的更新、渲染与挂载(_update)
renderMixin(Vue);        // note: 3.render方法



export default Vue;
