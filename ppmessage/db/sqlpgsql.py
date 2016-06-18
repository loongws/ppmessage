# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved
#
# db/sqlpsql.py
#

from .sqlnone import SqlNone
from ppmessage.core.constant import SQL
from ppmessage.core.singleton import singleton

from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session

from sqlalchemy import create_engine

import logging
import traceback

class SqlInstance(SqlNone):

    def __init__(self, _db_config):

        self.pgsql_config = None
        _pgsql = _db_config.get(SQL.PGSQL.lower())
        if _pgsql == None:
            logging.error("PGSQL not configed.")
            reutrn
        self.pgsql_config = _pgsql
        
        DB_NAME = _pgsql.get("db_name")
        DB_PASS = _pgsql.get("db_pass")
        DB_USER = _pgsql.get("db_user")
        DB_HOST = _pgsql.get("db_host")

        self.dbhost = DB_HOST
        self.dbname = DB_NAME
        self.dbuser = DB_USER
        self.dbpassword = DB_PASS

        super(SqlInstance, self).__init__()
        return

    def name(self):
        return SQL.PGSQL
        
    def createEngine(self):

        if self.pgsql_config == None:
            logging.error("can not create engine for not configed.")
            return None
        
        db_string = "postgresql+psycopg2://%s:%s@%s/%s" % (self.dbuser, 
                                                           self.dbpassword,
                                                           self.dbhost,
                                                           self.dbname)
        if self.dbengine == None:
            self.dbengine = create_engine(db_string, echo_pool=True)
        # it will create a thread local session for every single web request
        return self.dbengine
        

