
from ppmessage.db.models import PredefinedScript
from ppmessage.db.models import PredefinedScriptGroup
from ppmessage.db.dbinstance import getDatabaseEngine

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

import redis

def _cache_create(_cls, _redis, _session):
    _all = _session.query(_cls).all()
    for _i in _all:
        _i.create_redis_keys(_redis, _is_load=True)
    return

def _cache_delete(_cls, _redis, _session):
    _all = _session.query(_cls).all()
    for _i in _all:
        _i.delete_redis_keys(_redis)
    return

def _table_drop(_cls, _engine):
    _cls.__table__.drop(_engine)
    return

def _table_create(_cls, _engine):
    _cls.__table__.create(_engine)
    return

if __name__ == "__main__":
    _engine = getDatabaseEngine()    

    _clses = [PredefinedScript, PredefinedScriptGroup]
    for _cls in _clses:
        try:
            _table_drop(_cls, _engine)
        except:
            print("can not drop table: %s" % _cls.__table__.name)    
        _table_create(_cls, _engine)
        print("create table: %s" % _cls.__table__.name)
        
    

