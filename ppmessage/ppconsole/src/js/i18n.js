/*
 *  guijin.ding@yvertical.com
 *  Copyright (c) 2010-2015 
 */

angular.module("this_app.i18n", ["pascalprecht.translate"])
    .constant("yvTransTags", {
        en: {

            COPYRIGHT_PPMESSAGE: "PPMESSAGE.",

            action: {
                ADD_TAG: "Add",

                CANCEL_TAG: "Cancel",
                CONFIRM_TAG: "Confirm",

                CREATE_TAG: "Create",

                DELETE_TAG: "Delete",
                                
                PREVIEW_TAG: "Preview",
                
                SAVE_TAG: "Save",

                SEARCH_TAG: "Search",
                SELECT_ALL_TAG: "Select all",

                SUBMIT_TAG: "Submit",

            },

            field: {
                CURRENT_PASSWORD_TAG: "Current password",

                MEMBERS_TAG: "members",
                
                NEW_PASSWORD_TAG: "New password",

                OWNER_TAG: "Owner",
                
                REPEAT_NEW_PASSWORD_TAG: "Repeat new password",

                SERVICE_GROUP_NAME_TAG: "Group name",
                SERVICE_GROUP_DESC_TAG: "Group description",

                SERVICE_USER_TAG: "Service user",
                
                TEAM_NAME_TAG: "Team name",
                
                USER_FULLNAME_TAG: "User fullname",
                USER_EMAIL_TAG: "User email",
                USER_PASSWORD_TAG: "User password",

            },
            
            error: {
                ADD_FAILED_TAG: "Add failed.",

                ALREADY_IS_SERVICE_USER_TAG: "Already is a service user",

                CREATE_FAILED_TAG: "Create failed.",

                DELETE_FAILED_TAG: "Failed to delete",

                ILLEGAL_CHARACTER_FOUND_TAG: "Illegal character found.",
                
                EMAIL_TAKEN_TAG: "This email already has been taken.",
                
                NEWPASSWORD_MISMATCH_TAG: "New password and repeat not equal.",
                NOTHING_CHANGED_TAG: "Nothing changed.",

                OLDPASSWORD_MISMATCH_TAG: "Old password mismatch.",
                OUT_OF_LENGTH_TAG: "Out of length.",

                PARAMS_MISS_TAG: "Parameters missed.",
                PASSWORD_NOT_MATCHED_TAG: "Password not matched",

                REMOVE_FAILED_TAG: "Remove failed.",
                
                SIGNIN_FAILED_TAG: "Sign in failed.",
                UPDATE_FAILED_TAG: "Failed to update.",

            },

            success: {
                ADD_SUCCESSFULLY_TAG: "Add successfully.",

                CHANGE_PASSWORD_SUCCESS_TAG: "Change password successfully.",

                CHANGE_PASSWORD_FAIL_TAG: "Change password failed.",

                CREATE_SUCCESSFULLY_TAG: "Create successfully.",

                DELETE_SUCCESSFULLY_TAG: "Delete successfully.",

                REMOVE_SUCCESSFULLY_TAG: "Remove successfully.",

                UPDATE_SUCCESSFULLY_TAG: "Update successfully.",
         
            },

            global: {
                ADD_GROUP_USER_TAG: "Add user to this group",
                
                CHANGE_PASSWORD_TAG: "Change Password",
                
                COLOR_PICKED_NOT_RIGHT_TAG: "color picked is unregualr value",           

                COLOR_TAG: "Color",

                COPY_CODE_TO_BODY_TAG: "Copy the code below, and paste it into html body.",
                
                CREATE_TEAM_TAG: "Create Team",

                CREATE_SERVICE_GROUP_TAG: "Create Service Group",
                
                CREATE_SERVICE_USER_TAG: "Create Service User",
                
                DELETE_SERVICE_GROUP_TAG: "Delete Service Group",

                DELETE_SERVICE_GROUP_INFO_TAG: "Confirm delete the following groups:",

                DEMO_DEPLOY_TO_TAG: "PPMessage has been deployed to this link for preview and test.",

                EDIT_SERVICE_GROUP_TAG: "Edit Service Group",
                
                PRIVATE_SETTINGS_TAG: "Private settings",
                
                RESET_PASSWORD_TAG: "Reset Password",

                SERVICE_TEAM_TAG: "Service Team",
                
                SIGNUP_TAG: "Sign up",
                SIGNIN_TAG: "Sign in",
                SIGNOUT_TAG: "Sign out",

                SLOGAN_TAG: "Open Source Plug & Play Enterprise Message Communication Platform",
                
                START_SERVICE_TAG: "Start service",

                TEAM_CONFIG_TAG: "Team settings",

                TEST_URL_TAG: "Test URL",
                
                USER_ACCOUNT_TAG: "User Account",

                WELCOME_TAG: "Welcome",
                
            },
            
            calendar:{
                TODAY_TAG: "Today",
                YESTERDAY_TAG: "Yesterday",
                LAST_7_DAYS_TAG:"Last 7 Days",
                LAST_30_DAYS_TAG:"Last 30 Days",
                THIS_MONTH_TAG:"This Month",
                LAST_MONTH_TAG:"Last Month",
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
            },//calendar end


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
                    SERVICE_GROUP_TAG: "Service groups",
                    APP_INTEGRATE_TAG: "App integrate",
                    ACCOUT_CONFIG_TAG: "Account settings",
                    ADVANCED_CONFIG_TAG: "Advanced settings",
                    PUSH_CONFIG_TAG: "Push settings",
                },                
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
                
            }

        },

        cn: {
            COPYRIGHT_PPMESSAGE: "皮皮消息.",

            action: {
                ADD_TAG: "添加",
                
                CANCEL_TAG: "取消",
                CONFIRM_TAG: "确认",
                CREATE_TAG: "创建",

                DELETE_TAG: "删除",

                PREVIEW_TAG: "预览",
                
                SAVE_TAG: "保存",
                SEARCH_TAG: "搜索",
                SELECT_ALL_TAG: "全选",

                SUBMIT_TAG: "提交"
            },

            field: {
                CURRENT_PASSWORD_TAG: "当前密码",
                NEW_PASSWORD_TAG: "新密码",

                OWNER_TAG: "拥有者",

                SERVICE_GROUP_NAME_TAG: "组名字",
                SERVICE_GROUP_DESC_TAG: "组描述",

                SERVICE_USER_TAG: "客服人员",
                
                TEAM_NAME_TAG: "团队名称",
                
                USER_FULLNAME_TAG: "用户姓名",
                USER_EMAIL_TAG: "用户邮箱",
                USER_PASSWORD_TAG: "用户密码",

                MEMBERS_TAG: "成员"
            },
            
            error: {
                ADD_FAILED_TAG: "添加成功",

                EMAIL_TAKEN_TAG: "这个 Email 地址已经被别人使用了",

                ILLEGAL_CHARACTER_FOUND_TAG: "发现了非法字符",
                NEWPASSWORD_MISMATCH_TAG: "新密码和重复新密码不一致",
                NOTHING_CHANGED_TAG: "什么都没有改变",

                OLDPASSWORD_MISMATCH_TAG: "旧密码错误",
                OUT_OF_LENGTH_TAG: "超出长度限制",

                PARAMS_MISS_TAG: "缺参数",
                PASSWORD_NOT_MATCHED_TAG: "密码不匹配",
                
                SIGNIN_FAILED_TAG: "登入失败",
                
                UPDATE_FAILED_TAG: "更新失败",

                CREATE_FAILED_TAG: "创建失败",
            },

            success: {

                ADD_SUCCESSFULLY_TAG: "添加成功",
                
                CHANGE_PASSWORD_SUCCESS_TAG: "改密码成功",
                CHANGE_PASSWORD_FAIL_TAG: "改密码失败",

                REMOVE_SUCCESSFULLY_TAG: "删除成功",
                UPDATE_SUCCESSFULLY_TAG: "更新成功",

                CREATE_SUCCESSFULLY_TAG: "创建成功",

            },

            global: {
                ADD_GROUP_USER_TAG: "添加用户到此组",

                CHANGE_PASSWORD_TAG: "更改密码",
                
                COLOR_PICKED_NOT_RIGHT_TAG: "选取颜色异常",           
                COLOR_TAG: "颜色",

                COPY_CODE_TO_BODY: "复制下面的代码并置于您自己网站的 HTML 文件之中，确保在 <body> ... </body> 元素之间",
                
                CREATE_TEAM_TAG: "创建客服团队",

                CREATE_SERVICE_GROUP_TAG: "创建客服分组",

                DELETE_SERVICE_GROUP_TAG: "删除客服分组",

                DELETE_SERVICE_GROUP_INFO_TAG: "确认删除以下客服分组：",
                
                DEMO_DEPLOY_TO: "在这个网页可以查看部署效果",

                EDIT_SERVICE_GROUP_TAG: "编辑客服分组",
                
                PRIVATE_SETTINGS_TAG: "个人设置",
                
                RESET_PASSWORD_TAG: "重设密码",

                SERVICE_TEAM_TAG: "客服团队",
                
                SIGNUP_TAG: "注册",
                SIGNIN_TAG: "登入",
                SIGNOUT_TAG: "登出",

                SLOGAN_TAG: "Open Source Plug & Play Enterprise Message Communication Platform",
                
                START_SERVICE_TAG: "开始服务",

                TEAM_CONFIG_TAG: "团队设置",

                USER_ACCOUNT_TAG: "用户账户",

                WELCOME_INFO_TAG: "欢迎信息",
                
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
                    APP_INTEGRATE_TAG: "应用集成",
                    ACCOUT_CONFIG_TAG: "账户设置",
                    ADVANCED_CONFIG_TAG: "高级设置",
                    PUSH_CONFIG_TAG: "推送设置",
                },                                
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

                    MESSAGE_LIST_TAG: "消息列表",
                    EMPTY_LIST_TAG: "没有任何匹配的会话",
                    MESSAGES: "条消息",
                    MESSAGES_PREVIEW: "消息预览",
                    
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
        });

        $translateProvider.fallbackLanguage("en", "zh-CN");

    });
