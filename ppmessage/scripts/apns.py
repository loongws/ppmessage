# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.db.models import APNSSetting
from ppmessage.db.dbinstance import getDBSessionClass

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from ppmessage.core.p12converter import der2pem

from ppmessage.bootstrap.data import BOOTSTRAP_DATA
from ppmessage.bootstrap.config import BOOTSTRAP_CONFIG

import os
import uuid
import redis
import base64
import datetime
import traceback

is_dev = True

def _clean(dbsession):
    print("clean all apns setting...")
    dbsession.query(APNSSetting).delete()
    dbsession.commit()
    print("Done.")
    return

def _create(dbsession):
    _dev_pem = None
    _pro_pem = None
    _dev_p12 = None
    _pro_p12 = None

    _apns_config = BOOTSTRAP_CONFIG.get("apns")
    
    _dev_file = _apns_config.get("dev")
    _pro_file = _apns_config.get("pro")

    _certs_dir = os.path.dirname(os.path.abspath(__file__))
    _certs_dir = _certs_dir + os.path.sep + ".." + os.path.sep + "certs" + os.path.sep + "apnscerts"
    _dev_file = _certs_dir + os.path.sep + _dev_file
    _pro_file = _certs_dir + os.path.sep + _pro_file
    print(_pro_file)
    if not os.path.exists(_dev_file) or not os.path.exists(_pro_file):
        print("No dev or pro cert file found")
        sys.exit()
        
    with open(_dev_file, "rb") as _file:
        _dev_p12 = _file.read()
        _dev_pem = der2pem(_dev_p12)

    with open(_pro_file, "rb") as _file:
        _pro_p12 = _file.read()
        _pro_pem = der2pem(_pro_p12)

    _dev_p12 = base64.b64encode(_dev_p12)
    _dev_pem = base64.b64encode(_dev_pem)
    _pro_p12 = base64.b64encode(_pro_p12)
    _pro_pem = base64.b64encode(_pro_pem)

    _app_uuid = BOOTSTRAP_DATA.get("team").get("app_uuid")
    _name = BOOTSTRAP_DATA.get("apns").get("name")
    
    print(len(_dev_pem))
    print(len(_dev_p12))

    print(is_dev)
    _apns = APNSSetting(
        uuid=str(uuid.uuid1()),
        name=_name,
        app_uuid=_app_uuid,
        production_p12=_pro_p12,
        development_p12=_dev_p12,
        production_pem=_pro_pem,
        development_pem=_dev_pem,
        is_development=is_dev,
        is_production=not is_dev,
        createtime=datetime.datetime.now(),
        updatetime=datetime.datetime.now(),
    )

    dbsession.add(_apns)
    dbsession.commit()        
    return

def _cache_generic(_cls, _redis, _session):
    _all = _session.query(_cls).all()
    for _i in _all:
        _i.create_redis_keys(_redis, _is_load=True)
    return

def _cache(dbsession):
    _redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
    _keys = _redis.keys("apns_settings.uuid.*")
    for _key in _keys:
        _redis.delete(_key)
    _cache_generic(APNSSetting, _redis, dbsession)
    return

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')
    import codecs
    codecs.register(lambda name: codecs.lookup('utf8') if name == 'utf8mb4' else None)

    if len(sys.argv) > 1:
        if sys.argv[1] == "pro":
            is_dev = False
    print(is_dev)
    dbsession_class = getDBSessionClass()
    dbsession = dbsession_class()
    try:
        _clean(dbsession)
        _create(dbsession)
        _cache(dbsession)
    except:
        traceback.print_exc()
    finally:
        dbsession_class.remove()

