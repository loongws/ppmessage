# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights are reserved.
#
# ppcom/config/config.py
#

import os
import json
import scss
import logging
import hashlib

def _cur_dir():
    return os.path.dirname(__file__)

def _replace(_api_key, _api_secret, _ssl, _host, _port):
    TEMPLATE_MIN_JS = "../../resource/assets/ppcom/assets/pp-library-template.min.js"
    MIN_JS = "../../resource/assets/ppcom/assets/pp-library.min.js"
    
    _template_min_js = os.path.join(_cur_dir(), TEMPLATE_MIN_JS)
    _min_js = os.path.join(_cur_dir(), MIN_JS)

    if not os.path.exists(_template_min_js):
        logging.error("no such file: %s" % _template_min_js)
        return
    
    ws = "ws://"
    http = "http://"
    host = _host + ":" + _port

    auth = http + host + "/ppauth"
    api = http + host + "/api"
    ppcom_assets_path = http + host + "/ppcom/assets/"
    web_socket_url = ws + host + "/pcsocket/WS"
    file_upload_url = http + host + "/upload/upload/"
    file_upload_txt_url = http + host + "/ppkefu/upload_txt"
    file_download_url= http + host + "/download/download/"

    if _ssl == "on":
        http = "https://"
        ws = "wss://"

    with open(_template_min_js, "r") as _t:
        _str = _t.read()
        _str = _str\
               .replace('{portal}', 'https://ppmessage.com')\
               .replace('{auth}', auth)\
               .replace('{api}', api)\
               .replace('{web_socket_url}', web_socket_url)\
               .replace('{file_upload_url}', file_upload_url)\
               .replace('{file_download_url}', file_download_url)\
               .replace('{file_upload_txt_url}', file_upload_txt_url)\
               .replace('{ppcom_assets_path}', ppcom_assets_path)\
               .replace('{ppcom_api_key}', _api_key)\
               .replace('{ppcom_api_secret}', _api_secret)
        with open(_min_js, "w") as _o:
            _o.write(_str)
    
    return 

def config(_key, _secret, _ssl, _host, _port):
    _replace(_key, _secret, _ssl, _host, _port)
    return

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf-8')
    _key = "NGY3YjM2MGM1ZDExNTRlOGRiNDcxNjhjNjA2Y2ExMDE1YmNiOTVkNA=="
    _secret = "NGY3YjM2MGM1ZDExNTRlOGRiNDcxNjhjNjA2Y2ExMDE1YmNiOTVkNA=="
    _ssl = "off"
    _host = "ppmessage.com"
    _port = "80"
    config(_key, _secret, _ssl, _host, _port)
