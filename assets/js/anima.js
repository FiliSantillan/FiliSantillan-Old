'use strict';

var anima = (function ($) {

    var

    userAgentInit = function() {
        document.documentElement.setAttribute('data-useragent', navigator.userAgent);
    },

    // main menu open/close init
    mainMenu = function () {
        $('.js-open-main-menu').on('click', function (e) {
            e.preventDefault();
            $('.js-menu-container').addClass('show-menu');
            $('.js-menu-overlay').addClass('visible');
        });
        $('.js-close-main-menu, .js-menu-overlay').on('click', function (e) {
            e.preventDefault();
            $('.js-menu-container').removeClass('show-menu');
            $('.js-menu-overlay').removeClass('visible');
        });
    },

    // nice scroll plugin init
    niceSroll = function() {
        var $niceScrollHandler = $('html:has(body.nicescroll)');
        if ($niceScrollHandler.length) {
            $niceScrollHandler.niceScroll({
                cursorcolor:'#222',
                cursorwidth: 6,
                cursorborder: '1px solid #222',
                zindex: 99999,
                cursorborderradius: 0,
                scrollspeed: 80,
                mousescrollstep: 20,
                autohidemode: 'leave',
                railpadding: {right: 2},
                smoothscroll: true
            });
        }
    },

    niceScrollReinit = function () {
        if (!$('html').getNiceScroll().length) {
            niceSroll();
        }
        document.addEventListener('visibilitychange', function() {
            if(!document.hidden && !$('html').getNiceScroll().length) {
                niceSroll();
            }
        });
    },

    niceScrollShowEvent = function () {
        document.addEventListener('visibilitychange', function() {
            if(!document.hidden && $('html').getNiceScroll().length) {
                $('html').getNiceScroll()[0].show();
            }
        });
    },

    // https://highlightjs.org/
    syntaxHighlighter = function () {
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    },

    // sticky header
    headroom = function () {
        $('.headroom').headroom({
            offset: 200,
            classes : {
                pinned : '',
                unpinned : ''
            }
        });
    },

    // go to top button
    goToTopBtn = function() {
        var $backBtn = $('.js-back-to-top-btn');
        if($backBtn.length) {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 300) {
                    $backBtn.removeClass('hidden');
                } else {
                    $backBtn.addClass('hidden');
                }
            });
            $backBtn.on('click', function (e) {
                e.preventDefault();
                if ($('body.nicescroll').length) {
                    $('html').getNiceScroll()[0].doScrollTop(0, 1000);
                } else {
                    $('body, html').stop(true, false).animate({
                        scrollTop: 0
                    }, 400);
                }
            });
        }
    },

    // based on : 'Reading Position Indicator' article
    // http://css-tricks.com/reading-position-indicator/
    positionIndicator = function () {
        if ($('.js-post-reading-time').is(':visible')) {
            imagesLoaded('.post-view-article', function () {
                var getMax = function() {
                    return $(document).height() - $(window).height();
                };
                var getValue = function() {
                    return $(window).scrollTop();
                };
                var progressBar, max, value, width;
                if('max' in document.createElement('progress')){
                    // Browser supports progress element
                    progressBar = $('progress');
                    // Set the Max attr for the first time
                    progressBar.attr({ max: getMax() });
                    $(document).on('scroll', function(){
                        // On scroll only Value attr needs to be calculated
                        progressBar.attr({ value: getValue() });
                    });
                    $(window).resize(function(){
                        // On resize, both Max/Value attr needs to be calculated
                        progressBar.attr({ max: getMax(), value: getValue() });
                    });
                }
                else {
                    progressBar = $('.progress-bar'),
                        max = getMax(),
                        value, width;
                    var getWidth = function(){
                        // Calculate width in percentage
                        value = getValue();
                        width = (value/max) * 100;
                        width = width + '%';
                        return width;
                    };
                    var setWidth = function(){
                        progressBar.css({ width: getWidth() });
                    };
                    $(document).on('scroll', setWidth);
                    $(window).on('resize', function(){
                        // Need to reset the Max attr
                        max = getMax();
                        setWidth();
                    });
                }
            });
        }
    },

    shuffle = function () {
        var $grid = $('.js-post-block-grid');
        if ($grid.length) {
            imagesLoaded('.js-post-block-grid', function () {
                $grid.shuffle({
                    itemSelector: '.js-post-block-grid-item',
                });
                $grid.on('done.shuffle', function() {
                    $grid.shuffle('update');
                });
            });
        }
    },

    indexGridFilter = function () {
        if ($('.js-post-block-grid-item').length) {
            var $grid = $('.js-post-block-grid');
            var $gridItem = $('.js-post-block-grid-item');
            var $gridFilterBtn = $('.js-grid-filter-button');
            var $listFilterBtn = $('.js-list-filter-button');
            $grid.on('done.shuffle', function() {
                $grid.shuffle('update');
            });
            if (localStorage.getItem('anima_ghost_theme_index_view') === 'list') {
                $gridItem.addClass('list');
                $listFilterBtn.addClass('active');
                $gridFilterBtn.removeClass('active');
            } else {
                $gridItem.removeClass('list');
                $gridFilterBtn.addClass('active');
                $listFilterBtn.removeClass('active');
            }
            $gridFilterBtn.on('click', function (e) {
                e.preventDefault();
                $(this).addClass('active');
                $listFilterBtn.removeClass('active');
                $gridItem.removeClass('list');
                $grid.shuffle('update');
                localStorage.setItem('anima_ghost_theme_index_view', 'grid');
            });
            $listFilterBtn.on('click', function (e) {
                e.preventDefault();
                $(this).addClass('active');
                $gridFilterBtn.removeClass('active');
                $gridItem.addClass('list');
                $grid.shuffle('update');
                localStorage.setItem('anima_ghost_theme_index_view', 'list');
            });
        }
    },

    readingTime = function () {
        var $postArticleContent = $('.post-article-content');
        if ($postArticleContent.length) {
            $postArticleContent.readingTime({
                wordCountTarget: $('.js-post-reading-time').find('.js-word-count')
            });
        }
    },

    // magnific popup init
    // http://dimsemenov.com/plugins/magnific-popup/
    imageLightbox = function () {
        if ($('.anima-image-popup').length) {
            var mfOptions = {
                type: 'image',
                removalDelay: 500,
                midClick: true,
                callbacks: {
                    beforeOpen: function() {
                        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                        this.st.mainClass = 'mfp-zoom-in';
                        /* other css animations: http://codepen.io/dimsemenov/pen/GAIkt */
                    }
                },
                closeOnContentClick: true,
                gallery:{
                    enabled: true
                }
            };
            $('.anima-image-popup').magnificPopup(mfOptions);
        }
    },

    // unic array tool
    unicArray = function (array) {
        return $.grep(array, function(el, index) {
            return index === $.inArray(el, array);
        });
    },

    // parse feed - for recent posts
    recentPostsParseFeed = function () {
        var $recentPostsContainer = $('.js-post-view-recent');
        if ($recentPostsContainer.length && $recentPostsContainer.is(':visible')) {
            var itemsAmount = $recentPostsContainer.data('items');
            var $items;
            var prepareList = function ($items) {
                var itemCount = $items.length;
                var iterator, $singleItem;
                var $container = $('<ul/>');
                if (itemCount > itemsAmount) {
                    iterator = itemsAmount;
                } else {
                    iterator = itemCount;
                }
                for (var i = 0; i < iterator; i++) {
                    $singleItem = '<li><a href="' + $items.eq(i).find('link').text() + '">' +
                                    $items.eq(i).find('title').text() + '</a></li>';
                    $container.append($singleItem);
                }
                $recentPostsContainer.append($container);
            };
            if (window.globalRSSDataJQObj && window.globalRSSDataJQObj.length) {
                $items = window.globalRSSDataJQObj;
                prepareList($items);
            } else {
                $.get('/rss/',function (data) {
                    $items = $(data).find('item');
                    prepareList($items);
                });
            }
        }
    },

    // prepare all existing filters in visible posts on index page
    prepareFilters = function () {
        var $filterTagsContainer = $('.js-filter-tags');
        if ($filterTagsContainer.length) {
            var $postItem = $('.js-post-block-grid-item');
            var $tagsList = $('<select class="cs-select cs-skin-slide"/>');
            var tags = [];
            if ($postItem.length) {
                $postItem.each(function () {
                    tags = tags.concat($(this).data('tags').split(','));
                });
                tags = unicArray(tags).filter(Boolean);
            }
            $tagsList.append('<option value="all">All</option>');
            tags.forEach(function (tag) {
                $tagsList.append('<option value="' + tag + '">' + tag + '</option>');
            });
            $filterTagsContainer.append($tagsList);
        }
    },

    // filter tags selector styling
    filterTagsSelector = function () {
        [].slice.call(document.querySelectorAll('select.cs-select')).forEach(function(el) {
            new SelectFx(el, {
                onChange: function (val) {
                    $('.js-post-block-grid').shuffle('shuffle', val);
                }
            });
        });
    },

    // search functionality init
    searchModule = function () {
        var $openSearchBtn = $('.js-open-search');
        var $closeSearchBtn = $('.js-close-search');
        var $bigSearchContainer = $('.big-search');
        // ghost hunter init
        var ghostHunter = $('.js-search-input').ghostHunter({
            results: '.js-search-results',
            result_template: '<a href="{{link}}"><p><h2><i class="fa fa-fw fa-dot-circle-o"></i> {{title}}</h2></p></a>',
            onKeyUp: true,
            rss: '/rss/'
        });
        $openSearchBtn.on('click', function (e) {
            e.preventDefault();
            $bigSearchContainer.addClass('open');
            $(window).scrollTop(0);
            $bigSearchContainer.find('input[type=text]').focus();
        });
        $closeSearchBtn.on('click', function (e) {
            e.preventDefault();
            ghostHunter.clear();
            $bigSearchContainer.removeClass('open');
        });
    },

    // disqus init
    disqus = function (newIdentifier, newUrl, newTitle) {
        if ($('#disqus_thread').length) {
            if (typeof DISQUS === 'undefined') {
                /* * * CONFIGURATION VARIABLES * * */
                var disqus_shortname = 'animatheme'; // required: replace example with your forum shortname
                var disqus_identifier = newIdentifier;
                var disqus_url = newUrl;
                var disqus_title = newTitle;

                /* * * DON'T EDIT BELOW THIS LINE * * */
                (function() {
                    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
                    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
                })();
            } else {
                DISQUS.reset({
                    reload: true,
                    config: function () {
                        this.page.identifier = newIdentifier;
                        this.page.url = newUrl;
                        this.page.title = newTitle;
                    }
                });
            }
        }
    },

    // gallery config - http://www.owlcarousel.owlgraphic.com/docs/started-welcome.html
    imageCarousel = function () {
        var $gallery = $('.anima-carousel');
        if($gallery.length) {
            $gallery.each(function() {
                $(this).owlCarousel({
                    autoPlay: 2500,
                    stopOnHover: true,
                    itemsScaleUp: true
                });
            });
        }
    },

    // smooth state tool init and plugins reinit on page change
    // http://weblinc.github.io/jquery.smoothState.js/
    smoothState = function () {
        var $main = $('#main');
        var animDuration = 400;
        $main.smoothState({
            prefetch: true,
            pageCacheSize: 0,
            blacklist: '.anima-image-popup, .no-smoothstate', // smooth state will not work on image popup links and links with no-smoothstate class
            onStart: {
                duration: animDuration,
                render: function (url, $container) {
                    $('.js-menu-container').removeClass('show-menu');
                    $main.find('.fade-in-left').velocity({
                        translateZ: 0,
                        translateX: '-100%'
                    }, {duration: animDuration});
                    $main.find('.fade-in-right').velocity({
                        translateZ: 0,
                        translateX: '200%'
                    }, {duration: animDuration});
                    $main.find('.fade-in-up').velocity({
                        translateZ: 0,
                        translateY: '100%'
                    }, {duration: animDuration});
                    $main.find('.fade-in-down').velocity({
                        translateZ: 0,
                        translateY: '-100%'
                    }, {duration: animDuration});
                    $main.find('.fade-in').velocity({
                        translateZ: 0,
                        opacity: 0
                    }, {duration: animDuration});
                }
            },
            onProgress : {
                duration: 0,
                render: function (url, $container) {}
            },
            onEnd: {
                duration: 0,
                render: function (url, $container, $content) {
                    $container.html($content);
                    $main.find('.fade-in-left').velocity({
                        translateZ: 0,
                        translateX: [0, '-100%']
                    }, {duration: animDuration});
                    $main.find('.fade-in-right').velocity({
                        translateZ: 0,
                        translateX:  [0, '200%']
                    }, {duration: animDuration});
                    $main.find('.fade-in-up').velocity({
                        translateZ: 0,
                        translateY: [0, '100%']
                    }, {duration: animDuration});
                    $main.find('.fade-in-down').velocity({
                        translateZ: 0,
                        translateY: [0, '-100%']
                    }, {duration: animDuration});
                    $main.find('.fade-in').velocity({
                        translateZ: 0,
                        opacity: [1, 0]
                    }, {duration: animDuration});
                    $(window).scrollTop(0);
                }
            },
            callback : function(url, $container, $content) {
                // foundation reflow
                $(document).foundation('reflow');
                // code highlighter init
                syntaxHighlighter();
                // nicescroll reinit if needed
                niceScrollReinit();
                niceScrollShowEvent();
                // main menu reinit
                mainMenu();
                // gototop button reinit
                goToTopBtn();
                // reading time counter reinit
                readingTime();
                // reading position indicator reinit
                positionIndicator();
                // sticky header init
                headroom();
                // index grid and filters reinit
                shuffle();
                indexGridFilter();
                // index page filters prepare reinit
                prepareFilters();
                // filter tags selector reinit
                filterTagsSelector();
                // search module reinit
                searchModule();
                // recent posts list reinit
                recentPostsParseFeed();
                // reset disqus page
                disqus(window.location.href, window.location.href, $('.post-title').text());
                // image carousel reinit
                imageCarousel();
                // image lightbox reinit
                imageLightbox();
            }
        }).data('smoothState');
    },

    // anima javascripts initialization
    init = function () {
        $(document).foundation();
        userAgentInit();
        syntaxHighlighter();
        mainMenu();
        indexGridFilter();
        goToTopBtn();
        readingTime();
        positionIndicator();
        headroom();
        niceSroll();
        niceScrollShowEvent();
        smoothState();
        shuffle();
        prepareFilters();
        filterTagsSelector();
        searchModule();
        recentPostsParseFeed();
        disqus(window.location.href, window.location.href, $('.post-title').text());
        imageCarousel();
        imageLightbox();
    };

    return {
        init: init
    };

})(jQuery);

(function () {
    anima.init();
})();