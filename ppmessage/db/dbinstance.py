# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# db/dbinstance.py
#

from ppmessage.core.constant import SQL
from ppmessage.core.utils.config import get_config_db

from sqlalchemy.ext.declarative import declarative_base
BaseModel = declarative_base()

import logging

def _get_instance():
    _config = get_config_db()
    if _config == None:
        logging.error("db not configed")
        return None
    if _config.get("type").upper() == SQL.SQLITE:
        from .sqlsqlite import SqlInstance
    elif _config.get("type").upper() == SQL.PGSQL:
        from .sqlpgsql import SqlInstance
    elif _config.get("type").upper() == SQL.MYSQL:
        from .sqlmysql import SqlInstance
    else:
        logging.error("db type not supported: %s" % _config.get("type"))
        return None
    
    return SqlInstance(_config)

def getDBSessionClass():
    db = _get_instance()
    if db == None:
        return None    
    db.createEngine()
    return db.getSessionClass()

def getDatabaseEngine():
    db = _get_instance()
    if db == None:
        return None
    return db.createEngine()

