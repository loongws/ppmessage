/**
 * 用以方便合并文件，放在最终合并文件的最开始
 *
 */
((function() {

function PPMessage (jQuery) {

    // Global module variables for convenience use
    var fn = {
        $: jQuery,
        Service: {},
        View: {},
        Modal: {},
        Controller: {},
        Factory: {},
        Configuration: {},
        Toolkit: {}
    },
        
        $ = fn.$,
        Service = fn.Service,
        View = fn.View,
        Modal = fn.Modal,
        Controller = fn.Controller,
        Factory = fn.Factory,
        Ctrl = Controller,
        Configuration = fn.Configuration,
        Toolkit = fn.Toolkit,
        
        $timeout = setTimeout,
        $clearTimeout = clearTimeout,

        // on async get data callback
        $onResult = function ( data, callback ) {
            if ( callback ) callback ( data );
        };

function extend(child, parent) {
    child.prototype = (function(supportObjectCreate) {
        
        // support Object.create method (ECMAScript 5.1)
        if (supportObjectCreate) return Object.create(parent.prototype);
        
        // not support Object.create method (like IE8, IE7 ...)
        function F() {}
        F.prototype = parent.prototype;
        return new F();
        
    } (Object.create !== undefined));
    
    child.prototype.constructor = child;
}

//PP Configuration
Configuration = {
    api_key: 'MTg3MGVhYTA3ZjJiN2Y1NzhhYzczNGUyMjQyNTMzMDlhNjg1ZTc2Yg==',
    api_secret: 'M2Q4ZmYzMzQ3MWY5MzZjYzc2ZmVkMWRkZTkyN2ExYTk3ZDAxNmMyNQ==',
    assets_path: 'http://192.168.0.208:8080/ppcom/assets/',
    portal: 'http://192.168.0.208:8080',
    api: 'http://192.168.0.208:8080/api',
    auth: 'http://192.168.0.208:8080/ppauth',
    web_socket_url: 'ws://192.168.0.208:8080/pcsocket/WS',
    file_upload_url: 'http://192.168.0.208:8080/upload',
    file_upload_txt_url: 'http://192.168.0.208:8080/upload_txt',
    file_download_url: 'http://192.168.0.208:8080/download/'
};

/**
 * jQuery plugin 
 *
 * copy and modified from https://github.com/luis-kaufmann-silva/jquery-p2r/blob/master/jquery.p2r.js to support pulltorefresh on mobile
 */
((function _pulltorefresh__module($, document) {
    'use strict';

    // Class Definition
    var PullToRefresh = function (element, options) {
        this.$element = $(element);
        
        this.options = $.extend({}, self.DEFAULTS, options);
        
        this.$scroll = $(options.scroll);
        
        
        this.flags = {
            prevented: false,
            moving: false,
            touched: false,
            isTouch: false,
            refreshed: false
        };

        this.positions = {
            startY: 0,
            startX: 0,
            lastStep: 0,
            
            delta: 0
        }
    };


    // namespace to events
    PullToRefresh.key = 'pulltorefresh';

    // default options
    PullToRefresh.DEFAULTS = {
        orientation: "down", // define if is a pull-up-to-refresh or a pull-down-to-refresh
        sensibility: 5, // number of pixels to each call of "move" event
        refresh: 70, // value in pixels to fire "refresh" event
        click: 0.000001, // value in pixels to fire "click" event
        lockRefresh: false, // indicates that the user can pull up to get the value "refresh"
        resetRefresh: true, // indicates that the "reset" function will be called immediately when occur the event "refresh"
        autoInit: true, // indicates that the "PullToRefresh" object must be built on startup "plugin"
        resetSpeed: "100ms", // speed of reset animation in milliseconds
        simulateTouch: true, // simulate touch events with mouse events
        threshold: 20, // integer with the threshold variation of the y axis
        scroll: document // class name to scroll element
    };


    // namespace function to join event.namespace
    PullToRefresh.namespace = function _pulltorefresh__namespace(eventName) {
        return [
            eventName,
            PullToRefresh.key
        ].join(".");
    }

    // support detection on touch events
    PullToRefresh.support = {

        touch: (window.Modernizr && Modernizr.touch === true) || (function () {
            'use strict';
            return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })()

    };

    // events names based on browser support
    PullToRefresh.events = (function () {

        if (PullToRefresh.support.touch) {
            return {
                start: PullToRefresh.namespace('touchstart'),
                move: PullToRefresh.namespace('touchmove'),
                end: PullToRefresh.namespace('touchend')
            }
        }

        var events = {
            start: PullToRefresh.namespace('mousedown'),
            move: PullToRefresh.namespace('mousemove'),
            end: PullToRefresh.namespace('mouseup')
        };

        if (!!(window.navigator.msPointerEnabled)) {
            events = {
                start: PullToRefresh.namespace('MSPointerDown'),
                move: PullToRefresh.namespace('MSPointerMove'),
                end: PullToRefresh.namespace('MSPointerUp')
            };
        }

        if (!!(window.navigator.pointerEnabled)) {
            events = {
                start: PullToRefresh.namespace('pointerdown'),
                move: PullToRefresh.namespace('pointermove'),
                end: PullToRefresh.namespace('pointerup')
            };
        }

        return events;

    })();


    /**
     * Construct method to bind all events to respectives elements
     * @method
     */
    PullToRefresh.prototype.construct = function _pulltorefresh__construct() {
        var self = this;
        self.$element
            .on(PullToRefresh.events.start, self.proxy(self.onTouchStart, self))
            .on(PullToRefresh.events.move, self.proxy(self.onTouchMove, self))
            .on(PullToRefresh.events.end, self.proxy(self.onTouchEnd, self));

        if (self.options.simulateTouch) {
            self.$element
                .on(PullToRefresh.namespace('mousedown'), self.proxy(self.onTouchStart, self));
            $(document)
                .on(PullToRefresh.namespace('mousemove'), self.$element, self.proxy(self.onTouchMove, self))
                .on(PullToRefresh.namespace('mouseup'), self.$element, self.proxy(self.onTouchEnd, self));
        }
    };

    /**
     * Destemoy method to remove all event listeners of element
     * @method
     */
    PullToRefresh.prototype.destroy = function _pulltorefresh__destroy() {

        this.remove_transition(this.$element[0].style);
        this.remove_transform(this.$element[0].style);
        $(document).off(PullToRefresh.namespace(''));
        this.$element.off(PullToRefresh.namespace(''));
        this.$element.removeData('pulltorefresh');
    };


    // proxy function to trigger funcions with correct "this"
    PullToRefresh.prototype.proxy = (function () {

        var has_bind = !!(Function.prototype.bind);

        // if browser supports bind, use it (why reinvent the wheel?)
        if (has_bind) {
            return function _pulltorefresh__bind(fn, context) {
                return fn.bind(context);
            }
        } else {
            // if lib has proxy
            if ($.proxy) {
                return $.proxy;
            } else {
                // else create it
                return function _pulltorefresh__jquery_like_proxy(fn, context) {
                    var tmp, args, proxy;

                    if (typeof context === "string") {
                        tmp = fn[context];
                        context = fn;
                        fn = tmp;
                    }

                    // Quick check to determine if target is callable, in the spec
                    // this throws a TypeError, but we will just return undefined.
                    if (typeof (fn) === 'function') {
                        return undefined;
                    }

                    args = Array.prototype.slice.call(arguments, 2);

                    // Simulated bind
                    proxy = function () {
                        return fn.apply(context || this, args.concat(slice.call(arguments)));
                    };

                    // Set the guid of unique handler to the same of original handler, so it can be removed
                    proxy.guid = fn.guid = fn.guid || jQuery.guid++;

                    return proxy;
                }
            }
        }

    })();

    /**
     * Method to transform the Element in pixels
     * @param  {CSSProperties} style .style of Element
     * @param  {int} value value of tranformation
     * @method
     */
    PullToRefresh.prototype.transform = function _pulltorefresh__transform(style, value) {

        style.webkitTransform = 'translate(0, ' + value + 'px) ' + 'translateZ(0)';
        style.msTransform =
            style.MsTransform =
            style.MozTransform =
            style.OTransform =
            style.transform = 'translateY(' + value + 'px)';
    };


    /**
     * Method to set a transition on Element
     * @param  {CSSProperies} style .style of Element
     * @param  {string} ms    css value to duration of transition
     * @method
     */
    PullToRefresh.prototype.transition = function _pullToRefresh__transition(style, ms) {
        style.webkitTransitionDuration =
            style.MozTransitionDuration =
            style.msTransitionDuration =
            style.OTransitionDuration =
            style.transitionDuration = ms;
    };

    /**
     * Method to remove transition on Element
     * @param  {CSSProperies} style .style of Element
     * @method
     */
    PullToRefresh.prototype.remove_transition = function _pullToRefresh__remove_transition(style) {
        style.webkitTransitionDuration =
            style.MozTransitionDuration =
            style.msTransitionDuration =
            style.OTransitionDuration =
            style.transitionDuration = null;
    };

    /**
     * Method to remove transformation on Element
     * @param  {CSSProperties} style .style of Element
     * @method
     */
    PullToRefresh.prototype.remove_transform = function _pulltorefresh__remove_transform(style) {
        style.webkitTransform =
            style.msTransform =
            style.MsTransform =
            style.MozTransform =
            style.OTransform =
            style.transform = null;
    };


    /**
     * Method to get x and y axis from event
     * @param  {MouseEvent|TouchEvent}  event        Event by mousedown or touchstart
     * @param  {Boolean} isTouchEvent flag to indicate a touch event
     * @return {object}               Object with x and y values like "{x: 1, y: 1}"
     * @method
     */
    PullToRefresh.prototype.getAxis = function _pulltorefresh__getAxis(event, isTouchEvent) {
        return {
            x: isTouchEvent ? (event.targetTouches || event.originalEvent.targetTouches)[0].pageX : (event.pageX || event.clientX),
            y: isTouchEvent ? (event.targetTouches || event.originalEvent.targetTouches)[0].pageY : (event.pageY || event.clientY)
        }

    }

    /**
     * method to listen event start
     * @param  {MouseEvent|TouchEvent} event Original event fired by DOM
     * @method
     */
    PullToRefresh.prototype.onTouchStart = function _pulltorefresh__ontouchstart(event) {
        var isTouchEvent = event.type === 'touchstart',
            axis = this.getAxis(event, isTouchEvent);
        
        // only move $element if $scroll do not have scroll
        if (this.$scroll.scrollTop() > 0) {
            return true;
        }

        // if not left click, cancel
        if (!isTouchEvent && event.which !== 1) {
            return;
        }

        this.flags.touched = true;
        this.flags.refreshed = false;
        this.flags.isTouch = isTouchEvent;

        this.positions.startY = axis.y;
        this.positions.startX = axis.x;

        this.$element.trigger(PullToRefresh.namespace('start'), [axis.y])

        this.transition(this.$element[0].style, "0ms");

    };

    /**
     * Method to listen the movement of element
     * @param  {MouseEvent|TouchEvent} event Original move event fired by DOM
     * @method
     */
    PullToRefresh.prototype.onTouchMove = function _pulltorefresh__ontouchmove(event) {

        var isTouchEvent = event.type === 'touchmove',
            delta,
            step,
            percentage,
            axis;

        // if not touched or hasTouchEvent and the eventType is a desktop event cancel the move
        if (!(this.flags.touched) || (this.flags.isTouch && event.type === 'mousemove')) {
            return;
        }

        // detect if element has click
        if (!this.flags.prevented && event.target && (event.target.click || event.target.onclick)) {
            this.flags.prevented = true;
        }

        // get axis pair
        axis = this.getAxis(event, isTouchEvent);

        // get variation of position between start y axis and current y axis
        delta = (axis.y - this.positions.startY);
        this.positions.delta = delta;

        // reset on horizontal scroll threshold fail
        if (Math.abs(axis.x - this.positions.startX) > this.options.threshold) {
            this.reset();
            return;
        }

        // move with negative, see #5
        if (delta < 0 && this.options.orientation == 'down') return;
        if (delta >= 0 && this.options.orientation == 'up') return;

        // fires the refresh event if necessary and not has been triggered before
        if ((delta < 0 ? delta * -1 : delta) >= this.options.refresh && !this.flags.refreshed) {

            // fire refresh event
            this.$element.trigger(PullToRefresh.namespace('refresh'), [axis.y]);

            // set flag to not trigger this event until next touchend
            this.flags.refreshed = true;

            // if configured to reset on refresh, do it
            if (this.options.resetRefresh) {
                this.reset();
                return;
            }

        }

        if (this.flags.refreshed && this.options.lockRefresh) {
            return;
        }

        // current step, necessary to define if call move event
        step = parseInt(delta / this.options.sensibility, 10);

        // if is a next step, fire event and inform the perncentage of pull
        if (this.positions.lastStep != step) {
            percentage = parseInt((delta * 100) / this.options.refresh, 10);
            this.$element.trigger(PullToRefresh.namespace('move'), percentage);
            this.positions.lastStep = step;
        }
        // finally tranform element to current touch position
        this.transform(this.$element[0].style, delta);

        event.stopPropagation();
        event.preventDefault();
    };

    /**
     * Method to listen the end of user action
     * @method
     */
    PullToRefresh.prototype.reset = function _pulltorefresh__reset() {
        this.transition(this.$element[0].style, this.options.resetSpeed);
        this.transform(this.$element[0].style, 0);
        this.flags.touched = false;
        this.flags.isTouch = false;
        this.flags.refreshed = false;
        this.positions.startY = false;
        this.positions.delta = 0;
    };

    /**
     * Method to listen the end of touch event
     * @param  {MouseEvent|TouchEvent} event Original end event fired by DOM
     * @method
     */
    PullToRefresh.prototype.onTouchEnd = function PullToRefresh__onTouchEnd(event) {

        if (!this.flags.touched) {
            return;
        }

        var moveDelta = this.positions.delta;

        this.flags.prevented = false;

        this.positions.startY = 0;
        this.positions.startX = 0;

        this.reset();

        this.$element.trigger(PullToRefresh.namespace('end'));

        event.stopPropagation();
        event.preventDefault();

        var ev = event.target.click || event.target.onclick;
        ev && ( Math.abs( moveDelta ) <= this.options.click ) && $( event.target ).trigger( 'click' );

    };


    // PullToRefresh PLUGIN DEFINITION
    // ========================

    var old = $.fn.pullToRefresh;

    $.fn.pullToRefresh = function _pulltorefresh(option) {
        return this.each(function () {

            var $this = $(this);
            var data = $this.data(PullToRefresh.key);

            var options = $.extend({}, PullToRefresh.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data && option == 'destroy') return PullToRefresh.destroy();

            if (!data) {

                $this.data(PullToRefresh.key, (data = new PullToRefresh(this, options)))

                if (options.autoInit) {

                    data.construct();
                }
            }

            if (typeof option == 'string') {
                data[option].apply(data)
            }

        });
    };

    $.fn.pullToRefresh.Constructor = PullToRefresh;


    // PullToRefresh NO CONFLICT
    // ==================

    $.fn.pullToRefresh.noConflict = function () {
        $.fn.pullToRefresh = old
        return this
    }

})($, '#pp-conversation-content')); // <-- Modified this line ^_^

/**
 * http://gsgd.co.uk/sandbox/jquery/easing/
 */
(function($) {

    $.extend($.easing, {
        easeInQuart: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        }
    });
    
})($);

/**
 * 使用`Service.bootMe()`来初始化服务。
 *
 */
((function() {

    Service._booted = false;

    Service.bootMe = function(reboot) {
        if (!Service._booted || reboot) {
            
            Service.$cookies = new Service.PPCookies();
            Service.$tools = new Service.PPTools();
            Service.$errorHint = new Service.ErrorHint();
            Service.$publicApi = new Service.PublicAPI();
            
            Service.$startUp = new Service.PPStartUp(Service.$api, Service.$device);

            Service.$conversationManager.init();

            Service._booted = true;
        }
    };
    
})());

((function(Service) {

    function PPBaseService() {
    }
    Service.BaseService = PPBaseService;
    
})(Service));

((function(Service) {

    function PPConstants() {
    }

    PPConstants.ICON_DEFAULT_LAUNCHER = Configuration.assets_path + "img/logo_1.png";
    PPConstants.DEFAULT_HEADER_TITLE = "PPMessage";

    //USER
    PPConstants.ICON_DEFAULT_USER = Configuration.assets_path + "img/logo_1.png";
    PPConstants.USER_DEFAULT_NAME = 'Anonymous';

    PPConstants.STYLE = {
        EMOJI_PANEL_DEFAULT_BOTTOM_MARGIN: 67
    };

    PPConstants.EVENT = {
        NEW_MESSAGE_ARRIVED: "message:NEW_ARRIVED",
        ON_TEXTAREA_HEIGHT_CHANGED: "textarea:height-change"
    };

    PPConstants.MESSAGE = {
        TYPE_TEXT: 'TEXT',
        TYPE_EMOJI: 'EMOJI',
        TYPE_IMAGE: 'IMAGE',
        TYPE_FILE: 'FILE',
        TYPE_WELCOME: 'WELCOME',
        TYPE_TIMESTAMP: 'TIMESTAMP',

        TO_TYPE: "P2S",

        TEXT_MAX_LEN: 128
    };

    PPConstants.MAX_UPLOAD_SIZE = 4194304; //4MB
    PPConstants.MAX_UPLOAD_SIZE_STR = "4MB";

    PPConstants.MESSAGE_TYPE = {
        NOTI: "NOTI",
        SYS: "SYS"
    };

    PPConstants.FILE = {
        ROOT: "PP"
    };

    PPConstants.MESSAGE_SUBTYPE = {
        AUDIO:  "AUDIO",
        VIDEO:  "VIDEO",
        DOCUMENT: "DOCUMENT",
        FILE:   "FILE",
        TEXT:   "TEXT",
        IMAGE:  "IMAGE",
        SINGLE_CARD:   "SINGLE_CARD",
        MULTIPLE_CARD: "MULTIPLE_CARD",
        TXT:    "TXT",
        MENU:   "MENU",
        EVENT:  "EVENT",
        GPS_LOCATION: "GPS_LOCATION",
        INVITE_CONTACT: "INVITE_CONTACT",
        ACCEPT_CONTACT: "ACCEPT_CONTACT",
        REMOVE_CONTACT: "REMOVE_CONTACT",
        DG_INVITED: "DG_INVITED",
        DG_REMOVED: "DG_REMOVED",
        REQUEST_JOIN_OG: "REQUEST_JOIN_OG",
        APPROVE_JOIN_OG: "APPROVE_JOIN_OG",
        LOGOUT: "LOGOUT"
    };

    PPConstants.I18N = {
        'zh-CN': {
            START_CONVERSATION_HINT: '\u6309\u201c\u56de\u8f66\u952e\u201d\u53d1\u9001',
            START_CONVERSATION_MOBILE_HINT: '',
            ERROR_TEXT_TOO_LONG: '\u5b57\u6570\u592a\u957f',
            WELCOME_MSG: '\u60a8\u597d\uff0c\u8bf7\u95ee\u6709\u4ec0\u4e48\u53ef\u4ee5\u5e2e\u52a9\u60a8\u7684\uff1f',
            CLOSE_BUTTON_HINT: '\u7ed3\u675f\u4f1a\u8bdd',
            MINIZE_BUTTON_HINT: '\u6700\u5c0f\u5316',
            MAXIMUM_UPLOAD_SIZE_HINT: '\u6700\u5927\u6587\u4ef6\u5927\u5c0f\u4e3a',
            PPMESSAGE: '\u76ae\u76ae\u6d88\u606f',
            HOVER_CARD_TEXTAREA_HINT: '\u5f00\u59cb\u5bf9\u8bdd',
            DEFAULT_SERVE_NAME: '\u5ba2\u670d',
            UPLOADING_HINT: '\u6b63\u5728\u4e0a\u4f20',
            SEND: '\u53d1\u9001',
            WAITING_AVALIABLE_CONVERSATION: '\u6b63\u5728\u7b49\u5f85\u5ba2\u670d...',
            WAITING_LENGTH_HINT: '\u6b63\u5728\u6392\u961f\u4e2d\uff0c\u5f53\u524d\u5171\u6709%s\u4eba\u6b63\u5728\u7b49\u5f85',

            LOAD_HISTORY_HINT: '\u70b9\u51fb\u52a0\u8f7d\u5386\u53f2\u6d88\u606f',
            LOAD_HISTORY_MOBILE_HINT: '\u4e0b\u62c9\u52a0\u8f7d\u5386\u53f2\u6d88\u606f',
            LOADING_HISTORY: '\u6b63\u5728\u52a0\u8f7d...',
            NO_MORE_HISTORY: '\u6ca1\u6709\u66f4\u591a\u5386\u53f2\u6d88\u606f',

            IMAGE: '\u56fe\u7247',
            FILE: '\u6587\u4ef6',
            AUDIO: '\u8bed\u97f3',

            SEND_ERROR: '\u53d1\u9001\u5931\u8d25',
            SERVICE_NOT_AVALIABLE: '\u670d\u52a1\u4e0d\u53ef\u7528',
            CANCELED: '\u5df2\u53d6\u6d88',

            CLOSE: '\u5173\u95ed',

            CONSULT_WORKING_TIME: '\u670d\u52a1\u65f6\u95f4',
            CONTACT_NUMBER: '\u8054\u7cfb\u7535\u8bdd',

            ONLINE: '\u5728\u7ebf',
            OFFLINE: '\u79bb\u7ebf',

            SYSTEM_MSG: '\u7cfb\u7edf\u6d88\u606f',

            TYPING: '\u5bf9\u65b9\u6b63\u5728\u8f93\u5165...',

            AUDIO_PLAY_ERROR: '\u64ad\u653e\u5931\u8d25',
            
            timeFormat: function(timestampInMilliSeconds) {
                return Service.$tools.formatTime(timestampInMilliSeconds, {
                    year: "\u5e74",
                    month: "\u6708",
                    day: "\u65e5",
                    today: "\u4eca\u5929",
                    yesterday: "\u6628\u5929"
                });
            }
        },
        'en': {
            START_CONVERSATION_HINT: 'Press "Enter key" to send',
            START_CONVERSATION_MOBILE_HINT: '',
            ERROR_TEXT_TOO_LONG: 'Text is too long',
            WELCOME_MSG: 'Hello, what can I do for you ?',
            CLOSE_BUTTON_HINT: 'Close Conversation',
            MINIZE_BUTTON_HINT: 'Minimization',
            MAXIMUM_UPLOAD_SIZE_HINT: 'The maximum upload size is ',
            PPMESSAGE: 'PPMessage',
            HOVER_CARD_TEXTAREA_HINT: 'Start a conversation',
            DEFAULT_SERVE_NAME: 'Service',
            UPLOADING_HINT: 'Uploading',
            SEND: 'Send',
            WAITING_AVALIABLE_CONVERSATION: 'Waiting service ...',
            WAITING_LENGTH_HINT: 'There are total %s person in the queue',

            LOAD_HISTORY_HINT: 'Click to load history',
            LOAD_HISTORY_MOBILE_HINT: 'Pull to load history',
            LOADING_HISTORY: 'Loading...',
            NO_MORE_HISTORY: 'No more history',

            // for message summary launcher preview show
            IMAGE: 'Image',
            FILE: 'File',
            AUDIO: 'Audio',

            SEND_ERROR: 'Send Error',
            SERVICE_NOT_AVALIABLE: 'Service Not Avaliable',
            CANCELED: 'Cancled',

            CLOSE: 'Close',

            CONSULT_WORKING_TIME: 'Online Time',
            CONTACT_NUMBER: 'Contact Number',

            ONLINE: 'Online',
            OFFLINE: 'Offline',

            SYSTEM_MSG: 'System message',

            TYPING: 'Typing...',

            AUDIO_PLAY_ERROR: 'Play Error',
            
            timeFormat: function(timestampInMilliSeconds) {
                return Service.$tools.formatTime(timestampInMilliSeconds, {
                    year: "-",
                    month: "-",
                    day: "",
                    today: "Today",
                    yesterday: "Yesterday"
                });
            }
        }
    };

    PPConstants.i18n = function(key) {
        return Service.Constants.I18N[Service.$language.getLanguage()][key];
    };

    Service.Constants = PPConstants;
    
})(Service));

((function(Service) {

    function PPAPI() {

        var _apiToken = null,
            _apiKey = null,
            _apiSecret = null,
            _appUuid = null,

            // Internal Server Error
            _onError = function(response, fail) {
                Service.$debug.d('[PPAPI] [Error]: ', response);
                Service.$errorHint.warn(Service.ErrorHint.ERROR_SERVICE_NOT_AVALIABLE);
                if (fail) fail(response);
            },

            _onApiError = function(response, fail) {
                Service.$debug.d('[PPAPI] [Fail]: ', response);
                if (fail) fail(response);
            },
            
            _onApiSuccess = function(response, success) {
                Service.$debug.d('[PPAPI] [Success]: ', response);
                if (success) success(response);
            },
            
            _onResponse = function(response, success, fail) {
                if (response && (response['error_code'] !== undefined)) {
                    var succ = false;
                    switch(response['error_code']) {
                    case 0:
                        succ = true;
                        break;
                        
                    // case 25: // no imapp info
                    //     Service.$errorHint.warn(Service.ErrorHint.ERROR_ILLEGAL_APPKEY_OR_SECRET);
                    //     break;
                        
                    default:
                        break;
                    }

                    if (succ) {
                        _onApiSuccess(response, success);                                
                    } else {
                        _onApiError(response, fail);
                    }
                } else {
                    _onApiError(response, fail);
                }
            },
            
            _onBeforeSend = function(url, data) {
                Service.$debug.d('[PPAPI] [Request]: ', url, data);
            };
                        
        this._post = function(url, data, success, fail) {

            if (_apiToken == null) {
                Service.$debug.d('[PPAPI] [Error]: ', "no token");
                Service.$errorHint.warn(Service.ErrorHint.ERROR_SERVICE_NOT_AVALIABLE);
                return;
            }
           
            var urlPath = Configuration.api + url;
            $.support.cors = true;

            // DON'T set `dataType` to `json` here !!!
            //
            // If you set `dataType: 'json'`, then when you send `??`, jQuery will throw a `parsererror` exception
            // 
            // As the jQuery offical doc says:
            // The JSON data is parsed in a strict manner; any malformed JSON is rejected and a parse error is thrown
            //
            // @see http://api.jquery.com/jquery.ajax/
            // @see http://stackoverflow.com/questions/5061310/jquery-returning-parsererror-for-ajax-request
            $.ajax({
                url: urlPath,
                type: 'post',
                data: Service.$json.stringify(data),
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Authorization": "OAuth " + _apiToken,
                },
                cache: false,
                crossDomain : true,
                beforeSend: function() {
                    _onBeforeSend(urlPath, data);
                },
                success: function(response) {
                    _onResponse(response, success, fail);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    _onError(textStatus, fail);
                }
            });
        };

        this.init = function(appUuid, apiKey, apiSecret) {
            _appUuid = appUuid;
            _apiKey = apiKey;
            _apiSecret = apiSecret;            
        };

        this.getPPComToken = function(success, fail) {
            var urlPath = Configuration.auth + "/token";
            var requestData = "client_id=" + _apiKey + "&client_secret=" + _apiSecret + "&grant_type=client_credentials"
            
            $.support.cors = true;
            $.ajax({
                url: urlPath,
                type: 'post',
                data: requestData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                cache: false,
                crossDomain : true,
                beforeSend: function() {
                    _onBeforeSend(urlPath, requestData);
                },
                success: function(response) {
                    _apiToken = response.access_token;
                    _onApiSuccess(response, success);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    _onError(textStatus, fail);
                }
            });
        };

        this.updateUser = function(data, success, fail) {
            this._post("/PP_UPDATE_USER", $.extend( {}, data ), success, fail );
        };

        this.getConversationList = function(data, success, fail) {
            this._post("/PP_GET_USER_CONVERSATION_LIST", $.extend({}, data), success, fail);
        };

        this.getConversation = function(data, success, fail) {
            this.getConversationList(data, success, fail);
        };

        // data : { user_uuid: xxx, app_uuid: xxx, member_list: [ 'xxxxx', 'xxxxx' ], group_uuid: xxx }
        this.createConversation = function(data, success, fail) {
            this._post("/PP_CREATE_CONVERSATION", $.extend( {}, data ), success, fail);
        };

        this.sendMessage = function(data, success, fail) {
            this._post("/PP_SEND_MESSAGE", data, success, fail);
        };

        /*
         * Get unacked messages
         */
        this.getUnackedMessages = function(data, success, fail) {
            this._post("/GET_UNACKED_MESSAGES", $.extend( {}, data ), success, fail);
        };

        // { list: [ 'xxx', 'xxxx' ] }
        this.ackMessage = function(data, success, fail) {
            this._post("/ACK_MESSAGE", $.extend( {}, data ), success, fail);
        };

        this.createAnonymousUser = function(data, success, fail) {
            this._post("/PP_CREATE_ANONYMOUS", $.extend( {}, data ), success, fail);
        };

        // {
        //     app_uuid: xxx,
        //     user_uuid: xxx,
        //     device_ostype: xxx,
        //     ppcom_trace_uuid: xxx,
        //     device_id: xxx
        // }
        this.createDevice = function(data, success, fail) {
            this._post("/PP_CREATE_DEVICE", $.extend( true, {}, data ), success, fail);
        };

        // @device_os_type: `Service.$device.getOSType()`;
        this.updateDevice = function(data, success, fail) {
            this._post("/PP_UPDATE_DEVICE", $.extend( {}, data ), success, fail);
        };

        /*
         * Get user_uuid by the third-web-site's user_email
         */
        this.getUserUuid = function(data, success, fail) {
            this._post("/PP_GET_USER_UUID", $.extend( {}, data ), success, fail);
        };

        this.getUserDetailInfo = function(data, success, fail) {
            this._post("/GET_YVOBJECT_DETAIL", $.extend( {}, data ), success, fail);
        };

        /**
         * Get message conversation historys
         */
        this.getMessageHistory = function(data, success, fail) {
            this._post("/PP_GET_HISTORY_MESSAGE", $.extend( {}, data ), success, fail);
        };

        /**
         * Get ImappInfo
         */
        this.getAppInfo = function(data, success, fail) {  
            this._post("/PP_GET_APP_INFO", $.extend( {}, data ), success, fail);
        };

        /**
         * Get welcome team
         */
        this.getWelcomeTeam = function(data, success, fail) {
            this._post("/PP_GET_WELCOME_TEAM", $.extend( {}, data ), success, fail);
        };

        // data: { app_uuid: xxx }
        this.getAppOrgGroupList = function(data, success, fail) {
            this._post('/PP_GET_APP_ORG_GROUP_LIST', $.extend({}, data), success, fail);
        };

        // data: { app_uuid: xxx, group_uuid: xxx }
        this.getOrgGroupUserList = function ( data, success, fail ) {
            this._post( '/PP_GET_ORG_GROUP_USER_LIST', $.extend( {}, data ), success, fail );
        };

        // data: { app_uuid: xxx, group_uuid: xxx }
        this.getOrgGroupConversationId = function ( data, success, fail ) {
            this._post( '/PP_GET_ORG_GROUP_CONVERSATION', $.extend( {}, data ), success, fail );
        };

        // data: { app_uuid: xxx, user_uuid: xxx }
        this.getDefaultConversation = function ( data, success, fail ) {
            this._post( '/PP_GET_DEFAULT_CONVERSATION', $.extend( {}, data ), success, fail );
        };

        // data: { app_uuid: xxx, conversation_uuid: xxx }
        this.getConversationUserList = function ( data, success, fail ) {
            this._post( '/PP_GET_CONVERSATION_USER_LIST', $.extend( {}, data ), success, fail );
        };

        // data: { app_uuid: xxx, user_uuid: xxx, device_uuid: xxx, group_uuid: xxx }
        this.cancelWaitingCreateConversation = function ( data, success, fail ) {
            this._post( '/PP_CANCEL_WAITING_CREATE_CONVERSATION', $.extend( {}, data ), success, fail );
        };

        // data: { app_uuid: xxx, user_uuid: xxx, device_uuid: xxx }
        this.getPPComDefaultConversation = function ( data, success, fail ) {
            this._post( '/PPCOM_GET_DEFAULT_CONVERSATION', $.extend( {}, data ), success, fail );
        };

        // data: { app_uuid: xxx, user_uuid: xxx, member_list: [ 'user_uuid' ], group_uuid: xxx }
        this.createPPComConversation = function ( data, success, fail ) {
            this._post( '/PPCOM_CREATE_CONVERSATION', $.extend( {}, data ), success, fail );
        };

        // data: { app_uuid: xxx, user_uuid: xxx, conversation_uuid: xxx }
        this.getConversationInfo = function ( data, success, fail ) {
            this._post( '/PP_GET_CONVERSATION_INFO', $.extend( {}, data ), success, fail );
        };

        // data: { app_uuid: xxx }
        this.getWaitingQueueLength = function( data, success, fail ) {
            this._post( '/PP_GET_AMD_QUEUE_LENGTH', $.extend( {}, data ), success, fail );
        };

        this.getAppUuid = function() {
            return _appUuid;
        };

        this.getApiToken = function() {
            return _apiToken;
        };

    }

    Service.$api = new PPAPI();
    
})(Service));

//
// @description: for global data cache
//
// Service.$rootCache.set(Service.KEYS.XXX_XXX);
// var myValue = Service.$rootCache.get(Service.KEYS.XXX_XXX);
//
Service.$rootCache = (function() {

    var storage = {},

        get = function(key) {
            return storage[key];
        },

        set = function(key, value) {
            storage[key] = value;
        },

        exist = function(key) {
            return storage[key] !== undefined;
        };

    return {
        get:get,
        set:set,
        exist:exist
    }
    
})();

/**
 * 创建和删除Cookie
 *
 * Example:
 *
 * var cookie = new Service.PPCookies();
 * cookie.set('key', 'value', {
 *     expires: 7 // 7 day
 * });
 * cooki.get('key'); // return value
 *
 */
((function(Service) {

    /**
     * constructor
     */
    function PPCookies() {
    }

    PPCookies.prototype._api = function(key, value, attributes) {
        //write
        if (arguments.length > 1) {
            attributes = attributes || {};
            if (typeof attributes.expires === 'number') {
                var expires = new Date();
                expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 1000);
				attributes.expires = expires;
            }
            return (document.cookie = [
				key, '=', value,
				attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
				attributes.path    && '; path=' + attributes.path,
				attributes.domain  && '; domain=' + attributes.domain,
				attributes.secure ? '; secure' : ''
			].join(''));
        }

        //read
        var result;
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var i = 0;
        for (; i < cookies.length; i++) {
            var parts = cookies[i].split('=');
            var name = parts[0];
            var value = parts[1];

            if (name === key) {
                result = value;
                break;
            }
        }

        return result;
    };

    /**
     * 设置Cookie
     */
    PPCookies.prototype.set = function(key, value, attributes) {
        return this._api(key, value, attributes);
    };

    /**
     * 根据Key从Cookie中取值
     */
    PPCookies.prototype.get = function(key) {
        return this._api(key);
    };

    Service.PPCookies = PPCookies;
    
})(Service));

/**
 * 用于向开发者提示(打印到console)错误信息
 *
 * API:
 * warn(): 使用console.warn() 打印警告信息
 * error(): 使用console.error() 打印错误信息
 *
 * Example:
 * new Service.ErrorHint().warn(10000);
 * new Service.ErrorHint().error(10001);
 *
 */
(function(Service) {

    /**
     * @constructor
     * 
     */
    function PPErrorHint() {
    }

    PPErrorHint.ERROR_ILLEGAL_APPUUID = 10000;
    PPErrorHint.ERROR_ILLEGAL_USER_EMAIL = 10001;
    PPErrorHint.ERROR_IE9_OR_LOWER_BROWSER = 10002;
    PPErrorHint.ERROR_SERVICE_NOT_AVALIABLE = 10003;
    PPErrorHint.ERROR_ILLEGAL_USER_EMAIL_STYLE = 10004;

    PPErrorHint._ERROR_INFO = {
        10000: 'appUuid not provide, Please check your appUuid and try again',
        10001: 'Can not find user by the user_email, please check your user_email and try again',
        10002: 'Can not run ppMessage on IE 9 or lower version browser',
        10003: 'Service not avaliable',
        10004: 'Not a valid user_email',
    };

    PPErrorHint.prototype._getErrorDescription = function(errorCode) {
        for (var key in PPErrorHint._ERROR_INFO) {
            if (key == errorCode) {
                return PPErrorHint._ERROR_INFO[key];
            }
        }
        return "";
    };

    PPErrorHint.prototype._getErrorLogDescription = function(errorCode) {
        return (typeof errorCode === 'number') ? ('PPMessage: [errorCode:' + errorCode + ", errorDescription:'" + this._getErrorDescription(errorCode) + "']") : errorCode;
    };

    /**
     * log warn info
     * param errorCode 错误代码
     */
    PPErrorHint.prototype.warn = function(errorCode) {
        window.console &&
            window.console.warn &&
            console.warn(this._getErrorLogDescription(errorCode));
    };

    /**
     * log error info
     */
    PPErrorHint.prototype.error = function(errorCode) {
        window.console &&
            window.console.error &&
            console.error(this._getErrorLogDescription(errorCode));
    };

    Service.ErrorHint = PPErrorHint;
    
}(Service));

/**
 * 当用户信息改变的时候(通常指：user_fullname 或者 user_icon)，`$users`服务会publish一个`user/infochange/xxx-xxx-xxx(user_uuid)`事件.
 *
 * 所以如果想在某用户(如：user_uuid:xxx)信息改变的时候doSomething，应该subscribe一个topic:
 * Service.$pubsub.subscribe('user/infochange/xxx', function(topics, user) {
 *     // do something with new user info
 * });
 *
 * 当用户状态改变的时候，offline->online or online->offline, `$users` will publish a `use/infochange/state/xxx-xxx(user_uuid)` topic.
 *
 */
((function(Service) {

    var users = (function() {

        // Store users
        var usersStore = {};
        
        // User Class
        function User(options) {

            // user body
            var user = $.extend({}, User.DEFAULTS, options),

                // does user info (icon or name) has changed ?
                isUserInfoChanged = function(options) {
                    if (!options.user_uuid) return false;
                    
                    // fullname changed or user_avatar changed
                    return (options.user_fullname && options.user_fullname != user.user_fullname) ||
                        (options.user_avatar && options.user_avatar != user.user_avatar);
                },

                // online or offline state changed
                isUserStateChanged = function(options) {
                    if (!options.user_uuid) return false;

                    return options.is_online !== user.is_online;
                };

            // Return user's info
            this.getInfo = function() {
                return user;
            };

            // Update user's info
            this.update = function(options) {
                if (!options.user_uuid) return this;

                // user info changed , publish change event
                // NOTE: 1. MUST first check (`isUserInfoChanged`) is user info changed
                // 2. then update it (`$.extend`)
                var changed = isUserInfoChanged(options),
                    stateChanged = isUserStateChanged(options);
                    
                // update it
                user = $.extend({}, user, options);

                if (changed) {
                    Service.$pubsub.publish('user/infochange/' + user.user_uuid, this);
                }
                
                if (stateChanged) {
                    Service.$pubsub.publish('user/infochange/state/' + user.user_uuid, this);
                }

                return this;
            };
            
        }

        // Default user info options
        // No user_uuid, No device_uuid
        User.DEFAULTS = {
            is_portal_user: false,
            is_anonymous: true,
            ppcom_trace_uuid: null,
            user_fullname: Service.Constants.USER_DEFAULT_NAME,
            user_avatar: Service.Constants.ICON_DEFAULT_USER,
            user_uuid: "",
            device_uuid: "",
            user_signature: '',
            is_browser_online: false,
            is_mobile_online: false,
            is_online: false
        };

        // Create a user with user options
        function createUser(options) {
            return new User(options);
        }

        // Get a user
        function getUser(userUUID) {
            return usersStore[userUUID];
        }

        // Set a user
        function setUser(userUUID, user) {
            if (!userUUID || !user) return;

            usersStore[userUUID] = user;
        }

        // Clear all user's info
        function clearUsers() {
            usersStore = {};
        }

        // Test is a user exist 
        function isUserExist(userUUID) {
            if (!userUUID) return false;
            
            return usersStore[userUUID] !== undefined;
        }

        // Async get user
        function asyncGetUser(options, completeCB) {
            // user exist
            if (isUserExist(options.user_uuid)) {
                updateUser(options);
                if (completeCB) completeCB(getUser(options.user_uuid));
                return;
            }

            // 获取用户信息最主要的原因是需要获取 name 和 avatar, 如果已经有了，那么直接返回
            // 通常这种情况出现在 收到消息的时候，因为消息体本身带有 `from_user` json body
            if (options.user_uuid &&
                options.user_fullname &&
                options.user_avatar) {

                var user = createUser(options);
                setUser(options.user_uuid, user);

                if (completeCB) completeCB(user);
                return;
            }

            // 获取历史消息时候，没有 user_fullname 和 user_avatar
            // Call getUserDetailInfo to get it's detail info
            Service.$api.getUserDetailInfo({
                uuid: options.user_uuid,
                type: 'DU'
            }, function(response) {

                // Merge options info to response options
                var info = $.extend({}, {
                    user_email: response.email,
                    user_fullname: response.fullname ? response.fullname : Service.Constants.USER_DEFAULT_NAME,
                    user_uuid: response.uuid,
                    user_avatar: response.icon ? Service.$tools.getFileDownloadUrl(response.icon) : Service.Constants.ICON_DEFAULT_USER
                }, options);
                
                var user = createUser(info);

                // Cache it
                setUser(options.user_uuid, user);

                if (completeCB) completeCB(user);
            }, function(error) {
                // Get user failed
                if (completeCB) completeCB(null);
            });    
        }

        // Get all users
        function getUsers() {
            return usersStore;
        }

        // Update user info
        function updateUser(options) {
            if (!options) return;
            if (!options.user_uuid) return;
            if (!isUserExist(options.user_uuid)) return;

            getUser(options.user_uuid).update(options);
        }

        function adapter ( options ) {
            if ( !options ) return;

            var userUUID = options.uuid || options.user_uuid,
                userAvatar = Service.$tools.icon.get( options.user_icon || options.icon || options.user_avatar ),
                userName = options.user_fullname,
                userOnline = ( options.is_mobile_online || options.is_browser_online ),
                userBrowserOnline = options.is_browser_online,
                userMobileOnline = options.is_mobile_online,
                // ( options.user_signature === null ) => true
                // ( typeof null === 'object' ) => true
                userSignature = options.user_signature ? options.user_signature : '';

            return {
                user_uuid: userUUID,
                user_fullname: userName,
                user_avatar: userAvatar,
                user_signature: userSignature,
                is_online: userOnline,
                is_browser_online: userBrowserOnline,
                is_mobile_online: userMobileOnline
            };

        }

        function getOrCreateUser ( options ) {
            if ( !options || !options.user_uuid ) return;

            var user_uuid = options.user_uuid;
            
            if ( isUserExist( user_uuid ) ) {
                return getUser( user_uuid ).update( options );
            } else {
                setUser( user_uuid, createUser( options ) );
                return getUser( user_uuid );
            }
        }

        return {
            createUser: createUser,
            
            // get user
            getUser: getUser,
            getOrCreateUser: getOrCreateUser,
            asyncGetUser: asyncGetUser,
            getUsers: getUsers,

            // set user
            setUser: setUser,

            // update user
            updateUser: updateUser,

            // user adapter
            adapter: adapter,
            
            clear: clearUsers,
            exist: isUserExist
        }
        
    })();

    Service.$users = users;
    
})(Service));

Service.$user = (function() {

    // web_site user
    var user_uuid = null;

    return {
        
        // Get website user info
        getUser: function() {
            if ( !user_uuid ) return null;
            return getUser( user_uuid );
        },
        
        // Set website user
        setUser: function(userInfo) {
            user_uuid = userInfo.user_uuid;
            Service.$users.setUser(user_uuid, Service.$users.createUser(userInfo));
        },
        
        // Make user offline
        offline: function() {
            if (!user_uuid) return;

            var userInfo = getUserInfo( user_uuid );
            
            if ( userInfo && // user info is ok
                 userInfo.device_uuid && // user device_uuid is also ok
                 userInfo.is_online // user really `online` now
               ) {
                
                // update user's local info
                getUser( user_uuid ).update( {
                    user_uuid: user_uuid,
                    is_online: false
                } );
                
            }
            
        },

        online: function() {
            if ( !user_uuid ) return;
            
            var userInfo = getUserInfo( user_uuid );
            if ( userInfo &&
                 userInfo.device_uuid &&
                 ( !userInfo.is_online ) ) {

                getUser( user_uuid ).update( {
                    user_uuid: user_uuid,
                    is_online: true
                } );
                
            }
        },
        
        // Clear user
        clear: function() {
            user_uuid = null;
        },

        // quick get current user's id
        quickId: function() {
            return user_uuid;
        },

        quickDeviceUUID: function() {
            var userInfo = getUserInfo( user_uuid );
            return userInfo && userInfo.device_uuid;
        }
        
    }

    //////// Implentation /////////

    function getUser ( userId ) {
        if ( !userId ) return;
        return Service.$users.getUser( userId );
    }

    function getUserInfo ( userId ) {
        if ( !userId ) return;
        var user = getUser( userId ),
            userInfo = user && user.getInfo();
        return userInfo;
    }

    function isOnline ( userId ) {
        var userInfo = getUserInfo( userId );
        if ( userInfo ) {
            return userInfo.is_online;
        }
        return false;
    }
    
}());

((function() {

    var ppSettings = (function() {

        var settings = null,
            userSettings = null,

            ANONYMOUS_USER_COOKIE_KEY = 'pp-id',

            // Default settings
            DEFAULT = {

                app_uuid: null,
                api_key: null,
                api_secret: null,
                
                user_email: null,
                user_name: null,
                user_icon: null,

                language: window.navigator.userLanguage || window.navigator.language,

                view: {
                    launcher_bottom_margin: '20px',
                    launcher_right_margin: '20px',
                    launcher_is_show: true
                }
                
            },

            // Initialize pp settings
            init = function(options) {
                settings = $.extend({}, DEFAULT, options);
                settings.api_key = Configuration.api_key;
                settings.api_secret = Configuration.api_secret;
            },

            // Get user's settings
            getUserSettings = function() {
                if (settings == null) return null;
                if (userSettings != null) return userSettings;

                // is anonymous user
                var isAnonymousUser = settings.user_email ? false : true;

                // 保持键的名字与`$service.User.DEFAULT`相同，因为我们会使用`userSettings`来Create
                // `$service.User`
                userSettings = {

                    user_email: settings.user_email,
                    user_fullname: settings.user_name,
                    user_avatar: settings.user_icon,
                    user_uuid: null,
                    device_uuid: null,

                    is_portal_user: true,
                    is_anonymous: isAnonymousUser,
                    ppcom_trace_uuid: (function() {
                        
                        if (!isAnonymousUser) return null;

                        // get ppcom_trace_uuid
                        var id = Service.$cookies.get(ANONYMOUS_USER_COOKIE_KEY) || function() {
                            var uuid = Service.$tools.getUUID();
                            Service.$cookies.set(ANONYMOUS_USER_COOKIE_KEY, uuid, {
                                expires: 365 * 15 * 24 * 3600 //15 year, never delete it
                            });
                            return uuid;
                        }();

                        return id;
                        
                    })()
                    
                };

                return userSettings;
                
            },

            // update user settings
            updateUserSettings = function(options) {
                userSettings = $.extend(getUserSettings(), options);
            },

            // get language
            getLanguage = function() {
                return settings.language;
            },

            getAppUuid = function() {
                return settings.app_uuid;
            },

            getApiKey = function() {
                return settings.api_key;
            },

            getApiSecret = function() {
                return settings.api_secret;
            },

            // Clear state
            clear = function() {
                settings = null;
                userSettings = null;                
            }

        // api
        return {
            init: init,
            
            getUserSettings: getUserSettings,
            updateUserSettings: updateUserSettings,
            
            getLanguage: getLanguage,
            getAppUuid: getAppUuid,
            getApiKey: getApiKey,
            getApiSecret: getApiSecret,
            
            clear: clear
        }
        
    })();
    
    Service.$ppSettings = ppSettings;
    
})());

((function(Service) {

    function PPDebug() {
        
        var _DEBUG_ = true,
            _TEMPORARY_CLOSE_ = false,
            self = this,

            supportConsole = !(typeof console === "undefined" || typeof console.log === "undefined"),
            supportConsoleApply = supportConsole && !(typeof console.log.apply === "unknown" || typeof console.log.apply === "undefined"),
            
            highlightBegin = '↓↓↓↓↓↓↓↓↓↓',
            highlightStyle = "font-size:28px; color:blue;";

        this.h = function() {
            if (!supportConsole) return;
            
            if (_DEBUG_) {
                var cssStr = "%c" + highlightBegin;
                this.d(cssStr, highlightStyle);
            }
            return this;
        }
        
        this.d = function() {
            if (!supportConsole) return;
            
            if (_DEBUG_) {
                if (!_TEMPORARY_CLOSE_) {
                    var args = Array.prototype.slice.call(arguments);
                    supportConsoleApply ? console.log.apply(console, args) : console.log(args);
                } else {
                    _TEMPORARY_CLOSE_ = false;
                }
            }
            return this;
        };

        this.error = function() {
            if (!supportConsole) return;
            
            if (_DEBUG_) {
                if (!_TEMPORARY_CLOSE_) {
                    var args = Array.prototype.slice.call(arguments);
                    supportConsoleApply ? console.error.apply(console, args) : console.error(args);
                } else {
                    _TEMPORARY_CLOSE_ = false;
                }
            }
            return this;                    
        };

        /*
         * temporarily close debug
         *
         * call this method before `this.d()`
         *
         * Example:
         * Service.Debug.close(true).d('----I will not show----');
         */
        this.close = function(close) {
            // _TEMPORARY_CLOSE_ = (close != undefined) ? close : false;
            return this;
        };

        this.debug = function(d) {
            _DEBUG_ = d;
            return this;
        };
    }

    Service.$debug = new PPDebug();
    
})(Service));

// IE8, IE9 not support `WebSocket`, `FormData`, `File` API
((function(Service) {

    Service.$device = (function() {

        var w = window,

            deviceWidth = (w.innerWidth > 0) ? w.innerWidth : screen.width,
            deviceHeight = (w.innerHeight > 0) ? w.innerHeight : screen.height,

            DEVICE_ID_COOKIE_KEY = 'pp-device-id',
            DEVICE_ID_COOKIE_EXPIRE = 10 * 365 * 24 * 3600, // 10 years, never delete it
            deviceId, // device identifier

            userAgent = navigator.userAgent,
            platform = navigator.platform,

            isIOS = /iPhone|iPad|iPod/i.test(userAgent),
            isAndroid = /Android/i.test(userAgent),
            isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isWP = /Windows Phone/i.test(userAgent) || /iemobile/i.test(userAgent) || /WPDesktop/i.test(userAgent),

            isMac = platform.toUpperCase().indexOf('MAC') >= 0,
            isWin = platform.toUpperCase().indexOf('WIN') > -1,
            isLin = platform.toUpperCase().indexOf('LINUX') > -1,

            OS = {
                MAC: 'MAB',
                LIN: 'LIB',
                WIN: 'WIB'
            };

        this.getDeviceWidth = function() {
            return deviceWidth;
        };

        this.getDeviceHeight = function() {
            return deviceHeight;
        };

        this.inMobile = function() {
            var w = this.getDeviceWidth();
            return w <= 736;
        };

        this.disableScroll = function() {
            $('html, body').css({
                'overflow': 'hidden',
                'height': '100%'
            });
        };

        this.enableScroll = function() {
            $('html, body').css({
                'overflow': 'auto',
                'height': 'auto'
            });
        };

        this.isIOS = function() {
            return isIOS;
        };

        this.isAndroid = function() {
            return isAndroid;
        };

        this.isMobileBrowser = function() {
            return isMobile;
        };

        // if IE browser, then return IE version number
        // if not IE browser, then return false
        this.isIE = function () {
            var ua = userAgent;

            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }

            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // IE 12 => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }

            // other browser
            return false;
        };

        this.isIE9 = function() { // IE 9
            var ieVersion = this.isIE();
            return ieVersion && ieVersion == 9;
        };

        this.isIE9OrLowerVersionBrowser = function() { // <= IE 9
            var ieVersion = this.isIE();
            return ieVersion && ieVersion <= 9;
        };

        /** Detect is windwos platform **/
        this.isWindowsPlatform = function() {
            return isWin;
        };

        this.isMac = function() { // is mac platform
            return isMac;
        };

        this.isFirefox = function() {
            return typeof InstallTrigger !== 'undefined'; //Firefox 1.0+
        };

        this.getOSType = function() {

            if ( isAndroid || isLin ) return OS.LIN;

            if ( isIOS || isMac ) return OS.MAC;

            if ( isWP || isWin ) return OS.WIN;

            return OS.MAC;
        };

        this.getDeviceId = function() {

            if (deviceId) return deviceId;

            deviceId = Service.$cookies.get(DEVICE_ID_COOKIE_KEY) || function() {
                var uuid = Service.$tools.getUUID();
                Service.$cookies.set(DEVICE_ID_COOKIE_KEY, uuid, {
                    expires: DEVICE_ID_COOKIE_EXPIRE
                });
                return uuid;
            }();

            return deviceId;
            
        };

        /* Whether or not support play mp3 */
        this.audioMp3 = function() {
            var e = $( '<audio>' )[0];
            return !!e.canPlayType && !!e.canPlayType("audio/mpeg;").replace(/^no$/, "");
        };

        return this;
        
    })();
    
})(Service));

((function(Service) {

    function PPEmoji() {

        var fromCharCode = String.fromCharCode,

            groups = {
                People : [
                    [fromCharCode(0xD83D, 0xDE04), 'smile'],
                    [fromCharCode(0xD83D, 0xDE03), 'smiley'],
                    [fromCharCode(0xD83D, 0xDE00), 'grinning'],
                    [fromCharCode(0xD83D, 0xDE0A), 'blush'],
                    [fromCharCode(0xD83D, 0xDE09), 'wink'],
                    [fromCharCode(0xD83D, 0xDE0D), 'heart_eyes'],
                    [fromCharCode(0xD83D, 0xDE18), 'kissing_heart'],
                    [fromCharCode(0xD83D, 0xDE1A), 'kissing_closed_eyes'],
                    [fromCharCode(0xD83D, 0xDE1C), 'stuck_out_tongue_winking_eye'],
                    [fromCharCode(0xD83D, 0xDE1D), 'stuck_out_tongue_closed_eyes'],
                    [fromCharCode(0xD83D, 0xDE1B), 'stuck_out_tongue'],
                    [fromCharCode(0xD83D, 0xDE33), 'flushed'],
                    [fromCharCode(0xD83D, 0xDE01), 'grin'],
                    [fromCharCode(0xD83D, 0xDE14), 'pensive'],
                    [fromCharCode(0xD83D, 0xDE0C), 'relieved'],
                    [fromCharCode(0xD83D, 0xDE12), 'unamused'],
                    [fromCharCode(0xD83D, 0xDE1E), 'disappointed'],
                    [fromCharCode(0xD83D, 0xDE23), 'persevere'],
                    [fromCharCode(0xD83D, 0xDE22), 'cry'],
                    [fromCharCode(0xD83D, 0xDE02), 'joy'],
                    [fromCharCode(0xD83D, 0xDE2D), 'sob'],
                    [fromCharCode(0xD83D, 0xDE2A), 'sleepy'],
                    [fromCharCode(0xD83D, 0xDE25), 'disappointed_relieved'],
                    [fromCharCode(0xD83D, 0xDE30), 'cold_sweat'],
                    [fromCharCode(0xD83D, 0xDE05), 'sweat_smile'],
                    [fromCharCode(0xD83D, 0xDE13), 'sweat'],
                    [fromCharCode(0xD83D, 0xDE29), 'weary'],
                    [fromCharCode(0xD83D, 0xDE2B), 'tired_face'],
                    [fromCharCode(0xD83D, 0xDE28), 'fearful'],
                    [fromCharCode(0xD83D, 0xDE31), 'scream'],
                    [fromCharCode(0xD83D, 0xDE20), 'angry'],
                    [fromCharCode(0xD83D, 0xDE21), 'rage'],
                    [fromCharCode(0xD83D, 0xDE24), 'triumph'],
                    [fromCharCode(0xD83D, 0xDE16), 'confounded'],
                    [fromCharCode(0xD83D, 0xDE06), 'laughing'],
                    [fromCharCode(0xD83D, 0xDE0B), 'yum'],
                    [fromCharCode(0xD83D, 0xDE37), 'mask'],
                    [fromCharCode(0xD83D, 0xDE0E), 'sunglasses'],
                    [fromCharCode(0xD83D, 0xDE35), 'dizzy_face'],
                    [fromCharCode(0xD83D, 0xDE32), 'astonished'],
                    [fromCharCode(0xD83D, 0xDC7F), 'imp'],
                    [fromCharCode(0xD83D, 0xDE26), 'open_mouth'],
                    [fromCharCode(0xD83D, 0xDE10), 'neutral_face'],
                    [fromCharCode(0xD83D, 0xDE15), 'confused'],
                    [fromCharCode(0xD83D, 0xDE0F), 'smirk'],
                    [fromCharCode(0xD83D, 0xDC72), 'man_with_gua_pi_mao'],
                    [fromCharCode(0xD83D, 0xDC73), 'man_with_turban'],
                    [fromCharCode(0xD83D, 0xDC6E), 'cop'],
                    [fromCharCode(0xD83D, 0xDC77), 'construction_worker'],
                    [fromCharCode(0xD83D, 0xDC82), 'guardsman'],
                    [fromCharCode(0xD83D, 0xDC76), 'baby'],
                    [fromCharCode(0xD83D, 0xDC66), 'boy'],
                    [fromCharCode(0xD83D, 0xDC67), 'girl'],
                    [fromCharCode(0xD83D, 0xDC68), 'man'],
                    [fromCharCode(0xD83D, 0xDC69), 'woman'],
                    [fromCharCode(0xD83D, 0xDC74), 'older_man'],
                    [fromCharCode(0xD83D, 0xDC75), 'older_woman'],
                    [fromCharCode(0xD83D, 0xDC71), 'person_with_blond_hair'],
                    [fromCharCode(0xD83D, 0xDC7C), 'angel'],
                    [fromCharCode(0xD83D, 0xDC78), 'princess'],
                    [fromCharCode(0xD83D, 0xDE3A), 'smiley_cat'],
                    [fromCharCode(0xD83D, 0xDE38), 'smile_cat'],
                    [fromCharCode(0xD83D, 0xDE3B), 'heart_eyes_cat'],
                    [fromCharCode(0xD83D, 0xDE3D), 'kissing_cat'],
                    [fromCharCode(0xD83D, 0xDE3C), 'smirk_cat'],
                    [fromCharCode(0xD83D, 0xDE40), 'scream_cat'],
                    [fromCharCode(0xD83D, 0xDE3F), 'crying_cat_face'],
                    [fromCharCode(0xD83D, 0xDE39), 'joy_cat'],
                    [fromCharCode(0xD83D, 0xDE3E), 'pouting_cat'],
                    [fromCharCode(0xD83D, 0xDC79), 'japanese_ogre'],
                    [fromCharCode(0xD83D, 0xDC7A), 'japanese_goblin'],
                    [fromCharCode(0xD83D, 0xDE48), 'see_no_evil'],
                    [fromCharCode(0xD83D, 0xDE49), 'hear_no_evil'],
                    [fromCharCode(0xD83D, 0xDE4A), 'speak_no_evil'],
                    [fromCharCode(0xD83D, 0xDC80), 'skull'],
                    [fromCharCode(0xD83D, 0xDC7D), 'alien'],
                    [fromCharCode(0xD83D, 0xDCA9), 'hankey'],
                    [fromCharCode(0xD83D, 0xDD25), 'fire'],
                    [fromCharCode(0xD83C, 0xDF1F), 'star2'],
                    [fromCharCode(0xD83D, 0xDCAB), 'dizzy'],
                    [fromCharCode(0xD83D, 0xDCA5), 'boom'],
                    [fromCharCode(0xD83D, 0xDCA2), 'anger'],
                    [fromCharCode(0xD83D, 0xDCA6), 'sweat_drops'],
                    [fromCharCode(0xD83D, 0xDCA7), 'droplet'],
                    [fromCharCode(0xD83D, 0xDCA4), 'zzz'],
                    [fromCharCode(0xD83D, 0xDCA8), 'dash'],
                    [fromCharCode(0xD83D, 0xDC42), 'ear'],
                    [fromCharCode(0xD83D, 0xDC40), 'eyes'],
                    [fromCharCode(0xD83D, 0xDC43), 'nose'],
                    [fromCharCode(0xD83D, 0xDC45), 'tongue'],
                    [fromCharCode(0xD83D, 0xDC44), 'lips'],
                    [fromCharCode(0xD83D, 0xDC4D), 'thumbs_up'],
                    [fromCharCode(0xD83D, 0xDC4E), 'thumbs_down'],
                    [fromCharCode(0xD83D, 0xDC4C), 'ok_hand'],
                    [fromCharCode(0xD83D, 0xDC4A), 'facepunch'],
                    [fromCharCode(0xD83D, 0xDC4B), 'wave'],
                    [fromCharCode(0xD83D, 0xDC50), 'open_hands'],
                    [fromCharCode(0xD83D, 0xDC46), 'point_up_2'],
                    [fromCharCode(0xD83D, 0xDC47), 'point_down'],
                    [fromCharCode(0xD83D, 0xDC48), 'point_right'],
                    [fromCharCode(0xD83D, 0xDC49), 'point_left'],
                    [fromCharCode(0xD83D, 0xDE4C), 'raised_hands'],
                    [fromCharCode(0xD83D, 0xDE4F), 'pray'],
                    [fromCharCode(0xD83D, 0xDC4F), 'clap'],
                    [fromCharCode(0xD83D, 0xDCAA), 'muscle'],
                    [fromCharCode(0xD83D, 0xDEB6), 'walking'],
                    [fromCharCode(0xD83C, 0xDFC3), 'runner'],
                    [fromCharCode(0xD83D, 0xDC83), 'dancer'],
                    [fromCharCode(0xD83D, 0xDC6B), 'couple'],
                    [fromCharCode(0xD83D, 0xDC6A), 'family'],
                    [fromCharCode(0xD83D, 0xDC8F), 'couplekiss'],
                    [fromCharCode(0xD83D, 0xDC91), 'couple_with_heart'],
                    [fromCharCode(0xD83D, 0xDC6F), 'dancers'],
                    [fromCharCode(0xD83D, 0xDE46), 'ok_woman'],
                    [fromCharCode(0xD83D, 0xDE45), 'no_good'],
                    [fromCharCode(0xD83D, 0xDC81), 'information_desk_person'],
                    [fromCharCode(0xD83D, 0xDE4B), 'raising_hand'],
                    [fromCharCode(0xD83D, 0xDC86), 'massage'],
                    [fromCharCode(0xD83D, 0xDC87), 'haircut'],
                    [fromCharCode(0xD83D, 0xDC85), 'nail_care'],
                    [fromCharCode(0xD83D, 0xDC70), 'bride_with_veil'],
                    [fromCharCode(0xD83D, 0xDE4E), 'person_with_pouting_face'],
                    [fromCharCode(0xD83D, 0xDE4D), 'person_frowning'],
                    [fromCharCode(0xD83D, 0xDE47), 'bow'],
                    [fromCharCode(0xD83C, 0xDFA9), 'tophat'],
                    [fromCharCode(0xD83D, 0xDC51), 'crown'],
                    [fromCharCode(0xD83D, 0xDC52), 'womans_hat'],
                    [fromCharCode(0xD83D, 0xDC5F), 'athletic_shoe'],
                    [fromCharCode(0xD83D, 0xDC5E), 'mans_shoe'],
                    [fromCharCode(0xD83D, 0xDC61), 'sandal'],
                    [fromCharCode(0xD83D, 0xDC60), 'high_heel'],
                    [fromCharCode(0xD83D, 0xDC62), 'boot'],
                    [fromCharCode(0xD83D, 0xDC55), 'shirt'],
                    [fromCharCode(0xD83D, 0xDC54), 'necktie'],
                    [fromCharCode(0xD83D, 0xDC5A), 'womans_clothes'],
                    [fromCharCode(0xD83D, 0xDC57), 'dress'],
                    [fromCharCode(0xD83C, 0xDFBD), 'running_shirt_with_sash'],
                    [fromCharCode(0xD83D, 0xDC56), 'jeans'],
                    [fromCharCode(0xD83D, 0xDC58), 'kimono'],
                    [fromCharCode(0xD83D, 0xDC59), 'bikini'],
                    [fromCharCode(0xD83D, 0xDCBC), 'briefcase'],
                    [fromCharCode(0xD83D, 0xDC5C), 'handbag'],
                    [fromCharCode(0xD83D, 0xDC5D), 'pouch'],
                    [fromCharCode(0xD83D, 0xDC5B), 'purse'],
                    [fromCharCode(0xD83D, 0xDC53), 'eyeglasses'],
                    [fromCharCode(0xD83C, 0xDF80), 'ribbon'],
                    [fromCharCode(0xD83C, 0xDF02), 'closed_umbrella'],
                    [fromCharCode(0xD83D, 0xDC84), 'lipstick'],
                    [fromCharCode(0xD83D, 0xDC9B), 'yellow_heart'],
                    [fromCharCode(0xD83D, 0xDC99), 'blue_heart'],
                    [fromCharCode(0xD83D, 0xDC9C), 'purple_heart'],
                    [fromCharCode(0xD83D, 0xDC9A), 'green_heart'],
                    [fromCharCode(0xD83D, 0xDC94), 'broken_heart'],
                    [fromCharCode(0xD83D, 0xDC97), 'heartpulse'],
                    [fromCharCode(0xD83D, 0xDC93), 'heartbeat'],
                    [fromCharCode(0xD83D, 0xDC95), 'two_hearts'],
                    [fromCharCode(0xD83D, 0xDC96), 'sparkling_heart'],
                    [fromCharCode(0xD83D, 0xDC9E), 'revolving_hearts'],
                    [fromCharCode(0xD83D, 0xDC98), 'cupid'],
                    [fromCharCode(0xD83D, 0xDC8C), 'love_letter'],
                    [fromCharCode(0xD83D, 0xDC8B), 'kiss'],
                    [fromCharCode(0xD83D, 0xDC8D), 'ring'],
                    [fromCharCode(0xD83D, 0xDC8E), 'gem'],
                    [fromCharCode(0xD83D, 0xDC64), 'bust_in_silhouette'],
                    [fromCharCode(0xD83D, 0xDCAC), 'speech_balloon'],
                    [fromCharCode(0xD83D, 0xDC63), 'footprints']
                ],
                Nature : [
                    [fromCharCode(0xD83D, 0xDC36), 'dog'],
                    [fromCharCode(0xD83D, 0xDC34), 'wolf'],
                    [fromCharCode(0xD83D, 0xDC31), 'cat'],
                    [fromCharCode(0xD83D, 0xDC2D), 'mouse'],
                    [fromCharCode(0xD83D, 0xDC39), 'hamster'],
                    [fromCharCode(0xD83D, 0xDC30), 'rabbit'],
                    [fromCharCode(0xD83D, 0xDC38), 'frog'],
                    [fromCharCode(0xD83D, 0xDC2F), 'tiger'],
                    [fromCharCode(0xD83D, 0xDC28), 'koala'],
                    [fromCharCode(0xD83D, 0xDC3B), 'bear'],
                    [fromCharCode(0xD83D, 0xDC37), 'pig'],
                    [fromCharCode(0xD83D, 0xDC3D), 'pig_nose'],
                    [fromCharCode(0xD83D, 0xDC2E), 'cow'],
                    [fromCharCode(0xD83D, 0xDC17), 'boar'],
                    [fromCharCode(0xD83D, 0xDC35), 'monkey_face'],
                    [fromCharCode(0xD83D, 0xDC12), 'monkey'],
                    [fromCharCode(0xD83D, 0xDC34), 'horse'],
                    [fromCharCode(0xD83D, 0xDC11), 'sheep'],
                    [fromCharCode(0xD83D, 0xDC18), 'elephant'],
                    [fromCharCode(0xD83D, 0xDC3C), 'panda_face'],
                    [fromCharCode(0xD83D, 0xDC27), 'penguin'],
                    [fromCharCode(0xD83D, 0xDC26), 'bird'],
                    [fromCharCode(0xD83D, 0xDC24), 'baby_chick'],
                    [fromCharCode(0xD83D, 0xDC25), 'hatched_chick'],
                    [fromCharCode(0xD83D, 0xDC23), 'hatching_chick'],
                    [fromCharCode(0xD83D, 0xDC14), 'chicken'],
                    [fromCharCode(0xD83D, 0xDC0D), 'snake'],
                    [fromCharCode(0xD83D, 0xDC22), 'turtle'],
                    [fromCharCode(0xD83D, 0xDC1B), 'bug'],
                    [fromCharCode(0xD83D, 0xDC1D), 'bee'],
                    [fromCharCode(0xD83D, 0xDC1C), 'ant'],
                    [fromCharCode(0xD83D, 0xDC1E), 'beetle'],
                    [fromCharCode(0xD83D, 0xDC0C), 'snail'],
                    [fromCharCode(0xD83D, 0xDC19), 'octopus'],
                    [fromCharCode(0xD83D, 0xDC1A), 'shell'],
                    [fromCharCode(0xD83D, 0xDC20), 'tropical_fish'],
                    [fromCharCode(0xD83D, 0xDC1F), 'fish'],
                    [fromCharCode(0xD83D, 0xDC2C), 'dolphin'],
                    [fromCharCode(0xD83D, 0xDC33), 'whale'],
                    [fromCharCode(0xD83D, 0xDC0E), 'racehorse'],
                    [fromCharCode(0xD83D, 0xDC32), 'dragon_face'],
                    [fromCharCode(0xD83D, 0xDC21), 'blowfish'],
                    [fromCharCode(0xD83D, 0xDC2B), 'camel'],
                    [fromCharCode(0xD83D, 0xDC29), 'poodle'],
                    [fromCharCode(0xD83D, 0xDC3E), 'feet'],
                    [fromCharCode(0xD83D, 0xDC90), 'bouquet'],
                    [fromCharCode(0xD83C, 0xDF38), 'cherry_blossom'],
                    [fromCharCode(0xD83C, 0xDF37), 'tulip'],
                    [fromCharCode(0xD83C, 0xDF40), 'four_leaf_clover'],
                    [fromCharCode(0xD83C, 0xDF39), 'rose'],
                    [fromCharCode(0xD83C, 0xDF3B), 'sunflower'],
                    [fromCharCode(0xD83C, 0xDF3A), 'hibiscus'],
                    [fromCharCode(0xD83C, 0xDF41), 'maple_leaf'],
                    [fromCharCode(0xD83C, 0xDF43), 'leaves'],
                    [fromCharCode(0xD83C, 0xDF42), 'fallen_leaf'],
                    [fromCharCode(0xD83C, 0xDF3F), 'herb'],
                    [fromCharCode(0xD83C, 0xDF3E), 'ear_of_rice'],
                    [fromCharCode(0xD83C, 0xDF44), 'mushroom'],
                    [fromCharCode(0xD83C, 0xDF35), 'cactus'],
                    [fromCharCode(0xD83C, 0xDF34), 'palm_tree'],
                    [fromCharCode(0xD83C, 0xDF30), 'chestnut'],
                    [fromCharCode(0xD83C, 0xDF31), 'seedling'],
                    [fromCharCode(0xD83C, 0xDF3C), 'blossom'],
                    [fromCharCode(0xD83C, 0xDF11), 'new_moon'],
                    [fromCharCode(0xD83C, 0xDF13), 'first_quarter_moon'],
                    [fromCharCode(0xD83C, 0xDF14), 'moon'],
                    [fromCharCode(0xD83C, 0xDF15), 'full_moon'],
                    [fromCharCode(0xD83C, 0xDF1B), 'first_quarter_moon_with_face'],
                    [fromCharCode(0xD83C, 0xDF19), 'crescent_moon'],
                    [fromCharCode(0xD83C, 0xDF0F), 'earth_asia'],
                    [fromCharCode(0xD83C, 0xDF0B), 'volcano'],
                    [fromCharCode(0xD83C, 0xDF0C), 'milky_way'],
                    [fromCharCode(0xD83C, 0xDF20), 'stars'],
                    [fromCharCode(0xD83C, 0xDF00), 'cyclone'],
                    [fromCharCode(0xD83C, 0xDF01), 'foggy'],
                    [fromCharCode(0xD83C, 0xDF08), 'rainbow'],
                    [fromCharCode(0xD83C, 0xDF0A), 'ocean']
                ],
                Objects : [
                    [fromCharCode(0xD83C, 0xDF8D), 'bamboo'],
                    [fromCharCode(0xD83D, 0xDC9D), 'gift_heart'],
                    [fromCharCode(0xD83C, 0xDF8E), 'dolls'],
                    [fromCharCode(0xD83C, 0xDF92), 'school_satchel'],
                    [fromCharCode(0xD83C, 0xDF93), 'mortar_board'],
                    [fromCharCode(0xD83C, 0xDF8F), 'flags'],
                    [fromCharCode(0xD83C, 0xDF86), 'fireworks'],
                    [fromCharCode(0xD83C, 0xDF87), 'sparkler'],
                    [fromCharCode(0xD83C, 0xDF90), 'wind_chime'],
                    [fromCharCode(0xD83C, 0xDF91), 'rice_scene'],
                    [fromCharCode(0xD83C, 0xDF83), 'jack_o_lantern'],
                    [fromCharCode(0xD83D, 0xDC7B), 'ghost'],
                    [fromCharCode(0xD83C, 0xDF85), 'santa'],
                    [fromCharCode(0xD83C, 0xDF84), 'christmas_tree'],
                    [fromCharCode(0xD83C, 0xDF81), 'gift'],
                    [fromCharCode(0xD83C, 0xDF8B), 'tanabata_tree'],
                    [fromCharCode(0xD83C, 0xDF89), 'tada'],
                    [fromCharCode(0xD83C, 0xDF8A), 'confetti_ball'],
                    [fromCharCode(0xD83C, 0xDF88), 'balloon'],
                    [fromCharCode(0xD83C, 0xDF8C), 'crossed_flags'],
                    [fromCharCode(0xD83D, 0xDD2E), 'crystal_ball'],
                    [fromCharCode(0xD83C, 0xDFA5), 'movie_camera'],
                    [fromCharCode(0xD83D, 0xDCF7), 'camera'],
                    [fromCharCode(0xD83D, 0xDCF9), 'video_camera'],
                    [fromCharCode(0xD83D, 0xDCFC), 'vhs'],
                    [fromCharCode(0xD83D, 0xDCBF), 'cd'],
                    [fromCharCode(0xD83D, 0xDCC0), 'dvd'],
                    [fromCharCode(0xD83D, 0xDCBD), 'minidisc'],
                    [fromCharCode(0xD83D, 0xDCBE), 'floppy_disk'],
                    [fromCharCode(0xD83D, 0xDCBB), 'computer'],
                    [fromCharCode(0xD83D, 0xDCF1), 'iphone'],
                    [fromCharCode(0xD83D, 0xDCDE), 'telephone_receiver'],
                    [fromCharCode(0xD83D, 0xDCDF), 'pager'],
                    [fromCharCode(0xD83D, 0xDCE0), 'fax'],
                    [fromCharCode(0xD83D, 0xDCE1), 'satellite'],
                    [fromCharCode(0xD83D, 0xDCFA), 'tv'],
                    [fromCharCode(0xD83D, 0xDCFB), 'radio'],
                    [fromCharCode(0xD83D, 0xDD0A), 'loud_sound'],
                    [fromCharCode(0xD83D, 0xDD14), 'bell'],
                    [fromCharCode(0xD83D, 0xDCE2), 'loudspeaker'],
                    [fromCharCode(0xD83D, 0xDCE3), 'mega'],
                    [fromCharCode(0xD83D, 0xDD13), 'unlock'],
                    [fromCharCode(0xD83D, 0xDD12), 'lock'],
                    [fromCharCode(0xD83D, 0xDD0F), 'lock_with_ink_pen'],
                    [fromCharCode(0xD83D, 0xDD10), 'closed_lock_with_key'],
                    [fromCharCode(0xD83D, 0xDD11), 'key'],
                    [fromCharCode(0xD83D, 0xDD0E), 'mag_right'],
                    [fromCharCode(0xD83D, 0xDCA1), 'bulb'],
                    [fromCharCode(0xD83D, 0xDD26), 'flashlight'],
                    [fromCharCode(0xD83D, 0xDD0C), 'electric_plug'],
                    [fromCharCode(0xD83D, 0xDD0B), 'battery'],
                    [fromCharCode(0xD83D, 0xDD0D), 'mag'],
                    [fromCharCode(0xD83D, 0xDEC0), 'bath'],
                    [fromCharCode(0xD83D, 0xDEBD), 'toilet'],
                    [fromCharCode(0xD83D, 0xDD27), 'wrench'],
                    [fromCharCode(0xD83D, 0xDD29), 'nut_and_bolt'],
                    [fromCharCode(0xD83D, 0xDD28), 'hammer'],
                    [fromCharCode(0xD83D, 0xDEAA), 'door'],
                    [fromCharCode(0xD83D, 0xDEAC), 'smoking'],
                    [fromCharCode(0xD83D, 0xDCA3), 'bomb'],
                    [fromCharCode(0xD83D, 0xDD2B), 'gun'],
                    [fromCharCode(0xD83D, 0xDD2A), 'hocho'],
                    [fromCharCode(0xD83D, 0xDC8A), 'pill'],
                    [fromCharCode(0xD83D, 0xDC89), 'syringe'],
                    [fromCharCode(0xD83D, 0xDCB0), 'moneybag'],
                    [fromCharCode(0xD83D, 0xDCB4), 'yen'],
                    [fromCharCode(0xD83D, 0xDCB5), 'dollar'],
                    [fromCharCode(0xD83D, 0xDCB3), 'credit_card'],
                    [fromCharCode(0xD83D, 0xDCB8), 'money_with_wings'],
                    [fromCharCode(0xD83D, 0xDCF2), 'calling'],
                    [fromCharCode(0xD83D, 0xDCE7), 'e-mail'],
                    [fromCharCode(0xD83D, 0xDCE5), 'inbox_tray'],
                    [fromCharCode(0xD83D, 0xDCE4), 'outbox_tray'],
                    [fromCharCode(0xD83D, 0xDCE9), 'envelope_with_arrow'],
                    [fromCharCode(0xD83D, 0xDCE8), 'incoming_envelope'],
                    [fromCharCode(0xD83D, 0xDCEB), 'mailbox'],
                    [fromCharCode(0xD83D, 0xDCEA), 'mailbox_closed'],
                    [fromCharCode(0xD83D, 0xDCEE), 'postbox'],
                    [fromCharCode(0xD83D, 0xDCE6), 'package'],
                    [fromCharCode(0xD83D, 0xDCDD), 'memo'],
                    [fromCharCode(0xD83D, 0xDCC4), 'page_facing_up'],
                    [fromCharCode(0xD83D, 0xDCC3), 'page_with_curl'],
                    [fromCharCode(0xD83D, 0xDCD1), 'bookmark_tabs'],
                    [fromCharCode(0xD83D, 0xDCCA), 'bar_chart'],
                    [fromCharCode(0xD83D, 0xDCC8), 'chart_with_upwards_trend'],
                    [fromCharCode(0xD83D, 0xDCC9), 'chart_with_downwards_trend'],
                    [fromCharCode(0xD83D, 0xDCDC), 'scroll'],
                    [fromCharCode(0xD83D, 0xDCCB), 'clipboard'],
                    [fromCharCode(0xD83D, 0xDCC5), 'date'],
                    [fromCharCode(0xD83D, 0xDCC6), 'calendar'],
                    [fromCharCode(0xD83D, 0xDCC7), 'card_index'],
                    [fromCharCode(0xD83D, 0xDCC1), 'file_folder'],
                    [fromCharCode(0xD83D, 0xDCC2), 'open_file_folder'],
                    [fromCharCode(0xD83D, 0xDCCC), 'pushpin'],
                    [fromCharCode(0xD83D, 0xDCCE), 'paperclip'],
                    [fromCharCode(0xD83D, 0xDCCF), 'straight_ruler'],
                    [fromCharCode(0xD83D, 0xDCD0), 'triangular_ruler'],
                    [fromCharCode(0xD83D, 0xDCD5), 'closed_book'],
                    [fromCharCode(0xD83D, 0xDCD7), 'green_book'],
                    [fromCharCode(0xD83D, 0xDCD8), 'blue_book'],
                    [fromCharCode(0xD83D, 0xDCD9), 'orange_book'],
                    [fromCharCode(0xD83D, 0xDCD3), 'notebook'],
                    [fromCharCode(0xD83D, 0xDCD4), 'notebook_with_decorative_cover'],
                    [fromCharCode(0xD83D, 0xDCD2), 'ledger'],
                    [fromCharCode(0xD83D, 0xDCDA), 'books'],
                    [fromCharCode(0xD83D, 0xDCD6), 'book'],
                    [fromCharCode(0xD83D, 0xDD16), 'bookmark'],
                    [fromCharCode(0xD83D, 0xDCDB), 'name_badge'],
                    [fromCharCode(0xD83D, 0xDCF0), 'newspaper'],
                    [fromCharCode(0xD83C, 0xDFA8), 'art'],
                    [fromCharCode(0xD83C, 0xDFAC), 'clapper'],
                    [fromCharCode(0xD83C, 0xDFA4), 'microphone'],
                    [fromCharCode(0xD83C, 0xDFA7), 'headphones'],
                    [fromCharCode(0xD83C, 0xDFBC), 'musical_score'],
                    [fromCharCode(0xD83C, 0xDFB5), 'musical_note'],
                    [fromCharCode(0xD83C, 0xDFB6), 'notes'],
                    [fromCharCode(0xD83C, 0xDFB9), 'musical_keyboard'],
                    [fromCharCode(0xD83C, 0xDFBB), 'violin'],
                    [fromCharCode(0xD83C, 0xDFBA), 'trumpet'],
                    [fromCharCode(0xD83C, 0xDFB7), 'saxophone'],
                    [fromCharCode(0xD83C, 0xDFB8), 'guitar'],
                    [fromCharCode(0xD83D, 0xDC7E), 'space_invader'],
                    [fromCharCode(0xD83C, 0xDFAE), 'video_game'],
                    [fromCharCode(0xD83C, 0xDCCF), 'black_joker'],
                    [fromCharCode(0xD83C, 0xDFB4), 'flower_playing_cards'],
                    [fromCharCode(0xD83C, 0xDC04), 'mahjong'],
                    [fromCharCode(0xD83C, 0xDFB2), 'game_die'],
                    [fromCharCode(0xD83C, 0xDFAF), 'dart'],
                    [fromCharCode(0xD83C, 0xDFC8), 'football'],
                    [fromCharCode(0xD83C, 0xDFC0), 'basketball'],
                    [fromCharCode(0xD83C, 0xDFBE), 'tennis'],
                    [fromCharCode(0xD83C, 0xDFB1), '8ball'],
                    [fromCharCode(0xD83C, 0xDFB3), 'bowling'],
                    [fromCharCode(0xD83C, 0xDFC1), 'checkered_flag'],
                    [fromCharCode(0xD83C, 0xDFC6), 'trophy'],
                    [fromCharCode(0xD83C, 0xDFBF), 'ski'],
                    [fromCharCode(0xD83C, 0xDFC2), 'snowboarder'],
                    [fromCharCode(0xD83C, 0xDFCA), 'swimmer'],
                    [fromCharCode(0xD83C, 0xDFC4), 'surfer'],
                    [fromCharCode(0xD83C, 0xDFA3), 'fishing_pole_and_fish'],
                    [fromCharCode(0xD83C, 0xDF75), 'tea'],
                    [fromCharCode(0xD83C, 0xDF76), 'sake'],
                    [fromCharCode(0xD83C, 0xDF7A), 'beer'],
                    [fromCharCode(0xD83C, 0xDF7B), 'beers'],
                    [fromCharCode(0xD83C, 0xDF78), 'cocktail'],
                    [fromCharCode(0xD83C, 0xDF79), 'tropical_drink'],
                    [fromCharCode(0xD83C, 0xDF77), 'wine_glass'],
                    [fromCharCode(0xD83C, 0xDF74), 'fork_and_knife'],
                    [fromCharCode(0xD83C, 0xDF55), 'pizza'],
                    [fromCharCode(0xD83C, 0xDF54), 'hamburger'],
                    [fromCharCode(0xD83C, 0xDF5F), 'fries'],
                    [fromCharCode(0xD83C, 0xDF57), 'poultry_leg'],
                    [fromCharCode(0xD83C, 0xDF56), 'meat_on_bone'],
                    [fromCharCode(0xD83C, 0xDF5D), 'spaghetti'],
                    [fromCharCode(0xD83C, 0xDF5B), 'curry'],
                    [fromCharCode(0xD83C, 0xDF64), 'fried_shrimp'],
                    [fromCharCode(0xD83C, 0xDF71), 'bento'],
                    [fromCharCode(0xD83C, 0xDF63), 'sushi'],
                    [fromCharCode(0xD83C, 0xDF65), 'fish_cake'],
                    [fromCharCode(0xD83C, 0xDF59), 'rice_ball'],
                    [fromCharCode(0xD83C, 0xDF58), 'rice_cracker'],
                    [fromCharCode(0xD83C, 0xDF5A), 'rice'],
                    [fromCharCode(0xD83C, 0xDF5C), 'ramen'],
                    [fromCharCode(0xD83C, 0xDF72), 'stew'],
                    [fromCharCode(0xD83C, 0xDF62), 'oden'],
                    [fromCharCode(0xD83C, 0xDF61), 'dango'],
                    [fromCharCode(0xD83C, 0xDF73), 'egg'],
                    [fromCharCode(0xD83C, 0xDF5E), 'bread'],
                    [fromCharCode(0xD83C, 0xDF69), 'doughnut'],
                    [fromCharCode(0xD83C, 0xDF6E), 'custard'],
                    [fromCharCode(0xD83C, 0xDF66), 'icecream'],
                    [fromCharCode(0xD83C, 0xDF68), 'ice_cream'],
                    [fromCharCode(0xD83C, 0xDF67), 'shaved_ice'],
                    [fromCharCode(0xD83C, 0xDF82), 'birthday'],
                    [fromCharCode(0xD83C, 0xDF70), 'cake'],
                    [fromCharCode(0xD83C, 0xDF6A), 'cookie'],
                    [fromCharCode(0xD83C, 0xDF6B), 'chocolate_bar'],
                    [fromCharCode(0xD83C, 0xDF6C), 'candy'],
                    [fromCharCode(0xD83C, 0xDF6D), 'lollipop'],
                    [fromCharCode(0xD83C, 0xDF6F), 'honey_pot'],
                    [fromCharCode(0xD83C, 0xDF4E), 'apple'],
                    [fromCharCode(0xD83C, 0xDF4F), 'green_apple'],
                    [fromCharCode(0xD83C, 0xDF4A), 'tangerine'],
                    [fromCharCode(0xD83C, 0xDF52), 'cherries'],
                    [fromCharCode(0xD83C, 0xDF47), 'grapes'],
                    [fromCharCode(0xD83C, 0xDF49), 'watermelon'],
                    [fromCharCode(0xD83C, 0xDF53), 'strawberry'],
                    [fromCharCode(0xD83C, 0xDF51), 'peach'],
                    [fromCharCode(0xD83C, 0xDF48), 'melon'],
                    [fromCharCode(0xD83C, 0xDF4C), 'banana'],
                    [fromCharCode(0xD83C, 0xDF4D), 'pineapple'],
                    [fromCharCode(0xD83C, 0xDF60), 'sweet_potato'],
                    [fromCharCode(0xD83C, 0xDF46), 'eggplant'],
                    [fromCharCode(0xD83C, 0xDF45), 'tomato'],
                    [fromCharCode(0xD83C, 0xDF3D), 'corn']
                ],
                Places : [
                    [fromCharCode(0xD83C, 0xDFE0), 'house'],
                    [fromCharCode(0xD83C, 0xDFE1), 'house_with_garden'],
                    [fromCharCode(0xD83C, 0xDFEB), 'school'],
                    [fromCharCode(0xD83C, 0xDFE2), 'office'],
                    [fromCharCode(0xD83C, 0xDFE3), 'post_office'],
                    [fromCharCode(0xD83C, 0xDFE5), 'hospital'],
                    [fromCharCode(0xD83C, 0xDFE6), 'bank'],
                    [fromCharCode(0xD83C, 0xDFEA), 'convenience_store'],
                    [fromCharCode(0xD83C, 0xDFE9), 'love_hotel'],
                    [fromCharCode(0xD83C, 0xDFE8), 'hotel'],
                    [fromCharCode(0xD83D, 0xDC92), 'wedding'],
                    [fromCharCode(0xD83C, 0xDFEC), 'department_store'],
                    [fromCharCode(0xD83C, 0xDF07), 'city_sunrise'],
                    [fromCharCode(0xD83C, 0xDF06), 'city_sunset'],
                    [fromCharCode(0xD83C, 0xDFEF), 'japanese_castle'],
                    [fromCharCode(0xD83C, 0xDFF0), 'european_castle'],
                    [fromCharCode(0xD83C, 0xDFED), 'factory'],
                    [fromCharCode(0xD83D, 0xDDFC), 'tokyo_tower'],
                    [fromCharCode(0xD83D, 0xDDFE), 'japan'],
                    [fromCharCode(0xD83D, 0xDDFB), 'mount_fuji'],
                    [fromCharCode(0xD83C, 0xDF04), 'sunrise_over_mountains'],
                    [fromCharCode(0xD83C, 0xDF05), 'sunrise'],
                    [fromCharCode(0xD83C, 0xDF03), 'night_with_stars'],
                    [fromCharCode(0xD83D, 0xDDFD), 'statue_of_liberty'],
                    [fromCharCode(0xD83C, 0xDF09), 'bridge_at_night'],
                    [fromCharCode(0xD83C, 0xDFA0), 'carousel_horse'],
                    [fromCharCode(0xD83C, 0xDFA1), 'ferris_wheel'],
                    [fromCharCode(0xD83C, 0xDFA2), 'roller_coaster'],
                    [fromCharCode(0xD83D, 0xDEA2), 'ship'],
                    [fromCharCode(0xD83D, 0xDEA4), 'speedboat'],
                    [fromCharCode(0xD83D, 0xDE80), 'rocket'],
                    [fromCharCode(0xD83D, 0xDCBA), 'seat'],
                    [fromCharCode(0xD83D, 0xDE89), 'station'],
                    [fromCharCode(0xD83D, 0xDE84), 'bullettrain_side'],
                    [fromCharCode(0xD83D, 0xDE85), 'bullettrain_front'],
                    [fromCharCode(0xD83D, 0xDE87), 'metro'],
                    [fromCharCode(0xD83D, 0xDE83), 'railway_car'],
                    [fromCharCode(0xD83D, 0xDE8C), 'bus'],
                    [fromCharCode(0xD83D, 0xDE99), 'blue_car'],
                    [fromCharCode(0xD83D, 0xDE97), 'car'],
                    [fromCharCode(0xD83D, 0xDE95), 'taxi'],
                    [fromCharCode(0xD83D, 0xDE9A), 'truck'],
                    [fromCharCode(0xD83D, 0xDEA8), 'rotating_light'],
                    [fromCharCode(0xD83D, 0xDE93), 'police_car'],
                    [fromCharCode(0xD83D, 0xDE92), 'fire_engine'],
                    [fromCharCode(0xD83D, 0xDE91), 'ambulance'],
                    [fromCharCode(0xD83D, 0xDEB2), 'bike'],
                    [fromCharCode(0xD83D, 0xDC88), 'barber'],
                    [fromCharCode(0xD83D, 0xDE8F), 'busstop'],
                    [fromCharCode(0xD83C, 0xDFAB), 'ticket'],
                    [fromCharCode(0xD83D, 0xDEA5), 'traffic_light'],
                    [fromCharCode(0xD83D, 0xDEA7), 'construction'],
                    [fromCharCode(0xD83D, 0xDD30), 'beginner'],
                    [fromCharCode(0xD83C, 0xDFEE), 'izakaya_lantern'],
                    [fromCharCode(0xD83C, 0xDFB0), 'slot_machine'],
                    [fromCharCode(0xD83D, 0xDDFF), 'moyai'],
                    [fromCharCode(0xD83C, 0xDFAA), 'circus_tent'],
                    [fromCharCode(0xD83C, 0xDFAD), 'performing_arts'],
                    [fromCharCode(0xD83D, 0xDCCD), 'round_pushpin'],
                    [fromCharCode(0xD83D, 0xDEA9), 'triangular_flag_on_post']
                ],
                Symbols : [
                    [fromCharCode(0xD83D, 0xDD1F), 'keycap_ten'],
                    [fromCharCode(0xD83D, 0xDD22), '1234'],
                    [fromCharCode(0xD83D, 0xDD23), 'symbols'],
                    [fromCharCode(0xD83D, 0xDD20), 'capital_abcd'],
                    [fromCharCode(0xD83D, 0xDD21), 'abcd'],
                    [fromCharCode(0xD83D, 0xDD24), 'abc'],
                    [fromCharCode(0xD83D, 0xDD3C), 'arrow_up_small'],
                    [fromCharCode(0xD83D, 0xDD3D), 'arrow_down_small'],
                    [fromCharCode(0xD83C, 0xDD97), 'ok'],
                    [fromCharCode(0xD83C, 0xDD95), 'new'],
                    [fromCharCode(0xD83C, 0xDD99), 'up'],
                    [fromCharCode(0xD83C, 0xDD92), 'cool'],
                    [fromCharCode(0xD83C, 0xDD93), 'free'],
                    [fromCharCode(0xD83C, 0xDD96), 'ng'],
                    [fromCharCode(0xD83D, 0xDCF6), 'signal_strength'],
                    [fromCharCode(0xD83C, 0xDFA6), 'cinema'],
                    [fromCharCode(0xD83C, 0xDE01), 'koko'],
                    [fromCharCode(0xD83C, 0xDE2F), 'u6307'],
                    [fromCharCode(0xD83C, 0xDE33), 'u7a7a'],
                    [fromCharCode(0xD83C, 0xDE35), 'u6e80'],
                    [fromCharCode(0xD83C, 0xDE34), 'u5408'],
                    [fromCharCode(0xD83C, 0xDE32), 'u7981'],
                    [fromCharCode(0xD83C, 0xDE50), 'ideograph_advantage'],
                    [fromCharCode(0xD83C, 0xDE39), 'u5272'],
                    [fromCharCode(0xD83C, 0xDE3A), 'u55b6'],
                    [fromCharCode(0xD83C, 0xDE36), 'u6709'],
                    [fromCharCode(0xD83C, 0xDE1A), 'u7121'],
                    [fromCharCode(0xD83D, 0xDEBB), 'restroom'],
                    [fromCharCode(0xD83D, 0xDEB9), 'mens'],
                    [fromCharCode(0xD83D, 0xDEBA), 'womens'],
                    [fromCharCode(0xD83D, 0xDEBC), 'baby_symbol'],
                    [fromCharCode(0xD83D, 0xDEBE), 'wc'],
                    [fromCharCode(0xD83D, 0xDEAD), 'no_smoking'],
                    [fromCharCode(0xD83C, 0xDE38), 'u7533'],
                    [fromCharCode(0xD83C, 0xDE51), 'accept'],
                    [fromCharCode(0xD83C, 0xDD91), 'cl'],
                    [fromCharCode(0xD83C, 0xDD98), 'sos'],
                    [fromCharCode(0xD83C, 0xDD94), 'id'],
                    [fromCharCode(0xD83D, 0xDEAB), 'no_entry_sign'],
                    [fromCharCode(0xD83D, 0xDD1E), 'underage'],
                    [fromCharCode(0xD83D, 0xDC9F), 'heart_decoration'],
                    [fromCharCode(0xD83C, 0xDD9A), 'vs'],
                    [fromCharCode(0xD83D, 0xDCF3), 'vibration_mode'],
                    [fromCharCode(0xD83D, 0xDCF4), 'mobile_phone_off'],
                    [fromCharCode(0xD83C, 0xDD8E), 'ab'],
                    [fromCharCode(0xD83D, 0xDCA0), 'diamond_shape_with_a_dot_inside'],
                    [fromCharCode(0xD83D, 0xDD2F), 'six_pointed_star'],
                    [fromCharCode(0xD83C, 0xDFE7), 'atm'],
                    [fromCharCode(0xD83D, 0xDCB9), 'chart'],
                    [fromCharCode(0xD83D, 0xDCB2), 'heavy_dollar_sign'],
                    [fromCharCode(0xD83D, 0xDCB1), 'currency_exchange'],
                    [fromCharCode(0xD83D, 0xDD1D), 'back'],
                    [fromCharCode(0xD83D, 0xDD1A), 'on'],
                    [fromCharCode(0xD83D, 0xDD19), 'soon'],
                    [fromCharCode(0xD83D, 0xDD1B), 'arrows_clockwise'],
                    [fromCharCode(0xD83D, 0xDD1C), 'clock12'],
                    [fromCharCode(0xD83D, 0xDD03), 'clock1'],
                    [fromCharCode(0xD83D, 0xDD5B), 'clock2'],
                    [fromCharCode(0xD83D, 0xDD50), 'clock3'],
                    [fromCharCode(0xD83D, 0xDD51), 'clock4'],
                    [fromCharCode(0xD83D, 0xDD52), 'clock5'],
                    [fromCharCode(0xD83D, 0xDD53), 'clock6'],
                    [fromCharCode(0xD83D, 0xDD54), 'clock7'],
                    [fromCharCode(0xD83D, 0xDD55), 'clock8'],
                    [fromCharCode(0xD83D, 0xDD56), 'clock9'],
                    [fromCharCode(0xD83D, 0xDD57), 'clock10'],
                    [fromCharCode(0xD83D, 0xDD58), 'clock11'],
                    [fromCharCode(0xD83D, 0xDD59), 'heavy_plus_sign'],
                    [fromCharCode(0xD83D, 0xDD5A), 'heavy_minus_sign'],
                    [fromCharCode(0xD83D, 0xDCAE), 'radio_button'],
                    [fromCharCode(0xD83D, 0xDCAF), 'link'],
                    [fromCharCode(0xD83D, 0xDD18), 'curly_loop'],
                    [fromCharCode(0xD83D, 0xDD17), 'trident'],
                    [fromCharCode(0xD83D, 0xDD31), 'black_square_button'],
                    [fromCharCode(0xD83D, 0xDD3A), 'white_square_button'],
                    [fromCharCode(0xD83D, 0xDD32), 'red_circle'],
                    [fromCharCode(0xD83D, 0xDD33), 'large_blue_circle'],
                    [fromCharCode(0xD83D, 0xDD34), 'small_red_triangle_down'],
                    [fromCharCode(0xD83D, 0xDD35), 'white_large_square'],
                    [fromCharCode(0xD83D, 0xDD3B), 'black_large_square'],
                    [fromCharCode(0xD83D, 0xDD36), 'small_orange_diamond'],
                    [fromCharCode(0xD83D, 0xDD37), 'small_blue_diamond']   
                ]
            },

            _emojiGroup = (function() {

                var emojiGroup = {};
                $.each(groups, function(key, value) {

                    emojiGroup[key] = {};
                    
                    $.each(value, function(index, value) {

                        var title = value[1],
                            code = value[0];
                        
                        emojiGroup[key][title] = {
                            value: code,
                            title: title
                        };
                    }); 
                });
                return emojiGroup;
                
            })(),

            _emojiMap = (function(){
                var _emojiMap = {};
                for (var group in _emojiGroup) {
                    for (key in _emojiGroup[group]) {
                        _emojiMap[_emojiGroup[group][key].value] = _emojiGroup[group][key];
                    }
                }
                return _emojiMap;
            }());

        this.getEmojiCode = function(group, title) {
            return _emojiGroup[group][title];
        };

        this.getEmojiGroup = function(group, filter) {
            var dictionary = _emojiGroup[group];
            if (filter && typeof filter === 'function') {
                for (var key in dictionary) {
                    if (filter(key) == true) {
                        var value = _emojiGroup[group][key].value;
                        delete _emojiMap[value];
                        delete dictionary[key];
                    }
                }
            }
            return dictionary;
        };

        this.isEmoji = function(content) {
            if (!content || content.length > 3) {
                return false;
            }

            var emoji = _emojiMap[content];
            var isEmoji = emoji ? true : false;
            return isEmoji;
        };
    }

    Service.$emoji = new PPEmoji();
    
})(Service));

Service.$encryption = ( function() {

    /////// API /////////
    
    return {
        hex_sha1: hex_sha1
    }

    /// Implenmentation ///

    function hex_sha1( s ) {

        var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
        
        /*
         * Convert a raw string to a hex string
         */
        function rstr2hex(input)
        {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for(var i = 0; i < input.length; i++)
            {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F)
                    +  hex_tab.charAt( x        & 0x0F);
            }
            return output;
        }
        
        /*
         * Convert an array of big-endian words to a string
         */
        function binb2rstr(input)
        {
            var output = "";
            for(var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
            return output;
        }

        /*
         * Calculate the SHA-1 of an array of big-endian words, and a bit length
         */
        function binb_sha1(x, len)
        {
            /* append padding */
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;

            var w = Array(80);
            var a =  1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d =  271733878;
            var e = -1009589776;

            for(var i = 0; i < x.length; i += 16)
            {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                var olde = e;

                for(var j = 0; j < 80; j++)
                {
                    if(j < 16) w[j] = x[i + j];
                    else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                    var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                                     safe_add(safe_add(e, w[j]), sha1_kt(j)));
                    e = d;
                    d = c;
                    c = bit_rol(b, 30);
                    b = a;
                    a = t;
                }

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
                e = safe_add(e, olde);
            }
            return Array(a, b, c, d, e);

        }

        /*
         * Convert a raw string to an array of big-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        function rstr2binb(input)
        {
            var output = Array(input.length >> 2);
            for(var i = 0; i < output.length; i++)
                output[i] = 0;
            for(var i = 0; i < input.length * 8; i += 8)
                output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
            return output;
        }

        /*
         * Determine the appropriate additive constant for the current iteration
         */
        function sha1_kt(t)
        {
            return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
                (t < 60) ? -1894007588 : -899497514;
        }

        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        function bit_rol(num, cnt)
        {
            return (num << cnt) | (num >>> (32 - cnt));
        }

        /*
         * Perform the appropriate triplet combination function for the current
         * iteration
         */
        function sha1_ft(t, b, c, d)
        {
            if(t < 20) return (b & c) | ((~b) & d);
            if(t < 40) return b ^ c ^ d;
            if(t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        }

        /*
         * Calculate the SHA1 of a raw string
         */
        function rstr_sha1(s)
        {
            return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
        }

        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        function safe_add(x, y)
        {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        /*
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */
        function str2rstr_utf8(input)
        {
            var output = "";
            var i = -1;
            var x, y;

            while(++i < input.length)
            {
                /* Decode utf-16 surrogate pairs */
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
                {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }

                /* Encode output as utf-8 */
                if(x <= 0x7F)
                    output += String.fromCharCode(x);
                else if(x <= 0x7FF)
                    output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                                  0x80 | ( x         & 0x3F));
                else if(x <= 0xFFFF)
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                                  0x80 | ((x >>> 6 ) & 0x3F),
                                                  0x80 | ( x         & 0x3F));
                else if(x <= 0x1FFFFF)
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                                  0x80 | ((x >>> 12) & 0x3F),
                                                  0x80 | ((x >>> 6 ) & 0x3F),
                                                  0x80 | ( x         & 0x3F));
            }
            return output;
        }

        return rstr2hex(rstr_sha1(str2rstr_utf8(s)));
    }
    
} )();


/**
 *
 * var $uploader = Service.$uploader;
 * 
 * // Upload
 * var uploadId = $uploader.upload({
 *     type: 'file'/'txt',
 *     content: file / 'large text'
 * }).progress(function(percentage) {
 *     // 0 ~ 100
 * }).done(function(response){
 *     // response.fuuid
 * }).fail(function(errorCode){
 *     switch (errorCode) {
 *         // ...
 *     }
 * }).query().uploadId;
 *
 * // Cancel
 * $uploader.cancel(uploadId);
 *
 * // Clear all uploading tasks
 * $uploader.clear();
 *
 */
((function(Service) {

    var Uploader = function() {

        var FILE_UPLOAD_ID_PREFIX = 'file-upload-',
            
            fileUploadPools = {},

            ERROR_CODE = Uploader.ERROR_CODE,

            // Create the XHR object.
            createCORSRequest = function (method, url) {

                var xhr = new XMLHttpRequest();
                if ("withCredentials" in xhr) {
                    // XHR for Chrome/Firefox/Opera/Safari.
                    xhr.open(method, url, true);
                } else if (typeof XDomainRequest != "undefined") {
                    // XDomainRequest for IE.
                    xhr = new XDomainRequest();
                    xhr.open(method, url);
                } else {
                    // CORS not supported.
                    xhr = null;
                }
                return xhr;
            },

            UploadTask = function(settings) {

                var self = this,
                    $json = Service.$json,
                    
                    url = null,
                    type = settings.type, // 'file' / 'txt'
                    uploadId = FILE_UPLOAD_ID_PREFIX + Service.$tools.getUUID(), // file upload id

                    doneCallback = null, // done callback
                    failCallback = null,
                    progressCallback = null,

                    status = {
                        uploadId: uploadId,
                        state: 'RUNNING',
                        progress: 0
                    },

                    fixResponse = function (response) { // Fix response , so let file and txt return the same result

                        var fuuid = null;
                        
                        switch (type) {
                        case 'file':
                            fuuid = $json.parse(response).fuuid;
                            break;

                        case 'txt':
                            fuuid = $json.parse(response).fid;
                            break;
                        }

                        return { fuuid: fuuid };
                    };

                // Store task to task pool
                fileUploadPools[uploadId] = this;

                // choose url
                switch (type) {
                case 'file':
                    url = Configuration.file_upload_url;
                    break;

                case 'txt':
                    url = Configuration.file_upload_txt_url;
                    break;
                }

                var xhr = createCORSRequest("post", url); // create a xhr 

                // A function that is called periodically with information about the progress of the request.
                // NOTE: 'txt' can not add call this method, or it will not working !!!
                if (type == 'file') {
                    xhr.upload.onprogress = function (e) {
                        
                        if (e.lengthComputable) {
                            var percentage = Math.round((e.loaded * 100) / e.total);
                            
                            if (status.state == 'RUNNING') {
                                status.progress = percentage;

                                // progress callback
                                if (progressCallback) progressCallback(percentage);
                            }
                        }
                    };   
                }

                // The function to call when a request encounters an error.
                xhr.onerror = function (e) {
                    if (failCallback) failCallback(ERROR_CODE.SERVICE_NOT_AVALIABLE);
                };

                // The function to call when a request is aborted.
                xhr.onabort = function (e) {
                    if (failCallback) failCallback(ERROR_CODE.CANCEL);
                };

                // The function to call when an HTTP request returns after successfully loading content.
                xhr.onload = function (e) {

                    // Change state to 'FINISH'
                    status.state = 'FINISH';
                    status.progress = 100;
                    
                    if (type == 'txt') $("#pp-composer-container-content-txt").val('');
                    if (doneCallback) doneCallback(fixResponse(xhr.responseText));
                };

                // Upload It !!!
                switch (type) {

                case 'file':
                    
                    // Build a form to send data
                    var formData = new FormData();
                    formData.append('file', settings.content);
                    formData.append('upload_type', 'file');
                    formData.append('subtype', 'FILE');
                    formData.append('user_uuid', Service.$user.getUser().getInfo().user_uuid);
                    xhr.send(formData);
                    break;

                case 'txt':
                    $("#pp-composer-container-content-txt").val(settings.content); 
                    var form = document.forms.namedItem("pp-composer-container-form");
                    var data = new FormData(form);
                    xhr.send(data);
                    
                    break;
                    
                }

                this.progress = function(callback) {
                    progressCallback = callback;
                    return this;
                };

                this.done = function(callback) {
                    doneCallback = callback;
                    return this;
                };

                this.fail = function(callback) {
                    failCallback = callback;
                    return this;
                };

                this.cancel = function() {
                    if (status.state == 'CANCEL') return;

                    status.state = 'CANCEL';
                    xhr.abort();
                };

                this.query = function() {
                    return status;
                };
            };

        this.upload = function(settings) {
            return new UploadTask(settings);
        };

        this.cancel = function(uploadId) {
            if (uploadId && fileUploadPools[uploadId]) {
                fileUploadPools[uploadId].cancel();
            }
        };

        this.clear = function() {
            var self = this;
            $.each(fileUploadPools, function(key, value) {
                self.cancel(key);
            });
        };
        
    };

    // Error Code
    Uploader.ERROR_CODE = {
        SERVICE_NOT_AVALIABLE: 0, // Service not avaliable (XMLHttpRequest encounter error)
        CANCEL: 1 // Upload cancel
    };

    Service.Uploader = Uploader;
    Service.$uploader = new Uploader();
    
})(Service));

Service.$language = ( function() {

    var _DEFAULT = 'en',
        _language = _DEFAULT;

    return {
        getLanguage: getLanguage,
        setLanguage: setLanguage
    }
    
    function getLanguage() {
        return _language;
    }

    function setLanguage( language ) {
        if (language) {
            language = language.toLowerCase();
        }
        switch(language) {
        case 'zh':
        case 'zh-cn':
        case 'zh-hk':
        case 'zh-tw':
        case 'zh-sg':
            _language = 'zh-CN';
            break;

        case 'en':
        case 'en-us':
            _language = 'en';
            break;

        default:
            _language = _DEFAULT;
            break;
        }
    }
    
} )();

((function(Service) {

    function PPTools() {

        var self = this,

            iconTools = {
                get: function(fid) {
                    var url = self.getFileDownloadUrl(fid);
                    return url || Service.Constants.ICON_DEFAULT_USER;
                }
            };

        this.scrollbarWidth = getScrollBarWidth();
        
        this.getUUID = function() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x7|0x8)).toString(16);
            });
            return uuid;
        };

        /*
         * is image
         *
         * @return is image
         */
        this.isImage = function(filePath) {
            var _isImage = false;
            if (filePath) {
                var dot = filePath.lastIndexOf('.');

                if (dot != -1 && dot != 0) {
                    //retrieve suffix
                    var suffix = filePath.substring(dot + 1);

                    // fix-bug: issue#4
                    if (suffix) {
                        suffix = suffix.toLowerCase();
                    }
                    
                    if (suffix == 'jpg' ||
                        suffix == 'jpeg' ||
                        suffix == 'png' ||
                        suffix == 'gif') {

                        _isImage = true;
                    }
                }
            }

            return _isImage;
        };

        // convert message to our inner message data structure
        this.messageAdapter = function(message) {
            return message;
        };

        /**
         * Get the message uploadId which messageType == 'FILE' || messageType == 'IMAGE'
         */
        this.getMessageUploadId = function(message) {
            var uploadId = '';
            switch(message.messageType) {
            case 'FILE':
                uploadId = message.message.file.fileUploadId;
                break;

            case 'IMAGE':
                uploadId = message.message.image.fileUploadId;
                break;
            }
            return uploadId;
        };

        /**
         * Check message send canceled or send errored.
         */
        this.isMessageSendError = function(message) {
            return message.messageState == 'ERROR' || message.messageState == 'CANCELED';
        };

        /**
         * Check message is uploading file
         */
        this.isUploading = function(message) {
            return message.messageState == "BEGIN_UPLOAD" ||
                message.messageState == "SENDING";
        };

        /*
         * Get file download url
         */
        this.getFileDownloadUrl = function(fid, fileName) {
            
            // fix bug
            // return http://192.168.0.216:8080/download/undefined
            if ( !fid ) return undefined;
            
            var isHttpLink = /(^https?:\/\/)|(^w{3})/.test(fid);
            var baseUrl =  isHttpLink ? fid : Configuration.file_download_url + fid;

            // Fix-bug : file url encoding error at http://www.qq.com/
            // @see http://redmine.ppmessage.cn/issues/232
            fileName && (baseUrl += "?file_name=" + Service.$gb2312utf8.GB2312ToUTF8( fileName ))
            return baseUrl;
        };

        /**
         * Is show emoji icon
         */
        this.isShowEmojiIcon = function() {
            return Service.$device.isMac();
        };

        /*
         * Get remote text file content
         */
        this.getRemoteTextFileContent = function(fid, callback, errorCallback) {
            var url = this.getFileDownloadUrl(fid);
            $.get(url, function(data) {
                if (callback) callback(data);
            }).fail(function() {
                if (errorCallback) errorCallback();
            });
        };

        //@param time: "yyyy-MM-dd HH:mm:ss SSSSS"
        this.getTimestamp = function(time) {
            //yyyy-MM-dd HH:mm:ss 为19
            if (time.length >= 19) {
                time = time.substring(0, 19);
            }
            var d = new Date(time.replace('-','/'));
            return d.getTime();
        };

        /**
         * 0 --> 00
         * 1 --> 01
         * 2 --> 02
         */
        this.padNumber = function(d) {
            return (d < 10) ? '0' + d.toString() : d.toString();
        };

        /**
         * formatTime
         *
         * Convert to timestamp in milliseconds to human-readable format
         *
         * @param timestampInMilliSeconds: messageTimestamp in milliseconds
         * @param config: for i18n
         * {
         *     year: 年,
         *     month: 月,
         *     day: "日",
         *     today: "今天",
         *     yesterday: "昨天",
         * }
         */
        this.formatTime = function(timestampInMilliSeconds, config) {
            var date = new Date(timestampInMilliSeconds);

            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getUTCDate();
            var hour = date.getHours();
            var minute = date.getMinutes();

            var curDate = new Date();
            var curYear = curDate.getFullYear();
            var curMonth = curDate.getMonth();
            var curDay = curDate.getUTCDate();

            // console.log("now:", curDate, ", other:", date);

            var YEAR = config.year;
            var MONTH = config.month;
            var DAY = config.day;
            var TODAY = config.today;
            var YESTERDAY = config.yesterday;

            if (year == curYear && month == curMonth && day == curDay) {
                return TODAY + " " + self.padNumber(hour) + ":" + self.padNumber(minute);
            } else {                                    
                if (curDate.getTime() - date.getTime() <= 86400000) {
                    return YESTERDAY + " " + self.padNumber(hour) + ":" + self.padNumber(minute);
                }

                if (year < curYear) {
                    return year + YEAR + self.padNumber(month + 1) + MONTH + self.padNumber(day) + DAY + " " + self.padNumber(hour) + ":" + self.padNumber(minute);
                } else if (year == curYear) {
                    if (month <= curMonth) {
                        return self.padNumber(month + 1) + MONTH + self.padNumber(day) + DAY + " " + self.padNumber(hour) + ":" + self.padNumber(minute);
                    }
                }
            }
            
            return year + YEAR + self.padNumber(month + 1) + MONTH + self.padNumber(day) + DAY + " " + self.padNumber(hour) + ":" + self.padNumber(minute);
        };

        this.validateEmail = function(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        };

        /**
         * '50px'-->'50'
         */
        this.cssNum = function(cssValue) {
            return parseFloat(cssValue);
        };

        // reverse array
        this.reverseArray = function(array) {
            if (!array || array.length === 0) return array;
            return array.reverse();
        };

        // ---------------
        // ICON TOOLS
        // ---------------
        this.icon = iconTools;

        this.isNull = function ( obj ) {
            return ( obj === null ) || ( obj === undefined );
        };

        // We consider `{error_code: 0, uri: "/XXX_XXX_XXX", error_string: "success."}` obj as empty response
        this.isApiResponseEmpty = function( response ) {
            if ( !response ) return true;
            if ( response.error_code !== 0 ) return false;

            var copy = $.extend( {}, response );
            delete copy[ 'error_code' ];
            delete copy[ 'error_string' ];
            delete copy[ 'uri' ];

            return $.isEmptyObject( copy );
        };

        // format string
        //
        // ```javascript
        // var formattedStr = Service.$tools.format( 'Hello, %s and %s.', 'Tom', 'Jenny' );
        // ```
        //
        // `formattedStr` will be 'Hello, Tom and Jenny'
        //
        this.format = function( str ) {
            var args = [].slice.call(arguments, 1),
                i = 0;

            return str.replace(/%s/g, function() {
                return args[i++];
            });
        };
        
    }

    function getScrollBarWidth () {
        var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
            widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
        $outer.remove();
        return 100 - widthWithScroll;
    };

    Service.PPTools = PPTools;
    
})(Service));

/**
 * 加载PPCom的入口:
 *
 * 创建匿名用户、获取用户信息、更新device等
 *
 * new PP.PPStartUp().startUp(ppSettings, function() {
 *     console.log('StartUp successful!');
 * }, function(errorCode) {
 *     console.log('StartUp failed, errorCode: ' + errorCode);
 * });
 *
 */
((function(Service) {

    /**
     * @constructor
     */
    function PPStartUp($api, $device) {

        var ErrorHint = Service.ErrorHint,

            _createAnonymousUser = function(cookieId, succCB, failCB) {
                $api.createAnonymousUser({
                    app_uuid: Service.$ppSettings.getAppUuid(),
                    ppcom_trace_uuid: cookieId
                }, succCB, failCB);
            },

            /*
             * 如果 ppSettings.user_name 存在并且和服务器的 user_fullname 不同，那么会更新服务器的用户信息
             *
             * @param user: 根据 window.ppSettings 生成的本地的 user object
             * @param userNameFromServer: 匿名创建用户返回的默认user_fullname 或者 实名用户调用 getUserDetailInfo 返回的 user_fullname
             * @param succCB: success 回调
             * @param failCB: fail 回调
             */
            _updateUserInfo = function(userSettings, response, succCB, failCB) {
                if (userSettings.user_fullname || userSettings.user_avatar) {
                    var requestObj = {
                        app_uuid: Service.$ppSettings.getAppUuid(),
                        user_uuid: userSettings.user_uuid,
                        user_fullname: userSettings.user_fullname,
                        user_icon: userSettings.user_avatar,
                        user_email: userSettings.user_email
                    };
                    $api.updateUser(requestObj, succCB, failCB);
                } else {
                    Service.$ppSettings.updateUserSettings({
                        user_fullname: response.user_fullname,
                        user_avatar: response.user_avatar
                    });
                    if (succCB) succCB();
                }
            },

            _createDevice = function(userSettings, succCB, failCB) {
                $api.createDevice({
                    app_uuid: Service.$ppSettings.getAppUuid(),
                    user_uuid: userSettings.user_uuid,
                    device_ostype: Service.$device.getOSType(),
                    ppcom_trace_uuid: userSettings.ppcom_trace_uuid,
                    device_id: Service.$device.getDeviceId()
                }, function(result) {
                    
                    $api.updateDevice({
                        device_uuid: result.device_uuid,
                        device_ostype: Service.$device.getOSType()
                    });
                    Service.$ppSettings.updateUserSettings({
                        device_uuid: result.device_uuid
                    });

                    succCB(result);
                }, function(response) {

                    var DEVICE_EXISTED_ERROR_CODE = 25;
                    
                    //Create device failed.
                    if (response && response['error_code']) {
                        if (response['error_code'] == DEVICE_EXISTED_ERROR_CODE) {
                            Service.$ppSettings.updateUserSettings({
                                device_uuid : response.device_uuid
                            });
                            succCB(response);
                            return;
                        }
                    }
                    if (failCB) failCB(response);
                });
            },

            // The final callback
            //
            // 1. update local user info
            // 2. fetch the MUST REQUEST INITIAL DATA from server to show `PPMessage`
            // 3. create `WebSocket` so listen for new message arrived
            // 4. draw view
            // 5. callback
            _getDefaultCreateDeviceSuccessCallback = function(userSettings, succCallback, errorCallback) {
                return function() {

                    // Store web_site user
                    Service.$user.setUser(userSettings);

                    // create dom
                    View.Style.init();
                    $(document.body).append(new View.PPContainer().getElement());

                    // start message receiver service
                    Service.$messageReceiverModule.start({
                        user_uuid: userSettings.user_uuid,
                        device_uuid: userSettings.device_uuid,
                        app_uuid: Service.$ppSettings.getAppUuid()
                    });

                    setTimeout(function() {
                        if (succCallback) succCallback();
                    });
                    
                }
            },

            _startUpAnonymousUser = function(userSettings, succCallback, errorCallback) {

                // 1. create anonymous user
                // 2. update user info
                // 3. create device
                // 4. update device
                // 5. create dom
                var cookieId = userSettings.ppcom_trace_uuid;
                
                _createAnonymousUser(cookieId, function(response) {
                    Service.$ppSettings.updateUserSettings({
                        user_uuid : response.user_uuid
                    });
                    _updateUserInfo(userSettings, {user_fullname:response.user_fullname, user_avatar: null}, null, null);
                    _createDevice(userSettings, _getDefaultCreateDeviceSuccessCallback(userSettings, succCallback, errorCallback), null);
                }, errorCallback);
            },

            _startUpNoneAnonymousUser = function(userSettings, succCallback, errorCallback) {

                // Validate Email
                if (!Service.$tools.validateEmail(userSettings.user_email)) {
                    if (errorCallback) errorCallback(Service.ErrorHint.ERROR_ILLEGAL_USER_EMAIL_STYLE);
                    return;
                }

                // 1. get user uuid
                // 2. get user detail info
                // 3. update user info
                // 4. create device
                // 5. update device
                // 6. create dom
                $api.getUserUuid({
                    app_uuid: Service.$ppSettings.getAppUuid(),
                    user_icon: userSettings.user_avatar,
                    user_email: userSettings.user_email,
                    user_fullname: userSettings.user_fullname
                }, function(response) {
                    $api.getUserDetailInfo({
                        uuid: response.user_uuid,
                        type: 'DU'
                    }, function(response) {
                        Service.$ppSettings.updateUserSettings({
                            user_uuid : response.uuid
                        });
                        _updateUserInfo(userSettings, {user_fullname: response.fullname, user_avatar: response.icon}, null, null);
                        _createDevice(userSettings, _getDefaultCreateDeviceSuccessCallback(userSettings, succCallback, errorCallback), null);
                    }, function(error) {
                    });
                }, function() {
                    if (errorCallback) errorCallback(Service.ErrorHint.ERROR_ILLEGAL_USER_EMAIL);
                });
            };

        //-------------------------------
        //API
        //-------------------------------

        this.startUp = function(ppSettings, succCallback, errorCallback) {

            // check browser version
            if (Service.$device.isIE9OrLowerVersionBrowser()) {
                if (errorCallback) errorCallback(ErrorHint.ERROR_IE9_OR_LOWER_BROWSER);
                return;
            }
            
            //Make a copy
            var s = {};
            $.extend(true, s, ppSettings);

            //Use ppSettings init $ppSettings service
            Service.$ppSettings.init(s);
            //init view settings
            View.$settings.init(s);
            
            if (Service.$ppSettings.getAppUuid()) {

                // Use app_key and app_secret to init $api service
                Service.$api.init(Service.$ppSettings.getAppUuid(), Service.$ppSettings.getApiKey(), Service.$ppSettings.getApiSecret());
                
                //set language
                Service.$language.setLanguage(Service.$ppSettings.getLanguage());

                // 0. zero step
                Service.$api.getPPComToken(function(response) {
                    // 1. first step
                    Service.$api.getAppInfo({
                        app_uuid: Service.$ppSettings.getAppUuid(),
                    }, function(response) {
                        // Cache app info to root cache
                        Service.$app.set(response);
                        
                        var userSettings = Service.$ppSettings.getUserSettings();
                        //anonymous user
                        if (userSettings.is_anonymous) {
                            _startUpAnonymousUser(userSettings, succCallback, errorCallback);
                        } else {
                            _startUpNoneAnonymousUser(userSettings, succCallback, errorCallback);
                        }
                        
                    }, function(error) {
                        if (errorCallback) errorCallback(ErrorHint.ERROR_SERVICE_NOT_AVALIABLE);
                    });
                    
                }, function(error) {
                    if (errorCallback) errorCallback(ErrorHint.ERROR_SERVICE_NOT_AVALIABLE);
                });
            } else {
                if (errorCallback) errorCallback(ErrorHint.ERROR_ILLEGAL_APPUUID);
            }
        };
    }

    PPStartUp.bootServices = function(reboot) {
        Service.bootMe(reboot);
        View.bootMe(reboot);
    };

    Service.PPStartUp = PPStartUp;
})(Service));

((function(Service) {

    function PublicAPI() {
        this._booted = false;
        this._onShowEvent = null;
        this._onHideEvent = null;
    }

    /**
     * Clear all datas
     *
     */
    PublicAPI.prototype._clearData = function() {
        Service.$uploader.clear();
        Service.$notification.reset();
        Ctrl.$conversationPanel.stopPollingWaitingQueueLength();
    };

    /**
     * @param ppSettings
     * @param callback: 
     *     success: function(true)
     *     fail: function(false, errorCode);
     */
    PublicAPI.prototype.boot = function(ppSettings, callback) {
        if (!ppSettings) {
            return;
        }
        if (this._booted) {
            return;
        }

        this._booted = true;
        var that = this;

        Service.$startUp.startUp(ppSettings, function() {
            that._booted = true;
            if ($.isFunction(callback)) callback(true);
        }, function(errorCode) {
            that._booted = false;
            that._clearData();
            Service.$errorHint.warn(errorCode);
            if ($.isFunction(callback)) callback(false, errorCode);
        });
    };

    PublicAPI.prototype.show = function() {
        if (!this._booted) {
            return;
        }

        var launcherCtrl = Ctrl.$launcher.get();
        if (launcherCtrl) {
            launcherCtrl.onClickEvent();
            if (this._onShowEvent && typeof this._onShowEvent === 'function') {
                this._onShowEvent();
            }
        }
    };

    PublicAPI.prototype.hide = function() {
        if (!this._booted) {
            return;
        }
        
        var sheetHeaderCtrl = Ctrl.$sheetheader;
        if (sheetHeaderCtrl) {
            sheetHeaderCtrl.minimize();

            if (this._onHideEvent && typeof this._onHideEvent === 'function') {
                this._onHideEvent();
            }
        }
    };

    PublicAPI.prototype.onShow = function(event) {
        this._onShowEvent = event;
    };

    PublicAPI.prototype.onHide = function(event) {
        this._onHideEvent = event;
    };

    PublicAPI.prototype.shutdown = function() {
        if (!this._booted) {
            return;
        }
        $('#pp-container').remove();
        this._booted = false;
        this._clearData();
    };

    PublicAPI.prototype.update = function(ppSettings) {
        if (!this._booted) {
            return false;
        }
        
        var s = ppSettings;
        var api = Service.$api;
        var user = Service.$user.getUser();
        
        if (s && user
            && s.app_uuid == api.getAppUuid()
            && s.user_email == user.getInfo().user_email) {
            return false;
        }

        return true;
    };

    Service.PublicAPI = PublicAPI;
    
})(Service));

((function(Service) {

    function BaseStorage() {
    }
    BaseStorage.reposity = {};

    /**
     * 静态方法
     */
    BaseStorage.clear = function() {
        BaseStorage.reposity = {};        
    };

    BaseStorage.prototype.get = function(key) {
        return BaseStorage.reposity[key];
    };

    BaseStorage.prototype.set = function(key, value) {
        BaseStorage.reposity[key] = value;
    };

    BaseStorage.prototype.remove = function(key) {
        delete BaseStorage.reposity[key];
    };

    Service.BaseStorage = BaseStorage;
    
})(Service));

((function(Service) {

    var json = (function() {

        var jQuery = $;

        // Takes a well-formed JSON string and returns the resulting JavaScript value
        function parse(json) {
            return jQuery.parseJSON(json);
        }

        // converts a JavaScript value to JSON string
        function stringify(javaScript) {
            return JSON.stringify(javaScript);
        }

        return {
            parse: parse,
            stringify: stringify
        }
        
    })();
    
    Service.$json = json;
    
})(Service));

((function(fn) {

    function assert(condition, message) {
        if (!condition) {
            message = message || "Assertion failed";
            if (typeof Error !== "undefined") {
                throw new Error(message);
            }
            throw message; // Fallback
        }
    }

    fn.assert = assert;
    
})(fn));

/**
 *
 * Service.$schedule.schedule(function() {
 *     // something you want do immediately
 * }, eventId ) // event Id
 * .after(function() {
 *     // something you want do after `3 * 1000` time
 * }, 3 * 1000 )
 * .onCancel(function() {
 *     // something you want do when you cancle this task
 * })
 * .start(); // DON'T forget to call `start` method to let it run
 *
 * Service.$schedule.cancelAll(); // cancel all schedule tasks
 *
 */
Service.$schedule = (function() {

    var DEFAULT_DELAY = 2 * 1000 , // 2 seconds
        DEFAULT_ONCE_DELAY = 2 * 1000, // 2 seconds

        scheduleArrays = [],

        onceEventArrays = [];

    return {
        
        schedule : function ( event, id ) {
            return new Schedule ( event, id );
        },

        cancelAll : function () {
            $.each ( scheduleArrays , function ( index, item ) {

                if ( !item.finished() ) {
                    item.cancel();
                }
                
            });
        },

        cancel : function ( id ) {
            
            var i = $.inArray ( id, scheduleArrays );
            
            if ( i !== -1 ) {
                id && $clearTimeout( scheduleArrays [ id ].timer );
                scheduleArrays [ id ] = undefined;
            }
            
        },

        once: function ( e, id, waitTime ) {
            Once ( e, id, waitTime );
        }
        
    }

    //////////////////////////
    
    function Schedule ( e, id ) {

        var event = e,
            eventId = id,
            afterEvent,
            cancelEvent,
            delay,
            cancel = false,
            finished = false;

        this.after = function ( e, d ) {
            afterEvent = e;
            delay = d || DEFAULT_DELAY;
            return this;
        };

        this.onCancel = function ( event ) {
            cancelEvent = event;
            return this;
        };

        this.cancel = function () {
            cancel = true;

            // Trigger cancel event
            if ( cancelEvent !== undefined ) {
                cancelEvent();
            }
        };

        this.finished = function () {
            return finished;
        }

        this.start = function () {

            if ( scheduleArrays [ eventId ] !== undefined ) {
                $clearTimeout( scheduleArrays [ eventId ].timer );
            }
            
            if ( $.isFunction ( event ) ) {
                event(); // do it
            }

            var timer = $.isFunction ( afterEvent ) &&

                $timeout ( function () {

                    // run after event
                    !cancel && afterEvent();

                    // we are finished
                    finished = true;
                    
                    scheduleArrays [ eventId ] = undefined;
                    
                }, delay );

            scheduleArrays [ eventId ] = {
                task: this,
                timer: timer
            };
            
        };
        
    }

    /////////////////////////
    function Once ( e, id, waitTime ) {

        var event = e,
            taskId = id,
            delay = waitTime || DEFAULT_ONCE_DELAY;

        if ( !$.isFunction ( e ) || !taskId ||
             // task exist
             onceEventArrays[ taskId ] !== undefined ) return;

        onceEventArrays[ taskId ] = {
            event: e
        },

        // trigger event
        e();

        $timeout( function () {

            // remove this event
            onceEventArrays[ taskId ] = undefined;
            
        }, delay );
    }
    
})();

Service.$task = ( function() {

    var todoList = [],
        repeatList = [],
        DEFAULT_TIME = 1000;

    return {
        plan: plan,
        cancel: cancel,

        repeat: repeat,
        cancelRepeat: cancelRepeat
    }

    function plan( id, event, time ) {
        todoList [ id ] = $timeout( event, time || DEFAULT_TIME );
    }

    function cancel( id ) {
        if ( todoList [ id ] ) {
            $clearTimeout( todoList [ id ].timer );
            todoList [ id ] = undefined;
        }
    }

    function repeat( id, event, time ) {
        repeatList [ id ] = setInterval( event, time || DEFAULT_TIME );
    }

    function cancelRepeat( id ) {
        if ( repeatList [ id ] ) {
            clearInterval( repeatList [ id ] );
            repeatList [ id ] = undefined;
        }
    }
    
} )();

Service.KEYS = {
    APP_INFO: 'app_info'
};

Service.$monitor = ( function() {

    var Monitor = 'Monitor' + '/',
        Event = {
            show: Monitor + 'S',
            hide: Monitor + 'H',
            resume: Monitor + 'R',
            watch: Monitor + 'W',
            unwatch: Monitor + 'UW',
            typing: Monitor + 'T'
        };

    return {
        Event: Event,
        
        report: report,
        watch: watch
    }

    function report( event, data ) {
        Service.$pubsub.publish( event, data );
    }

    function watch( event, func ) {
        Service.$pubsub.subscribe( event, func );
    }

} )();

// DON'T write like this in other files
var __Monitor = Service.$monitor;
var __MonitorEvent = __Monitor.Event;

// Copy and modifed from https://gist.github.com/fwolf/b2433ecd482c561cb3bd
( function() {

    Service.$gb2312utf8  = {
        
        Dig2Dec : function(s){
            var retV = 0;
            if(s.length == 4){
                for(var i = 0; i < 4; i ++){
                    retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
                }
                return retV;
            }
            return -1;
        } ,

        Hex2Utf8 : function(s){
            var retS = "";
            var tempS = "";
            var ss = "";
            if(s.length == 16){
                tempS = "1110" + s.substring(0, 4);
                tempS += "10" +  s.substring(4, 10);
                tempS += "10" + s.substring(10,16);
                var sss = "0123456789ABCDEF";
                for(var i = 0; i < 3; i ++){
                    retS += "%";
                    ss = tempS.substring(i * 8, (eval(i)+1)*8);
                    retS += sss.charAt(this.Dig2Dec(ss.substring(0,4)));
                    retS += sss.charAt(this.Dig2Dec(ss.substring(4,8)));
                }
                return retS;
            }
            return "";
        } ,

        Dec2Dig : function(n1){
            var s = "";
            var n2 = 0;
            for(var i = 0; i < 4; i++){
                n2 = Math.pow(2,3 - i);
                if(n1 >= n2){
                    s += '1';
                    n1 = n1 - n2;
                }
                else
                    s += '0';
            }
            return s;
        },

        Str2Hex : function(s){
            var c = "";
            var n;
            var ss = "0123456789ABCDEF";
            var digS = "";
            for(var i = 0; i < s.length; i ++){
                c = s.charAt(i);
                n = ss.indexOf(c);
                digS += this.Dec2Dig(eval(n));
            }
            return digS;
        },

        GB2312ToUTF8 : function(s1){
            var s = escape(s1);
            var sa = s.split("%");
            var retV ="";
            if(sa[0] != ""){
                retV = sa[0];
            }
            for(var i = 1; i < sa.length; i ++){
                if(sa[i].substring(0,1) == "u"){
                    retV += this.Hex2Utf8(this.Str2Hex(sa[i].substring(1,5)));
                    if(sa[i].length){
                        retV += sa[i].substring(5);
                    }
                }
                else{
                    retV += unescape("%" + sa[i]);
                    if(sa[i].length){
                        retV += sa[i].substring(5);
                    }
                }
            }
            return retV;
        }
        
    };
    
} )();

/**
 *
 * Pub/Sub Pattern
 *
 * var pubsub = Service.$pubsub;
 *
 * // 订阅事件，绑定监听函数
 * var subscription = pubsub.subscribe( "inbox/newMessage", function(topics, data) {
 *     console.log( "Logging: " + topics + ": " + data );
 * });
 *
 * // Publishers are in charge of publishing topics or notifications of
 * // interest to the application. e.g:
 * // 发布事件: 字符串
 * pubsub.publish( "inbox/newMessage", "hello world!" );
 *
 * // or 发布事件：array
 * pubsub.publish( "inbox/newMessage", ["test", "a", "b", "c"] );
 
 * // or 发布事件：object
 * pubsub.publish( "inbox/newMessage", {
 * sender: "hello@google.com",
 * body: "Hey again!"
 * });
 *
 * // 取消订阅
 * pubsub.unsubscribe( subscription );
 *
 */
((function(Service) {

    (function(myObject) {
        
        // Storage for topics that can be broadcast
        // or listened to
        var topics = {};
        
        // An topic identifier
        var subUid = -1;
        
        // Publish or broadcast events of interest
        // with a specific topic name and arguments
        // such as the data to pass along
        myObject.publish = function( topic, args ) {
            
            if ( !topics[topic] ) {
                return false;
            }
            
            var subscribers = topics[topic],
                len = subscribers ? subscribers.length : 0;
            
            while (len--) {
                subscribers[len].func( topic, args );
            }
            
            return this;
        };
        
        // Subscribe to events of interest
        // with a specific topic name and a
        // callback function, to be executed
        // when the topic/event is observed
        myObject.subscribe = function( topic, func ) {
            
            if (!topics[topic]) {
                topics[topic] = [];
            }
            
            var token = ( ++subUid ).toString();
            topics[topic].push({
                token: token,
                func: func
            });
            return token;
        };
        
        // Unsubscribe from a specific
        // topic, based on a tokenized reference
        // to the subscription
        myObject.unsubscribe = function( token ) {
            for ( var m in topics ) {
                if ( topics[m] ) {
                    for ( var i = 0, j = topics[m].length; i < j; i++ ) {
                        if ( topics[m][i].token === token ) {
                            topics[m].splice( i, 1 );
                            return token;
                        }
                    }
                }
            }
            return this;
        };

        // Remove all subscribers
        myObject.clear = function() {
            topics = {};
            subUid = -1;            
        };
        
    }(Service.$pubsub || (Service.$pubsub = {})));
    
})(Service));

//
// - Submit a task to polling
//
// ```javascript
// Service.$polling.run( { eventID: 'get-waiting-queue-length',
//                         apiFunc: Service.$api.getWaitingQueueLength,
//                         apiRequestParams: { app_uuid: xxx },
//                         delay: 1000, // 1000ms
//                         onGet: function( response, success ) {
//                             if ( success ) console.log( 'current waiting queue length is ', response.length );
//                         } } );
// ```
//
// - Cancel a task in polling list
//
// ```
// Service.$polling.cancel( { eventID: 'get-waiting-queue-length' } );
// ```
//
Service.$polling = ( function() {

    var DEFAULT_DELAY = 3000, // ms
        OPTIONS = { eventID: undefined,
                    apiFunc: undefined,
                    apiRequestParams: undefined,
                    delay: DEFAULT_DELAY,
                    onGet: undefined },
        tasks = {};

    return {
        run: run,
        cancel: cancel
    }

    //
    // @param config: {
    //     eventID: `your eventID` *
    //     apiFunc: `api function that should be called` *
    //     apiRequestParams: `api request params`
    //     delay: `the next call after this`, DEFAULT is 3000ms
    //     onGet: `onGet callback` ( data, success )
    // }
    function run( config ) {
        var copy = $.extend( OPTIONS, config );
        if ( !copy.eventID || !copy.apiFunc ) return;
        if ( tasks[ copy.eventID ] ) return;

        tasks[ copy.eventID ] = { handler: undefined };
        execute( copy );
    }

    //
    // @param config: {
    //     eventID: `your eventID` *
    // }
    function cancel( config ) {
        if ( !config || !config.eventID ) return;
        if ( isCancel( config ) ) return;

        if ( tasks[ config.eventID ].handler ) {
            $clearTimeout( tasks[ config.eventID ].handler );
        }
        tasks[ config.eventID ] = undefined;
    }

    // ==== Helpers ====
    function isCancel( config ) {
        return tasks[ config.eventID ] === undefined;
    }
    
    function execute( config ) {
        config.apiFunc.call( Service.$api, config.apiRequestParams, function( r ) {
            if ( !isCancel( config ) ) {
                makeCallback( config, r, true );
                scheduleNext( config );
            }
        }, function( e ) {
            if ( !isCancel( config ) ) {
                makeCallback( config, e, false );
                scheduleNext( config );
            }
        } );
    }

    function makeCallback( config, r, success ) {
        if ( config.onGet ) config.onGet( r, success );
    }

    function scheduleNext( config ) {
        tasks[ config.eventID ].handler = $timeout( function() {
            if ( !isCancel( config ) ) {
                execute( config );
            };
        }, config.delay );
    }
    
} )();

Service.$app = (function() {

    var POLICY = { GROUP: 'GROUP',
                   ALL: 'ALL',
                   SMART: 'SMART' },

        DEFAULT_POLICY = POLICY.ALL,

        appInfo,
        
        set = function(info) {
            appInfo = info;
        },

        get = function() {
            return appInfo;
        };
    
    return {

        POLICY: POLICY,
        
        set: set,

        policy: function() { // policy
            return ( get() && get().app_route_policy ) || DEFAULT_POLICY; 
        },

        app: get, // appInfo

        appName: function() {// appName
            return get().app_name; 
        },

        appId: function() {
            return get().app_uuid || get().uuid;
        }
    }
    
})();

Service.$orgGroups = (function() {

    var orgGroupList, // group array

        orgGroupDict = {}; // group in dictionary

    ///////// API /////////////
    
    return {
        asyncGetAppOrgGroupList: asyncGetAppOrgGroupList,
        // act as setter or getter
        conversationId: conversationId
    }

    ////// Implementation ////

    function asyncGetAppOrgGroupList (callback) {
        
        // Only show groups in `GROUP` policy
        if ( Service.$app.policy() !== Service.$app.POLICY.GROUP ) {
            $onResult( [], callback );
            return;
        }

        if (orgGroupList !== undefined) {
            $onResult( orgGroupList, callback );
            return;
        }
        
        Service.$api.getAppOrgGroupList({
            app_uuid: Service.$ppSettings.getAppUuid()
        }, function(response) {
            orgGroupList = response.list;
            
            groupArray2Dict( orgGroupList );
            
            $onResult( orgGroupList, callback );   
        }, function(error) {
            orgGroupList = [];
            $onResult( orgGroupList, callback );
        });
    }

    function groupArray2Dict ( groupArray ) {
        groupArray && $.each( groupArray, function ( index, item ) {

            orgGroupDict [ item.group_uuid ] = item;
            
        } );
    }

    // setter or getter
    function conversationId ( groupId, conversationIdentifier ) {

        if ( groupId && conversationIdentifier ) {
            orgGroupDict [ groupId ] = conversationIdentifier;
        } else {
            return orgGroupDict [ groupId ] && orgGroupDict [ groupId ].conversation_uuid ;
        }
        
    }
    
})();

Service.$hovercardWelcome = ( function() {

    var hovercardWelcome,

        welcomeText;

    ///////////API////////////////
    return {
        
        // async get hovercard welcome info
        asyncGet: asyncGet,
        
        // directly get app welcome info
        getWelcomeText: getWelcomeText
        
    }

    //////////Implentation////////

    /**
     * zh_cn
     * en_us
     * zh_tw
     */
    function _fixLanguage (language) {
        if (language) {
            language = language.toLowerCase();
            switch (language) {
            case 'zh-cn':
                return 'zh_cn';

            case 'en':
                return 'en_us';
            }
        }
        return 'en';
    }

    function buildWelcomeInfo (team, welcomeText, serviceUsers) {
        return {
            appTeamName: team,
            appWelcomeText: welcomeText,
            
            activeAdmins: (function() {
                
                var users = [];

                serviceUsers && $.each(serviceUsers, function(index, item) {

                    var userUUID = item.uuid,
                        userName = item.user_fullname,
                        userAvatar = Service.$tools.icon.get(item.user_icon),
                        isBrowserOnline = item.is_browser_online,
                        isMobileOnline = item.is_mobile_online,
                        isOnline = item.is_mobile_online || item.is_browser_online;
                    
                    // user not exist
                    if (!Service.$users.exist(userUUID)) {
                        
                        // Create and store a user
                        Service.$users.setUser(userUUID, Service.$users.createUser({
                            is_portal_user: false,
                            user_uuid: userUUID,
                            user_fullname: userName,
                            user_avatar: userAvatar,
                            is_browser_online: isBrowserOnline,
                            is_mobile_online: isMobileOnline,
                            is_online: isOnline
                        }));
                        
                    } else {
                        
                        // Update it
                        Service.$users.getUser(userUUID).update({
                            user_fullname: userName,
                            user_avatar: userAvatar,
                            is_online: isOnline
                        });
                    }
                    
                    users.push(Service.$users.getUser(userUUID).getInfo());
                });

                return users;
                
            })()
        };
    }

    function asyncGet ( callback ) {
        
        if ( hovercardWelcome !== undefined ) {
            $onResult ( hovercardWelcome, callback );
            return;
        }
        
        Service.$api.getWelcomeTeam( {
            language: _fixLanguage( Service.$language.getLanguage() )
        }, function(response) {

            // cache data
            hovercardWelcome = buildWelcomeInfo ( response.team, response.welcome, response.list );
            welcomeText = response.welcome;
            
            $onResult ( hovercardWelcome, callback );
        }, function(error) {
            $onResult ( null, callback);
        } );
        
    }

    function getWelcomeText () {
        return welcomeText;
    }
    
} )();

Service.$orgGroupUsers = ( function () {

    var groupUsers = {}; // key: group_uuid, value: [ {user_1}, {user_2}, ... ]

    ////////// API /////////////
    return {
        asyncGet: asyncGet
    }

    /////// Implementation /////
    
    function asyncGet ( groupId, callback ) {
        
        if ( !groupId ) {
            $onResult ( [], callback );
            return;
        }

        if ( groupUsers [ groupId ] ) {
            $onResult ( groupUsers [ groupId ], callback );
            return;
        }

        Service.$api.getOrgGroupUserList ( {
            app_uuid: Service.$ppSettings.getAppUuid(),
            group_uuid: groupId
        } , function ( response ) {

            groupUsers [ groupId ] = [];
            
            if ( ( response.error_code === 0 ) && response.list ) {
                $.each ( response.list, function ( index, item ) {
                    var user = Service.$users.adapter ( item );
                    groupUsers [ groupId ].push( Service.$users.getOrCreateUser( user ).getInfo() );
                } );
            }

            $onResult( groupUsers [ groupId ], callback );
            
        }, function ( error ) {
            $onResult( [], callback );
        } );
    }
    
} )();

Service.$conversation = ( function() {

    var conversationUsers = {
        // conversation-token: [ user_1, user_2 ]
    };

    //////// API ///////////
    
    return {
        asyncGetUser: asyncGetUser
    }

    ////// asyncGetUser ////
    // @param settings
    // {
    //     reuse: true/false - whether or not should reuse exist conversation users, default is false
    //     include: true/false - whether or not include current portal user, default is false
    // }
    function asyncGetUser( token, callback, settings ) {

        if ( settings && settings.reuse ) {
            if ( conversationUsers [ token ] !== undefined ) {
                $onResult( sort( filter( conversationUsers [ token ] ) ), callback );
                return;
            }
        }

        conversationUsers [ token ] = undefined; // remove all cached user datas
        
        Service.$api.getConversationUserList( {
            app_uuid: Service.$ppSettings.getAppUuid(),
            conversation_uuid: token
        }, function( r ) {

            if ( r && r.error_code === 0 ) {
                conversationUsers [ token ] = ( function() {
                    
                    var users = [];
                    r.list && $.each( r.list, function( index, item ) {
                        var userInfoAdapter = Service.$users.adapter( item );
                        users.push( Service.$users.getOrCreateUser( userInfoAdapter ).getInfo() );
                    } );
                    return users;
                    
                } ());
            } else {
                conversationUsers [ token ] = [];
            }

            $onResult( sort( filter( conversationUsers [ token ] ) ), callback );
            
        }, function( e ) {

            conversationUsers [ token ] = [];

            $onResult( sort( filter( conversationUsers [ token ] ) ), callback );
            
        } );

        function filter( users ) {

            // if `settings.include` === `true`
            // then include `portal` user
            if ( settings && settings.include ) {
                return users;
            }

            return excludePortalUser( users );
            
        }
        
    }

    ///////// tools ////////
    function sort( users ) {
        return users;
    }

    function excludePortalUser( users ) {
        if ( !users ) return users;

        // make a copy
        var userArray = users.slice(),
            i;
        $.each( userArray, function( index, item ) {
            if ( item.user_uuid === Service.$user.quickId() ) {
                i = index;
            }
        } );

        // arrayObject.splice(index,howmany,item1,.....,itemX)
        if ( i !== undefined ) userArray.splice( i, 1 );

        return userArray;
        
    }
    
} )();

// @description
//    global message pool store `send` and `received` messages, instead of `history` messages
Service.$messageStore = ( function() {

    var msgGroupIdToMsgIdMap = {
        // msg-id-1: msg-group-id,
        // msg-id-2: msg-group-id
        // ...
    };

    /////// API /////////
    
    return {
        map: map,
        find: find
    }

    /////// Implementation ///////

    function map( msgId, msgGroupId ) {
        msgGroupIdToMsgIdMap [ msgId ] = msgGroupId;
    }

    // Find `ppMessageJsonBody` by `messageId`
    function find( messageId ) {
        if ( !messageId ) return;

        var groupId = msgGroupIdToMsgIdMap [ messageId ],
            ppMessage;
        
        if ( groupId ) {
            var conversationContentModal = Modal.$conversationContentGroup.get( groupId );

            if ( conversationContentModal ) {
                ppMessage = conversationContentModal.find( messageId );
            }
        }

        return ppMessage;
    }
    
} )();

//
// @documentation
//     every conversation has several filed named `type`, `token`, `ts`
//
//     `type`:
//     - `TYPE.GROUP`
//     - `TYPE.CONVERSATION`
//
//     `token`: as the conversation's unique identifier:
//     - `TYPE.GROUP`: `token` === `group_uuid`
//     - `TYPE.CONVERSATION`: `token` === `conversation_uuid`
//
//     `ts`: used for sort conversations
//
//     every conversation which `type` is `TYPE.CONVERSATION` has several filed named `active`, `vip`
//
//     `active`: there is only ONE `active` conversation at the same time:
//     - true ( means this conversation is the user begin to chat or chatting with now )
//     - false
//
//     `vip`: means this conversation is the default conversation that will show on the welcome hovercard
//     - true
//     - false
//
//     ======================================
//     |          Get Conversation          |
//     ======================================
//
//     When the following api
//
//     - `asyncGetDefaultConversation`
//     - `asyncGetConversation`
//
//     failed to get conversation, it means you should waitting the server to
//     give you an avaliable `Conversation` after a while, here are two events you may interested on:
//
//     - `Event.WAITING` // the server is busy now, and you should waitting
//     - `Event.AVALIABLE` // Hey, a new conversation is avaliable now, and you can continue to chatting
//
//     if you interested in the event `EVENT.WAITING`, please subscribe the event
//     ```javascript
//     Service.$subpub.subscribe( Service.$conversationManager.EVENT.WAITING, function( topic, conversation ) {
//         // we should waiting to get an avaliable conversation now
//     } };
//     ```
//
//     if you interested in the event `EVENT.AVALIABLE`, please subscribe the event
//     ```javascript
//     Service.$subpub.subscribe( Service.$conversationManager.EVENT.AVALIABLE, function( topic, conversation ) {
//         // the server has give us an avaliable conversation now, so we begin talk now
//     } };
//     ```
//
Service.$conversationManager = ( function() {

    var TYPE = { GROUP: 'GROUP', CONVERSATION: 'CONVERSATION' },
        EVENT = { WAITING: 'CONVERSATION_MANAGER/WAITING',
                  AVALIABLE: 'CONVERSATION_MANAGER/AVALIABLE' },
        WEIGHT_GROUP = 10000, // let `TYPE.GROUP` has more priority then `TYPE.CONVERSATION` when sort `conversationList`
        conversationList = [],
        activeToken,
        hasLoadedAllGroupListAndConversationList = false;

    ////////// API ///////////
    return {
        TYPE: TYPE,
        EVENT: EVENT,

        init: init,
        all: all, // ONLY for debug, you should't call this method, instead of call `asyncGetList` to assure fully correct
        simulateConversationAvaliable: simulateConversationAvaliable, // for debug
        
        asyncGetDefaultConversation: asyncGetDefaultConversation,
        activeConversation: activeConversation, // acts as setter and getter
        vipConversation: findDefault,
        asyncGetList: asyncGetList,
        find: findByToken,

        asyncGetConversation: asyncGetConversation
    }

    ///////// all //////////////
    function init() {
        var $pubsub = Service.$pubsub;
        
        $pubsub.subscribe( Service.$notifyConversation.EVENT.AVALIABLE, function( topics, conversationUUID ) {

            Service.$conversationAgency.requestInfo( conversationUUID, function( conv ) {
                
                if ( conv ) {
                    // We are waiting `default conversation`
                    // Now, this `default conversation` become avaliable now
                    var isDefaultConversation = !Service.$conversationAgency.isDefaultConversationAvaliable();
                    if ( isDefaultConversation ) { 
                        onDefaultConversationAvaliable( conv );
                    } else {
                        push ( conversation( conv ) );
                    }
                    $pubsub.publish( EVENT.AVALIABLE, conv );   
                }
                
            } );
            
        } );
    }
    
    function all() {
        return sort( conversationList );
    }

    function simulateConversationAvaliable() {
        Service.$conversationAgency.enableDebug( false );
        Service.$conversationAgency.request( function( defaultConversation ) {
            onDefaultConversationAvaliable( defaultConversation );
            Service.$pubsub.publish( EVENT.AVALIABLE, defaultConversation );
        } );
    }

    //////// asyncGetDefaultConversation /////////////
    function asyncGetDefaultConversation( callback ) {

        if ( findDefault() ) {
            $onResult( findDefault(), callback );
            return;
        }

        Service.$conversationAgency.request( function( defaultConversation ) {
            if ( defaultConversation ) {
                onDefaultConversationAvaliable( defaultConversation );
            } else {
                notifyToWaiting();                
            }
            $onResult( findDefault(), callback );
        } );

    }

    function onDefaultConversationAvaliable( response ) {
        push( conversation( response, true ) );
        active( response[ 'token' ] );
    }

    //////// activeConversation ///////////
    function activeConversation( token ) {

        // act as a getter method
        if ( token === undefined ) {
            if ( activeToken !== undefined ) {
                return findByToken( activeToken );
            }

            return undefined;    
        } else { // act as a setter method
            active( token );
        }
        
    }

    /////// asyncGetList //////////////
    function asyncGetList( callback ) {

        if ( hasLoadedAllGroupListAndConversationList ) {
            $onResult( sort( conversationList ), callback );
            return;
        }
        
        // 1. asyncGetOrgGroups
        Service.$orgGroups.asyncGetAppOrgGroupList( function( groupList ) {

            var list = ( groupList || [] ).slice();
            list && $.each( list, function( index, item ) {
                item.user_count > 0 && push( group( item ) ); // make sure `group.user_count` > 0
            } );

            // 2. asyncGetAllConversations
            Service.$api.getConversationList( {
                user_uuid: Service.$user.getUser().getInfo().user_uuid,
                app_uuid: Service.$ppSettings.getAppUuid()
            }, function ( response ) {

                if ( response && response.error_code === 0 ) {
                    var list = ( response.list || [] ).slice();
                    list && $.each( list, function( index, item ) {
                        push( conversation( item ) );
                    } );
                }

                // 3. success callback
                hasLoadedAllGroupListAndConversationList = true;
                $onResult( sort( conversationList ), callback );
                return;
                
            }, function ( error ) {

                // 3. error callback
                hasLoadedAllGroupListAndConversationList = true;
                $onResult( sort( conversationList ), callback );
                return;
                
            } );
            
        } );
    }

    ///////// asyncGetConversation ///////
    
    // @param config {
    //     user_uuid: xxx, create a conversation with `member_list`
    //     group_uuid: xxx : create a `group` conversation
    // }
    // provided `user_uuid` OR `group_uuid`, don't provide both
    function asyncGetConversation( config, callback ) {
        if ( config.user_uuid !== undefined && config.group_uuid !== undefined ) throw new Error();

        var exist = ( config.user_uuid !== undefined ) ? find( config.user_uuid ) : // find by user_uuid
            ( config.group_uuid != undefined ) ? findByGroupId( config.group_uuid ) : undefined; // find by group_uuid

        if ( !Service.$tools.isNull( exist ) ) {
            $onResult( exist, callback );
            return;
        }

        Service.$conversationAgency.create( config, function( conv ) {
            
            if ( conv ) {
                push( conversation( conv ) );
                $onResult( findByToken( conv.uuid ) , callback );
            } else {
                $onResult( undefined, callback );
                notifyToWaiting();
            }
            
        } );

        // try to match `assigned_uuid` to `userId`
        function find( userId ) {

            var r;
            $.each( conversationList, function( index, item ) {
                if ( item.assigned_uuid === userId ) {
                    r = item;
                }
            } );
            return r;
            
        }

        function findByGroupId( groupId ) {

            // find conversation id by group id
            var conversationId;
            $.each( conversationList, function( index, item ) {
                if ( item.type === TYPE.GROUP &&
                     item.uuid === groupId ) {
                    conversationId = item.conversation_uuid;
                }
            } );

            return conversationId && findByToken( conversationId );
            
        }

        function shouldWaiting( r ) {
            return r.error_code !== 0 || Service.$tools.isApiResponseEmpty( r );
        }
        
    }

    ////////// set `token` to active /////////
    function active( token ) {
        
        var conversation = findByToken( token );
        if ( conversation !== undefined ) {
            
            $.each( conversationList, function ( index, item ) {
                item.active = false;
            } );

            conversation.ts = Date.now();
            conversation.active = true;
            activeToken = token;
            
        }

        vip( token );
        
    }

    function vip( token ) {

        var conversation = findDefault(),
            appWelcome,
            appName;
        
        if ( conversation !== undefined ) {
            
            appWelcome = conversation.app_welcome;
            appName = conversation.app_name;
            
            conversation.vip = false;
            delete conversation.app_welcome;
            delete conversation.app_name;
            
        }

        var newer = findByToken( token );
        if ( newer ) {

            // move welcome info and `vip` flag to the newer conversation
            newer.vip = true;
            appWelcome && ( newer.app_welcome = appWelcome );
            appName && ( newer.app_name = appName );
            
        }
        
    }

    ///// let `item` become an `TYPE.CONVERSATION`
    function conversation( item, vip ) {
        
        item [ 'type' ] = TYPE.CONVERSATION;
        item [ 'token' ] = item.uuid;
        item [ 'ts' ] = Service.$tools.getTimestamp( item.updatetime );
        item [ 'vip' ] = ( typeof vip === 'boolean' ) ? vip : false;
        
        return item;
    }

    ////// let `item` become an `TYPE.GROUP`
    function group( item ) {

        item [ 'type' ] = TYPE.GROUP;
        item [ 'token' ] = item.uuid;
        item [ 'ts' ] = Service.$tools.getTimestamp( item.updatetime );
        
        return item;
        
    }

    function findByToken( token ) {

        var find,
            i,
            len = conversationList.length;

        for ( i = 0; i < len; ++i ) {
            if ( token === conversationList [ i ].token ) return conversationList [ i ];
        }
        
        return undefined;
        
    }

    function findDefault() {

        var find,
            i,
            len = conversationList.length;
        
        for ( i = 0 ; i < len ; ++i ) {
            if ( conversationList [ i ].vip ) return conversationList [ i ];
        }

        return undefined;
        
    }

    function sort( conversations ) {

        if ( !conversations || conversations.length <= 1 ) return conversations;
        return conversations.sort( compare );

        function compare( a, b ) {

            var weightA = weight( a ),
                weightB = weight( b );

            if ( weightA > weightB ) return -1;
            if ( weightA < weightB ) return 1;
            
            var timestampA = a.ts,
                timestampB = b.ts;

            return timestampB - timestampA;
        }

        function weight( a ) {
            return ( a.type === TYPE.GROUP ) ? WEIGHT_GROUP : 0;
        }
    }

    function push( conversation ) {

        var existItem;
        $.each( conversationList, function ( index, item ) {
            if ( existItem === undefined && item.token === conversation.token ) {
                existItem = item;
            }
        } );

        if ( existItem === undefined ) {
            conversationList.push( conversation );
        } else {
            conversation.vip = existItem.vip; // prevent `vip` override
            $.extend( existItem, conversation );
        }
        
    }

    // === helpers ===
    function notifyToWaiting() {
        Service.$pubsub.publish( EVENT.WAITING );
    }
    
} )();

Service.$sheetHeader = ( function() {

    var TITLE_DEFAULT = Service.Constants.DEFAULT_HEADER_TITLE,
        title = "",
        isClose = true,
        unread = 0,
        isShowDropDownMenu = false;

    ///////// API /////////////

    return {
        
        setHeaderTitle: setHeaderTitle,
        getHeaderTitle: getHeaderTitle,
        asyncGetHeaderTitle: asyncGetHeaderTitle,
        
        close: close,
        closed: closed,

        incrUnreadCount: incrUnreadCount,
        unreadCount: unreadCount,
        decrUnreadCount: decrUnreadCount,

        isShowDropDownButton: isShowDropDownButton,
        showDropDownButton: showDropDownButton
    }

    //////// Implementation //////////

    function setHeaderTitle(title) {
        title = title || TITLE_DEFAULT;
    }

    function getHeaderTitle() {
        return title || TITLE_DEFAULT;
    }

    function asyncGetHeaderTitle( callback ) {
        if ( title ) {
            $onResult( title, callback );
            return;
        }

        title = Service.$app.appName() || TITLE_DEFAULT;
        $onResult( title, callback );
    }

    function close( close ) {
        isClose = close;
    }

    function closed() {
        return isClose;
    }

    function incrUnreadCount() {
        unread++;
    }

    function unreadCount() {
        return unread;
    }

    function decrUnreadCount( count ) {
        unread = unread - count < 0 ?
            0 :
            unread - count;
    }

    function isShowDropDownButton() {
        return isShowDropDownMenu;
    }

    function showDropDownButton( show ) {
        isShowDropDownMenu = show;
    }
    
} )();

//
// @description
//
// After presee the `play` button, you should listen the audio's state change event:
//
// Service.$pubsub.subscribe( 'audio/' + `your audio id`, function( topics, data ) {
//
//     var state = data.state,
//         audioId = data.audioId;
//
//     switch( state ) {
//         case Service.$audioContext.STATE.NULL:
//         1. `stop play`
//         2. Service.$pubsub.unsubscribe( 'audio/' + `your audio id` );
//         break;
//
//         case Service.$audioContext.STATE.ERROR:
//         1. `play error`
//         2. Service.$pubsub.unsubscribe( 'audio/' + `your audio id` );
//         break;
//
//         case Service.$audioContext.STATE.PLAYING:
//         `begin to play`
//         break;
//     }
//
// } );
//
Service.$audioContext = ( function() {

    var STATE = 
        {
            /* Initial state */
            NULL: 0,
            
            /* Audio is playing */
            PLAYING: 1,

            /* Audio miss source file or can not play */
            ERROR: 2
        },

        _audioObj, /* type: Service.PPMessage.Audio */
        _audio; /* type: window.Audio */

    return {
        STATE: STATE,
        isPlaying: isPlaying,
        
        play: safePlay,
        stop: safeStop,
        close: close
    }

    function isPlaying( audio ) {
        return _audioObj !== undefined && _audio !== undefined && _audioObj.id() === audio.id();
    }

    // @param audio
    //     Object `Service.PPMessage.Audio`
    //     @see `service/message/pp-message-audio.js`
    function safePlay( audio  ) {

        if ( _audioObj !== undefined && audio !== undefined ) {
            
            // the `audio` is playing ...    
            if ( _audioObj.id() === audio.id() ) {
                return;    
            }

            // another `audio` is playing ... stop it
            safeStop( _audioObj );
            
        }

        // Can not play
        if ( !audio.canPlay() || !Service.$device.audioMp3() ) {
            error( audio );
            return;
        }

        //
        // var foo = { a: 123 };
        // var bar = foo.a;
        // bar = undefined;
        // foo.a => `123`
        //
        // We only store the references of `audio` object here, not the `audio` object itself
        // So it's safe to execute ` _audioObj = undefined ` on the method `safeStop`, `audio` still keep the origin value
        //
        _audioObj = audio;
        _audio = new Audio( audio.src() );

        // An `audio` element can fire various `events`.
        // @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
        // @see http://www.runoob.com/jsref/dom-obj-event.html
        _audio.onended = function( e ) {
            safeStop( audio );
        };
        
        _audio.onerror = function( e ) {
            error( audio );
        };
        
        _audio.play();

        Service.$pubsub.publish( 'audio/' + _audioObj.id(), {
            state: STATE.PLAYING,
            audioId: _audioObj.id()
        } );
        
    }

    function safeStop( audio ) {
        if ( isPlaying( audio ) ) {

            _audio.currentTime = 0;
	        _audio.pause();

            Service.$pubsub.publish( 'audio/' + audio.id(), {
                state: STATE.NULL,
                audioId: audio.id()
            } );

            _audio = undefined;
            _audioObj = undefined;
        }
    }

    function error( audio ) {
        if ( isPlaying( audio ) ) {
            _audio = undefined;
            _audioObj = undefined;            
        }
        
        Service.$pubsub.publish( 'audio/' + audio.id(), {
            state: STATE.ERROR,
            audioId: audio.id()
        } );

    }

    function close() {
        safeStop( _audioObj );
    }
    
} )();

//
// You can do the following things:
//
// - `request` request default conversation
//     - If can not get default conversation, generally meaning we should waiting ... waiting ... the server to
//       give us a conversation when it become avaliable.
//
// - `create` request create a conversation by `group_uuid` or `member_list`
//     - If can not get conversation, meaning you should waiting ...
//       
// - `cancel` cancel request default conversation
//
Service.$conversationAgency = ( function() {

    var STATE = { REQUESTING: 0, // in requesting
                  DONE: 1, // we have fetched default conversation successfully
                  CANCEL: 2 // we have cancel request the default conversation
                },

        state = STATE.REQUESTING,

        defaultConversation,

        waitingGroupUUID, // group_uuid , which waiting to get an avaliable conversation arrived from WebSocket

        inDebuging = false;

    //////// API ///////////
    
    return {
        enableDebug: enableDebug, // Only for debug
        
        request: asyncGetDefaultConversation,
        requestInfo: asyncGetConversationInfo,
        create: asyncCreateConversation,
        cancel: cancelWaitingCreateConversation,

        isDefaultConversationAvaliable: isDefaultConversationAvaliable,
        isRequestingGroupConversation: isRequestingGroupConversation
        
    }

    ///// Implement //////////
    
    function asyncGetDefaultConversation( callback ) {
        if ( state === STATE.DONE && defaultConversation ) {
            $onResult( defaultConversation, callback );
            return;
        }

        state = STATE.REQUESTING;
        
        Service.$api.getPPComDefaultConversation( {
            app_uuid: Service.$app.appId(),
            user_uuid: Service.$user.quickId(),
            device_uuid: Service.$user.quickDeviceUUID()
        }, function( r ) {

            if ( !shouldWaiting( r ) ) {
                defaultConversation = r;
                state = STATE.DONE;
            }

            $onResult( defaultConversation, callback );
            
        }, function( e ) {

            $onResult( defaultConversation, callback );
            
        } );
    }

    // Get conversationInfo from server by `conversationUUID`
    // @param conversationUUID
    // @param callback
    function asyncGetConversationInfo( conversationUUID, callback ) {
        if ( !conversationUUID ) {
            $onResult( undefined, callback );
            return;
        }
        
        Service.$api.getConversationInfo( {
            app_uuid: Service.$app.appId(),
            user_uuid: Service.$user.quickId(),
            conversation_uuid: conversationUUID
        }, function( r ) {
            $onResult( r , callback );
        }, function( e ) {
            $onResult( undefined , callback );
        } );        
    }

    // @param config {
    //     user_uuid: xxx, create a conversation with `member_list`
    //     group_uuid: xxx : create a `group` conversation
    // }
    // provided `user_uuid` OR `group_uuid`, don't provide both
    function asyncCreateConversation( config, callback ) {
        if ( config.user_uuid !== undefined && config.group_uuid !== undefined ) throw new Error();

        state = STATE.REQUESTING;
        waitingGroupUUID = config.group_uuid; // Assign waiting group UUID
        
        Service.$api.createPPComConversation( {
            device_uuid: Service.$user.quickDeviceUUID(),
            user_uuid: Service.$user.getUser().getInfo().user_uuid,
            app_uuid: Service.$ppSettings.getAppUuid(),
            conversation_type: Service.Constants.MESSAGE.TO_TYPE,
            group_uuid: ( config.group_uuid !== undefined ) ? config.group_uuid : undefined,
            member_list: ( config.user_uuid !== undefined ) ? [ config.user_uuid ] : undefined
        }, function( r ) {

            var result = undefined;
            
            if ( !shouldWaiting( r ) ) {
                result = r;
                state = STATE.DONE;
                waitingGroupUUID = undefined; // Clear waiting group UUID
            }

            $onResult( result, callback );
            
        }, function( e ) {
            
            $onResult( undefined, callback );
            
        } );
    }

    function cancelWaitingCreateConversation() {
        if ( state !== STATE.REQUESTING ) {
            return;
        }

        Service.$api.cancelWaitingCreateConversation( {
            app_uuid: Service.$app.appId(),
            user_uuid: Service.$user.quickId(),
            device_uuid: Service.$user.quickDeviceUUID(),
            group_uuid: waitingGroupUUID
        }, onCompleted, onCompleted );

        function onCompleted( someThing ) {
            state = STATE.CANCEL;
            waitingGroupUUID = undefined;
        }
        
    }

    function isDefaultConversationAvaliable() {
        return defaultConversation !== undefined;
    }

    function isRequestingGroupConversation() {
        return waitingGroupUUID !== undefined;
    }

    // === helpers ===
    function shouldWaiting( response ) {
        return inDebuging ||
            response.error_code !== 0 ||
            Service.$tools.isApiResponseEmpty( response );
    }

    function enableDebug( enable ) {
        inDebuging = enable;
    }
    
} )();

/**
 * 对 apiMessage 进行适配，使其能够返回 PPMessage 的数据结构表示
 *
 * new ApiMessageAdapter(apiMessageJsonBody)
 *     .asyncGetPPMessage(function(ppMessage, success) {
 *         console.log("success: " + success + ", ppMessageJsonBody: " + ppMessage.getBody());
 *     });
 *
 * Date.now(): 1449716881332
 * apiMessage.ts: 1449649351.0 [IN SECONDS !!!]
 *
 * Date.parse("2015-12-10 09:55:35"); // 1449712535000
 * Date.parse("2015-12-10 09:55:35 719794"); // NaN
 *
 */
((function(Service) {

    function ApiMessageAdapter(apiMessageJsonBody) {

        var $json = Service.$json,
            $tools = Service.$tools,
            $emoji = Service.$emoji,
            $users = Service.$users,
            $user = Service.$user,

            apiMessageType = Service.Constants.MESSAGE_SUBTYPE,
            ppMessageType = Service.PPMessage.TYPE,
            
            apiMessage = apiMessageJsonBody,

            getMessageType = function(apiMessage) {
                var type = '',
                    msg = apiMessage;
                
                switch(msg.ms) {
                case apiMessageType.TEXT:
                    if ($tools.isShowEmojiIcon() && $emoji.isEmoji(msg.bo)) {
                        type = ppMessageType.EMOJI;
                    } else {
                        type = ppMessageType.TEXT;
                    }
                    break;
                    
                case apiMessageType.TXT:
                    type = ppMessageType.TEXT;
                    break;

                case apiMessageType.IMAGE:
                    type = ppMessageType.IMAGE;
                    break;

                case apiMessageType.FILE:
                    type = ppMessageType.FILE;
                    break;

                case apiMessageType.AUDIO:
                    type = ppMessageType.AUDIO;
                    break;
                }

                return type;
            },

            isAdmin = function(apiMessage) {
                return (apiMessage.fi != $user.getUser().getInfo().user_uuid) || apiMessage.tt == "S2P";
            },

            // services are all offline messages...
            msgByMachine = function(apiMessage) {
                return apiMessage.ft === Service.ApiMessage.TYPE_OG ||
                    apiMessage.ft === Service.ApiMessage.TYPE_AP;
            },

            innerCallback = function(ppMessageBuilder, success, callback) {

                var cb = function() {
                    if (callback) callback(ppMessageBuilder.build(), success);                    
                };
                
                // Async load user info
                if (isAdmin(apiMessage)) {

                    // msg generated by machine, not human
                    if (msgByMachine(apiMessage)) {
                        
                        ppMessageBuilder.userName(Service.Constants.i18n('SYSTEM_MSG'))
                            .userIcon(Service.Constants.ICON_DEFAULT_USER); // default server_name and user_icon

                        cb();
                        
                    } else {
                        var options = {
                            user_uuid: apiMessage.fi, // user_uuid
                            
                            user_fullname: apiMessage.from_user && apiMessage.from_user.user_fullname ?
                                apiMessage.from_user.user_fullname :
                                undefined, // user_name
                                
                            user_avatar: apiMessage.from_user && apiMessage.from_user.user_icon ?
                                $tools.getFileDownloadUrl(apiMessage.from_user.user_icon) :
                                undefined // user_avatar
                        };
                        
                        Service.$users.asyncGetUser(options, function(user) {
                            // get user info successfully !
                            if (user != null) {
                                // Update ppMessage body user info
                                ppMessageBuilder.userName(user.getInfo().user_fullname)
                                    .userIcon(user.getInfo().user_avatar);
                            } else {
                                ppMessageBuilder.userName(Service.Constants.i18n('DEFAULT_SERVE_NAME'))
                                    .userIcon(Service.Constants.ICON_DEFAULT_USER); // default server_name and user_icon
                            }

                            cb();
                        });    
                    }
                    
                } else {
                    cb();
                }
                
            },

            asyncBuildMessageData = function(ppMessageBuilder, callback) {
                var success = true;
                
                switch(apiMessage.ms) {
                case apiMessageType.TEXT:
                    if ($tools.isShowEmojiIcon() && $emoji.isEmoji(apiMessage.bo)) {
                        ppMessageBuilder.emojiMessageCode(apiMessage.bo);
                    } else {
                        ppMessageBuilder.textMessageBody(apiMessage.bo);
                    }
                    break;

                case apiMessageType.TXT:
                    $tools.getRemoteTextFileContent($json.parse(apiMessage.bo).fid, function(text) {
                        ppMessageBuilder.textMessageBody(text);
                        if (callback) callback(success);
                    }, function() {
                        success = false;
                        if (callback) callback(success);
                    });
                    return; // NOTE HERE: TXT message need async to get content

                case apiMessageType.IMAGE:
                    ppMessageBuilder.imageMessageUrl($tools.getFileDownloadUrl($json.parse(apiMessage.bo).orig));
                    break;

                case apiMessageType.FILE:
                    
                    var fileName = $json.parse(apiMessage.bo).name,
                    fileId = $json.parse(apiMessage.bo).fid,
                    fileUrl = $tools.getFileDownloadUrl(fileId, fileName),
                    fileServerUrl = fileUrl;

                    ppMessageBuilder.fileMessageLocalUrl(fileUrl)
                        .fileMessageName(fileName)
                        .fileMessageServerUrl(fileServerUrl);

                    break;

                case apiMessageType.AUDIO:
                    ppMessageBuilder.audio( $json.parse( apiMessage.bo ) );
                    break;

                default:
                    success = false;
                    break;
                }

                if (callback) callback(success);
            };

        this.asyncGetPPMessage = function(callback) {

            var ppMessageBuilder = new Service.PPMessage.Builder(getMessageType(apiMessage))
                .id(apiMessage.id)
                .timestamp(apiMessage.ts)
                .messageState('FINISH')
                .conversationId(apiMessage.ci)
                .conversation({ uuid: apiMessage.ci })
                .rawData(apiMessage)
                .userId(apiMessage.fi)
                .admin(isAdmin(apiMessage));

            asyncBuildMessageData(ppMessageBuilder, function(success) {
                innerCallback(ppMessageBuilder, success, callback);
            });
        };
    }

    Service.ApiMessageAdapter = ApiMessageAdapter;
    
})(Service));

((function(Service) {

    function ApiMessage(apiMessageJsonBody) {

        var body = apiMessageJsonBody;
        
        this.getBody = function() {
            return body;
        };
        
    }

    ApiMessage.TYPE_OG = 'OG'; // group mode, policy is `group`
    ApiMessage.TYPE_AP = 'AP'; // No group, policy is `broadcast`

    function Builder(conversationId) {

        var basicApiMessage = {
            conversation_uuid: conversationId,
            to_uuid: '', // app_uuid or group_uuid
            to_type: '', // AP or OG
            conversation_type: Service.Constants.MESSAGE.TO_TYPE,
            message_type: Service.Constants.MESSAGE_TYPE.NOTI,
            message_subtype: '',
            from_uuid: '',
            device_uuid: '',

            // THE FOLLOWING THREE FILEDS ONLY WORKING FOR `SEND MESSAGE`
            uuid: '',
            from_type: 'DU',
            app_uuid: Service.$ppSettings.getAppUuid()
        };

        // `uuid`
        this.uuid = function( uuid ) {
            basicApiMessage.uuid = uuid;
            return this;
        };

        this.type = function(type) {
            basicApiMessage.message_subtype = type;
            return this;
        };

        // `ApiMessage.TYPE_OG`
        // `ApiMessage.TYPE_AP`
        this.toType = function(toType) {
            basicApiMessage.to_type = toType;
            return this;
        }

        this.toId = function(toId) {
            basicApiMessage.to_uuid = toId;
            return this;
        };

        this.fromUuid = function(fromUuid) {
            basicApiMessage.from_uuid = fromUuid;
            return this;
        };

        this.deviceUuid = function(deviceUuid) {
            basicApiMessage.device_uuid = deviceUuid;
            return this;
        };

        this.build = function() {

            var copy = $.extend({}, basicApiMessage, true);

            if ( !copy.to_uuid ) throw new Error ('to_uuid == null');
            if ( !copy.to_type ) throw new Error ('to_type == null');
            
            return new ApiMessage(copy);
        };
    }

    ApiMessage.Builder = Builder;
    Service.ApiMessage = ApiMessage;
    
})(Service));

// @ducumentation at the end of the file
Service.$messageSender = ( function() {

    var $messageStateBroadcast = messageStateBroadcast(),

        STATE = $messageStateBroadcast.STATE,

        DEFAULT = {

            // should upload
            upload: false,

            // file/txt
            uploadType: 'file',

            // put your upload content here
            uploadContent: null //file / 'large text'
            
        };
    
    //////// API ////////////
    return {
        $messageStateBroadcast: $messageStateBroadcast,
        
        send: send,
        notifySendDone: notifySendDone,
        notifySendFail: notifySendFail
    }

    /////// Implentation ////////////
    function send( ppMessage, settings ) {
        
        // make a copy
        var set = $.extend({}, DEFAULT, settings),
            jsonBody = ppMessage.getBody();
        
        // notify we are build message finish
        onBuildMessageFinish( jsonBody, set, jsonBody.conversation.uuid );
        
        if (set.upload) {
            onBeginUpload( jsonBody, set);
        } else {
            sendToServer( jsonBody, set);
        }   
    }

    function onBuildMessageFinish(ppMessage, settings, conversationId) {
        // update ppMessage body
        ppMessage.messageConversationId = conversationId;
        ppMessage.messageIsConversationValid = !!conversationId;

        // callback
        broadcastHelper( ppMessage, STATE.BUILD_DONE, {
            conversationId: conversationId
        } );
    }

    function onBeginUpload(ppMessage, settings) {
        
        // upload file will get local upload file id
        var $fileUploader = Service.$uploader,
            
            UPLOAD_ERROR_CODE = Service.Uploader.ERROR_CODE,
            uploadContent = settings.uploadContent,
            uploadType = settings.uploadType,

            i18n = Service.Constants.i18n,
            
            uploadFileId = $fileUploader.upload({
                type: uploadType,
                content: uploadContent
            }).progress(function(percentage) {
                
                // uploading ...
                broadcastHelper( ppMessage, STATE.UPLOADING, {
                    uploadProgress: percentage
                } );
                
            }).done(function(response) {
                // onEndUpload callback
                onUploadDone(ppMessage, settings, response.fuuid);
                
            }).fail(function(errorCode) {
                
                // Upload failed
                ppMessage.messageState = 'ERROR';
                
                switch (errorCode) {

                case UPLOAD_ERROR_CODE.SERVICE_NOT_AVALIABLE:
                    ppMessage.extra.errorDescription = i18n('SERVICE_NOT_AVALIABLE');
                    break;

                case UPLOAD_ERROR_CODE.CANCEL:
                    ppMessage.extra.errorDescription = i18n('CANCELED');
                    break;

                }
                
                onUploadFail(ppMessage, settings);
            }).query().uploadId;
        
        // begin upload
        broadcastHelper( ppMessage, STATE.BEGIN_UPLOAD, {
            uploadTaskId: uploadFileId
        } );

    }

    function onUploadFail(ppMessage, settings) {
        broadcastHelper( ppMessage, STATE.UPLOAD_FAIL );
        // on upload fail, send it to server
        sendToServer( ppMessage, settings );
    }

    function onUploadDone(ppMessage, settings, fileId) {
        broadcastHelper( ppMessage, STATE.UPLOAD_DONE, {
            fileId: fileId
        } );
        // on upload done, send it to server
        sendToServer(ppMessage, settings);
    }

    function sendToServer(ppMessage, settings) {

        //check message is valid
        if ( !ppMessage.messageIsConversationValid || ppMessage.messageState === 'ERROR') {
            onSendFail( ppMessage, settings );
            return;
        }
        
        //send actually data
        var apiMessageJsonBody = new Service.PPMessageAdapter( ppMessage ).getApiMessageBody();

        try {
            
            //send by `WebSocket`    
            Service.$notifyMsg.get( Service.$notification, apiMessageJsonBody ).send();
            
        } catch ( e ) {
            
            // Try send message from `api` channel
            Service.$api.sendMessage( apiMessageJsonBody, function(response) {
                onSendSuccess( ppMessage, settings, response );
            }, function(error) {
                onSendFail( ppMessage, settings );
            });
            
        }

    }

    function onSendSuccess(ppMessage, settings, response) {
        
        // update ppMessage state when send success
        ppMessage.messageState = 'FINISH';

        // generally `response` if exist, we consider this message was send by `api`, not by `ws`
        if ( response ) {
            updateMessageStateOnSendSucc( ppMessage, response );
        }
        
        broadcastHelper( ppMessage, STATE.SEND_DONE );
    }

    function updateMessageStateOnSendSucc(ppMessage, response) {
        // Because of `response` contains no useful info here
        // So we don't need to do anyting with `response` here
    }

    function onSendFail(ppMessage, settings) {
        ppMessage.messageState = 'ERROR';
        
        // Error , check errorDescription
        var errorDesc = ppMessage.extra.errorDescription;
        if (!errorDesc) errorDesc = Service.Constants.i18n('SEND_ERROR');
        ppMessage.extra.errorDescription = errorDesc;
        
        broadcastHelper( ppMessage, STATE.SEND_FAIL );
    }

    function notifySendDone( msgId ) {
        var ppMessage = Service.$messageStore.find( msgId );
        if ( ppMessage ) {
            onSendSuccess( ppMessage );            
        }
    }

    function notifySendFail( msgId ) {
        var ppMessage = Service.$messageStore.find( msgId );
        if ( ppMessage ) {
            onSendFail( ppMessage );
        }
    }

    function broadcastHelper( ppMessage, state, stateInfo ) {
        $messageStateBroadcast.broadcast( ppMessage.messageId, {
            body: ppMessage,
            state: state,
            stateInfo: stateInfo || {}
        } );
    }

    /////// Message State Broadcast ///////////

    function messageStateBroadcast() {

        var STATE = {
            
            BUILD_DONE: 'BUILD_DONE',
            BEGIN_UPLOAD: 'BEGIN_UPLOAD',
            UPLOADING: 'UPLOADING',
            UPLOAD_DONE: 'UPLOAD_DONE',
            UPLOAD_FAIL: 'UPLOAD_FAIL',
            SEND_DONE: 'SEND_DONE',
            SEND_FAIL: 'SEND_FAIL'
            
        };

        return {
            STATE: STATE,
            broadcast: broadcast
        }

        // @param `data`:
        //     {
        //         body: `ppMessageJsonBody`,
        //         state: xxx,
        //         stateInfo: { xxx }
        //     }
        function broadcast( messageIdentifier, data ) {

            Service.$pubsub.publish( 'msg/send/' + messageIdentifier, data );
            
        }
        
    }

    
} )();

////////////////////////////
//// Documentation /////////
////////////////////////////

// - How to listen message send states change event:

// Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function ( topics, data ) {

//     var sendState = data.state,
//         stateInfo = data.stateInfo, // new state info will be stored at `data.stateInfo`
//         ppMessageJsonBody = data.body;

//     switch ( sendState ) {

//     case 'BUILD_FINISH':
//         // the message body is build finish, generally meaning it get a `conversation_id` which required by server-side
//         var conversationId = stateInfo.conversationId;
//         break;

//     case 'BEGIN_UPLOAD':
//         // 'file'/'large-txt' need upload
//         var uploadTaskId = stateInfo.uploadTaskId;
//         break;

//     case 'UPLOADING':
//         // 0 ~ 100
//         var uploadProgress = stateInfo.uploadProgress;
//         break;

//     case 'UPLOAD_DONE':
//         var fileId = stateInfo.fileId; // `fileId` returned by server-side
//         break;

//     case 'UPLOAD_FAIL':
//         break;

//     case 'SEND_DONE':        
//         break;

//     case 'SEND_FAIL':
//         break;

//     }

// });

/**
 *
 * @description: 
 *
 * 1. messageBox not visible (launcher is showing):
 *     publish('msgArrived/launcher', ppMessageJsonBody);
 *
 * 2. messageBox visible:
 *
 *     2.1 in chating panel and you are chatting with `group_id`:
 *         publish('msgArrived/chat', ppMessageJsonBody);
 *
 *     2.2 in group list panel:
 *         publish('msgArrived/group', ppMessageJsonBody);
 *
 */
Service.$messageReceiverModule = (function() {

    var browserTabNotify,
        
        isGroupOnChatting = function ( groupUUID ) {
            
            return groupUUID &&
                View.$conversationContentContainer.visible() &&
                !Ctrl.$launcher.get().isLauncherShow() && // launcher is not visible
                Service.$conversationManager.activeConversation() && Service.$conversationManager.activeConversation().uuid === groupUUID;
            
        },
        
        getModal = function ( groupUUID ) {
            return Modal.$conversationContentGroup.get( groupUUID );
        },

        onNewMessageArrived = function(topics, ppMessage) {
            
            var $pubsub = Service.$pubsub,
                body = ppMessage.getBody(),
                groupId = body.conversation.uuid;

            if ( browserTabNotify ) { // browser tab notify
                browserTabNotify.notify( ppMessage );
            }

            if ( isGroupOnChatting ( groupId ) ) { // we are chating with `groupId`

                $pubsub.publish('msgArrived/chat', ppMessage);
                
            } else {

                // store message && record unread count
                var modal = getModal ( groupId );
                modal.addMessage ( body );
                modal.incrUnreadCount();
                Ctrl.$sheetheader.incrUnread();

                if ( Ctrl.$launcher.get().isLauncherShow() ) { // launcher is showing
                    
                    $pubsub.publish('msgArrived/launcher', ppMessage);
                    
                } else if (View.$groupContent.visible()) { // group list is showing ( only working in `group` policy )
                    
                    $pubsub.publish('msgArrived/group', ppMessage);
                    
                }
                
            }

        },

        // Start me by call this method !
        // settings: {user_uuid: xxxx, device_uuid: xxxx}
        start = function(settings) {

            if (!settings) return;

            // Initialization notification by user_uuid and device_uuid, and start it !
            Service.$notification.init({
                user_uuid: settings.user_uuid,
                device_uuid: settings.device_uuid,
                app_uuid: settings.app_uuid
            }).start();

            // listen page visibility change event
            if ( browserTabNotify )
                browserTabNotify.unregister();
            browserTabNotify = BrowserTabNotify();
            browserTabNotify.register();

            // Subscribe newMessageArrivced event
            Service.$pubsub.subscribe("ws/msg", onNewMessageArrived);
        };
    
    return {
        start: start
    };

    /////////////////////////////////////////
    //        Browser Tab Notify           //
    /////////////////////////////////////////

    //
    // https://www.w3.org/TR/page-visibility/
    //
    // @description:
    //     Let website title in browser tab change and scroll, when new message
    // arrived & page not visible.
    //
    // ```
    // var browserNotify = BrowserTabNotify();
    // browserNotify.register(); // listen `page visibility` change event
    //
    // browserNotify.notify( ppMessage ); // notify browser title to change and scroll
    // ...
    // browserNotify.unregister(); // unlisten `page visiblility` change event
    // ```
    //
    // NOTE: Only notify in PC browser 
    //
    function BrowserTabNotify() {

        var hiddenType,
            pageHidden = false,
            registered = false,
            originTitle,
            timeoutToken,
            scrollMsg,
            scrollPosition = 0;

        return {
            register: register,
            unregister: unregister,

            notify: notify
        }
        
        function register() {
            if ( registered ) return;
            
            var hidden;

            // Standards:
            if ((hidden = "hidden") in document)
                document.addEventListener("visibilitychange", onchange);
            else if ((hidden = "mozHidden") in document)
                document.addEventListener("mozvisibilitychange", onchange);
            else if ((hidden = "webkitHidden") in document)
                document.addEventListener("webkitvisibilitychange", onchange);
            else if ((hidden = "msHidden") in document)
                document.addEventListener("msvisibilitychange", onchange);

            registered = hidden !== undefined;
            hiddenType = hidden;

            originTitle = document.title;
            
        }

        function unregister() {
            if (registered) {
                if ( hiddenType === 'hidden' )
                    document.removeEventListener( 'visibilitychange', onchange );
                else if ( hiddenType === 'mozHidden' )
                    document.removeEventListener( 'mozvisibilitychange', onchange );
                else if ( hiddenType === 'webkitHidden' )
                    document.removeEventListener( 'webkitvisibilitychange', onchange );
                else if ( hiddenType === 'msHidden' )
                    document.removeEventListener( 'msvisibilitychange', onchange );
            }
            
            registered = false;
            hiddenType = undefined;

            resumeTitle();
            
        }

        function onchange( event ) {
            pageHidden = document[ hiddenType ];

            if ( !pageHidden ) {
                resumeTitle();
            }
        }

        function notify( ppMessage ) {
            if ( canNotify() ) {
                clearScroll();
                scrollMsg = buildMsgTitle( ppMessage );
                scrollTitle();
            }
        }

        function canNotify() {
            return registered &&
                hiddenType !== undefined &&
                ( !Service.$device.isMobileBrowser() ) &&
                pageHidden;
        }

        function buildMsgTitle( ppMessage ) {
            return Service.Constants.i18n( 'PPMESSAGE' ) +
                ': ' +
                ppMessage.getMessageSummary() +
                '... ';
        }

        function changeTitle( title ) {
            if ( title ) document.title = title;
        }

        function resumeTitle() {
            clearScroll();
            if ( originTitle ) {
                changeTitle( originTitle );
            }
        }

        function scrollTitle() {
            var title = scrollMsg;

            var newTitle = title.substring( scrollPosition , title.length ) + title.substring( 0, scrollPosition );
            scrollPosition++;

            changeTitle( newTitle );

            if ( scrollPosition > title.length ) scrollPosition = 0;
            
            timeoutToken = $timeout( scrollTitle, 200 );
        }

        function clearScroll() {
            if ( timeoutToken ) {
                $clearTimeout( timeoutToken );
                timeoutToken = undefined;
            }
            scrollMsg = undefined;
            scrollPosition = 0;
        }
        
    }
    
})();

((function(Service) {

    var $messageToolsModule = (function Tools() {

        var _toType; // message send to_type detect by different policy

        function encodeTextWithUtf8(s) {
            return unescape(encodeURIComponent(s));
        }

        function isTextLengthLargerThan128(text) {
            return encodeTextWithUtf8(text).length > Service.Constants.MESSAGE.TEXT_MAX_LEN;
        }

        function isMessageTextOverflow(msg) {
            return isTextLengthLargerThan128(msg.message.text.body);
        }

        // Currently, we have the following message types:
        //
        // -TEXT
        // -EMOJI
        // -IMAGE
        // -FILE
        // -AUDIO
        //
        // -WELCOME
        // -TIMESTAMP
        //
        // `WELCOME` and `TIMESTAMP` was generated by ourself to faciliate our programming, not a real message
        function isMessage(msg) {
            if (!msg || !msg.messageType) return false; // illegal message

            var TYPE = Service.PPMessage.TYPE;
            return $.inArray(msg.messageType.toUpperCase(), [
                TYPE.TEXT,
                TYPE.EMOJI,
                TYPE.IMAGE,
                TYPE.FILE,
                TYPE.AUDIO
            ]) !== -1;
        }

        // detect to_type
        function toType() {

            if (!_toType) {
                
                switch (Service.$app.policy()) {
                    
                case Service.$app.POLICY.ALL:
                    _toType = Service.PPMessage.TO_TYPE.AP;
                    break;

                case Service.$app.POLICY.GROUP:
                    _toType = Service.PPMessage.TO_TYPE.OG;
                    break;

                default:
                    _toType = Service.PPMessage.TO_TYPE.AP;
                    break;
                }
                
            }

            return _toType;
        }

        return {
            isTextLengthLargerThan128: isTextLengthLargerThan128,
            isMessageTextOverflow: isMessageTextOverflow,

            isMessage: isMessage,

            toType: toType
        }
        
    })();

    Service.$messageToolsModule = $messageToolsModule;
    
})(Service));

((function(Service) {

    function PPMessage(ppMessageJsonBody) {

        var body = ppMessageJsonBody;

        //----------------------
        // Set info
        //----------------------

        this.setConversationId = function(conversationId) {
            body.messageConversationId = conversationId;
            return this;
        };

        this.setConversationIdValid = function(valid) {
            body.messageIsConversationValid = valid;
            return this;
        };

        this.setMessageState = function(state) {
            body.messageState = state;
            return this;
        };

        this.setRawData = function(data) {
            body.messageRawData = data;
            return this;
        };

        //----------------------
        // Get Info
        //----------------------

        this.isConversationValid = function() {
            return body.messageIsConversationValid;
        };

        this.getBody = function() {
            return body;
        };

        this.getMessageState = function() {
            return body.messageState;
        };

        this.getMessageSummary = function() {
            return PPMessage.getMessageSummary( body );
        };

        //----------------------
        // Send information
        //----------------------

        this.send = function() {
            
            // Send message callback
            var settings = Service.$sendSettingsFactory.get( body );
            Service.$msgStateReceiverFactory.get( body.messageType ).listen( body.messageId );
            Service.$messageSender.send( this, settings );

        };
    }

    // supported types now
    PPMessage.TYPE = {
        TEXT: 'TEXT',
        EMOJI: 'EMOJI',
        IMAGE: 'IMAGE',
        FILE: 'FILE',
        AUDIO: 'AUDIO',
        
        WELCOME: 'WELCOME',
        TIMESTAMP: 'TIMESTAMP'
    };

    // TO_TYPE
    //
    // @see ApiMessage.TYPE_OG
    //      ApiMessage.TYPE_AP
    PPMessage.TO_TYPE = {
        AP: 'AP',
        OG: 'OG'
    };

    // static method
    // get message summary
    PPMessage.getMessageSummary = function( ppMessageJsonBody ) {

        var summary = "",
            message = ppMessageJsonBody,
            TYPE = PPMessage.TYPE,
            i18n = Service.Constants.i18n;

        if (!message || !message.messageType) return ""; //messageType not exist !
        
        switch(message.messageType) {
        case TYPE.TEXT:
            summary = message.message.text.body;
            break;
            
        case TYPE.EMOJI:
            summary = message.message.emoji.code;
            break;

        case TYPE.FILE:
            summary = '[' + i18n('FILE') + ': ' + message.message.file.fileName + ']';
            break;

        case TYPE.IMAGE:
            summary = '[' + i18n('IMAGE') + ']';
            break;

        case TYPE.AUDIO:
            summary = '[' + i18n('AUDIO') + ']';
            break;

        case TYPE.WELCOME:
            summary = '';
            break;

        default:
            summary = "";
            break;
        }

        return summary;
    };

    function Builder(messageType) {

        var ppMessage = {
            messageId: Service.$tools.getUUID(),
            messageTimestamp: Date.now() / 1000,
            messageType: messageType,
            messageToType: Service.$messageToolsModule.toType(), // detect toType by different policy
            messageState: 'SENDING',
            messageConversationId: '',
            messageIsConversationValid: true,
            messageRawData: '',
            extra: {
                errorDescription: '',
                description: ''
            },
            message: {
                text: {},
                file: {},
                image: {},
                welcome: {},
                emoji: {},
                audio: {},
                timestamp: {
                    time: Date.now()
                }
            },
            user: {
                id: null,
                admin: false,
                name: '',
                avatar: Service.Constants.ICON_DEFAULT_USER
            },
            conversation: undefined
        };

        //----------------------
        //BASIC INFO
        //----------------------
        
        this.id = function(id) {
            ppMessage.messageId = id;
            return this;
        };

        this.timestamp = function(timestamp) {
            ppMessage.messageTimestamp = timestamp;
            return this;
        };

        this.toType = function(toType) {
            ppMessage.messageToType = toType;
            return this;
        };

        this.conversationId = function(conversationId) {
            ppMessage.messageConversationId = conversationId;
            return this;
        };

        this.conversationIsValid = function(valid) {
            ppMessage.messageIsConversationValid = valid;
            return this;
        };

        this.rawData = function(rawData) {
            ppMessage.messageRawData = rawData;
            return this;
        };

        this.messageState = function(messageState) {
            ppMessage.messageState = messageState;
            return this;
        };

        this.extraDescription = function(description) {
            ppMessage.extra.description = description;
            return this;
        };

        this.conversation = function( conversation ) {
            ppMessage.conversation = conversation;
            return this;
        };

        //----------------------
        //USER
        //----------------------
        
        this.admin = function(isAdmin) {
            ppMessage.user.admin = isAdmin;
            return this;
        };

        this.userName = function(name) {
            ppMessage.user.name = name;
            return this;
        };

        this.userIcon = function(icon) {
            ppMessage.user.avatar = icon;
            return this;
        };

        this.userId = function(userId) {
            ppMessage.user.id = userId;
            return this;
        };

        //----------------------
        //WELCOME
        //----------------------

        /**
         * the param `welcomeBody` is something like the following structure: 
         *
         * {
         *     appTeamName: 'ppMessage', 
         *     appWelcomeText: 'Hello boy!', 
         *     activeAdmins: [
         *         {name: 'jin.he', avatar: 'aa.png'},
         *         {name: 'kun.zhao', avatar: 'bb.png'},
         *         ...
         *     ]
         * }
         */
        this.welcomeBody = function(welcomeBody) {
            ppMessage.message.welcome = welcomeBody;
            return this;
        };

        //----------------------
        //EMOJI
        //----------------------
        
        this.emojiMessageCode = function(code) {
            ppMessage.message.emoji.code = code;
            return this;
        };

        //----------------------
        //TEXT
        //----------------------
        
        this.textMessageBody = function(text) {
            ppMessage.message.text.body = text;
            return this;
        };

        //----------------------
        //FILE
        //----------------------

        /**
         * the param `fileBody` is something like the following structure:
         */
        this.fileBody = function(fileBody) {
            ppMessage.message.file = fileBody;
            return this;
        };

        this.fileMessageLocalUrl = function(fileLocalUrl) {
            ppMessage.message.file.fileUrl = fileLocalUrl;
            return this;
        };

        this.fileMessageName = function(fileName) {
            ppMessage.message.file.fileName = fileName;
            return this;
        };

        this.fileMessageServerUrl = function(fileServerUrl) {
            ppMessage.message.file.fileServerUrl = fileServerUrl;
            return this;
        };

        //----------------------
        //IMAGE
        //----------------------
        
        /**
         * the params `imageBody` is something like the following structure:
         */
        this.imageBody = function(imageBody) {
            ppMessage.message.image = imageBody;
            return this;
        };

        this.imageMessageUrl = function(imageUrl) {
            ppMessage.message.image.url = imageUrl;
            return this;
        };

        //----------------------
        //AUDIO
        //----------------------
        
        this.audio = function( config ) {
            ppMessage.message.audio = new PPMessage.Audio( config );
            return this;
        };

        //----------------------
        //TIMESTAMP
        //----------------------

        this.timestampBody = function(timestampBody) {
            ppMessage.message.timestamp = timestampBody;
            return this;
        };

        //Build PPMessage
        this.build = function() {
            
            // make a copy
            var copy = $.extend({}, ppMessage, true);
            if ( copy.conversation === undefined ) {
                copy.conversation = Service.$conversationManager.activeConversation();   
            }

            return new PPMessage(copy);
        };
        
    }

    PPMessage.Builder = Builder;
    Service.PPMessage = PPMessage;
    
})(Service));

//
// @note: put the file after file `service/pp-message.js`
//
( function() {

    Service.PPMessage.Audio = AudioMessage;

    // @description
    //     build a new Audio Obj
    //
    // @param options {
    //     dura: 0 ~ +Infinity, default: 0
    //     fid: `fid`, default: undefined
    //     file: `file`, default: undefined
    // }
    function AudioMessage( options ) {

        var config = $.extend( { dura: 0,
                                 fid: undefined,
                                 file: undefined } , options.mp3 ),

            error = false,
            read = false,
            
            id = Service.$tools.getUUID(),
            duration = config.dura,
            fileId = config.fid,
            file = config.file,
            fileUrl = !Service.$tools.isNull( fileId ) ? Service.$tools.getFileDownloadUrl( fileId ) : undefined;

        //////// Public API //////////
        
        this.id = getId;
        this.src = getSrc;
        this.duration = getDuration;
        this.canPlay = canPlay;
        this.markError = markError;
        this.hasRead = hasRead;
        this.markRead = markRead;

        function getSrc() { return fileUrl };

        function getDuration() { return duration; }
        
        function getId() { return id; }

        function canPlay() {
            return !error && !Service.$tools.isNull( getSrc() );
        }

        function hasRead() { return read; }

        // Mark this `audio` is not `playable` or meet some unknown error when try to play
        function markError() { error = true; }

        // Mark this `audio` has read
        function markRead() { read = true; }
        
    };
    
} )();

/**
 * 对 PPMessage 进行适配，使其能够返回 apiMessage 的数据结构表示
 *
 * var apiMessageJsonBody = new PPMessageAdapter(ppMessageJsonBody).getApiMessageBody();
 *
 */
((function(Service) {

    function PPMessageAdapter(ppMessageJsonBody) {        

        var $json = Service.$json,
            $messageToolsModule = Service.$messageToolsModule,
            data = ppMessageJsonBody,

            getMessageType = function(ppMessageBody) {
                var type = '',
                    msg = ppMessageBody;
                
                switch(msg.messageType) {
                case Service.Constants.MESSAGE.TYPE_EMOJI:
                    type = Service.Constants.MESSAGE_SUBTYPE.TEXT;
                    break;

                case Service.Constants.MESSAGE.TYPE_TEXT:
                    type = $messageToolsModule.isMessageTextOverflow(msg) ? Service.Constants.MESSAGE_SUBTYPE.TXT : Service.Constants.MESSAGE_SUBTYPE.TEXT;
                    break;
                    
                case Service.Constants.MESSAGE.TYPE_FILE:
                    type = Service.Constants.MESSAGE_SUBTYPE.FILE;
                    break;

                case Service.Constants.MESSAGE.TYPE_IMAGE:
                    type = Service.Constants.MESSAGE_SUBTYPE.IMAGE;
                    break;
                }

                return type;
            },

            getMessageFileType = function(msg) {
                var type = '';
                var DEFAULT = 'application/octet-stream';
                switch(msg.messageType) {
                case 'FILE':
                    type = msg.message.file.file.type || DEFAULT;
                    break;

                case 'IMAGE':
                    type = msg.message.image.file.type || DEFAULT;
                    break;

                case 'TEXT':
                    type = msg.message.image.file.type || DEFAULT;
                    break;

                default:
                    type = DEFAULT;
                }

                return type;
            },

            getMessageToType = function() {
                return data.messageToType;
            };

        /**
         * get apiMessage body
         */
        this.getApiMessageBody = function() {

            var apiMessage = new Service.ApiMessage.Builder(data.messageConversationId)
                .uuid(data.messageId)
                .type(getMessageType(data))
                .toType(getMessageToType())
                .toId( data.conversation.token )
                .fromUuid(Service.$user.getUser().getInfo().user_uuid)
                .deviceUuid(Service.$user.getUser().getInfo().device_uuid)
                .build()
                .getBody();
            
            switch(data.messageType) {
            case 'TEXT':
                var body = {
                    fid: data.message.text.fuuid
                };
                apiMessage['message_body'] = $messageToolsModule.isMessageTextOverflow(data) ? $json.stringify(body) : data.message.text.body;
                break;

            case 'EMOJI':
                apiMessage['message_body'] = data.message.emoji.code;
                break;

            case 'FILE':
                var body = {
                    fid: data.message.file.fuuid,
                    mime: getMessageFileType(data)
                };
                apiMessage['message_body'] = $json.stringify(body);
                break;

            case 'IMAGE':
                var body = {
                    fid: data.message.image.fuuid,
                    mime: getMessageFileType(data)
                };
                apiMessage['message_body'] = $json.stringify(body);
                break;
            }
            
            return apiMessage;    
        };
        
    }

    Service.PPMessageAdapter = PPMessageAdapter;
    
})(Service));

((function(Service) {

    var factory = (function() {

        var build = function(ppMessageJsonBody) {
            var body = ppMessageJsonBody;
            
            sendSettings = function(){
                
                switch (body.messageType) {
                case 'TEXT':
                    return Service.$textMessageSendSettings.build(body);
                    
                case 'EMOJI':
                    return Service.$emojiMessageSendSettings.build(body);
                    
                case 'IMAGE':
                    return Service.$imageMessageSendSettings.build(body);

                case 'FILE':
                    return Service.$fileMessageSendSettings.build(body);
                }
            }();

            return sendSettings;
        };
        
        return {
            get: build
        }
        
    })();

    Service.$sendSettingsFactory = factory;
    
})(Service));

((function(Service) {

    var textMessageSendSettings = (function() {

        function buildSettings(body) {

            var text = body.message.text.body,
                overflow = Service.$messageToolsModule.isTextLengthLargerThan128( text ),
                upload = body.messageIsConversationValid && overflow;
            
            return {
                
                upload: upload,
                uploadType: 'txt',
                uploadContent: text
                
            };
            
        }
        
        return {

            build: buildSettings
            
        }
        
    })();

    Service.$textMessageSendSettings = textMessageSendSettings;
    
})(Service));

((function(Service) {

    var fileMessageSendSettings = (function() {
        
        function buildSettings(body) {

            return {
                upload: true,
                uploadContent: body.message.file.file
            };
            
        }
        
        return {
            build: buildSettings
        }
        
    })();

    Service.$fileMessageSendSettings = fileMessageSendSettings;
    
})(Service));

((function(Service) {

    var imageMessageSendSettings = (function() {

        function buildSettings(body) {
            
            return {

                upload: true,
                uploadContent: body.message.image.file

            };
            
        }
        
        return {
            build: buildSettings
        }
        
    })();

    Service.$imageMessageSendSettings = imageMessageSendSettings;
    
})(Service));

((function(Service) {

    var emojiMessageSendSettings = (function(){

        function buildSettings(body) {
            
            return {}
            
        }

        return {
            build: buildSettings
        }
        
    })();

    Service.$emojiMessageSendSettings = emojiMessageSendSettings;
    
})(Service));

Service.$msgStateReceiverFactory = ( function() {

    return {
        get: get
    }

    function get( ppMessageType ) {

        switch ( ppMessageType ) {

        case 'TEXT':
            return Service.$msgStateTextReceiver;

        case 'EMOJI':
            return Service.$msgStateEmojiReceiver;

        case 'FILE':
            return Service.$msgStateFileReceiver;

        case 'IMAGE':
            return Service.$msgStateImageReceiver;

        default:
            
            return {
                listen: function () {}
            }
            
        }
        
    }
    
} )();

Service.$msgStateTextReceiver = ( function() {

    return {
        listen: textMessageStateChangeReceiver
    }

    function textMessageStateChangeReceiver ( messageIdentifier ) {
        
        var subscriber = Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function( topics, data ) {

            var body = data.body,
                STATE = Service.$messageSender.$messageStateBroadcast.STATE;

            switch ( data.state ) {

            case STATE.BUILD_DONE:
                Ctrl.$conversationContent.appendMessage( body );
                break;

            case STATE.UPLOAD_DONE:
                body.message.text.fuuid = data.stateInfo.fileId;
                break;

            case STATE.SEND_DONE:
                Service.$pubsub.unsubscribe( subscriber );
                break;

            case STATE.SEND_FAIL:
                View.$userTextMessage.onSendFail( body );
                Service.$pubsub.unsubscribe( subscriber );
                break;
            }
            
        } );
        
    }
    
} )();

Service.$msgStateEmojiReceiver = ( function() {

    return {
        listen: emojiMessageStateChangeReceiver
    }

    function emojiMessageStateChangeReceiver( messageIdentifier ) {

        var subscriber = Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function( topics, data ) {

            var body = data.body,
                STATE = Service.$messageSender.$messageStateBroadcast.STATE;

            switch ( data.state ) {

            case STATE.BUILD_DONE:
                Ctrl.$conversationContent.appendMessage( body );
                View.$composerContainer.focus();
                break;

            case STATE.SEND_DONE:
                Service.$pubsub.unsubscribe( subscriber );
                break;

            case STATE.SEND_FAIL:
                View.$userEmojiMessage.onSendFail( body );
                Service.$pubsub.unsubscribe( subscriber );
                break;
            }
            
        } );
        
    }
    
} )();

Service.$msgStateFileReceiver = (function() {

    return {
        listen: fileMessageStateChangeReceiver
    }

    function fileMessageStateChangeReceiver( messageIdentifier ) {

        var subscriber = Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function( topics, data ) {

            var body = data.body,
                STATE = Service.$messageSender.$messageStateBroadcast.STATE,
                fileSelector = '#pp-conversation-part-file-by-user-o2-' + body.messageId;

            switch ( data.state ) {

            case STATE.BEGIN_UPLOAD:
                
                body.message.file.fileUploadId = data.stateInfo.uploadTaskId;

                Ctrl.$conversationContent.appendMessage( body );
                
                View.$composerContainer.focus();
                $(fileSelector).css({ 'opacity': 0.6 });
                break;

            case STATE.UPLOADING:
                var progress = data.stateInfo.uploadProgress;
                if (progress < 0) return;
                if (progress <= 100) {
                    $('#pp-uploading-bar-state-' + body.message.file.fileUploadId).css('width', progress + "%");
                }
                break;

            case STATE.UPLOAD_DONE:
                var fileId = data.stateInfo.fileId;
                
                body.message.file.fuuid = fileId;
                body.message.file.fileServerUrl = Service.$tools.getFileDownloadUrl(fileId, body.message.file.fileName);

                // Hide upload bar
                $('#pp-uploading-bar-outer-' + body.message.file.fileUploadId).hide();
                break;

            case STATE.UPLOAD_FAIL:
                // Hide upload bar
                $('#pp-uploading-bar-outer-' + body.message.file.fileUploadId).hide();
                break;

            case STATE.SEND_DONE:
                $('#pp-conversation-part-file-by-user-o2-' + body.messageId).css({
                    'opacity': 1.0
                });
                if (body.message.file.fileServerUrl) {
                    $('#pp-conversation-part-file-by-user-a-' + body.messageId)
                        .attr('href', body.message.file.fileServerUrl);   
                }
                Service.$pubsub.unsubscribe( subscriber );
                break;

            case STATE.SEND_FAIL:
                $('#pp-conversation-part-file-by-user-timestamp-' + body.messageId)
                    .text(body.extra.errorDescription).css({
                        'color': 'red',
                        'display': 'block'
                    });
                Service.$pubsub.unsubscribe( subscriber );
                break;
            }
            
        } );
        
    }
    
})();

Service.$msgStateImageReceiver = (function() {

    return {
        listen: imageMessageStateChangeReceiver
    }

    function imageMessageStateChangeReceiver( messageIdentifier ) {

        var subscriber = Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function( topics, data ) {

            var body = data.body,
                STATE = Service.$messageSender.$messageStateBroadcast.STATE;

            switch ( data.state ) {

            case STATE.BEGIN_UPLOAD:
                
                body.message.image.fileUploadId = data.stateInfo.uploadTaskId;

                Ctrl.$conversationContent.appendMessage( body );
                
                View.$composerContainer.focus();
                
                View.$userImageMessage.onBeginUpload( body.messageId );
                
                break;

            case STATE.UPLOADING:
                var progress = data.stateInfo.uploadProgress;
                
                if (progress < 0) return;
                if (progress <= 100) {
                    $('#pp-uploading-bar-state-' + body.message.image.fileUploadId).css('width', progress + "%");
                }
                
                break;

            case STATE.UPLOAD_DONE:
                var fileId = data.stateInfo.fileId;
                
                body.message.image.fuuid = fileId;
                body.message.image.fileServerUrl = Service.$tools.getFileDownloadUrl(fileId);

                // Hide upload bar
                $('#pp-uploading-bar-outer-' + body.message.image.fileUploadId).hide();
                break;

            case STATE.UPLOAD_FAIL:
                // Hide upload bar
                $('#pp-uploading-bar-outer-' + body.message.image.fileUploadId).hide();
                break;

            case STATE.SEND_DONE:
                View.$userImageMessage.onSendDone(body.messageId, body.message.image.fileServerUrl);
                Service.$pubsub.unsubscribe( subscriber );
                break;

            case STATE.SEND_FAIL:
                View.$userImageMessage.onSendFail(body.messageId, body.extra.errorDescription);
                Service.$pubsub.unsubscribe( subscriber );
                break;
            }
            
        } );
        
    }
    
})();

Service.$notifyAuth = (function() {

    var AUTH_TYPE = 'auth';

    //////// API ////////////
    return {
        get: authMessageDispatcher
    }

    function authMessageDispatcher ( $notifyService, authMsg ) {
        
        return {
            auth: auth,
            dispatch: onAuth
        }

        function auth () {
            
            var $api = Service.$api,
                $json = Service.$json,
                wsSettings = $notifyService.getWsSettings(),

                // auth params
                api_token = $api.getApiToken(),
                user_uuid = wsSettings.user_uuid,
                device_uuid = wsSettings.device_uuid,
                app_uuid = wsSettings.app_uuid,
                is_service_user = false,
                extra_data = {
                    title: document.title,
                    location: ( ( function() { // fetch `window.location`
                        var loc = {};
                        for (var i in location) {
                            if (location.hasOwnProperty(i) && (typeof location[i] == "string")) {
                                loc[i] = location[i];
                            }
                        }
                        return loc;
                    } )() )
                };

            // register webSocket
            $notifyService.write($json.stringify({
                type: AUTH_TYPE,
                api_token: api_token,
                app_uuid: app_uuid,
                user_uuid: user_uuid,
                device_uuid: device_uuid,
                extra_data: extra_data,
                is_service_user: is_service_user
            }));

        }

        function onAuth () {
            if ( !authMsg ) return;

            // auth success
            if ( authMsg.error_code === 0 || authMsg.code === 0 ) {

                var wsSettings = $notifyService.getWsSettings();
                
                // get unacked messages
                Service.$api.getUnackedMessages({
                    app_uuid: Service.$ppSettings.getAppUuid(),
                    from_uuid: wsSettings.user_uuid,
                    device_uuid: wsSettings.device_uuid
                }, function(response) {
                    
                    response.list && response.message && $.each(response.list, function(index, item) {
                        var rawData = response.message[item],
                            message = null;

                        if (rawData) {
                            message = Service.$json.parse(rawData);
                            message.pid = item;

                            // let message dispatch to `dispatch` this message
                            Service.$notifyMsg.get( $notifyService, message ).dispatch();
                        }
                        
                    });
                    
                });
                
            }
        }
        
    }
    
})();

Service.$notifyMsg = (function() {

    var TYPE_SEND = 'send',
        WHAT_SEND = 'SEND';

    //////// API //////////////
    return {
        get: messageDispatcher
    }

    function messageDispatcher ( $notifyService, msg ) {

        var $api = Service.$api,
            $pubsub = Service.$pubsub,
            $debug = Service.$debug;
        
        return {
            send: send,
            dispatch: dispatch
        }

        // @description:
        //     if `WebSocket` is not ok, then this method will throw a Exception
        function send () {

            var apiMessage = msg;

            if ( apiMessage ) {
                
                var wsMsg = Service.$json.stringify( {
                    type: TYPE_SEND,
                    send: apiMessage
                } );

                $notifyService.write( wsMsg, function() {
                    throw new Error( 'ws not open' );
                } );
                
            }
            
        }

        function dispatch () {
            
            var isAckMessage = ( msg.what !== undefined && msg.what === WHAT_SEND );

            if ( isAckMessage ) {
                dispatchAckMessage( msg );
            } else {
                dispatchWsMessage( msg );
            }
            
        }

        function dispatchAckMessage( ackMessage ) {
            var msgId = ackMessage.extra.uuid; // the message id
            if ( msgId ) {

                if ( ackMessage.code === 0 ) { // success
                    Service.$messageSender.notifySendDone( msgId );
                } else {
                    Service.$messageSender.notifySendFail( msgId );
                }
                
            }
        }

        function dispatchWsMessage( apiMessage ) {
            //ack message
            $api.ackMessage({
                list: [ apiMessage.pid ]
            });

            //convert api message to ppMessage
            new Service.ApiMessageAdapter(apiMessage)
                .asyncGetPPMessage(function(ppMessage, succ) {
                    if (succ) {
                        // publish new message arrived msg
                        $pubsub.publish("ws/msg", ppMessage);
                    }
                });            
        }
        
    }
    
})();

/**
 *
 * WebSocket.readyState
 *
 * CONNECTING	0	The connection is not yet open.
 * OPEN	1	The connection is open and ready to communicate.
 * CLOSING	2	The connection is in the process of closing.
 * CLOSED	3	The connection is closed or couldn't be opened.
 *
 * - Start:
 *
 * Service.$notification.init({user_uuid: xxxx, device_uuid: xxxx}).start();
 *
 * - onNewMessageArrived:
 *     Service.$pubsub.publish('ws/msg', ppMessage);
 *
 * - onTypingMessageArrived:
 *     Service.$pubsub.publish('ws/typing', { type: 'typing', 'user_uuid': user_uuid, 'conversation_uuid': conversation_uuid } );
 *
 * - onUserOnlineMessageArrived:
 *     Service.$pubsub.publish('ws/online, { type: 'online' } );
 *
 * - onLogoutMessageArrived:
 *     `We will close webSocket`
 *
 * - reset:
 *
 * reset $notification to initialization status
 *
 */
Service.$notification = (function() {

    var wsSettings = null,
        ws = null, // WebSocket
        wsUrl = Configuration.web_socket_url,
        supportWebSocket = !(typeof WebSocket === "undefined"), // Does browser support webSocket ?

        checkWebSocketIntervalHandle = null, // check webSocket status every 10s
        _resetCallback = null, // reset callback

        // On WebSocket open
	    // An event listener to be called when the WebSocket connection's readyState changes to OPEN;
        // this indicates that the connection is ready to send and receive data. 
        onWebSocketOpen = function() {

            if (wsSettings == null) return;
            if (ws == null) return;

            // send auth message
            Service.$notifyAuth.get( Service.$notification ).auth();
            
        },

        // on webSocket close
        // An event listener to be called when the WebSocket connection's readyState changes to CLOSED.
        onWebSocketClose = function( event ) {
            Service.$debug.d( '[WebSocket][Close]: ', event );
            if (wsSettings == null) return;            
            // reset status
            ws = null;
            // reset callback
            if (_resetCallback) {
                _resetCallback();
            }
        },

        // on webSocket message
        // An event listener to be called when a message is received from the server.
        onWebSocketMessage = function(event) {
            var $json = Service.$json,
                $debug = Service.$debug,
                apiMessage =
                ( typeof event.data === 'string' && function () {
                    try {
                        return $json.parse(event.data);
                    } catch ( e ) {
                        e && $debug.d ( e );
                        return undefined;
                    }
                } () ) || ( typeof event.data === 'object' && event.data );

            if ( apiMessage !== undefined ) {
                
                //debug api message
                $debug.d('[Message][Arrived][WsMessage]:', apiMessage);

                Service.$notifyFactory.get( Service.$notification, apiMessage ).dispatch();

            }
            
        },

        // on webSocket error
        onWebSocketError = function(event) {
            Service.$debug.error( '[WebSocket][Error]: ', event );
            ws = null;
        },

        // Close webSocket
        closeWebSocket = function() {
            if (ws == null) return;            
            ws.close();
        },

        // check webSocket connect status
        checkWebSocketConnectStatus = function() {

            if (ws == null ||
                ws.readyState == WebSocket.CONNECTING ||
                ws.readyState == WebSocket.CLOSED) {
                reconnect();
            }
            
        },

        // reconnect 
        reconnect = function() {
            start();
        },

        // cancel reconnect task
        cancelCheckWebSocketStatus = function() {
            if (checkWebSocketIntervalHandle == null) return;

            // Cancel task
            clearInterval(checkWebSocketIntervalHandle);
            checkWebSocketIntervalHandle = null;
        },

        // check webSocket status every 10s
        startCheckWebSocketStatusAndTryReconnectTask = function() {
            cancelCheckWebSocketStatus();
            checkWebSocketIntervalHandle = setInterval(checkWebSocketConnectStatus, 1000 * 10);
        },
        
        // Initialization
        init = function(settings) {
            wsSettings = settings;
            return this;
        },

        // Start 
        start = function() {
            if (!supportWebSocket) return;
            if (wsSettings == null) return;
            if (ws != null) return;
            
            ws = new WebSocket(wsUrl);
            ws.onopen = onWebSocketOpen;
            ws.onclose = onWebSocketClose;
            ws.onmessage= onWebSocketMessage;
            ws.onerror = onWebSocketError;

            startCheckWebSocketStatusAndTryReconnectTask();
        },

        // generally, this method called only by `PP.shutdown()`, so we clear all status
        reset = function(resetCallback) {
            _resetCallback = resetCallback;
            
            closeWebSocket();
            cancelCheckWebSocketStatus();
        },

        getWebSocket = function () {
            return ws;
        };

    ///////// API //////////////
    
    return {

        init: init,
        start: start,
        reset: reset,

        write: write,
        getWs: getWs,
        isWsOk: isWsOk,
        getWsSettings: getWsSettings,

        onWebSocketMessage: onWebSocketMessage
        
    }

    // @param `errorCallback` :
    //        NOTE: this is an `error callback`, it will called when the `WebSocket` is not open
    function write ( data, errorCallback ) {
        if ( isWsOk() ) {
            
            getWs().send( data );
            Service.$debug.d( '[Message][Send]', data );
            
        } else {
            if ( errorCallback ) errorCallback ( data );
        }
    }

    function getWs () {
        return ws;
    }

    function isWsOk () {
        return ws != null && ws.readyState === WebSocket.OPEN;
    }

    function getWsSettings () {
        return wsSettings;
    }
    
})();

Service.$notifyFactory = ( function() {

    var TYPE = { AUTH: 'AUTH',
                 ACK: 'ACK', // ack
                 MSG: 'MSG', // message arrived
                 ONLINE : 'ONLINE',
                 SYS: 'SYS',
                 TYPING : 'TYPING',
                 CONVERSATION: 'CONVERSATION'
               },

        WHAT = {
            AUTH: "AUTH",
            SEND: 'SEND',
            CONVERSATION: 'CONVERSATION'
        };

    //////// API ///////////
    
    return {
        get: get
    }

    ////////////////////////

    function get ( $notifyService, msg ) {

        var type = findType( msg ),
            handler;

        switch ( type ) {
            
        case TYPE.MSG:
            handler = Service.$notifyMsg;
            break;

        case TYPE.ONLINE:
            handler = Service.$notifyOnline;
            break;

        case TYPE.TYPING:
            handler = Service.$notifyTyping;
            break;

        case TYPE.AUTH:
            handler = Service.$notifyAuth;
            break;

        case TYPE.SYS:
            handler = Service.$notifySys;
            break;

        case TYPE.CONVERSATION:
            handler = Service.$notifyConversation;
            break;

        default:
            handler = Service.$notifyUnknown;
            break;
        }

        return handler.get( $notifyService, msg.msg ? msg.msg : msg );
        
    }

    function findType ( msg ) {

        var t = msg.type;

        if ( t === TYPE.MSG )  { // fix 'LOGOUT' message

            if ( msg.msg.mt === TYPE.SYS ) {
                
                t = TYPE.SYS;
            } 
            
        } else if ( t === TYPE.ACK ) {

            switch ( msg.what ) {

            case WHAT.AUTH:
                t = TYPE.AUTH;
                break;

            case WHAT.SEND:
                t = TYPE.MSG;
                break;

            case WHAT.CONVERSATION:
                t = TYPE.CONVERSATION;
                break;
                
            }
            
        }

        return t;
        
    }
    
} )();

Service.$notifyOnline = (function () {

    return {
        get: onlineMessageDispatcher
    }

    function onlineMessageDispatcher ( $notifyService, onlineMessage ) {

        return {
            dispatch: dispatch
        }

        function dispatch () {
            onlineMessage && Service.$pubsub.publish ( 'ws/online', onlineMessage );
        }
        
    }
    
})();

Service.$notifySys = (function () {

    var SUB_TYPE = 'LOGOUT';
    
    ////// API /////////////
    
    return {
        get: logoutMessageDispatcher
    }

    // {mt: "SYS", bo: "57bedf0e-a88f-11e5-b287-00163e00061e", ms: "LOGOUT"}
    // 'bo' meaning: 'device_uuid'
    function logoutMessageDispatcher ( $notifyService, sysMessage ) {

        return {
            
            dispatch: dispatch
        }

        function dispatch () {

            if ( sysMessage ) {

                if ( isLogoutMessage( sysMessage ) ) {
                    $notifyService.reset();
                }

            }
            
        }

        function isLogoutMessage ( jsonMessageBody ) {
            // TODO
            // check jsonMessageBody.bo ( divice_uuid ) is current user's device_uuid
            return jsonMessageBody && jsonMessageBody.ms && jsonMessageBody.ms === SUB_TYPE;
        }
    }
    
})();

Service.$notifyTyping = (function() {

    var TYPING_WATCH = 'typing_watch',
        TYPING = 'typing',
        TYPING_UNWATCH = 'typing_unwatch';
    
    //////// API //////////////
    
    return {
        get: get,
    }

    function get ( $notifyService, typingMsg ) {
        
        return {
            dispatch: dispatch,
            
            watch: watch,
            unWatch: unWatch,
            typing: typing
        }

        // when some_one is typing ...
        // will publish a event
        // `Service.$pubsub.publish('ws/typing', { type: 'typing', user_uuid: 'xxxx' })`
        function watch ( conversationUUID ) {
            
            if ( $notifyService.isWsOk() ) {
                
                $notifyService.write( Service.$json.stringify( { type: TYPING_WATCH, conversation_uuid: conversationUUID } ) );

                __Monitor.report( __MonitorEvent.watch, conversationUUID );
                
            }
            
        }

        function unWatch ( conversationId ) {
            if ( conversationId && $notifyService.isWsOk() ) {

                $notifyService.write( Service.$json.stringify( { type: TYPING_UNWATCH, conversation_uuid: conversationId } ) );

                __Monitor.report( __MonitorEvent.unwatch, conversationId );
                
            }
        }

        function typing () {
            
            if ( $notifyService.isWsOk() ) {
                
                $notifyService.write( Service.$json.stringify( { type: TYPING } ) );

                __Monitor.report( __MonitorEvent.typing, TYPING );
                
            }
            
        }

        function dispatch () {

            typingMsg !== undefined && Service.$pubsub.publish( 'ws/typing', typingMsg );
            
        }
        
    }
    
})();

Service.$notifyUnknown = (function() {

    return {
        get: unknownHandler
    }

    function unknownHandler( $notifyService, msg ) {

        return {
            dispatch: dispatch
        }

        function dispatch() {
            Service.$debug.d( 'unknown msg : ', msg );
        }
        
    }
    
})();

Service.$notifyConversation = (function() {

    var EVENT = { AVALIABLE: 'NOTIFY_CONVERSATION/AVALIABLE' },
        ERR_CODE = { NOERR: 0, WAITING: 11 };

    //////// API ////////////
    return {
        EVENT: EVENT,
        
        get: conversationMessageDispatcher
    }

    function conversationMessageDispatcher ( $notifyService, conversationMsg ) {
        
        return {
            dispatch: onConversationAvaliable
        }

        function onConversationAvaliable() {

            if ( conversationMsg.code === ERR_CODE.NOERR ) {
                Service.$pubsub.publish( EVENT.AVALIABLE, findConversationUUID( conversationMsg ) );
            }

        }

        function findConversationUUID( conversationMsg ) {
            return conversationMsg.extra && conversationMsg.extra.conversation_uuid;
        }
        
    }
    
})();

((function() {

    View._booted = false;

    View.bootMe = function(reboot) {
        if (!View._booted || reboot) {

            View.$settings = new View.PPSettings();
            View.$textUrlChecker = new View.TextUrlChecker();
            
            View._booted = true;
        }
    };

    View._pool = {};

    View.add = function(key, value) {
        View._pool[key] = value;
    };

    View.find = function(key) {
        return View._pool[key];
    };
    
})());

/**
 * TODO: REFACTOR
 */
((function(View) {

    /**
     * @constructor
     */
    function Element(tag, attrs, ctrl) {
        var isObj = (attrs && typeof attrs === "object"),
            _id = (isObj) ? (attrs["id"]) : attrs,
            _e = _create(tag, attrs, isObj, _id),
            controller = ctrl;

        // bind controller to this
        this.controller = controller;

        function _create (tag, attrs, isObj, id) {
            var _attr = {};
            if (attrs) {
                if (isObj) {

                    $.each( attrs, function ( key, value ) {

                        if ( value !== undefined || value !== null ) {

                            switch ( key ) {
                            case 'className':
                                _attr [ 'class' ] = value;
                                break;

                            default:
                                _attr [ key ] = value;
                                break;
                            }
                            
                        }
                        
                    } );
                    
                    if (!_attr['class'] && _attr['id']) {
                        _attr['class'] = _attr['id'];
                    }
                } else {
                    if (id) {
                        _attr['id'] = id;
                        _attr['class'] = id;
                    }
                }
            }
            var e = document.createElement(tag);
            for (var key in _attr) {
                if (key != 'event' && key != 'selector') {
                    e.setAttribute(key, _attr[key]);
                }
            }
            if (_attr['event']) {

                var jQuerySelector = id ? '#' + id : _attr['selector'],
                    avaliableEvents = [
                        'click', 'mouseover', 'mouseleave', 'mousedown', 'keydown', 'keyup', 'change', 'input propertychange', 'focus', 'blur', 'init'
                    ];

                if (!jQuerySelector) throw new Error('No jQuerySelector');

                if (jQuerySelector) {

                    $.each(_attr['event'], function (key, value) {
                        if ($.inArray(key, avaliableEvents) != -1) {
                            
                            switch (key) {
                            case 'init':
                                setTimeout(function() {
                                    value.apply(this, arguments);
                                });
                                break;

                            case 'change':
                                setTimeout(function() {
                                    $(jQuerySelector).bind(key, function(e) {
                                        value.apply(this, $(this)); 
                                    });
                                });
                                break;

                            default:
                                setTimeout(function() {
                                    $(jQuerySelector).bind(key, function(e) {
                                        value.apply(this, arguments);
                                    });                              
                                });
                                break;
                            }
                        } 
                    });
                }
                
            }
            return $(e);
        }

        /**
         * 得到JQuery元素
         */
        this.getElement = function() {
            return _e;
        };

        this.getHTML = function() {
            return _e[0].outerHTML;
        };

        /**
         * 添加元素
         */
        this.add = function(e) {
            _e.append(e.getElement()[0].outerHTML);
            return this;
        };

        /**
         * 添加文字
         */
        this.text = function(str) {
            _e.text(str);
            return this;
        };

        /**
         * html...
         */
        this.html = function(htmlString) {
            _e.html(htmlString);
            return this;
        };

        /**
         * 显示或者隐藏该元素
         */
        this.show = function(show) {
            _e.css('display', show ? 'block' : 'none');
            return this;
        };

        /**
         * 设置 Controller
         */
        this.ctrl = function(ctrl) {
            controller = ctrl;
        }

        /**
         * 得到 Controller
         */
        this.getController = function() {
            return controller;
        };

        this.renderTo = function( $el ) {
        }
    }
    
    View.PPElement = Element;
    View.Element = Element;
    
})(View));

/**
 * After run the build command `sh merge.sh`:
 * { css } will be replaced by the content of ppcom/jquery/assets/css/output.min.css
 */
((function(View) {

    function CssStyle() {
        View.PPElement.call(this, 'style', {
            id: 'pp-styles',
            type: 'text/css'
        });
        
        this.text("@charset \"UTF-8\" .pp-container,.pp-location{z-index:2147483647;bottom:0}.pp-container p,.pp-p-no-margin{-webkit-margin-before:0!important;-webkit-margin-after:0!important;-webkit-margin-start:0!important;-webkit-margin-end:0!important}.pp-container,.pp-launcher-icon,.pp-location,.pp-sheet-header{position:absolute;right:0}.pp-container a,.pp-container b,.pp-container div,.pp-container p,.pp-container span,.pp-container textarea,.pp-container u{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important;font:normal normal 100% 'Helvetica Neue',Helvetica,Arial,sans-serif;font-style:normal;letter-spacing:normal;font-stretch:normal;font-variant:normal;-webkit-text-emphasis:none;text-shadow:none;text-transform:none;-webkit-font-smoothing:antialiased;word-wrap:break-word}.pp-container *,.pp-container :after,.pp-container :before{-webkit-box-sizing:content-box!important;-moz-box-sizing:content-box!important;box-sizing:content-box!important}.pp-conversation-container{display:none}.pp-text-link-user{color:#fff!important}.pp-text-link-admin{color:#455A64!important}.pp-container .pp-box-sizing{-webkit-box-sizing:content-box!important;-moz-box-sizing:content-box!important;box-sizing:content-box!important}.pp-container .pp-box-sizing-borderbox{-webkit-box-sizing:border-box!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important}.pp-fixme{clear:both}.pp-selectable{-o-user-select:text;-moz-user-select:text;-webkit-user-select:text;user-select:text}.pp-unselectable{-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}.pp-launcher-icon{bottom:0;width:50px;height:50px;max-width:50px;border-radius:25px;box-shadow:0 6px 13px 0 rgba(0,0,0,.23)}.pp-launcher-icon:hover{cursor:pointer}.pp-sheet-header{z-index:2147483002;box-shadow:0 1px 2px 0 rgba(0,0,0,.12);background:#fff;overflow:hidden;top:0;width:100%;height:48px}.pp-sheet-header-title-container{position:absolute;left:0;top:0;width:100%;height:100%;text-align:center;-moz-text-align-last:center;text-align-last:center}.pp-container .pp-sheet-header-title{font-size:16px;line-height:48px;font-weight:500;color:#465C66;letter-spacing:.2px;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline}.pp-sheet-header-button{position:relative;margin:0 20px 0 15px;height:48px;float:right}.pp-sheet-header-button-minimize-container{position:relative;margin:0;height:48px;width:48px;float:right;cursor:pointer}.pp-sheet-header-button:hover{cursor:pointer}.pp-sheet-header-minimize-button-icon{background-position:center center;width:16px;background-repeat:no-repeat;background-size:15px 15px;height:48px;position:relative;margin:auto}.pp-composer-container-action-btn,.pp-launcher-button,.pp-sheet-header .pp-sheet-header-button-icon{background-position:center;background-repeat:no-repeat}.pp-sheet-header .title-container{display:inline-block}.pp-sheet-header .clickable{cursor:pointer}.pp-sheet-header .down-icon{cursor:pointer;display:inline-block;height:10px;margin-left:5px;width:10px}.pp-container .pp-group-content-container{box-sizing:border-box;display:none;position:relative;height:100%;margin:0 auto;padding-bottom:48px;overflow-y:auto;top:48px}.pp-group-item{padding-top:17px;padding-left:17px;cursor:pointer}.pp-group-item *{cursor:pointer}.pp-group-item img{border-radius:50%;float:left;margin-top:5px;display:inline-block;width:42px;height:42px}.pp-group-item .body-container{margin-left:55px;padding-right:17px;border-bottom:1px solid #e7e7e7;height:65px}.pp-group-item .pp-header{margin-bottom:5px}.pp-group-item .pp-timestamp{float:right;font-size:12px;line-height:20px;color:#aaa;width:50px;text-align:right}.pp-group-item .title-container{margin:0 50px 0 0}.pp-group-item .pp-title{color:rgba(96,104,110,.8);font-size:15px;line-height:22px;font-weight:500;display:block;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pp-group-item .pp-summary{color:rgba(96,104,110,.8);font-size:14px;font-weight:400;line-height:19px;height:40px;overflow:hidden;position:relative;padding-right:17px;word-break:break-word}.pp-group-item .pp-content{line-height:19px}.pp-group-item .pp-unread{color:#3d4347;font-weight:500}.pp-group-item .readstate{background-color:red;border-radius:50%;bottom:27px;color:#fff;display:none;font-size:12px;height:16px;width:16px;position:absolute;right:0;text-align:center;top:6px}.pp-group-item-hover{background-color:#f5f5f6}.pp-sheet-header .pp-sheet-conversations-button{float:left;cursor:pointer;display:none;position:relative;margin:0 20px;height:100%}.pp-sheet-header .pp-sheet-header-button-icon{background-size:15px 12px;margin:0 auto;width:18px;height:100%;opacity:.4;float:left}.pp-sheet-header .pp-unread-count{border-radius:50%;border:2px solid #fff;font-size:11px;line-height:16px;background-color:#0074b0;text-align:center;color:#fff;position:absolute;width:16px;height:16px;top:11px;left:11px;cursor:pointer;display:none}.pp-relative-time{cursor:pointer}.pp-emoji-selector{background-color:#fff;width:324px;height:257px;float:right;margin-right:16px;border-radius:3px;border:1px solid #D0D4D8;box-shadow:0 0 3px 1px rgba(0,0,0,.1)}.pp-emoji-selector-triangle{right:25px;border:solid transparent;position:absolute;pointer-events:none;border-color:rgba(170,170,170,0);border-top-color:#aaa;border-width:8px;z-index:2147483646}.pp-emoji-selector-triangle-mask{right:25px;border:solid transparent;position:absolute;pointer-events:none;border-color:rgba(170,170,170,0);border-top-color:#FFF;margin-top:-1px;border-width:8px;z-index:2147483646}.pp-container .pp-emoji-selector-panel-header{background-color:#fff;height:35px;width:100%;border-radius:3px;text-align:center;font-size:24px}.pp-emoji-selector-panel-header span{line-height:30px;width:45px;margin-top:5px;text-align:center;display:inline-block;border-radius:3px 3px 0 0;cursor:pointer;margin-right:5px}.pp-emoji-selector-panel-header span.active{box-shadow:0 -1px 3px 0 rgba(0,0,0,.1);background-color:#FFF}.pp-emoji-selector-content{box-shadow:0 -1px 3px 0 rgba(0,0,0,.1);background-color:#fff;height:212px;width:314px;overflow-y:auto;display:block;border-radius:0 0 3px 3px;position:relative;left:0;top:0;padding:5px}.pp-container .pp-emoji-selector-content span{margin:6px;width:30px;line-height:30px;display:inline-table;cursor:pointer;text-align:center;font-size:21px}.pp-emoji-selector-sibling{background-color:transparent;overflow:hidden;height:259px}.pp-messenger-panel{width:368px;height:100%;position:fixed;right:0;top:0;bottom:0;border-left:1px solid #e7e7e7;z-index:2147483646;box-shadow:0 0 4px 1px rgba(0,0,0,.08)}.pp-container .pp-launcher-badge{position:absolute;right:-7px;top:0;border-radius:50%;font-size:12px;line-height:18px;background-color:#ff3c00;text-align:center;color:#fff;width:18px;height:18px;cursor:pointer;opacity:1;display:block;visibility:visible}.pp-launcher-button,.pp-launcher-button-container{width:48px;height:48px}.pp-launcher-button{border-radius:50%;border-style:solid;border-width:0;position:absolute;bottom:0;right:0;cursor:pointer;border-color:#004c88;box-shadow:0 6px 13px 0 rgba(0,0,0,.23)}.pp-launcher-button-container-inactive{transition:opacity,.1s;opacity:0;visibility:hidden}.pp-launcher-button-container-active{opacity:1;visibility:visible}.pp-launcher-button-minimized{-webkit-animation:pp-launcher-minimize .1s linear 0s both;animation:pp-launcher-minimize .1s linear 0s both;transition:background-image 0s linear .1s}.pp-launcher-button-maximize{-webkit-animation:pp-launcher-maximize .1s linear 0s both;animation:pp-launcher-maximize .1s linear 0s both}.pp-launcher-button-inactive{visibility:hidden}.pp-launcher-container{position:fixed;height:48px;z-index:2147483646}.pp-loading{box-sizing:border-box;display:none;height:100%;margin:0 auto;top:48px}.pp-loading-spinner{width:28px;height:28px;background-size:28px 28px;background-repeat:no-repeat;position:absolute;left:50%;top:50%;margin-left:-14px;animation:loading 1s linear 0s infinite both;-o-animation:loading 1s linear 0s infinite both;-moz-animation:loading 1s linear 0s infinite both;-webkit-animation:loading 1s linear 0s infinite both}.pp-loading-text{color:gray;font-size:14px!important;width:100%;position:absolute;text-align:center;top:calc(50% + 35px)}@-webkit-keyframes loading{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-moz-keyframes loading{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-o-keyframes loading{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes loading{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes pp-launcher-minimize{0%{-webkit-transform:scale(1);transform:scale(1)}100%{-webkit-transform:scale(0);transform:scale(0)}}@-keyframes pp-launcher-minimize{0%{-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1)}100%{-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0)}}@-webkit-keyframes pp-launcher-maximize{0%{-webkit-transform:scale(0);transform:scale(0)}100%{-webkit-transform:scale(1);transform:scale(1)}}@-keyframes pp-launcher-maximize{0%{-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0)}100%{-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1)}}.pp-conversation-content-maximize{opacity:1;-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1);-webkit-transform-origin:bottom right;-ms-transform-origin:bottom right;transform-origin:bottom right;transition:opacity .1s linear .15s,-webkit-transform .25s ease-in-out;transition:transform .25s ease-in-out,opacity .1s linear .15s;transition:transform .25s ease-in-out,opacity .1s linear .15s,-webkit-transform .25s ease-in-out}.pp-conversation-sheet-minimized{opacity:0;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);-webkit-transform-origin:bottom right;-ms-transform-origin:bottom right;transform-origin:bottom right;transition:opacity .1s linear,visibility 0s linear .25s,-webkit-transform .25s ease-in-out;transition:transform .25s ease-in-out,opacity .1s linear,visibility 0s linear .25s;transition:transform .25s ease-in-out,opacity .1s linear,visibility 0s linear .25s,-webkit-transform .25s ease-in-out}.pp-composer{position:relative;max-width:336px;margin:0 auto}.pp-composer-container-action-btn{height:15px;width:15px;position:relative;float:right;cursor:pointer;top:5px;margin:0 2px 0 0;padding:5px;opacity:.4;background-size:15px 15px}.pp-composer-container-emoji-btn{display:inline;margin-right:2px}.pp-composer-container-tools-container{position:absolute;top:3px;right:6px}.pp-composer-container-warning{bottom:60px;background:0 0;width:100%;text-align:center}.pp-composer-container-form{margin-bottom:0!important;padding:0!important;float:right;width:100%}.pp-container .pp-composer-container-warning-span{font-size:14px;color:red}.pp-container .pp-composer-container-textarea{line-height:20px;border-radius:4px;border:1px solid #cfd8dc;height:100%;width:100%;outline:0!important;color:#455A64;resize:none;font-size:14px;padding:10px 70px 5px 14px;word-break:break-all;overflow:hidden;max-height:210px;min-height:40px}.pp-composer-container-powered-by-container{padding:2px}.pp-container .pp-conversation-part-pulltorefreshbutton{font-size:14px;color:gray;cursor:pointer}.pp-composer-container-input{display:none!important}.pp-container .pp-powered-by{width:100%;color:#b0bec5;text-align:center;clear:both;font-weight:500;line-height:22px;padding:7px;font-size:13px}.pp-powered-by a{text-align:center;cursor:pointer;color:inherit;text-decoration:none}.pp-powered-by u{text-decoration:underline!important}.pp-container .pp-powered-by-span{color:#b6c2c9;float:none;font-size:13px;margin-left:0}.pp-conversation-part{margin-bottom:16px}.pp-conversation-part-welcome-outer-1{display:block;margin-bottom:16px}.pp-conversation-part-welcome-outer-2{border-top:0;border-bottom:1px solid #e4e5e7;padding:0 20px 20px}.pp-conversation-part-welcome-icon{bacground-size:28px 28px;background-repeat:no-repeat;width:28px;height:28px;margin:0 auto 15px}.pp-container .pp-conversation-part-welcome-body{font-weight:400;font-size:14px;color:#90A4AE;line-height:18px;text-align:center;display:block;-moz-user-select:text;-webkit-user-select:text;-ms-user-select:text}.pp-conversation-content{overflow-y:auto;position:absolute;top:48px;bottom:79px;right:0;width:100%;padding:8px;box-sizing:border-box;transition-timing-function:cubic-bezier(.1,.57,.1,1);-webkit-transition-timing-function:cubic-bezier(.1,.57,.1,1);transition-duration:0s;-webkit-transition-duration:0s;transform:translate(0,0) translateZ(0)}.pp-conversation-part-text-by-admin-outer{text-align:left;margin-bottom:16px;clear:both}.pp-conversation-part-text-by-admin-outer-2{position:relative;width:100%}.pp-conversation-part-text-by-admin-avatar{margin-right:5px;border-radius:50%;width:28px;height:28px;float:left;position:relative;overflow:hidden}.pp-conversation-part-text-by-admin-outer-3{position:relative}.pp-conversation-part-text-by-admin-body-container{border-color:#dadee2;border-radius:4px;border-width:1px;border-style:solid;position:relative;max-width:80%;display:inline-block;background-color:#fff;color:#455A64;-moz-user-select:text;-webkit-user-select:text;-ms-user-select:text;top:3px}.pp-container .pp-conversation-part-serve-name{font-size:12px;color:#455A64;text-align:left}.pp-container .pp-conversation-part-text-by-admin-body{font-size:14px;font-weight:400;line-height:20px;padding:12px 17px;text-align:left;word-break:break-all;white-space:pre-wrap}.pp-conversation-part-text-by-admin-triangle{width:0;height:0;border-top:4px solid transparent;border-bottom:4px solid transparent;border-right:4px solid #dadee2;position:relative;float:left;margin-top:10px;margin-right:-1px;top:3px}.pp-container .pp-conversation-part-text-by-admin-timestamp-container{font-size:12px;line-height:20px;color:#c9cbcf;position:relative;top:0;display:inline-block}.pp-conversation-part-emoji-by-admin-outer{text-align:right;margin-bottom:16px;width:100%;position:relative;overflow:hidden}.pp-conversation-part-emoji-by-admin-avatar{margin-right:7px;border-radius:50%;width:28px;height:28px;float:left;position:relative}.pp-conversation-part-emoji-by-admin-body-container{float:left;position:relative}.pp-container .pp-conversation-part-emoji-by-admin-body{font-size:96px;line-height:1.1;float:left;position:relative;margin-top:5px}.pp-container .pp-conversation-part-emoji-by-admin-timestamp{font-size:12px;line-height:20px;color:#c9cbcf;clear:both;display:block;float:left;margin-top:5px}.pp-conversation-part-image-by-user{text-align:right;margin-bottom:16px}.pp-conversation-part-image-by-user-o{text-align:right;margin-bottom:16px;position:relative;overflow:hidden;clear:both}.pp-conversation-part-image-by-user-img{cursor:pointer;border-radius:4px;margin:0 0 5px;padding:0;right:0;max-width:242px;float:right}.pp-container .pp-conversation-part-image-by-user-timestamp{position:relative;float:right;font-size:12px;line-height:20px;color:#c9cbcf;clear:both}.pp-conversation-part-image-by-admin-o{text-align:right;margin-bottom:16px;clear:both}.pp-conversation-part-image-by-admin-o1{position:relative;width:100%}.pp-conversation-part-image-by-admin-avatar{margin-right:7px;border-radius:50%;width:28px;height:28px;float:left;position:relative;overflow:hidden}.pp-conversation-part-image-by-admin-o2{overflow:hidden;position:relative}.pp-conversation-part-image-by-admin-o3{overflow:hidden}.pp-conversation-part-image-by-admin-o4{max-width:242px;float:left;position:relative}.pp-conversation-part-image-by-admin-img{cursor:pointer;border-radius:4px;margin:3px 0 0;padding:0;width:100%}.pp-container .pp-conversation-part-image-by-admin-timestamp-container{position:relative;float:left;font-size:12px;line-height:20px;color:#c9cbcf}.pp-conversation-part-file-by-admin-outer{text-align:right;margin-bottom:16px;clear:both}.pp-conversation-part-file-by-admin-outer-2{position:relative;width:100%}.pp-conversation-part-file-by-admin-avatar{margin-right:7px;border-radius:50%;width:28px;height:28px;float:left;position:relative;overflow:hidden}.pp-conversation-part-file-by-admin-outer-3{overflow:hidden;position:relative}.pp-conversation-part-file-by-admin-outer-4{max-width:80%;float:left;position:relative;margin-top:3px}.pp-conversation-part-file-by-admin-outer-5{display:block;background-color:#0071b2;border-radius:4px;border-width:1px;border-style:solid;padding:5px;overflow:hidden}.pp-conversation-part-file-by-admin-upload-icon{position:relative;float:left;width:32px;height:32px;background-size:16px 15px;background-position:center;background-repeat:no-repeat;border-right:1px solid rgba(255,255,255,.3)}.pp-conversation-part-file-by-admin-outer-6{vertical-align:middle;margin:5px 10px 0;overflow:hidden}.pp-container .pp-conversation-part-file-by-admin-file-link{font-size:14px;font-weight:400;line-height:20px;position:relative;float:left;color:#fff;text-decoration:underline;cursor:pointer;overflow:hidden;word-break:break-all;max-height:20px;margin-left:5px}.pp-container .pp-conversation-part-file-by-admin-timestamp-container{position:relative;float:left;font-size:12px;line-height:20px;color:#c9cbcf}.pp-conversation-part-file-by-user-o{width:100%;position:relative;overflow:hidden}.pp-conversation-part-file-by-user-o2{float:right;padding:5px;background-color:#0071b2;border-radius:4px;border-width:1px;border-style:solid;margin-bottom:5px;max-width:80%}.pp-conversation-part-file-by-user-upload-icon{float:left;width:32px;height:32px;background-size:16px 15px;background-position:center;background-repeat:no-repeat;border-right:1px solid rgba(255,255,255,.3)}.pp-conversation-part-file-by-user-link-container{max-height:20px;overflow:hidden;margin:5px 5px 0 32px}.pp-container .pp-conversation-part-file-by-user a{color:#fff;font-size:14px;font-weight:400;line-height:20px;text-decoration:underline;word-break:break-all;margin:5px 5px 0 10px}.pp-container .pp-conversation-part-file-by-user-timestamp{font-size:12px;line-height:20px;color:#c9cbcf;clear:both;text-align:right}.pp-conversation-part-center{display:table;margin:0 auto 10px}.pp-uploading-bar,.pp-uploading-bar-remove{display:inline-block;vertical-align:middle}.pp-container .pp-conversation-part-timestamp-time{background-color:#cecece;padding:4px;border-radius:4px;font-size:14px}.pp-uploading-bar{border-radius:4px;position:relative;width:50px;height:6px;border:1px solid #ccc;background-color:#fff;margin:0 5px}.pp-uploading-bar-state{transition:width .4s;border-radius:3px;background-color:#0071b2;position:absolute;top:0;left:0;bottom:0}.pp-uploading-bar-remove{background-size:14px 14px;background-repeat:no-repeat;opacity:.8;cursor:pointer;width:14px;height:14px;right:-22px;top:2px}.pp-container .pp-uploading-bar-outer{color:#c9cbcf;font-size:14px;display:block;float:right}.pp-launcher-preview-outer{height:100px;max-width:274px;float:right;margin-right:52px;width:100%;position:relative;margin-top:-60px}.pp-launcher-preview-outer-2{padding:10px;position:relative;float:right;cursor:pointer}.pp-launcher-preview-outer-3{border-radius:10px;background:#fff;padding:13px;position:relative;box-shadow:0 6px 13px 0 rgba(0,0,0,.23)}.pp-launcher-preview-close{background-size:18px 18px;background-repeat:no-repeat;cursor:pointer;width:20px;height:20px;float:left;margin-top:-20px;margin-left:-20px;display:none}.pp-launcher-preview{position:relative}.pp-launcher-preview-p-outer{overflow:hidden;max-height:37px;min-height:18px}.pp-launcher-preview-p{word-break:break-all;line-height:19px;color:#333}.pp-launcher-preview-triangle-container{float:right;margin-right:-15px;position:relative}.pp-launcher-preview-triangle{width:0;height:0;border-top:7px solid transparent;border-bottom:7px solid transparent;border-left:7px solid #fff;margin-left:calc(100% - 12px);margin-top:18px}.pp-no-conversations-icon{background-size:79px 59px;background-repeat:no-repeat;display:block;width:79px;height:59px;margin:0 auto 10px}.pp-container .pp-no-conversations-p{color:#CDCFD2;width:96px;margin:auto;font-size:16px;text-align:center}.pp-no-conversations{margin-top:200px}.pp-composer-container{width:100%;background:0 0;position:absolute;bottom:0;right:0;padding:5px}.pp-composer-send-button{border-radius:4px;margin-left:8px;height:40px;float:right;text-decoration:none;padding:0 9px;display:inline-block;color:#fff;cursor:pointer;background:#CCC}.pp-admin-avatar,.pp-admin-avatar img{margin:0 auto;border-radius:50%}.pp-composer-send-button p{font-size:14px;line-height:25px}.pp-app-profile-container{padding:16px 16px 0}.pp-app-profile{padding:20px 12px 26px;background-color:#fff;overflow:hidden;box-shadow:0 0 3px rgba(0,0,0,.2);border-radius:5px}.pp-active-admins{text-align:center;color:#364850;padding-top:24px}.pp-container .pp-app-profile-text{padding:14px 30px 0;text-align:center;font-weight:400;font-size:13px;color:#78909C;line-height:19px}.pp-container .pp-app-profile-team{text-align:center;color:#455a64;font-weight:500;font-size:15px;line-height:1.8}.pp-active-admin{display:inline-block}.pp-admin-avatar img{width:48px;height:48px}.pp-active-admin .state{margin-top:10px;font-size:12px}.pp-active-admin .online{color:#A6D84F}.pp-active-admin .offline{color:#F90}.pp-container .pp-active-admin-name{font-size:12px;color:#90A4AE;text-align:center;padding-top:7px;width:80px;overflow:hidden;text-overflow:ellipsis}.pp-launcher-hovercard{background-color:#fafafb;border-radius:5px;border:1px solid rgba(0,0,0,.1);box-shadow:0 0 10px rgba(0,0,0,.08);width:340px;position:absolute;bottom:64px;right:-5px}.pp-launcher-hovercard-welcome{background-color:#fff;border-radius:5px 5px 0 0;border-bottom:1px solid #dfe0e1;box-shadow:0 1px 1px #f0f0f1;padding:26px 20px;overflow:hidden;cursor:pointer}.pp-launcher-hovercard-close{opacity:1;transition:opacity .2s ease-in-out;cursor:pointer;position:absolute;top:-30px;right:-1px;border-radius:40px;box-shadow:0 0 20px rgba(0,0,0,.12);padding:6px 10px 5px 22px;font-size:12px;color:#fff;background-position:10px center;line-height:12px;background-size:8px 8px;background-repeat:no-repeat}.pp-launcher-hovercard-textarea{padding:18px 16px;font-size:16px;border-radius:0 0 5px 5px;height:42px;cursor:pointer}.pp-container .pp-launcher-hovercard-textarea-textarea{width:100%;height:42px;background-color:#fff;font-weight:400;color:#455a64;resize:none;border:1px solid #cfd8dc;font-size:14px;line-height:20px;padding:10px 70px 5px 14px;border-radius:4px;outline:0}.pp-container .pp-textarea-focus{border-color:#74BEFF;box-shadow:0 0 4px 0 rgba(75,171,255,.38)}.pp-launcher-hovercard-admins{width:107px;position:relative;float:left;height:50px;padding-bottom:35px;cursor:pointer;text-align:center}.pp-launcher-hovercard-text{float:right;width:174px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;cursor:pointer}.pp-container .pp-launcher-hovercard-app-name{font-weight:700;font-size:14px;color:#37474f;margin-bottom:7px;cursor:pointer}.pp-container .pp-launcher-hovercard-welcome-text{font-size:12px;color:#78909c;line-height:1.5;cursor:pointer}.pp-launcher-hovercard:after,.pp-launcher-hovercard:before{top:100%;right:20px;border:solid transparent;content:' ';height:0;width:0;position:absolute;pointer-events:none}.pp-launcher-hovercard:before{border-color:rgba(204,204,204,0);border-top-color:rgba(0,0,0,.14);border-width:9px;margin-left:-6px}.pp-launcher-hovercard:after{border-color:rgba(250,250,251,0);border-top-color:#fafafb;border-width:8px;margin-left:-5px;right:21px}.pp-launcher-hovercard .groups-header{margin:30 auto 20;text-align:center;font-size:20px;color:#000}.pp-launcher-hovercard .groups-footer{margin:30 auto;text-align:center;clear:both;color:#989494}.pp-launcher-hovercard .groups-body{width:290px;margin:10 auto}.pp-launcher-hovercard .groups-body .item{background-color:#F3F3F3;border:1px solid #FBF0F0;border-radius:5px;box-shadow:2px 2px 1px #E6E3E3;clear:both;cursor:pointer;height:50px;margin-bottom:20px;padding:5 5 5 15px}.pp-launcher-hovercard .groups-body .left{float:left;width:50px}.pp-launcher-hovercard .groups-body .img-container{display:inline-block;margin-left:-22px;position:relative}.pp-launcher-hovercard .groups-body .img-container:first-child{margin-left:0}.pp-launcher-hovercard .groups-body .right{float:left;margin-left:10px}.pp-launcher-hovercard .group-name{margin-top:5px;font-size:16px;color:#3E3C3C}.pp-launcher-hovercard .online-time{font-size:14px;margin-top:5px;color:gray}.pp-launcher-hovercard img{width:46px;height:46px;margin:0 auto;border-radius:50%;border:2px solid #fff}.pp-launcher-admin-avatar{position:relative;display:inline-block;top:0;cursor:pointer;margin-left:-22px}.pp-launcher-admin-avatar:first-child{margin-left:0}.pp-launcher-admin-avatar img{width:46px;height:46px;margin:0 auto;border-radius:50%;border:2px solid #fff}.pp-container img.grayscale{-webkit-filter:grayscale(1);-webkit-filter:grayscale(100%);filter:grayscale(100%);filter:gray}#pp-container .pp-image-viewable{cursor:-webkit-zoom-in;cursor:zoom-in}#pp-container .pp-image-viewer-overlay{z-index:2147483647;position:fixed;top:0;right:0;bottom:0;left:0;background:#000;cursor:-webkit-zoom-out;cursor:zoom-out;opacity:0}#pp-container .pp-zoomed-image{z-index:2147483648;position:fixed;cursor:-webkit-zoom-out;cursor:zoom-out;transition:all .3s ease}.pp-container .group-member-hovercard{background-color:#fafafb;border-radius:5px;border:1px solid rgba(0,0,0,.1);left:42px;box-shadow:0 0 10px rgba(0,0,0,.08);position:absolute;width:260px;-webkit-box-sizing:initial!important;-moz-box-sizing:initial!important;box-sizing:initial!important}.pp-container .group-member-hovercard .body{background-color:#fff;border-radius:5px 5px 0 0;border-bottom:1px solid #dfe0e1;box-shadow:0 1px 1px #f0f0f1;padding:13px 10px 1px;overflow:hidden;cursor:pointer}.pp-container .group-member-hovercard .img-container{display:inline-block;top:0;width:60px;position:relative;float:left;height:50px;padding-bottom:35px;cursor:pointer;text-align:center}.pp-container .group-member-hovercard img{width:60px;height:60px;margin:0 auto;border-radius:50%;border:2px solid #fff}.pp-container .group-member-hovercard .info{float:right;width:164px;cursor:pointer}.pp-container .group-member-hovercard .name{font-weight:700;font-size:14px;color:#37474f;margin-bottom:7px;cursor:pointer}.pp-container .group-member-hovercard .signature{font-size:12px;color:#78909c;line-height:1.5;cursor:pointer}.pp-container .group-member-hovercard .textarea-container{padding:9px 8px;font-size:16px;border-radius:0 0 5px 5px;height:36px;cursor:pointer}.pp-container .group-member-hovercard textarea{width:100%;height:36px;background-color:#fff;font-weight:400;color:#455a64;resize:none;border:1px solid #cfd8dc;font-size:14px;line-height:20px;padding:7px 35px 5px 10px;border-radius:4px;outline:0}.pp-container .group-member-hovercard textarea:focus{border-color:#74BEFF;box-shadow:0 0 4px 0 rgba(75,171,255,.38)}.pp-container .group-member-hovercard .arrow-down{width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:8px solid #000;display:inline-block;right:10px}.pp-container .group-member-hovercard .arrow-up{width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-bottom:8px solid #000}.pp-container .group-member-hovercard *,.pp-container .group-member-hovercard:after,.pp-container .group-member-hovercard:before{-webkit-box-sizing:content-box!important;-moz-box-sizing:content-box!important;box-sizing:content-box!important}.pp-container .group-member-hovercard textarea{-webkit-box-sizing:border-box!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important}.pp-container .group-members{background-color:#FFF;box-shadow:0 0 10px rgba(0,0,0,.08);display:none;max-height:-moz-calc(100% - 48px);max-height:-webkit-calc(100% - 48px);max-height:calc(100% - 48px);opacity:0;overflow-y:auto;padding-bottom:10px;position:relative;right:0;width:100%}.pp-container .group-members-container{max-height:100%;width:320px;margin:0 auto}.pp-container .group-members .member{float:left;height:101px;margin-left:20px;margin-right:20px;padding-top:20px}.pp-container .group-members .pp-wrapper{position:relative}.pp-container .group-members img.pp-avatar{border-radius:50%;border:2px solid #3F65D6;cursor:pointer;height:60px;width:60px}.pp-container .group-members img.pp-state{bottom:5px;display:none;position:absolute;right:5px}.pp-container .group-members img.pp-state.pp-active{display:block}.pp-container .group-members .member .name{color:#888;font-size:14px;max-height:19px;max-width:60px;overflow:hidden;padding-top:5px;text-align:center;text-overflow:ellipsis}.pp-container .pp-conversation-part-error{color:red;display:block}.pp-container .pp-conversation-part-emoji-by-user{position:relative;top:0;font-size:12px;line-height:20px;color:#c9cbcf;margin-right:6px}.pp-container .pp-conversation-part-emoji-by-user .pp-emoji-container{text-align:right;margin-bottom:16px}.pp-container .pp-conversation-part-emoji-by-user .pp-emoji{display:block;font-size:96px;line-height:1.1;text-align:right}.pp-conversation-part-text-by-user-outer{text-align:right;margin-bottom:16px}.pp-conversation-part-text-by-user-outer .pp-wrapper{text-align:right}.pp-container .pp-conversation-part-text-by-user-timestamp-outer{position:relative;top:0;font-size:12px;line-height:20px;color:#c9cbcf;margin-right:6px}.pp-conversation-part-text-by-user-triangle{width:0;height:0;border-top:4px solid transparent;border-bottom:4px solid transparent;border-left:4px solid #21abe1;position:relative;top:50%;float:right;margin-left:-1px;margin-top:10px}.pp-conversation-part-text-by-user-body-outer{border-radius:4px;border-width:1px;border-style:solid;position:relative;max-width:80%;display:inline-block;background-color:#21abe1;color:#fff;min-height:36px}.pp-container .pp-conversation-part-text-by-user-body{font-size:14px;font-weight:400;line-height:20px;padding:12px 17px;text-align:left;-moz-user-select:text;-webkit-user-select:text;-ms-user-select:text;white-space:pre-wrap}.pp-container .msg-audio-admin .pp-avatar{border-radius:50%;width:28px;height:28px;float:left;position:relative;overflow:hidden;clear:both}.pp-container .msg-audio-admin .pp-content{float:left;width:80%;margin-left:5px;margin-bottom:16px}.pp-container .msg-audio-admin .pp-name{color:#455A64;display:block;font-size:12px;text-align:left}.pp-container .msg-audio-admin .pp-voice{position:relative}.pp-container .msg-audio-admin .pp-body{border-color:#dadee2;border-radius:4px;border-width:1px;border-style:solid;cursor:pointer;position:relative;padding:10px;max-width:80%;display:inline-block;background-color:#fff;color:#455A64;top:3px}.pp-container .msg-audio-admin .pp-triangle{width:0;height:0;border-top:4px solid transparent;border-bottom:4px solid transparent;border-right:4px solid #dadee2;position:relative;float:left;margin-top:10px;margin-right:-1px;top:3px}.pp-container .msg-audio-admin i{width:23px;height:23px;vertical-align:middle;display:inline-block}.pp-container .msg-audio-admin .pp-dura{font-size:14px;margin-left:10px}.pp-container .msg-audio-admin .pp-unread{border-radius:50%;background-color:red;display:inline-block;width:7px;height:7px;margin-left:10px;margin-bottom:2px}.pp-container .msg-audio-admin .pp-desc{font-size:12px;margin-left:5px;display:block;margin-top:5px}@media (max-width:736px){.pp-messenger-panel,.pp-sheet-header{top:0;width:100%;border-left:1px solid #e7e7e7;right:0}.pp-messenger-panel{bottom:0;background-color:#fff;z-index:2147483646}.pp-sheet-header{box-shadow:0 1px 2px 0 rgba(0,0,0,.08);background:#fff;position:fixed;border-bottom:1px solid #e7e7e7;z-index:2147483647}.pp-sheet-header-button{position:relative;margin:0;height:48px;width:48px;float:right}.pp-sheet-header-button-icon{background-size:13px 13px;background-repeat:no-repeat;width:16px;height:100%;background-position:center center;margin:auto}.pp-conversation-part-welcome-outer-2{border-top:0;padding:0 20px 20px;border-image:initial}.pp-emoji-icon{font-family:AppleColorEmoji;margin:6px;width:30px;line-height:30px;display:inline-table;cursor:pointer;text-align:center;font-size:21px}.pp-composer-container{width:100%;background:0 0;position:fixed;bottom:0;right:0;padding:5px}.pp-no-conversations-icon{background-color:#fff}.pp-powered-by{display:none}.pp-conversation-content{bottom:49px}.pp-composer{max-width:100%;margin:0 10px}}@media (max-width:480px){.pp-emoji-selector{max-width:280px;width:100%;height:175px}.pp-emoji-selector-content{max-width:270px;width:100%;height:130px}.pp-emoji-selector-panel-header{max-width:280px;width:100%}.pp-emoji-selector-sibling{height:177px}}");
    }
    extend(CssStyle, View.PPElement);

    View.CssStyle = CssStyle;
    
})(View));

((function(View) {

    /**
     * @constructor
     */
    function PPDiv(attrs, ctrl) {
        View.PPElement.call(this, 'div', attrs, ctrl);
    }
    extend(PPDiv, View.PPElement);

    View.PPDiv = PPDiv;
    View.Div = PPDiv;
    
})(View));

((function(View) {
    
    function Span(attrs, ctrl) {
        View.PPElement.call(this, 'span', attrs, ctrl);
    }
    extend(Span, View.PPElement);

    View.Span = Span;
    
})(View));

((function(View) {
    
    function P(attrs, ctrl) {
        View.PPElement.call(this, 'p', attrs, ctrl);
    }
    extend(P, View.PPElement);

    View.P = P;
    
})(View));

((function(View) {
    
    function Img(attrs, ctrl) {
        View.PPElement.call(this, 'img', attrs, ctrl);
    }
    extend(Img, View.PPElement);

    View.Img = Img;
    
})(View));

View.$sheetHeader = (function() {

    /**
     * @constructor
     */
    function PPSheetHeader() {
        
        var ctrl = Ctrl.$sheetheader,
            PPDiv = View.PPDiv,
            PPElement = View.PPElement,

            iconConversations = Configuration.assets_path + 'img/icon-conversations.png',

            buildTitle = function() {
                return new PPDiv('pp-sheet-header-title-container')
                    .add(new View.Div({
                        className: 'title-container'
                    })
                         .add(new PPElement('b', {
                             id: titleId,
                             'class': titleId + ' pp-selectable'
                         })));
            },

            buildMinimizeButton = function() {
                return new PPElement('a', {
                    id: minimizeButtonId,
                    'class': minimizeButtonId,
                    title: Service.Constants.i18n('MINIZE_BUTTON_HINT')
                })
                    .add(new PPDiv({
                        id: 'pp-sheet-header-button-icon',
                        style: 'background-image: url(' + Configuration.assets_path + 'img/icon-minimize.png)'
                    }));
            },

            buildConversationsButton = function() {
                return new PPElement('a', {
                    'class': 'pp-sheet-conversations-button'
                }).add(new PPDiv({
                    'class': 'pp-sheet-header-button-icon',
                    style: 'background-image: url(' + iconConversations + ')'
                })).add(new PPDiv({
                    'class': 'pp-unread-count pp-font pp-box-sizing'
                }));
            },

            buildSheetHeaderEvent = function() {
                $('#' + id).bind('click', ctrl.onSheetHeaderClicked);
            },

            buildMinimizeButtonEvent = function() {

                var selector = '.pp-sheet-header-button .pp-sheet-header-button-icon';
                
                $('#' + minimizeButtonId)
                    .bind('mouseover', function() {
                        $(selector).css('opacity', 1.0);
                    })
                    .bind('mouseleave', function() {
                        $(selector).css('opacity', .4);
                    })
                    .bind('click', ctrl.minimize);
            },

            buildConversationsButtonEvent = function() {

                var selector = groupButtonIconSelector;
                
                $(selector)
                    .bind('mouseover', function() {
                        $(selector).css('opacity', 1.0);
                    })
                    .bind('mouseleave', function() {
                        $(selector).css('opacity', .4);
                    })
                    .bind('click', function() {
                        Ctrl.$conversationList.show();
                    });
            },

            buildUnreadButtonEvent = function() {
                var selector = '.pp-sheet-conversations-button .pp-unread-count';
                $ ( selector )
                    .bind('mouseover', function () {
                        $ ( groupButtonIconSelector ).mouseover();
                    })
                    .bind('mouseleave', function () {
                        $ ( groupButtonIconSelector ).mouseleave();
                    })
                    .bind('click', function () {
                        $ ( groupButtonIconSelector ).click();
                    });
            };
        
        PPDiv.call(this, {
            id: id,
            'class': id + ' pp-box-sizing pp-unselectable'
        }, ctrl);

        // Build HTML
        this.add(buildTitle())
            .add(buildConversationsButton())
            .add(buildMinimizeButton());

        // Bind event
        $timeout(function() {
            ctrl.onSheetHeaderInit();
            buildSheetHeaderEvent();
            buildMinimizeButtonEvent();
            buildConversationsButtonEvent();
            buildUnreadButtonEvent();
        });
    }
    extend(PPSheetHeader, View.PPDiv);

    var id = 'pp-sheet-header',
        titleId = 'pp-sheet-header-title',
        minimizeButtonId = 'pp-sheet-header-button',
        unreadCountSelector = '.pp-unread-count',
        groupButtonSelector = '.pp-sheet-conversations-button',
        groupButtonIconSelector = groupButtonSelector + ' .pp-sheet-header-button-icon',
        titleSelector = '.pp-sheet-header .title-container',

        build = function() {
            return new PPSheetHeader();
        },

        // unreadCount > 0, show unread number
        // unreadCount <= 0, hide unread number
        setUnreadCount = function(unreadCount) {
            if (unreadCount > 0) {
                $(unreadCountSelector).show().text(unreadCount);
            } else {
                $(unreadCountSelector).hide();
            }
        },

        showGroupButton = function() {
            $(groupButtonSelector).show();
        },

        hideGroupButton = function() {
            $(groupButtonSelector).hide();
        },

        setTitle = function(title) {
            $( '#' + titleId ).text( title );
        };

    ///////// API //////////////
    return {
        build: build,

        height: height,

        setUnreadCount: setUnreadCount,
        showGroupButton: showGroupButton,
        hideGroupButton: hideGroupButton,

        showDropDownButton: showGroupMembersDropDownButton,
        hideDropDownButton: hideGroupMembersDropDownButton,
        changeDropDownButtonToHideState: changeGroupMembersDropDownButtonToHideState,
        changeDropDownButtonToShowState: changeGroupMembersDropDownButtonToShowState,

        setTitle: setTitle
    }

    ////////// Implementation /////

    function showGroupMembersDropDownButton () {

        if ( Service.$sheetHeader.isShowDropDownButton() ) return;
        
        Service.$sheetHeader.showDropDownButton( true ); // update state
        
        var $el = $( titleSelector );
        
        $el.append( new View.Element( 'i', {
            className: 'down-icon',
            style: 'background: url(' + Configuration.assets_path + 'img/icon-down.png) 0 -795px'
        } ).getHTML() )
            .addClass( 'clickable' )
            .on( 'click', function() {

                var $groupMembers = Ctrl.$groupMembers;

                if ( $groupMembers.isShow() ) {
                    changeGroupMembersDropDownButtonToHideState();
                    $groupMembers.hide();
                } else {
                    changeGroupMembersDropDownButtonToShowState();
                    $groupMembers.show();
                }
                
            } );
        
    }

    function hideGroupMembersDropDownButton () {

        Service.$sheetHeader.showDropDownButton( false ); // update state
        
        var $el = $( titleSelector );

        // remove drop-down button
        $el.find( 'i' ).detach();

        $el.removeClass( 'clickable' );
        $el.off( 'click' );
        
    }

    function changeGroupMembersDropDownButtonToHideState() {
        $( titleSelector ).find( 'i' )
            .attr( 'style', 'background: url(' + Configuration.assets_path + 'img/icon-down.png) 0 -795px' );
    }
    
    function changeGroupMembersDropDownButtonToShowState() {
        $( titleSelector ).find( 'i' )
            .attr( 'style', 'background: url(' + Configuration.assets_path + 'img/icon-down.png) 0 -2362px' );
    }

    function height() {
        return $( '#' + id ).height();
    }
    
})();

View.$groupContent = (function() {

    function GroupContent () {
        View.PPDiv.call(this, {
            'class': elementClass
        });

        // on new message arrived
        // change this group state to unread
        Service.$pubsub.subscribe('msgArrived/group', function(topics, ppMessage) {

            var groupId = ppMessage.getBody().conversation.uuid,
                $groupContentItemView = View.$groupContentItem;
            
            $groupContentItemView.showUnread(
                groupId,
                Modal.$conversationContentGroup
                    .get( groupId )
                    .unreadCount());

            // update each group item's description when new message arrived
            $groupContentItemView.description( groupId, ppMessage.getMessageSummary() );
            
        });
    }
    extend(GroupContent, View.PPDiv);

    var elementClass = 'pp-group-content-container',
        elSelector = '.' + elementClass,

        show = function() {
            $(elSelector).show();
            return this;
        },

        hide = function() {
            $(elSelector).hide();
            return this;
        },

        update = function(groupInfo) {
            $( elSelector ).empty();
            var html = '';
            $.each(groupInfo, function(index, item) {                
                html += View.$groupContentItem.build(item).getHTML();
            });
            $(elSelector).append(html);
            return this;
        },

        empty = function() {
            return $(elSelector).is(':empty');
        },

        visible = function () {
            return $(elSelector).is(':visible');
        },

        build = function() {
            return new GroupContent();
        };

    ////////// API ///////////////
    
    return {
        build: build,

        show: show,
        hide: hide,
        update: update,
        focus: focus,
        empty: empty,
        visible: visible
    }
    
})();

View.$groupContentItem = (function() {

    function Item(data) {
        View.PPDiv.call(this, {
            'class': 'pp-group-item',
            group_uuid: data.uuid
        });

        var groupName = data.name,
            timeStamp = '',
            groupID = data.uuid,
            icon = data.icon,
            summary = data.summary,

            buildAvatar = function() {
                return new View.Img( {
                    src: icon
                } );
            },
            
            buildBody = function() {
                return new View.PPDiv({
                    'class': 'body-container'
                })
                    .add(new View.PPDiv({
                        'class': 'pp-body'
                    })
                         .add(new View.PPDiv({
                             'class': 'pp-header'
                         })
                              .add(new View.PPDiv({
                                  'class': 'pp-timestamp'
                              })
                                   .add(new View.Span({
                                       'class': 'pp-unread'
                                   }).text(timeStamp)))
                              .add(new View.PPDiv({
                                  'class': 'title-container'
                              })
                                   .add(new View.PPDiv({
                                       'class': 'pp-title'
                                   }).text(groupName))))
                         .add(new View.PPDiv({
                             'class': clsSummary
                         })
                              .add(new View.PPDiv({
                                  'class': 'readstate'
                              }))
                              .add(new View.Div( { className: 'pp-content' } )
                                   .text(summary))));
            },

            buildEvent = function() {
                var $e = findItem(groupID),
                    hoverClass = 'pp-group-item-hover';
                
                $e.bind('mouseover', function() {
                    $e.addClass(hoverClass);
                }).bind('mouseleave', function() {
                    $e.removeClass(hoverClass);
                }).click('click', function() {
                    Ctrl.$conversationList.showItem( groupID );
                });
                
            };

        // Build HTML
        this.add(buildAvatar())
            .add(buildBody());

        // Build Event
        $timeout(buildEvent);

    }
    extend(Item, View.PPDiv);
    
    var clsSummary = 'pp-summary',
        clsSummarySelector = '.' + clsSummary + ' .pp-content',

        findItem = function(groupUUID) {
            return $('.pp-group-content-container')
                .find('div[group_uuid=' + groupUUID +']');
        },

        // @param groupUUID
        // @param unread > 0 --> show red circle
        showUnread = function(groupUUID, unread) {
            unread > 0 && findItem(groupUUID).find('.readstate').text( unread > 99 ? 99 : unread ).show();
        },

        hideUnread = function(groupUUID) {
            findItem(groupUUID).find('.readstate').hide();
        },

        findGroupItemImg = function ( groupUUID ) {
            return $( '.pp-group-content-container div[group_uuid=' + groupUUID + '] img' );
        },

        groupIcon = function ( groupUUID, user ) {

            if ( groupUUID && user ) {
                
                findGroupItemImg ( groupUUID )
                    .attr( 'src', user.user_avatar )
                    .attr( 'user_uuid', user.user_uuid );
                
            } else {
                return findGroupItemImg ( groupUUID )
                    .attr( 'src' );
            }
            
        },

        build = function(data) {
            return new Item(data);
        };

    return {
        build: build,

        showUnread: showUnread,
        hideUnread: hideUnread,

        // act as setter and getter
        groupIcon: groupIcon,

        // act as setter
        description: description
    }

    function description( token, desc ) {
        findItem( token ).find( clsSummarySelector ).text( desc );
    }
    
})();

View.$groupMembers = (function() {

    var parentSelector = '#pp-conversation-container',
        groupMembersSelector = '.pp-container .group-members',
        groupMembersContainerSelector = '.pp-container .group-members-container',
        groupMembersSelectorAvatars = groupMembersSelector + ' img.pp-avatar',

        ANIMATE_DURATION = 250,
        showDuration = ANIMATE_DURATION,

        isMouseoverImg = false,
        REMOVE_GROUP_MEMBER_HOVERCARD_EVENT_ID = 'rm-group-member-hovercard',
        mEventToken = REMOVE_GROUP_MEMBER_HOVERCARD_EVENT_ID;

    ///////// API ///////////
    return {
        build: build,

        isShow: isShow,
        show: show,
        hide: hide,
        opacity: opacity,
        scrollbarWidth: scrollbarWidth,

        _show: _show, // FOR DEBUG
    }

    ///////// Implementation ////////
    function show( groupId ) {

        Service.$conversation.asyncGetUser( groupId, function( userList ) {
            _show( userList );
        } );
        
    }

    function _show( userList ) {
        var users = userList || [],
            html = '';
        
        // we build one if not exist
        if ( !( $( parentSelector ).find( '.group-members' ).length) ) build();

        $( groupMembersContainerSelector ).empty();
        $.each( users, function ( index, item ) {
            html += View.$groupMember.build( item ).getHTML();
        } );
        $( groupMembersContainerSelector ).append( html );

        // show with animation
        $( groupMembersSelector )
            .show()
            .animate( {
                opacity: 1.0,
                top: 48
            } , showDuration );

        // bind event
        bindEvent( users );
    }

    // @param groupId
    // @animate default is true
    function hide( groupId, animate ) {

        var $el = $( groupMembersSelector ),
            anim = ( typeof animate === 'boolean' ) ? animate : true,
            innerHide = function() {
                $el.hide();
                $( groupMembersContainerSelector ).empty();
                View.$groupMemberHovercard.remove();
            };
        
        if ( anim ) {
            $el.animate( {
                opacity: .0,
                top: 0
            }, showDuration, innerHide );
        } else {
            innerHide();
        }

    }

    function isShow() {
        var $el = $( groupMembersSelector );
        return $el.length !== 0 && $el.is( ':visible' );
    }

    function opacity( val ) {
        $( groupMembersSelector ).css( 'opacity', val );
    }

    // @return vertical scrollbar width
    function scrollbarWidth() {
        var hasScrollbar = $( groupMembersSelector ).height()
            + View.$sheetHeader.height()
            + Service.$tools.scrollbarWidth >= window.innerHeight;
        return hasScrollbar ? Service.$tools.scrollbarWidth : 0;
    }

    function build() {
        $( parentSelector ).append( buildContainer().getHTML() );
    }

    function bindEvent( users ) {
        if ( Service.$device.isMobileBrowser() ) {
            bindMobileEvent( users );
        } else {
            bindPCEvent( users );
        }
    }

    function bindMobileEvent( users ) {
        $( groupMembersSelectorAvatars )
            .on( 'click', function ( e ) {
                
                var userId = $( this ).attr( 'user_uuid' );

                View.$loading.show();
                Ctrl.$groupMembers.hide();
                Ctrl.$groupMembers.onMemberClicked( userId, function() {
                    View.$loading.hide();
                } );
                
            } );
    }

    function bindPCEvent( users ) {
        // bind `mouseover` event or `mouseleave` event
        $( groupMembersSelectorAvatars )
            .bind( 'mouseover', function ( e ) {
                e.stopImmediatePropagation();

                isMouseoverImg = true;
                Service.$task.cancel( mEventToken );

                var user = findUser( users, $( this ).attr( 'user_uuid' ) );
                View.$groupMemberHovercard.remove();
                View.$groupMemberHovercard.show( user, { e: e, el: $( this ) } );
            } )
            .bind( 'mouseleave', function ( e ) {
                isMouseoverImg = false;
            });

        $( groupMembersSelector )
            .bind( 'click', function ( e ) {
                !isMouseoverImg && View.$groupMemberHovercard.remove();
            } )
            .bind( 'mouseover', function ( e ) {
                if ( View.$groupMemberHovercard.isShow() && !View.$groupMemberHovercard.isMouseover() ) {
                    
                    Service.$task.plan( mEventToken , function() {
                        !isMouseoverImg &&
                            !View.$groupMemberHovercard.isMouseover() &&
                            View.$groupMemberHovercard.remove();
                    } );
                    
                }
                
            } );        
    }

    function buildContainer () {
        
        return new View.Div( {
            className: 'group-members'
        } )
            .add(new View.Div( {
                className: 'group-members-container'
            } ));
        
    }

    function findUser( users, userId ) {

        var user;
        $.each( users, function( index, item ) {
            if ( userId === item.user_uuid ) {
                user = item;
            }
        } );

        return user;
        
    }
    
})();

View.$groupMember = (function() {

    var groupMembersSelector = '.pp-container .group-members',
        mobileOnlineIcon = Configuration.assets_path + 'img/state_mobile_online.png';
    
    return {
        build: build
    }

    /////// Implementation ////////

    function build( user ) {

        var container = new View.PPDiv( {
            className : 'member'
        } );

        container.add( buildAvatar( user ) );
        container.add( buildName( user ) );

        return container;
        
    }

    function buildAvatar( user ) {

        var container = new View.Div( { className: 'pp-wrapper' } ),
            isOnline = user.is_online;

        container.add( new View.Img( {
            
            className: 'pp-avatar' +
                ( isOnline ? '' : ' grayscale' ), // if not online, apply `gray style` to the user avatar, `grayscale` not support `IE 10+`
            
            src: user.user_avatar,
            user_uuid: user.user_uuid } ) );

        if ( isOnline ) {
            if ( user.is_mobile_online ) {
                container.add( new View.Img( { className: 'pp-state pp-active', src: mobileOnlineIcon } ) );    
            } else if ( user.is_mobile_online ) {
                // add pc online icon
            }
        }

        return container;
    }

    function buildName( user ) {
        return new View.Div( {
            className: 'name'
        } ).text( user.user_fullname );
    }

    function imgSelector( user ) {
        return groupMembersSelector + ' img[user_uuid=' + user.user_uuid + ']';
    }
    
} )();

View.$groupMemberHovercard = (function() {

    var globalSelector = '.pp-container',
        parentSelector = '#pp-conversation-container',
        hovercardClassName = 'group-member-hovercard',
        elSelector = globalSelector + ' .' + hovercardClassName,
        textareaElSelector = elSelector + ' textarea',
        bodyElSelector = elSelector + ' .body',
        textareaContainerElSelector = elSelector + ' .textarea-container',

        HOVERCARD_HEIGHT = 156, // default hovercard height
        HOVERCARD_TOP_OFFSET = 60, // height of `img`

        mouseover = false; // mouse `over` or `leave` on current hovercard ? 

    /////// API ////////////
    
    return {
        show: show,
        remove: remove,
        isShow: isShow,
        isMouseover: isMouseover
    }

    // @param user:
    // {
    //     user_fullname: xxx,
    //     user_uuid: xxx,
    //     user_signature: xxx,
    //     user_avatar: xxxxxx
    // }
    // @param config:
    // {
    //     e: `mouseevent`,
    //     el: `jQuery element`
    // }
    function show( user, config ) {

        var position = calcHovercardPosition( config );
        
        $( parentSelector ).append( build( user, position ).getHTML() );

        // bind event on show
        bindHovercardEvent( user, position );
    }

    function remove() {
        isShow() && $( elSelector ).detach();
        unbindHovercardEvent();
        mouseover = false;
    }

    function isShow() {
        return $( elSelector ).length > 0;
    }

    // GroupMemberHovercard.Views
    ////////////////////////////

    function build( memberInfo, position ) {
        
        var hoverCard = new GroupMemberHovercard( memberInfo, position );
        hoverCard
            .add( buildBody( memberInfo ) )
            .add( buildTextarea( memberInfo ) )
            .add( buildPseudoStyle( position.direction, position.arrowRight ) );

        bindHovercardEvent( memberInfo, position );

        return hoverCard;
    }

    function buildBody( memberInfo ) {
        return new View.Div({
            className: 'body'
        })
            .add( buildUserAvatar( memberInfo ) )
            .add( buildUserInfo( memberInfo ) );
    }

    function buildUserAvatar( memberInfo ) {

        var avatar = memberInfo.user_avatar;

        return new View.Div({
            className: 'img-container'
        }).add(new View.Img({
            src: avatar
        }));
        
    }

    function buildUserInfo( memberInfo ) {

        var name = memberInfo.user_fullname,
            signature = memberInfo.user_signature;

        return new View.Div({
            className: 'info'
        }).add(new View.Div({
            className: 'name'
        }).text( name ))
            .add(new View.Div({
                className: 'signature'
            }).text( signature ));
        
    }

    function buildTextarea( memberInfo ) {
        var placeHolder = Service.Constants.i18n('HOVER_CARD_TEXTAREA_HINT');

        return new View.Div({
            className: 'textarea-container'
        }).add(new View.Element('textarea', {
            placeholder: placeHolder
        }));
    }

    //GroupMemberHovercard.Views.CssStyle
    /////////////////////////////////////

    // @param direction: 'up'/'down'
    // @param right: arrow right margin, 'number' type
    function buildPseudoStyle( direction, right ) {
        var style = new View.Element('style', {
            type: 'text/css',
            className: hovercardClassName + '-style'
        });

        var arrowStyle;

        switch ( direction ) {
        case 'up':
            arrowStyle = getArrowUpStyle( right );
            break;

        case 'down':
            arrowStyle = getArrowDownStyle( right );
            break;
        }

        style.text( arrowStyle );

        return style;
    }

    function getArrowUpStyle ( right ) {
        return '.pp-container .group-member-hovercard:after, .pp-container .group-member-hovercard:before{' +
            'top: -16px;' + 
            'right: ' + right + 'px;' + 
            'border: solid transparent;content: " ";height: 0;width: 0;position: absolute;pointer-events: none;}' + 
            '.pp-container .group-member-hovercard:before {border-color: rgba(204,204,204,0);border-bottom-color: rgba(0,0,0,0.07);border-width: 9px;margin-left: -5px;top: -18px;}' + 
            '.pp-container .group-member-hovercard:after {border-color: rgba(250,250,251,0);border-bottom-color: #fff;border-width: 9px;margin-left: -6px;}';
    }

    function getArrowDownStyle ( right ) {
        return '.pp-container .group-member-hovercard:after, ' +
            '.pp-container .group-member-hovercard:before{' +
            'top:100%;' +
            'right:' + right + 'px;' +
            'border: solid transparent;content: " ";height: 0;width: 0;position: absolute;pointer-events: none;}' +
            '.pp-container .group-member-hovercard:before{' +
            'border-color: rgba(204, 204, 204, 0);' +
            'border-top-color: rgba(0, 0, 0, 0.14);border-width: 9px;margin-left: -6px;}' +
            '.pp-container .group-member-hovercard:after {border-color: rgba(250, 250, 251, 0);border-top-color: #fafafb;border-width: 8px;margin-left: -5px;right:' +
            ( right + 1 ) + 'px;' +
            '}';
    }

    //GroupMemberHovercard.Position
    ////////////////////////////////
    
    // @param `config` {
    //     e: `mouseevent`,
    //     el: `jQuery element`
    // }
    //
    // @return {
    //     direction: arrow direction
    //     top: hovercard top margin relative to the window top edge
    //     arrowRight: arrow right margin relative to the window right edge
    // }
    function calcHovercardPosition( config ) {

        var windowHeight = window.innerHeight,
            upEdgeDistance = config.el.offset().top - $( window ).scrollTop(),
            downEdgeDistance = ( windowHeight - upEdgeDistance ),
            hovercardHeight = HOVERCARD_HEIGHT,
            hovercardOffsetY = HOVERCARD_TOP_OFFSET;

        if ( downEdgeDistance - hovercardOffsetY >= hovercardHeight ) {
            return {
                direction: 'up',
                top: upEdgeDistance + hovercardOffsetY,
                arrowRight: calcArrowRight( config.e )
            };
        }

        return {
            direction: 'down',
            top: ( upEdgeDistance - hovercardHeight ),
            arrowRight: calcArrowRight( config.e )
        }
        
    }

    function calcArrowRight( mouseEvent ) {
        var IMG_WIDTH = 64,
            HALF_IMG_WIDTH = 64 / 2,

            // @see http://stackoverflow.com/questions/6073505/what-is-the-difference-between-screenx-y-clientx-y-and-pagex-y
            // `screenX` and `screenY`: Relative to the top left of the physical screen/monitor, this reference point only moves if you increase or decrease the number of monitors or the monitor resolution.
            // `clientX` and `clientY`: Relative to the upper left edge of the content area (the viewport) of the browser window. This point does not move even if the user moves a scrollbar from within the browser.
            marginRight = $( window ).width() - mouseEvent.clientX - IMG_WIDTH,
            fix = HALF_IMG_WIDTH - mouseEvent.offsetX;

        // number `5` is a magic number that let `hovercard` a little closer from right
        return marginRight - fix - 5;
    }

    //GroupMemberHovercard.Event
    ////////////////////////////
    function bindHovercardEvent( memberInfo, position ) {

        $( textareaElSelector )
            .on( 'focus', function( e ) {
                // `onMemberClicked` event will break the transition animation
                // so must make `onMemberClicked` triggerd after the animation transition completed
                smoothTransitionToMessagePanel( position, function() {
                    Ctrl.$groupMembers.onMemberClicked( memberInfo.user_uuid );    
                } );
            } );

        $( elSelector )
            .on( 'mouseover', function ( e ) {
                mouseover = true;                
            } )
            .on( 'mouseleave', function ( e ) {
                mouseover = false;
            } );
        
    }

    function unbindHovercardEvent() {
        $( textareaElSelector ).off( 'focus' );
        $( elSelector ).off( 'mouseover' ).off( 'mouseleave' );
    }

    function smoothTransitionToMessagePanel( position, completeCallback ) {

        var textareaHeight = 46,
            fixTextareaPaddingBottom = 18,
            textareaTargetHeight = 40,
            textareaTargetMargin = 10,
            bodyHeight = 100,
            messagePanelWidth = 368,
            duration = 300,
            sheetHeaderHeight = 50,
            windowHeight = window.innerHeight,
            hovercardTargetHeight = windowHeight - sheetHeaderHeight,
            marginTop = ( $( elSelector ).offset().top - sheetHeaderHeight - $( window ).scrollTop() ) +
            ( windowHeight - ( $( textareaElSelector ).offset().top - $( window ).scrollTop() ) ) -
            ( bodyHeight - textareaHeight ) -
            fixTextareaPaddingBottom;

        $( elSelector )
            .animate( {
                width: messagePanelWidth,
                height: hovercardTargetHeight,
                left: 0,
                top: sheetHeaderHeight
            }, duration );

        $( bodyElSelector )
            .animate( {
                opacity: .0
            }, duration );

        $( textareaElSelector )
            .animate( {
                height: textareaTargetHeight
            } );

        $( textareaContainerElSelector )
            .animate( {
                height: textareaTargetHeight,
                'margin-top': marginTop,
                'margin-left': textareaTargetMargin,
                'margin-right': textareaTargetMargin
            }, duration, function () {

                View.$groupMembers.opacity( .0 );
                
                $( elSelector ).animate( {
                    opacity: .0
                }, duration, function () {
                    
                    Ctrl.$groupMembers.hide( false );
                    View.$composerContainer.focus();

                    $onResult( undefined, completeCallback );
                    
                });
                
            });

    }

    function isMouseover() {
        return mouseover;
    }

    //GroupMemberHovercard
    ////////////////////////
    function GroupMemberHovercard( memberInfo, position ) {
        View.Div.call(this, {
            className: hovercardClassName,
            style: 'top:' + position.top + 'px'
        });
    }
    extend( GroupMemberHovercard, View.Div );
    
})();

View.$loading = (function() {

    /**
     * @constructor
     */
    function PPLoading() {
        var PPDiv = View.PPDiv;
        
        PPDiv.call(this, {
            id: id,
            'class': id + ' pp-box-sizing'
        });

        this
            .add(new PPDiv({
                id: 'pp-loading-spinner',
                style: 'background-image:url(' + Configuration.assets_path + 'img/spinner.png)'
            }))
            .add( new View.P( { className: 'pp-loading-text' } ) );

    }
    extend(PPLoading, View.PPDiv);

    var id = 'pp-loading',
        elSelector = '#' + id,
        textSelector = '.pp-loading-text',

        show = function() {
            $(elSelector).fadeIn();
        },

        hide = function() {
            $(elSelector).fadeOut();
            $( textSelector ).hide().text( '' );
        },

        text = function( text ) {
            text && $( textSelector ).show().text( text );
        },

        build = function() {
            return new PPLoading();
        };

    return {
        build: build,

        show: show,
        hide: hide,
        text: text
    }
    
})();

View.$launcher = (function() {

    /**
     * @constructor
     */
    function PPLauncher() {
        var ctrl = Ctrl.$launcher.get(),
            showLauncher = ctrl.shouldShowLauncherWhenInit(),
            PPDiv = View.PPDiv;
        
        PPDiv.call(this, {
            id: 'pp-launcher',
            'class': 'pp-launcher'
        }, ctrl);
        
        var self = this;
        var launcherButtonImageCssStyle = 'background-image: url(' + Configuration.assets_path + 'img/icon-newacquire.png);' + 'background-color:' + View.Style.Color.launcher_background_color;

        var bottomMargin = ctrl.getLauncherBottomMargin(),
            rightMargin = ctrl.getLauncherRightMargin(),
            style = 'bottom:' + bottomMargin + "; right:" + rightMargin;
        
        this.add(new PPDiv({
            id: 'pp-launcher-container',
            style: style,
            event: {
                init: function() {
                    ctrl.onLauncherInit();
                }
            }
        }, ctrl)
                 .add(new PPDiv('pp-launcher-button-container')
                      .add(new PPDiv({
                          id: 'pp-launcher-button',
                          'class': 'pp-launcher-button pp-unselectable',
                          style: launcherButtonImageCssStyle,
                          event: {
                              click: function() {
                                  self.controller.onClickEvent();
                              },
                              mouseover: function() {
                                  self.controller.onMouseOverEvent();
                              },
                              mouseleave: function() {
                                  self.controller.onMouseLeaveEvent();
                              }
                          }
                      })))
                 .add(new PPDiv({
                     id: 'pp-launcher-badge',
                     'class':'pp-launcher-badge pp-font',
                     style: 'display:none'
                 }, ctrl))
                 .add(View.$launcherPreview.init().build())
                 .add(View.$hoverCard.build()))
            .show(showLauncher);
    }
    extend(PPLauncher, View.PPDiv);

    var selectorButton = '#pp-launcher-button',
        clsButtonMaximize = 'pp-launcher-button-maximize',
        clsButtonMinimize = 'pp-launcher-button-minimized',

        selectorButtonContainer = '#pp-launcher-button-container',
        clsButtonContainerActive = 'pp-launcher-button-container-active',
        clsButtonContainerInActive = 'pp-launcher-button-container-inactive',

        build = function() {
            return new PPLauncher();
        },

        hideLauncher = function() {
            $( selectorButton ).removeClass( clsButtonMaximize ).addClass( clsButtonMinimize );
            $( selectorButtonContainer ).removeClass( clsButtonContainerActive ).addClass( clsButtonContainerInActive );
        },

        showLauncher = function() {
            $( selectorButton ).removeClass( clsButtonMinimize ).addClass( clsButtonMaximize );
            $( selectorButtonContainer ).removeClass( clsButtonContainerInActive ).addClass( clsButtonContainerActive );
        },
        
        showMessageBox = function() {
            View.$launcherPreview.text( '' ).hide();
            $('#pp-messenger').show();
            View.$conversation.show();
            Ctrl.$hoverCard.get().hideHoverCardNow();
        };
    
    return {
        build: build,

        hideLauncher: hideLauncher,
        showLauncher: showLauncher,
        showMessageBox: showMessageBox
    }
    
})();

((function(View) {

    /**
     * @constructor
     */
    function PPContainer() {
        var PPDiv = View.PPDiv;
        PPDiv.call(this, {
            id: 'pp-container',
            'class': 'pp-container pp-box-sizing pp-location'
        });

        this.add(new View.CssStyle())
            .add(View.$launcher.build())
            .add(new View.PPMessenger());
    }
    extend(PPContainer, View.PPDiv);

    View.PPContainer = PPContainer;
    
})(View));

View.$launcherPreview = (function() {

    var id = 'pp-launcher-preview',
        closeElId = 'pp-launcher-preview-close',
        previewBodyElId = 'pp-launcher-preview-outer-2',
        
        selector = '#' + id,
        previewTextEl = 'pp-launcher-preview-p',
        previewTextElCls = '.' + previewTextEl,

        self = {
            build: build,
            init: init,

            show: show,
            hide: hide,
            text: text    
        };

    ///////// API ////////////////
    
    return self;

    /////// Implementation ///////

    function init() {
        // on message arrived
        Service.$pubsub.subscribe( 'msgArrived/launcher', function( topics, ppMessage ) {
            if ( !Service.$device.inMobile() ) {
                self.show().text( ppMessage.getMessageSummary() );
            }
        });
        return self;
    }

    function build() {
        return new PPLauncherPreview();
    }

    function show() {
        $( selector ).show();
        return self;
    }

    function hide() {
        $( selector ).hide();
        return self;
    }

    function text(text) {
        $( previewTextElCls ).text(text);
        return self;
    }

    /**
     * @constructor
     */
    function PPLauncherPreview() {
        var PPDiv = View.Div;
        
        PPDiv.call(this, { id: id, style: 'display:none' } );

        this.add(new PPDiv('pp-launcher-preview-outer')
                 .add(new PPDiv({ id: previewBodyElId })
                      .add(new PPDiv('pp-launcher-preview-outer-3')
                           .add(new PPDiv({
                               id: closeElId,
                               style: 'background-image:url(' + Configuration.assets_path + 'img/icon-preview-close.png)'
                           }))
                           .add(new PPDiv('pp-launcher-preview-p-outer')
                                .add(new View.Span({
                                    className: previewTextEl
                                })))))
                 .add(new PPDiv('pp-launcher-preview-triangle')));

        // Build Event
        $timeout( buildEvent );

        function buildEvent() {

            var $close = $('#' + closeElId),
                $previewBody = $('#' + previewBodyElId);
            
            $previewBody
                .bind('mouseover', function() {
                    $close.show();
                })
                .bind('mouseleave', function() {
                    $close.hide();
                });

            $close
                .bind('click', function() {
                    hide();
                });
            
        }
    }
    extend(PPLauncherPreview, View.PPDiv);
    
})();

((function(View) {

    /**
     * @constructor
     */
    function PPMessenger() {
        View.PPDiv.call(this, {
            id: 'pp-messenger',
            style: 'display:none'
        }, null);

        this.add(new View.PPDiv('pp-messenger-box-container')
                 .add(View.$conversation.build()));
    }
    extend(PPMessenger, View.PPDiv);

    View.PPMessenger = PPMessenger;
    
})(View));

View.$poweredBy = ((function() {

    var id = 'pp-powered-by',
        elSelector = '#' + id;
    
    return {
        build: build,
        bindEvent: bindEvent
    }

    function build() {
        return new PPPoweredBy();
    }

    function bindEvent() {
        $( elSelector ).on( 'click', function() {
            Ctrl.$emojiSelector.get().showSelector(false);
            Ctrl.$groupMembers.hide();
        } );
    }

    /**
     * @constructor
     */
    function PPPoweredBy() {
        View.PPDiv.call( this, { id: id } );

        var ppMessage = Service.Constants.i18n('PPMESSAGE');
        var poweredBy = "Powered by <u class=\"pp-font\">" + ppMessage + "</u>";
        
        this.add(new View.PPElement('a', {
            href: Configuration.portal,
            target: '_blank'
        })
                 .add(new View.Span( {
                     'class': 'pp-powered-by-span pp-font'
                 })
                      .html(poweredBy)));
    }
    extend(PPPoweredBy, View.PPDiv);
    
} )());

View.$conversation = (function() {

    var id = 'pp-conversation',
        selector = '#' + id,

        clsMaximize = 'pp-conversation-content-maximize',
        clsMinimize = 'pp-conversation-sheet-minimized';

    return {
        
        build: function() {
            return new PPConversation();
        },

        show: function() {
            $( selector ).removeClass( clsMinimize ).addClass( clsMaximize );
        },

        hide: function() {
            $( selector ).removeClass( clsMaximize ).addClass( clsMinimize );
        }
        
    }

    /**
     * @constructor
     */
    function PPConversation() {
        View.PPDiv.call(this, {
            id: id,
            style: 'background-color:' + View.Style.Color.base,
            'class': 'pp-messenger-panel pp-box-sizing'
        });
        
        this.add(View.$sheetHeader.build())
            .add(View.$groupContent.build())
            .add(View.$conversationContentContainer.build())
            .add(View.$loading.build());
    }
    extend(PPConversation, View.PPDiv);
    
})();

//autoExpandHeight-TextArea
//see-->http://codepen.io/vsync/pen/frudD
View.$composerContainer = (function() {

    /**
     * @constructor
     */
    function PPComposerContainer() {
        var ctrl = Ctrl.$composerContainer.get();
        View.PPDiv.call(this, {
            id: containerId,
            style: 'background-color:' + View.Style.Color.base,
            'class': containerId + ' pp-box-sizing-borderbox pp-font'
        }, ctrl);
        
        var self = this;
        
        this.add(self.getUploadingWarningHtml(ctrl))
            .add(self.getComposerEmojiContainerHtml(ctrl))
            .add(new View.PPDiv({id: 'pp-composer'})
                 .add(self.getComposerSendButtonContainer(ctrl))
                 .add(self.getComposerFormContainerHtml(ctrl)))
            .add(View.$poweredBy.build());
        
        $timeout( View.$poweredBy.bindEvent );
        
        this.calcInputTextAreaRows();
    }
    extend(PPComposerContainer, View.PPDiv);

    /**
     * Uploading warning html code
     */
    PPComposerContainer.prototype.getUploadingWarningHtml = function(ctrl) {
        return new View.PPDiv('pp-composer-container-warning')
            .add(new View.PPElement('span', {
                id: 'pp-composer-container-warning-span',
                'class': 'pp-composer-container-warning-span pp-font'
            }))
            .show(false);
    };

    /**
     * emoji container html code
     */
    PPComposerContainer.prototype.getComposerEmojiContainerHtml = function(ctrl) {
        var container = new View.PPDiv({style: 'position: relative'});
        
        container.add(new View.$emojiSelector.build());
        container.add(new View.PPDiv({
            'class': 'pp-emoji-selector-sibling',
            id: 'pp-emoji-selector-sibling',
            event: {
                click: function() {
                    ctrl.onEmojiSelectorSiblingClicked();
                },
                init: function() {
                    $('#pp-emoji-selector-sibling').css('display', 'none');
                }
            }
        }, ctrl));

        return container;
        
    };

    /**
     * form container html code
     */
    PPComposerContainer.prototype.getComposerFormContainerHtml = function(ctrl) {

        var container = new View.PPDiv({
            style: "position: relative; overflow: hidden;"
        }),

            inMobile = Service.$device.isMobileBrowser(),

            self = this,
            
            form = new View.PPElement('form', {
                id: "pp-composer-container-form",
                name: "pp-composer-container-form",
                enctype: "multipart/form-data",
                target: "pp-composer-uploadframe",
                method: "post"
            }),

            placeHolder = Service.Constants.i18n(inMobile ? 'START_CONVERSATION_MOBILE_HINT' : 'START_CONVERSATION_HINT'),

            textareaClass = 'pp-composer-container-textarea pp-box-sizing-borderbox pp-font';
        
        if (Service.$device.isIE()) {
            textareaClass += ' pp-composer-container-textarea-min-height';
        }
        form.add(new View.PPElement('textarea', {
            id: inputID,
            'class': textareaClass,
            'data-min-rows': 1,
            placeholder: placeHolder,
            style: ctrl.getTextareaPaddingStyle(),
            rows: 1,
            event: {
                keydown: function(event) {
                    ctrl.onChatTextareaKeyDown(event);
                },
                focus: function() {
                    ctrl.onChatTextareaFocus();
                },
                blur: function() {
                    ctrl.onTextareaFocusOut();
                },
                init: function() {
                    ctrl.onTextareaInit();
                },
                'input propertychange': function() {
                    ctrl.onTextareaChange();
                }
            }
        }, ctrl));
        form.add(new View.PPElement('input', {
            id: 'pp-composer-container-content-txt',
            name: 'content_txt',
            type: 'hidden'
        }));
        form.add(new View.PPElement('input', {
            name: 'upload_type',
            type: 'hidden',
            value: 'content_txt'
        }));
        form.add(new View.PPElement('iframe', {
            id: 'pp-composer-uploadframe',
            name: "pp-composer-uploadframe",
            style: 'display:none'
        }));

        form.add(self.getComposerToolsContainerHtml(ctrl));

        container.add(form);

        return container;
    };

    /**
     * composer tools container html code
     */
    PPComposerContainer.prototype.getComposerToolsContainerHtml = function(ctrl) {
        var container = new View.PPDiv('pp-composer-container-tools-container');

        var emojiIconCssUrl = 'background-image: url(' + Configuration.assets_path + 'img/icon-emoji.png)';
        container.add(new View.PPElement('strong', {
            id: 'pp-composer-container-emoji-btn',
            'class': 'pp-composer-container-action-btn pp-composer-container-emoji-btn pp-box-sizing',
            style: ctrl.isShowEmojiIcon() ? 'display:block;' + emojiIconCssUrl : 'display:none',
            event: {
                click: function() {
                    ctrl.onEmojiSelectorBtnClicked();
                },
                mouseover: function() {
                    ctrl.onEmojiSelectorBtnMouseOver();
                },
                mouseleave: function() {
                    ctrl.onEmojiSelectorBtnMouseLeave();
                }
            }
        }));

        var fileSelectorIconCssUrl = 'background-image: url(' + Configuration.assets_path + 'img/icon-upload.png)';
        container.add(new View.PPElement('strong', {
            id: 'pp-composer-container-file-selector',
            'class': 'pp-composer-container-action-btn pp-box-sizing',
            style: fileSelectorIconCssUrl,
            event: {
                click: function() {
                    ctrl.onFileSelectorBtnClicked();
                },
                mouseover: function() {
                    ctrl.onFileSelectorBtnMouseOver();
                },
                mouseleave: function() {
                    ctrl.onFileSelectorBtnMouseLeave();
                }
            }
        }, ctrl));
        
        container.add(new View.PPElement('input', {
            id: 'pp-composer-container-input',
            type: 'file',
            event: {
                change: function(file) {
                    ctrl.onFileSelect(file);
                }
            }
        }, ctrl));
        
        return container;
    };

    /**
     * composer send button container html code
     *
     * Used for Android, iOS ... Mobile Devices
     */
    PPComposerContainer.prototype.getComposerSendButtonContainer = function(ctrl) {
        var show = ctrl.isSendButtonShow(),
            sendText = Service.Constants.i18n('SEND');

        return new View.PPDiv({
            id: 'pp-composer-send-button',
            'class': 'pp-composer-send-button pp-unselectable',
            style: 'display:' + (show ? 'block' : 'none'),
            event: {
                mousedown: function(e) {
                    ctrl.onSendButtonMouseDown(e);
                },
                init: function() {
                    ctrl.onSendButtonInit();
                }
            }
        })
            .add(new View.PPElement('p', {
                style: 'padding-top: 7.5px;',
                'class': 'pp-p-no-margin'
            }).text(sendText));
    };

    /**
     * Calculate textarea initial rows
     */
    PPComposerContainer.prototype.calcInputTextAreaRows = function() {
        $(document)
            .one('focus.textarea', inputSelector, function() {
                var savedValue = this.value;
                this.value = '';
                baseScrollHeight = this.scrollHeight || this[0].scrollHeight;
                this.value = savedValue;
                minRows = this.rows;
            })
            .on('input.textarea', inputSelector, function() {
                onTyping();
                fixInputRows();
            });
    };

    var containerId = 'pp-composer-container',
        inputID = 'pp-composer-container-textarea',
        inputSelector = '#' + inputID,
        
        minRows, // input min rows
        baseScrollHeight, // input initial height

        getSingleRowHeight = function() {
            return Service.$device.inMobile() ? 28 : Service.$device.isIE() ? 17 : 23; // how height single row
        },
        
        fixInputRows = function() {
            var _minRows = 1;
            var _baseScrollHeight = baseScrollHeight;
            var _e = jQuery(inputSelector)[0];
            var _rowHeight = getSingleRowHeight();

            //in IE, if set _e.rows = 0, will throw Error ("Invalid Value");
            if (_e && _e.rows && _e.scrollHeight) {
                _e.rows = _minRows;
                _e.rows = _minRows + Math.ceil((_e.scrollHeight - _baseScrollHeight) / _rowHeight);
            }
        },

        onTyping = function () {
            // every 2 seconds, only send once `typing` info to server
            Service.$schedule.once ( Service.$notifyTyping.get( Service.$notification ).typing, 'typing', 2 * 1000 );
        };

    return {
        
        build: function() { // build a PPComposerContainer
            return new PPComposerContainer();
        },

        fixInputRows: function() {
            fixInputRows();
            View.$emojiSelector.changeBottomMarginByInputHeight($(inputSelector).height());
        },

        focus: function() {
            $(inputSelector).focus();
        },

        blur: function() {
            $(inputSelector).blur();
        }
        
    }
    
})();

View.$conversationContent = (function() {

    /**
     * @constructor
     */
    function PPConversationContent(items) {
        var ctrl = Ctrl.$conversationContent.init();
        View.PPDiv.call(this, {
            id: id,
            'class': id + ' pp-unselectable pp-box-sizing-borderbox',
            style: 'background-color:' + View.Style.Color.base,
            event: {
                click: function() {
                    ctrl.onConversationContentClicked();
                },
                init: function() {
                    ctrl.onConversationContentInit();
                }
            }
        }, ctrl);
        if (items && items.length > 0) {
            for (var i=0; i<items.length; ++i) {
                this.add(new View.PPConversationPart(items[i]));
            }
        }
    }
    extend(PPConversationContent, View.PPDiv);

    var id = 'pp-conversation-content',
        selector = '#' + id;

    return {
        
        build: function(items) {
            return new PPConversationContent(items);
        },

        scrollToBottom: function() { //scroll to bottom
            $(selector).stop().animate({
                scrollTop: $(selector)[0].scrollHeight
            }, 600, 'swing');
            // $(selector).scrollTop($(selector)[0].scrollHeight);
        },

        html: function($el) {
            $(selector).html($el);
        },

        append: function(html) {
            $(selector).append(html);
        },

        show: function(fadeIn) {
            if (fadeIn) $(selector).show();
            else $(selector).fadeIn();
        }
    }
    
})();

View.$conversationContentContainer = (function() {

    var id = 'pp-conversation-container',
        selector = '.' + id,

        hide = function() {
            $(selector).hide();
        },

        show = function(fadeIn) {
            if (fadeIn) {
                $(selector).show();    
            } else {
                $(selector).fadeIn();    
            }
        },

        visible = function() {
            return $(selector).is(':visible');
        },

        build = function() {
            return new View.PPDiv(id)
                .add(View.$conversationContent.build())
                .add(View.$composerContainer.build());
        };
    
    return {
        hide: hide,
        show: show,
        visible: visible,

        build: build
    }
    
})();

((function(View) {

    /**
     * @constructor
     */
    function PPUploadingBar(item) {
        var ctrl = new Ctrl.PPUploadingBarCtrl();

        var id = "";
        switch(item.messageType) {
        case 'FILE':
            id = item.message.file.fileUploadId;
            break;

        case 'IMAGE':
            id = item.message.image.fileUploadId;
            break;
        }
        
        View.PPElement.call(this, 'span', {
            id: 'pp-uploading-bar-outer-' + id,
            'class': 'pp-uploading-bar-outer pp-font'
        }, ctrl);

        this.text(Service.Constants.i18n('UPLOADING_HINT'));
        
        this.add(new View.PPDiv({
            id: 'pp-uploading-bar-' + id,
            'class': 'pp-uploading-bar'
        })
                 .add(new View.PPDiv({
                     id: 'pp-uploading-bar-state-' + id,
                     'class': 'pp-uploading-bar-state'
                 })))
            .add(new View.PPElement('span', {
                id: 'pp-uploading-bar-remove-' + id,
                'class': 'pp-uploading-bar-remove',
                style: 'background-image:url(' + Configuration.assets_path + 'img/icon-upload-remove.png)',
                event: {
                    click: function() {
                        ctrl.onUploadingBarRemoveBtnClicked(id, item);
                    }
                }
            }));

        setTimeout(function() {
            ctrl.init(item, id);
        });
    }
    extend(PPUploadingBar, View.PPElement);

    View.PPUploadingBar = PPUploadingBar;
    
})(View));

/**
 * 鼠标放到小图标上面，弹出的卡片
 */
View.$hoverCard = (function() {

    // View
    function HoverCard() {
        var controller = Ctrl.$hoverCard.get();
        
        View.PPDiv.call(this, { //parent-container
            'class': 'pp-launcher-hovercard',
            id: 'pp-launcher-hovercard',
            style: 'display:none; transform-origin: 315px 100% 0px; transform: translate(0px 0px) scale(0.8, 0.8); opacity:0;',
            event: {
                mouseover: function() {
                    controller.onMouseOver();
                },
                mouseleave: function() {
                    controller.onMouseLeave();
                },
                click: function() {
                    controller.onHoverCardClicked();
                },
                init: function() {
                    controller.onHoverCardInit();
                }
            }
        }, controller);
    }
    extend(HoverCard, View.PPDiv);

    return {
        
        build: function() {
            return new HoverCard();
        },

        smoothTranisationToMessagePanel: function() {
            var duration = 300,
                windowHeight = window.innerHeight,

                conversationSelector = '#pp-conversation',
                welcomeSelector = '#pp-launcher-hovercard-welcome',
                textareaContainerSelector = '#pp-launcher-hovercard-textarea',
                hovercardSelector = '#pp-launcher-hovercard',
                ppMessageSelector = '#pp-messenger';

            $(conversationSelector)
                .removeClass('pp-conversation-content-maximize')
                .removeClass('pp-conversation-sheet-minimized');

            $(conversationSelector).css({boxShadow: "none"});
            
            $(welcomeSelector)
                .animate({ opacity: 0, marginBottom: "+=100"}, {duration: 100});

            $(textareaContainerSelector)
                .animate({paddingBottom: '31'}, {duration: duration});
            
            $(hovercardSelector)
                .css({ border: "none", borderLeft: "1px solid #dadee2"})
                .animate({ width: 368, paddingTop: windowHeight, borderRadius: 0, right: -20, bottom: -19}, {duration: duration});
            
            $(ppMessageSelector)
                .css({ opacity: 0.0, display: 'block'})
                .delay(duration)
                .animate({ opacity: 1.0}, {duration: 0, complete: function() {
                    $(welcomeSelector).removeAttr('style');
                    $(textareaContainerSelector).removeAttr('style');
                    $(hovercardSelector).removeAttr('style').hide();
                    $(ppMessageSelector).removeAttr('style');
                    $(conversationSelector).css({boxShadow: ""});
                }});
        }
    }
    
})();

((function(View) {

    View.$hoverCardContentCategorySingle = (function() {

        /**
         * build self
         */
        var updateHoverCard = function(appProfile) {
            var controller = Ctrl.$hoverCard.get(),
                hoverCardSelector = '#pp-launcher-hovercard',
                $container = $( hoverCardSelector );

            controller.updateInitState(true);

            $container
                .empty()
                .css('cursor', 'pointer')
                .append(getHoverCardCloseButtonHtml(controller).getElement()[0].outerHTML)
                .append(new View.PPDiv('pp-launcher-hovercard-welcome')
                        .add(getHoverCardAdminsHtml(appProfile.activeAdmins))
                        .add(getHoverCardWelcomeTextHtml(appProfile.appTeamName, appProfile.appWelcomeText))
                        .getElement()[0].outerHTML)
                .append(getHoverCardTextAreaHtml(controller).getElement()[0].outerHTML);
        },

            getHoverCardCloseButtonHtml = function(controller) { // close button

                var className = 'pp-launcher-hovercard-close',
                    backgroundImg = 'background-image: url(' + Configuration.assets_path + 'img/icon-close-white.png)',
                    backgroundColor = 'background-color: ' + View.Style.Color.hovercard_close_btn,
                    show = controller.isShowCloseButton() ? 'display:block' : 'display:none',
                    closeBtnName = Service.Constants.i18n('CLOSE');
                
                return new View.PPDiv({
                    'class': className + ' pp-font',
                    selector: '.' + className,
                    style: backgroundImg + ';' + backgroundColor + ';' + show,
                    event: {
                        click: function(e) {
                            controller.onHovercardCloseButtonClickEvent(e);
                        }
                    }
                }).text(closeBtnName);
            },

            /**
             * Get hoverCard welcome text 
             */
            getHoverCardWelcomeTextHtml = function(appTeamName, appWelcomeText) {
                return new View.PPDiv('pp-launcher-hovercard-text')
                    .add(new View.PPDiv('pp-launcher-hovercard-app-name').text(appTeamName)) // App Name
                    .add(new View.PPDiv('pp-launcher-hovercard-welcome-text').text(appWelcomeText));
            },

            /**
             * Get hoverCard textarea
             */
            getHoverCardTextAreaHtml = function(controller) {
                var placeHolder = Service.Constants.i18n('HOVER_CARD_TEXTAREA_HINT');
                return new View.PPDiv({
                    id: 'pp-launcher-hovercard-textarea',
                    className: 'pp-launcher-hovercard-textarea pp-box-sizing'
                })  // child-2
                    .add(new View.PPElement('textarea', {
                        placeholder: placeHolder,
                        id: 'pp-launcher-hovercard-textarea-textarea',
                        className: 'pp-launcher-hovercard-textarea-textarea pp-box-sizing-borderbox',
                        event: {
                            focus: function() {
                                controller.onTextareaFocus();
                            },
                            blur: function() {
                                controller.onTextareaUnFocus();
                            }
                        }
                    }));
            },

            /**
             * Server avatar
             */
            getHoverCardAdminsHtml = function(activeAdmins) {
                var container = new View.PPDiv('pp-launcher-hovercard-admins');
                var maxZIndex = 2147483003; //z-index
                var imgWidth = getHoverCardAdminAvatarWidth(activeAdmins);
                var imgStyle = 'width:' + imgWidth + '; height:' + imgWidth;
                var maxCount = 3;
                
                activeAdmins && $.each(activeAdmins, function(index, item) {
                    if (index < maxCount) {
                        container.add(new View.PPDiv({
                            'class': 'pp-launcher-admin-avatar',
                            style: 'z-index:' + (maxZIndex--),
                            user_uuid: item.user_uuid
                        })
                                      .add(new View.PPElement('img', {
                                          src: item.user_avatar,
                                          style: imgStyle
                                      })));
                    }
                });
                return container;
            },

            /**
             * Server avatar width
             */
            getHoverCardAdminAvatarWidth = function(activeAdmins) {
                var imgWidth = '46px';
                if (activeAdmins) {
                    var len = activeAdmins.length;
                    switch (len) {
                    case 1:
                        imgWidth = '84px';
                        break;

                    case 2:
                        imgWidth = '56px';
                        break;

                    default:
                        imgWidth = '46px';
                    }
                }
                return imgWidth;
            };

        return {
            updateHoverCard: updateHoverCard,
            updateUsers: updateUsers  
        }

        function updateUsers( users ) {

            users = users || [];
            $( '#' + 'pp-launcher-hovercard-admins' )
                .empty()
                .append( getHoverCardAdminsHtml( users ).getHTML() );
            
        }
        
    })();

    
})(View));

/**
 *
 * zoom-in `small-image` to `big-image` in a half-transparent window
 *
 * [Use]:
 * View.$imageViewer.show(jQuery(`The image that you want to zoom-in`));
 *
 */
View.$imageViewer = (function() {

    // Html code
    function ImageViewer(imgSrc, imgStyle) {
        View.PPDiv.call(this, {
            'class': 'pp-image-viewer'
        });
        
        this.add(new View.PPDiv({ 'class': 'pp-image-viewer-overlay' }))
            .add(new View.PPElement('img', {'class':'pp-zoomed-image', src: imgSrc, style: imgStyle}));
        
    }
    extend(ImageViewer, View.PPDiv);

    var viewerOverlay = '.pp-image-viewer-overlay', // jQuery element selectors
        containerSelector = '#pp-container',
        imageViewerSelector = '.pp-image-viewer',
        imgSelector = '.pp-image-viewer img',

        padding = 20, // zoomed image padding to body

        $scaleImage, // the image which you want to zoom-in
        smallImageAttrs, // contains small image's size and position info
        bigImageAttrs, // contains big image's size and position info

        initialImageStyle, // the initial style that will apply to image

        prepareToShowImageViewer = function($image) { // prepare show image
            $scaleImage = $image;

            // calc big image and small image size and position info
            calcSmallImageAttrs($scaleImage);
            calcBigImageAttrs(window.innerWidth, window.innerHeight, $scaleImage);

            // initial image style
            initialImageStyle = 'width:' + smallImageAttrs.width + 'px;' +
                'height:' + smallImageAttrs.height + 'px;' +
                'left:' + smallImageAttrs.left + 'px;' +
                'top:' + smallImageAttrs.top + 'px';
        },

        onImageViewerShow = function() { // on big image show callback

            // listen browser resize event
            $(window).on('resize.pp-image-viewer', onResize);

            // bind click event
            $(viewerOverlay).bind('click', onClick);
            $(imageViewerSelector + ' img').bind('click', onClick);

            // bind keyup event
            $(document).on('keyup.pp-image-viewer', onKeyUp);
        },

        onImageViewerClose = function() { // on big image hide

            // off keyup event
            $(document).off('keyup.pp-image-viewer');

            // off browser resize event
            $(window).on('resize.pp-image-viewer');
        },

        calcSmallImageAttrs = function($smallImage) { // calculate small image `width`,`height`,`left`,`top`                
            smallImageAttrs = {
                width: $smallImage.width(), // size info
                height: $smallImage.height(),
                left: $smallImage.offset().left - $(document).scrollLeft(), // position info
                top: $smallImage.offset().top - $(document).scrollTop()
            };
        },

        calcBigImageAttrs = function(windowWidth, windowHeight, $bigImage) { // calculate big image info
            var image = $bigImage[0],
                targetWidth = windowWidth - 2 * padding,
                targetHeight = windowHeight - 2 * padding,
                scale = Math.min(targetWidth / image.naturalWidth,
                                 targetHeight / image.naturalHeight); // zoom-in or zoom-out

            scale > 1 && (scale = 1); // scale <= 1

            var width = image.naturalWidth * scale,
                height = image.naturalHeight * scale,
                left = windowWidth / 2 - width / 2,
                top = windowHeight / 2 - height / 2;

            bigImageAttrs = {
                width: width, // size info
                height: height,
                left: left, // position info
                top: top
            };
        },

        show = function($image) { // show

            prepareToShowImageViewer($image);

            // append html to dom
            $(containerSelector).append (
                new ImageViewer($image[0].src, initialImageStyle).getElement()[0].outerHTML); // generate html code

            // after show
            onImageViewerShow();

            // animate small image --> big image
            $(imgSelector).animate(
                bigImageAttrs, {
                    duration: 100,
                    queue: false,
                    easing: 'easeInQuart'
                });

            // animation image overlay opacity 0 -> .8
            $(viewerOverlay).animate({
                opacity: .8,
                queue: false,
                easing: 'easeInQuart'
            }, 200);
            
            return this;
        },

        remove = function() { // remove self
            $(imageViewerSelector).remove();
        },

        resize = function(windowWidth, windowHeight) { // re caculate image's size and position
            calcBigImageAttrs(windowWidth, windowHeight, $scaleImage);
            $(imgSelector).css(bigImageAttrs);
        },

        close = function() { // close 

            calcSmallImageAttrs($scaleImage);

            // animate big image --> small image
            $(imgSelector)
                .animate(smallImageAttrs, {
                    queue: false,
                    duration: 200
                });

            // animate opacity .8 --> 0
            $(viewerOverlay)
                .animate({ opacity: 0 }, {
                    queue: false,
                    duration: 500
                });

            // waiting 700ms then remove image-viewer
            // `remove()` event can not add to `$.animate([complete])` callback,
            // it seems like that jQuery duration not so accurate,
            // so just set a more bigger duration to wait to remove it
            setTimeout(function() {
                remove();
            }, 700);

            // unbind event
            onImageViewerClose();
        },

        onClick = function() { // onClick Event
            close();
        },

        onKeyUp = function(e) { // on `Esc` Key pressed
            27 === e.keyCode && close(); // Esc
        },

        onResize = function(e) { // on browser size changed
            resize(window.innerWidth, window.innerHeight);
        };

    return {
        show: show
    }
    
})();

/**
 * 团队欢迎界面
 */
((function(View) {
    /**
     * item: 消息结构体
     */
    function AppProfileContainer(item) {
        var controller = new Ctrl.AppProfileContainerCtrl(item),
            self = this;
        
        View.PPDiv.call(this, 'pp-app-profile-container', controller);

        var appTeamName = controller.getAppTeamName();
        var appWelcomeText = controller.getWelcomeText();
        var activeAdmins = controller.getActiveAdmins();
        
        this.add(new View.PPDiv('pp-app-profile')
                 
                 .add(new View.PPDiv('pp-app-profile-activity')
                      .add(new View.PPDiv({
                          id: 'pp-app-profile-team',
                          'class': 'pp-app-profile-team pp-font pp-selectable'
                      }).text(appTeamName)))
                 
                 .add(self.appendActiveAdminsHtmlElements(activeAdmins))
                 
                 .add(new View.PPDiv({
                     id: 'pp-app-profile-text',
                     'class': 'pp-app-profile-text pp-font pp-selectable'
                 })
                      .add(new View.PPElement('p')
                           .text(appWelcomeText)))
                );
    }
    extend(AppProfileContainer, View.PPDiv);

    AppProfileContainer.prototype.appendActiveAdminsHtmlElements = function(activeAdmins) {
        var container = new View.PPDiv('pp-active-admins');
        activeAdmins && $.each(activeAdmins, function(index, item) {

            // if `item.user_uuid` is store in `Service.$users`,
            // then we try to get the user's info from `Service.$users`,
            // because user's info in `Service.$users` is always fresh.
            item = Service.$users.getUser( item.user_uuid ) &&
                Service.$users.getUser( item.user_uuid ).getInfo();
            
            container.add(new View.AppProfileContainerActiveAdmin( item )); 
        });
        return container;
    };

    View.AppProfileContainer = AppProfileContainer;
    
})(View));

/**
 * Single Active Admin
 */
((function(View) {

    function AppProfileContainerActiveAdmin(activeAdmin) {
        View.PPDiv.call(this, {
            'class': 'pp-active-admin',
            user_uuid: activeAdmin.user_uuid
        });

        var isOnline = activeAdmin.is_online,
            stateClass = 'state ' + ( isOnline ? 'online' : 'offline' ),

            getStateDesc = function(isOnline) {
                return '[' + ( isOnline ? Service.Constants.i18n('ONLINE') : Service.Constants.i18n('OFFLINE') ) + ']';
            },
            
            stateDesc = getStateDesc(isOnline);

        this.add(new View.PPDiv('pp-admin-avatar')
                 .add(new View.PPElement('img', {
                     src: activeAdmin.user_avatar
                 })))
            .add(new View.PPDiv({'class': 'pp-active-admin-name pp-font pp-selectable'})
                 .text(activeAdmin.user_fullname))
            .add(new View.PPDiv({
                'class': stateClass + ' pp-font'
            }).text(stateDesc));

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // TODO Because `AppProfileContainerActiveAdmin` destroy and recreate when open a new group item,
        // we should `unsubscribe` to avoid memory leak here
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        // Listen for user infochange event
        Service.$pubsub.subscribe('user/infochange/' + activeAdmin.user_uuid, function (topics, user) {

            var userInfo = user.getInfo(),
                
                $adminElement = $('#pp-active-admins').
                find('div[user_uuid=' + activeAdmin.user_uuid + ']'); // admin div

            // Change admin user name and icon
            if ($adminElement.length) {
                $adminElement.find('img').attr('src', userInfo.user_avatar);
                $adminElement.find('.pp-active-admin-name').text(userInfo.user_fullname);
            }
            
        });

        // Listen for user state change envent
        Service.$pubsub.subscribe('user/infochange/state/' + activeAdmin.user_uuid, function (topics, user) {

            var userInfo = user.getInfo(),
                
                $adminElement = $('#pp-active-admins').
                find('div[user_uuid=' + activeAdmin.user_uuid + ']'); // admin div

            // Change admin user name and icon
            if ($adminElement.length) {

                var $e = $adminElement.find('.state');

                if (userInfo.is_online) {
                    $e.removeClass('offline').addClass('online');
                } else {
                    $e.removeClass('online').addClass('offline');
                }
                $e.text(getStateDesc(userInfo.is_online));
            }
            
        });
    }
    extend(AppProfileContainerActiveAdmin, View.PPDiv);

    View.AppProfileContainerActiveAdmin = AppProfileContainerActiveAdmin;
    
})(View));

((function(View) {

    /**
     * @constructor
     */
    function PPConversationPart(item) {
        var id = item.messageId;
        View.PPDiv.call(this, {
            id: 'pp-conversation-part-' + id,
            'class': 'pp-conversation-part'
        });

        switch(item.messageType) {
        case 'WELCOME':
            item && this.add(new View.AppProfileContainer(item));
            break;

        case 'TEXT':
            this.add((item.user.admin) ? new View.PPConversationPartTextByAdmin(item) : View.$userTextMessage.build(item));
            break;

        case 'EMOJI':
            this.add((item.user.admin) ? new View.PPConversationPartEmojiByAdmin(item) : View.$userEmojiMessage.build(item));
            break;

        case 'IMAGE':
            this.add((item.user.admin) ? View.$adminImageMessage.build(item) : View.$userImageMessage.build(item));
            break;

        case 'AUDIO':
            item.user.admin && this.add( View.$adminAudioMessage.build( item ) );
            break;

        case 'FILE':
            this.add((item.user.admin) ? new View.PPConversationPartFileByAdmin(item) : new View.PPConversationPartFileByUser(item));
            break;

        case 'TIMESTAMP':
            this.add(new View.PPConversationPartTimestamp(item));
            break;
        }
    }
    extend(PPConversationPart, View.PPDiv);

    View.PPConversationPart = PPConversationPart;
    
})(View));

View.$pulltoRefresh = (function() {

    function PulltoRefreshButton(text) {
        var ctrl = Ctrl.$pulltoRefreshController.get(),
            initialText = (text !== undefined ? text : ctrl.getLoadHistortyHintText());
        
        View.PPDiv.call(this, {
            id: id,
            'class': id + ' pp-conversation-part-center'
        });

        this.text(initialText);
    }
    extend(PulltoRefreshButton, View.PPDiv);

    var id = 'pp-conversation-part-pulltorefreshbutton',
        selector = '.' + id,

        build = function(text) {
            return new PulltoRefreshButton(text);
        },

        hide = function() {
            $(selector).hide();
        },

        show = function() {
            $(selector).show();
        },

        el = function() { // return jQuery('element');
            return $(selector);
        };

    return {
        build: build,

        hide: hide,
        show: show,

        el: el
    }
    
})();

((function(View) {

    /**
     * @constructor
     */
    function PPConversationPartEmojiByAdmin(item) {
        View.PPDiv.call(this, 'pp-conversation-part-emoji-by-admin');

        Service.$pubsub.subscribe('user/infochange/' + item.user.id, function(topics, user) {

            var selector = '#pp-conversation-part-' + item.messageId,
                userInfo = user.getInfo();

            // Change user avatar src
            $(selector)
                .find('.pp-conversation-part-emoji-by-admin-avatar')
                .attr('src', userInfo.user_avatar);

            // Change user name text
            $(selector)
                .find('.pp-conversation-part-serve-name')
                .text(userInfo.user_fullname);
            
        });

        this.add(new View.PPDiv('pp-conversation-part-emoji-by-admin-outer')
                 .add(new View.PPElement('img', {
                     src: item.user.avatar,
                     id: 'pp-conversation-part-emoji-by-admin-avatar'
                 }))
                 .add(new View.PPDiv('pp-conversation-part-emoji-by-admin-body-container')
                      .add(new View.PPDiv({
                          id: '',
                          'class': 'pp-conversation-part-serve-name pp-font'
                      }).text(item.user.name))
                      .add(new View.PPElement('span', {
                          id: 'pp-conversation-part-emoji-by-admin-body',
                          'class': 'pp-conversation-part-emoji-by-admin-body pp-selectable'
                      }).text(item.message.emoji.code))
                      .add(new View.PPElement('span', {
                          id: 'pp-conversation-part-emoji-by-admin-timestamp-' + item.messageId,
                          'class': 'pp-conversation-part-emoji-by-admin-timestamp pp-selectable pp-font'
                      }).text())));
    }
    extend(PPConversationPartEmojiByAdmin, View.PPDiv);

    View.PPConversationPartEmojiByAdmin = PPConversationPartEmojiByAdmin;
    
})(View));

View.$userEmojiMessage = ( function() {

    var prefix = 'pp-conversation-part-',
        prefixId = '#' + prefix,
        id = prefix + 'emoji-by-user',
        clsTextSelectable = 'pp-selectable';

    //////// API ////////////
    
    return {
        build: build,
        onSendFail: onSendFail
    }

    function build( item ) {
        return new PPConversationPartEmojiByUser( item );
    }

    function onSendFail( ppMessageJsonBody ) {
        
        $( prefixId + ppMessageJsonBody.messageId )
            .find( '.extra' )
            .text( ppMessageJsonBody.extra.errorDescription )
            .css( { color: 'red' } )
            .show();

    }

    /**
     * @constructor
     */
    function PPConversationPartEmojiByUser(item) {
        View.PPDiv.call(this, id);

        var error = Service.$tools.isMessageSendError(item);
        var extra = error ? item.extra.errorDescription : item.extra.description;

        this.add(new View.PPDiv({
            className: 'pp-emoji-container'
        })
                 .add(new View.PPDiv({
                     className: 'pp-emoji ' + clsTextSelectable
                 }).text(item.message.emoji.code))
                 .add(new View.PPDiv()
                      .add(new View.PPElement('span', {
                          className: 'extra ' + clsTextSelectable,
                          style: error ? 'color:red; display:block;' : 'color:#c9cbcf; display:none;'
                      })
                           .text(extra))));
    }
    extend(PPConversationPartEmojiByUser, View.PPDiv);
    
} )();

((function(View) {

    /**
     * @constructor
     */
    function PPConversationPartFileByAdmin(item) {
        View.PPDiv.call(this, 'pp-conversation-part-file-by-admin');

        var userAvatar = item.user.avatar,
            userName = item.user.name,
            userId = item.user.id,
            fileUrl = item.message.file.fileUrl,
            fileName = item.message.file.fileName,
            messageId = item.messageId,

            // 当用户信息(通常：头像或姓名)改变的时候，回调
            onAdminUserInfoChangeEvent = function(topics, user) {

                var selector = '#pp-conversation-part-' + messageId,
                    userInfo = user.getInfo();

                // Change user avatar src
                $(selector)
                    .find('.pp-conversation-part-file-by-admin-avatar')
                    .attr('src', userInfo.user_avatar);

                // Change user name text
                $(selector)
                    .find('.pp-conversation-part-serve-name')
                    .text(userInfo.user_fullname);                    
                
            };

        // subscribe 'user/infochange/xxxx-xxx-xxxx(user_uuid)' event
        Service.$pubsub.subscribe("user/infochange/" + userId, onAdminUserInfoChangeEvent);

        this.add(new View.PPDiv('pp-conversation-part-file-by-admin-outer')
                 .add(new View.PPDiv('pp-conversation-part-file-by-admin-outer-2')
                      .add(new View.PPElement('img', {
                          'class': 'pp-conversation-part-file-by-admin-avatar',
                          src: userAvatar
                      }))
                      .add(new View.PPDiv('pp-conversation-part-file-by-admin-outer-3')
                           .add(new View.PPDiv({
                               id: '',
                               'class': 'pp-conversation-part-serve-name pp-font'
                           }).text(userName))
                           .add(new View.PPDiv('pp-conversation-part-file-by-admin-outer-4')
                                .add(new View.PPDiv('pp-conversation-part-file-by-admin-outer-5')
                                     .add(new View.PPDiv({
                                         id: 'pp-conversation-part-file-by-admin-upload-icon',
                                         style: 'background-image:url(' + Configuration.assets_path + 'img/icon-upload-white.png)'
                                     }))
                                     .add(new View.PPDiv('pp-conversation-part-file-by-admin-outer-6')
                                          .add(new View.PPElement('a', {
                                              href: fileUrl,
                                              download: fileName,
                                              'class': "pp-conversation-part-file-by-admin-file-link pp-font",
                                              title: fileName
                                          })
                                               .text(fileName
                                                    ))))
                                .add(new View.PPDiv('pp-conversation-part-file-by-admin-timestamp-container')
                                     .add(new View.PPElement('span', {
                                         'class': 'pp-selectable pp-font',
                                         id: 'pp-conversation-part-file-by-admin-timestamp-' + messageId
                                     })
                                          .text()))))));
    }
    extend(PPConversationPartFileByAdmin, View.PPDiv);

    View.PPConversationPartFileByAdmin = PPConversationPartFileByAdmin;
    
})(View));

((function(View) {

    /**
     * @constructor
     */
    function PPConversationPartFileByUser(item) {
        View.PPDiv.call(this, {
            id: 'pp-conversation-part-file-by-user-' + item.messageId ,
            'class': 'pp-conversation-part-file-by-user'
        });

        var $tools = Service.$tools,
            error = $tools.isMessageSendError(item),
            extra = error ? item.extra.errorDescription : item.extra.description,
            showUploadingBar = $tools.isUploading(item),
            isIE = Service.$device.isIE();
        
        this.add(new View.PPDiv({
            id: 'pp-conversation-part-file-by-user-o-' + item.messageId,
            'class': 'pp-conversation-part-file-by-user-o'
        })
                 .add(new View.PPDiv({
                     id: 'pp-conversation-part-file-by-user-o2-' + item.messageId,
                     'class': 'pp-conversation-part-file-by-user-o2',
                     style: error ? 'opacity: 0.6' : ''
                 })
                      .add(new View.PPDiv({
                          id: 'pp-conversation-part-file-by-user-upload-icon',
                          style: 'background-image:url(' + Configuration.assets_path + 'img/icon-upload-white.png)'
                      }))
                      .add(new View.PPDiv({
                          'class': 'pp-conversation-part-file-by-user-link-container',
                          style: isIE ? 'margin-left: 0px;' : null // <- fix IE bug
                      })
                           .add(new View.PPElement('a', {
                               id: 'pp-conversation-part-file-by-user-a-' + item.messageId,
                               'class': 'pp-font',
                               title: item.message.file.fileName,
                               style: error ? 'cursor:default' : 'cursor:pointer',
                               href: item.message.file.fileServerUrl ? item.message.file.fileServerUrl : undefined
                           }).text(item.message.file.fileName
                                   // 'LongTextLongTextLongTextLongTextLongText'
                                  ))))
                 .add(new View.PPDiv({
                     id: 'pp-conversation-part-file-by-user-timestamp-' + item.messageId,
                     'class': 'pp-conversation-part-file-by-user-timestamp pp-selectable pp-font',
                     style: error ? "color:red; display:block;" : "color:#c9cbcf; display:none;"
                 })
                      .text(extra)
                      .show(error))
                 .add(new View.PPDiv({
                     'class': 'pp-fixme'
                 })
                      .add(new View.PPUploadingBar(item).show(showUploadingBar))));
    }
    extend(PPConversationPartFileByUser, View.PPDiv);

    View.PPConversationPartFileByUser = PPConversationPartFileByUser;
    
})(View));

((function(View) {

    View.$adminImageMessage = (function() {

        /**
         * @constructor
         */
        function PPConversationPartImageByAdmin(item) {
            View.PPDiv.call(this, 'pp-conversation-part-image-by-admin');

            var selector = '#pp-conversation-part-' + item.messageId + ' .pp-conversation-part-image-by-admin-img',
                
                onImageClick = function() { // 'click' event                    
                    if (isZoomable()) { // zoomable
                        View.$imageViewer.show($(selector));
                    } else { // open in a new window
                        window.open(item.message.image.url);
                    }
                },

                getImageInitialStyle = function() { // get style based `isZoomable()`

                    if (!isZoomable()) {
                        return 'cursor:pointer';
                    }

                    return null;
                    
                };

            // Listen for userInfo change event
            Service.$pubsub.subscribe('user/infochange/' + item.user.id, function(topics, user) {

                var selector = '#pp-conversation-part-' + item.messageId,
                    userInfo = user.getInfo();

                // Change user avatar
                $(selector)
                    .find('.pp-conversation-part-image-by-admin-avatar')
                    .attr('src', userInfo.user_avatar);

                // Change user name
                $(selector)
                    .find('.pp-conversation-part-serve-name')
                    .text(userInfo.user_fullname);
                
            });
            
            this.add(new View.PPDiv('pp-conversation-part-image-by-admin-o')
                     .add(new View.PPDiv('pp-conversation-part-image-by-admin-o1')
                          .add(new View.PPElement('img', {
                              src: item.user.avatar,
                              'class': 'pp-conversation-part-image-by-admin-avatar'
                          }))
                          .add(new View.PPDiv('pp-conversation-part-image-by-admin-o2')
                               .add(new View.PPDiv('pp-conversation-part-image-by-admin-o3')
                                    .add(new View.PPDiv({
                                        'class': 'pp-conversation-part-serve-name pp-font'
                                    }).text(item.user.name))
                                    .add(new View.PPDiv('pp-conversation-part-image-by-admin-o4')
                                         .add(new View.PPElement('img', {
                                             src: item.message.image.url,
                                             selector: selector, 
                                             'class': 'pp-conversation-part-image-by-admin-img pp-image-viewable',
                                             style: getImageInitialStyle(),
                                             event: {
                                                 click: onImageClick
                                             }
                                         }))))
                               .add(new View.PPDiv('pp-conversation-part-image-by-admin-timestamp-container')
                                    .add(new View.PPElement('span', {
                                        'class': 'pp-selectable pp-font',
                                        id: 'pp-conversation-part-image-by-admin-timestamp-' + item.messageId
                                    })
                                         .text())))));
        }
        extend(PPConversationPartImageByAdmin, View.PPDiv);

        var build = function(item) { // build a new AdminImage
            return new PPConversationPartImageByAdmin(item);
        },

            isZoomable = function() { // weather or not image can zoom-in zoom-out
                return true;
            };

        return {
            build: build
        }
        
    })();
    
})(View));

((function(View) {

    View.$userImageMessage = (function() {

        /**
         * @constructor HTML CODE
         */
        function PPConversationPartImageByUser(item) {
            View.PPDiv.call(this, 'pp-conversation-part-image-by-user');
            
            var MAX_WIDTH = 242, // img max-width 242px

                showUploadingBar = Service.$tools.isUploading(item),
                messageId = item.messageId,
                imgSelector = '#pp-conversation-part-' + messageId + ' .pp-conversation-part-image-by-user-img',
                error = Service.$tools.isMessageSendError(item),
                extra = error ? item.extra.errorDescription : item.extra.description,
                shouldOpacity = Service.$tools.isMessageSendError(item) || showUploadingBar,
                imageHref = item.message.image.url,
                imageViewable = isZoomable(),
                imageClass = 'pp-conversation-part-image-by-user-img' + (imageViewable ? ' pp-image-viewable' : ''),

                onImageClickEvent = function(event) { // on image click event callback
                    if (imageViewable) {
                        openInViewer($(imgSelector));
                    } else {
                        window.open($(imgSelector).attr('src'));
                    }
                },

                // because our `max-width` is fixed, `height` is detect autociamally in other browsers instead of IE9,
                // so we need to calculate `mx-height` dynamically in IE9 browser.
                // getImageMaxHeight = function() {
                //     return $(imgSelector).width() / MAX_WIDTH * $(imgSelector).height();
                // },

                getImageInitialStyle = function() {
                    var style = '';

                    style += shouldOpacity ? 'opacity: .6' : '';

                    if (!imageViewable) style += 'cursor:pointer';

                    return style;
                },

                // $image: `jQuery(img)`
                openInViewer = function($image) {
                    View.$imageViewer.show($image);
                };
            
            this.add(new View.PPDiv('pp-conversation-part-image-by-user-o')
                     .add(new View.PPElement('img', {
                         id: 'pp-conversation-part-image-by-user-img-' + item.messageId,
                         'class': imageClass,
                         src: item.message.image.data || item.message.image.url,
                         style: getImageInitialStyle(),
                         event: {
                             click: onImageClickEvent
                         }
                     }))
                     .add(new View.PPDiv({
                         id: 'pp-conversation-part-image-by-user-timestamp-' + item.messageId,
                         'class': 'pp-conversation-part-image-by-user-timestamp pp-selectable'
                     })
                          .add(new View.PPElement('span', {
                              id: 'pp-conversation-part-image-by-user-timestamp-span-' + item.messageId,
                              'class': 'pp-conversation-part-image-by-user-timestamp-span pp-font',
                              style: error ? 'color:red; display:block;' : 'color:#c9cbcf; display:none;'
                          })
                               .text(extra))
                          .show(!showUploadingBar))
                     .add(new View.PPDiv({
                         'class': 'pp-fixme'
                     })
                          .add(new View.PPUploadingBar(item).show(showUploadingBar))));
        }
        extend(PPConversationPartImageByUser, View.PPDiv);

        var isZoomable = function() { // is image can zoom
            return true;
        },

            build = function(item) { // generate a new ConversationPartImageByUser instance
                return new PPConversationPartImageByUser(item);
            },

            getImageSelector = function(messageId) { // get image selector
                return '#pp-conversation-part-image-by-user-img-' + messageId;
            },

            getImageTimestampContainerSelector = function(messageId) { //
                return '#pp-conversation-part-image-by-user-timestamp-' + messageId;
            },

            getImageTimestampSelector = function(messageId) {
                return '#pp-conversation-part-image-by-user-timestamp-span-' + messageId;
            },

            onBeginUpload = function(messageId) { // on begin upload

                var imageSelector = getImageSelector(messageId);

                // set image opacity from 1 to half-opacity
                $(imageSelector).css({ 'opacity': 0.6 });
                
            },

            onSendFail = function(messageId, errorDescription) {

                // change cursor
                $(getImageSelector(messageId)).css({
                    'opacity': 0.6,
                    'cursor': 'default'
                });

                // show error description
                $(getImageTimestampContainerSelector(messageId)).show();
                $(getImageTimestampSelector(messageId)).text(errorDescription).css({
                    'color': 'red',
                    'display': 'block'
                });
                
            },

            onSendDone = function(messageId, imageUrl) {

                $(getImageSelector(messageId)).css({
                    'opacity': 1.0
                });

            };

        return {
            build: build,

            onBeginUpload: onBeginUpload,
            onSendFail: onSendFail,
            onSendDone: onSendDone
        }
        
    })();
    
})(View));

((function(View) {

    /**
     * @constructor
     */
    function PPConversationPartTextByAdmin(item) {
        View.PPDiv.call(this, 'pp-conversation-part-text-by-admin');

        var html = View.$textUrlChecker.match(item.message.text.body).trustAsHtml();
        var defaultServeNameMarginLeft = '37px';

        Service.$pubsub.subscribe('user/infochange/' + item.user.id, function(topics, user) {

            var selector = '#pp-conversation-part-' + item.messageId,
                userInfo = user.getInfo();

            // Change user avatar src
            $(selector)
                .find('.pp-conversation-part-text-by-admin-avatar')
                .attr('src', userInfo.user_avatar);

            // Change user name text
            $(selector)
                .find('.pp-conversation-part-serve-name')
                .text(userInfo.user_fullname);           
            
        });
        
        this.add(new View.PPDiv('pp-conversation-part-text-by-admin-outer')
                 .add(new View.PPDiv('pp-conversation-part-text-by-admin-outer-2')
                      .add(new View.PPElement('img', {
                          id: 'pp-conversation-part-text-by-admin-avatar',
                          src: item.user.avatar
                      }))
                      .add(new View.PPDiv('pp-conversation-part-text-by-admin-outer-3')
                           .add(new View.PPDiv()
                                .add(new View.PPDiv({
                                    id: '',
                                    style: 'margin-left:' + defaultServeNameMarginLeft,
                                    'class': 'pp-conversation-part-serve-name pp-font'
                                }).text(item.user.name))
                                .add(new View.PPDiv('pp-conversation-part-text-by-admin-body-container')
                                     .add(new View.PPDiv({
                                         id: 'pp-conversation-part-text-by-admin-body',
                                         'class': 'pp-conversation-part-text-by-admin-body pp-font pp-text-link-admin pp-selectable'
                                     })
                                          .html(html)))
                                .add(new View.PPDiv('pp-conversation-part-text-by-admin-triangle')))
                           .add(new View.PPDiv('pp-conversation-part-text-by-admin-timestamp-container')
                                .add(new View.PPElement('span', {
                                    'class': 'pp-selectable pp-font',
                                    id: 'pp-conversation-part-text-by-admin-timestamp-' + item.messageId
                                }))))));
    }
    extend(PPConversationPartTextByAdmin, View.PPDiv);

    View.PPConversationPartTextByAdmin = PPConversationPartTextByAdmin;
    
})(View));

View.$userTextMessage = ( function() {

    var Div = View.PPDiv,
        prefix = 'pp-conversation-part-',
        prefixId = '#' + prefix;

    //////// API ///////////
    
    return {
        build: build,
        onSendFail: onSendFail
    }

    function build( item ) {
        return new PPConversationPartTextByUser( item );
    }

    function onSendFail( ppMessageJsonBody ) {
        
        $( prefixId + ppMessageJsonBody.messageId )
            .find( '.extra' )
            .text( ppMessageJsonBody.extra.errorDescription )
            .css({ 'color': 'red' })
            .show();
        
    }

    /**
     * @constructor
     */
    function PPConversationPartTextByUser( item ) {
        Div.call(this, 'pp-conversation-part-text-by-user');

        var error = Service.$tools.isMessageSendError(item);
        var extra = error ? item.extra.errorDescription : item.extra.description;
        
        var html = View.$textUrlChecker.match(item.message.text.body).trustAsHtml();
        
        this.add(new Div('pp-conversation-part-text-by-user-outer')
                 .add(new Div( 'pp-wrapper' )
                      .add(new Div('pp-conversation-part-text-by-user-body-outer')
                           .add(new Div({
                               id: 'pp-conversation-part-text-by-user-body',
                               'class': 'pp-conversation-part-text-by-user-body pp-font pp-text-link-user pp-selectable'
                           })
                                .html(html)))
                      .add(new Div('pp-conversation-part-text-by-user-triangle')))
                 .add(new Div('pp-conversation-part-text-by-user-timestamp-outer')
                      .add(new View.Span({
                          'class': 'extra pp-selectable',
                          style: error ? 'color:red; display:block' : 'color:#c9cbcf; display:none'
                      }).text(extra))));
    }
    extend(PPConversationPartTextByUser, Div);
    
} )();

View.$adminAudioMessage = ( function() {

    ////////////////
    /// View ////////
    ///////////////
    function AdminAudioMessageView( item ) {
        View.Div.call( this, { className: 'msg-audio-admin' } );

        var voiceImgBackground = 'url(' + Configuration.assets_path + 'img/icon-down.png) 0 -2427px',
            audio = item.message.audio,
            duration = audio.duration(),
            durationStr = duration + "''",
            audioBodySelector = getConversationAudioBodyHtmlSelector( item.messageId ),
            messageId = item.messageId,
            subscriber,
            
            onClick = function( e ) { // `client` event

                var audioId = audio.id(),
                    player = Service.$audioContext;
                
                if ( player.isPlaying( audio ) ) {
                    player.stop( audio );
                } else {
                    subscriber = Service.$pubsub.subscribe( 'audio/' + audioId, onAudioStateChange );

                    audio.markRead();
                    markRead( messageId );
                    
                    player.play( audio );
                }

                return true;
                
            };

        
        this.add( new View.Img( { src: item.user.avatar, className: 'pp-avatar' } ) )
            .add( new View.Div( { className: 'pp-content' } )
                  .add( new View.Span( { className: 'pp-name' } ).text( item.user.name ) )
                  .add( new View.Div( { className: 'pp-voice', uuid: audio.id() } )
                        .add( new View.Div( { className: 'pp-triangle' } ) )
                        .add( new View.Div( { className: 'pp-body',
                                              style: 'width:' + getVoiceViewLength( duration) + 'px',
                                              selector: audioBodySelector,
                                              event: {
                                                  click: onClick
                                              } } )
                              .add( new View.Element( 'i', { style: 'background:' + voiceImgBackground } ) ) )
                        .add( new View.Span( { className: 'pp-dura' } ).text( durationStr ) )
                        .add( new View.Div( { className: 'pp-unread' } ) ))
                  .add( new View.Span( { className: 'pp-desc' } ) ));

        // Initialize when `new`
        initialize(); 

        function initialize() {
            $timeout( function() {
                
                if ( !audio.canPlay() ) markError( messageId );

                if ( audio.hasRead() ) markRead( messageId );
                
            } );
        }

        function getVoiceViewLength( duration ) {
            var MIN = 45,
                MAX = 120,
                
                MAX_DURATION = 300,
                MIN_DURATION = 1;

            if ( duration > MAX_DURATION ) duration = MAX_DURATION;
            if ( duration < 0 ) duration = MIN_DURATION;
            
            return MIN + ( MAX - MIN ) * duration / MAX_DURATION;
        }

        function onAudioStateChange( topics, data ) {

            var STATE = Service.$audioContext.STATE,
                $pubsub = Service.$pubsub;

            switch ( data.state ) {
            case STATE.NULL:
                stopAudioAnimation( messageId, data.audioId );
                subscriber && $pubsub.unsubscribe( subscriber );
                subscriber = undefined;
                break;

            case STATE.ERROR:
                stopAudioAnimation( messageId, data.audioId );
                subscriber && $pubsub.unsubscribe( subscriber );
                subscriber = undefined;

                audio.markError();
                markError( messageId );
                break;

            case STATE.PLAYING:
                playAudioAnimation( messageId, data.audioId );
                break;
            }
            
        }
        
    }
    extend( AdminAudioMessageView, View.Div );

    ////// API /////////
    return {
        build: build,

        playAudioAnimation: playAudioAnimation,
        stopAudioAnimation: stopAudioAnimation
    }

    function build( message ) {
        return new AdminAudioMessageView( message );
    }

    function playAudioAnimation( messageId ) {

        var WIDTHS = [ 8.3, 13, 23 ],
            $el = findAudioView( messageId ),
            eventId = 'voice-' + messageId,
            index = 0;
        
        Service.$task.repeat( eventId, function() {
            $el.css( 'width', WIDTHS [ index++ % WIDTHS.length ] );
        }, 500 );
        
    }

    function stopAudioAnimation( messageId ) {
        Service.$task.cancelRepeat( 'voice-' + messageId );
        findAudioView( messageId ).css( 'width', 23 );
    }

    function markRead( messageId ) {
        $( getConversationHtmlSelector( messageId ) ).find( '.pp-unread' ).hide();
    }

    function clearError( messageId ) {
        findAudioDescView( messageId ).hide();
    }

    function markError( messageId ) {
        findAudioDescView( messageId )
            .css( 'color', 'red' )
            .text( Service.Constants.i18n( 'AUDIO_PLAY_ERROR' ) )
            .show();
    }

    function findAudioDescView( messageId ) {
        return $( getConversationHtmlSelector( messageId ) ).find( '.pp-desc' );
    }

    function findAudioView( messageId ) {
        return $( getConversationHtmlSelector( messageId ) )
            .find( '.pp-body' )
            .find( 'i' );
    }

    function getConversationHtmlSelector( messageId ) {
        return '#pp-conversation-part-' + messageId;
    }

    function getConversationAudioBodyHtmlSelector( messageId ) {
        return getConversationHtmlSelector( messageId ) + ' .pp-body';
    }
    
} )();

((function(View) {

    /**
     * @constructor
     */
    function PPConversationPartTimestamp(item) {
        View.PPDiv.call(this, {
            id: 'pp-conversation-part-timestamp-' + item.messageId ,
            'class': 'pp-conversation-part-center pp-font'
        });

        this.add(new View.PPDiv({
            'class': 'pp-conversation-part-timestamp-time'
        }).text(item.message.timestamp.timeStr));
    }
    extend(PPConversationPartTimestamp, View.PPDiv);

    View.PPConversationPartTimestamp = PPConversationPartTimestamp;
    
})(View));

((function(View) {

    /**
     * @constructor
     */
    function PPEmojiSelectorGroupIcon(emoji, index, ctrl) {
        View.PPElement.call(this, 'span', {
            title: emoji.title,
            selector: '.pp-emoji-selector-panel-header span:eq(' + index + ')',
            event: {
                click: function() {
                    ctrl.selectGroup(index);
                },
                mouseleave: function() {
                    ctrl.onEmojiGroupIconMouseLeave(index);
                },
                mouseover: function() {
                    ctrl.onEmojiGroupIconMouseOver(index);
                }
            }
        });
        
        this.text(emoji.value);
    }
    extend(PPEmojiSelectorGroupIcon, View.PPElement);

    View.PPEmojiSelectorGroupIcon = PPEmojiSelectorGroupIcon;
    
})(View));

((function(View) {

    /**
     * @constructor
     */
    function PPEmojiSelectorPanelHeader(items, ctrl) {
        View.PPDiv.call(this, {
            id: 'pp-emoji-selector-panel-header',
            style: 'background-color:' + View.Style.Color.base
        }, ctrl);

        if (items && items.length > 0) {
            for (var i=0; i<items.length; ++i) {
                this.add(new View.PPEmojiSelectorGroupIcon(items[i], i, ctrl));
            }
        }
    }
    extend(PPEmojiSelectorPanelHeader, View.PPDiv);

    View.PPEmojiSelectorPanelHeader = PPEmojiSelectorPanelHeader;
    
})(View));

((function(View) {

    /**
     * @constructor
     */
    function PPEmojiIcon(emoji, index, ctrl) {
        View.PPElement.call(this, 'span', {
            title: emoji.title,
            selector: '#pp-emoji-selector-content > span:eq(' + index + ')',
            event: {
                click: function() {
                    ctrl.onEmojiIconClicked(index, emoji);
                },
                
                mouseover: function() {
                    ctrl.onEmojiIconMouseOver(index, emoji);
                },
                
                mouseleave: function() {
                    ctrl.onEmojiIconMouseLeave(index, emoji);
                }
                
            }
        }, ctrl);

        this.text(emoji.value);
    }
    extend(PPEmojiIcon, View.PPElement);

    View.PPEmojiIcon = PPEmojiIcon;
    
})(View));

((function(View) {

    /**
     * @constructor
     */
    function PPEmojiSelectorContent(ctrl) {
        View.PPDiv.call(this, {
            id: 'pp-emoji-selector-content',
            'class': 'pp-emoji-selector-content pp-box-sizing'
        }, ctrl);
        setTimeout(function() {
            ctrl.selectGroup(0);
        });
    }
    extend(PPEmojiSelectorContent, View.PPDiv);

    View.PPEmojiSelectorContent = PPEmojiSelectorContent;
    
})(View));

((function(View) {

    View.$emojiSelector = (function() {
        
        /**
         * @constructor
         */
        function PPEmojiSelector() {
            var ctrl = Ctrl.$emojiSelector.get();
            View.PPDiv.call(this, {
                id: emojiSelectorId,
                'class': emojiSelectorClass + ' pp-box-sizing pp-unselectable',
                event: {
                    init: function() {
                        $(emojiSelectorSelector).css({
                            'display': 'none'
                        });
                    }
                }
            }, ctrl);
            
            this.add(new View.PPEmojiSelectorPanelHeader(ctrl.getDefaultEmojiGroup(), ctrl))
                .add(new View.PPEmojiSelectorContent(ctrl))
                .add(new View.PPDiv('pp-emoji-selector-triangle'))
                .add(new View.PPDiv('pp-emoji-selector-triangle-mask'));
        }
        extend(PPEmojiSelector, View.PPDiv);

        var emojiSelectorId = 'pp-emoji-selector',
            emojiSelectorClass = emojiSelectorId,
            emojiSelectorSelector = '#' + emojiSelectorId,
            emojiSelectorToolsContainerSelector = '#pp-composer-container-tools-container';

        return {
            build: function() {
                return new PPEmojiSelector();
            },

            changeBottomMarginByInputHeight: function(height) {
                var fixBottom = height + 3; // 3 is fix number
                
                $(emojiSelectorToolsContainerSelector).css('bottom', fixBottom);
            }
        }
        
    })();
    
})(View));

/**
 * 
 * Given a string, test whether or not it includes a link url.
 *
 * [Example]:
 *
 * var p = "abcde www.baidu.com defgeh https://ppmessage.cn xyz"
 *
 * var urlChecker = new View.TextUrlChecker();
 * var html = urlChecker.match(p).trustAsHtml();
 * console.log(html);
 * // abcde <a href='www.baidu.com' target='_blank'>www.baidu.com</a> defgeh <a href='https://ppmessage.cn' target='_blank'>https://ppmessage.cn</a> xyz
 *
 * p = "123456abcdef";
 * var nonHtml = urlChecker.match(p).trustAsHtml();
 * console.log(nonHtml);
 * // 123456abcdef
 *
 */
((function(View) {

    /**
     * source: source
     * include: true/false
     *
     * matchIndexArray:
     *     [{begin:1, end:5, url:xxx}, {begin:8, end:10, url:xxx}, ...]
     */
    function TextUrlCheckerResult(source, include, matchIndexArray) {
        this.source = source;
        this.include = include;
        this.matchIndexArray = matchIndexArray;
    }
    TextUrlCheckerResult.prototype.trustAsHtml = function(cssClass) {
        if (!this.include) {
            return this._encodeHtmlEntity(this.source);
        }
        var source = this.source;
        var matchIndexArray = this.matchIndexArray;
        var html = "";
        var sourceBegin = 0;
        var that = this;
        $.each(matchIndexArray, function(index, item) {
            html += that._encodeHtmlEntity(source.substring(sourceBegin, item.begin));
            
            //build link
            var fixHref = /^https?:\/\//.test(item.url) ? item.url : 'http://' + item.url;
            html += "<a href='" + fixHref + "' target='_blank'";
            if (cssClass) html += " class='" + cssClass + "'";
            html += ">";
            html += item.url;
            html += "</a>";

            sourceBegin = item.end;
        });
        if (sourceBegin < source.length) {
            html += this._encodeHtmlEntity(source.substring(sourceBegin, source.length));
        }
        return html;
    };

    //http://www.w3schools.com/html/html_entities.asp
    TextUrlCheckerResult.prototype._encodeHtmlEntity = function(text) {
        var res = text;
        res = res.replace(/</g, '&lt;');
        res = res.replace(/>/g, '&gt;');
        return res;
    };

    function TextUrlChecker() {
    }

    TextUrlChecker.UrlPattern = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[a-zA-Z0-9\/\-\.=_&%#?:;|]{2,}|www\.[^\s"']+\.[a-zA-Z0-9\/\-\.=_&%#?:;|]{2,})/g;

    TextUrlChecker.prototype.match = function(text) {
        var myArray;
        var matchIndexArray = [];
        var re = TextUrlChecker.UrlPattern;
        while ((myArray = re.exec(text)) !== null) {
            matchIndexArray.push({
                begin: myArray.index,
                end: re.lastIndex,
                url: myArray[0]
            });
        }
        return new TextUrlCheckerResult(text, matchIndexArray.length != 0, matchIndexArray);
    }

    View.TextUrlChecker = TextUrlChecker;
    
})(View));

/**
 * 得到主色调，整体风格，颜色搭配等
 *
 * [Example]:
 *
 * var Style = View.Style.init(); // Don't forget to call `init` method before your first use
 * console.log( 'launcher color is: ', Style.Color.launcher_background_color );
 *
 */
View.Style = ( function() {

    var COLOR,

        api = {
            init: init
        };

    /////// API /////////////

    return api;

    //////// Internal ///////////
    
    function init() {
        api [ 'Color' ] = color();
        return api;
    }

    function color() {
        if ( COLOR !== undefined ) return COLOR;
        
        var mainColor =
            // Try get from `ppcom_launcher_color` first
            ( Service.$app.app() && Service.$app.app().ppcom_launcher_color ) || '#54C6D6',
            gray = '#fafafb',                
            darkerGray = '#E4E4E4';

        return {
            launcher_background_color: mainColor, //小泡背景颜色 /* #0074b0; */
            base: gray, //灰色
            base_darker: darkerGray, //深灰色

            hovercard_close_btn: 'rgba(40,45,50,.4)', // hovercard_close_button_background_color
        };
    }
    
} )();

/**
 * 根据 ppSettings.view 来配置和管理 View
 *
 * Example:
 * 
 * var viewSettings = new View.PPSettings().init(ppSettings);
 * viewSettings.getLauncherBottomMargin();
 * viewSettings.getLauncherRightMargin();
 * viewSettings.isShowLauncher();
 *
 */
((function(View) {

    function PPSettings() {
        this._ppSettings = null;
    }

    PPSettings.DEFAULT_BOTTOM_MARGIN = "20px";
    PPSettings.DEFAULT_RIGHT_MARGIN = "20px";

    /**
     * Do not forget to init ppSettings
     */
    PPSettings.prototype.init = function(ppSettings) {
        this._ppSettings = ppSettings;
        return this;
    };

    /**
     * 右下角距离网页底部边缘距离，默认20px
     */
    PPSettings.prototype.getLauncherBottomMargin = function() {
        return this._getValueFromPPSettingsView('launcher_bottom_margin', PPSettings.DEFAULT_BOTTOM_MARGIN);
    };

    /**
     * 右下角距离网页右侧边缘距离，默认20px
     */
    PPSettings.prototype.getLauncherRightMargin = function() {
        return this._getValueFromPPSettingsView('launcher_right_margin', PPSettings.DEFAULT_RIGHT_MARGIN);
    };

    /**
     * `PP`加载的时候，是否默认显示小泡
     */
    PPSettings.prototype.isShowLauncher = function() {
        return this._getValueFromPPSettingsView('launcher_is_show', true);
    };

    /**
     * 从 `_ppSettings.view` 中取得`key`的值，如果为空的话，那么用`defaultValue`来替代
     */
    PPSettings.prototype._getValueFromPPSettingsView = function(key, defaultValue) {
        var value = defaultValue;
        if (this._ppSettings && this._ppSettings.view && key in this._ppSettings.view) {
            value = this._ppSettings.view[key];
        }
        return value;
    };

    View.PPSettings = PPSettings;
    
})(View));

//
// [ View ] <-----------> [ Controller ] <------------> [ Entity ]
//
((function(Ctrl) {

    /**
     * @constructor
     */
    function PPBaseCtrl(modal) {
        
        var _modal = modal;

        this.empty = function(selector) {
            $( selector ).empty();
        };

        this.show = function(selector, show) {
            $( selector ).css('display', show ? 'block' : 'none');
        };

        this.getModal = function() {
            return _modal;
        };

        this.setModal = function(modal) {
            _modal = modal;
        };
        
    }
    
    Ctrl.PPBaseCtrl = PPBaseCtrl;
    
})(Ctrl));

((function(Ctrl) {

    function AppProfileContainerCtrl(msgItem) {
        Ctrl.PPBaseCtrl.call(this);

        var welcome = msgItem.message.welcome;

        this.getAppTeamName = function() {
            return welcome.appTeamName;
        };

        this.getWelcomeText = function() {
            return welcome.appWelcomeText;
        };

        this.getActiveAdmins = function() {
            return welcome.activeAdmins;
        };
        
    }
    extend(AppProfileContainerCtrl, Ctrl.PPBaseCtrl);

    Ctrl.AppProfileContainerCtrl = AppProfileContainerCtrl;
    
})(Ctrl));

Ctrl.$composerContainer = (function() {

    function PPComposerContainerCtrl() {
        Ctrl.PPBaseCtrl.call(this);

        var $tools = Service.$tools,
            $device = Service.$device,
            Constants = Service.Constants,

            inMobile = $device.isMobileBrowser(),

            self = this,
            
            selector = '#pp-composer-container',
            composerContainerEmojiBtnSelector = '#pp-composer-container-emoji-btn',
            composerContainerTextareaSelector = '#pp-composer-container-textarea',
            conversationContentSelector = 'pp-conversation-content', //NOTE: No '#'
            composerContainerFileSelector = '#pp-composer-container-file-selector',
            composerContainerWarning = '#pp-composer-container-warning',

            // After send text finish , place cursor at the beginning of textarea
            resetCursor = function() {

                // find element
                var txtElement = $(composerContainerTextareaSelector)[0];
                
                if (txtElement.setSelectionRange) { 
                    txtElement.focus(); 
                    txtElement.setSelectionRange(0, 0); 
                } else if (txtElement.createTextRange) { 
                    var range = txtElement.createTextRange();  
                    range.moveStart('character', 0); 
                    range.select(); 
                }     
            };

        this.getTextareaPaddingStyle = function() {
            return this.isShowEmojiIcon() ? 'padding: 10px 70px 5px 14px' : 'padding: 10px 45px 5px 14px';
        };

        this.hide = function() {
            $(selector).css('margin-bottom', '-59px');
        };

        this.show = function(cb) {
            $(selector).animate({
                'margin-bottom': '0px'
            }, 200, function() {
                if (cb) cb();
            });
        };

        this.onEmojiSelectorSiblingClicked = function() {
            Ctrl.$emojiSelector.get().showSelector(false);
        };
        
        this.onEmojiSelectorBtnClicked = function() {
            Ctrl.$emojiSelector.get().toggleSelector();
        };

        this.onEmojiSelectorBtnMouseOver = function() {
            $(composerContainerEmojiBtnSelector).css('opacity', 1.0);
        };

        this.onEmojiSelectorBtnMouseLeave = function() {
            $(composerContainerEmojiBtnSelector).css('opacity', 0.4);
        };

        this.onFileSelectorBtnClicked = function() {
            Ctrl.$emojiSelector.get().showSelector(false);
            $("#pp-composer-container-input").trigger('click');
        };

        this.onFileSelectorBtnMouseOver = function() {
            $(composerContainerFileSelector).css('opacity', 1.0);
        };

        this.onFileSelectorBtnMouseLeave = function() {
            $(composerContainerFileSelector).css('opacity', 0.4);
        };

        // 显示不正常的：
        this.onChatTextareaFocus = function() {
            Ctrl.$groupMembers.hide();
            View.$conversationContent.scrollToBottom();
            $( composerContainerTextareaSelector ).addClass('pp-textarea-focus');
        };

        this.onTextareaFocusOut = function() {
            $(composerContainerTextareaSelector).removeClass('pp-textarea-focus');
        };

        this.onTextareaChange = function() {
            if (!this.isSendButtonShow()) {
                return;
            }
            var text = $(composerContainerTextareaSelector).val();
            var enableSendButton = text && text.length > 0;
            this.disableSendButton(!enableSendButton);
        };

        this.onChatTextareaKeyDown = function(event) {        
            if (event.which == 13) {
                event.preventDefault(); // Don't make a new line
                this.sendText();
            }
        };

        this.sendText = function() {            
            var text = $(composerContainerTextareaSelector).val();
            if (text) {
                Ctrl.$emojiSelector.get().showSelector(false);
                $(composerContainerTextareaSelector).val('');
                $(composerContainerTextareaSelector).focus();
                View.$composerContainer.fixInputRows();
                $(composerContainerTextareaSelector)[0].rows = 1;

                // Send text message
                new Service.PPMessage.Builder('TEXT')
                    .textMessageBody(text)
                    .build().send();

                // Place cursor to the begining
                // resetCursor();
            }
            this.disableSendButton(true);
        };

        this.onTextareaInit = function() {
            if ($device.isIE()) {
                $(composerContainerTextareaSelector).val('');
            }
        };

        this.onFileSelect = function(file) {
            
            var filePath = $(file).val();
            var isImage = $tools.isImage(filePath);
            var f = file.files[0];

            //read file info and send it
            var fileReader = new FileReader();
            fileReader.onloadend = function(e) {
                // Image 
                if (isImage) {
                    if (e.target && e.target.result) {

                        // Send image message
                        new Service.PPMessage.Builder('IMAGE')
                            .imageBody({
                                file: f, url: filePath, data: e.target.result
                            })
                            .build().send();
                        
                    }
                } else {
                    // Not a Image
                    var fileName = filePath;
                    var slash = -1;
                    if ((slash = filePath.lastIndexOf('\\')) > 0) {
                        fileName = filePath.substring(slash + 1);
                    }

                    // Send file message
                    new Service.PPMessage.Builder('FILE')
                        .fileBody({
                            fileUrl: filePath,
                            file: f,
                            fileName: fileName,
                            fileSize: e.total
                        })
                        .build().send();

                }
            };
            fileReader.onerror = function(e) {
                Service.$debug.d('FileReader upload file error. filePath: %s, error: %s.', filePath, e);
            };

            if (file && file.files[0]) {
                var size = file.files[0].size;
                if (size > Constants.MAX_UPLOAD_SIZE) {
                    //TODO
                    var hint = Constants.i18n('MAXIMUM_UPLOAD_SIZE_HINT') + Constants.MAX_UPLOAD_SIZE_STR;
                    
                    $(composerContainerWarning).css('display', 'block');
                    $('#pp-composer-container-warning-span').text(hint);
                    setTimeout(function() {
                        $(composerContainerWarning).animate({
                            'opacity': 0.01
                        }, 3000, function() {
                            $(composerContainerWarning).css('display', 'none');
                            $(composerContainerWarning).css('opacity', '1.0');
                        });
                    }, 2000);
                } else {
                    fileReader.readAsDataURL(file.files[0]);
                }
                //clear it
                $(file).val('');
            }
        };

        this.isShowEmojiIcon = function() {
            return $tools.isShowEmojiIcon();
        };

        this.isSendButtonShow = function() {
            return inMobile;
        };

        this.onSendButtonInit = function() {
            this.disableSendButton(true);
        };

        this.onSendButtonMouseDown = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault(); // prevent fire focus event

            this.sendText();
        };

        this.disableSendButton = function(disable) {
            // $('#pp-composer-send-button').prop('disabled', disable);
            $('#pp-composer-send-button').css('background', disable ? '#CCCCCC' : '#0074b0');
        };

        this.resetCursor = resetCursor;
    };
    extend(PPComposerContainerCtrl, Ctrl.PPBaseCtrl);

    var instance = null,

        get = function() {
            if (instance == null) {
                instance = new PPComposerContainerCtrl();
            }
            return instance;
        };

    return {
        get: get
    }
    
})();

//
// $conversationContent ----( conversation_uuid )-----> [ modal - 1 ,
//                                                        modal - 2 ,
//                                                        modal - 3 ,
//                                                        ...       ]
//
// $conversationContent.init(); // call only once
//
Ctrl.$conversationContent = (function() {

    var self = this,

        DEFAULT_SHOW_TIMEOUT = 200,

        activeConversation, // VERY VERY IMPORTANT

        selector = '#pp-conversation-content',
        conversationSelector = 'pp-conversation',

        // call once
        init = function() {

            // on new message arrived
            Service.$pubsub.subscribe('msgArrived/chat', function(topics, ppMessage) {

                var body = ppMessage.getBody(),
                    groupId = body.conversation.uuid;

                appendMessage( body );
                View.$conversationContent.scrollToBottom();    
                
            });

            // some one typing ...
            Service.$pubsub.subscribe('ws/typing', function ( topics, typingMessage ) {

                // We are in chatting panel and the `conversation_uuid` equal current chatting group
                // We only watching the current chatting conversation and unwatch it immediately once close current conversation
                if ( View.$conversationContentContainer.visible() ) {

                    var conversationId = getConversationId();
                    if ( conversationId ) {
                        
                        var EVENT_ID = 'typing', // default typing event identifier
                            eventId = EVENT_ID, // typing event identifier

                            oldHeaderTitle,
                            $sheetHeaderCtrl = Ctrl.$sheetheader,
                            setHeaderTitle = View.$sheetHeader.setTitle, // We only change title in `view`, not affect the `modal`
                            getHeaderTitle = $sheetHeaderCtrl.getHeaderTitle; // so `getHeaderTitle` always return the origin header title

                        Service.$schedule
                            .schedule(function() {
                                oldHeaderTitle = getHeaderTitle();
                                setHeaderTitle(Service.Constants.i18n('TYPING'));
                            }, eventId )
                            .after(function() {
                                setHeaderTitle(oldHeaderTitle);
                            })
                            .onCancel(function() {
                                setHeaderTitle(oldHeaderTitle);
                            })
                            .start();
                        
                    }
                    
                }
                
            });

            // user online or offline
            Service.$pubsub.subscribe ( 'ws/online', function ( topics, onlineMessage ) {
                // `user_uuid` may not exist, may be `welcome info` is downloading or some other reasons
                if (!Service.$users.exist(onlineMessage.user_uuid)) {
                    return;
                }
	            if (onlineMessage.mobile == "UNCHANGED" && onlineMessage.browser == "UNCHANGED") {
                    return;
	            }
                var user = Service.$users.getUser(onlineMessage.user_uuid).getInfo();
                if (onlineMessage.mobile != "UNCHANGED") {
                    user.is_mobile_online = (onlineMessage.mobile=="ONLINE");
                }
                if (onlineMessage.browser != "UNCHANGED") {
                    user.is_browser_online = (onlineMessage.browser=="ONLINE");
                }
                var is_online = user.is_mobile_online || user.is_browser_online;
                if (is_online !== user.is_online) {
                    Service.$users.getUser(user.user_uuid).update({user_uuid: user.user_uuid, is_online: is_online});
                }
            });
            
            return this;
        },

        // get modal associated with `conversationId`
        // @param `conversationId` is @optional
        getModal = function( conversationId ) {
            var uuid = conversationId || getConversationId();
            return uuid && Modal.$conversationContentGroup.get( uuid );
        },

        prependMessages = function(msgs, callback) { // add msgs(message array) at head

            var chatBox = $(selector),
                
                // Store current scrollPosition
                scrollPosition = chatBox[0].scrollHeight,

                html = '';
            
            $.each(msgs, function(index, item) {
                html += new View.PPConversationPart(msgs[index]).getElement()[0].outerHTML;
            });

            chatBox.prepend(html);
            chatBox.scrollTop(chatBox[0].scrollHeight - scrollPosition);
            
            if (callback) callback();
        },

        loadHistorys = function(beforeUpdateViewCallback, completeCallback) {

            var conversationId = getConversationId();

            if ( conversationId ) {
                
                // load history
                getConversationHistory( conversationId, function( list ) {

                    if (beforeUpdateViewCallback) beforeUpdateViewCallback();

                    // tell modal is can load more historys
                    getModal() && getModal().setLoadable(list.length > 0);
                    
                    // update view
                    prependMessages(list, function() {
                        if (completeCallback) completeCallback(list); 
                    });
                });
                
            }
            
        },

        // TODO:
        // 'click' event will conflict with 'onStartMove' event
        onConversationContentClicked = function() { // 'click' event

            Ctrl.$emojiSelector.get().showSelector(false); // hide emoji-selector panel
            Ctrl.$groupMembers.hide(); // hide `group-members` if exist

            if (Service.$device.isMobileBrowser()) { // hide keyboard if on mobile browser
                View.$composerContainer.blur();
            }
            
        },
    
        getConversationHistory = function( conversationId, callback ) {
            getModal().getConversationHistory( conversationId, callback );
        },

        /**
         * 聊天信息初始化
         */
        onConversationContentInit = function() {
            // add pull to refresh button to get history
            // 
            // There seems like some bug in `pulltorefresh.jquery.js` library, in mobile browser, when click `conversation-content` element,
            // it will never trigger `click` event, instead of, if not trigger `move` event, will end up with trigger `end` event,
            // so we trigger `click` event when `end` event callback happens on this situtation.
            $(selector).append(View.$pulltoRefresh.build().getHTML());
        },

        /**
         * Append Message at tail
         */
        appendMessage = function( message ) {

            var modal = getModal( message.conversation.uuid );
            
            if ( modal ) {
                var timestampMsg = modal.addMessage(message);
                if ( timestampMsg ) {
                    $(selector).append(new View.PPConversationPartTimestamp( timestampMsg ).getElement()[0].outerHTML);
                }
                $(selector).append(new View.PPConversationPart( message ).getElement()[0].outerHTML);                
            }

        },

        // push a new messageid to messageIdArrays for message duplicate check
        updateMessageIdsArray = function( messageId ) {
            getModal() && getModal().updateMessageIdsArray(messageId);
        },

        // show conversation-content panel with callback
        //
        // @param settings:
        // {
        //     delay: 200,
        //     fadeIn: true/false, default: true
        // }
        show = function( conversation, settings, callback) {
            var delay = ( settings && settings.delay && settings.delay ) || DEFAULT_SHOW_TIMEOUT,
                fadeIn = ( settings && settings.fadeIn && settings.fadeIn ) || true,

                showCallback = function() {// Make callback
                    $timeout(function() {

                        // replace origin `click` event to pulltorefresh.js
                        Ctrl.$pulltoRefreshController
                            .get( Ctrl.$conversationContent )
                            .loadable(isLoadable())
                            .onend( onConversationContentClicked )
                            .bindEvent();

                        // When the user second pressed `launcher` to open PPCom,
                        // then the keyboard will cover the textarea in mobile browser,
                        // currently, the best way is let the user trigger `focus` event manually
                        if (!Service.$device.isMobileBrowser()) {
                            View.$composerContainer.focus();
                        }
                        
                        // show
                        View.$conversationContentContainer.show( fadeIn );

                        // callback
                        if (callback) callback();                
                    }, delay);
                };

            // We need to disable body scroll, so let textarea move up correctly on iPhone/iPod... devices when focus,
            // avoid move up too high
            // @see `sheetheaderctrl.js` `minimize` methods
            if (Service.$device.isIOS()) {
                Service.$device.disableScroll();
            }

            // Make sure `conversation` is ok, and really exist
            if ( conversation && conversation.token ) {

                var old = activeConversation;

                if ( old !== conversation ) {
                    onHide( old ); // `onHide` old conversation
                    onStart( conversation ); // `onStart` new conversation
                } else {
                    onResume( conversation ); // same conversation call `onResume` event
                }

                showCallback();   
            }
            
        },

        isLoadable = function() {
            return getModal() && getModal().isLoadable();
        };

    return {
        init: init,
        show: show,
        hide: hide,

        // Events
        onConversationContentClicked: onConversationContentClicked,
        onConversationContentInit: onConversationContentInit,

        appendMessage: appendMessage,
        loadHistorys: loadHistorys,
        updateMessageIdsArray: updateMessageIdsArray,

        isLoadable: isLoadable
    }

    ///////////////////////////////////////////////////////////
    //// Conversation Content State Control ( Life Cycle ) ////
    ///////////////////////////////////////////////////////////
    
    ////////////// `onStart` -> `onResume` -> `onHide /////////

    function onStart ( conversation ) {

        activeConversation = conversation;
        
        Ctrl.$conversationPanel.mode( Ctrl.$conversationPanel.MODE.CONTENT );

        // If this method has been called, generally this was clicked by user manually, so we consider
        // this is an ACTIVE CLICK
        Ctrl.$hoverCard.get().notifyUserActiveClickPPCom();
        
        __Monitor.report( __MonitorEvent.show, activeConversation );

        // watch conversation typing
        // Or we can delay `watch action` after the service user send the first message ?
        conversation && conversation.uuid && Service.$notifyTyping
            .get( Service.$notification )
            .watch( conversation.uuid );

        onResume( conversation );
    }

    // reload all data associated with this `conversation`
    function onResume( conversation ) {
        
        // Update view associated with this conversation
        // CLEAR data except for `pull to refresh` element
        // NOTE: `html` method will remove the events bind to `pull to refresh` element, so you MUST bind events again
        View.$conversationContent.html( View.$pulltoRefresh.el() );
        var messageArray = getModal() && getModal().getMessages() || [],
            html = '';
        $.each(messageArray, function(index, item) {
            html += new View.PPConversationPart(messageArray[index]).getElement()[0].outerHTML;
        });
        View.$conversationContent.append(html);

        // Clear unread count associated with this `conversation`
        //
        // because currently, when user click to the `conversation-list` panel, the html are all removed and
        // re create again based the conversation list's new state, so it needn't call the method
        // `View.$groupContentItem.hideUnread( getConversationId() );`
        var m = Modal.$conversationContentGroup.get ( getConversationId() );
        Ctrl.$sheetheader.decrUnread ( m.unreadCount() );
        m.clearUnread();

        __Monitor.report( __MonitorEvent.resume, activeConversation );
        
    }

    function onHide ( conversation ) {

        // unWatch conversation typing
        conversation && conversation.uuid &&
            Service.$notifyTyping.get( Service.$notification )
            .unWatch( conversation.uuid );

        // Close audio player
        Service.$audioContext.close();

        if ( conversation ) __Monitor.report( __MonitorEvent.hide, conversation );
        
    }

    function hide() {
        View.$conversationContentContainer.hide();
        onHide( activeConversation );
        activeConversation = undefined;
    }

    /////// Tools ///////////
    
    function getToken() {
        return activeConversation && activeConversation.token;
    }

    function getConversationId() {
        return activeConversation && activeConversation.uuid;
    }
    
})();

Ctrl.$conversationList = ( function() {

    //////// API /////////
    return {
        show: show,
        showItem: showItem,
        
        hide: hide
    }

    /////// Implementation ///
    function show() {
        Ctrl.$conversationPanel.mode( Ctrl.$conversationPanel.MODE.LIST );

        View.$loading.show();
        Service.$conversationManager.asyncGetList( function( conversationList ) {
            
            // update view
            View.$groupContent
                .update( prepareData( conversationList ) )
                .show();
            
            Ctrl.$conversationContent.hide();
            View.$loading.hide();

            markUnreadState ( conversationList );
            conversationDescriptionLoader( conversationList ).load( function( token, description ) {
                View.$groupContentItem.description( token, description );
            } );
            
        } );

        function prepareData( conversationList ) {

            var viewData = [];
            conversationList && $.each( conversationList, function( index, item ) {

                var uuid = item.token,
                    icon,
                    name,
                    summary;

                switch( item.type ) {
                case Service.$conversationManager.TYPE.CONVERSATION:

                    var conversationData = item.conversation_data || item;
                    icon = Service.$tools.icon.get( conversationData.conversation_icon );
                    name = conversationData.conversation_name;
                    
                    break;

                case Service.$conversationManager.TYPE.GROUP:
                    name = item.group_name;
                    icon = Service.$tools.icon.get( item.group_icon );
                    break;
                }

                viewData.push( {
                    uuid: uuid,
                    icon: icon,
                    name: name,
                    summary: summary
                } );
                
            } );
            return viewData;
            
        }

        function markUnreadState ( conversationList ) {

            conversationList && $.each( conversationList, function( index, item ) {

                if ( item.type === Service.$conversationManager.TYPE.CONVERSATION ) {

                    var token = item.token,
                        m = Modal.$conversationContentGroup.get ( token ),
                        $groupItemView = View.$groupContentItem;

                    if ( m.unreadCount() > 0 ) {
                        $groupItemView.showUnread( token , m.unreadCount() );
                    } else {
                        $groupItemView.hideUnread( token );
                    }       
                    
                }
                
            } );
            
        }
    }

    /////// showItem /////////
    function showItem( token ) {

        var $conversationManager = Service.$conversationManager,
            conversation = $conversationManager.find( token ),
            TYPE = $conversationManager.TYPE;
            
        if ( conversation !== undefined ) {

            before();

            switch( conversation.type ) {
            case TYPE.GROUP:
                showItemGroup( conversation );
                break;

            case TYPE.CONVERSATION:
                showItemConversation( conversation );
                break;
            }
            
        }

        function before() {
            View.$loading.show(); // show loading view
            View.$groupContent.hide(); // Hide group-content-view
        }

        function showItemGroup( conversation ) {
            Service.$conversationManager.asyncGetConversation( {
                group_uuid: conversation.uuid
            }, function( r ) {
                show( r && r.token );
            } );
        }

        function showItemConversation( conversation ) {
            show( token );
        }

        function show( token ) {
            
            if ( token !== undefined ) {
                var $manager = Service.$conversationManager;            
                $manager.activeConversation( token );
                Ctrl.$conversationContent
                    .show( $manager.activeConversation(), {}, onSuccessCallback );                
            } else {
                onErrorCallback();
            }

        }

        function onErrorCallback() {
            View.$loading.hide(); // hide loading view
            View.$groupContent.show(); // Hide group-content-view
        }

        function onSuccessCallback() {
            Ctrl.$conversationPanel.mode( Ctrl.$conversationPanel.MODE.CONTENT );
            
            View.$loading.hide(); // hide loading view
            View.$composerContainer.focus(); // focus
        }
        
    }

    ///////// hide ///////////
    function hide() {
        
    }

    //////// conversationDescLoader /////
    function conversationDescriptionLoader( conversationList ) {

        return {
            load: load
        }

        function load( callback ) {
            conversationList && $.each( conversationList, function( index, item ) {
                switch ( item.type ) {
                case Service.$conversationManager.TYPE.CONVERSATION:
                    
                    // 1. try to find latest_message from local
                    var modal = Modal.$conversationContentGroup.get ( item.token );
                    if ( modal && !modal.isEmpty() ) {
                        var lastMsg = modal.getMessages()[ modal.getMessages().length - 1 ];
                        if ( callback ) callback( item.token, Service.PPMessage.getMessageSummary( lastMsg ) );
                        return;
                    }
                    
                    // 2. try to find from item.latest_message
                    if ( item.latest_message ) {
                        new Service
                            .ApiMessageAdapter( Service.$json.parse( item.latest_message.message_body ) )
                            .asyncGetPPMessage( function( ppMessage, success ) {

                                if ( success ) {
                                    if ( callback ) callback( item.token, success ? ppMessage.getMessageSummary() : "" );
                                }
                                
                            } );
                    }
                    break;

                case Service.$conversationManager.TYPE.GROUP:
                    if ( callback ) callback( item.token, item.group_desc );
                    break;
                }
            } );   
        }
        
    }
    
} )();

//
// conversation-panel manage :
//
// - conversation-list : `MODE.LIST`
// - conversation-content : `MODE.CONTENT`
// - conversation-waiting : `MODE.WAITING`
//
Ctrl.$conversationPanel = ( function() {

    var MODE = { LIST: 'LIST', CONTENT: 'CONTENT', WAITING: 'WAITING' },
        cMode = MODE.CONTENT,
        POLLING_QUEUE_LENGTH_EVENT_ID = 'POLLING_QUEUE_LENGTH_EVENT_ID';

    subscribeEvent();

    //////// API //////////
    return {
        MODE: MODE,
        mode: mode,

        stopPollingWaitingQueueLength: stopPollingWaitingQueueLength
    }

    ////// Implementation //

    function mode( m ) { //Query current mode
        
        if ( m === undefined ) {
            return cMode;    
        }

        cMode = m;

        switch ( cMode ) {
        case MODE.LIST:
            modeList();
            stopPollingWaitingQueueLength();
            break;

        case MODE.CONTENT:
            // Strictly speaking ... We show `dropDownMenu` should decide by the conversation members should > 1
            // for simply, we always show it here, the count of conversation's members seldom not > 1
            View.$sheetHeader.showDropDownButton();
            View.$sheetHeader.showGroupButton(); // show group button
            stopPollingWaitingQueueLength();
            break;

        case MODE.WAITING:
            modeList();
            View.$groupContent.hide();
            Ctrl.$conversationContent.hide();
            View.$loading.show();
            Ctrl.$sheetheader.setHeaderTitle( Service.Constants.i18n( 'WAITING_AVALIABLE_CONVERSATION' ) );
            startPollingWaitingQueueLength();
            break;
        }
    }

    // =======helpers==========

    function modeList() {
        Service.$schedule.cancelAll(); // Cancel all sechedule tasks
        View.$sheetHeader.hideGroupButton();
        View.$sheetHeader.hideDropDownButton();
        Ctrl.$groupMembers.hide();
    }

    function subscribeEvent() {
        var $pubsub = Service.$pubsub,
            $conversationManager = Service.$conversationManager,
            WAITING_TOPIC = $conversationManager.EVENT.WAITING,
            AVALIABLE_TOPIC = $conversationManager.EVENT.AVALIABLE,
            TIMEOUT_DELAY = 200;
        
        $pubsub.subscribe( WAITING_TOPIC, function( topics, data ) {
            //
            // Only when the launcher is not showing ( that is: messagePanel is showing ),
            // we enter to `MODE.WAITING` mode.
            //
            // We should call the api `Ctrl.$launcher.get().isLauncherShow` after
            // the ( hide launcher && show messagePanel ) css animation finished ( about 300ms ) here, otherwise,
            // we may get a wrong value here ( because the css animation is executing )
            //
            $timeout( function() {

                !Ctrl.$launcher.get().isLauncherShow() && mode( MODE.WAITING );
                
            }, TIMEOUT_DELAY );            
        } );

        $pubsub.subscribe( AVALIABLE_TOPIC, function( topics, data ) {
            if ( mode() !== MODE.WAITING ) return;
            
            Ctrl.$sheetheader.setHeaderTitle();
            
            View.$groupContent.hide();
            Ctrl.$conversationContent.show(
                Service.$conversationManager.activeConversation(),
                { fadeIn: false, delay: 0 },
                function() {
                    mode( MODE.CONTENT );
                    View.$loading.hide();
                    View.$composerContainer.focus();
                } );
        } );
    }

    function startPollingWaitingQueueLength() {
        Service.$polling.run( { eventID: POLLING_QUEUE_LENGTH_EVENT_ID,
                                apiFunc: Service.$api.getWaitingQueueLength,
                                apiRequestParams: { app_uuid: Service.$app.appId() },
                                onGet: onGet } );
    }

    function stopPollingWaitingQueueLength() {
        Service.$polling.cancel( { eventID: POLLING_QUEUE_LENGTH_EVENT_ID } );
        Service.$conversationAgency.cancel();
        View.$loading.hide();
    }

    function onGet( response, success ) {
        if ( success ) {
            var text = Service.$tools.format( Service.Constants.i18n( 'WAITING_LENGTH_HINT' ), response.length );
            View.$loading.text( text );
        }
    }
    
} )();

Ctrl.$emojiSelector = ( function() {

    var instance;
    
    return {
        get: function() {
            if ( !instance ) {
                instance = new PPEmojiSelectorCtrl();
            }
            return instance;
        }
    }

    function PPEmojiSelectorCtrl() {
        Ctrl.PPBaseCtrl.call(this);

        var _groupIndex = -1,
            self = this,

            chatBoxSelector = "#pp-composer-container-textarea",
            emojiSelector = '#pp-emoji-selector',

            // find $(emoji) at the specified index
            findEmoji = function(index) {
                var selector = '#pp-emoji-selector-content > span:eq(' + index + ')';
                return $(selector);
            },

            // find $(groupEmoji) at the sepcified index
            findGroupEmoji = function(index) {
                var selector = '.pp-emoji-selector-panel-header span:eq(' + index + ')';
                return $(selector);
            },

            // get group title by groupIndex
            findGroupTitle = function(index) {
                return self.getDefaultEmojiGroup()[index].title;
            };
        
        this._showSelector = false;

        this.toggleSelector = function() {
            this._showSelector = !this._showSelector;
            this.showSelector(this._showSelector);
            View.$composerContainer.focus();
        };

        this.showSelector = function(show) {
            this._showSelector = show;
            this.show(emojiSelector, this._showSelector);
            this.show('#pp-emoji-selector-sibling', this._showSelector);
        };

        this.getDefaultEmojiGroup = function() {
            return [{
                value: Service.$emoji.getEmojiCode('People', 'smile').value,
                title: 'People'
            },{
                value: Service.$emoji.getEmojiCode('Nature', 'cherry_blossom').value,
                title: 'Nature'
            },{
                value: Service.$emoji.getEmojiCode('Objects', 'bell').value,
                title: 'Objects'
            },{
                value: Service.$emoji.getEmojiCode('Places', 'blue_car').value,
                title: 'Places'
            },{
                value: Service.$emoji.getEmojiCode('Symbols', 'capital_abcd').value,
                title: 'Symbols'
            }];
        };

        this.onEmojiIconClicked = function(index, emoji) {

            //get emoji body
            var txtToAdd = findEmoji(index)[0].textContent;

            if (!$(chatBoxSelector).val()) {
                this.showSelector(false);

                // Send emoji message
                new Service.PPMessage.Builder('EMOJI')
                    .emojiMessageCode(txtToAdd)
                    .build().send();
                
            } else {
                //find insert position
                var caretPos = document.getElementById("pp-composer-container-textarea").selectionStart;
                var textAreaTxt = $(chatBoxSelector).val();
                var text = textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos);
                //insert emoji to textarea
                $(chatBoxSelector).val(text);
                //focus , move cursor to the right position
                $(chatBoxSelector)[0].focus();
                $(chatBoxSelector)[0].setSelectionRange(caretPos + txtToAdd.length, caretPos + txtToAdd.length);

                View.$composerContainer.fixInputRows();
            }
        };

        this.onEmojiIconMouseOver = function(index, emoji) {
            findEmoji(index).css({
                'background-color': '#E4E4E4'});
        };

        this.onEmojiIconMouseLeave = function(index, emoji) {
            findEmoji(index).css({
                'background-color': '#FFF'});
        };

        /**
         * Emoji group icon on mouse leave event
         */
        this.onEmojiGroupIconMouseLeave = function(groupIndex) {
            // Same group
            if (_groupIndex == groupIndex) return;
            
            findGroupEmoji(groupIndex).css('background-color', View.Style.Color.base);
        };

        /**
         * Emoji group icon on mouse over event
         */
        this.onEmojiGroupIconMouseOver = function(groupIndex) {
            // Same group
            if (_groupIndex == groupIndex) return;
            
            findGroupEmoji(groupIndex).css('background-color', View.Style.Color.base_darker);
        };

        /**
         * filter emoji function
         */
        this._filterEmojiFunc = function(emojiKey) {
            var that = this;
            if (Service.$device.isIE()) {
                var index = $.inArray(emojiKey, that._IE_EMOJI_FILTER_ARRAY);
                return index >= 0;
            } else if (Service.$device.isWindowsPlatform()) {
                if (Service.$device.isFirefox()) {
                    var index = $.inArray(emojiKey, that._WINDOWS_FIREFOX_EMOJI_FILTER_ARRAY);
                    return index >= 0;
                }
            }
            return false;
        };

        this.selectGroup = function(groupIndex) {
            // Same group
            if (_groupIndex == groupIndex) return;
            
            var _groupItems = [],
                _cacheGroupIndex = _groupIndex,
                groupTitle = findGroupTitle(groupIndex);

            // Cache group index
            _groupIndex = groupIndex;
            
            // Filter Emojis to _groupItems
            var emojis = Service.$emoji.getEmojiGroup(groupTitle, this._filterEmojiFunc);
            for (var emoji in emojis) {
                var obj = emojis[emoji];
                _groupItems.push({
                    value: obj.value,
                    title: obj.title
                });
            }

            // Clear last active group css style
            if (_cacheGroupIndex != -1) {
                findGroupEmoji(_cacheGroupIndex).removeClass('active');   
            }
            // Active the new group one
            findGroupEmoji(groupIndex).removeAttr('style').addClass('active');

            // update emojis under the group
            this.empty('.pp-emoji-selector-content');

            var self = this;
            var html = '';
            $.each(_groupItems, function(index, item) {
                html += new View.PPEmojiIcon(item, index, self).getElement()[0].outerHTML;
            });
            $('.pp-emoji-selector-content').append(html);

        };
        
    }
    extend(PPEmojiSelectorCtrl, Ctrl.PPBaseCtrl);

    PPEmojiSelectorCtrl._IE_EMOJI_FILTER_ARRAY = ['grinning', 'stuck_out_tongue', 'open_mouth', 'confused'];
    PPEmojiSelectorCtrl._WINDOWS_FIREFOX_EMOJI_FILTER_ARRAY = ['grinning', 'stuck_out_tongue', 'open_mouth', 'confused'];
    
} )();

Ctrl.$groupMembers = ( function() {

    ////////// API /////////////
    return {
        show: show,
        hide: hide,
        isShow: isShow,

        onMemberClicked: triggerMemberClickEvent
    }

    //////// Implementation ////////

    function show() {

        // 1. get current group identifier
        var token = findConversationId();

        // 2. show it
        View.$sheetHeader.changeDropDownButtonToShowState();
        View.$groupMembers.show( token );
        
    }

    function hide( animate ) {

        // 1. get current group identifier
        var token = findConversationId();

        // 2. hide it
        View.$sheetHeader.changeDropDownButtonToHideState();
        View.$groupMembers.hide( token, animate );
        
    }

    function isShow() {
        return View.$groupMembers.isShow();
    }

    function findConversationId() {
        var activeConversation = Service.$conversationManager.activeConversation();
        return activeConversation && activeConversation.token;
    }

    function triggerMemberClickEvent( userId, callback ) {
        
        Service.$conversationManager.asyncGetConversation( {
            user_uuid: userId
        } , function ( conversation ) {
            
            conversation && Service.$conversationManager.activeConversation( conversation.token );
            Ctrl.$conversationContent.show( conversation );

            $onResult( undefined, callback );
            
        } );
        
    }
    
} )();

/**
 *
 * [Example]:
 * var launcherHoverCardCtrl = Ctrl.$hoverCard;
 * launcherHoverCardCtrl.showHoverCard(); // 显示HoverCard
 * launcherHoverCardCtrl.hideHoverCard(); // 隐藏HoverCard
 *
 */
Ctrl.$hoverCard = (function() {

    function HoverCardController() {
        Ctrl.PPBaseCtrl.call(this);

        var _timeoutEvent = null,
            _isShowing = false,
            _isPageLoadEndShowing = false, // When PPCom load end, hoverCard will show automatically if need
            _inited = false,

            self = this,

            // jQuery Elements Selectors
            ppMessageSelector = '#pp-messenger',
            hovercardSelector = '#pp-launcher-hovercard',
            conversationSelector = '#pp-conversation',
            welcomeSelector = '#pp-launcher-hovercard-welcome',
            textareaSelector = '#pp-launcher-hovercard-textarea-textarea',
            textareaContainerSelector = '#pp-launcher-hovercard-textarea',
            textareaFocusClass = 'pp-textarea-focus',
            closeBtnSelector = '#pp-container .pp-launcher-hovercard-close',

            closeButtonIsClickedCookieKey = 'pp-showed-hovercard',
            closeButtonIsClickedCookieExpire = 30 * 24 * 3600, // 30 days

            $hoverCardView, // We use this to update html content in hovercard
            $hoverCardController, // We use this to delegate hovercard's events

            _clearTimeoutEvent = function() { //清除定时事件
                if (_timeoutEvent != null) {
                    $clearTimeout(_timeoutEvent);
                    _timeoutEvent = null;
                    return;
                }
            },

            _hasTimeoutEventPending = function() { //是否有定时事件正在执行
                return _timeoutEvent != null;
            },

            // -------------------------
            // CLOSE BUTTON EVENT START
            // -------------------------
            
            isShowCloseButton = function() { // is show close button ?
                return false;
                // var clicked = Service.$cookies.get(closeButtonIsClickedCookieKey);
                // return !clicked || clicked !== 'true';
            },

            isShowHoverCardOnPageLoadEnd = function() { // show Hovercard when inited finish ?
                return false;
                // return isShowCloseButton();
            },

            updateCloseButtonCookieState = function() { // store clicked-close-button info to cookie

                if (Service.$cookies.get(closeButtonIsClickedCookieKey) === undefined) {
                    
                    Service.$cookies.set(closeButtonIsClickedCookieKey, 'true', {
                        expires: closeButtonIsClickedCookieExpire
                    });
                    
                }

            },

            notifyUserActiveClickPPCom = function() { // user has active click `PPMessage`
                _isPageLoadEndShowing = false;

                // updateCloseButtonCookieState(); // mark user clicked
                // $(closeBtnSelector).hide(); // hide close button
            },

            // Delegate Launcher click event
            interceptLauncherClickEvent = function() {
                return $hoverCardController && $hoverCardController.interceptLauncherClickEvent(self);
            };

        /**
         * HoverCard Initialization Event
         */
        this.onHoverCardInit = function() {
            // Nothing to do, delay `this.asyncPrepareHoverCardInfo`
        };

        this.asyncPrepareHoverCardInfo = function( callback ) {
            
            if ( this.isInited() ) {
                $onResult( true, callback );
                return;
            }
            
            Service.$conversationManager.asyncGetDefaultConversation( function( response ) {

                if ( response ) {
                    
                    self.updateInitState(true); // Notify welcome info has download successful

                    var view = View.$hoverCardContentCategorySingle,
                        controller = Ctrl.$hoverCardCategorySingle,
                        hovercardWelcome = buildWelcomeInfo( response.app_name, response.app_welcome, response.user_list );

                    view.updateHoverCard( hovercardWelcome );
                    controller.delegateHoverCardInitEvent( hovercardWelcome );

                    $hoverCardView = view;
                    $hoverCardController = controller;
                    
                }

                $onResult( !!response, callback );
                
            } );
        };

        /**
         * 是否初始化成功，从网上拿来信息成功
         */
        this.isInited = function() {
            return _inited;
        };

        /**
         * 更新是否初始化成功的状态
         */
        this.updateInitState = function(success) {
            _inited = success;
        };

        this.onTextareaFocus = function() {
            $(textareaSelector).addClass(textareaFocusClass);
        };

        this.onTextareaUnFocus = function() {
            $(textareaSelector).removeClass(textareaFocusClass);        
        };

        this.onMouseOver = function() {
            this.showHoverCard();
        };

        this.onMouseLeave = function() {
            this.hideHoverCard();
        };

        /**
         * HoverCard 点击事件：
         */
        this.onHoverCardClicked = function() {
            notifyUserActiveClickPPCom();

            $hoverCardController && $hoverCardController.delegateHoverCardClickEvent(this);
        };

        /**
         * 隐藏 HoverCard，并通过动画平滑过渡到 聊天面板 界面
         */
        this.smoothTranisationToMessagePanel = function() {
            View.$hoverCard.smoothTranisationToMessagePanel();

            Ctrl.$conversationContent
                .show( Service.$conversationManager.activeConversation(), { fadeIn: false, delay: 0 }, function() {
                    View.$composerContainer.focus(); // focus
                } );
        };

        /**
         * 隐藏 HoverCard
         *
         * Note：HoverCard并不是立刻隐藏的，而是在设定了一个定时事件，默认500ms之后才会触发隐藏事件。
         *
         * 定时事件可通过`_hasTimeoutEventPending()` 查询是否存在，可通过`_clearTimeoutEvent()`来清除它
         * 
         */
        this.hideHoverCard = function() {
            _timeoutEvent = $timeout(function() {
                self.hideHoverCardNow();
            }, 500);
        };

        /**
         * 立刻隐藏 HoverCard
         */
        this.hideHoverCardNow = function() {
            if (_isPageLoadEndShowing) return; // Force user to click `close` button manually to hide me
            
            var hoverCard = $(hovercardSelector);
            hoverCard.css({transform: "315px 100%"})
                .animate({scale:.8,x:0,y:0,opacity:0}, 90, function() {
                    hoverCard.hide();
                    _isShowing = false;
                    _clearTimeoutEvent(); 
                });
        };

        /**
         * 显示 HoverCard
         */
        this.showHoverCard = function() {
            
            if (_hasTimeoutEventPending()) {
                _clearTimeoutEvent();
                return;
            }

            if (_isShowing) {
                return;   
            }

            if (!_inited) {
                return;
            }
            
            // var anim = "cubic-bezier(0.1, 0.0, 0.2, 1)";
            var hoverCard = $( hovercardSelector );
            hoverCard.stop().clearQueue().removeAttr('style');
            hoverCard.show()
                .css({ transformOrigin: "315 100%",x: 0,y: 0 })
                .animate({opacity: 0,scale: .8,x:0,y:0}, {
                    duration: 0
                })
                .animate({scale:1, x:0,y:0}, {queue: false, duration: 250})
                .animate({opacity: 1}, {
                    duration: 170
                });

            $hoverCardController && $hoverCardController.onShow();
            
            _isShowing = true;
        };

        // -------------------------
        // CLOSE BUTTON EVENT START
        // -------------------------
        this.onHovercardCloseButtonClickEvent = function(e) { // on user press close button on the right-top corner
            e.stopImmediatePropagation();

            notifyUserActiveClickPPCom();

            self.hideHoverCardNow(); // hide hovercard
        };

        this.isShowCloseButton = isShowCloseButton; // is show close button

        this.notifyUserActiveClickPPCom = notifyUserActiveClickPPCom; // On user active click `PPCom`

        this.interceptLauncherClickEvent = interceptLauncherClickEvent;

    }
    extend(HoverCardController, Ctrl.PPBaseCtrl);

    var instance = null, // singletion

        get = function() {
            if (!instance) {
                instance = new HoverCardController();
            }
            return instance;
        };
    
    return {
        get: get
    }

    ////////// Tools ///////////
    function buildWelcomeInfo ( team, welcomeText, serviceUsers ) {
        return {
            appTeamName: team,
            appWelcomeText: welcomeText,
            
            activeAdmins: (function() {
                
                var users = [];

                serviceUsers && $.each(serviceUsers, function( index, item ) {
                    
                    var infoAdapter = Service.$users.adapter( item );
                    if ( infoAdapter.user_uuid !== Service.$user.getUser().getInfo().user_uuid ) {
                        users.push( Service.$users.getOrCreateUser( infoAdapter ).getInfo() );                        
                    }

                });

                return users;
                
            })()
        };
    }
    
})();

((function(Ctrl) {

    Ctrl.$hoverCardCategorySingle = (function() {

        return {
            delegateHoverCardClickEvent: onHoverCardClick,
            delegateHoverCardInitEvent: onHoverCardInit,
            interceptLauncherClickEvent: interceptLauncherClickEvent,
            onShow: onShow
        }

        function onShow() {

            // Dynamically load the users on the welcome hovercard 
            
            var vipConversation = Service.$conversationManager.vipConversation();
            if ( vipConversation ) {
                
                Service.$conversation.asyncGetUser( vipConversation.token, function( userArray ) {

                    View.$hoverCardContentCategorySingle.updateUsers( userArray );
                    
                }, { reuse: true }); // <= reuse the exist users in local
                
            }
            
        }
        
        function interceptLauncherClickEvent($hoverCardController) {
            return false;
        }

        function onHoverCardClick($hoverCardController) {
            Ctrl.$launcher.get().hideLauncher();
            View.$launcherPreview.text( '' ).hide();
            $hoverCardController.smoothTranisationToMessagePanel();
        }

        function onHoverCardInit(appWelcomeInfo) {

            // Listen user info change event
            // appWelcomeInfo &&
            //     appWelcomeInfo.activeAdmins &&
            //     $.each(appWelcomeInfo.activeAdmins, function(index, item) {
            
            //         Service.$pubsub.subscribe('user/infochange/' + item.user_uuid, function (topics, user) {

            //             var userInfo = user.getInfo();

            //             // Change hovercard admin user_avatar
            //             $('.pp-launcher-hovercard-admins')
            //                 .find('div[user_uuid=' + item.user_uuid + ']')
            //                 .find('img')
            //                 .attr('src', userInfo.user_avatar);                     
            
            //         });
            
            //     });
        }
        
    })();
    
})(Ctrl));

// TODO: refactor
Ctrl.$launcher = (function() {

    var _launcherIcon = "",
        _clickToOpenConversation = "",
        _launcherImgWidth = 50; //50 * 50

    function PPLauncherCtrl() {

        var self = this,

            _showHoverCard = function() {
                Ctrl.$hoverCard.get().showHoverCard();
            },

            _hideHoverCard = function() {
                Ctrl.$hoverCard.get().hideHoverCard();
            };

        this.onClickEvent = function() { // Launcher onClick event
            // If hoverCard delegate launcher click event, we will not show MessageBox
            if (!Ctrl.$hoverCard.get().interceptLauncherClickEvent()) {
                var $hoverCardController = Ctrl.$hoverCard.get();
                $hoverCardController.asyncPrepareHoverCardInfo( function( prepareSucc ) {
                    self.showMessageBox();
                } );
            }
        },

        this.shouldShowLauncherWhenInit = function() { // 是否默认显示小泡
            return View.$settings.isShowLauncher();
        },

        // Open messageBox and hide Launcher
        this.showMessageBox = function() {

            var messageOnShowingOld = messageOnShowing;
            
            // clear data and hide launcher
            self.hideLauncher();
            View.$launcher.showMessageBox();

            if ( Ctrl.$conversationPanel.mode() === Ctrl.$conversationPanel.MODE.CONTENT ) {
                Ctrl.$conversationContent
                    .show( Service.$conversationManager.activeConversation(), { fadeIn: false, delay: 0 }, function() {
                        View.$composerContainer.focus(); // focus
                    } );
            }
            
        },

        this.onMouseOverEvent = function() {
            _isMouseOver = true;

            if (!this.shouldShowHoverCardOnMouseOver()) {
                return;
            }

            var $hoverCardController = Ctrl.$hoverCard.get();
            $hoverCardController.asyncPrepareHoverCardInfo( function( prepareSucc ) {
                prepareSucc && _showHoverCard();
            } );
        },

        this.onMouseLeaveEvent = function() {
            _isMouseOver = false;
            _hideHoverCard();
        },

        this.isMouseOver = function() {
            return _isMouseOver;
        },

        this.recordOpenConversationItem = function(message) {
            _clickToOpenConversation = message;
        },

        this.getLauncherIcon = function() {
            return _launcherIcon || Service.Constants.ICON_DEFAULT_LAUNCHER;
        },

        this.getLauncherBottomMargin = function() {
            return View.$settings.getLauncherBottomMargin();
        },

        this.getLauncherRightMargin = function() {
            return View.$settings.getLauncherRightMargin();
        },

        this.shouldShowHoverCardOnMouseOver = function() {
            return !Service.$device.isMobileBrowser() && Ctrl.$conversationPanel.mode() === Ctrl.$conversationPanel.MODE.CONTENT;
        },

        this.launcherInit = function() {
        },

        this.setLauncherIcon = function(icon) {
            _launcherIcon = icon;
            $('#pp-launcher-icon').attr('src', this.getLauncherIcon());
        },

        /**
         * 当前小泡是否处于显示状态
         *
         */
        this.isLauncherShow = function() {
            //Note: 不能使用 `$('#pp-launcher-button').hasClass('pp-launcher-button-maximize')` 来判断，因为在一开始`pp-launcher-button`，这两个`class`均没有
            return this.shouldShowLauncherWhenInit() && !$('#pp-launcher-button').hasClass('pp-launcher-button-minimized');
        },

        this.onLauncherInit = function() {
        },

        // unreadNumber <= 0: hidden; unreadNumber>0: show
        this.setUnreadBadgeNum = function(unreadNumber) {
            var show = unreadNumber > 0;
            _unreadBadgeNum = show ? (unreadNumber > 99 ? 99 : unreadNumber) : 0;
            show ? $( '#pp-launcher-badge' ).show() : $( '#pp-launcher-badge' ).hide();
            $('#pp-launcher-badge').text(_unreadBadgeNum);
        },

        this.getUnreadBadgeNum = function() {
            return _unreadBadgeNum;
        },

        this.clear = function() {
            _unreadBadgeNum = 0;
            _launcherIcon = "";
            _clickToOpenConversation = "";
        },

        /**
         * Hide launcher
         */
        this.hideLauncher = function() {
            View.$launcher.hideLauncher();

            this.setUnreadBadgeNum(0);
            this.setLauncherIcon("");

            // clearn message on showing
            messageOnShowing = undefined;
        };

        // on message arrived ...
        Service.$pubsub.subscribe('msgArrived/launcher', function(topics, ppMessage) {
            
            self.setUnreadBadgeNum( self.getUnreadBadgeNum() + 1 );
            self.setLauncherIcon( ppMessage.getBody().user.avatar );
            self.recordOpenConversationItem( ppMessage.getBody() );

            // record the new one
            // so when we click launcher, directyle open chating panel, rather than group list panel
            messageOnShowing = ppMessage.getBody();
            
        });
        
    };

    var _unreadBadgeNum = 0,
        _isMouseOver = false,
        messageOnShowing,

        instance,

        get = function() {
            if (!instance) {
                instance = new PPLauncherCtrl();
            }
            return instance;
        };
    
    return {
        get: get,
    }
    
})();

Ctrl.$pulltoRefreshController = (function() {

    function PulltoRefreshController() {
        Ctrl.PPBaseCtrl.call(this);

        var Constants = Service.Constants,
            device = Service.$device,
            
            inMobile = device.isMobileBrowser(),
            loadHistoryHintText = inMobile ? Constants.i18n('LOAD_HISTORY_MOBILE_HINT') : Constants.i18n('LOAD_HISTORY_HINT'),
            loadingHistoryText = Constants.i18n('LOADING_HISTORY'),
            noMoreHistoryText = Constants.i18n('NO_MORE_HISTORY'),
            
            loadable = true, // can load history

            self = this,

            conversationContentCtrl,

            selector = '#pp-conversation-part-pulltorefreshbutton',
            conversationContentSelector = '#pp-conversation-content',

            onEndEventCallback = null, // onend event

            // bind pull2refresh event
            bindPull2RefreshEvent = function() {
                $(conversationContentSelector).pullToRefresh()
                
                    .on("start.pulltorefresh", function (evt, y){
                        Service.$debug.d('Start!! ' + evt + ', '+y)
                    })
                
                    .on("move.pulltorefresh", function (evt, percentage){
                        Service.$debug.d('Move.. ' + evt + ', '+percentage)
                    })
                
                    .on("end.pulltorefresh", function (evt){
                        Service.$debug.d('End.. ' + evt);

                        onEndEventCallback && onEndEventCallback(evt); // callback onend event
                    })
                
                    .on("refresh.pulltorefresh", function (evt, y){
                        Service.$debug.d('Refresh.. ' + evt + ', '+y)
                        loadHistory();
                    });
            },

            beforeRefreshContentView = function() {
                // We destroy `pulltorefresh` button we begin loading
                $(selector).remove();
            },

            afterRefreshContentView = function(historyArray) {
                var hasMoreHistory = conversationContentCtrl.isLoadable(),
                    text = hasMoreHistory ? loadHistoryHintText : noMoreHistoryText;

                // After `refresh` we add `pulltorefresh` button again
                $(conversationContentSelector).prepend(View.$pulltoRefresh.build(text).getHTML());
                setLoadable(hasMoreHistory);

                self.bindEvent();
            },

            loadHistory = function() {
                // on loading state or no more history state
                if (!loadable) return;

                // change text to indicate loading
                $(selector).text(loadingHistoryText);
                setLoadable(false);

                conversationContentCtrl.loadHistorys(function() {
                    // begin loading
                    beforeRefreshContentView();
                }, function(list) {
                    afterRefreshContentView(list);
                });

            },

            setLoadable = function(click) {
                loadable = click;
                $(selector).css('cursor', loadable ? 'pointer' : 'default');
            };
        
        this.getLoadHistortyHintText = function() {
            return loadHistoryHintText;
        };

        this.onLoadHistoryButtonClick = function() {
            if (!inMobile) loadHistory();
        };

        this.loadable = function(loadable) {
            setLoadable(loadable);
            $(selector).text(loadable ? loadHistoryHintText : noMoreHistoryText);
            return this;
        };

        this.bindEvent = function() {
            // in mobile
            // bind `pull-to-refresh` event
            if (inMobile) {
                bindPull2RefreshEvent();
            } else {
                // bind click event on `pc`
                View.$pulltoRefresh.el().bind('click', self.onLoadHistoryButtonClick);
            }
            return this;
        };

        this.onend = function(onEndEvent) { // pulltorefresh onend callback
            onEndEventCallback = onEndEvent;
            return this;
        };

        this.init = function( $conversationContentCtrl ) {
            // The `pulltorefresh` view will try to call `get()` method with empty params
            // So we should prevent empty `$conversationContentCtrl` assigned to `$pulltoRefresh` controller
            if ( $conversationContentCtrl ) {
                conversationContentCtrl = $conversationContentCtrl
            }
            return this;
        };
    }
    extend(PulltoRefreshController, Ctrl.PPBaseCtrl);

    var instance = null,

        get = function( $conversationContentCtrl ) {
            if (instance == null) {
                instance = new PulltoRefreshController();
            }
            return instance.init( $conversationContentCtrl );
        };
    
    return {
        get: get
    }
    
})();

Ctrl.$sheetheader = (function() {

    var $device = Service.$device;

    return {
        onSheetHeaderInit: onSheetHeaderInit,
        
        getHeaderTitle: getHeaderTitle,
        onSheetHeaderClicked: onSheetHeaderClicked,
        setHeaderTitle: setHeaderTitle,
        
        minimize: minimize,
        closed: closed,
        
        incrUnread: incrUnread,
        decrUnread: decrUnread,
    }

    ///////// Implenmentation ///////
    function minimize() {

        // We disable body scroll when user click launcher in mobile browser,
        // So we need to enable it again when the user press minimize button
        // @see `launcherctrl.js` `showMessageBox` methods
        if ($device.isIOS()) {
            $device.enableScroll();
        }

        View.$launcher.showLauncher();
        View.$conversation.hide();

        // Cancel all sechedule tasks
        Service.$schedule.cancelAll();
        Service.$sheetHeader.close(false);

        cancelAnyWaitingToCreateConversations();

    }

    function getHeaderTitle() {
        return Service.$sheetHeader.getHeaderTitle();
    }

    function onSheetHeaderClicked() {
        Ctrl.$emojiSelector.get().showSelector(false);
    }

    function setHeaderTitle(title) {
        title = title || getHeaderTitle();
        Service.$sheetHeader.setHeaderTitle(title);
        View.$sheetHeader.setTitle(title);
    }

    function closed() {
        return Service.$sheetHeader.closed();
    }

    function onSheetHeaderInit() {
        Service.$sheetHeader.asyncGetHeaderTitle(function(title) {
            setHeaderTitle(title);
        });

        // decide should show group button, when app init
        Service.$conversationManager.asyncGetList( function( conversationList ) {

            var len = ( conversationList || [] ).length;
            // more than one conversations, so show `conversations` button in the sheetHeader
            if ( len > 1 ) {
                View.$sheetHeader.showGroupButton();
            }
            
        } );
        
    }

    function incrUnread() {
        Service.$sheetHeader.incrUnreadCount();
        View.$sheetHeader.setUnreadCount(Service.$sheetHeader.unreadCount());
    }

    function decrUnread( count ) {
        Service.$sheetHeader.decrUnreadCount ( count );
        View.$sheetHeader.setUnreadCount(Service.$sheetHeader.unreadCount());
    }

    function cancelAnyWaitingToCreateConversations() {
        var $conversationAgency = Service.$conversationAgency,
            inRequestingGroupConversation = $conversationAgency.isRequestingGroupConversation(),
            DELAY_TIME = 300; // Waiting the css animation completed

        Ctrl.$conversationPanel.stopPollingWaitingQueueLength();
        $timeout( function() {
            setHeaderTitle();
            // resume to `MODE.LIST` mode if we are waiting group conversations
            inRequestingGroupConversation && Ctrl.$conversationList.show();
            // resume to `MODE.CONTENT` mode if we are waiting default conversations
            !$conversationAgency.isDefaultConversationAvaliable() &&
                Ctrl.$conversationPanel.mode( Ctrl.$conversationPanel.MODE.CONTENT );
        }, DELAY_TIME );
    }
    
})();

((function(Ctrl) {

    function PPUploadingBarCtrl() {
        Ctrl.PPBaseCtrl.call(this);

        var _updateWidth = function(fileUploadId) {
            var w = Service.$fileUploader.getUploadProgress(fileUploadId);
            if (w < 0) {
                return;
            }
            if (w <= 100) {
                $('#pp-uploading-bar-state-' + fileUploadId).css('width', w + "%");
                $timeout(function() {
                    _updateWidth(fileUploadId);
                }, 100);
            }
        };
        
        this.init = function(data, fileUploadId) {

        };

        this.onUploadingBarRemoveBtnClicked = function(fileUploadId, data) {
            Service.$uploader.cancel(fileUploadId);
        };
    }
    extend(PPUploadingBarCtrl, Ctrl.PPBaseCtrl);

    Ctrl.PPUploadingBarCtrl = PPUploadingBarCtrl;
    
})(Ctrl));

((function(Modal) {

    function ConversationContentModal(groupId) {
        
        var $api = Service.$api, // $api Service
            $json = Service.$json, // $json Service
            $tools = Service.$tools,

            id = groupId, // group identifier

            self = this,

            inMobile = Service.$device.isMobileBrowser(), // is in mobile

            isAddedWelcomeInfo = false,
            loadable = true, // can load history (has more historys)
            unreadCount = 0, // unread count associated with this group `id`

            // add PCWelcome msg
            getPCWelcomeMsg = function(appProfileInfo) {

                if (!appProfileInfo) return;
                
                var Builder = Service.PPMessage.Builder,

                    welcome = {
                        appTeamName: appProfileInfo.appTeamName,
                        appWelcomeText: appProfileInfo.appWelcomeText,
                        activeAdmins: appProfileInfo.activeAdmins
                    },

                    welcomeMsg = new Builder( 'WELCOME' )
                    .messageState( 'FINISH' )
                    .conversationId(Service.$tools.getUUID())
                    .welcomeBody(welcome)
                    .build()
                    .getBody();
                
                return welcomeMsg;
            },

            getMobileWelcomeMsg = function() { // add mobile welcome msg
                var Builder = Service.PPMessage.Builder,
                    // welcome text in mobile
                    welcomeText = Service.Constants.i18n('WELCOME_MSG'),
                    // welcome msg in mobile
                    welcomeMsg = new Builder('TEXT')
                    .messageState('FINISH')
                    .conversationId(Service.$tools.getUUID())
                    .textMessageBody(welcomeText)
                    .admin(true)
                    .userName(Service.Constants.i18n('DEFAULT_SERVE_NAME'))
                    .build()
                    .getBody();

                return welcomeMsg;
            },

            getWelcomeMsg = function ( welcomeInfo ) {
                
                // Welcome msg
                if (inMobile) {
                    // return getMobileWelcomeMsg();
                } else {
                    // if welcomeInfo fetched from server is presented
                    if (welcomeInfo) {
                        return getPCWelcomeMsg(welcomeInfo);
                    }
                }
                
            },

            pushWelcomeMessage = function( messageArray, welcome ) {

                if ( welcome ) {
                    isAddedWelcomeInfo = true;
                    messageArray.push ( welcome );    
                }
                
                return messageArray;
            },

            getInitChatMessages = function() {
                return pushWelcomeMessage( [], getWelcomeMsg() );
            },
            
            chatMessages = getInitChatMessages(), // Store messages
            chatMessagesIds = [], // Cache messages Ids (for check is message exist) if message.id exist
            
            isMessageIdExist = function(messageId) {
                return $.inArray(messageId, chatMessagesIds) != -1;
            },
            isMessageExist = function(msg) { // Is message exist
                
                if (!msg.messageId) return false;
                
                return isMessageIdExist(msg.messageId);
            },

            DEFAULT_PAGE_SIZE = 20, // Default page size 
            loadMessageHistorysPageOffset = 0, // message history page offset
            loadMessageHistorysPageSize = DEFAULT_PAGE_SIZE, // current page size
            loadMessageHistorysMaxId = null, // max id
            loadMessageHistorys = function(conversationId, callback) { // get message historys by conversationId

                // conversation id is empty
                if (!conversationId) {
                    if (callback) callback([]);
                    return;
                }
                
                // get message history by api
                $api.getMessageHistory({
                    conversation_uuid: conversationId,
                    page_offset: loadMessageHistorysPageOffset,
                    page_size: loadMessageHistorysPageSize,
                    max_id: loadMessageHistorysMaxId
                }, function(response) { // On get message history success callback

                    // Update page offset and max id for next load
                    loadMessageHistorysPageOffset++;
                    loadMessageHistorysMaxId = loadMessageHistorysMaxId ? loadMessageHistorysMaxId : (response.list.length > 0 ? response.list[0].uuid : null);

                    // Convert response api message array to ppMessage array
                    var ppMessageArray = [];
                    (function apiMessageArrayToPPMessageArray(index, length, apiMessageArray, completeCallback) {

                        if (index < length) {
                            new Service.ApiMessageAdapter($json.parse(apiMessageArray[index].message_body))
                                .asyncGetPPMessage(function(ppMessage, succ) {
                                    
                                    // If not exist , add it 
                                    if (succ && !isMessageExist(ppMessage.getBody())) {
                                        ppMessageArray.push(ppMessage.getBody());
                                    }
                                    apiMessageArrayToPPMessageArray(index + 1, length, apiMessageArray, completeCallback);
                                });
                        } else {
                            // complete
                            if (completeCallback) completeCallback();
                        }
                        
                    })(0, response.list.length, response.list, function() {
                        
                        // apiMessageArray -> ppMessageArray completed
                        //
                        // HISTORY MESSAGE ORDER
                        // |     newer      | <-- big timestamp
                        // |     ......     |
                        // |     older      | <-- small timestamp
                        //
                        // We need to add history message timestamp to array here:
                        //
                        //
                        var messageHistorysWithTimestamp = addTimestampsToHistoryMessageArrays(ppMessageArray);
                        // Store message historys to `chatMessages`
                        unshiftMessageArrays(messageHistorysWithTimestamp);
                        if (callback) callback(messageHistorysWithTimestamp);
                        
                    });
                    
                }, function(error) { // On get message history error callback
                    if (callback) callback([]);
                });
                
            },

            DEFAULT_MESSAGE_TIMESTAMP_DELAY = 5 * 60, // 5 minutes

            messageTimestampDelay = DEFAULT_MESSAGE_TIMESTAMP_DELAY,

            // |     new-01     |
            // |     new-02     |
            // |     .....      |
            // |     new-xx     | <-- `lastMessageTimestamp`
            lastMessageTimestamp = null, // last message timestamp

            // |     old-01     |
            // |     old-02     |
            // |     ......     |
            // |     old-20     | <-- `historyMoreOldMessageTimestamp`
            historyMoreOldMessageTimestamp = null, // history more old message timestamp
            
            shouldAddMessageTimestamp = function(msg) {
                
                var lastTimestamp = lastMessageTimestamp,
                    newTimestamp = msg.messageTimestamp,
                    shouldUpdateLastTimestamp = Service.$messageToolsModule.isMessage(msg);

                // Update lastMessageTimestamp if need
                lastMessageTimestamp = shouldUpdateLastTimestamp ?
                    (newTimestamp ? newTimestamp : lastMessageTimestamp) : lastMessageTimestamp;

                if (!shouldUpdateLastTimestamp || !newTimestamp ) return false; // not a legal message
                
                if (!lastTimestamp) return true; // normally , if lastTimestamp is not set, meaning this message is the first message
                
                if (newTimestamp - lastTimestamp <= messageTimestampDelay) return false;

                return true;
            },

            // Return history message arrays with timestamps
            addTimestampsToHistoryMessageArrays = function(historyMessageArray) {
                if (!historyMessageArray) return historyMessageArray;

                // Empty, meaning we have reached the begining of the whole historys
                if (historyMessageArray.length === 0) {
                    if (historyMoreOldMessageTimestamp != null) {
                        historyMessageArray.push(buildTimestampMessage(historyMoreOldMessageTimestamp));
                        historyMoreOldMessageTimestamp = null; // Then , we reset to `null`
                    }
                    return historyMessageArray;
                }

                var resultArray = []; // store result

                var lastOne = historyMoreOldMessageTimestamp || historyMessageArray[0].messageTimestamp;
                $.each(historyMessageArray, function(index, item) {
                    
                    var shouldAdd = lastOne - item.messageTimestamp > messageTimestampDelay;
                    if (shouldAdd) {
                        resultArray.unshift(buildTimestampMessage(lastOne)); // push timestamp if need
                    }

                    resultArray.unshift(item); // push message

                    lastOne = item.messageTimestamp;
                });

                // Cache timestamp
                historyMoreOldMessageTimestamp = historyMessageArray[historyMessageArray.length - 1].messageTimestamp;
                
                return resultArray;
            },

            // add message arrays (generally: history message arrays) to head of `chatMessages` array
            // @description
            //     assume `chatMessages` = [a,b,c];
            //            `messageArrays` = [1,2,3,4,5];
            //
            //     result `chatMessages` would be `[1,2,3,4,5,a,b,c]`
            unshiftMessageArrays = function(messageArrays) {
                if (!messageArrays || messageArrays.length == 0) return;

                var reverseArr = messageArrays.slice().reverse(); // make a copy
                $.each(reverseArr, function(index, item) {
                    chatMessages.unshift(item);
                });
            },
            
            buildTimestampMessage = function(messageTimestamp) {

                var time = messageTimestamp * 1000,
                    timeStr = Service.Constants.I18N[Service.$language.getLanguage()].timeFormat(time);
                
                return new Service.PPMessage.Builder( 'TIMESTAMP' )
                    .id($tools.getUUID())
                    .timestampBody({
                        time: time,
                        timeStr: timeStr
                    })
                    .messageState( 'FINISH' )
                    .build()
                    .getBody();
                
            };

        // add a new messageId
        this.updateMessageIdsArray = function(messageId) {
            if (!isMessageIdExist(messageId)) {
                chatMessagesIds.push(messageId);   
            }
        };

        // Clear data
        this.clear = function() {
            chatMessages = [];
            chatMessagesIds = [];

            loadMessageHistorysPageOffset = 0;
            loadMessageHistorysMaxId = null;

            lastMessageTimestamp = null;
        };

        // load message history
        this.getConversationHistory = function(conversationId, callback) {
            loadMessageHistorys(conversationId, callback);
        };

        // Append a new messgae
        // @return if should append timestamp, return timestamp message, else null.
        this.addMessage = function(msg) {
            
            // message exist
            if (msg.messageId && isMessageExist(msg)) return null;

            // check and decide whether or not should add timestamp message
            var addTimestampMessage = shouldAddMessageTimestamp(msg);
            var timestampMsg = null;
            if (addTimestampMessage) {
                timestampMsg = buildTimestampMessage(msg.messageTimestamp);
                chatMessages.push(timestampMsg);
            }
            
            chatMessages.push(msg); // append it
            Service.$messageStore.map( msg.messageId, id ); // append it to global message store
            
            // append message id
            if (msg.messageId) self.updateMessageIdsArray(msg.messageId);

            return timestampMsg;
        };

        // find msg by msgId
        this.find = function ( msgId ) {
            if ( !isMessageIdExist( msgId ) ) return;

            var len = chatMessages.length;
            while( len-- ) {
                if ( chatMessages [ len ].messageId === msgId ) {
                    return chatMessages [ len ];
                }
            }
            return msgId;
        };

        // Is chat messages empty
        this.isEmpty = function() {
            return chatMessages.length == 0;
        };

        // get all messages
        this.getMessages = function() {
            return chatMessages;
        };

        // Can load more historys
        this.setLoadable = function(l) {
            loadable = l;
        };

        // Is historys loadable
        this.isLoadable = function() {
            return loadable;
        };

        // can add welcomeInfo
        this.canAddWelcomeInfo = function() {
            return this.isEmpty() && !isAddedWelcomeInfo;
        };

        // push welcome info
        this.addWelcomeInfo = function(welcomeInfo) {
            var welcome = getWelcomeMsg( welcomeInfo );
            pushWelcomeMessage( this.getMessages(), welcome );
            return welcome;
        };

        // -----------
        // UNREAD COUNT
        // -----------
        this.unreadCount = function() {
            return unreadCount;
        };

        this.incrUnreadCount = function() {
            unreadCount++;            
        };

        this.clearUnread = function() {
            unreadCount = 0;
        };

        this.token = function() {
            return id;
        };
    }

    Modal.ConversationContentModal = ConversationContentModal;
    
})(Modal));

Modal.$conversationContentGroup = (function() {

    var conversationContentArray = {
        // broadcast: modal of `broadcast`,
        // 
        // group_uuid_1: modal of `group_uuid_1`,
        // group_uuid_2: modal of `group_uuid_2`,
        // ...
    };

    return {
        get: get,
        set: set,
        exist: exist
    }

    function set( groupIdentifier, modal ) {
        
        if ( !modal ) throw new Error('Modal == null');
        if ( exist( groupIdentifier ) ) throw new Error('Modal ' + groupIdentifier + ' exist!');

        conversationContentArray [ groupIdentifier ] = modal;
    }

    // @param groupIdentifier:
    //            group_uuid or null('broadcast')
    //
    function get( groupIdentifier ) {
        
        var modal;
        if ( !exist( groupIdentifier ) ) {
            modal = conversationContentArray [ groupIdentifier ] = create( groupIdentifier );
        } else {
            modal = conversationContentArray [ groupIdentifier ];                
        }
        
        return modal;
    }

    function exist( groupIdentifier ) {
        return conversationContentArray [ groupIdentifier ] !== undefined;
    }

    function create( groupIdentifier ) {
        return new Modal.ConversationContentModal( groupIdentifier );
    }
    
})();

// Boot all services when create fn
Service.PPStartUp.bootServices();

return fn;
}

function PPModule(jQuery) {
    
    var fn,

        buildFn = function(jQuery) { // build a NEW ppmessage instance
            return PPMessage(jQuery);
        },
        
        getFn = function(jQuery) { // get a fn
            if (!existFn()) {
                fn = buildFn(jQuery);

                // Faciliate our debug to see the inner world of `PP` object by call `PP.fn.xxx`
                // Consider to remove this line when put `PP` on release mode
                PP.fn = fn;
            }
            return fn;
        },

        existFn = function() { // Does fn exist ?
            return fn !== undefined;
        },

        cleanFn = function() { // Clear fn
            fn = undefined;
        },

        PP = {

            /**
             * major.minor.status.revision
             *
             * status: 0 for alpha
             *         1 for beta
             *         2 for release candiate
             *         3 for (final) release
             */
            version : '0.2.0.6',

            /**
             * Boot PPCom with ppSettings
             */
            boot : function(ppSettings, callback) {
                ppSettings = ppSettings || window.ppSettings;
                ppSettings && getFn(jQuery).Service.$publicApi.boot(ppSettings, callback);
            },

            /**
             * Show PPCom MessageBox
             */
            show : function() {
                existFn(jQuery) && getFn(jQuery).Service.$publicApi.show();
            },

            /**
             * Hide PPCom MessageBox
             */
            hide : function() {
                existFn(jQuery) && getFn(jQuery).Service.$publicApi.hide();
            },

            /**
             * PPCom MessageBox onShow event callback
             */
            onShow : function(event) {
                existFn(jQuery) && getFn(jQuery).Service.$publicApi.onShow(event);
            },

            /**
             * PPCom MessageBox onHide event callback
             */
            onHide : function(event) {
                existFn(jQuery) && getFn(jQuery).Service.$publicApi.onHide(event);
            },

            /**
             * This method will effectively clear out any user data that you have been passing through the JS API. 
             * You should call the shutdown method anytime a user logs out of your application.
             *
             * [Note]: This will cause PPCom fully dismiss from your application.
             */
            shutdown : function() {
                existFn(jQuery) && getFn(jQuery).Service.$publicApi.shutdown();
                cleanFn();
            },

            /**
             * Update PPCom by ppSettings
             */
            update : function(ppSettings) {
                ppSettings = ppSettings || window.ppSettings;
                if ( existFn(jQuery) && getFn(jQuery).Service.$publicApi.update(ppSettings) ) {
                    PP.shutdown();
                    PP.boot(ppSettings);
                }
            }

        };

    return PP;
    
}

function JQueryModule () {

return jQuery.noConflict(true);
}

((function() {
    
    var w = window;
    if ( w &&
         ( w.PP === undefined || w.pp === null ) ) {
        w.PP = PPModule(JQueryModule());
        w.ppSettings && w.PP.boot();
    }
    
})());

/**
 * 用以方便合并文件，放在最终合并文件的最末尾
 *
 */
})());
