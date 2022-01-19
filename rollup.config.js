/*
 * @Descripttion: rollup配置文件
 * @Author: lukasavage
 * @Date: 2022-01-19 21:02:58
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-19 21:18:03
 */
import serve from 'rollup-plugin-serve';
import babel from 'rollup-plugin-babel';

export default {
	input: './src/index.js',
	output: {
		format: 'umd', // 模块化类型，有esModule、commonjs、amd、cmd、umd等等，其主要作用是让window上有一个window.Vue
		name: 'Vue', // 全局变量的名字
		file: 'dist/umd/vue.js', // 打包输出后的文件名
		sourcemap: true, // 开启调试
	},
    plugins: [
        babel({      // 告诉rollup用babel来转译
            exclude: 'node_modules/**', // node_modules下的所有文件都不需要转译
            
        }),
        serve({
            open: true,   // 自动打开浏览器
            port: 3001,   // 默认端口号
            contentBase: '',   // 表示路径以当前目录为标准
            openPage: '/index.html',    // 默认打开的页面
        })
    ]
};
