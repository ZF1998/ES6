/**
 * 块级作用域及全局作用域 
 * 使用var声明的变量和函数声明语句的作用域都会提升
 */
{
	let a = 1;
	{
		let b = 2;
		var _c = 3;
		// console.log(a); // 内部代码块可以访问外部代码块声明的变量
	}
	// console.log(b); 报错 let 声明的变量只作用于当前声明的代码块内
	// console.log(_c );
}

function f() {  
	console.log('I am outside!');
}

(function () {
	/** 
	 * 在代码块中声明的函数会被提升到当前函数作用域的头部
	 * 外部函数 f 因此被覆盖
	 * 相当于在函数内第一行写了一个 var f;
	*/
	if (false) {
		// 此处再次声明 f函数
		function f() {  
			console.log('I am inside!');
		}
	}
	// f() 此处报错
})()

/**
 * 解构赋值
 */
// 数组解构赋值
let [a1, b1, c1] = [1, 2, 3]
// 对象的解构赋值
let {foo} = {foo: 'oh'}
let {bar: b2} = {bar: 'bar'}


// 模板字符串
let template = `
<ul>
  <% if (data.judge) { %>
  	<% for(let i=0; i < data.supplies.length; i++) { %>
    	<li><%= data.supplies[i] %></li>
  	<% } %>
  <% } %>
</ul>
`;

// 实现模板编译函数
function view(tmp, data) {
	let evalExpr = /<%=(.+?)%>/g;
	let expr = /<%([\s\S]+?)%>/g;
	let html = '';

	function echo(str) {
		html += str;
	}

	tmp = 'echo(`' + tmp.replace(evalExpr, '`);echo($1);echo(`')
		.replace(expr, '`);$1echo(`') + '`)';
	console.log(tmp);
	eval(tmp);

	return html;
}

// console.log(view(template, {supplies: ['a1', 'b2', 'c3'], judge: true})); 

let sender = '<input>';
// func`very happy today`;
// func('very happy today')

function saferHTML(str) {
	return String(str).replace(/&/g, "&amp;")
	.replace(/</g, "&lt;")
	.replace(/>/g, "&gt;");
}

function func() {  
	console.log(arguments);
}

function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$&"); 
    //$&表示整个被匹配的字符串
}

/**
 * Symbol 新增的JS类型
 * 本身是一个构造函数提供一个字符串参数，Symbol类型的变量与任何变量都不相等除了其自身
 */
let a2 = Symbol('symbol');
let b3 = Symbol('symbol');
// console.log(a2 == b3);
// console.log(a2 == a2);

/**
 * 使用 Symbol.for 方法，初始传入一个字符串作为全局注册的 Key 之后使用 Symbol.for 传入同样的
 * Key 返回的 Symbol 值是相等的 
 */
let a3 = Symbol.for('symbol');
let b4 = Symbol.for('symbol');
// console.log(a3 == b4);
// 获取初始化传入的 Key
// console.log(Symbol.keyFor(a3), Symbol.keyFor(b4));

// 使用 Symboy 类型的值作为对象的属性
let a4 = Symbol('msg');
let obj1 = {
	[Symbol.for('name')]: 'javascript',
	[a4]: 'you don,t konw javascript!!!'
};
// console.log(obj1[Symbol.for('name')], obj1[a4]);

// 获取对象使用 Symbol 声明的属性 以下两句执行结果一样
// console.log(Object.getOwnPropertySymbols(obj1));
// console.log(Reflect.ownKeys(obj1));

// 内置的 Symbol 值
class Obj2 {
	constructor() {
		this['0'] = 4;
		this['1'] = 5;
		this.length = 2;
	}
	/**
	 * 在使用 instanceof 判断是否为某个对象时，语言内部实际是通过
	 * 调用 obj[Symbol.hasInstance] 方法返回的 bool 值来判断的
	 */
	[Symbol.hasInstance] (target) {
		return target instanceof Array;
	}
	/**
	 * 控制对象是否能够被展开，Array 对象的 Symbol.isConcatSpreadable 默认为 undefind(默认值),
	 * 该属性为 True 时也有展开效果，类似数组的对象设置这个属性为 True，在作为 [].concat() 的参数时,
	 * 内部会调用传入对象的 [Symbol.isConcatSpreadable]属性，返回的结果数组是展开的
	 */
	get [Symbol.isConcatSpreadable] () {
		return true;
	}
}

let obj2 = new Obj2();
// console.log([] instanceof obj2); // true
// console.log(obj2[Symbol.isConcatSpreadable]);
// console.log([1, 2, 3].concat(obj2)); // [ 1, 2, 3, 4, 5 ]

class MyArray extends Array {
	/**
	 * Symbol.species 属性决定在调用某些方法时返回的衍生对象是哪一个类的实例
	 * 例如数组的 map 方法会返回一个新的数组。这里 MyArray 继承自 Array，在调用 map 方法后返回的实例
	 * 的类型是 MyArray 而不是 Array
	 */
	constructor() {
		super(...arguments);
	}

	static get [Symbol.species]() {
		return Array;
	}

}

let myArray = new MyArray(1, 2, 3, 4);

// let arr2 = myArray.map(x => x);
// console.log(arr2 instanceof MyArray); // false
// console.log(arr2 instanceof Array); // true


let obj3 = {
	/**
	 *  在使用 for of 遍历数组 和 对数组进行结构操作 时会调用 数组的 Symbol.iterator 属性，该属性
	 * 	返回一个遍历器。普通对象实现这个属性也可以使用 of 遍历操作 和 解构符操作
	 */
	[Symbol.iterator]: function* () {
		yield 1;
		yield 2;
		yield 3;
	}
}

// console.log(...obj3);

for (let n of obj3) {
	// console.log(n);
}

function random(a, b, m) {
	a = 4 * a + 1;
	b = 2 * b + 1;
	let x1 = Math.floor(Math.random() * 10) + Date.now();
	return (a * x1 + b) % m;	
}
let randomArr = [];

for (let i = 0; i < 50; i++) {
	randomArr.push(random(i + 1, i, 100));
}

let set1 = new Set(randomArr);


// Set
let set = new Set([1, 2, 3]);
let [a, b, c] = set;
// console.log(a, b, c);


// Map
let map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
]);
([
    [, a],
    [, b],
    [, c]
] = map);
// console.log(a, b, c);


// Iterator
let obj = {
    data: [1, 2, 3, 4, 5],
    * [Symbol.iterator]() {
        for (let i = 0; i < this.data.length; i++) {
            yield this.data[i];
        }
    }
}
let arr = [...obj];
([a, b, c, d] = obj);

for(let [v, k] of arr.entries()) {
    // console.log(v, k);
}

// Generator 迭代函数
/**
 *  执行函数后并不会直接执行内部代码，而是返回一个迭代对象(Generator)，通过手动调用 next 方法执行函数
 *  内部代码
 */

// 把 Generator 函数赋给对象，使该对象具有 Iterator 接口，任意一个对象的 Iterator 方法都会返回一个
// 生成器
Object.assign(Object.prototype, {
	[Symbol.iterator]: function* () {
		for (let k of Object.keys(this)) {
			/**
			 * yield 只能出现在 Generator 函数内部，可以看成一个暂停点，每一次调用都会从上一个
			 * yield 关键字开始，直到下一个 yield暂停，如果没有则下一次调用 next 方法会返回{value: 
			 * undefind, done: true}对象，一般调用 next 方法返回的对象的 value属性的值为
			 * yield 关键字右边的值
			 */
			yield [k, this[k]];
		}
	}
});

function* gen() {
	yield 1;
	yield 2;
	yield 3;
}

let g = gen();
g.next(); // {value: 1, done: false}
g.next(); // {value: 2, done: false}
g.next(); // {value: 3, done: false}
g.next(); // {value: undefind, done: true}

// for of 会自动执行 Generator 函数的 next方法 实现遍历
for (let [k, v] of {'a': 1, 'b': 2}) {
	// console.log(k, '-', v);
}

function* gen2() {
	// 第一次调用 next 方法从这里开始执行并没有 yield 关键字，所以传入参数是无效的
	//             ⬇ 从这里开始函数第一次暂停
	//             ⬇ 再次调用 next 方法,从这里恢复执行，并把 yield 替换为传入的参数
	let n = 1 + (yield 2); // 此处必须要加括号，不然报错 SyntaxError: Unexpected identifier
	
	// return 语句返回的值也会作为调用 next 方法返回的对象的value属性的值，但此时 done 属性为 true
	return n;
}

let g2 = gen2();
// 第一次执行 next 方法传入参数是无效的，因为执行开始点并没有 yield 关键字
g2.next(2); // {value: 2, done: false}
/**
 * next 方法接受一个参数作为替换在代码开始执行位置的 yield 关键字, 
 * 可以理解为把 yield 关键字转换这个参数
 */
g2.next(4); // {value: 5, done: true}

// 简单的写了一下类似 koa 的中间件调用方式
function Factory() {

	if (this == (typeof window !== 'undefined'?window:(typeof require === 'function' && typeof process === 'object' && typeof global === 'object')?global:this)) return;
	
	this.query = [];
	this.length = 0;

	const that = this;
	
	function next(cur) {

		return function (...args) {
			let obj = that.query[cur];
			if (!obj) return;
			obj.func(next(cur + 1), ...args);
		}
		
	}

	this.ues = function (func) {
		let obj = {'func': func, 'index': this.length ++};
		if (!this.query.length) {
			setTimeout(func, 0, next(this.length));
		}
		this.query.push(obj);
	}


}


// function* gen(number) {
//     for(let i = 0; i <= number; i++) {
//         yield i;
//     }
//     yield* gen2(number);
// }

// function* gen2(number) {
//     for(let i = number; i >= 0; i--) {
//         yield i;
//     }
// }

// 展平多维数组
function unzip(tree) {
	
    function* iterTree(t) {
        if(Array.isArray(t)) {
            for(let v of t) {
                yield* iterTree(v);
            }
        }
        else yield t;
	 }
	 
	 if (Array.isArray(tree)) return [...iterTree(tree)];
	 
    return -1;
}
// console.log(unzip([[1, 2, 3], [4, [5, [6, 7], [8, 9, [10] ] ] ] ]));
