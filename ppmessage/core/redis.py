# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/redis.py
#

from ppmessage.core.constant import DATETIME_FORMAT
from ppmessage.core.constant import REDIS_SEARCH_KEY

from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import LargeBinary

import json
import logging
import datetime
import traceback

def redis_hash_to_dict(_redis, _cls, _uuid):
    if _uuid == None:
        logging.error("No hash with uuid None")
        return None
    
    _key = _cls.__tablename__ + ".uuid." + _uuid
    if _redis.exists(_key) == False:
        logging.error("No such key:%s." % (_key))
        return None

    _values = _redis.hgetall(_key)
    _d = {}
    for _i in _cls.__table__.columns:
        _v = _values.get(_i.name)
        
        if _v == None or _v == "None":
            _d[_i.name] = None
            continue

        _d[_i.name] = _v
        
        if isinstance(_i.type, DateTime):
            if len(_v) > 19:
                _v = datetime.datetime.strptime(_v, DATETIME_FORMAT["extra"])
            else:
                _v = datetime.datetime.strptime(_v, DATETIME_FORMAT["basic"])
            _d[_i.name] = _v
            continue

        if isinstance(_i.type, LargeBinary):
            continue
        
        if not isinstance(_i.type, String):
            _d[_i.name] = eval(_v)

    return _d

def row_to_redis_hash(_redis, _row):
    _d = {}

    for _f in _row.__table__.columns:
        _v = getattr(_row, _f.name)
        if _v is None:
            continue

        if isinstance(_f.type, DateTime):
            _d[_f.name] = _v.strftime(DATETIME_FORMAT["extra"])
        elif isinstance(_f.type, String):
            _d[_f.name] = _v
        else:
            _d[_f.name] = str(_v)

    _key = _row.__tablename__ + ".uuid." + _row.uuid
    _redis.hmset(_key, _d)
    return

def search_redis_index(_redis, _table, _search):

    _search_key = "%s.%s.%s" % (REDIS_SEARCH_KEY, _table, _search)

    if _redis.exists(_search_key):
        return _redis.smembers(_search_key)
        
    _words = split_chinese_string_to_words(_search)
    if _words == None or len(_words) == 0:
        return []

    _keys = []
    for _word in _words:
        _key = "%s.%s.%s" % (REDIS_SEARCH_KEY, _table, _word)
        _keys.append(_key)

    if len(_keys) == 0:
        return []

    _n = _redis.sinterstore(_search_key, _keys)
    if _n == 0:
        _redis.delete(_search_key)
    else:
        _redis.expire(_search_key, 20)

    return _redis.smembers(_search_key)
    
