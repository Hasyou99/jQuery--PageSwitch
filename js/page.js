(function($) {
    // var privateFun = function() { //定义插件的私有方法

    // }

    var _prefix = (function(temp) { //获取浏览器前缀，考虑浏览器的兼容性
        var arr = ["webkit", "Moz", "o", "ms"]
        props = ""
        for (var i in arr) {
            props = arr[i] + "Transition"
            if (temp.style[props] !== undefined) {
                return "-" + arr[i].toLowerCase() + "-"
            }
        }
        return false;
    })(document.createElement(PageSwitch))

    var PageSwitch = (function() { //以后可以根据需求改善pageSwitch对象
        function PageSwitch(element, options) {
            this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {})
            this.element = element;
            this.init(); //初始化插件
        }
        PageSwitch.prototype = { //定义插件共有方法
            //初始化的方法
            // 实现初始化dom结构，布局，分页及绑定事件
            init: function() {
                var me = this;
                me.selectors = me.settings.selectors;
                me.sections = me.element.find(me.selectors.sections)
                me.section = me.sections.find(me.selectors.section);

                me.canScroll = true;

                me.direction = me.settings.direction == "vertical" ? true : false;
                me.pagesCount = me.pagesCount();
                me.index = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;

                if (!me.direction) {
                    me._initLayout()
                }

                if (me.settings.pagination) {
                    me._initPaging()
                }

                me._initEvent();
            },
            //获取滑动页面的数量
            pagesCount: function() {
                return this.section.length;
            },
            //获取滑动的宽度（横屏）或高度（竖屏）
            SwitchLength: function() {
                return this.direction ? this.element.height() : this.element.width()
            },
            //向前滑动,上一页 
            prev: function() {
                var me = this;
                if (me.index > 0) {
                    me.index--;
                } else if (me.settings.loop) {
                    me.index = me.pagesCount - 1
                }
                me._scrollPage()
            },
            //向后滑动，向后一页
            next: function() {
                var me = this;
                if (me.index < me.pagesCount) {
                    me.index++;
                } else if (me.settings.loop) {
                    me.index = 0
                }
                me._scrollPage()
            },

            //主要针对横屏情况进行页面布局
            _initLayout: function() {
                var me = this; //this指向pageSwitch对象
                var width = (me.pagesCount * 100) + "%",
                    cellWidth = (100 / me.pagesCount).toFixed(2) + "%"
                me.sections.width(width);
                me.section.width(cellWidth).css("float", "left");
            },
            //实现分页的dom结构及css样式
            _initPaging: function() {
                var me = this,
                    pageClass = me.selectors.page.substring(1);
                me.activeClass = me.selectors.active.substring(1);
                var pageHtml = "<ul class=" + pageClass + ">"
                for (var i = 0; i < me.pagesCount; i++) {
                    pageHtml += "<li></li>"
                }
                pageHtml += "</ul>"
                console.dir(pageHtml)
                me.element.append(pageHtml)

                var pages = me.element.find(me.selectors.page)
                me.pageItem = pages.find("li")
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if (me.direction) {
                    pages.addClass("vertical")
                } else {
                    pages.addClass("horizontal")
                }
            },
            //初始化插件事件
            _initEvent: function() {
                var me = this;
                // 页面的点击事件
                me.element.on("click", me.selectors.page + " li", function() {
                    me.index = $(this).index();
                    // console.log(me.index)
                    me._scrollPage();
                })

                //鼠标的滚轮事件
                me.element.on("mousewheel DOMMouseScroll", function(e) {
                    if (me.canScroll) {
                        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;

                        if (delta > 0 && (me.index && !me.settings.loop || me.settings.loop)) {
                            me.prev() //上一页
                        } else if (delta < 0 && (me.index < (me.pagesCount - 1) && !me.settings.loop || me.settings.loop)) {
                            me.next() //下一页
                        }
                    }
                })

                //键盘事件
                if (me.settings.keyboard) {
                    $(window).on("keydown", function(e) {
                        var keyCode = e.keyCode
                        if (keyCode == 37 || keyCode == 38) {
                            me.prev()
                        } else if (keyCode == 39 || keyCode == 40) {
                            me.next()
                        }
                    })
                }
                //浏览器窗口变化事件
                $(window).resize(function() {
                    var currentLength = me.SwitchLength(),
                        offset = me.settings.direction ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;
                    if (Math.abs(offset) > currentLength / 2 && me.index < (me.pagesCount - 1)) {
                        me.index++;
                    }
                    if (me.index) {
                        me._scrollPage();
                    }
                })

                //分屏完成后的执行动画
                me.sections.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function() {
                    me.canScroll = true;
                    if (me.settings.callback && $.type(me.settings.callback) == "function") {
                        me.setting.callback()
                    }
                });
            },

            _scrollPage: function() {
                var me = this,
                    dest = me.section.eq(me.index).position()
                console.log(dest)
                if (!dest) return;

                me.canScroll = false;

                if (_prefix) {
                    me.sections.css(_prefix + "transition", "all " + me.settings.duration + "ms " + me.settings.easing)
                    var translate = me.direction ? "translateY(-" + dest.top + "px)" : "translateX(-" + dest.left + "px)";
                    console.log(dest.top)
                    me.sections.css(_prefix + "transform", translate)
                } else {
                    var animateCss = me.direction ? { top: -dest.top } : { left: -dest.left };
                    me.sections.animate(animateCss, me.settings.duration, function() {
                        me.canScroll = true;
                        if (me.settings.callback && $.type(me.settings.callback) === "function") {
                            me.setting.callback()
                        }
                    })
                }

                if (me.settings.pagination) {
                    me.pageItem.eq(me.index).addClass(me.activeClass).siblings("li").removeClass(me.activeClass)
                }
            }
        }
        return PageSwitch; //返回PageSwitch对象，重要！！！
    })();

    $.fn.PageSwitch = function(options) { //单例模式
        return this.each(function() {
            var me = $(this),
                instance = me.data("PageSwitch")
            if (!instance) {
                instance = new PageSwitch(me, options)
                me.data("PageSwitch", instance)
            }
            //判断传递参数options的类型，如果是字符串，用户就可以直接调用
            //pageSwitch.prototype内的方法
            if ($.type(options) === "string") return instance[options]();
        });
    }

    $.fn.PageSwitch.defaults = {
        selectors: { //可以修改页面上的各块的class名
            sections: ".sections",
            section: ".section",
            page: ".pages",
            active: ".active"
        },
        index: 0, //分页页码
        easing: "ease", //分页动画的
        duration: 500,
        loop: false, //代表页面是否可以循环播放
        pagination: true, //代表页面是否分页
        keyboard: true, //是否能触发键盘事件
        direction: "vertical", //分页的方向，默认竖屏，横屏：“herizontal”
        callback: "" //翻页完成后的回调函数
    }

    $(function() {
        $("[data-PageSwitch]").PageSwitch() //初始化pageSwitch插件
    })

})(jQuery)