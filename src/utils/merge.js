//obj.hasOwnProperty(prop) 返回一个布尔值,obj是否有prop属性(不继承/特有的自身属性/不包括原型链上的属性)
//hasOwnProperty与 in 不同,in会查找原型链上的属性

/**
 * 合并对象,将多个对象参数合并为一个对象
 * @param {*目标对象(第一个参数)} target 
 */
export default function(target) {
    //从第二个元素开始
    for (let i = 1, j = arguments.length; i < j; i++) {
        let source = arguments[i] || {};
        for (let prop in source) {
            if (source.hasOwnProperty(prop)) {
                let value = source[prop];
                if (value !== undefined) {
                    target[prop] = value;
                }
            }
        }
    }

    return target;
};