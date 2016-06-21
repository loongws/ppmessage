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
    
    JS_BUILD_PATH = "../../resource/assets/ppkefu/assets/js"
    PPKEFU_TEMPLATE_MIN_JS = "ppkefu-template.min.js"
    
    _ppkefu_js_dir = os.path.join(_cur_dir(), JS_BUILD_PATH)
    _ppkefu_js_path = os.path.join(_ppkefu_js_dir, PPKEFU_TEMPLATE_MIN_JS)

    if not os.path.exists(_ppkefu_js_path):
        logging.error("no such file: %s" % _ppkefu_js_path)
        return

    with open(_ppkefu_js_path, "r") as _f:
        _ppkefu_js_str = _f.read()
        _ppkefu_js_str = _ppkefu_js_str.replace("{{app_key}}", _key)
        _out_file_name = "ppkefu.min.%s.js" % hashlib.sha1(_ppkefu_js_str).hexdigest()[:8]
        _out_file = os.path.join(_ppkefu_js_dir, _out_file_name)
        with open(_out_file, "w") as _of:
            _of.write(_ppkefu_js_str)

    return _out_file_name

def _replace_html_file(_js_name):
    HTML_TEMPLATE_PATH = "../../resource/html/ppkefu-index.html.template"
    HTML_PATH = "../../resource/html/ppkefu-index.html"
    _template_path = os.path.join(_cur_dir(), HTML_TEMPLATE_PATH)
    _html_path = os.path.join(_cur_dir(), HTML_PATH)
    
    with open(_template_pat) as _t:
        _t_str = _t.read(_template_path, "r")
        _n_str = _t_str.replace("{{ppkefu.min.js}}", _js_name)
        with opne(_html_path, "w") as _html:
            _html.write(_n_str)

    return

def config(_d):
    _replace(_d)
    return

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf-8')
    _d = { "key":"NGY3YjM2MGM1ZDExNTRlOGRiNDcxNjhjNjA2Y2ExMDE1YmNiOTVkNA=="}
    config(_d)
