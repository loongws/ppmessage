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
        self.pgsql_config = _db_config
        
        self.db_name = self.pgsql_config.get("db_name")
        self.db_pass = self.pgsql_config.get("db_pass")
        self.db_user = self.pgsql_config.get("db_user")
        self.db_host = self.pgsql_config.get("db_host")
        self.db_port = self.pgsql_config.get("db_port")
        
        super(SqlInstance, self).__init__()
        return

    def name(self):
        return SQL.PGSQL
        
    def createEngine(self):
        db_string = "postgresql+psycopg2://%s:%s@%s:%s/%s" % (
            self.db_user, 
            self.db_pass,
            self.db_host,
            self.db_port,
            self.db_name
        )
        
        if self.dbengine == None:
            self.dbengine = create_engine(db_string, echo_pool=True)
        # it will create a thread local session for every single web request
        return self.dbengine
        

