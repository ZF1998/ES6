
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}

// 模板字符串
let str1 = `tempalte string`
let str2 = `this is ${str1}`

console.log(str2)

// 标签模板
// 函数的另一种调用方式，会把紧跟在函数名后面的模板字符串解析为多个参数，字符串将被放进一个数组中作为第一个参数，模板中需要解析的变量，在解析完成后跟在数组后面

let str3 = 'ECMAScript'
let r1 = func1`!!! Hello ${str3} oh!`

// 同等于

let r2 = func1(['!!! Hello ', ' oh!'], 'ECMAScript')

console.log(r1)

function func1(params) {
	console.log(arguments)
   let result = ''
	let i = 0

	while (i < params.length) {
		result += params[i++]
		if (i < arguments.length) {
			result += arguments[i]
		}
	}

	return result
}
