# Vue 2.6.0版本源码解读

## 一、介绍

    此次研究的主题是vue2.6版本的研究，里面包括vue是如何渲染的，以及roll-up脚手架的搭建，后续也会更新vue-router、vuex源码的工作流程

## 二、roll-up搭建

1. 需要安装的包

    + npm i roll-up -D
    + npm i rollup-plugin-babel -D
    + npm i rollup-plugin-commonjs -D
    + npm i @babel/core -D
    + npm i @babel/preset-env -D

    + npm i rollup-plugin-serve
2. 配置rollup.config.js

    ``` js
    /*
    * @Descripttion: rollup配置文件
    * @Author: lukasavage
    * @Date: 2022-01-19 21:02:58
    * @LastEditors: lukasavage
    * @LastEditTime: 2022-01-23 10:56:11
    */
    import serve from 'rollup-plugin-serve';
    import babel from 'rollup-plugin-babel';
    import commonjs from 'rollup-plugin-commonjs';

    export default {
        input: './src/index.js',
        output: {
            format: 'umd', // 模块化类型，有esModule、commonjs、amd、cmd、umd等等，其主要作用是让window上有一个window.Vue，umd的话代表既可以支持commonjs，也可以支持amd
            name: 'Vue', // 全局变量的名字
            file: 'dist/umd/vue.js', // 打包输出后的文件名
            sourcemap: true, // 开启调试
        },
        plugins: [
            babel({
                // 告诉rollup用babel来转译
                exclude: 'node_modules/**', // node_modules下的所有文件都不需要转译
            }),
            serve({
                open: true, // 自动打开浏览器
                port: 3001, // 默认端口号
                contentBase: '', // 表示路径以当前目录为标准
                openPage: '/index.html', // 默认打开的页面
            }),
            commonjs(), // 引入文件的时候自动查找文件下的index文件
        ],
    };
    ```

3. 配置插件预设

    ``` json
        {
            "presets": [
                "@babel/preset-env"/* 告诉babel编译的时候具体使用哪个插件 */
            ]
        }
    ```

4. package.json的script命令配置

    ``` json
        {
            "scripts": {
                "start": "rollup -c -w" /* -c代表默认读取rollup.config.js文件。 -w代表监视整个文件 */
            },
        }
    ```

## 三、new Vue发生了什么？

> Vue在源码中其实就是一个Function,通过插拔式的方法不停的给Vue实例添加方法，使得代码层次分明

+ src/index 文件

    ``` js
    // Vue 本质： 实际就是一个 Function 实现的类
    // 通过 new Vue({ el: '#app', data: { msg: 'Hello Vue' } }]) // 初始化
    // options 就是 new Vue 时传进来的参数
    import { initMixin } from './init'
    function Vue (options) {
      // ...
    
      // 初始化 Vue
      // options = {
      //   el: "#app",
      //   data: {},
      //   methods: {},
      //   ...
      // }
      this._init(options)
    }
    
    // 这些函数以 Vue 为参数传入，主要就是给 Vue 的原型 prototype 上扩展方法 
    // 思想：把 Vue 原型挂载不同方法拆分成不同文件去实现，使代码层次分明
    
    // 定义了 Vue.prototype._init, 初始化 Vue，实际上 new Vue 就是执行的这个方法
    initMixin(Vue)
    
    // 定义了：
    //  Vue.prototype.$data、Vue.prototype.$props
    //  Vue.prototype.$set、Vue.prototype.$delete、Vue.prototype.$watch
    stateMixin(Vue)
    
    // 定义了事件播报相关方法：
    //  Vue.prototype.$on, Vue.prototype.$once、Vue.prototype.$off、Vue.prototype.$emit
    eventsMixin(Vue)
    
    // 定义了：
    //  Vue.prototype._update、Vue.prototype.$forceUpdate、Vue.prototype.$destroy
    lifecycleMixin(Vue)
    
    // 定义了：Vue.prototype.$nextTick、Vue.prototype._render
    // _render方法会调用 vm.$createElement 创建虚拟 DOM，如果返回值 vnode 不是虚拟 DOM 类型，将创建一个空的虚拟 DOM
    renderMixin(Vue)
    ```

+ src/ init文件

    ```js
        export function initMixin(Vue) {
            Vue.prototype._init = function(options) {
                const vm = this;
                vm.$options = options;
                initState(vm);  // 状态初始化：目的就是初始化用户传入的props、data、computed等等..
            }
        }
    
    ```

+ src/state文件
  
    ```js
    import { observe } from './observe';
    
    export function initState(vm) {
        const options = vm.$options;
        if(options.data) {
            initData(vm)
        }
        /* 
        if (opts.props) {
            initProps(vm);
        }
        if (opts.methods) {
            initMethods(vm);
        } 
        */
    } 
    function initData(vm) {
        const data = vm.$options.data;
        // todo: 下一章节：需要对用户提供的所有属性进行重写添加get和set(只能拦截已存在的属性)
        data = vm._data = typeof data === 'function' ? data.call(vm) : data;
        observe(data); // 下一节实现
    }
    ```

## 四、vue响应式的基本原理

> 主要原理：劫持options里面的data,通过递归给data里面的属性添加get、set方法，实现整体数据的响应式

+ src/observe/index.js
  
  ```js
  export function observe(data) {
      // 先判断是不是对象,如果不是对象，不观察
      if (typeof data !== 'object' || data === null) return;
      /*
       说明一下：这里为何要用class，而不用普通构造函数？
       因为我们后续要知道这个对象是否被观测过了
      */
      return new Observe(data);
  }
  class Observe {
      constructor(data) {
          this.walk(data);
      }
      walk(data) {
          let keys = Object.keys(data);
          keys.forEach(key => {
              defineReactive(data, key, data[key]); // defineReactive在vue中是放在Vue.utils.defineReactive
          });
      }
  }
  
  function defineReactive(data, key, value) {
      // 递归遍历添加get、set方法
      observe(value);
  
      Object.defineProperty(data, key, {
          get() {
              return value;
          },
          set(newVal) {
              observe(newVal);
              if (value === newVal) return;
              value = newVal;
          },
      });
  }
  
  
  ```
  
  >   注意事项：
  >
  >    ☆ 没有在data选项中添加的属性，如果想要变成响应式属性，通常有两种方法：
  >
  >     ①、通过Vue.set方法添加
  >
  >     ②、通过合并对象。例如：vm._data.obj = { ...vm._data.obj, a: 1 };
  
## 五、数组的劫持

  由于数组的长度无法确认，因此vue针对于data里面的数组并不会使用defineProperty,原因在于性能较差（vue3中如果用的是optionsAPI,会降维采用defineProperty,数组也是采用defineProperty）,所以在对数组操作之前，需要拦截数组，并改写它的具有破坏性操作的方法（即直接修改数组的方法，例如：push、pop、shift、unshift、splice、reverse、sort）

-   具体操作代码如下（src/observe/index.js）

    ```js
    class Observe {
        constructor(data) {
            if(Array.isArray(value)) {
               // 重写数组的push、pop、shift、unshift、splice、reverse、sort等等方法
                // 重写的目的主要是：在调用原生方法之前做一些事情
                data.__proto__ = arrayMethods;
                // 如果数组中存在对象元素，也得让该对象也有响应式
                this.observeArray(data);// 开始改写数组的7个方法
            } else {
                this.walk(value);
            }
            // this.walk(data);
        }
        walk(data) {
            let keys = Object.keys(data);
            keys.forEach(key => {
                defineReactive(data, key, data[key]); // defineReactive在vue中是放在Vue.utils.defineReactive
            });
        }
    }
    ```

-   arrayMethods详情

    ```js
    /* note: 1、拿到数组原型里面的方法 */
    let oldArrayMethods = Array.prototype;
    
    /* note: 2、通过继承改写方法，如果没有改写方法，则使用数组的原生方法 */
    export let arrayMethods = Object.create(oldArrayMethods);
    
    let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
    methods.forEach(item => {
    	arrayMethods[item] = function (...args) {
    		// 在这里做我们拓展的逻辑
    		// 主要是针对于追加进来的对象添加get、set方法
    		let inserted;
    		switch (item) {
    			case 'push':
    			case 'unshift':
    				inserted = args;
    				break;
    			case 'splice':
    				inserted = args.slice(2); // arr.splice(1,0,{aaa: 11},{bbb: 22}),此时inserted为[{aaa: 11},{bbb: 22}]
    				break;
    			default:
    				break;
    		}
    		if (inserted) this.__ob__.observeArray(inserted);
    
    		// note: 3、做完我们自己的逻辑后，还要调用原来oldArrayMethods上的原生方法
    		const res = oldArrayMethods[item].apply(this, args);
    		return res;
    	};
    });
    
    /*
    	说明一下：__ob__这个属性代表那个劫持的数组，它的作用主要有两个：
    	①、给不同的模块提供this
    	②、标记当前数组是否被监视了
    */
    ```

## 六、数据代理

-   数据代理的设计前景是：用户使用vm._data来获取有些麻烦，我们希望可以通过vm.xxx 去取代vm.__data.xxx

-   src/state.js文件

    ```js
    function initData(vm) {
    	let data = vm.$options.data;
    	vm._data = data = typeof data === 'function' ? data.call(vm) : data;
    	// tag: 1、拿到data后，进行数据的劫持
    
    	// note: 实现属性代理：vm._data.xxx = vm.xxx
    	for (const key in data) {
    		myProxy(vm, '_data', key);
    	}
    	observe(data);
    }
    
    function myProxy(vm, data, key) {
    	Object.defineProperty(vm, key, {
    		get() {
    			return vm[data][key];
    		},
    		set(newValue) {
    			vm[data][key] = newValue;
    		},
    	});
    }
    ```

## 七、模板编译原理

-   ​	具体的编译流量称
    1.  把模板变成ast语法树
    2.  优化标记静态节点（patchFlag、BlockTree）
    3.  把ast变成render函数
    4.  虚拟DOM diff对比
    5.  调用*vm*._update(*vm*._render())将虚拟DOM转成真实DOM插入，并渲染到页面
-   


## 八、混入原理

​		

