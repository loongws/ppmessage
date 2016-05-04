# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

"""
BOOSTRAP_CONFIG is the first place for developer edit before run PPMessage.

required:
"team", to run PPMessage needing a team who is the first service team of the PPMessage
"user", to run PPMessage needing a user who create the first service team and admin the whole PPMessage system
"mysql", database config
"nginx", nginx config
"js",   client javascript minimization

optional:
"apns", apple push service
"gcm",  google clould message

"""

BOOTSTRAP_CONFIG = {
    # This team is the super admin's team
    "team": {
        "app_name": "your-team-name",            # your service team name
        "company_name": "your-company-name",     # your company name
    },
        
    # This user is the super user, who has two roles:
    # 1. the team admin of first service team
    # 2. the super admin of all service teams
    "user": {
        "user_language": "zh_cn", # zh_cn, en_us, zh_tw
        "user_firstname": "your-first-name",
        "user_lastname": "your-last-name",
        "user_fullname": "your-fullname",
        "user_email": "your-login-email",
        "user_password": "your-password",
    },

    "mysql": {
        "db_host": "127.0.0.1",
        "db_user": "root",
        "db_pass": "test",    # If you use docker to launch ppmessage, set db_pass to "test"
        "db_name": "ppmessage",
    },

    "server": {
        "name": "", # server's ip, like '192.168.0.110', PPKefu need this to know which server to connect
        "identicon_store": "/usr/local/opt/ppmessage/identicon",
        "generic_store": "/usr/local/opt/ppmessage/generic",
    },
        
    "js": {
        "min": "no", # `yes` or `no` for minimized the PPCOM/PPKEFU javascript file
    },
        
    # nginx conf 
    # In Ubuntu/Debian/Docker, "nginx_conf_path" is "/usr/local/nginx/conf/nginx.conf"
    # In Mac, "nginx_conf_path" is "/usr/local/etc/nginx/nginx.conf"
    "nginx": {
        "nginx_conf_path": "/path-to-your-nginx.conf",
        "server_name": ["ppmessage.com", "www.ppmessage.com"],
        "listen": "8080", #80

            "upload_store": "/usr/local/opt/ppmessage/uploads 1",
        "upload_state_store": "/usr/local/opt/ppmessage/upload_state",

            # on for https, off for http
            "ssl": "off", # off/on
        "ssl_listen": "443",
        "ssl_certificate": "/path-to-your-ssl-cert",
        "ssl_certificate_key": "/path-to-your-ssl-server-key",
    },

    # optional, apns push certificate, dev for developer, pro for production
    "apns": {
        "name": "your-app's-bundle-id",
        "dev": "/path-to-your-apns-development.p12",
        "pro": "/path-to-your-apns-production.p12",
    },

    # optional, google cloud message
    "gcm": {
        "api_key": "your gcm api key",
        "sender_id": "your gcm sender id",
    },
}
    
