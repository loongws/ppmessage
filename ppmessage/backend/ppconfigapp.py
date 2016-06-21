# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/ppconfigapp.py
#

from ppmessage.core.constant import SQL
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import CONFIG_STATUS
from ppmessage.core.constant import PP_WEB_SERVICE
from ppmessage.core.main import AbstractWebService
from ppmessage.core.singleton import singleton

from ppmessage.core.utils.config import _get_config
from ppmessage.core.utils.config import _dump_config

from ppmessage.db.create import create_pgsql_db
from ppmessage.db.create import create_mysql_db
from ppmessage.db.create import create_mysql_tables
from ppmessage.db.create import create_pgsql_tables
from ppmessage.db.create import create_sqlite_tables

import os
import json
import uuid
import redis
import errno    
import logging

import tornado.web

def _return(_handler, _code):
    if _code >= 0:
        _handler.write({"error_code": _code})
        _handler.flush()
    else:
        _handler.send_error(404)
    return

def _mkdir_p(_path):
    _path = os.path.dirname(_path)
    try:
        os.makedirs(_path)
    except OSError as exc:  # Python >2.5
        if exc.errno == errno.EEXIST and os.path.isdir(_path):
            pass
        else:
            raise
    return

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
        _status = {"status": CONFIG_STATUS.NONE}
        if _get_config() != None:
            _status["status"] = _get_config().get("config_status")

        if _status["status"] == CONFIG_STATUS.RESTART:
            self.redirect("/")
            return
        
        self.write(_status)
        self.flush()
        return

class ServerHandler(tornado.web.RequestHandler):    
    def _dump_server_config(self, _server_config):
        """
        server config is first
        """
        _config = {
            "config_status": CONFIG_STATUS.SERVER,
            "server": _server_config
        }
        _dump_config(_config)
        return
    
    def post(self, id=None):        
        _request = json.loads(self.request.body)

        _config = _get_config()
        if _config != None and _config.get("config_status") == CONFIG_STATUS.SERVER:
            logging.error("server config already existed.")
            return _return(self, -1)

        # SERVER
        _server = _request
        if _server == None or _server.get("name") == None or _server.get("port") == None:
            logging.error("config server not run for wrong request: %s." % _server)
            return _return(self, -1)

        self._dump_server_config(_server)
        return _return(self, 0)

class DatabaseHandler(tornado.web.RequestHandler):
    
    def _dump_db_config(self, _db_config):
        _config = _get_config()
        _config["config_status"] = CONFIG_STATUS.DATABASE
        _config["db"] = _db_config
        _dump_config(_config)
        return
    
    def _sqlite(self, _request):
        _db_file_path = _request.get(SQL.SQLITE.lower())
        if _db_file_path == None:
            logging.error("%s not in %s" % (SQL.SQLITE.lower(), str(_request)))
            return _return(self, -1)
        
        _db_file_path = _db_file_path.get("db_file_path")
        if _db_file_path == None or len(_db_file_path) == 0:
            logging.error("db_file_path is required for sqlite")
            return _return(self, -1)
        
        try:
            _mkdir_p(_db_file_path)
            open(_db_file_path, "w").close()
        except:
            logging.error("sqlite: can not create %s" % _db_file_path)
            return _return(self, -1)
        
        _config = {
            "type": SQL.SQLITE.lower(),
            "sqlite": {
                "db_file_path": _db_file_path
            }
        }

        if create_sqlite_tables(_config):
            self._dump_db_config(_config)
            return _return(self, 0)
        return _return(self, -1)

    def _mysql(self, _request):
        _request = _request.get("mysql") 

        _db_name = _request.get("db_name")
        _db_host = _request.get("db_host")
        _db_port = _request.get("db_port")
        _db_user = _request.get("db_user")
        _db_pass = _request.get("db_pass")

        if _db_name == None or _db_host == None or _db_port == None\
           or _db_user == None or _db_pass == None:
            logging.error("mysql required db paramters not provided.")
            return _return(self, -1)

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
        if create_mysql_db(_config):
            if create_mysql_tables(_config):
                self._dump_db_config(_config)
                return _return(self, 0)
        
        return _return(self, -1)

    def _pgsql(self, _request):

        _request = _request.get(SQL.PGSQL.lower())
        
        _db_name = _request.get("db_name")
        _db_host = _request.get("db_host")
        _db_port = _request.get("db_port")
        _db_user = _request.get("db_user")
        _db_pass = _request.get("db_pass")

        if _db_name == None or _db_host == None or _db_port == None\
           or _db_user == None or _db_pass == None:
            logging.error("mysql required db paramters not provided.")
            _return(self, -1)

        _config = {
            "type": SQL.PGSQL.lower(),
            "pgsql": {
                "db_name": _db_name,
                "db_host": _db_host,
                "db_port": _db_port,
                "db_user": _db_user,
                "db_pass": _db_pass
            }
        }

        if create_pgsql_db(_config):
            if create_pgsql_tables(_config):
                self._dump_db_config(_config)
                return _return(self, 0)
        
        return _return(self, -1)
    
    def post(self, id=None):        
        _request = json.loads(self.request.body)

        _config = _get_config()
        if _config == None or _config.get("config_status") != CONFIG_STATUS.SERVER:
            logging.error("not correct status to config database.")
            return _return(self, -1)

        _db = _request
        _type = _db.get("type")
        if _type == None or len(_type) == 0:
            logging.error("type is required.")
            return _return(self, -1)
        
        _type = _type.upper()
        if _type == SQL.SQLITE:
            return self._sqlite(_db)
        if _type == SQL.MYSQL:
            return self._mysql(_db)
        if _type == SQL.PGSQL:
            return self._pgsql(_db)

        return _return(self, -1)

class FirstHandler(tornado.web.RequestHandler):
    def __init__(self, *args, **kwargs):
        self._user_uuid = None
        self._app_uuid = None
        super(FirstHandler, self).__init__(*args, **kwargs)
        
    def _check_request(self, _request):
        if _request.get("user_fullname") == None or \
           _request.get("user_email") == None or \
           _request.get("user_password") == None or \
           _request.get("user_language") == None or \
           _request.get("team_name") == None:
            logging.info("check request false: %s" % _request)
            return False
        return True

    def _create_user(self, _request):
        from ppmessage.db.models import DeviceUser
        
        _user_email = _request.get("user_email")
        _user_fullname = _request.get("user_fullname")
        _user_password = _request.get("user_password")
        _user_language = _request.get("user_language")

        _user_uuid = str(uuid.uuid1())
        _row = DeviceUser(uuid=_user_uuid,
                          user_email=_user_email,
                          user_password=_user_password,
                          user_language=_user_language)
        
        _row.create_redis_keys(self.application.redis)
        _row.async_add(self.application.redis)
        self._user_uuid = _user_uuid
        return True

    def _create_team(self, _request):
        from ppmessage.db.models import AppInfo
        
        _app_name = _request.get("team_name")
        _app_uuid = str(uuid.uuid1())
        _user_uuid = self._user_uuid
        _app_key = str(uuid.uuid1())
        _app_secret = str(uuid.uuid1())

        _row = AppInfo(uuid=_app_uuid, 
                       app_name=_app_name,
                       user_uuid=_user_uuid,
                       app_key=_app_key,
                       app_secret=_app_secret)
        _row.create_redis_keys(self.application.redis)
        _row.async_add(self.application.redis)
        self._app_uuid = _app_uuid
        return True

    def _create_data(self, _request):
        from ppmessage.db.models import AppUserData
        _user_uuid = self._user_uuid
        _app_uuid = self._app_uuid
        
        _row = AppUserData(
            uuid=str(uuid.uuid1()),
            app_uuid = _app_uuid,
            user_uuid=_user_uuid,
            is_service_user = True,
            is_owner_user = True,
            is_portal_user = False                                    
        )
        _row.create_redis_keys(self.application.redis)
        _row.async_add(self.application.redis)
        return True

    def _create_api(self, _request):
        from ppmessage.db.models import ApiInfo
        import hashlib
        import base64
        _app_uuid = self._app_uuid
        _user_uuid = self._user_uuid

        def _encode(_key):
            _key = hashlib.sha1(_key).hexdigest()
            _key = base64.b64encode(_key)
            return _key

        def _info(_type):
            _row = ApiInfo(uuid=str(uuid.uuid1()),
                           user_uuid=_user_uuid,
                           app_uuid=_app_uuid,
                           api_level=_type,
                           api_key=_encode(str(uuid.uuid1())),
                           api_secret=_encode(str(uuid.uuid1())))
            _row.create_redis_keys(self.application.redis)
            _row.async_add(self.application.redis)
            return {"uuid":_row.uuid, "key":_row.api_key, "secret":_row.api_secret}

        _config = {
            API_LEVEL.PPCOM.lower(): _info(API_LEVEL.PPCOM),
            API_LEVEL.PPKEFU.lower(): _info(API_LEVEL.PPKEFU),
            API_LEVEL.PPCONSOLE.lower(): _info(API_LEVEL.PPCONSOLE),
            API_LEVEL.PPCONSOLE_BEFORE_LOGIN.lower(): _info(API_LEVEL.PPCONSOLE_BEFORE_LOGIN),
            API_LEVEL.THIRD_PARTY_KEFU.lower(): _info(API_LEVEL.THIRD_PARTY_KEFU),
            API_LEVEL.THIRD_PARTY_CONSOLE.lower(): _info(API_LEVEL.THIRD_PARTY_CONSOLE)
        }
        self._api = _config
        return True

    def _cur_dir():
        return os.path.dirname(__file__)
    
    def _dist_ppcom(self, _request):
        from ppmessage.ppcom.config.config import config
        _d = {
            "ssl": _get_config().get("server").get("ssl"),
            "server_name": _get_config().get("server").get("name"),
            "server_port": _get_config().get("server").get("port"),
            "key": self._api.get(API_LEVEL.PPCOM.lower()).get("key"),
            "secret": self._api.get(API_LEVEL.PPCOM.lower()).get("secret"),
        }
        config(_d)
        return True

    def _dist_ppkefu(self, _request):
        from ppmessage.ppkefu.config.config import config
        _d = {
            "key": self._api.get(API_LEVEL.PPKEFU.lower()).get("key")
        }
        config(_d)
        return True

    def _dist_ppconsole(self, _request):
        from ppmessage.ppconsole.config.config import config
        _d = {
            "app_uuid": self._app_uuid,
            "api_uuid": self._api.get(API_LEVEL.PPCONSOLE.lower()).get("uuid"),
            "api_key": self._api.get(API_LEVEL.PPCONSOLE.lower()).get("key"),
            "api_secret": self._api.get(API_LEVEL.PPCONSOLE.lower()).get("secret")
        }
        config(_d)
        return True

    def _dist(self, _request):
        if not self._dist_ppcom(_request):
            return False
        if not self._dist_ppkefu(_request):
            return False
        if not self._dist_ppconsole(_request):
            return False  
        return True

    def _dump_config(self, _request):
        _config = _get_config()
        _config["config_status"] = CONFIG_STATUS.FIRST
        _config["api"] = self._api
        _config["team"] = {
            "app_uuid": self._app_uuid
        }
        _config["configed"] = True
        _dump_config(_config)
        return True
    
    def post(self, id=None):
        logging.info("firsthandler")

        _request = json.loads(self.request.body)
        if not self._check_request(_request):
            return _return(self, -1)
        
        if not self._create_user(_request):
            return _return(self, -1)

        if not self._create_team(_request):
            return _return(self, -1)

        if not self._create_data(_request):
            return _return(self, -1)

        if not self._create_api(_request):
            return _return(self, -1)
        
        if not self._dist(_request):
            return _return(self, -1)

        self._dump_config(_request)
        return _return(self, 0)

class RestartHandler(tornado.web.RequestHandler):    
    def _dump_restart_config(self):
        _config = _get_config()
        _config["config_status"] = CONFIG_STATUS.RESTART
        _dump_config(_config)
        return

    def _restart(self):
        import sys
        import os
        """Restarts the current program.
        Note: this function does not return. Any cleanup action (like
        saving data) must be done before calling this function."""
        python = sys.executable
        os.execl(python, python, * sys.argv)
            
    def post(self, id=None):        
        _request = json.loads(self.request.body)

        _config = _get_config()
        if _config == None or _config.get("config_status") != CONFIG_STATUS.FIRST:
            logging.error("can not restart for config_status: %s." % _config.get("config_status"))
            return _return(self, -1)

        self._dump_restart_config()
        _return(self, 0)
        self._restart()

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
            (r"/server", ServerHandler),
            (r"/database", DatabaseHandler),
            (r"/first", FirstHandler),
            (r"/restart", RestartHandler),
            (r"/static/(.*)", tornado.web.StaticFileHandler, _a_settings),
        ]

        return handlers

    @classmethod
    def get_delegate(cls, app):
        return PPConfigDelegate(app)

class PPConfigApp(tornado.web.Application):
    
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        settings = {
            "debug": True,
            "cookie_secret": "24oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
        }
        tornado.web.Application.__init__(self, PPConfigWebService.get_handlers(), **settings)

    def get_delegate(self, name):
        return PPConfigDelegate(self)

    
