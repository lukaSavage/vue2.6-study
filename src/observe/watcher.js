import { popTarget, pushTarget } from './dep';

/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-01-28 14:53:48
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-28 16:41:34
 * @FilePath: \vue-demo\src\observe\watcher.js
 */
let id = 0;
class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.options = options;
        this.id = id++; // watcher的唯一标识

        if (typeof exprOrFn === 'function') {
            this.getters = exprOrFn;
        }
        this.get(); // 默认会调用get方法
    }

    get() {
        pushTarget(this);
        this.getters();
        popTarget();
    }
    update() {
        this.get();
    }
}

export default Watcher;
