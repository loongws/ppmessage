# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights are reserved.
#
# ppkefu/min/config.py
#

import os
import json
import logging
import hashlib

def _cur_dir():
    return os.path.dirname(__file__)

def _replace(_d):
    _key = _d.get("key")
    
    TEMPLATE_MIN_JS = "../../resource/assets/ppkefu/assets/js/ppkefu-template.min.js"
    MIN_JS = "../../resource/assets/ppkefu/assets/js/ppkefu.min.js"

    _template = os.path.join(_cur_dir(), TEMPLATE_MIN_JS)
    _min = os.path.join(_cur_dir(), MIN_JS)
    
    if not os.path.exists(_template):
        logging.error("no such file: %s" % _template)
        return

    with open(_template, "r") as _f:
        _ppkefu_js_str = _f.read()
        _ppkefu_js_str = _ppkefu_js_str.replace("{{api_key}}", _key)
        with open(_min, "w") as _of:
            _of.write(_ppkefu_js_str)
    return

def config(_d):
    _replace(_d)
    return

if __name__ == "__main__":
    import sys

    reload(sys)
    sys.setdefaultencoding('utf-8')

    from ppmessage.core.constant import API_LEVEL
    from ppmessage.core.constant import CONFIG_STATUS
    from ppmessage.core.utils.config import _get_config
    if _get_config() == None or _get_config().get("config_status") != CONFIG_STATUS.RESTART:
        print("PPMessage not configed.")
        sys.exit()
        
    _d = {
        "key": _get_config().get("api").get(API_LEVEL.PPKEFU.lower()).get("key")
    }
    config(_d)
