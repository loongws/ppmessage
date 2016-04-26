# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.db.dbinstance import getDBSessionClass

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from ppmessage.db.models import DeviceUser
from ppmessage.db.sqlmysql import BaseModel

import sys
import redis
import logging
import datetime
import traceback

def _load_generic(_cls, _redis, _session):
    _all = _session.query(_cls).all()
    for _i in _all:
        _i.create_redis_keys(_redis, _is_load=True)
    return

def _table_2_class(_tablename):
    for c in BaseModel._decl_class_registry.values():
        if hasattr(c, '__tablename__') and c.__tablename__ == _tablename:
            return c
    return None

def load():
    _redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
    _session_class = getDBSessionClass()
    _session = _session_class()
    logging.basicConfig(level=logging.DEBUG)

    if len(sys.argv) == 1:
        print("provide table names")
        return

    _table_names = sys.argv[1:]
    try:
        for _table in _table_names:
            logging.info("Loading %s...", _table)
            _cls = _table_2_class(_table)
            if _cls != None:
                _load_generic(_cls, _redis, _session)
                logging.info("Loading .... done.")
            else:
                logging.error("no such table: %s" % _table)
    except:
        traceback.print_exc()
    finally:
        _session_class.remove()
        
    logging.info("$$$$$$$$$$$ LOAD DONE $$$$$$$$$$$$$")
    return
    
if __name__ == "__main__":
    load()
