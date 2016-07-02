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

if __name__ == "__main__":
    print(random_identicon("dingguijin@gmail.com"))

