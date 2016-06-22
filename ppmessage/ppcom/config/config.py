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
import logging
import hashlib

def _cur_dir():
    return os.path.dirname(__file__)

def _replace(_d):

    logging.info(_d)
    _api_key = _d.get("key")
    _api_secret = _d.get("secret")
    _ssl = _d.get("ssl")
    _host = _d.get("server_name")
    _port = str(_d.get("server_port"))
    
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

    import sys
    reload(sys)
    sys.setdefaultencoding('utf-8')

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

def config(_dict):
    _replace(_dict)
    return

def _main():
    # _d = {
    #     "key": "NGY3YjM2MGM1ZDExNTRlOGRiNDcxNjhjNjA2Y2ExMDE1YmNiOTVkNA==",
    #     "secret": "NGY3YjM2MGM1ZDExNTRlOGRiNDcxNjhjNjA2Y2ExMDE1YmNiOTVkNA==",
    #     "ssl": "off",
    #     "server_name":  "ppmessage.com",
    #     "server_port": "80"
    # }
    from ppmessage.core.constant import API_LEVEL
    from ppmessage.core.utils.config import _get_config
    if _get_config() == None or _get_config().get("api") == None:
        print("PPMessage not configed.")
        return
    
    _api = _get_config().get("api")
    _d = {
        "key": _api.get(API_LEVEL.PPCOM.lower()).get("key"),
        "secret": _api.get(API_LEVEL.PPCOM.lower()).get("secret"),
        "ssl": "off",
        "server_name": _get_config().get("server").get("name"),
        "server_port": _get_config().get("server").get("port")
    }
    config(_d)

    return

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf-8')
    _main()
