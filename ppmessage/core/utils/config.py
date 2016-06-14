# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# core/utils/config.py
#

"""
{
"language": "zh_cn",
"server": {
"ssl": "on",
"port": 443,
"name": "ppmessage.com",
"identicon_store": "/usr/local/opt/ppmessage/identicon",
"generic_store": "/usr/local/opt/ppmessage/generic"
},
}
"""

import os
import json
import logging
import hashlib

def _get_config():
    _config_file = os.path.join(os.path.dirname(__file__), "../../bootstrap/config.json")

    if not os.path.exists(_config_file):
        logging.error("PPMesage system not configed")
        return None

    _f = open(_config_file, "r")
    _r = _f.read()
    _f.close()
    if _r == None or len(_r) == 0:
        logging.error("PPMessage system not configed")
        return None
    
    return json.loads(_r)

def get_config_language():
    _config = _get_config()
    if _config == None:
        return None
    return _config.get("language")

def get_config_server_ssl():
    _config = _get_config()
    if _config == None:
        return None
    return _config.get("server").get("ssl")

def get_config_server_name():
    _config = _get_config()
    if _config == None:
        return None
    return _config().get("server").get("name")

def get_config_server_port():
    _config = _get_config()
    if _config == None:
        return None
    return _config.get("server").get("port")

def get_config_server_identicon_store():
    _config = _get_config()
    if _config == None:
        return None
    return _config.get("server").get("identicon_store")

def get_config_server_generic_store():
    _config = _get_config()
    if _config == None:
        return None
    return _config.get("server").get("generic_store")

