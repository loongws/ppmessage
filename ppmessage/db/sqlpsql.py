# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved
#
# db/sqlpsql.py
#

from .sqlnone import SqlNone

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session
from sqlalchemy.pool import Pool

from sqlalchemy import exc
from sqlalchemy import event
from sqlalchemy import create_engine

from ppmessage.core.constant import SQL
from ppmessage.core.singleton import singleton

import traceback

BaseModel = declarative_base()

class SqlInstance(SqlNone):

    def __init__(self):
        DB_NAME = BOOTSTRAP_CONFIG.get("psql").get("db_name")
        DB_PASS = BOOTSTRAP_CONFIG.get("psql").get("db_pass")
        DB_USER = BOOTSTRAP_CONFIG.get("psql").get("db_user")
        DB_HOST = BOOTSTRAP_CONFIG.get("psql").get("db_host")

        self.dbhost = DB_HOST
        self.dbname = DB_NAME
        self.dbuser = DB_USER
        self.dbpassword = DB_PASS

        super(SqlInstance, self).__init__()
        return

    def name(self):
        return SQL.PSQL
        
    def createEngine(self):                
        db_string = "postgresql+psycopg2://%s:%s@%s/%s" % (self.dbuser, 
                                                           self.dbpassword,
                                                           self.dbhost,
                                                           self.dbname)
        if self.dbengine == None:
            self.dbengine = create_engine(db_string, echo_pool=True)
        # it will create a thread local session for every single web request
        return self.dbengine
        

