# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/tornadouploadapp.py
#

from ppmessage.core.singleton import singleton
from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PP_WEB_SERVICE
from ppmessage.core.constant import UPLOAD_MAX_BYTE
from ppmessage.core.main import AbstractWebService
from ppmessage.core.utils.config import get_config_server_generic_store

from ppmessage.db.models import FileInfo

import os
import uuid
import json
import redis
import logging
import hashlib

from tornado.web import Application
from tornado.web import RequestHandler
from tornado.web import asynchronous

class UploadFileHandler(RequestHandler):
    """
    FIXME: with api_token check
    """
    
    @property
    def content_length(self):
        return int(self.request.headers['Content-Length'])

    @asynchronous
    def post(self, id=None):
        
        _redis = self.application.redis        
        logging.info(self.request.body)

        if self.content_length > UPLOAD_MAX_BYTE:
            logging.error("upload file over limit: %d > %d" % self.content_length, UPLOAD_MAX_BYTE)
            self.send_error()
            return
        
        _generic_store = get_config_server_generic_store()
        if _generic_store == None:
            logging.error("Generic store not configed")
            self.send_error()
            return

        _info = self.request.files['file'][0]
        if _info == None:
            logging.error("No file info in request.files: %s", self.request.files)
            self.send_error()
            return

        _uuid = str(uuid.uuid1())
        
        _file_name = _info.get("filename") or _uuid
        _file_type = _info.get("content_type") or "application/octet-stream"
        _file_body = _info.get("body") or ""
        _file_size = len(_file_body)
        _file_sha1 = hashlib.sha1(_file_body).hexdigest()
        
        _material_type = self.get_argument("material_type", default=None)
        _user_uuid = self.get_argument("user_uuid", default=None)

        if _file_size == 0:
            logging.error("file size 0: %s" % _file_name)
            self.send_error()
            return
        
        _key = FileInfo.__tablename__ + ".file_hash." + _file_sha1
        _existed_uuid = _redis.get(_key)
        if _existed_uuid != None:
            logging.info("same file: %s, %s" % (_existed_uuid, _file_name)) 
            self.write(json.dumps({"fuuid": _existed_uuid}))
            self.finish()
            return 

        _new_path = _generic_store + os.path.sep + _uuid

        with open(_new_path, "w") as _of:
            _of.write(_file_body)
            
        _add = {
            "uuid": _uuid,
            "file_name": _file_name,
            "file_size": _file_size,
            "file_hash": _file_sha1,
            "file_path": _new_path,
            "file_mime": _file_type,
            "material_type": _material_type,
            "user_uuid": _user_uuid,
        }

        _row = FileInfo(**_add)
        _row.create_redis_keys(_redis)
        _row.async_add(_redis)

        #self.set_header("Content-Type", "text/plain")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.write(json.dumps({"fuuid": _uuid}))
        logging.info(str({"fuuid": _uuid}))
        self.finish()
        return

@singleton
class UploadDelegate():
    def __init__(self, app):
        return
    def run_periodic(self):
        return

class UploadWebService(AbstractWebService):

    @classmethod
    def name(cls):
        # the same with nginx upload
        return PP_WEB_SERVICE.UPLOAD

    @classmethod
    def get_handlers(cls):
        return [(r"/upload/(.*)", UploadFileHandler)]

    @classmethod
    def get_delegate(cls, app):
        return UploadDelegate(app)
    
@singleton
class TornadoUploadApplication(Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        handlers = []
        handlers.extend(UploadWebService.get_handlers())
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        Application.__init__(self, handlers, **settings)
    
    def get_delegate(self, name):
        return UploadDelegate(self)
    
