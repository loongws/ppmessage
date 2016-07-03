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

_qiniu_random_identicon_prefix = "http://qiniu.ppmessage.cn/avatar/png/"
_global_random_identicon_list = None

def _prefix(_string):
    global _qiniu_random_identicon_prefix
    return _qiniu_random_identicon_prefix + _string

def _load_list():
    global _global_random_identicon_list
    if _global_random_identicon_list == None:
        _path = os.path.join(os.path.dirname(__file__), "../../resource/json/random_identicon.json")
        with open(_path, "r") as _file:
            _global_random_identicon_list = map(_prefix, json.loads(_file.read()))
    return _global_random_identicon_list

def _local_path(_file):
    _path = os.path.join(os.path.dirname(__file__), "../../resource/identicon/random")
    _path = os.path.abspath(_path)
    return _path + os.path.sep + _file

def random_identicon(_string):
    _list = _load_list()
    if _list == None or len(_list) == 0:
        logging.error("no random identicon in list")
        return None
    
    _count = 0
    for _i in _string:
        _count = _count + ord(_i)
    _len = len(_list)
    _mod = _count % _len
    return _list[_mod]

def random_identicon_parse_file(_string):
    global _qiniu_random_identicon_prefix
    if _string.startswith(_qiniu_random_identicon_prefix):
        _ri_file = _string[_string.rfind("/")+1:]
        return _local_path(_ri_file)
    return None

def download_random_identicon(_url):
    if not _url.startswith("http"):
        return

    import urllib
    _abs = _url[_url.rindex("/")+1:]
    _abs = _local_path(_abs)
    urllib.urlretrieve(_url, _abs)
    return

def upload_random_identicon(_abs):
    _file_name = _abs[_abs.rfind("/") + 1:]
    _key = "avatar/png/" + _file_name
    from qiniu import Auth, put_file
    access_key = 'ouzYOXBAT2CqPyJldvR1HlGUbWH9SpWpKy1_fdRy'
    secret_key = 'Sw4DYzRUNmfUSObActUJUCJ1RVxsSqEpeZR6x2fS'
    q = Auth(access_key, secret_key)
    token = q.upload_token('ppmessage', _key)
    ret, info = put_file(token, _key, _abs)

    _dst = _local_path(_file_name)
    import shutil
    shutil.copyfile(_abs, _dst)
    return

def get_random_identicon_url(_file):
    global _qiniu_random_identicon_prefix
    return _qiniu_random_identicon_prefix + _file

if __name__ == "__main__":
    print(random_identicon("dingguijin@gmail.com"))

