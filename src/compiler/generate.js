/*
 * @Descripttion: 通过ast语法树生成render函数
 * @Author: lukasavage
 * @Date: 2022-01-24 20:40:17
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-25 09:41:06
 */

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配双花括号语法 {{ xxx }}

export function generate(ast) { 
	/* 
        note: 通过ast语法树生成如下结构↓↓↓
        <div id="my">hello,<span>{{ str }}</span></div>

        render() {
            return _c('div', {id: 'my'}, _v('hello,'),_c('span', undefined, _s('s')))
        }

    */
	function gen(node) {
		if (node.type === 1) {
			// 说明是元素
			return generate(node);
		} else {
			let txt = node.text;
			if (!defaultTagRE.test(txt)) {
				// 如果是普通文本(不带双花括号)
				return `_v(${JSON.stringify(txt)})`;
				// 处理_v("{{str}}")、_v("呵呵 {{str}}"),将其转换成_v(_s(str))、_v('呵呵 ' + _s(str))
			}
			let tokens = []; // 用此数组存放每一段上面的代码
			let lastIndex = (defaultTagRE.lastIndex = 0); // 如果正则是全局模式，默认test指针会指向1，所以需要将lastIndex置为0
			let match, index; // 每次匹配的结果
			while ((match = defaultTagRE.exec(txt))) {
                index = match.index; // 保存匹配到的索引
				if (index > lastIndex) {
					tokens.push(JSON.stringify(txt.slice(lastIndex, index)));
				}
				tokens.push(`_s(${match[1].trim()})`);
				lastIndex = index + match[0].length;
			}
			// '}}' 后面的内容处理
			if (lastIndex < txt.length) {
				tokens.push(JSON.stringify(txt.slice(lastIndex)));
			}
			return `_v(${tokens.join('+')})`;
		}
	}
	function genChildren(el) {
		const children = el.children;
		if (children) {
			// 将所有转化后的儿子用逗号拼接起来
			return children.map(item => gen(item)).join(',');
		}
	}

	let children = genChildren(ast);
	let renderChild = children ? `,${children}` : '';
	let code = `_c('${ast.tag}',${
		ast.attrs.length ? String(genProps(ast.attrs)) : 'undefined'
	}${renderChild})`;

	return code;
}

function genProps(attrs) {
	let str = '';
	for (let i = 0; i < attrs.length; i++) {
		const values = attrs[i];
		if (values.name === 'style') {
			let obj = {}; // 对样式做处理
			values.value.split(';').forEach(item => {
				let [key, value] = item.split(':');
				obj[key] = value;
			});
			values.value = obj;
		}
		str += `${values.name}:${JSON.stringify(values.value)},`;
	}

	return `{${str.slice(0, -1)}}`;
}



