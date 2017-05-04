#### 动态创建jQuery插件

 一.实现功能：
    1.基本功能：自适应式整屏分页功能的实现

    2.通过鼠标点击标签页转换分页，支持键盘上下左右键的转换分页，同样支持
       鼠标滚轮上下滑动转换分页
       
    3.切屏时的动画效果

    4.jQuery实现简单的组件开发

    5.本文创建的组件直接绑定在$.fn上，可以在Dom调用

 二.主要实现代码

    1.创建的分页的默认配置，用户可以修改其内容，来实现不同的内容
    ```
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
    ```

    2.创建对象的单例模式
    ```
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
    ```

    3.创建Dom中的用到的各种事件方法
    ```
    var PageSwitch = (function() { //以后可以根据需求改善pageSwitch对象
        function PageSwitch(element, options) {
            this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {})
            this.element = element;
            this.init(); //初始化插件
        }
        PageSwitch.prototype = { //定义插件共有方法
            //初始化的方法
            // 实现初始化dom结构，布局，分页及绑定事件
            init: function() {},
            //获取滑动页面的数量
            pagesCount: function() {
                return this.section.length;
            },
            //获取滑动的宽度（横屏）或高度（竖屏）
            SwitchLength: function() {
                return this.direction ? this.element.height() : this.element.width()
            },
            //向前滑动,上一页 
            prev: function() {},
            //向后滑动，向后一页
            next: function() {},

            //主要针对横屏情况进行页面布局
            _initLayout: function() {},
            //实现分页的dom结构及css样式
            _initPaging: function() {},
            //初始化插件事件
            _initEvent: function() {
                var me = this;
                // 页面的点击事件
                me.element.on("click", me.selectors.page + " li", function() {})

                //鼠标的滚轮事件
                me.element.on("mousewheel DOMMouseScroll", function(e) {})

                //键盘事件
                if (me.settings.keyboard) {
                    $(window).on("keydown", function(e) {})
                }
                //浏览器窗口变化事件
                $(window).resize(function() {})

                //分屏完成后的执行动画
                me.sections.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function() {}),
            //页面滚动
            _scrollPage: function() {}
        }
        return PageSwitch; //返回PageSwitch对象，重要！！！
    })();
    ```
    4.在html调用时，写法如下：
    ```
        <script>
            $("#container").PageSwitch({ //其中的值可以修改，以实现不同的效果
                index: 0, //分页页码
                easing: "ease", //分页动画的
                duration: 500,
                loop: false, //代表页面是否可以循环播放
                pagination: true, //代表页面是否分页
                keyboard: true, //是否能触发键盘事件
                direction: "vertical", //分页的方向，默认竖屏，横屏：“herizontal”
                callback: "" //翻页完成后的回调函数
            })
        </script>
    ```
