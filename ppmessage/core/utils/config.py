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
"configed": false,
"language": "zh_cn",
"server": {
"ssl": "on",
"port": 443,
"name": "ppmessage.com",
"identicon_store": "/usr/local/opt/ppmessage/identicon",
"generic_store": "/usr/local/opt/ppmessage/generic"
},
"db": {
"type": "sqlite",
"mysql":{},
"sqlite": {},
"psql": {},
}
}
"""

import os
import json
import logging
import hashlib

_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "../../bootstrap/config.json")

def _get_config():
    _config_file = _CONFIG_PATH

    if not os.path.exists(_config_file):
        return None

    _f = open(_config_file, "r")
    _r = _f.read()
    _f.close()
    if _r == None or len(_r) == 0:
        return None
        
    return json.loads(_r)

def _dump_config(_config):
    _config_file = _CONFIG_PATH
    _f = open(_config_file, "w")
    _r = _f.write(json.dumps(_config))
    _f.close()
    return

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

def get_config_db():
    _config = _get_config()
    if _config == None:
        return None
    try:
        return _config.get("db")
    except:
        return None
    return None

def get_config_db_psql():
    _config = _get_config()
    if _config == None:
        return None
    try:
        return _config.get("db").get("psql")
    except:
        return None
    return None

def get_config_db_mysql():
    _config = _get_config()
    if _config == None:
        return None
    try:
        return _config.get("db").get("mysql")
    except:
        return None
    return None

def get_config_gcm():
    _config = _get_config()
    if _config == None:
        return None
    try:
        return _config.get("gcm")
    except:
        return None
    return None

def get_config_email():
    _config = _get_config()
    if _config == None:
        return None
    try:
        return _config.get("email")
    except:
        return None
    return None

