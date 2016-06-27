# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.core.constant import SQL

from ppmessage.db.dbinstance import BaseModel
from ppmessage.db.dbinstance import SqlInstance
from ppmessage.db.dbinstance import getDatabaseEngine

from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import DeviceUser

from ppmessage.db.models import OrgGroup
from ppmessage.db.models import OrgGroupUserData
from ppmessage.db.models import OrgGroupSubGroupData

from ppmessage.db.models import MessagePush
from ppmessage.db.models import MessagePushTask

from ppmessage.db.models import FileInfo

import subprocess
import traceback
import codecs
import uuid

def _updateMessagePushTasksCharset(_engine):
    '''
    let it support store emoji
    '''
    _update = "ALTER TABLE message_push_tasks CHANGE body body VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    _engine.execute(_update)


def _create_mysql_db():
    DB_HOST = _get_config().get("db").get("mysql").get("db_host")
    DB_NAME = _get_config().get("db").get("mysql").get("db_name")
    DB_PASS = _get_config().get("db").get("mysql").get("db_pass")
    DB_USER = _get_config().get("db").get("mysql").get("db_user")

    print "Drop MDM DB now, please wait..."
    
    _drop_cmd = "mysql -h%s -u%s -p%s mysql -e \"drop database if exists %s\"" % (DB_HOST, DB_USER, DB_PASS, DB_NAME)
    _create_cmd = "mysql -h%s -u%s -p%s mysql -e \"create database %s default charset utf8\"" % (DB_HOST, DB_USER, DB_PASS, DB_NAME)

    subprocess.check_output(_drop_cmd, shell=True)
    subprocess.check_output(_create_cmd, shell=True)
    return

def _create_sqlite_db():
    return

def _create_db():
    
    if SqlInstance().name() == SQL.MYSQL:
        _create_mysql_db()

    if SqlInstance().name() == SQL.SQLITE:
        _create_sqlite_db()

    return

def _create_mysql_tables():
    codecs.register(lambda name: codecs.lookup('utf8') if name == 'utf8mb4' else None)
    _engine = getDatabaseEngine()
    BaseModel.metadata.create_all(_engine)
    # utf8mb4
    _updateMessagePushTasksCharset(_engine)    
    return

def _create_sqlite_tables():    
    _engine = getDatabaseEngine()
    BaseModel.metadata.create_all(_engine)
    return

def _create_tables():
    if SqlInstance().name() == SQL.MYSQL:
        _create_mysql_tables()

    if SqlInstance().name() == SQL.SQLITE:
        _create_sqlite_tables()

    return

def _main():

    _create_db()    
    print "create tables now, please wait..."
    _create_tables()
    print "create tables done!"

    return

if __name__ == "__main__":
    _main()
    


    
