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
    _db_string = "mysql+pymysql://%s:%s@%s:%s" % \
                 (_db_config.get("db_user"), _db_config.get("db_pass"),
                  _db_config.get("db_host"), _db_config.get("db_port"))
    logging.info(_db_string)
    _engine = create_engine(_db_string) # default utf-8
    _engine.execute("DROP DATABASE IF EXISTS %s" % _db_config.get("db_name"))
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
    _db_string = "postgresql+psycopg2://%s:%s@%s:%s/postgres" % \
                 (_db_config.get("db_user"), _db_config.get("db_pass"),
                  _db_config.get("db_host"), _db_config.get("db_port"))

    _engine = create_engine(_db_string)
    _conn = _engine.connect()
    _conn.execute("commit")

    _conn.connection.set_isolation_level(0)
    _conn.execute("drop database if exists %s" % _db_config.get("db_name"))
    _conn.execute("create database %s" % _db_config.get("db_name"))
    _conn.connection.set_isolation_level(1)

    _conn.close()
    return True

def create_pgsql_tables(_db_config):
    _engine = getDatabaseEngine(_db_config)
    if _engine == None:
        return False
    BaseModel.metadata.create_all(_engine)
    return True
