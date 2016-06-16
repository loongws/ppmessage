# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# db/dbinstance.py
#

from ppmessage.core.utils.config import get_config_db

from sqlalchemy.ext.declarative import declarative_base

import logging

BaseModel = declarative_base()

def _get_instance():
    _config = get_config_db()
    if _config == None:
        logging.error("db not configed")
        return None
    if _config.get("type").upper() == "SQLITE":
        from .sqlsqlite import SqlInstance
    elif _config.get("type").upper() == "PSQL":
        from .sqlpsql import SqlInstance
    elif _config.get("type").upper() == "MYSQL":
        from .sqlmysql import SqlInstance
    else:
        logging.error("db type not supported: %s" % _config.get("type"))
        return None
    
    return SqlInstance()

def getDBSessionClass():
    db = _get_instance()
    if db == None:
        return None
    
    db.createEngine()
    return db.getSessionClass()

def getDatabaseInstance():
    db = _get_instance()
    if db == None:
        return None
    
    db.createEngine()
    return db

def getDatabaseEngine():
    db = _get_instance()
    if db == None:
        return None
    
    db.createEngine()
    return db.dbengine
