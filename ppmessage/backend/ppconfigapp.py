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

from ppmessage.core.p12converter import der2pem

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
        if _get_config() == None:
            pass  
        elif _get_config().get("db") and _get_config().get("team") and _get_config().get("apns") and _get_config.get("gcm"):
            _status["status"] = CONFIG_STATUS.ANDROID
        elif _get_config().get("db") and _get_config().get("team") and _get_config().get("apns"):
            _status["status"] = CONFIG_STATUS.IOS
        elif _get_config().get("db") and _get_config().get("team"):
            _status["status"] = CONFIG_STATUS.FIRST
        elif _get_config().get("db"):
            _status["status"] = CONFIG_STATUS.DATABASE
        else:
            _status["status"] = CONFIG_STATUS.NONE
        self.write(_status)
        self.flush()
        return

class DatabaseHandler(tornado.web.RequestHandler):

    def _mkdir_p(self, _path):
        _path = os.path.dirname(_path)
        try:
            os.makedirs(_path)
        except OSError as exc:  # Python >2.5
            if exc.errno == errno.EEXIST and os.path.isdir(path):
                pass
            else:
                raise
        return
    
    def _dump_db_config(self, _db_config):
        _config = {
            "db": _db_config
        }
        _dump_config(_config)
        return
    
    def _sqlite(self, _request):
        logging.info(_request)

        _db_file_path = _request.get("sqlite").get("db_file_path")
        if _db_file_path == None or len(_db_file_path) == 0:
            logging.error("db_file_path is required for sqlite")
            return _return(self, -1)
        
        try:
            self._mkdir_p(_db_file_path)
            open(_db_file_path, "w").close()
        except:
            logging.error("sqlite db_file_path can not create")
            return _return(self, -1)
        
        _config = {
            "type": SQL.SQLITE.lower(),
            "sqlite": {
                "db_file_path": _db_file_path
            }
        }

        if create_sqlite_tables(_config.get(SQL.SQLITE.lower())):
            self._dump_db_config(_config)
            return _return(self, 0)
        return _return(self, -1)

    def _mysql(self):
        _db_name = _request.get("db_name")
        _db_host = _request.get("db_host")
        _db_port = _request.get("db_port")
        _db_user = _request.get("db_user")
        _db_pass = _request.get("db_pass")

        if _db_name == None or _db_host == None or _db_port == None\
           or _db_user == None or _db_pass == None:
            logging.error("mysql required db paramters not provided.")
            self._return(self, -1)

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
                return _return(self, 0)
        
        return _return(self, -1)

    def _pgsql(self):
        
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
                return _return(self, 0)
        
        return _return(self, -1)
    
    def post(self, id=None):        
        _request = json.loads(self.request.body)
        _type = _request.get("type")

        _config = _get_config()
        if _config != None:
            logging.error("config already existed.")
            return _return(self, -1)
        
        if _type == None or len(_type) == 0:
            logging.error("type is required.")
            return _return(self, -1)

        _type = _type.upper()
        if _type == SQL.SQLITE:
            return self._sqlite(_request)
        if _type == SQL.MYSQL:
            return self._mysql(_request)
        if _type == SQL.PGSQL:
            return self._pgsql(_request)

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
            _return(self, -1)
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
        
        _row.create_redis_cache(self.application.redis)
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

        _row = ApiInfo(uuid=_app_uuid, 
                       app_name=_app_name,
                       user_uuid=_user_uuid,
                       app_key=_app_key,
                       app_secret=_app_secret)
        _row.create_redis_cache(self.application.redis)
        _row.async_add(self.application.redis)
        self._app_uuid = _app_uuid
        return True

    def _create_data(self, _request):
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
        _row.create_redis_cache(self.application.redis)
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
            _row.create_redis.cache(self.application.redis)
            _row.async_add(self.application.redis)
            return {uuid:_row.uuid, key:_row.api_key, secret:_row.api_secret}

        _config = {
            API_LEVEL.PPCOM.lower(): _info(API_LEVEL.PPCOM),
            API_LEVEL.PPKEFU.lower(): _info(API_LEVEL.PPKEFU),
            API_LEVEL.PPCONSOLE.lower(): _info(API_LEVEL.PPCONSOLE),
            API_LEVEL.PPCONSOLE_BEFORE_LOGIN.lower(): _info(PPCONSOLE_BEFORE_LOGIN),
            API_LEVEL.THIRD_PARTY_KEFU.lower(): _info(API_LEVEL.THIRD_PARTY_KEFU),
            API_LEVEL.THIRD_PARTY_CONSOLE.lower(): _info(API_LEVEL.THIRD_PARTY_CONSOLE)
        }

        self._api = _config
        return True

    def _cur_dir():
        return os.path.dirname(__file__)
    
    def _dist_ppcom(self, _request):
        from ppmessage.ppcom.config import config
        return config(self._api.get(API_LEVEL.PPCOM.lower()))

    def _dist_ppkefu(self, _request):
        from ppmessage.ppkefu.config import config
        return config(self._api.get(API_LEVEL.PPKEFU.lower()))

    def _dist_ppconsole(self, _request):
        from ppmessage.ppconsole.config import config
        return config(self._api.get(API_LEVEL.PPCONSOLE.lower()))

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
            return self._return(-1)

        if not self._create_data(_request):
            return self._return(-1)

        if not self._create_api(_request):
            return self._return(-1)
        
        if not self._dist(_request):
            return self._return(-1)

        self._dump_config(_request)
        return _return(self, 0)

class IOSHandler(tornado.web.RequestHandler):

    def _check_ios(self, _request):
        if self.request.files == None or len(self.request.files) == 0:
            return False
        
        self._dev_cert_file = self.request.files.get("dev_cert")
        if self._dev_cert_file != None:
            self._dev_cert_file = self._dev_cert_file[0]

        self._pro_cert_file = self.request.files.get("pro_cert")
        if self._pro_cert_file != None:
            self._pro_cert_file = self._pro_cert_file[0]

        self._com_cert_file = self.request.files.get("com_cert")
        if self._com_cert_file != None:
            self._com_cert_file = self._com_cert_file[0]

        self._dev_cert_password = _request.get("dev_cert_password")
        self._pro_cert_password = _request.get("pro_cert_password")
        self._com_cert_password = _request.get("com_cert_password")
        return True
    
    def _save_db(self, _request):
        _dev_pem = None
        _pro_pem = None
        _com_pem = None
        
        if self._dev_cert_file != None and self._dev_cert_password != None:
            _dev_pem = der2pem(self._dev_cert_file, self._dev_cert_password)
        if self._pro_cert_file != None and self._pro_cert_password != None:
            _pro_pem = der2pem(self._pro_cert_file, self._pro_cert_password)
        if self._com_cert_file != None and self._com_cert_password != None:
            _com_pem = der2pem(self._com_cert_file, self._com_cert_password)

        _app_uuid = _get_config.get("team").get("app_uuid")
        _row = APNSSetting(
            uuid=str(uuid.uuid1()),
            name=_app_uuid,
            app_uuid=_app_uuid,
            production_pem=_pro_pem,
            development_pem=_dev_pem,
            combination_pem=_com_pem
        )
        _row.create_redis_keys(self.application.redis)
        _row.async_add(self.application.redis)
        return True

    def _dump_config(self, _request):
        _config = _get_config()
        _config["ios"] = {
            "configed": True
        }
        _dump_config(_config)
        return
    
    def post(self, id=None):
        logging.info("ioshandler")

        if not self._check_ios(_request):
            return _return(self, -1)

        if not self._save_db(_request):
            return _return(self, -1)

        self._dump_config(_request)
        return _return(self, 0)

class AndroidHandler(tornado.web.RequestHandler):
    
    def _check_android(self, _request):
        _type = _request.get("type")
        if _type == None:
            return False

        if _type == "GCM" and _request_get("api_key") == None:
            return False

        if _type == "JPUSH" and _request_get("master_secret") == None:
            return False
        
        return True
    
    def _dump_mqtt_config(self, _request):
        _config = _get_config()
        _config["android"] = {
            "type": "MQTT"
        }
        _dump_config(_config)
        return _return(self, 0)

    def _dump_gcm_config(self, _request):
        _config = _get_config()
        _config["android"] = {
            "type": "GCM",
            "gcm": {
                api_key: _request.get("api_key")
            }
        }
        _dump_config(_config)
        return _return(self, 0)

    def _dump_jpush_config(self, _request):
        _config = _get_config()
        _config["android"] = {
            "type": "JPUSH",
            "jpush": {
                api_key: _request.get("master_secret")
            }
        }
        _dump_config(_config)
        return _return(self, 0)
    
    def post(self, id=None):
        logging.info("Androidhandler")
        
        if not self._check_android(_request):
            return _return(self, -1)

        if _request.get("type") == "MQTT":
            return self._dump_mqtt_config(_request)

        if _request.get("type") == "GCM":
            return self._dump_gcm_config(_request)

        if _request.get("type") == "JPUSH":
            return self._dump_jpush_config(_request)

        return _return(self, -1)

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
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        settings = {
            "debug": True,
            "cookie_secret": "24oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
        }
        tornado.web.Application.__init__(self, PPConfigWebService.get_handlers(), **settings)

    def get_delegate(self, name):
        return PPConfigDelegate(self)

    
