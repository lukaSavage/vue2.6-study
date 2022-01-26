/*
 * @Descripttion: 全局API
 * @Author: lukasavage
 * @Date: 2022-01-26 21:01:54
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-26 22:38:25
 */

import { mergeOptions } from "../utils";

export function initGlobalAPI(Vue) {
    Vue.options = {}
	Vue.mixin = function (mixin) {
        // todo: 这里我们暂时只考虑生命周期的混合，后面再考虑data、computed、watch等的混合
		this.options = mergeOptions(this.options, mixin);
	};
}
