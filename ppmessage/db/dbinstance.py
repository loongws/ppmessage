# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# db/dbinstance.py
#

#from .sqlsqlite import SqlInstance
#from .sqlsqlite import BaseModel

#from .sqlpsql import SqlInstance
#from .sqlpsql import BaseModel

from .sqlmysql import SqlInstance
from .sqlmysql import BaseModel

def getDBSessionClass():
    db = SqlInstance()
    db.createEngine()
    return db.getSessionClass()

def getDatabaseInstance():
    db = SqlInstance()
    db.createEngine()
    return db

def getDatabaseEngine():
    db = SqlInstance()
    db.createEngine()
    return db.dbengine
