/*
 * @Descripttion: vue编译模板的原理
 * @Author: lukasavage
 * @Date: 2022-01-23 13:29:14
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-25 21:46:17
 */

import { generate } from './generate';
import { parseHTML } from './parse';

export function compileToFunctions(template) {
	// todo: 将template编译成html
	/*
        具体做法：
            1、将html模板转换成ast语法书
            2、通过ast树重新生成代码
            3、todo: 优化静态节点
            4、通过树生成代码
    */
	const ast = parseHTML(template);
	// todo: 优化静态节点

	// 4.通过树生成代码
	const code = generate(ast);
	console.log(code);
	let render = new Function(`with(this){return ${code}}`);
	return render;
}
