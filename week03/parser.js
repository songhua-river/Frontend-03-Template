const EOF = Symbol('EOF');
function data(c) {
    //如果开标签开始，转到标签开始状态
    if (c === '<') {
        return tagOpen;
    } else if (c === EOF) {
        return;
    } else {
        return data
    }
}
function tagOpen(c) {
    //可能是标签结束，或自封闭标签,转到标签结束状态
    if (c === '/') {
        return endTagOpen;
    }
    // 如果有字母，转到标签名状态
    else if (c.match(/^[a-zA-Z]$/)) {
        return tagName(c);
    } else {
        return;
    }
}
function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        return tagName(c);
    } else if (c === '>') {

    }
    else if (c === EOF) {

    } else {

    }
}
function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }
    //标签名后面有/ 是自封闭标签
    else if (c == '/') {
        return selfClosingState;
    }
    //
    else if (c.match(/^[a-zA-Z]$/)) {
        return tagName;
    }
    // 标签结束回到默认状态
    else if (c == '>') {
        return data;
    } else {
        return tagName;
    }
}
function beforeAttributeName(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        return beforeAttributeName;
    } else if (c === '>') {
        return data;
    } else if (c === '=') {
        return beforeAttributeName;
    } else {
        return beforeAttributeName;
    }
}
function selfClosingState(c) {
    if (c === '>') {
        
    }
}
function parserHtml(html) {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    // state = state(EOF);
}

module.exports.parserHtml = parserHtml;;