/*
 * @Descripttion: vue编译模板的原理
 * @Author: lukasavage
 * @Date: 2022-01-23 13:29:14
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-01-23 18:14:31
 */

// todo: 这里我们以 <div id="my">hello,<span>{{ str }}</span></div> 为例来解析

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 匹配标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 匹配类似 <my:xx></my:xx> 的标签
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute =
	/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的，例如 a='xxx' a=xxx  a="xxx"
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配双花括号语法 {{ xxx }}

export function compileToFunctions(template) {
	// todo: 将template编译成html
	/*
        具体做法：
            1、将html模板转换成ast语法书
            2、通过ast树重新生成代码
    */
	const ast = parseHTML(template);
	console.log(ast);
}

function parseHTML(html) {
	let root;
	let currentParent; // 用来记录当前的父节点
	let stacks = []; // 用于检测标签是否合法，例如<div><span></div></span>
	while (html) {
		// tag: 只要html为空，就一直解析
		const tag = html.indexOf('<');
		if (tag === 0) {
			// 说明肯定是标签,开始解析开始标签
			const startTagMatch = parseStartTag();
			if (startTagMatch) {
				start(startTagMatch.name, startTagMatch.attrs);
				continue;
			}
			// 处理结束标签
			const endTagMatch = html.match(endTag);
			if (endTagMatch) {
				advance(endTagMatch[0].length);
				// 将结束标签传入
				end(endTagMatch[1]);
				continue;
			}
		}
		let txt;
		if (tag > 0) {
			// 表示文本,先用txt存起来，再删除掉
			txt = html.slice(0, tag);
		}
		if (txt) {
			advance(txt.length);
			chars(txt);
		}
	}
	/**
	 * 截取字符串,之后更新html中的内容
	 * @param {number} n 从索引几开始
	 */
	function advance(n) {
		html = html.slice(n);
	}
	function parseStartTag() {
		const startTag = html.match(startTagOpen);
		if (startTag) {
			const match = {
				tagName: startTag[1],
				attrs: [],
			};
			advance(startTag[0].length); // 删除开始标签  id="my">hello,<span>{{ str }}</span></div>
			// note: 2、开始处理标签的属性
			// 如果直接是闭合标签，说明没有属性
			let end, attr;
			// 不是结尾标签，并且能匹配到属性
			while (
				!(end = html.match(startTagClose)) &&
				(attr = html.match(attribute))
			) {
				match.attrs.push({
					name: attr[1],
					value: attr[3] || attr[4] || attr[5],
				});
				advance(attr[0].length); // 去掉当前属性
			}
			if (end) {
				// 开始标签的 >
				advance(end[0].length);
				return match;
			}
		}
	}
	/* 解析开始标签 */
	function start(tagName, attrs) {
		// console.log('收到start标签了:', tagName, attrs);
		let element = createASTElement(tagName, attrs);
		if (!root) {
			root = element;
		}
		// 记录当前的父元素的ast
		currentParent = element;
		stacks.push(element);
	}

	/* 解析结束标签 */
	function end(tagName) {
		let element = stacks.pop();
		currentParent = stacks[stacks.length - 1]; // 去除栈中的最后一个
		if (currentParent) {
			element.parent = currentParent;
			currentParent.children.push(element);
		}
	}

	/* 解析标签的文本 */
	function chars(text) {
		// console.log('收到chars标签了:', text);
		text = text.replace(/\s/g, '');
		if (text) {
			currentParent.children.push({
				type: 3,
				text,
			});
		}
	}

	function createASTElement(tagName, attrs) {
		return {
			tag: tagName, // 标签名
			type: 1, // 元素类型
			children: [], // 孩子列表
			attrs, // 属性集合
			parent: null, // 父元素
		};
	}
    console.log(root);
	return root;
}
