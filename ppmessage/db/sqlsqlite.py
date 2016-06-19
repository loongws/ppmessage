# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# db/sqlsqlite.py
#

from .sqlnone import SqlNone

from ppmessage.core.constant import SQL
from ppmessage.core.singleton import singleton

from sqlalchemy import create_engine
from sqlite3 import dbapi2 as sqlite

import logging
import traceback

class SqlInstance(SqlNone):

    def __init__(self, _db_config):       
        _db_file_path = _db_config.get("db_file_path")
        if _db_file_path == None:
            _db_file_path = "/usr/local/var/db/sqlite/ppmessage.db"
        self.db_file_path = _db_file_path
        super(SqlInstance, self).__init__()
        return

    def name(self):
        return SQL.SQLITE
    
    def createEngine(self):
        _dbstring = "sqlite+pysqlite:///%s" % self.db_file_path
        if self.dbengine == None:
            _engine = create_engine(_dbstring, module=sqlite)
            self.dbengine = _engine
        return self.dbengine
