# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2015 YVertical.
# Ding Guijin, guijin.ding@yvertical.com
#

config = {
    "host": "127.0.0.1",
    "port": 8945
}

def get_token_url():
    return "http://" + config["host"] + ":" + str(config["port"]) + "/ppauth/token"

def get_api_url():
    return "http://" + config["host"] + ":" + str(config["port"]) + "/api"


