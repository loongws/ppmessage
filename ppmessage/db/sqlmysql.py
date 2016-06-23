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
    
    def __init__(self, _db_config):
        self.mysql_config = _db_config
        self.db_name = self.mysql_config.get("db_name")
        self.db_pass = self.mysql_config.get("db_pass")
        self.db_user = self.mysql_config.get("db_user")
        self.db_host = self.mysql_config.get("db_host")
        self.db_port = self.mysql_config.get("db_port")
        super(SqlInstance, self).__init__()
        return

    def name(self):
        return SQL.MYSQL
    
    def createEngine(self):
        db_string = "mysql+mysqlconnector://%s:%s@%s:%s/%s" % \
                    (self.db_user, 
                     self.db_pass,
                     self.db_host,
                     self.db_port,
                     self.db_name)
        if self.dbengine == None:
            engine = create_engine(db_string, echo_pool=True)
            self.dbengine = engine
# it will create a thread local session for every single web request
        return self.dbengine

