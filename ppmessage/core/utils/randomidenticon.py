# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# core/utils/randomidenticon.py
#

import os
import json
import logging

IDENTICON_PPMESSAGE_STORE = True

_global_random_identicon_list = None

def _ppmessage_identicon_prefix(_string):
    from .config import get_config_server_url
    _url = get_config_server_url()
    if _url == None:
        logging.error("error for no server url configed.")
        return None
    return _url + "/identicon/identicon/" + _string 

def _qiniu_identicon_prefix(_string):
    _qiniu_random_identicon_prefix = "http://qiniu.ppmessage.cn/avatar/png/"
    return _qiniu_random_identicon_prefix + _string
    
def _prefix(_string):
    if IDENTICON_LOCAL_STORE:
        return _ppmessage_identicon_prefix(_string)
    return _qiniu_identicon_prefix(_string)

def _load_qiniu_list():
    global _global_random_identicon_list
    if _global_random_identicon_list == None:
        _path = os.path.join(os.path.dirname(__file__), "../../resource/json/random_identicon.json")
        with open(_path, "r") as _file:
            _global_random_identicon_list = map(_qiniu_identicon_prefix, json.loads(_file.read()))
    return _global_random_identicon_list

def _local_path(_file):
    from .config import get_config_server_identicon_store
    _path = get_config_server_identicon_store()
    return _path + os.path.sep + _file

def _qiniu_random_identicon(_string):
    _list = _load_qiniu_list()
    if _list == None or len(_list) == 0:
        logging.error("no random identicon in list")
        return None
    
    _count = 0
    for _i in _string:
        _count = _count + ord(_i)
    _len = len(_list)
    _mod = _count % _len
    return _list[_mod]

def _ppmessage_random_identicon(_string):
    _count = 0
    for _i in _string:
        _count = _count + ord(_i)
    _mod = str(_count % 256)

    from ppmessage.core.utils.createicon import create_user_icon
    _url = create_user_icon(_mod)
    return _url

def random_identicon(_string):
    if IDENTICON_PPMESSAGE_STORE:
        return _ppmessage_random_identicon(_string)
    return _qiniu_random_identicon(_string)

def download_random_identicon(_url):
    if not _url.startswith("http"):
        return

    import urllib
    _abs = _url[_url.rindex("/")+1:]
    _abs = _local_path(_abs)
    urllib.urlretrieve(_url, _abs)
    return

def upload_random_identicon(_abs):
    if IDENTICON_PPMESSAGE_STORE:
        return
    
    _file_name = _abs[_abs.rfind("/") + 1:]
    _key = "avatar/png/" + _file_name
    from qiniu import Auth, put_file
    access_key = 'ouzYOXBAT2CqPyJldvR1HlGUbWH9SpWpKy1_fdRy'
    secret_key = 'Sw4DYzRUNmfUSObActUJUCJ1RVxsSqEpeZR6x2fS'
    q = Auth(access_key, secret_key)
    token = q.upload_token('ppmessage', _key)
    ret, info = put_file(token, _key, _abs)
    return

def get_random_identicon_url(_file):
    file = _file[_file.rfind["/"] + 1:]
    return _prefix(_file)

if __name__ == "__main__":
    print(random_identicon("dingguijin@gmail.com"))

