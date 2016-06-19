# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/ppconfigapp.py
#

from ppmessage.core.constant import SQL
from ppmessage.core.constant import PP_WEB_SERVICE
from ppmessage.core.main import AbstractWebService
from ppmessage.core.singleton import singleton
from ppmessage.core.utils.config import _get_config

from ppmessage.db.create import create_sqlite_tables

import os
import logging

import tornado.web

class PPConfigHandler(tornado.web.RequestHandler):
    def get(self, id=None):
        _dir = os.path.dirname(os.path.abspath(__file__))
        _html_path = _dir + "/../resource/html/ppconfig-index.html" 
        _html_file = open(_html_path, "rb")
        _html = _html_file.read()
        _html_file.close()
        self.write(_html)
        self.flush()

class ConfigStatusHandler(tornado.web.RequestHandler):
    def post(self, id=None):
        _status = {"status": "NONE"}
        if _get_config() == None:
            pass  
        elif _get_config().get("db") and _get_config().get("team") and _get_config().get("apns") and _get_config.get("gcm"):
            _status["status"] = "ANDROID"
        elif _get_config().get("db") and _get_config().get("team") and _get_config().get("apns"):
            _status["status"] = "IOS"
        elif _get_config().get("db") and _get_config().get("team"):
            _status["status"] = "FIRST"
        elif _get_config().get("db"):
            _status["status"] = "DATABASE"
        else:
            _status["status"] = "NONE"
        self.write(_status)
        self.flush()
        return

class DatabaseHandler(tornado.web.RequestHandler):
    def _return(self, _code):
        if _code >= 0:
            self.write({"error_code": _code})
            self.flush()
        else:
            self.send_error(520-_code)
        return

    def _sqlite(self):
        _db_file_path = _request.get("db_file_path")
        if _db_file_path == None or len(_db_file_path) == 0:
            logging.error("db_file_path is required for sqlite")
            return self._return(-1)
        try:
            open(_db_file_path, "w").close()
        except:
            logging.error("sqlite db_file_path can not create")
            return self._return(-1)
        
        _config = {
            "type": SQL.SQLITE.lower(),
            "sqlite": {
                "db_file_path": _db_file_path
            }
        }

        if create_database_tables(_config.get(SQL.SQLITE.lower())):
            self._dump_db_config(_config)
            return self._return(0)
        return self._return(-1)

    def _mysql(self):
        _db_name = _request.get("db_name")
        _db_host = _request.get("db_host")
        _db_port = _request.get("db_port")
        _db_user = _request.get("db_user")
        _db_pass = _request.get("db_pass")

        if _db_name == None or _db_host == None or _db_port == None\
           or _db_user == None or _db_pass == None:
            logging.error("mysql required db paramters not provided.")
            self._return(-1)

        _config = {
            "type": SQL.MYSQL.lower(),
            "mysql": {
                "db_name": _db_name,
                "db_host": _db_host,
                "db_port": _db_port,
                "db_user": _db_user,
                "db_pass": _db_pass
            }
        }
        if create_mysql_db(_config.get(SQL.MYSQL.lower())):
            if create_mysql_tables(_config.get(SQL.MYSQL.lower())):
                self._dump_db_config(_config)
                return self._return(0)
        
        return self.return(-1)

    def _pgsql(self):
        
        _db_name = _request.get("db_name")
        _db_host = _request.get("db_host")
        _db_port = _request.get("db_port")
        _db_user = _request.get("db_user")
        _db_pass = _request.get("db_pass")

        if _db_name == None or _db_host == None or _db_port == None\
           or _db_user == None or _db_pass == None:
            logging.error("mysql required db paramters not provided.")
            self._return(-1)

        _config = {
            "type": SQL.PGSQL.lower(),
            "mysql": {
                "db_name": _db_name,
                "db_host": _db_host,
                "db_port": _db_port,
                "db_user": _db_user,
                "db_pass": _db_pass
            }
        }
        if create_mysql_db(_config.get(SQL.PGSQL.lower())):
            if create_mysql_tables(_config.get(SQL.PGSQL.lower())):
                self._dump_db_config(_config)
                return self._return(0)
        
        return self.return(-1)
    
    def post(self, id=None):        
        _request = json.loads(self.request.body)
        _type = _request.get("type")

        _config = _get_config()
        if _config != None:
            logging.error("config already existed.")
            self.write(json.dumps(_return_error))
            return
        
        if _type == None or len(_type) == 0:
            logging.error("type is required.")
            self.write(json.dumps(_return_error))
            return

        _type = _type.upper()
        if _type == SQL.SQLITE:
            return self._sqlite(_request)
        if _type == SQL.MYSQL:
            return self._mysql(_request)
        if _type == SQL.PGSQL:
            return self._pgsql(_request)

        self._return(-1)
        return

class FirstHandler(tornado.web.RequestHandler):
    def post(self, id=None):
        logging.info("firsthandler")
        return

class IOSHandler(tornado.web.RequestHandler):
    def post(self, id=None):
        logging.info("ioshandler")
        return

class AndroidHandler(tornado.web.RequestHandler):
    def post(self, id=None):
        logging.info("Androidhandler")
        return

@singleton
class PPConfigDelegate():
    def __init__(self, app):
        return
    def run_periodic(self):
        return
        
class PPConfigWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.PPCONFIG

    @classmethod
    def get_handlers(cls):
        _a_settings = {
            "path": os.path.join(os.path.dirname(__file__), "../resource/assets/ppconfig/static"),
        }
        
        handlers=[
            (r"/", PPConfigHandler),
            (r"/status", ConfigStatusHandler),
            (r"/database", DatabaseHandler),
            (r"/first", FirstHandler),
            (r"/ios", IOSHandler),
            (r"/android", AndroidHandler),
            (r"/static/(.*)", tornado.web.StaticFileHandler, _a_settings),
        ]

        return handlers

    @classmethod
    def get_delegate(cls, app):
        return PPConfigDelegate(app)

class PPConfigApp(tornado.web.Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        settings["cookie_secret"] = "24oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
        tornado.web.Application.__init__(self, PPConfigWebService.get_handlers(), **settings)

    def get_delegate(self, name):
        return PPConfigDelegate(self)

    
