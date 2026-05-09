$(function () {
    /**
     * 添加文章卡片hover效果.
     */
    let articleCardHover = function () {
        let animateClass = 'animated pulse';
        $('article .article').hover(function () {
            $(this).addClass(animateClass);
        }, function () {
            $(this).removeClass(animateClass);
        });
    };
    articleCardHover();

    /*菜单切换*/
    $('.sidenav').sidenav();

    /* 修复文章卡片 div 的宽度. */
    let fixPostCardWidth = function (srcId, targetId) {
        let srcDiv = $('#' + srcId);
        if (srcDiv.length === 0) {
            return;
        }

        let w = srcDiv.width();
        if (w >= 450) {
            w = w + 21;
        } else if (w >= 350 && w < 450) {
            w = w + 18;
        } else if (w >= 300 && w < 350) {
            w = w + 16;
        } else {
            w = w + 14;
        }
        $('#' + targetId).width(w);
    };

    /**
     * 修复footer部分的位置，使得在内容比较少时，footer也会在底部.
     */
    let fixFooterPosition = function () {
        $('.content').css('min-height', window.innerHeight - 165);
    };

    /**
     * 修复样式.
     */
    let fixStyles = function () {
        fixPostCardWidth('navContainer');
        fixPostCardWidth('artDetail', 'prenext-posts');
        fixFooterPosition();
    };
    fixStyles();

    /*调整屏幕宽度时重新设置文章列的宽度，修复小间距问题*/
    $(window).resize(function () {
        fixStyles();
    });

    /*初始化瀑布流布局*/
    $('#articles').masonry({
        itemSelector: '.article'
    });

    AOS.init({
        easing: 'ease-in-out-sine',
        duration: 700,
        delay: 100
    });

    /*文章内容详情的一些初始化特性*/
    let articleInit = function () {
        $('#articleContent a').attr('target', '_blank');

        $('#articleContent img').each(function () {
            let imgPath = $(this).attr('src');
            $(this).wrap('<div class="img-item" data-src="' + imgPath + '" data-sub-html=".caption"></div>');
            // 图片添加阴影
            $(this).addClass("img-shadow img-margin");
            // 图片添加字幕
            let alt = $(this).attr('alt');
            let title = $(this).attr('title');
            let captionText = "";
            // 如果alt为空，title来替
            if (alt === undefined || alt === "") {
                if (title !== undefined && title !== "") {
                    captionText = title;
                }
            } else {
                captionText = alt;
            }
            // 字幕不空，添加之
            if (captionText !== "") {
                let captionDiv = document.createElement('div');
                captionDiv.className = 'caption';
                let captionEle = document.createElement('b');
                captionEle.className = 'center-caption';
                captionEle.innerText = captionText;
                captionDiv.appendChild(captionEle);
                this.insertAdjacentElement('afterend', captionDiv)
            }
        });
        $('#articleContent, #myGallery').lightGallery({
            selector: '.img-item',
            // 启用字幕
            subHtmlSelectorRelative: true
        });

        // progress bar init
        const progressElement = window.document.querySelector('.progress-bar');
        if (progressElement) {
            new ScrollProgress((x, y) => {
                progressElement.style.width = y * 100 + '%';
            });
        }
    };
    articleInit();

    $('.modal').modal();

    /*回到顶部*/
    $('#backTop').click(function () {
        $('body,html').animate({scrollTop: 0}, 400);
        return false;
    });

    /*监听滚动条位置*/
    let $nav = $('#headNav');
    let $backTop = $('.top-scroll');
    // 当页面处于文章中部的时候刷新页面，因为此时无滚动，所以需要判断位置,给导航加上绿色。
    showOrHideNavBg($(window).scrollTop());
    $(window).scroll(function () {
        /* 回到顶部按钮根据滚动条的位置的显示和隐藏.*/
        let scroll = $(window).scrollTop();
        showOrHideNavBg(scroll);
    });

    function showOrHideNavBg(position) {
        let showPosition = 100;
        if (position < showPosition) {
            $nav.addClass('nav-transparent');
            $backTop.slideUp(300);
        } else {
            $nav.removeClass('nav-transparent');
            $backTop.slideDown(300);
        }
    }

    	
	$(".nav-menu>li").hover(function(){
		$(this).children('ul').stop(true,true).show();
		 $(this).addClass('nav-show').siblings('li').removeClass('nav-show');
		
	},function(){
		$(this).children('ul').stop(true,true).hide();
		$('.nav-item.nav-show').removeClass('nav-show');
	})
	
    $('.m-nav-item>a').on('click',function(){
            if ($(this).next('ul').css('display') == "none") {
                $('.m-nav-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(100);
                $(this).parent('li').addClass('m-nav-show').siblings('li').removeClass('m-nav-show');
            }else{
                $(this).next('ul').slideUp(100);
                $('.m-nav-item.m-nav-show').removeClass('m-nav-show');
            }
    });

    // 初始化加载 tooltipped.
    $('.tooltipped').tooltip();

    /* 文章页分类侧边栏 - 移动端切换 */
    var $sidebar = $('#categorySidebar');
    var $overlay = $('#sidebarOverlay');
    var $toggleBtn = $('#sidebarToggle');
    var $closeBtn = $('#sidebarClose');

    function openSidebar() {
        $sidebar.addClass('open');
        $overlay.addClass('show');
        $('body').css('overflow', 'hidden');
    }
    function closeSidebar() {
        $sidebar.removeClass('open');
        $overlay.removeClass('show');
        $('body').css('overflow', '');
    }

    $toggleBtn.on('click', function(e) {
        e.stopPropagation();
        if ($sidebar.hasClass('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    $closeBtn.on('click', function(e) {
        e.stopPropagation();
        closeSidebar();
    });

    $overlay.on('click', function() {
        closeSidebar();
    });

    $(document).on('click', function(e) {
        if ($(window).width() <= 992) {
            if ($sidebar.hasClass('open') &&
                !$(e.target).closest('#categorySidebar').length &&
                !$(e.target).closest('#sidebarToggle').length) {
                closeSidebar();
            }
        }
    });

    /* 侧边栏展开状态持久化：记住用户手动展开/收起，切换文章后保持 */
    (function() {
        var STORAGE_KEY = 'sidebar_cat_states';
        var $details = $('.sidebar-cat[data-cat], .sidebar-subcat[data-cat]');

        // 恢复之前保存的状态
        var saved;
        try {
            saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch(e) {
            saved = {};
        }

        $details.each(function() {
            var $el = $(this);
            var name = $el.attr('data-cat');
            if (saved.hasOwnProperty(name)) {
                // 有保存记录就用保存的，覆盖默认值
                $el.prop('open', saved[name]);
                // 同步更新 active 样式
                if (saved[name]) {
                    $el.children('summary').addClass('active');
                } else {
                    $el.children('summary').removeClass('active');
                }
            } else {
                // 首次访问，保存当前默认状态
                saved[name] = $el.prop('open');
            }
        });

        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch(e) {}

        // 监听用户手动切换，实时保存
        $details.on('toggle', function() {
            var name = $(this).attr('data-cat');
            var isOpen = $(this).prop('open');
            try {
                var s = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
                s[name] = isOpen;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
            } catch(e) {}
            // 同步 active 样式
            if (isOpen) {
                $(this).children('summary').addClass('active');
            } else {
                $(this).children('summary').removeClass('active');
            }
        });
    })();
});

//黑夜模式提醒开启功能
setTimeout(function () {
    if ((new Date().getHours() >= 19 || new Date().getHours() < 7) && !$('body').hasClass('DarkMode')) {
        let toastHTML = '<span style="color:#97b8b2;border-radius: 10px;>' + '<i class="fa fa-bellaria-hidden="true"></i>晚上使用深色模式阅读更好哦。(ﾟ▽ﾟ)</span>'
        M.toast({ html: toastHTML })
    }
}, 2200);

//黑夜模式判断
if (localStorage.getItem('isDark') === '1') {
    document.body.classList.add('DarkMode');
    $('#sum-moon-icon').addClass("fa-sun").removeClass('fa-moon')
} else {
    document.body.classList.remove('DarkMode');
    $('#sum-moon-icon').removeClass("fa-sun").addClass('fa-moon')
}
