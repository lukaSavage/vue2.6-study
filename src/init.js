/*
 * @Descripttion: Vue的初始化方法
 * @Author: lukasavage
 * @Date: 2022-01-19 21:48:36
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-02-13 14:18:02
 */

import { compileToFunctions } from './compiler';
import { callHook, mountComponent } from './lifecycle';
import { initState } from './state';
import { mergeOptions } from './utils';

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // note: 1、在vue中挂载一个$option
        const vm = this; // this->实例对象
        vm.$options = mergeOptions(vm.constructor.options, options); // todo: 这里需要将用户自定义的opt ions和全局的合并
        console.log(vm.$options);
        // note: 2、初始化状态(将数据做一个初始化的劫持，当数据改变时更新视图)

        // 在初始化前后挂生命周期
        callHook(vm, 'beforeCreate');
        initState(vm);
        callHook(vm, 'created');


        if (options.el) {
            vm.$mount(options.el)
        }
    };

    Vue.prototype.$mount = function (el) {
        // 挂载操作
        const vm = this;
        const options = vm.$options;
        el = document.querySelector('#app');
        // vm.$el = el;
        // 优先级判断 render > template > el
        if (!options.render) {
            // 没render方法，将template转换成render方法
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML;
            }
            const render = compileToFunctions(template);
            options.render = render;
        }

        // 挂载组件
        mountComponent(vm, el);
    };
}
