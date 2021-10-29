/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-10-13 14:26:51
 * @LastEditors: Telliex
 * @LastEditTime: 2021-10-13 16:41:46
 */

/**
 * @description: 类型检查
 * @param1 {any}
 * @return Boolean
 * @example: isOfType.string('11111')
 */
export const isOfType = (() => {
  // create a plain object with no prototype
  const type = Object.create(null)
  // check for null type
  type.null = (x:any) => x === null
  // check for undefined type
  type.undefined = (x:any) => x === undefined
  // check for nil type. Either null or undefined
  type.nil = (x:any) => type.null(x) || type.undefined(x)
  // check for strings and string literal type. e.g: 's', "s", `str`, new String()
  type.string = (x:any) => !type.nil(x) && (typeof x === 'string' || x instanceof String)
  // check for number or number literal type. e.g: 12, 30.5, new Number()
  type.number = (x:any) => !type.nil(x) &&
    (// NaN & Infinity have typeof "number" and this excludes that
      (!isNaN(x) && isFinite(x) &&
      typeof x === 'number'
      ) || x instanceof Number)
  // check for boolean or boolean literal type. e.g: true, false, new Boolean()
  type.boolean = (x:any) => !type.nil(x) && (typeof x === 'boolean' || x instanceof Boolean)
  // check for array type
  type.array = (x:any) => !type.nil(x) && Array.isArray(x)
  // check for object or object literal type. e.g: {}, new Object(), Object.create(null)
  type.object = (x:any) => ({}).toString.call(x) === '[object Object]'
  // check for provided type instance
  type.type = (x:any, X:any) => !type.nil(x) && x instanceof X
  // check for set type
  type.set = (x:any) => type.type(x, Set)
  // check for map type
  type.map = (x:any) => type.type(x, Map)
  // check for date type
  type.date = (x:any) => type.type(x, Date)

  return type
})()

/**
 * @description: 判断内容是否为空
 * @param1 {String | Object | Array | Map | Set}
 * @return Boolean
 */
export function isEmpty (x: any): boolean {
  if (Array.isArray(x) ||
    typeof x === 'string' ||
    x instanceof String
  ) {
    return x.length === 0
  }

  if (x instanceof Map || x instanceof Set) {
    return x.size === 0
  }

  if (({}).toString.call(x) === '[object Object]') {
    return Object.keys(x).length === 0
  }

  return false
}

/**
 * @description: 获取列表最后一项
 * @param1 {*}
 * @return {*}
 * @example: 示例代码
 */
export const lastItem = (list:any) :any => {
  if (Array.isArray(list)) {
    return list.slice(-1)[0]
  }

  if (list instanceof Set) {
    return Array.from(list).slice(-1)[0]
  }

  if (list instanceof Map) {
    return Array.from(list.values()).slice(-1)[0]
  }
}

/**
 * @description: 深度克隆对象
 * @param1 {*}
 * @return {*}
 * @example: 示例代码
 */
export function deepClone (obj: any):any {
  let clone = obj
  if (obj && typeof obj === 'object') {
    clone = new obj.constructor()

    Object.getOwnPropertyNames(obj).forEach(
      prop => (clone[prop] = deepClone(obj[prop]))
    )
  }
  return clone
}

/**
 * @description: 随机 ID 生成器 A
 * @param1 {}
 * @return {String}
 * @example: uniqueId()
 */
export const uniqueId = (() => {
  const id = (function * () {
    let mil = new Date().getTime()

    while (true) { yield mil += 1 }
  })()

  return () => id.next().value
})()

/**
 * @description: 随机 ID 生成器 B
 * @param1 {}
 * @return {String}
 * @example: uniqueIncrementingId()
 */
// create unique incrementing id starting from provided value or zero
// good for temporary things or things that id resets
export const uniqueIncrementingId = ((lastId = 0) => {
  const id = (function * () {
    let numb = lastId

    while (true) { yield numb += 1 }
  })()

  return (length = 12) => `${id.next().value}`.padStart(length, '0')
})()
/**
 * @description: 随机 ID 生成器 C
 * @param1 {}
 * @return {String}
 * @example: uniqueAlphaNumericId() => "k4i0k2vqbkh89ep1pqv5krgy"
 */
// create unique id from letters and numbers
export const uniqueAlphaNumericId = (() => {
  const heyStack = '0123456789abcdefghijklmnopqrstuvwxyz'
  const randomInt = () => Math.floor(Math.random() * Math.floor(heyStack.length))

  return (length = 24) => Array.from({ length }, () => heyStack[randomInt()]).join('')
})()

/**
 * @description: 顺序执行 promise
 * @param1 {*}
 * @return {*}
 * @example: 示例代码
 */
// export const asyncSequentializer = (() => {
//   const toPromise = (x:any) => {
//     if (x instanceof Promise) { // if promise just return it
//       return x
//     }

//     if (typeof x === 'function') {
//       // if function is not async this will turn its result into a promise
//       // if it is async this will await for the result
//       return (async () => await x())()
//     }

//     return Promise.resolve(x)
//   }

//   return (list:any) => {
//     const results:any[] = []

//     return list
//       .reduce((lastPromise, currentPromise) => {
//         return lastPromise.then(res => {
//           results.push(res) // collect the results
//           return toPromise(currentPromise)
//         })
//       }, toPromise(list.shift()))
//       // collect the final result and return the array of results as resolved promise
//       .then(res => Promise.resolve([...results, res]))
//   }
// })()
