( function() {

    if ( window ) {

        if ( window.ppconsole === undefined ) {
            
            window.ppconsole = {
                
                /**
                 * major.minor.status.revision
                 * 
                 * 0.0.0.1 ppmessage.cn
                 * 0.0.0.2 github/ppmessage.com
                 *
                 */
                version : '0.0.0.2'
                
            };
            
        }

    }
    
} )();

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


angular.module("this_app.services", []);

angular.module("this_app", [
    "720kb.tooltips",
    "base64",
    "ngCookies",
    "ngAnimate",
    "toastr",
    "angularUtils.directives.dirPagination",
    "angularFileUpload",
    "blockUI",
    "ui.router",
    "ngMaterial",
    "this_app.constants",
    "this_app.i18n",
    "this_app.route",
    "this_app.services",
])

    .run(function($rootScope, $location, $timeout) {
        if (window.PP) {
            PP.boot({
                app_uuid: 'a600998e-efff-11e5-9d9f-02287b8c0ebf', 
            }, function(isSuccess, errorCode) {
                console.log("PPCOM boot: ", errorCode);
            });
        }        
    })

;

// the [] is must, otherwise it is a ref not define
angular.module("this_app.constants", [])
    .constant("yvConstants", {

        PPCONSOLE_API: {
            uuid:    "{ppconsole_api_uuid}",
            key:     "{ppconsole_api_key}",
            secret:  "{ppconsole_api_secret}"
        },

        PPMESSAGE_APP: {
            uuid:    "{ppmessage_app_uuid}"
        },

        COOKIE_KEY: {
            LOGINED_USER_UUID: 'cookie_ppconsole_user_logined_user_uuid',
            ACTIVE_USER_UUID: 'cookie_ppconsole_user_user_uuid',
            ACCESS_TOKEN: 'cookie_ppconsole_user_access_token',
        },

        BROADCAST_EVENT_KEY: {
            LOGIN_FINISHED: 'event:login:finished',
            REFRESH_PAGE: 'event:refreshpage'
        },

        MAX_TEXT_LEN: 128,

        TEMPLATE_PREFIX: "templates/",
        STATIC_PREFIX: "/ppconsole/static/",
        DEFAULT_USER_ICON: "/ppconsole/static/img/default-user.png",

        MESSAGE_TYPE: {
            NOTI: "NOTI",
        },

        MESSAGE_SUBTYPE: {
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
        },

        YVOBJECT: {
            DU: "DU",
            AU: "AU",
            AG: "AG",
            OG: "OG",
        },

        OS: {
            IOS: "IOS",
            AND: "AND",
            WP: "WP",
            CHROME: "CHROME",
            MAC: "MAC",
            WIN: "WIN",
        },

        SEND_STATUS: {
            SEND_PENDING:   "SEND_PENDING",
            SEND_CHECKING:  "SEND_CHECKING",
            SEND_UPLOADING: "SEND_UPLOADING",
            SEND_SENDING:   "SEND_SENDING",
            SEND_SUCCESS:   "SEND_SUCCESS",
            SEND_ERROR:     "SEND_ERROR"
        },

        MESSAGE_DIR: {
            DIR_IN:  "DIR_IN",
            DIR_OUT: "DIR_OUT"
        },

        // according this to jump certain url
        USER_STATUS: {
            OWNER_0: "app.main",
            OWNER_1: "app.main",
            OWNER_2: "app.settings.overview",
            // OWNER_3: "",
            // SERVICE: "",
            ANONYMOUS: "app.main",
            THIRDPARTY: "app.main",
        },

    });

/*
 *  guijin.ding@yvertical.com
 *  Copyright (c) 2010-2015 
 */

angular.module("this_app.i18n", ["pascalprecht.translate"])
    .constant("yvTransTags", {
        en: {

            COPYRIGHT_PPMESSAGE: "PPMESSAGE.",

            global: {
                DELETE_TEAM_TAG: "Delete Team",
                DELETE_TEAM_NOTE_TAG: "Delete team will remove all your team data from this site. Any question please use the chat launcher button to contact the service agent.",
                DELETE_TEAM_CONFIRM_TAG: "Confirm Delete",
                DELETE_TEAM_CANCEL_TAG: "Cancel Delete",
                DELETE_TEAM_NOTE_DATA_TAG: "Delete, mean remove all data related the team.",
                DELETE_TEAM_NOTE_MEAN_TAG: "Make sure understand?",

                PARAMS_MISS_TAG: "Params miss",
                FULLNAME_ERROR_TAG: "Fullname empty or out of length",
                NO_FIRSTNAME_TAG: "Please input your first name.",
                NO_LASTNAME_TAG: "Please input your last name.",
                NO_FULLNAME_TAG: "fullname required",
                NO_EMAIL_TAG: "email required",
                NO_PASSWORD_TAG: "password required",
                NO_RPASSWORD_TAG: "repeat password required",
                NO_AGREE_TAG: "agreement agree required",
                PASSWORD_NOT_MATCHED_TAG: "password not matched",
                EMAIL_USED_TAG: "This email already has been taken.",
                SIGNUP_ERROR_TAG: "signup meet error",
                SIGNUP_SUCCESS_TAG: "signup successfully",

                SERVICE_ERROR_TAG: "Signup service error.",
                FULLNAME_UNREGULAR_TAG: "Illegal fullname",
                PASSWORD_UNREGULAR_TAG: "Illegal password",
                FIRST_NAME_TOO_LONG_TAG: "First name is too long",
                LAST_NAME_TOO_LONG_TAG: "Last name is too long",
                EMAIL_TOO_LONG_TAG: "Email is too long",
                COMPANY_NAME_TOO_LONG_TAG: "Company name is too long",
                EMAIL_UNREACHABLE_TAG: "Email is unreachable",
                EMAIL_LOGIN_ERROR_TAG: "System busy,cann't send email，please try again or contact us",
                EMAIL_SENDING_ERROR_TAG: "Sending email encounter an error.please contact us or jusr try again",
                LENGTH_OUT_OF_RANGE_TAG: "Length out of range",

                ERR_PASSWORD_CONTAINS_WHITESPACE_AT_HEAD_OR_TAIL: 'Password contains whitespace at head or tail',

                SIGNUP_TAG: "Sign Up",
                SIGNIN_TAG: "Sign In",
                RESET_PASSWORD_TAG: "Reset Password",
                
                CREATE_TEAM_TAG: "Create Team",
                START_TAG: "Start",
                FULLNAME_TAG: "Full Name",
                LOGIN_NAME_TAG: "Login Email",
                LOGIN_PASSWORD_TAG: "Password",
                LOGIN_PASSWORD_REPEAT_TAG: "Password Repeat",
                SERVICE_TEAM_TAG: "Service Team",
                AGREE_SERVICE_TEAM_TAG: "Agree with ",
                MAKE_NAME_FOR_YOURTEAM: "Make an amazing name for your team !",
                TEAM_NAME: "Team name",
                CONGRATULATIONS: "Congratulations! customer service team create success",
                YOU_WILL_EXPERIENCE: "You will experience",
                ANY_TRAFFIC: "Any traffic",
                ANY_MESSAGE: "Any number of messages",
                YOU_CAN: "Start use, you can: ",
                DEPLOY_CODE: "Deploy you code",
                ADD_SERVICE_USER: "Add service user",
                MODIFY_SETTINGS: "Modify information",

                USER_ACCOUNT_TAG: "User Account",

                SIGNIN_FAILED_TAG: "sign in failed.",
                SEND_NEW_PASSWORD_TAG: "Send new password email",

                SEND_NEW_PASSWORD_SUCCESS_TAG: "Success to send new password to your email.",
                SEND_NEW_PASSWORD_FAILED_TAG: "Fail to send new password to your email.",
            },
            
            app: {
                MY_PROFILE_TAG: "My Profile",
                LOGOUT_TAG: "Logout",
                LOGIN_TAG: "Login",
                DOWNLOAD: "Download",
                CONTACT_US:"Contact us",

                START_SERVICE_TAG: "Start service",
                PRIVATE_CONFIG_TAG: "Private settings",
                TEAM_CONFIG_TAG: "Team settings",
                EXIT_APP_TAG: "Log Out",
                SIGNUP_TAG: "Sign Up",
                LOGIN_TAG: "Sign In",
                SLOGAN: "Open Source Plug & Play Enterprise Message Communication Platform",

                APPS: "Apps",
                
            },

            calendar:{
                TODAY_TAG: "Today",
                YESTERDAY_TAG: "Yesterday",
                LAST_7_DAYS_TAG:"Last 7 Days",
                LAST_30_DAYS_TAG:"Last 30 Days",
                THIS_MONTH_TAG:"This Month",
                LAST_MONTH_TAG:"Last Month",
                /*按钮文本定义开始*/
                APPLY_LABEL_TAG:"Apply",
                CANCEL_LABEL_TAG:"Cancel",
                FROM_LABEL_TAG:"From",
                TO_LABEL_TAG:"To",
                CUSTOM_RANGE_LABEL_TAG:"Custom Range",
                monthname:{
                    JANUARY_TAG:"January",
                    FEBRUARY_TAG:"February",
                    MARCH_TAG:"March",
                    APRIL_TAG:"April",
                    MAY_TAG:"May",
                    JUNE_TAG:"June",
                    JULY_TAG:"July",
                    AUGUST_TAG:"August",
                    SEPTEMBER_TAG:"September",
                    OCTOBER_TAG:"October",
                    NOVEMBER_TAG:"November",
                    DECEMBER_TAG:"December",
                },
                /*按钮文本定义结束*/
            },//calendar end

            main: {
                LEARN_MORE_TAG: "LEARN MORE",
                PLUG_AND_PLAY_TAG: "PLUG AND PLAY",
                MULTIPLE_PLATFORMS_TAG: "MULTIPLE PLATFORMS",
                THE_MESSAGING_SYSTEM_IN_APPLICATIONS: "THE MESSAGING SYSTEM IN APPLICATIONS",

            },

            signup: {
                                
            },

            createaccount: {
                ACCOUNT_ALREADY_CREATED: "Account already created.",
                NO_PASSWORD_TAG: "Password required.",
            },

            login: {
                INVALID_EMAIL_TAG: "Invalid email address.",
                NO_EMAIL_TAG: "email required",
                NO_PASSWORD_TAG: "password required",
                NO_SUCH_USER_TAG: "No such user.",
                PASSWORD_MISMATCH_TAG: "Incorrect password.",
                NO_AUTHORITY_LOGIN_TAG: "no authority to log in.",

                LOGIN_TAG: "Log In",
                LOGIN_EMAIL_PLACEHOLDER_TAG: "Email",
                LOGIN_PASSWORD_TAG: "Password",
                LOGIN_FORGET_PASSWORD_TAG: "Forget password?",
                LOGIN_REGISTER_TAG: "Register"
                
            },

            changepassword: {
                NO_PASSWORD_TAG: "Please enter your password.",
                PASSWORD_NOT_MATCH_TAG: "The two entered passwords are different.",
                CHANGE_PASSWORD_SUCCESS_TAG: "Change password successfully.",
                CHANGE_PASSWORD_FAIL_TAG: "Change password failed.",
            },

            settings: {
                menu: {
                    DATA_ANALYSIS_TAG: "Data analysis",
                    DATA_OVERVIEW_TAG: "Data overview",
                    HISTORY_MSG_TAG: "Message history",
                    TEAM_CONFIG_TAG: "Team settings",
                    BASIC_CONFIG_TAG: "Basic info",
                    USER_INTERFACE_TAG: "User interface",
                    MESSAGE_DISPATCH_TAG: "Message dispatch",
                    SERVICE_USER_TAG: "Service users",
                    SERVICE_GROUP_TAG: "Service users group",
                    APP_INTEGRAGE_TAG: "App integrate",
                    ACCOUT_CONFIG_TAG: "Account settings",
                    ADVANCED_CONFIG_TAG: "Advanced settings"
                },
                
                profile: {
                    UPDATE_SUCCESSFULLY_TAG: "Profile updated successfully.",
                    UPDATE_FAILED_TAG: "Profile updated failed.",
                },

                account: {
                    OLDPASSWORD_MISMATCH_TAG: "Old password mismatch.",
                    NEWPASSWORD_MISMATCH_TAG: "New password and confirm new password not equal.",
                    REMOVE_USER_PROMOTE_TAG: "Very important.",
                    REMOVE_USER_FAILED_TAG: "Remove user failed.",
                    NO_EMAIL_OR_PASSWORD_TAG: "No email or password provided.",
                },

                resetpassword: {
                    NO_EMAIL_TAG: "Please enter your email.",
                    EMAIL_NOT_MATCH_TAG: "Invalid email. Please enter the correct email.",
                    SERVICE_ERROR_TAG: "Some error occurred. Please retry in a minute",
                    ERR_NO_USER: "Can not find user with this email",
                },

                createapplication: {
                    NO_APPNAME_TAG: "Please enter the name of app.",
                    CREATEAPP_SUCCESSFULLY_TAG: "Create app successfully.",
                    CREATEAPP_FAILED_TAG: "Create app failed",
                    APP_ALREADY_EXITED_TAG: "This name already exited. Please use another name",
                    APP_NAME_LENGTH_LIMIT_TAG: "App name is too long",
                    CONTAIN_UNREGULAR_WORDS_TAG: "Unregular words contained",
                },
            },

            payment: {
                pay: {
                    CHOOSE_AGENT_SMALLER_THAN_EXIST_AGENT_TAG: "The agents number is smaller than current exist agent numbers,please reduce your team member or expand the agent numbers. Thanks",
                },

                payment: {
                    
                },

                pwechat: {
                    
                },
            },
            
            application: {
                profile: {
                    UPDATE_SUCCESSFULLY_TAG: "Profile updated successfully.",
                    UPDATE_FAILED_TAG: "Profile updated failed.",
                    UPDATE_APP_LACK_PARAMS_TAG: "Update team info needs more params",
                    UPDATE_APP_NOT_EXIST_TAG: "Update team not exist",
                    UPDATE_APP_NAME_OUT_OF_LENGTH_TAG: "Update name out of length",
                    REMOVE_APP_SUCCESS_TAG: "Remove team success",
                    PERMISSSION_DENIED_TAG: "Permission denied, you are not team owner",
                    NO_CHANGE_TAG: "No changes since last change",
                    NOT_REGULAR_WORDS_TAG: "Not allow unregular words",
                    WORDS_OUT_OF_LENGHT_TAG: "The name is too long",
                    COPY_SUCCESSFUL_TAG: "Copy to clipboard success!",
                    COPY_FAIL_TAG: "Copy to clipboard failed!",
                },

                account: {
                    OLDPASSWORD_MISMATCH_TAG: "Old password mismatch.",
                    NEWPASSWORD_MISMATCH_TAG: "New password and confirm new password not equal.",
                },

                resetpassword: {
                    NO_EMAIL_TAG: "Please enter your email.",
                    EMAIL_NOT_MATCH_TAG: "Invalid email. Please enter the correct email.",
                    SERVICE_ERROR_TAG: "Some error occurred. Please retry in a minute",

                    FIND_PASSWORD_TAG: "Find password",
                    LOGIN_EMAIL_TAG: "Email",
                    FIND_TAG: "Send email",
                    
                },

                welcome: {
                    UPDATE_APP_SUCCESSFULLY_TAG: "update team info successfully",
                    UPDATE_APP_LACK_PARAMS_TAG: "need more params",
                    UPDATE_APP_NOT_EXIST_TAG: "app not exist",
                    WELCOME_WORDS_OUT_OF_LENGTH_TAG: "welcome words or offline notice out of length",
                    COLOR_PICKED_NOT_RIGHT_TAG: "color picked is unregualr value",
                    UPDATE_ENCOUNTER_AN_ERROR_TAG: "encounter an error,please try again",
                    NO_CHANGED_TAG: "No change",

                    WELCOME_INFO_TAG: "Welcome",
                    SAVE_TAG: "Save",
                    AUTO_POPUP: "Auto Popup",
                    POPUP_ONLY_ONCE: "Only once",
                    POPUP_NEVER: "Never",
                    POPUP_ALWAYS: "Always",
                    COLOR: "Color",
                    TOOLTIP_WELCOME_TAG: "Welcome string when mouse hover on chat launcher icon.",
                    TOOLTIP_COLOR_TAG: "Chat launcher icon colour.",
                },

                grouping: {
                    WORDS_OUT_OF_LENGTH_TAG: "length out of range",
                    UNREGULAR_WORDS_TAG: "unregular words",
                    NO_ORG_GROUP_TAG: "no group exists",
                    LACK_PARAMS_TAG: "lack params",
                    NOT_LIST_TAG: "not list params",
                    ADD_GROUP_USER_SUCCESS_TAG: "add group user successful",
                    ENCOUNTER_AN_ERROR_TAG: "operation error",
                    REMOVE_GROUP_SUCCESS_TAG: "remove group successful",
                    UPDATE_GROUP_SUCCESS_TAG: "update group successful",
                    CREATE_GROUP_SUCCESS_TAG: "create group successful",
                    MODIFY_INFO_IS_NOT_SUITABLE_TAG: "what you write is not suitable",
                    NO_GROUP_USER_SELECTED_TAG: "no group user selected",
                    GROUP_NAME_EXISTED_TAG: "group name already existed",
                    NO_GROUP_NAME: "group name can't be empty",
                    NO_GROUP_DESC: "group description can't be empty",

                    SERVICE_GROUP_MANAGER_TAG: "Service group manager",
                    MOVE_TO: "Move to ",
                    SELECT_GROUP: "Select group",
                    ALL_SERVICE_USER: "all service users",
                    NEW_GROUP: "Create",
                    SELECT_ALL: "Select all",
                    LOGIN_EMAIL: "Email",
                    ROLE: "Role",
                    GROUP_IN: "Group",
                    GROUP_MODE_CONFIG: "Group config",
                    IS_SHOW_GROUP: "Show",
                    GROUP_NAME: "Group name",
                    DISPATCH_WAY: "Dispatch mode",
                    CREATE_GROUP: "Create Group",
                    GROUP_DESC: "Group Infos",
                    MODIFY_GROUP: "Modify Group",
                    SAVE: "Save",

                    ADMIN_USER_TAG: "Team admin",
                    SERVICE_USER_TAG: "Service user",

                    UNAMED_GROUP_NAME_TAG: "Not grouped",
                    DISTRIBUTOR_TAG: "Primary Group",
                    
                },

                people: {
                    SEND_INVITATION_EMAIL_SUCCESSFULLY_TAG: "Send the invitation email successfully.",
                    SEND_INVITATION_EMAIL_FAILED_TAG: "Send the invitation email failed.",
                    CREATE_APP_USER_SUCCESSFULLY_TAG:"Add user successfully.",
                    CREATE_APP_USER_FAILED_TAG:"Add user failed.",
                    USER_EXIST_AND_INVITE_TAG:"user existed,please invite directly",
                    REMOVE_APP_USER_SUCCESSFULLY_TAG:"Remove successfully.",
                    REMOVE_APP_USER_FAILED_TAG:"Remove failed.",
                    ALREADY_IS_APP_USER_TAG:"This user has already been app user.",
                    QUOTA_REACH_TO_UPPER_LIMIT_TAG:"Agent quote reach to upper limit.",
                    PARAMS_MISS_TAG: "Params miss",
                    PERMISSION_DENY_TAG: "You are not allow to create team member",

                    CREATE_SERVICE_USER_TAG: "Create service user",
                    SEARCH_TAG: "Search",
                    SELECT_ALL_TAG: "Select all",
                    EDIT_SERVICE_USER_TAG: "Edit",
                    REMOVE_SERVICE_USER_TAG: "Remove",
                    REMOVE_SERVICE_USER_PROMOTE_TAG: "Are you sure to remove the service user: ",
                    OWNER_TAG: "Owner",
                    SERVICE_USER_TAG: "Service user",
                    CANCEL_TAG: "Cancel",
                    OK_TAG: "Ok",
                    SERVICE_USER_NAME_TAG: "Service user full name",
                    SERVICE_USER_EMAIL_TAG: "Email",
                    PASSWORD_TAG: "Password",
                    CONFIRM_PASSWORD_TAG: "Confirm password",
                    CREATE_TAG: "Create",
                    SAVE_TAG: "Save",

                    EDIT_APP_USER_SUCCESSFULLAY_TAG: "Edit user successfully.",
                    EDIT_APP_USER_FAILED_TAG: "Edit user failed.",
                },

                manualinstall: {
                    COPY_SUCCESSFUL_TAG: "Copy to clipboard success!",
                },

                integrate: {
                    COPY_TO_CLIPBOARD: "Copy to clipboard",
                    PREVIEW: "Preview",
                    URL_LINK: "Url",
                    DEMO_DEPLOY_TO: "PPMessage has deploy to this website for preview",
                    COPY_CODE_TO_BODY: "Copy the code below, and paste between <body></body>"
                },

                teamprofile: {
                    TEAM_INFO: "Team info",
                    TEAM_NAME: "Team name",
                    SAVE: "Save"
                }
                
            },

            statistics: {

                overview: {
                    OVERVIEW_TAG: 'Overview',
                    TODAY_CUSTOMER_TAG: 'Today customer',
                    YESTERDAY_CUSTOMER_TAG: 'Yesterday customer',
                    ALL_CUSTOMER_TAG: 'All customer',
                    ALL_MESSAGE_TAG: 'All message',
                    REALTIME_DATA_TAG: 'Today data',
                    REALTIME_CUSTOMER_TAG: 'Customer',
                    REALTIME_SERVICE_TAG: 'Service',
                    REALTIME_MESSAGE_TAG: 'Message',
                    HISTORY_DATA_TAG: 'History data',
                    HISTORY_CUSTOMER_TAG: 'Customer',
                    HISTORY_SERVICE_TAG: 'Service',
                    HISTORY_MESSAGE_TAG: 'Message',
                    MAX_RANGE_TAG: 'Less than 30 days',
                },
                
                historymessages: {
                    MESSAGE_FILE_TYPE_TAG: 'File',
                    MESSAGE_IMAGE_TYPE_TAG: 'Image',
                    MESSAGE_TXT_TYPE_TAG: 'Large text',
                    MESSAGE_GET_ERROR_TAG: "Get history message error.",

                    SEARCH_TAG: "Search",
                    MESSAGE_LIST_TAG: "Messages",
                    EMPTY_LIST_TAG: "Empty",
                    MESSAGES: "Messages",
                    MESSAGES_PREVIEW: "Messages preview",
                    
                },

                messageroute:  {
                    ALL: "ALL",
                    SMART: "SMART",
                    GROUP: "GROUP",
                    ROBOT: "ROBOT"
                },

                userprofile: {
                    EMAIL_TAG: "Email",
                    USER_NAME_TAG: "Username",
                    SAVE_TAG: "Save",
                },

                advanced_settings: {
                    CHANGE_PASSWORD_TAG: "Change Password",
                    CURRENT_PASSWORD_TAG: "Current password",
                    NEW_PASSWORD_TAG: "New password",
                    REPEAT_NEW_PASSWORD_TAG: "New password repeat",
                    SAVE_TAG: "Save",
                    FORGET_PASSWORD_TAG: "Forget password"
                },
                
            }

        },

        cn: {
            COPYRIGHT_PPMESSAGE: "皮皮消息.",

            global: {
                DELETE_TEAM_TAG: "删除团队",
                DELETE_TEAM_NOTE_TAG: "删除团队是不可逆操作，该操作意味着将永久从本网站删除与该团队有关的所有数据.如有疑问请点击右下角图标咨询客服.",
                DELETE_TEAM_CONFIRM_TAG: "确认删除",
                DELETE_TEAM_CANCEL_TAG: "取消删除",
                DELETE_TEAM_NOTE_DATA_TAG: "删除，意味着您将失去所有与该团队有关的数据.",
                DELETE_TEAM_NOTE_MEAN_TAG: "请确保您充分了解该操作的意义?",
                
                PARAMS_MISS_TAG: "参数缺失",
                FULLNAME_ERROR_TAG: "姓名缺失或长度超过限制",
                NO_FIRSTNAME_TAG: "请输入您的名字",
                NO_LASTNAME_TAG: "请输入您的姓",
                NO_FULLNAME_TAG: "姓名缺失",
                NO_EMAIL_TAG: "邮箱缺失或者格式不正确",
                NO_PASSWORD_TAG: "密码缺失或者格式不正确",
                NO_RPASSWORD_TAG: "请再次输入密码",
                NO_AGREE_TAG: "请同意我们的协议",
                PASSWORD_NOT_MATCHED_TAG: "两次密码不匹配",
                EMAIL_USED_TAG: "该邮箱已被占用",
                SIGNUP_ERROR_TAG: "注册遇到错误",
                SIGNUP_SUCCESS_TAG: "注册成功",
                SERVICE_ERROR_TAG: "注册服务错误",
                FULLNAME_UNREGULAR_TAG: "用户全名不要使用非常规字符",
                PASSWORD_UNREGULAR_TAG: "用户密码不要使用非常规字符",
                FIRST_NAME_TOO_LONG_TAG: "名--长度超过限制",
                LAST_NAME_TOO_LONG_TAG: "姓--长度超过限制",
                EMAIL_TOO_LONG_TAG: "邮件--长度超过限制",
                COMPANY_NAME_TOO_LONG_TAG: "公司名字--长度超过限制",
                EMAIL_UNREACHABLE_TAG: "无法发送邮件，邮箱不可达",
                EMAIL_LOGIN_ERROR_TAG: "系统繁忙，无法登录邮箱发送邮件，请重新发送或者联系我们",
                EMAIL_SENDING_ERROR_TAG: "邮件发送失败，请重新发送或者联系我们",
                LENGTH_OUT_OF_RANGE_TAG: "长度超过限制",
                ERR_PASSWORD_CONTAINS_WHITESPACE_AT_HEAD_OR_TAIL: '密码开头或结尾不允许包含空格',

                SIGNUP_TAG: "创建新用户",
                SIGNIN_TAG: "用户登录",
                RESET_PASSWORD_TAG: "重设用户密码",
                
                CREATE_TEAM_TAG: "创建客服团队",
                START_TAG: "开始使用",
                FULLNAME_TAG: "真实姓名",
                LOGIN_NAME_TAG: "登录邮箱",
                LOGIN_PASSWORD_TAG: "密码",
                LOGIN_PASSWORD_REPEAT_TAG: "确认密码",
                SERVICE_TEAM_TAG: "服务条款",
                AGREE_SERVICE_TEAM_TAG: "注册并登录意味着同意本网站",
                MAKE_NAME_FOR_YOURTEAM: "为您的团队起一个响亮的名字吧!",
                TEAM_NAME: "客服团队名称",
                CONGRATULATIONS: "恭喜您，客服团队创建成功!",
                YOU_WILL_EXPERIENCE: "您将体验",
                ANY_TRAFFIC: "不限流量",
                ANY_MESSAGE: "不限消息",
                YOU_CAN: "开始使用，您可以：",
                DEPLOY_CODE: "代码部署",
                ADD_SERVICE_USER: "添加客服",
                MODIFY_SETTINGS: "修改信息",

                USER_ACCOUNT_TAG: "用户账户",
                SIGNIN_FAILED_TAG: "登录失败",
                SEND_NEW_PASSWORD_TAG: "邮寄新的密码",

                SEND_NEW_PASSWORD_SUCCESS_TAG: "成功邮寄新的密码",
                SEND_NEW_PASSWORD_FAILED_TAG: "邮寄新的密码失败",

            },

            app: {
                MY_PROFILE_TAG: "我的信息",
                LOGOUT_TAG: "登出",
                LOGIN_TAG: "登入",
                DOWNLOAD: "下载",
                CONTACT_US:"联系我们",

                START_SERVICE_TAG: "开始服务",
                PRIVATE_CONFIG_TAG: "个人设置",
                TEAM_CONFIG_TAG: "团队设置",
                EXIT_APP_TAG: "退出",
                SIGNUP_TAG: "注册",
                LOGIN_TAG: "登录",
                SLOGAN: "开源企业消息通讯平台",
                APPS: "所有团队",
            },

            calendar:{
                TODAY_TAG: "今天",
                YESTERDAY_TAG:"昨天",
                LAST_7_DAYS_TAG:"最近7天",
                LAST_30_DAYS_TAG:"最近30天",
                THIS_MONTH_TAG:"本月",
                LAST_MONTH_TAG:"上一个月",
                /*按钮文本开始*/
                APPLY_LABEL_TAG:"应用",
                CANCEL_LABEL_TAG:"取消",
                FROM_LABEL_TAG:"从",
                TO_LABEL_TAG:"到",
                CUSTOM_RANGE_LABEL_TAG:"定制范围",
                monthname:{
                    JANUARY_TAG:"一月",
                    FEBRUARY_TAG:"二月",
                    MARCH_TAG:"三月",
                    APRIL_TAG:"四月",
                    MAY_TAG:"五月",
                    JUNE_TAG:"六月",
                    JULY_TAG:"七月",
                    AUGUST_TAG:"八月",
                    SEPTEMBER_TAG:"九月",
                    OCTOBER_TAG:"十月",
                    NOVEMBER_TAG:"十一月",
                    DECEMBER_TAG:"十二月",
                },
                /*按钮文本定义结束*/
            },//calendar   

            main: {
                LEARN_MORE_TAG: "了解更多",
                PLUG_AND_PLAY_TAG: "即插即用",
                MULTIPLE_PLATFORMS_TAG: "多平台",
                THE_MESSAGING_SYSTEM_IN_APPLICATIONS: "应用内消息系统",

            },

            signup: {
                
            },

            createaccount: {
                ACCOUNT_ALREADY_CREATED: "账户已经被创建了。",
                NO_PASSWORD_TAG: "需要填写密码。",
            },

            login: {
                INVALID_EMAIL_TAG: "无效的EMAIL地址",
                NO_EMAIL_TAG: "需要填写EMAIL地址。",
                NO_PASSWORD_TAG: "需要填写密码。",

                NO_SUCH_USER_TAG: "无此用户。",
                PASSWORD_MISMATCH_TAG: "密码错误。",

                LOGIN_TAG: "登录",
                LOGIN_EMAIL_PLACEHOLDER_TAG: "登录邮箱",
                LOGIN_PASSWORD_TAG: "密码",
                LOGIN_FORGET_PASSWORD_TAG: "忘记密码?",
                LOGIN_REGISTER_TAG: "注册"
                
            },

            changepassword: {
                NO_PASSWORD_TAG: "请输入你的密码。",
                PASSWORD_NOT_MATCH_TAG: "两次输入的密码不同。",
                CHANGE_PASSWORD_SUCCESS_TAG: "修改密码成功。",
                CHANGE_PASSWORD_FAIL_TAG: "修改密码失败。",
            },

            settings: {
                menu: {
                    DATA_ANALYSIS_TAG: "数据分析",
                    DATA_OVERVIEW_TAG: "数据总览",
                    HISTORY_MSG_TAG: "历史消息",
                    TEAM_CONFIG_TAG: "团队设置",
                    BASIC_CONFIG_TAG: "基本信息",
                    USER_INTERFACE_TAG: "用户界面",
                    MESSAGE_DISPATCH_TAG: "消息分流",
                    SERVICE_USER_TAG: "客服人员",
                    SERVICE_GROUP_TAG: "客服分组",
                    APP_INTEGRAGE_TAG: "应用集成",
                    ACCOUT_CONFIG_TAG: "账户设置",
                    ADVANCED_CONFIG_TAG: "高级设置"
                },
                
                profile: {
                    UPDATE_SUCCESSFULLY_TAG: "更新成功。",
                    UPDATE_FAILED_TAG: "更新失败。",
                },
                
                account: {
                    OLDPASSWORD_MISMATCH_TAG: "原密码输入错误",
                    NEWPASSWORD_MISMATCH_TAG: "新密码两次输入不同",
                    REMOVE_USER_PROMOTE_TAG: "重要的说明看三遍",
                    REMOVE_USER_FAILED_TAG: "注销用户失败",
                    NO_EMAIL_OR_PASSWORD_TAG: "没提供邮件或者密码",
                },

                resetpassword: {
                    NO_EMAIL_TAG: "请输入您的邮箱",
                    EMAIL_NOT_MATCH_TAG: "邮箱和此账号不匹配，请输入正确的邮箱",
                    SERVICE_ERROR_TAG: "发生了一些错误，请稍后重试",
                    ERR_NO_USER: "此用户不存在",
                },

                createapplication: {
                    NO_APPNAME_TAG: "请输入团队的名称。",
                    CREATEAPP_SUCCESSFULLY_TAG: "创建团队成功。",
                    CREATEAPP_FAILED_TAG: "创建团队失败。",
                    APP_ALREADY_EXITED_TAG: "这个名字已经使用，请换一个名字。",
                    APP_NAME_LENGTH_LIMIT_TAG: "团队名字超过长度",
                    CONTAIN_UNREGULAR_WORDS_TAG: "团队名称包含非常规字符",
                },
            },

            payment: {
                pay: {
                    CHOOSE_AGENT_SMALLER_THAN_EXIST_AGENT_TAG: "您当前所选坐席数小于团队实际坐席数，请扩大坐席数或删除一些坐席再来选购，谢谢",
                },

                payment: {
                    
                },

                pwechat: {
                    
                },
            },
            
            application: {
                profile: {
                    UPDATE_SUCCESSFULLY_TAG: "更新成功。",
                    UPDATE_FAILED_TAG: "更新失败。",
                    UPDATE_APP_LACK_PARAMS_TAG: "修改缺乏参数",
                    UPDATE_APP_NOT_EXIST_TAG: "修改的团队不存在",
                    UPDATE_APP_NAME_OUT_OF_LENGTH_TAG: "修改的团队名超出长度",
                    REMOVE_APP_SUCCESS_TAG: "删除团队成功",
                    PERMISSSION_DENIED_TAG: "操作没有权限",
                    NO_CHANGE_TAG: "没有做出任何修改",
                    NOT_REGULAR_WORDS_TAG: "请不要使用非常规字符",
                    WORDS_OUT_OF_LENGHT_TAG: "团队名称超过限制",
                    COPY_SUCCESSFUL_TAG: "成功复制到剪贴板",
                    COPY_FAIL_TAG: "复制失败，请手动复制!",
                },
                account: {
                    OLDPASSWORD_MISMATCH_TAG: "原密码输入错误",
                    NEWPASSWORD_MISMATCH_TAG: "新密码两次输入不同",
                },

                resetpassword: {
                    NO_EMAIL_TAG: "请输入您的邮箱",
                    EMAIL_NOT_MATCH_TAG: "邮箱和此账号不匹配，请输入正确的邮箱",
                    SERVICE_ERROR_TAG: "发生了一些错误，请稍后重试",

                    FIND_PASSWORD_TAG: "找回密码",
                    LOGIN_EMAIL_TAG: "登录邮箱",
                    FIND_TAG: "发送找回密码邮件",
                },

                welcome: {
                    UPDATE_APP_SUCCESSFULLY_TAG: "更新成功",
                    UPDATE_APP_LACK_PARAMS_TAG: "参数缺失",
                    UPDATE_APP_NOT_EXIST_TAG: "应用不存在",
                    WELCOME_WORDS_OUT_OF_LENGTH_TAG: "问候语长度超过限制",
                    COLOR_PICKED_NOT_RIGHT_TAG: "颜色取值有问题",
                    UPDATE_ENCOUNTER_AN_ERROR_TAG: "更新遇到一个错误，请重试或者联系客服，谢谢",
                    NO_CHANGED_TAG: "没有任何改变",

                    WELCOME_INFO_TAG: "欢迎信息",
                    SAVE_TAG: "保存",
                    AUTO_POPUP: "自动弹出",
                    POPUP_ONLY_ONCE: "仅首次",
                    POPUP_NEVER: "从不弹出",
                    POPUP_ALWAYS: "总是弹出",
                    COLOR: "图标颜色",

                    TOOLTIP_WELCOME_TAG: "鼠标悬停在聊天图标上的时候，显示的欢迎信息",
                    TOOLTIP_COLOR_TAG: "聊天图标的背景颜色",
                },

                grouping: {
                    WORDS_OUT_OF_LENGTH_TAG: "超过最大长度限制",
                    UNREGULAR_WORDS_TAG: "请不要使用非常规字符",
                    NO_ORG_GROUP_TAG: "没有找到组的信息",
                    LACK_PARAMS_TAG: "缺少必要的信息",
                    NOT_LIST_TAG: "参数格式不对",
                    ADD_GROUP_USER_SUCCESS_TAG: "添加组用户成功",
                    ENCOUNTER_AN_ERROR_TAG: "操作遇到错误，请查看控制台",
                    REMOVE_GROUP_SUCCESS_TAG: "成功移除小组",
                    UPDATE_GROUP_SUCCESS_TAG: "成功更新小组信息",
                    CREATE_GROUP_SUCCESS_TAG: "成功创建小组",
                    MODIFY_INFO_IS_NOT_SUITABLE_TAG: "所填参数不合适",
                    NO_GROUP_USER_SELECTED_TAG: "没有选择任何客服人员",
                    GROUP_NAME_EXISTED_TAG: "组名已经存在",
                    NO_GROUP_NAME: "请填写组名",
                    NO_GROUP_DESC: "请填写组的描述信息",

                    SERVICE_GROUP_MANAGER_TAG: "客服分组管理",
                    MOVE_TO: "移动到",
                    SELECT_GROUP: "选择小组",
                    ALL_SERVICE_USER: "全部客服",
                    NEW_GROUP: "新建分组",
                    SELECT_ALL: "全选",
                    LOGIN_EMAIL: "登录邮箱",
                    ROLE: "角色",
                    GROUP_IN: "分组",
                    GROUP_MODE_CONFIG: "分组模式配置",
                    IS_SHOW_GROUP: "是否显示",
                    GROUP_NAME: "组名",
                    DISPATCH_WAY: "分流方式",
                    CREATE_GROUP: "创建分组",
                    GROUP_DESC: "描述",
                    MODIFY_GROUP: "修改分组",
                    SAVE: "确认修改",
                    
                    ADMIN_USER_TAG: "团队管理员",
                    SERVICE_USER_TAG: "客服人员",

                    UNAMED_GROUP_NAME_TAG: "未分组",
                    DISTRIBUTOR_TAG: "首选组",
                },
                
               people: {
                   SEND_INVITATION_EMAIL_SUCCESSFULLY_TAG: "发送邀请邮件成功。",
                   SEND_INVITATION_EMAIL_FAILED_TAG: "发送邀请邮件失败。",
                   CREATE_APP_USER_SUCCESSFULLY_TAG:"添加成功。",
                   CREATE_APP_USER_FAILED_TAG:"添加失败。",
                   USER_EXIST_AND_INVITE_TAG:"用户已经存在，请点击‘邀请客服人员’按钮添加",
                   REMOVE_APP_USER_SUCCESSFULLY_TAG:"删除成功。",
                   REMOVE_APP_USER_FAILED_TAG:"删除失败。",
                   ALREADY_IS_APP_USER_TAG:"这个用户已经添加，不需要重复添加。",
                   QUOTA_REACH_TO_UPPER_LIMIT_TAG:"坐席配额达到上限,请先扩容",
                   PARAMS_MISS_TAG: "参数不足",
                   PERMISSION_DENY_TAG: "只有团队owner才能创建成员",

                   CREATE_SERVICE_USER_TAG: "创建客服人员",
                   SEARCH_TAG: "搜索",
                   SELECT_ALL_TAG: "选择全部",
                   REMOVE_SERVICE_USER_TAG: "编辑客服",
                   REMOVE_SERVICE_USER_TAG: "移除客服",
                   REMOVE_SERVICE_USER_PROMOTE_TAG: "该操作会移除您选定的客服人员：",
                   OWNER_TAG: "创建者",
                   SERVICE_USER_TAG: "客服",
                   CANCEL_TAG: "取消",
                   OK_TAG: "确定",
                   SERVICE_USER_NAME_TAG: "客服全名",
                   SERVICE_USER_EMAIL_TAG: "客服邮箱",
                   PASSWORD_TAG: "设置密码",
                   CONFIRM_PASSWORD_TAG: "确认密码",
                   CREATE_TAG: "创建",
                   SAVE_TAG: "保存",

                   EDIT_APP_USER_SUCCESSFULLAY_TAG: "更新用户信息成功",
                   EDIT_APP_USER_FAILED_TAG: "更新用户信息失败",

               },

                manualinstall: {
                    COPY_SUCCESSFUL_TAG: "成功复制到剪贴板.",
                },

                integrate: {
                    COPY_TO_CLIPBOARD: "复制到剪贴板",
                    PREVIEW: "马上看看",
                    URL_LINK: "生成链接",
                    DEMO_DEPLOY_TO: "PPMessage已经部署在下面的网页链接上",
                    COPY_CODE_TO_BODY: "复制下面的代码并置于<body></body>元素之间"
                },

                teamprofile: {
                    TEAM_INFO: "团队信息",
                    TEAM_NAME: "团队名称",
                    SAVE: "确认修改"
                }
                
            },

            statistics: {

                overview: {
                    OVERVIEW_TAG: '数据总览',
                    TODAY_CUSTOMER_TAG: '今日访客',
                    YESTERDAY_CUSTOMER_TAG: '昨日访客',
                    ALL_CUSTOMER_TAG: '累计访客',
                    ALL_MESSAGE_TAG: '累计消息',
                    REALTIME_DATA_TAG: '实时统计',
                    REALTIME_CUSTOMER_TAG: '访客',
                    REALTIME_SERVICE_TAG: '客服',
                    REALTIME_MESSAGE_TAG: '消息',
                    HISTORY_DATA_TAG: '历史统计',
                    HISTORY_CUSTOMER_TAG: '访客',
                    HISTORY_SERVICE_TAG: '客服',
                    HISTORY_MESSAGE_TAG: '消息',
                    MAX_RANGE_TAG: '最多30天',
                },

                historymessages: {
                    MESSAGE_FILE_TYPE_TAG: '文件',
                    MESSAGE_IMAGE_TYPE_TAG: '图片',
                    MESSAGE_TXT_TYPE_TAG: '文本消息',
                    MESSAGE_GET_ERROR_TAG: "获取历史信息错误",

                    SEARCH_TAG: "搜索",
                    MESSAGE_LIST_TAG: "消息列表",
                    EMPTY_LIST_TAG: "没有任何匹配的会话",
                    MESSAGES: "条消息",
                    MESSAGES_PREVIEW: "消息预览",
                    
                },

                messageroute: {
                    ALL: "群发模式",
                    SMART: "智能匹配",
                    GROUP: "分组模式",
                    ROBOT: "人工智能"
                },

                userprofile: {
                    EMAIL_TAG: "邮箱",
                    USER_NAME_TAG: "姓名",
                    SAVE_TAG: "确认修改",
                },

                advanced_settings: {
                    CHANGE_PASSWORD_TAG: "修改密码",
                    CURRENT_PASSWORD_TAG: "现有密码",
                    NEW_PASSWORD_TAG: "新密码",
                    REPEAT_NEW_PASSWORD_TAG: "确认新密码",
                    SAVE_TAG: "确认修改",
                    FORGET_PASSWORD_TAG: "忘记密码"
                },
                
            }

        },

    })

    .config(function($translateProvider, yvTransTags) {

        $translateProvider.translations("en", yvTransTags.en);
        $translateProvider.translations("zh-CN", yvTransTags.cn);

        $translateProvider.registerAvailableLanguageKeys(["en", "zh-CN"], {
            "en": "en",
            "en-US": "en",
            "en-UK": "en",
            "zh-CN": "zh-CN"
        });

        $translateProvider.determinePreferredLanguage(function() {
            return window.navigator.userLanguage || window.navigator.language;
            //return "zh-CN"
        });

        $translateProvider.fallbackLanguage("en", "zh-CN");

    });

angular.module("this_app.route", ["ui.router", "this_app.constants"])

    .config(function($stateProvider, $urlRouterProvider, yvConstants, blockUIConfig) {
        blockUIConfig.autoInjectBodyBlock = false;

        $stateProvider

            .state("forget", {
                url: "/forget",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "forget.html",
                controller: "ForgetCtrl"
            })

            .state("app", {
                abstract: true,
                url: "/app",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "app.html",
                controller: "AppCtrl"
            })

            .state("app.signup-md", {
                url: "/signup-md/:sign_what",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "signup-md.html",
                controller: "SignupMdCtrl"
            })

            .state("app.error", {
                url: "/error",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "404.html",
                controller: "ErrorCtrl"
            })

            .state("app.createaccount", {
                url: "/createaccount/:account",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "createaccount.html",
                controller: "CreateAccountCtrl"
            })

            .state("app.recoverpassword", {
                url: "/recoverpassword/:account",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "recoverpassword.html",
                controller: "RecoverPasswordCtrl"
            })

            .state("app.policy", {
                abstract: true,
                url: "/policy",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "policy/policy.html",
                controller: "PolicyCtrl"
            })

            .state("app.policy.termofservice", {
                url: "/termofservice",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "policy/termofservice.html",
                controller: "TermOfServiceCtrl"
            })

            .state("app.policy.privacypolicy", {
                url: "/privacypolicy",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "policy/privacypolicy.html",
                controller: "PrivacyPolicyCtrl"
            })

             .state("app.resetpassword", {
                url: "/resetpassword/:email",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/resetpassword.html",
                controller: "SettingsResetpasswordCtrl"
            })

             .state("app.confirmreset", {
                url: "/confirmreset",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/confirmreset.html",
                controller: "SettingsConfirmresetCtrl"
            })

            .state("app.settings.teamprofile", {
                url: "/teamprofile",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/teamprofile.html",
                controller: "ApplicationProfileCtrl"
            })

            .state("app.settings.configuration", {
                url: "/configuration",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/welcome.html",
                controller: "ApplicationWelcomeCtrl"
            })

            .state("app.settings.teamgrouping", {
                url: "/teamgrouping",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/grouping.html",
                controller: "GroupingCtrl"
            })

            .state("app.glance", {
                url: "/glance",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/glance.html",
                controller: "GlanceCtrl"
            })
        
            .state("app.settings.teampeople", {
                url: "/teampeople",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/people.html",
                controller: "ApplicationPeopleCtrl"
            })

            .state("app.settings.messageroute", {
                url: "/messageroute",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/messageroute.html",
                controller: "ApplicationMessageRouteCtrl"
            })

            .state("app.settings.overview", {
                url: "/overview",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/overview.html",
                controller: "StatisticsOverviewCtrl"
            })

            .state("app.settings.historymessage", {
                url: "/historymessage",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/historymessage.html",
                controller: "StatisticsHistoryMessageCtrl"
            })

            .state("app.settings.integrate", {
                url: "/integrate",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/integrate.html",
                controller: "IntegrateCtrl"
            })

            .state("app.settings", {
                abstract: true,
                url: "/settings",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/settings.html",
                controller: "SettingsCtrl"
            })

            .state("app.settings.profile", {
                url: "/profile",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/userprofile.html",
                controller: "SettingsProfileCtrl"
            })

            .state("app.settings.account", {
                url: "/account",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/account.html",
                controller: "SettingsAccountCtrl"
            })
        ;
      
        $urlRouterProvider.otherwise("/app/signup-md/signin");

    });

$yvAjaxService.$inject = ["$state", "$timeout", "$http", "$cookies", "yvUser", "yvConstants", "yvUtil", "yvLog", "yvDebug"];
function $yvAjaxService($state, $timeout, $http, $cookieStore, yvUser, yvConstants, yvUtil, yvLog, yvDebug) {

    var _admin = {
        session_uuid: null,
        uuid: null,
        name: null,
        fullname: null,
        icon: null,
    };

    var _base_post_auth = function( authString ) {
        var _auth_url = "/ppauth/token";
        var _auth_data = authString;
        var _auth_config = {};
        
        _auth_config.url = _auth_url;
        _auth_config.method = "POST";
        _auth_config.data = _auth_data;
        _auth_config.headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        };
        yvLog.d("AUTH POST url: %s, data: %o.", _auth_config.url, _auth_config.data);
        return $http(_auth_config);
    };

    var _post_auth = function(_data) {
        var _auth_data = "grant_type=password&user_email=" + _data.user_email
            + "&user_password=" + _data.user_password
            + "&client_id=" + yvConstants.PPCONSOLE_API.key;
        return _base_post_auth( _auth_data );
    };

    var _get_credentials_token = function() {
        var _auth_data = "grant_type=client_credentials"
            + "&client_secret=" + yvConstants.PPCONSOLE_API.secret
            + "&client_id=" + yvConstants.PPCONSOLE_API.key;
        return _base_post_auth( _auth_data );
    };

    var _apiPostWithToken = function(_url, _data, _token) {
        _data = _data || {};

        var apiUrl = '/api' + _url;
        var accessToken = _token;
        accessToken = accessToken.replace(/\"/g, "");
        
        return $http({
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Authorization": "OAuth " + accessToken,
            },
            method: 'POST',
            cache: false,
            url: apiUrl,
            data: _data
        });
    };
    
    var _apiPost = function(_url, _data) {
        return _apiPostWithToken(_url, _data, $cookieStore.get(yvConstants.COOKIE_KEY.ACCESS_TOKEN));
    };

    // @see mdm/mdm/api/error.py API_ERR
    var API_ERR = {
        NO_ERR: 0,
        NO_PARA: 6,
        EX_USER: 22
    };

    return {
        login: function(user) {
            return _post_auth(user);
        },

        ppconsole_get_overview_number : function(app_uuid) {
            return _apiPost("/PPCONSOLE_GET_OVERVIEW_NUMBER", {app_uuid: app_uuid});
        },

        ppconsole_get_real_time_customer_number : function(app_uuid) {
            return _apiPost("/PPCONSOLE_GET_REAL_TIME_CUSTOMER_NUMBER", {app_uuid: app_uuid});
        },

        ppconsole_get_real_time_service_number : function(app_uuid) {
            return _apiPost("/PPCONSOLE_GET_REAL_TIME_SERVICE_NUMBER", {app_uuid: app_uuid});
        },

        ppconsole_get_real_time_message_number : function(app_uuid) {
            return _apiPost("/PPCONSOLE_GET_REAL_TIME_MESSAGE_NUMBER", {app_uuid: app_uuid});
        },

        ppconsole_get_service_number_by_range : function(app_uuid, begin, end) {
            return _apiPost("/PPCONSOLE_GET_SERVICE_NUMBER_BY_RANGE", {app_uuid: app_uuid, begin_date: begin, end_date: end});
        },

        ppconsole_get_customer_number_by_range : function(app_uuid, begin, end) {
            return _apiPost("/PPCONSOLE_GET_CUSTOMER_NUMBER_BY_RANGE", {app_uuid: app_uuid, begin_date: begin, end_date: end});
        },

        ppconsole_get_message_number_by_range : function(app_uuid, begin, end) {
            return _apiPost("/PPCONSOLE_GET_MESSAGE_NUMBER_BY_RANGE", {app_uuid: app_uuid, begin_date: begin, end_date: end});
        },

        logout: function(user_uuid) {
            return _apiPost("/PPCONSOLE_LOGOUT", {user_uuid: user_uuid});
        },

        get_user_detail: function(user_uuid) {
            return _apiPost("/PP_GET_USER_DETAIL", {user_uuid: user_uuid});
        },

        get_user_detail_with_password: function(user_uuid) {
            return _apiPost("/PP_GET_USER_DETAIL", {user_uuid: user_uuid, return_password: true});
        },

        get_admin_detail: function(user_uuid) {
            return _apiPost("/PP_GET_ADMIN_DETAIL", {user_uuid: user_uuid});
        },

        get_admin_detail_with_password: function(user_uuid) {
            return _apiPost("/PP_GET_ADMIN_DETAIL", {user_uuid: user_uuid, return_password: true});
        },

        create_app: function(user_uuid, app_name) {
            return _apiPost("/PP_CREATE_APP", {user_uuid: user_uuid, app_name: app_name});
        },

        remove_app: function(user_uuid, app_uuid, app_key) {
            return _apiPost("/PP_REMOVE_APP", {user_uuid: user_uuid, app_uuid: app_uuid, app_key: app_key});
        },

        leave_app: function(user_list, app_uuid) {
            return _apiPost("/PP_LEAVE_APP", {user_list: user_list, app_uuid: app_uuid});
        },

        is_email_valid: function(requestParams) {
            return _apiPost("/PP_IS_EMAIL_VALID", requestParams);
        },

        get_app_owned_by_user: function(user_uuid) {
            return _apiPost('/PP_GET_APP_OWNED_BY_USER', {user_uuid: user_uuid});
        },
        
        update_app_info: function(requestParams) {
            return _apiPost('/PP_UPDATE_APP_INFO', requestParams);
        },

        create_user: function(requestParams) {
            return _apiPost("/PP_CREATE_USER", requestParams);
        },

        update_user: function(requestParams) {
            return _apiPost('/PP_UPDATE_USER', requestParams);
        },

        remove_user: function(user_uuid) {
            return _apiPost("/PP_REMOVE_USER", {user_uuid: user_uuid});
        },

        // requestParams: {app_uuid: xxxxx}
        get_app_conversation_list: function(requestParams) {
            return _apiPost('/PP_GET_APP_CONVERSATION_LIST', requestParams);
        },

        // get single conversation's history messages
        get_history_messages: function(requestParams) {
            return _apiPost('/PP_GET_HISTORY_MESSAGE', requestParams);
        },

        //create group
        create_org_group: function(requestParams) {
            return _apiPost('/PP_CREATE_ORG_GROUP', requestParams);
        },

        get_group_list: function(requestParams) {
            return _apiPost('/PP_GET_APP_ORG_GROUP_LIST', requestParams);
        },

        get_group_detail: function(requestParams) {
            return _apiPost('/PP_GET_ORG_GROUP_DETAIL', requestParams);
        },

        get_group_user_list: function(requestParams) {
            return _apiPost('/PP_GET_ORG_GROUP_USER_LIST', requestParams);
        },

        update_group: function(requestParams) {
            return _apiPost('/PP_UPDATE_ORG_GROUP', requestParams);
        },

        // if "app_uuid" not in _body or "group_uuid" not in _body or "user_list" not in _body:
        remove_group: function(requestParams) {
            return _apiPost('/PP_REMOVE_ORG_GROUP', requestParams);
        },

        add_group_user: function(requestParams) {
            return _apiPost('/PP_ADD_ORG_GROUP_USER', requestParams);
        },

        remove_group_user: function(requestParams) {
            return _apiPost('/PP_REMOVE_ORG_GROUP_USER', requestParams);
        },

        get_no_group_user_list: function(requestParams) {
            return _apiPost('/PP_GET_NO_GROUP_USER_LIST', requestParams);
        },

        get_team_service_user_list: function(requestParams) {
            return _apiPost('/PP_GET_APP_SERVICE_USER_LIST', requestParams);
        },

        get_api_info: function(requestParams) {
            return _apiPost('/PP_GET_API_INFO', requestParams);
        },

        get_credentials_token: function() {
            return _get_credentials_token();
        },

        signup: function(requestParams, credentials_token) {
            return _apiPostWithToken('/PPCONSOLE_SIGNUP', requestParams, credentials_token);
        },

        send_new_password: function(requestParams, credentials_token) {
            return _apiPostWithToken('/PPCONSOLE_SEND_NEW_PASSWORD', requestParams, credentials_token);
        },

        get_all_apps: function(requestParams) {
            return _apiPost('/PP_GET_ALL_APP_LIST', requestParams);            
        },

        auth: function(user) {
            return _post_auth(user);
        },

        ///////////// API_ERR_CODE ////////////////
        API_ERR: API_ERR
        
    };
} // end $yvAjaxService

angular.module("this_app.services").factory("yvAjax", $yvAjaxService);

$yvUserService.$inject = [];
function $yvUserService() {

    var _user = {
        uuid: null,
        
        app_uuid: null,
        session_uuid: null,
        
        email: null,
        fullname: null,
        
        icon: null,
        lang: null,
        role: null,
        logined: false,
        password: null,

        status: null,

        firstname: null,
        lastname: null,

        company: null,
        team: null,

        access_token: null,
    };

    return {
        get: function (attribute) {
            if (arguments.length === 0) {
                return _user;
            }
            if (_user.hasOwnProperty(attribute)) {
                return _user[attribute];
            }
            return null;
        },

        set: function (attribute, value) {
            if (_user.hasOwnProperty(attribute)) {
                _user[attribute] = value;
            }
        },

        is_admin_user: function() {
            return _user && _user.status === 'ADMIN';
        },

        set_company: function(_company) {
            _user.company = _company;
        },

        get_company: function() {
            return _user.company;
        },

        set_lastname: function(_name) {
            _user.lastname = _name;
        },
        
        get_lastname: function() {
            return _user.lastname;
        },

        set_firstname: function(_name) {
            _user.firstname = _name;
        },
        
        get_firstname: function() {
            return _user.firstname;
        },
        
        set_status: function(_status) {
            _user.status = _status;
        },

        get_status: function() {
            return _user.status;
        },
        
        get_password: function() {
            return _user.password;
        },

        set_password: function(password) {
            _user.password = password;
        },
        
        get_session: function() {
            return _user.session_uuid;
        },

        set_session: function(_id) {
            _user.session_uuid = _id;
        },

        set_email: function(_email) {
            _user.email = _email;
        },

        get_email: function() {
            return _user.email;
        },
        
        set_fullname: function(_name) {
            _user.fullname = _name;
        },

        get_fullname: function() {
            return _user.fullname;
        },
        
        set_icon: function(_icon) {
            _user.icon = _icon;
        },

        get_icon: function() {
            return _user.icon;
        },
                
        set_uuid: function(_uuid) {
            _user.uuid = _uuid;
        },

        get_uuid: function() {
            return _user.uuid;
        },
        
        set_language: function(_l) {
            _user.lang = _l;
        },

        get_language: function() {
            return _user.lang;
        },
        
        set_role: function(_role) {
            _user.role = _role;
        },

        get_role: function() {
            return _user.role;
        },
        
        set_logined: function(_logined) {
            _user.logined = _logined;
        },

        get_logined: function() {
            return _user.logined;
        },

        set_app_uuid: function(_uuid) {
            _user.app_uuid = _uuid;
        },

        get_app_uuid: function() {
            return _user.app_uuid;
        },

        set_team: function(_team) {
            if (_user.team == null) {
                _user.team = {};
            }
            if ( !_team ) {
                _user.team = _team;
            }
            for (var _i in _team) {
                if (_team.hasOwnProperty(_i)) {
                    _user.team[_i] = _team[_i];
                }
            }
            return;
        },

        get_team: function() {
            return _user.team;
        },

        set_team_agent: function(_agent_num) {
            _user.team.agent_num = _agent_num;
        },

        get_team_agent: function() {
            return _user.team.agent_num;
        },

        set_login_data: function(data) {
            this.set_logined(true);
            this.set_fullname(data.user_fullname);
            this.set_lastname(data.user_lastname);
            this.set_firstname(data.user_firstname);
            this.set_company(data.user_company);
            this.set_email(data.user_email);
            this.set_session(data.session_uuid);
            this.set_uuid(data.uuid);
            this.set_password(data.user_password);
            this.set_app_uuid(data.app_uuid);
            this.set_icon(data.user_icon);
            this.set_status(data.user_status);
            return;
        },

        //clean up all data and status
        logout: function() {
            for (var _i in _user) {
                _user[_i] = null;
            };
            _user["logined"] = false;
            console.log("===",this.get());
            return;
        },
    };
}

angular.module("this_app.services")
    .factory("yvUser", $yvUserService);

/*
 * guijin.ding@yvertical.com
 * copyright @ 2010-2015 
 * all rights reserved
 *
 */

$yvMime.$inject = [];
function $yvMime() {

    /*
      .doc     application/msword
      .docx    application/vnd.openxmlformats-officedocument.wordprocessingml.document
      .rtf     application/rtf
      .xls     application/vnd.ms-excel	application/x-excel
      .xlsx    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      .ppt     application/vnd.ms-powerpoint
      .pptx    application/vnd.openxmlformats-officedocument.presentationml.presentation
      .pps     application/vnd.ms-powerpoint
      .ppsx    application/vnd.openxmlformats-officedocument.presentationml.slideshow
      .pdf     application/pdf
      .swf     application/x-shockwave-flash
      .dll     application/x-msdownload
      .exe     application/octet-stream
      .msi     application/octet-stream
      .chm     application/octet-stream
      .cab     application/octet-stream
      .ocx     application/octet-stream
      .rar     application/octet-stream
      .tar     application/x-tar
      .tgz     application/x-compressed
      .zip     application/x-zip-compressed
      .z       application/x-compress
      .wav     audio/wav
      .wma     audio/x-ms-wma
      .wmv     video/x-ms-wmv
      .mp3 .mp2 .mpe .mpeg .mpg     audio/mpeg
      .rm      application/vnd.rn-realmedia
      .mid .midi .rmi     audio/mid
      .bmp     image/bmp
      .gif     image/gif
      .png     image/png
      .tif .tiff  image/tiff
      .jpe .jpeg .jpg     image/jpeg
      .txt      text/plain
      .xml      text/xml
      .html     text/html
      .css      text/css
      .js       text/javascript
      .mht .mhtml   message/rfc822
    */
    
    
    var _mime_icon = function(_mime) {
        var _prefix = "../img/";
        var _word = _prefix + "document-word.png";
        var _xsl = _prefix + "document-xls.png";
        var _pdf = _prefix + "document-pdf.png";
        var _ppt = _prefix + "document-ppt.png";
        var _plain = _prefix + "document-plain.png";
        
        var _map = {
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : _word,
            "application/msword": _word,
            "application/vnd.ms-excel" : _xsl,
	        "application/x-excel": _xsl,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : _xsl,
            "application/vnd.ms-powerpoint" : _ppt,
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" : _ppt,
            "application/vnd.ms-powerpoint" : _ppt,
            "application/vnd.openxmlformats-officedocument.presentationml.slideshow" : _ppt,
            "application/pdf" : _pdf,
        };
        
        if (_map.hasOwnProperty(_mime)) {
            return _map[_mime];
        }
        
        return _plain;
    };


    return {
        mime_icon: function(_mime) {
            return _mime_icon(_mime);
        },
    };
}

angular.module("this_app").factory('yvMime', $yvMime);

$yvUtilService.$inject = ["$rootScope", "$translate", "$http", "$base64", "yvConstants", "yvLog"];
function $yvUtilService($rootScope, $translate, $http, $base64, yvConstants, yvLog) {

    var _is_test_host = function(host) {
        if (host.indexOf("ppmessage.cn") == -1) {
            return true;
        }
        return false;
    },

        // Message util
        messageUtil = (function() {

            return {
                getMessageSummary: function(lang, type, messageBody) {
                    
                    if (!lang || !type || !messageBody) return '';

                    var typeArray = lang;
                    
                    switch (type) {
                    case 'TEXT':
                        return messageBody;

                    case 'FILE':
                        return '[' + typeArray['statistics.historymessages.MESSAGE_FILE_TYPE_TAG'] + '] ' + JSON.parse(messageBody).name;

                    case 'IMAGE':
                        return '[' + typeArray['statistics.historymessages.MESSAGE_IMAGE_TYPE_TAG'] + ']';

                    case 'TXT':
                        return '[' + typeArray['statistics.historymessages.MESSAGE_TXT_TYPE_TAG'] + ']';

                    default:
                        return '';
                    }
                },

                getMessageFormatedDate: function(messageJsonBody) {
                    if (!messageJsonBody) return '';

                    if ( messageJsonBody.message_body &&
                         typeof messageJsonBody.message_body === 'string' ) {
                        var jsonMsg = JSON.parse( messageJsonBody.message_body );
                        return moment.unix( jsonMsg.ts ).format( 'YYYY-MM-DD HH:mm' );
                    }

                    return dateUtil.moment(messageJsonBody.updatetime).format('YYYY-MM-DD HH:mm');
                },

                getConversationUpdateTsInSeconds: function( conversation ) {
                    if ( !conversation ) return 0;
                    
                    if ( conversation.latest_message ) {
                        var msgStringBody = conversation.latest_message.message_body;
                        if ( msgStringBody && typeof msgStringBody === 'string' ) {
                            return JSON.parse( msgStringBody ).ts;
                        }
                    }
                    
                    return dateUtil.moment( conversation.updatetime ).unix();
                }
            }
            
        })(),

        // Icon Util
        iconUtil = (function() {

            var DEFAULT = yvConstants.DEFAULT_USER_ICON;

            return {

                // iconUtil.getIcon(); // return `yvConstants.DEFAULT_USER_ICON`
                // iconUtil.getIcon('xxx-xxx-xxx-xxx-xx'); // return '/download/xxx-xxx-xxx-xxx-xx';
                // iconUtil.getIcon('http://abc.com/logo.png'); // return 'http://abc.com/logo.png';
                getIcon : function(icon) {

                    if (!icon) return DEFAULT;

                    var isHttpLink = /(^https?:\/\/)|(^w{3})/.test(icon);
                    return isHttpLink ? icon : fileUtil.getFileDownloadUrl(icon);
                    
                }
                
            }
            
        })(),

        // Date util
        dateUtil = (function() {
            return {
                // `time`: '2015-12-03 11:12:02 123432'
                moment: function(time) {
                    return moment(time, 'YYYY-MM-DD HH:mm:ss SSS');
                }
            }
        })(),

        // File util
        fileUtil = (function() {

            return {
                
                getFileDownloadUrl: function(fid, fname) {
                    var url = '/download/' + fid;
                    fname && (url += "?file_name=" + fname);
                    return url;
                },

                // download large txt content
                getRemoteTextFileContent: function(url, successCallback, errorCallback) {
                    return $http({
                        method: "GET",
                        cache: false,
                        url: url,
                        cache: false,
                    })
                        .success(function(response) {
                            if (successCallback) successCallback(response);
                        })
                        .error(function(error) {
                            if (errorCallback) errorCallback(error);
                        });
                }
            }
            
        })(),

        validator = ( function() {

            var MIN_LENGTH = 1,
                MAX_LENGTH = 16,
                ERR_CODE = {
                    OK: 0, // everything is ok
                    MIN_LENGTH_LIMIT: 1, // password is too short
                    MAX_LENGTH_LIMIT: 2, // password is too long
                    CONTAIN_WHITESPACE_AT_HEAD_OR_TAIL: 3, // password can not contains whitespace at head and tail
                    REPEAT_PASSWORD_MIS_MATCH : 4 // second password miss match the first one
                };
            
            return {

                ERR_CODE: ERR_CODE,

                // @param password : your password
                validatePassword: function( password ) {
                    if ( !password || password.length < MIN_LENGTH ) return ERR_CODE.MIN_LENGTH_LIMIT;
                    if ( password.length > MAX_LENGTH ) return ERR_CODE.MAX_LENGTH_LIMIT;
                    if ( /(^\s+)|(\s+$)/g.test( password ) ) return ERR_CODE.CONTAIN_WHITESPACE_AT_HEAD_OR_TAIL;
                    return ERR_CODE.OK;
                },

                // @param password : your password
                // @param @optional repeatPassword : your repeat password
                validateRepeatPassword: function( password, repeatPassword ) {
                    var errorCode = this.validatePassword( password );
                    if ( errorCode !== ERR_CODE.OK ) return errorCode;
                    if ( password !== repeatPassword ) return ERR_CODE.REPEAT_PASSWORD_MIS_MATCH;
                    return ERR_CODE.OK;
                }
            }
            
        } )();

    return {
        
        translate: function(scope, var_name, langs, on_trans) {
            var _trans = function() {
                $translate(langs).then(function(_t) {
                    scope[var_name] = _t;
                    if (on_trans)
                        on_trans();
                });
            };

            var _remove_trans = $rootScope.$on('$translateChangeSuccess', _trans);
            _trans();

            scope.$on("$destroy", function() {
                _remove_trans();
            });
        },

        noti: function(nstring, success) {
            var _t = "danger";
            if (success) {
                _t = "success";
            }
            
            $.bootstrapGrowl(nstring, {
                ele: 'body', // which element to append to
                type: _t, // (null, 'info', 'danger', 'success')
                offset: {from: 'top', amount: 20}, // 'top', or 'bottom'
                align: 'center', // ('left', 'right', or 'center')
                width: 400, // (integer, or 'auto')
                delay: 4000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
                allow_dismiss: true, // If true then will display a cross to close the popup.
                stackup_spacing: 10 // spacing between consecutively stacked growls.
            });
        },

        uuid: function() {
            var d = new Date().getTime();
            var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x7|0x8)).toString(16);
            });
            return id;
        },

        get_view_port: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            
            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        is_valid_email: function (email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        },

        base64_decode: function(input) {
            return $base64.decode(input);
        },

        base64_encode: function(input) {
            return $base64.encode(input);
        },
        
        http_protocol: function(host) {
            if(_is_test_host(host)) {
                return "http://";
            }
            return "https://";
        },

        ws_protocol: function(host) {
            if(_is_test_host(host)) {
                return "ws://";
            }
            return "wss://";
        },

        // check if a string contain unregular words
        regexp_check: function(str) {
            var pattern = RegExp("[\\u4E00-\\u9FFF\\dA-z@\-\_\\s*]+","i");
            if( !str || !str.match(pattern)) {
                return false;
            };
            var reg_length = str.match(pattern).toString().length;
            if (reg_length == str.length)
                return true;
            else
                return false;
        },

        formateTimestamp: function(time) {
            var dateString = moment(time).format('YYYY-MM-DD HH:mm:ss');
            return dateString;
        },
        
        // ---------------
        // Message Utils
        // ---------------

        messageUtil: messageUtil,

        // ---------------
        // Icon Utils
        // ---------------

        iconUtil: iconUtil,

        // ---------------
        // Moment Utils
        // ---------------

        dateUtil: dateUtil,

        // ---------------
        // File Utils
        // ---------------
        fileUtil: fileUtil,

        // ---------------
        // Validator Utils
        // ---------------
        validator: validator,

        isNull: function( any ) {
            return any === undefined || any === null;
        }
        
    };
}

angular.module("this_app.services")
    .factory("yvUtil", $yvUtilService);

$yvDocScrollHelper.$inject = ["$location", "$anchorScroll"];
function $yvDocScrollHelper($location, $anchorScroll) {

    function _scrollToTarget(event, id) {
        jQuery('.bs-sidebar .nav li > a').parentsUntil('.bs-sidebar', '.active').removeClass('active');
        var active = jQuery(event.target).parents('li').addClass('active');
        if (active.parent('.dropdown-menu').length) {
            active = active
                .closest('li.dropdown')
                .addClass('active');
        }
        
        $location.hash(id);
        $anchorScroll();
    }

    // SCROLLSPY CLASS DEFINITION
    // ==========================
    // Copied From: https://github.com/twbs/bootstrap/blob/e38f066d8c203c3e032da0ff23cd2d6098ee2dd6/js/scrollspy.js

    function ScrollSpy(element, options) {
        this.$body          = $(document.body)
        this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
        this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector       = (this.options.target || '') + ' .nav li > a'
        this.offsets        = []
        this.targets        = []
        this.activeTarget   = null
        this.scrollHeight   = 0

        this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
        this.refresh()
        this.process()
    }

    ScrollSpy.VERSION  = '3.3.5'

    ScrollSpy.DEFAULTS = {
        offset: 10
    }

    ScrollSpy.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }

    ScrollSpy.prototype.refresh = function () {
        var that          = this
        var offsetMethod  = 'offset'
        var offsetBase    = 0
        
        this.offsets      = []
        this.targets      = []
        this.scrollHeight = this.getScrollHeight()

        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = 'position'
            offsetBase   = this.$scrollElement.scrollTop()
        }

        this.$body
            .find(this.selector)
            .map(function () {
                var $el   = $(this)
                var href  = $el.data('target') || $el.attr('href')
                var $href = /^#./.test(href) && $(href)

                return ($href
                        && $href.length
                        && $href.is(':visible')
                        && [[$href[offsetMethod]().top + offsetBase, href]]) || null
            })
            .sort(function (a, b) { return a[0] - b[0] })
            .each(function () {
                that.offsets.push(this[0])
                that.targets.push(this[1])
            })
                }

    ScrollSpy.prototype.process = function () {
        var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.getScrollHeight()
        var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
        var offsets      = this.offsets
        var targets      = this.targets
        var activeTarget = this.activeTarget
        var i

        if (this.scrollHeight != scrollHeight) {
            this.refresh()
        }

        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
        }

        if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null
            return this.clear()
        }

        for (i = offsets.length; i--;) {
            activeTarget != targets[i]
                && scrollTop >= offsets[i]
                && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
                && this.activate(targets[i])
        }
    }

    ScrollSpy.prototype.activate = function (target) {
        this.activeTarget = target

        this.clear()

        var selector = this.selector +
            '[data-target="' + target + '"],' +
            this.selector + '[href="' + target + '"]'

        var active = $(selector)
            .parents('li')
            .addClass('active')

        if (active.parent('.dropdown-menu').length) {
            active = active
                .closest('li.dropdown')
                .addClass('active')
        }

        active.trigger('activate.bs.scrollspy')
    }

    ScrollSpy.prototype.clear = function () {
        $(this.selector)
            .parentsUntil(this.options.target, '.active')
            .removeClass('active')
    }
    
    return {
        scrollToTarget: function(event, id) {
            _scrollToTarget(event, id);
        },

        scrollspy: function(options) {
            new ScrollSpy('body', options);
        }
    }
}

angular.module("this_app.services")
    .factory("yvDocScrollHelper", $yvDocScrollHelper);

angular.module("this_app").
   factory("yvType", [
    "yvConstants",
function (yvConstants) {

    function _get_subtype(message) {
        // message query from db
        if (message.message_subtype) {
            return message.message_subtype;
        }
        // incoming message message subtype
        if (message.ms) {
            return message.ms;
        }

        return null;
    }

    return {
        is_logout: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.LOGOUT) {
                return true;
            }
            return false;
        },

        is_document: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.DOCUMENT) {
                return true;
            }
            return false;
        },

        is_file: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.DOCUMENT) {
                return true;
            }
            if (subtype === yvConstants.MESSAGE_SUBTYPE.FILE) {
                return true;
            }
            return false;
        },

        is_video: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.VIDEO) {
                return true;
            }
            return false;
        },


        is_single_card: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.SINGLE_CARD) {
                return true;
            }
            return false;
        },

        is_multiple_card: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.MULTIPLE_CARD) {
                return true;
            }
            return false;
        },

        is_text: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.TEXT) {
                return true;
            }
            return false;
        },

        is_txt: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.TXT) {
                return true;
            }
            return false;
        },

        is_image: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.IMAGE) {
                return true;
            }
            return false;
        },

        is_gps_location: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.GPS_LOCATION) {
                return true;
            }
            return false;
        },

        is_audio: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.AUDIO) {
                return true;
            }
            return false;
        },

        is_left: function (message) {
            if (message.message_direction === yvConstants.MESSAGE_DIR.DIR_IN) {
                return true;
            }
            return false;
        },

        is_right: function (message) {
            if (message.message_direction === yvConstants.MESSAGE_DIR.DIR_OUT) {
                return true;
            }
            return false;
        },

        is_left_audio: function (message) {
            if (this.is_left(message) && this.is_audio(message)) {
                return true;
            }
            return false;
        },

        is_right_audio: function (message) {
            if (this.is_right(message) && this.is_audio(message)) {
                return true;
            }
            return false;
        }
    };
}]);

// convenience to manager log
// let you easily find you log messages !

// Copy and modified from ppcom/jquery/src/service/pp-service-debug.js
// @author kun.zhao@yvertical.com
//
// How to use:
//
// yvLog.h().d(obj1, obj2, obj3, ...);
//

$yvLog.$inject = [];
function $yvLog() {

    var DEBUG = true, // open or close debug
        DEBUG_WARNING = true, // debug `warning` info
        
        supportConsole = !(typeof console === "undefined" || typeof console.log === "undefined"),
        supportConsoleApply = supportConsole && !(typeof console.log.apply === "unknown" || typeof console.log.apply === "undefined");

    // Highlight
    function h() {
        var cssStr = "%c" + '↓↓↓↓↓↓↓↓↓↓';
        d(cssStr, "font-size:28px; color:blue;");
        return this;
    }

    // Debug
    function d() {
        if (DEBUG) {
            var args = Array.prototype.slice.call(arguments);
            supportConsoleApply ? console.log.apply(console, args) : console.log(args);
        }
        return this;
    }

    function w() {
        if ( DEBUG_WARNING ) {
            var args = Array.prototype.slice.call(arguments);
            supportConsoleApply ? console.log.apply(console, args) : console.log(args);
        }
        return this;
    }
    
    return {
        h: h,
        d: d,
        w: w
    }
}

angular.module("this_app.services")
    .factory("yvLog", $yvLog);

//////////// MAIN GOLE: HELP US TO DEBUG FROM CONSOLE ///////////////////////////
(function() {

    yvDebug.$inject = [ 'yvLog' ];
    function yvDebug( yvLog ) {

        var ON = true,

            api = {
                attach: attach,

                h: yvLog.h,
                d: yvLog.d,
                w: yvLog.w
            };
        
        return api;

        // attach `func` to `window` obj to help us to see the inner world of our app from `console`
        function attach( name, func ) {
            // `Function.name` is part of ES6
            if ( window !== undefined && ON && name !== undefined ) window [ name ] = func;
            return api;
        }
        
    }

    angular.module( "this_app.services" ).factory( "yvDebug", yvDebug );

})();

/**
 * Prepare info for each page when init
 *
 * - For each page, on `_init` method, you should call `yvLogin.prepare` to prepare `active user` and `active user_team` info
 *
 * ```javascript
 * yvLogin.prepare( function() { // prepare ok ... }, { $scope: $scope, onRefresh: function() { // refresh page ... } } );
 * ```
 * 
 * - Difference between `activeUser` and `yvLoginedUser`. 
 *
 *   for `Non-Admin` user, `yvLoginedUser` is equal to `yvActiveUser`; 
 *
 *   for `Admin` user, `yvLoginedUser` is `Admin User`, and `yvActiveUser` is current active user which associated with current
 *   selected app. if you pass `{ $scope: xxx, onRefresh: xxx }` param in `yvLogin.prepare` method, then `yvLogin` will try to 
 *   bind `$destroy` and `yvConstants.BROADCAST_EVENT_KEY.REFRESH_PAGE` event to `$scope`, when a new app is selected, then you 
 *   will receive a notify callback to let you `refresh page`;
 * 
 * ----------------------------------------------------
 * |                               ( yvLoginedUser )  | <= `website header`
 * ----------------------------------------------------
 * |                                                  | 
 * |                                                  |
 * |                                                  |
 * |           ( activeUser: yvUser )                 | <= `website content`
 * |                                                  |
 * |                                                  |
 * |                                                  |
 * ----------------------------------------------------
 *
 */
( function() {

    yvLogin.$inject = [ 'yvUser', 'yvAjax', 'yvDebug', 'yvAppService', 'yvConstants', 'yvLoginedUser',
                        '$rootScope', "$state", "$timeout", "$cookies" ];
    function yvLogin( yvUser, yvAjax, yvDebug, yvAppService, yvConstants, yvLoginedUser, $rootScope, $state, $timeout, $cookieStore ) {

        var ERROR_CODE = { OK: 0, STATUS_ILLEGAL: 1, LOGIN_ERROR: 2 },

            STATUS = {
                OWNER_0: 1 << 0,
                OWNER_1: 1 << 1,
                OWNER_2: 1 << 2,
                ADMIN: 1 << 3
            },

            activeUser;
        
        return {
            
            ERROR_CODE: ERROR_CODE,
            STATUS: STATUS,
            
            prepare: prepare,
            updateLoginedUser: updateLoginedUser,
            updateActiveUser: updateActiveUser,
            check_logined: check_logined,
            checkActiveUser: checkActiveUser,
            checkLoginedUser: checkLoginedUser,

            getLoginedUser: getLoginedUser,
            isLogined: isLogined,
            setLogined: setLogined,
            logout: logout,

            updateActiveUserCookieKey: updateActiveUserCookieKey,
            updateLoginedUserCookieKey: updateLoginedUserCookieKey
            
        }

        function prepare( callback, config ) {
            
            if ( config &&
                 config.$scope &&
                 config.onRefresh ) {
                
                var scope = config.$scope,
                    offListenerToken = scope.$on( yvConstants.BROADCAST_EVENT_KEY.REFRESH_PAGE, function() {
                        _tryFetchAppTeam( function( errorCode ) {
                            if ( errorCode === ERROR_CODE.OK ) {
                                yvDebug.d( '===event:refreshpage===' );
                                config.onRefresh();
                            }
                        } );
                    } );

                scope.$on( '$destroy', function() {
                    yvDebug.d( '===destroy===' );
                    if ( offListenerToken ) offListenerToken();
                } );
                
            }
            
            checkActiveUser( function() {
                _tryFetchAppTeam( function( errorCode ) {

                    if ( errorCode === ERROR_CODE.OK ) {
                        checkLoginedUser();
                    }
                    if ( callback ) callback( errorCode );
                    
                } , config && config.expectedStatus );
            } );
        }

        function updateLoginedUser( user ) {
            yvLoginedUser.update( user );
            yvDebug.d( '===logined user===', user );
        }

        function updateActiveUser( user ) {
            yvUser.set_login_data( user );
            activeUser = user;
            yvDebug.d( '===active user===', user );
        }

        function updateActiveUserCookieKey( userUUID ) {
            $cookieStore.put(yvConstants.COOKIE_KEY.ACTIVE_USER_UUID, userUUID);
        }

        function updateLoginedUserCookieKey( userUUID, accessToken ) {
            $cookieStore.put(yvConstants.COOKIE_KEY.ACCESS_TOKEN, accessToken); // store access_token
            $cookieStore.put(yvConstants.COOKIE_KEY.LOGINED_USER_UUID, userUUID);
        }

        function getLoginedUser() {
            return yvLoginedUser.get();
        }

        function isLogined() {
            return yvLoginedUser.isLogined();
        }

        function setLogined( l ) {

            yvLoginedUser.setLogined( l );

            if ( l ) {
                var broadcastObj = {
                    isAdmin: yvLoginedUser.isAdminUser()
                };
                $rootScope.$emit( yvConstants.BROADCAST_EVENT_KEY.LOGIN_FINISHED, broadcastObj );
                yvDebug.d( '===event:login finished===' );
            }
                
        }

        function logout() {
            
            yvLoginedUser.logout();
            activeUser = null;
            yvUser.logout();

            $cookieStore.remove( yvConstants.COOKIE_KEY.LOGINED_USER_UUID );
            $cookieStore.remove( yvConstants.COOKIE_KEY.ACTIVE_USER_UUID );
            $cookieStore.remove( yvConstants.COOKIE_KEY.ACCESS_TOKEN );
            
        }

        function checkActiveUser( logined, unlogined, state ) {
            if ( activeUser ) {
                if ( logined ) logined( activeUser );
                return;
            }
            
            _makeSureUserInfoPreparedOK( yvConstants.COOKIE_KEY.ACTIVE_USER_UUID, function( data ) {
                updateActiveUser( data );
                _tryFetchAppTeam( logined );
            } , unlogined, state );            
        }

        function checkLoginedUser( logined, unlogined, state ) {
            check_logined( logined, unlogined, state );
        }

        function check_logined( logined, unlogined, state ) {
            if ( yvLoginedUser.get() ) {
                if ( logined ) logined( yvLoginedUser.get() );
                return;
            }
            
            _makeSureUserInfoPreparedOK( yvConstants.COOKIE_KEY.LOGINED_USER_UUID, function( data ) {

                updateLoginedUser( data );
                setLogined( true );
                
                if ( logined ) logined( data );
            }, function() {

                setLogined( false );
                
                if ( unlogined ) unlogined();
            }, state );
        }

        function _makeSureUserInfoPreparedOK( cookieKey, succCB, errorCB, state ) {
            var _user_uuid = $cookieStore.get( cookieKey );
            if ( !_user_uuid ) {
                if ( errorCB ) {
                    errorCB();
                    return;
                }
                if (state) {
                    $timeout(function() {
                        $state.go(state);
                    });
                }
                return;
            }

            _user_uuid = _user_uuid.replace(/\"/g, "");
            var _loggedin = yvAjax.get_user_detail_with_password(_user_uuid);

            var _error = function() {
                $timeout(function() {
                    if ( errorCB ) {
                        errorCB();
                    } else {
                        if (state) {
                            $timeout(function() {
                                $state.go(state);
                            });
                        }
                    }
                });
            };
            
            _loggedin.success(function(data) {
                if (data.error_code == 0) {
                    $timeout(function() {
                        if ( succCB ) succCB( data );
                    });
                } else {
                    if ( errorCB ) errorCB();
                }
                return;
            });

            _loggedin.error(function(data) {
                if ( errorCB ) errorCB();
            });
        }

        function _tryReselectApp( callback, expectedStatus ) {
            var activeApp = yvAppService.activeApp();
            if ( activeApp ) {
                yvAppService.selectApp( activeApp, function( selectSuccResponse ) {
                    _tryFetchAppTeam( callback, expectedStatus );
                }, function( selectErrorResponse ) {
                    if ( callback ) callback ( ERROR_CODE.LOGIN_ERROR );
                } );
            }
        }

        function _tryFetchAppTeam( callback, expectedStatus ) {
            var avaliableStatus = STATUS.OWNER_2 | STATUS.ADMIN | STATUS.OWNER_1 ;
            
            if ( expectedStatus !== null &&
                 expectedStatus !== undefined &&
                 expectedStatus !== NaN ) {
                avaliableStatus = expectedStatus;
            }

            var status = STATUS[ yvUser.get_status() ];
            if ( status === undefined ||
                 ( status & avaliableStatus !== 1 ) ) {
                onResponse( ERROR_CODE.STATUS_ILLEGAL );
                return;
            }

            if( !yvUser.get_team() ) {
                var _get = yvAjax.get_app_owned_by_user( yvUser.get_uuid() );
                _get.success( function(data) {
                    yvUser.set_team( data.app );
                    onResponse( ERROR_CODE.OK );
                } );
            } else {
                onResponse( ERROR_CODE.OK );
            }

            function onResponse( errorCode ) {
                if ( callback ) callback( errorCode );
            }
        }
        
    }

    angular.module( "this_app.services" ).factory( "yvLogin", yvLogin );
    
} ) ();

/**
 *
 * [app1, app2, ...]
 *   | 
 *   |
 * `user_uuid`
 *   |
 *   |
 * yvAjax.get_user_detail
 *   |
 *   |
 * `yvUser.set_login_data`
 *
 */
( function() {

    yvAppService.$inject = [ 'yvDebug', 'yvAjax', 'yvUser', '$cookies', '$rootScope', 'yvConstants', 'yvLoginedUser' ]
    function yvAppService( yvDebug, yvAjax, yvUser, $cookieStore, $rootScope, yvConstants, yvLoginedUser ) {

        var apps = [],

            appUserMap = {
                //
                // user_uuid: {
                //     user_response: `response` which get from `yvAjax.get_user_detail`
                // },
                //
                // ...
            };

        return {
            getApps: asyncGetApps,
            selectApp: selectApp,
            activeApp: activeApp,

            clear: clear
        }

        // ==============

        function asyncGetApps( callback ) {
            if ( !yvLoginedUser.get() ||
                 !yvLoginedUser.isAdminUser() ) {
                if (callback) callback( [] );
                return;
            }

            if ( apps && apps.length > 0 ) {
                if (callback) callback( apps );
                return;
            }

            yvAjax.get_all_apps( {
                user_uuid: yvLoginedUser.userUUID()
            })
                .success( function( r ) {                    
                    if ( r.error_code === 0 ) {
                        
                        var teams = r.app;
                        angular.forEach( teams, function( value, index ) { // assign `is_selected` to each app
                            value.is_selected = yvLoginedUser.userUUID() === value.user_uuid;
                        } );
                        apps = teams;
                        
                        if (callback) callback( teams );
                        
                    } else {
                        if (callback) callback( [] );
                    }
                } )
                .error( function( e ) {
                    if (callback) callback( [] );
                } );
        }

        function selectApp( app, succCB, errorCB ) {

            angular.forEach( apps, function( value, index ) {
                value.is_selected = value.uuid === app.uuid;
            } );

            if ( appUserMap[ app.user_uuid ] ) {

                var cachedUserInfo = appUserMap[ app.user_uuid ];
                _updateUser( cachedUserInfo.user_response );
                if (succCB) succCB();
                
            } else {
                
                yvAjax.get_user_detail_with_password( app.user_uuid )
                    .success( function( response ) {
                        if ( response.error_code === 0 ) {

                            _updateUser( response );
                            var cacheUser = {
                                user_response: response
                            };
                            appUserMap[ response.uuid ] = cacheUser;                                        
                            
                            if (succCB) succCB();
                            
                        } else {
                            if (errorCB) errorCB( response );
                        }
                    } )
                    .error( function( error ) {
                        if (errorCB) errorCB( error );
                    } );
            }
            
        }

        function activeApp() {
            var activeApp;
            angular.forEach( apps, function( value, index ) {
                if ( value.is_selected ) {
                    activeApp = value;
                }
            } );
            return activeApp;
        }

        function clear() {
            apps = [];            
        }

        function _updateUser( userResponse ) {
            yvUser.set_login_data( userResponse );
            yvUser.set_team( null );
        }
        
    }

    angular.module( "this_app.services" ).factory( "yvAppService", yvAppService );
    
}() )

angular.module("this_app")
    .controller("SignupMdCtrl", function($scope, $state, $stateParams, $timeout, $translate, $cookieStore, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvDebug, yvLogin, yvAppService) {

        $scope.user = {
            user_status: "OWNER_2",
            is_service_user: false,
            user_fullname: "",
            user_email: "",
            user_password: "",
            app_name: "",

            user_password_is_visible: false,
            password_input_type: "password",
        };

        var get_token = function (onSuccess, onError) {
            yvAjax.get_credentials_token()
                .success( function( response ) {
                    if (response.access_token) {
                        onSuccess && onSuccess( response );
                    } else {
                        onError && onError( response );
                    }
                } )
                .error( function( error ) {
                    onError && onError( error );
                } );
        };
                
        var signup = function(user) {
            // first try to get token
            get_token( function(response) {
                var credentialsToken = response.access_token;
                console.log(response);
                var copyUser = angular.extend(
                    angular.copy(user),
                    {
                        user_password: sha1( user.user_password ),
                        app_uuid: yvConstants.PPMESSAGE_APP.uuid
                    }
                );
                
                yvAjax.signup(copyUser, credentialsToken)
                    .success(function(data) {
                        if (data.error_code == 0) {
                            yvAjax.login(copyUser).success(function(data) {
                                if ( data.error_code == 0 ) {
                                    yvLogin.updateActiveUserCookieKey( data.user_uuid );
                                    yvLogin.updateLoginedUserCookieKey( data.user_uuid, data.access_token );
                                }
                                yvLogin.updateLoginedUser( copyUser );
                                yvLogin.setLogined( true );
                                $state.go("app.settings.overview")
                            }).error(function(data) {
                                console.error("signup error");
                                $scope.toast_error_string("SERVICE_ERROR_TAG");
                            });
                        } else {
                            if (data.error_code == yvAjax.API_ERR.EX_USER) {
                                $scope.toast_error_string("EMAIL_USED_TAG");
                            } else {
                                $scope.toast_error_string("SERVICE_ERROR_TAG");
                            }
                        }
                    })
                    .error(function(data) {
                        console.error("create portal user error");
                    });
                
            }, function(error) {
                // get token error
                $scope.toast_error_string("SERVICE_ERROR_TAG");
            } );
        };

        var signin = function(user) {
            var password = sha1($scope.user.user_password);
            yvAjax.login({user_email: $scope.user.user_email, user_password: password})
                .success(function(data) {
                    if (data.error_code == 0) {
                        yvLogin.updateActiveUserCookieKey( data.user_uuid );
                        yvLogin.updateLoginedUserCookieKey( data.user_uuid, data.access_token );
                        yvAjax.get_user_detail_with_password(data.user_uuid)
                            .success(function(data) {
                                yvDebug.d('get_user_detail', data);
                                if (data.error_code != 0) {
                                    yvLog.w("get detail failed %s", data);
                                    return;
                                }
                                
                                yvLogin.updateLoginedUser( angular.copy( data ) );
                                yvLogin.setLogined( true );
                                
                                var _url = yvConstants.USER_STATUS[data.user_status];
                                if (data.user_status == "SERVICE") {
                                    yvLogin.updateActiveUser( data );
                                    $scope.start_ppmessage(true);
                                    return;
                                }

                                if (data.user_status == "ADMIN") {
                                    _url = yvConstants.USER_STATUS["OWNER_2"];
                                    yvAppService.getApps( function( apps ) {
                                        $state.go(_url);
                                    } );
                                    return;
                                }
                                
                                if (data.user_status == "OWNER_2") {
                                    $state.go(_url);
                                }
                                
                                return;
                            });
                    } else {
                        $scope.toast_error_string("SIGNIN_FAILED_TAG");
                    }
                })
                .error(function(data) {
                    $scope.toast_error_string("SIGNIN_FAILED_TAG");
                });

        };

        var send_email = function(user) {
            var _s = function() {
                $scope.toast_success_string("SEND_NEW_PASSWORD_SUCCESS_TAG");
            };
            var _e = function() {
                $scope.toast_error_string("SEND_NEW_PASSWORD_FAILED_TAG");
            };
            
            get_token(function(response) {
                var credentialsToken = response.access_token;
                console.log(response);
                yvAjax.send_new_password({user_email: user.user_email}, credentialsToken).success(function() {
                    _s();
                }).error(function() {
                    _e();
                });
            }, function() {
                _e();
            });
        };
        
        $scope.sign_up_form_submit = function() {
            signup($scope.user);
        };

        $scope.sign_in_form_submit = function() {
            signin($scope.user);
        };

        $scope.reset_password_form_submit = function() {
            send_email($scope.user);
        };

        $scope.show_user_password = function(show) {
            if (show) {
                $scope.user.user_password_is_visible = true;
                $scope.user.password_input_type = "text";
            } else {
                $scope.user.user_password_is_visible = false;
                $scope.user.password_input_type = "password";
            }
        };

        $scope.ui = {selected_index: 0};
        if ($stateParams.sign_what && $stateParams.sign_what == "signup") {
            $scope.ui.selected_index = 0;
        }

        if ($stateParams.sign_what && $stateParams.sign_what == "signin") {
            $scope.ui.selected_index = 1;
        }

        if ($stateParams.sign_what && $stateParams.sign_what == "reset") {
            $scope.ui.selected_index = 2;
        }
        
    }); // end login ctrl

angular.module("this_app")
    .controller("AppCtrl", function($window, $scope, $rootScope, $location, $state, $translate, $timeout, $cookies, $filter, toastr, yvAjax, yvUser, yvUtil, yvDebug, yvLogin, yvAppService, yvConstants, yvLoginedUser, yvTransTags) {

        $scope._languages = [
            {
                lang: "zh-CN",
            },            
            {
                lang: "en",
            },
        ];

        var isLogin = yvLogin.isLogined();

        $scope.isAdminUser = false; // is `ppconsole admin` user
        $scope.apps = []; // apps
        $scope.selectApp = selectApp; // Event: `selectApp`
        $scope.appStyle = appStyle; // css style
        $scope.menuStyle = {
            'margin-top': $scope.isAdminUser ? '12px' : '24px'
        }; // menu style
        $scope.selectedApp = { app_name: '' };

        var _getPreferredLanguage = function() {
            var _p = $translate.use();
            var _l = $scope._languages.length;
            for (var i = 0; i < _l; i++) {
                if ($scope._languages[i].lang == _p) {
                    return $scope._languages[i].lang;
                }
            }
            return $scope._languages[0].lang;
        };
        
        var _getLanguage = function() {
            var _l = yvUser.get_language();
            if (_l == null) {
                _l = _getPreferredLanguage();
                yvUser.set_language(_l);
            }
            return _l;
        };

        
        
        $scope.toggle_mobile_menu = function($event) {
            if ($(".mobile-menu").hasClass("active")) {
                $(".mobile-menu").removeClass("active");
                $(".mobile-menu-items").removeClass("active");
            } else {
                $(".mobile-menu").addClass("active");
                $(".mobile-menu-items").addClass("active");
            }
        };

        $scope.click_mobile_items = function($event) {
            if ($(".mobile-menu").hasClass("active")) {
                $(".mobile-menu").removeClass("active");
                $(".mobile-menu-items").removeClass("active");
            } 
        };

        $scope.switch_to = function(route_str) {
            var url = 'app.' + route_str;
            $state.go(url);
        };
        
        $scope.main = function() {
            window.open("https://www.ppmessage.com");
            //$state.go("app.main");
        };

        $scope.blog = function() {
            window.open("http://blog.ppmessage.cn");
        };
        
        $scope.forum = function() {
            window.open("http://forum.ppmessage.cn");
        };
        
        $scope.switch_to_english = function () {
            yvUser.set_language("en");
            $translate.use("en");
        };

        $scope.switch_to_chinese = function () {
            yvUser.set_language("zh-CN");
            $translate.use("zh-CN");
        };

        $scope.is_lang_english = function() {
            var _l = yvUser.get_language();
            if (_l == null) {
                return true;
            }
            if (_l == "en") {
                return true;
            }
            return false;
        };
        
        $scope.get_user_fullname = function() {
            return yvLogin.getLoginedUser() ? yvLogin.getLoginedUser().user_fullname : "";
        };

        $scope.is_logined = function() {
            return isLogin;
        };

        $scope.login = function() {
            $state.go("login");
        };

        $scope.show_settings_menu = function() {
            return yvLoginedUser.get() && yvLoginedUser.get().user_status === "OWNER_2";
        };
        
        $scope.start_ppmessage = function(in_this) {
            var userUuid = yvUser.get_uuid();
            var password = yvUser.get_password();
            var userEmail = yvUser.get_email();
            var body = {
                user_email: userEmail,
                user_password: password,
                user_uuid: userUuid,
            };
            console.log("autologin with: %s", body);
            body = yvUtil.base64_encode(JSON.stringify(body));
            var http = yvUtil.http_protocol(location.hostname);
            var url = http + location.host + "/ppkefu/#/noapp/auto-login/" + body;
            if (in_this) {
                self.location = url;
            } else {
                window.open(url, "ppmessage" + "-" + userEmail);
            }
        };
        
        $scope.logout = function() {
            var _logout = yvAjax.logout("user");
            $timeout(function() {
                yvLogin.logout();
                isLogin = false;
                yvAppService.clear();
                $scope.menuStyle[ 'margin-top' ] = '24px';
                $scope.isAdminUser = false;
            });
            $timeout(function() {
                $state.go("app.signup-md", {sign_what: "signin"});
            });
        };

        $scope.toast_error_string = function(str) {
            var _local_str = $filter("translate")("global." + str);
            console.log(_local_str);
            $timeout( function() {
                toastr.error(_local_str);
            });
        };

        $scope.toast_success_string = function(str) {
            var _local_str = $filter("translate")("global." + str);
            console.log(_local_str);
            $timeout( function() {
                toastr.success(_local_str);
            });
        };

        $scope.$on("$destroy", function() {
            
        });

        var _init = function() {
            // Event: login successful
            $rootScope.$on( yvConstants.BROADCAST_EVENT_KEY.LOGIN_FINISHED , function( event, args ) {

                isLogin = true;
                $scope.isAdminUser = args.isAdmin;
                if ( $scope.isAdminUser === true ) {                    
                    $scope.menuStyle[ 'margin-top' ] = '12px';
                    refreshApps();
                }
            } );            
        };

        _init();

        // ===========
        function refreshApps() {
            fetchApps( function( apps ) {
                setupAppsDropDownButton( apps );
            } );            
        }
        
        function fetchApps( callback ) {
            yvAppService.getApps( callback );
        }
        
        function setupAppsDropDownButton( apps ) {
            $scope.apps = apps;
            angular.forEach( apps, function( app, index ) {
                if ( app.is_selected ) {
                    $scope.selectedApp = app;                    
                }
            } );
        }

        function selectApp( app ) {
            yvAppService.selectApp( app, function() {

                refreshApps();
                $scope.$broadcast( yvConstants.BROADCAST_EVENT_KEY.REFRESH_PAGE );
                
            }, function( error ) {
                
                yvDebug.d( 'select app error', error );
                
            } );
        }

        function appStyle( app ) {
            if ( app.is_selected ) {
                return {
                    'background-color': 'red'
                };
            }
            return { };
        }

    }); // end app ctrl

angular.module("this_app")
    .directive("focusMe", function() {
        return {
            restrict: "A",
            
            link: function($scope, $element, $attrs) {
                $element[0].focus();
            },
        };
    })
;

angular.module("this_app")
    .directive("uniform", function($timeout) {
        return {
            restrict: "A",
            require: 'ngModel',
            
            link: function($scope, $element, $attrs, ngModel) {
                $element.uniform({userID: false});
                $scope.$watch(function() {
                    return ngModel.$modelValue;
                }, function() {
                    $timeout(jQuery.uniform.update, 0);
                });
            },
        };
    })
;


angular.module("this_app")
    .directive("slimScroll", function() {
        "use strict";
        
        return {
            restrict: "A",
            
            link: function($scope, $element, $attrs) {
                var off = [];
                var option = {};

                var refresh = function() {
                    if ($attrs.slimScroll) {
                        option = $scope.$eval($attrs.slimScroll);
                    }

                    $($element).slimScroll({destroy: true});
                    $($element).slimScroll(option);
                };

                var destructor = function() {
                    angular.forEach(off, function(_unregister) {
                        _unregister();
                    });
                    off = [];
                };

                var init = function() {
                    refresh();
                    off.push($scope.$watchCollection($attrs.slimScroll, refresh));                             
                };

                off.push($scope.$on("$destroy", destructor));
                init();
                
            }, //end link
        };
    })
;

//
// @description
// < a ng-href="http://www.baidu.com" /> : => open `http://www.baidu.com` by replace current one
// < a ng-href="http://www.baidu.com" yv-href-blank /> : => open `http://www.baidu.com` in new window
//
( function() {

    angular.module( "this_app" ).directive( "yvHrefBlank" , href );

    function href() {
        
        return {
            
            restrict: 'A', // only matches attribute name
            
            link: function( scope, element, attrs ) {
                element.attr( "target", "_blank" );
            }
            
        };
        
    }
    
} )();

angular.element(document).ready(function() {     
    angular.bootstrap(document, ["this_app"]);
});
