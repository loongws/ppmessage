# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# db/create.py
#

from sqlalchemy.ext.declarative import declarative_base
BaseModel = declarative_base()

# try load one but stupid load all
from ppmessage.db.models import DeviceUser

import logging

def create_sqlite_tables(_db_config):
    from sqlsqlite import SqlInstance
    _db = SqlInstance(_db_config)
    _engine = _db.createEngine()
    if _engine == None:
        return False
    BaseModel.metadata.create_all(_engine)
    return True


