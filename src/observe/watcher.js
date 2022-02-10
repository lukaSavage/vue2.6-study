/*
 * @Descripttion: 渲染watcher，用于更新视图
 * @Author: lukasavage
 * @Date: 2022-01-28 14:53:48
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-02-10 17:32:48
 * @FilePath: \vue-demo\src\observe\watcher.js
 */
import { popTarget, pushTarget } from './dep';

let id = 0;
class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.options = options;
        this.id = id++; // watcher的唯一标识
        this.deps = []; // 盛放dep的容器
        this.depsId = new Set();

        if (typeof exprOrFn === 'function') {
            this.getters = exprOrFn;
        }
        this.get(); // 默认会调用get方法
    }

    addDep(dep) {
        let id = dep.id;
        if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSubs(this);
        }
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
