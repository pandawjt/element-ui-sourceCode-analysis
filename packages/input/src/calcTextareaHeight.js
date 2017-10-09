/**
 * 本js文件用来计算textarea的高度;
 */
let hiddenTextarea;

//隐藏样式
const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`;

const CONTEXT_STYLE = [
    'letter-spacing', //字符间距
    'line-height', //行高
    'padding-top', //上padding
    'padding-bottom', //下padding
    'font-family', //字体类型
    'font-weight', //字体粗细
    'font-size', //字体大小
    'text-rendering', //渲染字体方式(不常用)
    'text-transform', //文字大小写
    'width', //宽度
    'text-indent', //缩进
    'padding-left', //左padding
    'padding-right', //有padding
    'border-width', //边框宽度
    'box-sizing' //盒子大小标准
];


/**
 * 获取目标元素的样式(box-sizing/padding-bottom/padding-top/border-bottom-width/border-top-width/CONTEXT_STYLE对应的样式值)
 * @param {*目标元素} targetElement 
 */
function calculateNodeStyling(targetElement) {
    const style = window.getComputedStyle(targetElement);

    const boxSizing = style.getPropertyValue('box-sizing');

    const paddingSize = (
        parseFloat(style.getPropertyValue('padding-bottom')) +
        parseFloat(style.getPropertyValue('padding-top'))
    );

    const borderSize = (
        parseFloat(style.getPropertyValue('border-bottom-width')) +
        parseFloat(style.getPropertyValue('border-top-width'))
    );

    const contextStyle = CONTEXT_STYLE
        .map(name => `${name}:${style.getPropertyValue(name)}`)
        .join(';');

    return { contextStyle, paddingSize, borderSize, boxSizing };
}

export default function calcTextareaHeight(
    targetElement,
    minRows = null,
    maxRows = null
) {
    if (!hiddenTextarea) {
        hiddenTextarea = document.createElement('textarea');
        document.body.appendChild(hiddenTextarea);
    }

    let {
        paddingSize,
        borderSize,
        boxSizing,
        contextStyle
    } = calculateNodeStyling(targetElement);

    hiddenTextarea.setAttribute('style', `${contextStyle};${HIDDEN_STYLE}`);
    hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';

    let height = hiddenTextarea.scrollHeight;

    if (boxSizing === 'border-box') {
        height = height + borderSize;
    } else if (boxSizing === 'content-box') {
        height = height - paddingSize;
    }

    hiddenTextarea.value = '';
    let singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

    if (minRows !== null) {
        let minHeight = singleRowHeight * minRows;
        if (boxSizing === 'border-box') {
            minHeight = minHeight + paddingSize + borderSize;
        }
        height = Math.max(minHeight, height);
    }
    if (maxRows !== null) {
        let maxHeight = singleRowHeight * maxRows;
        if (boxSizing === 'border-box') {
            maxHeight = maxHeight + paddingSize + borderSize;
        }
        height = Math.min(maxHeight, height);
    }

    return { height: height + 'px' };
};