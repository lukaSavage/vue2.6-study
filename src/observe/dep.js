/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-01-28 15:20:55
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-02-10 17:39:57
 * @FilePath: \vue-demo\src\observe\dep.js
 */

let id = 0; // 用于给dep添加一个唯一标识，以便去重
class Dep {
    subs = [];
    id = id++;
    depend() {
        /* 
            为了后续实现computed，我们希望Watcher可以存放dep
            让watcher记住dep的同时，也让dep记住watcher
        */
        Dep.target.addDep(this);
        // this.subs.push(Dep.target);
    }
    addSubs(watcher) {
        this.subs.push(watcher);
    }
    notify() {
        this.subs.forEach(watcher => watcher.update());
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
