# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved
#
# backend/ppkefuapp.py
#

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.singleton import singleton
from ppmessage.core.main import AbstractWebService

from ppmessage.core.downloadhandler import DownloadHandler
from ppmessage.core.materialfilehandler import MaterialFileHandler

from ppmessage.db.models import FileInfo
from ppmessage.bootstrap.data import BOOTSTRAP_DATA

import os
import stat
import uuid
import json
import redis
import base64
import hashlib
import logging
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        _index = os.path.join(os.path.dirname(__file__), "../resource/html/ppkefu-index.html")
        with open(_index) as _file:
            _str = _file.read()
            self.write(_str)
        return

class UploadHandler(tornado.web.RequestHandler):

    def post(self, id=None):

        _upload_type = self.get_argument("upload_type", default=None)
        if _upload_type is None:
            logging.error("No upload_type set.")
            return
        
        if _upload_type == "file":
            _list = self.request.files.get("file")
            if _list is None or len(_list) == 0:
                logging.error("No files with upload_file input name")
                return

            _file_name = _list[0]["filename"]
            _file_body = _list[0]["body"]
            _file_mime = _list[0]["content_type"]


        elif _upload_type == "content_txt":
            _file_body = self.get_argument("content_txt")
            if isinstance(_file_body, unicode):
                _file_body = _file_body.encode("utf-8")
            _file_mime = "text/plain"
            _file_name = "txt"

        elif _upload_type == "content_icon":
            _file_body = self.get_argument("content_icon")
            if isinstance(_file_body, unicode):
                _file_body = _file_body.encode("utf-8")
            _file_body = _file_body.split("data:image/png;base64,", 1)[1]
            _file_body = base64.decodestring(_file_body)
            _file_mime = "image/png"
            _file_name = "icon"

        elif _upload_type == "content_html":
            _file_body = self.get_argument("content_html")
            _file_mime = "text/html"
            _file_name = "html"

        else:
            logging.error("Error can not handle %s." % (_upload_type))
            return

        _file_sha1 = hashlib.sha1(_file_body).hexdigest()
        _new_name = str(uuid.uuid1())

        _generic_store = BOOTSTRAP_DATA.get("server")
        _generic_store = _generic_store.get("generic_store")
        
        _new_path = _generic_store + os.path.sep + _new_name
        with open(_new_path, "wb") as _new_file:
            _new_file.write(_file_body)

        _stat_result = os.stat(_new_path)
        _file_size = _stat_result[stat.ST_SIZE]

        # FIXME: md5 as key to determine, is there duplicated content
        _values = {
            "uuid": _new_name,
            "file_mime": _file_mime,
            "file_name": _file_name,
            "file_size": _file_size,
            "file_hash": _file_sha1,
            "file_path": _new_path
        }
        
        _row = FileInfo(**_values)
        _row.create_redis_keys(self.application.redis)
        _row.async_add(self.application.redis)
                
        _r = {}
        _r["fid"] = _new_name
        _r["mime"] = _file_mime
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps(_r))
        return

@singleton
class PPKefuDelegate():
    def __init__(self, app):
        return
    def run_periodic(self):
        return
    
class PPKefuWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.PPKEFU

    @classmethod
    def get_handlers(cls):

        _root = os.path.join(os.path.dirname(__file__), "../resource/assets/ppkefu/assets")
        _generic_store = BOOTSTRAP_DATA.get("server")
        _generic_store = _generic_store.get("generic_store")
        
        handlers = [
            (r"/", MainHandler),
            (r"/js/(.*)", tornado.web.StaticFileHandler, {"path": _root + "/js"}),
            (r"/css/(.*)", tornado.web.StaticFileHandler, {"path": _root + "/css"}),
            (r"/fonts/(.*)", tornado.web.StaticFileHandler, {"path": _root + "/fonts"}),
            (r"/img/(.*)", tornado.web.StaticFileHandler, {"path": _root + "/img"}),
            
            (r"/download/(.*)", DownloadHandler, {"path": "/"}),
            (r"/icon/([^\/]+)?$", tornado.web.StaticFileHandler, {"path": _generic_store + os.path.sep}),
            (r"/material/([^\/]+)?$", MaterialFileHandler, {"path": _generic_store + os.path.sep}),
            (r"/upload/(.*)", UploadHandler),
        ]
        return handlers

    @classmethod
    def get_delegate(cls, app):
        return PPKefuDelegate(app)

class PPKefuApp(tornado.web.Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        settings["cookie_secret"] = "PzEMu2OLSsKGTH2cnyizyK+ydP38CkX3rhbmGPqrfBs="
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        DownloadHandler.set_cls_redis(self.redis)
        tornado.web.Application.__init__(self, PPKefuWebService.get_handlers(), **settings)

