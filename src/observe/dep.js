/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-01-28 15:20:55
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-28 15:43:32
 * @FilePath: \vue-demo\src\observe\dep.js
 */

class Dep {
    subs = [];
    depend() {
        this.subs.push(Dep.target);
    }
    notify() {
        this.subs.forEach(watcher=>watcher.update())
    }
}

// 多对多得关系
// 一个属性 -> 一个dep -> 一个或者多个watcher
// 一个可以watcher -> 多个dep
Dep.target = null;
export function pushTarget(watcher) {
    Dep.target = watcher;
}
export function popTarget() {
    Dep.target = null;
}

export default Dep;
