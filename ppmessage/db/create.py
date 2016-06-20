# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# db/create.py
#

from .dbinstance import BaseModel
from .dbinstance import getDatabaseEngine

from sqlalchemy import create_engine
import logging

def create_sqlite_tables(_db_config):    
    _engine = getDatabaseEngine(_db_config)
    if _engine == None:
        return False
    BaseModel.metadata.create_all(_engine)
    return True

def create_mysql_db(_db_config):
    _db_config = _db_config.get("mysql")
    _db_string = "mysql+mysqlconnector://%s:%s@%s:%s?charst=utf8" % \
                 (_db_config.get("db_user"), _db_config.get("db_pass"),
                  _db_config.get("db_host"), _db_config.get("db_port"))
    _engine = create_engine(_db_string)
    _engine.execute("CREATE DATABASE %s" % _db_config.get("db_name")) #create db
    _engine.execute("USE %s" % _db_config.get("db_name")) 
    return True

def create_mysql_tables(_db_config):
    _engine = getDatabaseEngine(_db_config)
    if _engine == None:
        return False
    BaseModel.metadata.create_all(_engine)
    return True

def create_pgsql_db(_db_config):
    _db_config = _db_config.get("pgsql")
    _db_string = "mysql+psycopg2://%s:%s@%s:%s/postgres" % \
                 (_db_config.get("db_user"), _db_config.get("db_pass"),
                  _db_config.get("db_host"), _db_config.get("db_port"))

    _engine = create_engine(_db_string)
    _conn = _engine.connect()
    _conn.execute("commit")
    _conn.execute("create database %s" % _db_config.get("db_name"))
    _conn.close()
    return True

def create_pgsql_tables(_db_config):
    _engine = getDatabaseEngine(_db_config)
    if _engine == None:
        return False
    BaseModel.metadata.create_all(_engine)
    return True
