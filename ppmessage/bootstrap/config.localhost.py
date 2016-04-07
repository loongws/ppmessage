# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

"""
BOOSTRAP_CONFIG is the first place for developer edit before run PPMessage.

"team", to run PPMessage needing a team who is the first service team of the PPMessage
"user", to run PPMessage needing a user who create the first service team and admin the whole PPMessage system
"mysql", database config
"redis", redis config
"nginx", nginx config

"""

BOOTSTRAP_CONFIG = {
    "team": {
        "app_name": "ppmessage",
        "company_name": "YOURUI",
    },

    "user": {
        "user_language": "zh_cn", # zh_cn, en_us, zh_tw
        "user_firstname": "Guijin",
        "user_lastname": "Ding",
        "user_fullname": "Guijin Ding",
        # email is user account
        "user_email": "dingguijin@gmail.com",
        "user_password": "123",
    },

    "mysql": {
        "db_host": "127.0.0.1",
        "db_user": "root",
        "db_pass": "test",
        "db_name": "ppmessage",
    },

    "server": {
        "name": "", # 
        "identicon_store": "/usr/local/opt/ppmessage/identicon",
        "generic_store": "/usr/local/opt/ppmessage/generic",
    },

    "js": {
        "min": "no", # `yes` or `no` for minimized the PPCOM/PPKEFU javascript file
    },
    
    # nginx conf 
    "nginx": {
        "nginx_conf_path": "/usr/local/etc/nginx/nginx.conf",
        "server_name": ["ppmessage.com", "www.ppmessage.com"],
        "listen": "8080", #80

        "upload_store": "/usr/local/opt/ppmessage/uploads 1",
        "upload_state_store": "/usr/local/opt/ppmessage/upload_state",

        "ssl": "off", # off/on
        "ssl_listen": "443",
        "ssl_certificate": "/Users/dingguijin/ppmessage/ppmessage/certs/ppmessage.cn.instant/issue/ssl_bundle.crt",
        "ssl_certificate_key": "/Users/dingguijin/ppmessage/ppmessage/certs/ppmessage.cn.instant/server.key",
    },

    # apns push certificate, dev for developer, pro for production
    "apns": {
        "name": "com.ppmessage.ppkefu",
        "dev": "/Users/dingguijin/ppmessage/ppmessage/certs/apnscerts/ppkefu-dev.p12",
        "pro": "/Users/dingguijin/ppmessage/ppmessage/certs/apnscerts/ppkefu-pro.p12",
    },

    # google cloud message
    "gcm": {
        "api_key": "AIzaSyBzRHQH-u6-wcT6jUc8DgTITMUB4vdqYiU",
        "sender_id": "878558045932",
    },

}
