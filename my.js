/**
 * Created by Daniel .
 */
function $(id) {
    return document.getElementById(id);
}

function show(obj) {
    obj.style.display = "block";
}

function hide(obj) {
    obj.style.display = "none";
}

//滚动 scroll_json().left  scroll_json().top
function scroll_json() {
    if (window.pageYOffset != null) {
        //不兼容IE6/7/8
        return {
            left: window.pageXOffset, top: window.pageYOffset
        }
    } else if (document.compatMode == "CSS1Compat") {
        //声明了 <!DOCTYPE html>
        return {
            left: document.documentElement.scrollLeft, top: document.documentElement.scrollTop
        }
    } else {
        //没有声明 <!DOCTYPE html>
        return {
            left: document.body.scrollLeft, top: document.body.scrollTop
        }
    }
}

//可视区域 client_json().width  client_json().height
function client_json() {
    if (window.innerWidth != null) {
        //不兼容IE6/7/8
        return {width: window.innerWidth, height: window.innerHeight}
    } else if (document.compatMode == "CSS1Compat") {
        //声明了 <!DOCTYPE html>
        return {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}
    } else {
        //没有声明 <!DOCTYPE html>
        return {width: document.body.clientWidth, height: document.body.clientHeight}
    }
}

//阻止冒泡 stop_mp(event)
function stop_mp(event) {
    var event = event || window.event;
    if (event && event.stopPropagation) {
        event.stopPropagation(); //不兼容IE6/7/8
    } else {
        event.cancelBubble = true; //兼容IE6/7/8
    }
}


//字符串长度 传入参数str
function getStringLength(str) {
    //alert(str.length); //nihao你好  长度是7
    //而汉字是两个字节,所以我们想要的结果是 5+2+2=9
    var Len = 0; //声明 长度的变量
    for (i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127) {
            //汉字
            Len = Len + 2;
        } else {
            Len = Len + 1;
        }
    }
    return Len;
}

//获取选中文本 getText()
function getText() {
    var mtxt = "";
    if (window.getSelection) {
        mtxt = window.getSelection().toString();
    } else {
        mtxt = document.selection.createRange().text;
    }
    return mtxt;
}


// 匀速动画 animation(obj,json)    //k属性  json[k]值 可改变多个属性
//调用方法animation(box, {left: 400, top: 400});
//透明度调用方法animation(box, {opacity: 0.8}); 0.0-1.0
//堆叠顺序animation(box, {zIndex: 9999});

function animation(obj, json) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var flag = true; //改变多个属性 就加flag
        //遍历json
        for (var k in json) {
            //k属性  json[k]值
            //获取属性
            var currentStyle = parseInt(getStyle(obj, k)); //取整 去掉px
            // console.log(currentStyle);
            var step = 0;
            if (json[k] > currentStyle) {
                step = 10;
            } else {
                step = -10;
            }
            //判断 json中是否有opacity属性
            if (k == "opacity") {
                //判断浏览器是否支持opacity
                if ("opacity" in obj.style) {
                    //谷歌
                    obj.style.opacity = json[k];
                } else {
                    //IE 6/7/8
                    obj.style.filter = "alpha(opacity = " + json[k] * 100 + ")";
                    // console.log("ie6/7/8");
                }
            } else if (k == "zIndex") {
                obj.style.zIndex = json[k];
            } else {
                obj.style[k] = currentStyle + step + "px";
            }

            var result = Math.abs(json[k] - currentStyle);
            if (result <= 10) {
                obj.style[k] = json[k] + "px";
            } else {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(obj.timer);
            // alert("结束");
        }

    }, 30)
}


// 缓动动画 Slow_animation(obj,json,callback)    //k属性  json[k]值 可改变多个属性
//调用方法Slow_animation(box, {left: 400, top: 400,opacity:0.5,zIndex:2},function () { });
//callback() 回调函数
function Slow_animation(obj, json, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var flag = true;  //改变多个属性 就加flag
        //遍历 json
        for (var k in json) {
            //k属性  json[k]值
            var currentStyle = 0; //取整 去掉px
            var step = 0;
            if (k=="opacity"){
                //console.log(typeof getStyle(obj, k));
                currentStyle = Math.round(parseFloat(getStyle(obj, k))*100) || 0; //parseFloat 将字符串转化为数值,然后四舍五入
                //IE 6/7/8 无法获取 透明度的值, currentStyle =0;
                step = (json[k]*100 - currentStyle) / 10;
            }else {
                 currentStyle = parseInt(getStyle(obj, k)); //取整 去掉px
                 step = (json[k] - currentStyle) / 10;
            }
            if (step > 0) {
                step = Math.ceil(step);
            } else {
                step = Math.floor(step);
            }
            //判断 json中是否有opacity属性
            if (k == "opacity") {
                //判断浏览器是否支持opacity
                if ("opacity" in obj.style) {
                    //谷歌
                    obj.style.opacity = (currentStyle+step)/100;
                } else {
                    //IE 6/7/8 无法获取 透明度的值
                    obj.style.filter = "alpha(opacity = " + json[k]*100 + ")";
                    // console.log("ie6/7/8");
                }
            } else if (k == "zIndex") {
                //判断 json中是否有zIndex属性
                obj.style.zIndex = json[k];
            } else {
                obj.style[k] = currentStyle + step + "px";
            }
            //console.log(currentStyle + "," + step);
            if (step != 0) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(obj.timer);
            if (callback) {
                callback();
            }
            // alert("结束");
        }

    }, 30);
}

//获得当前CSS属性函数 getStyle(obj,attr)  attr属性
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr]; //返回 字符串
        //IE Opera
    } else {
        //谷歌
        return window.getComputedStyle(obj, null)[attr]; //返回 字符串
    }
}











