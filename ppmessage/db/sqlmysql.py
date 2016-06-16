# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# db/sqlmysql.py
#

from .sqlnone import SqlNone
from ppmessage.core.constant import SQL
from ppmessage.core.singleton import singleton
from ppmessage.core.utils.config import get_config_db_mysql

from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session
from sqlalchemy.pool import Pool

from sqlalchemy import exc
from sqlalchemy import event
from sqlalchemy import create_engine

import logging
import traceback

@event.listens_for(Pool, "checkout")
def ping_connection(dbapi_connection, connection_record, connection_proxy):
    try:
        cursor = dbapi_connection.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
    except:
        # optional - dispose the whole pool
        # instead of invalidating one at a time
        # connection_proxy._pool.dispose()

        # raise DisconnectionError - pool will try
        # connecting again up to three times before raising.
        raise exc.DisconnectionError()
    return

class SqlInstance(SqlNone):
    
    def __init__(self):

        _config = get_config_db_mysql()
        if _config == None:
            logging.error("MySQL is not configed.")
            return
        
        DB_NAME = _config.get("db_name")
        DB_PASS = _config.get("db_pass")
        DB_USER = _config.get("db_user")
        DB_HOST = _config.get("db_host")

        self.dbhost = DB_HOST
        self.dbname = DB_NAME
        self.dbuser = DB_USER
        self.dbpassword = DB_PASS

        super(SqlInstance, self).__init__()
        return

    def name(self):
        return SQL.MYSQL
    
    def createEngine(self):
        _config = get_config_db_mysql()
        if _config == None:
            logging.error("MySQL is not configed.")
            return None

        db_string = "mysql+mysqlconnector://%s:%s@%s/%s?charset=utf8" % (self.dbuser, 
                                                     self.dbpassword,
                                                     self.dbhost,
                                                     self.dbname)
        if self.dbengine == None:
            engine = create_engine(db_string, echo_pool=True)
            self.dbengine = engine
# it will create a thread local session for every single web request
        return self.dbengine

