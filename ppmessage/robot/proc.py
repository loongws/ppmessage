# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from mdm.core.constant import MESSAGE_TYPE
from mdm.core.constant import MESSAGE_SUBTYPE
from mdm.core.constant import CONVERSATION_TYPE
from mdm.core.constant import PCSOCKET_SRV
from mdm.core.constant import TASK_STATUS
from mdm.core.constant import YVOBJECT

from mdm.core.constant import REDIS_ACK_NOTIFICATION_KEY
from mdm.core.constant import REDIS_DISPATCHER_NOTIFICATION_KEY

from mdm.db.models import PCSocketInfo
from mdm.db.models import MessagePushTask
from mdm.db.models import ConversationInfo
from mdm.db.models import PCScoketDeviceData

import json
import uuid
import logging

class Proc():
    
    def __init__(self, _app):
        self._svm = _app.svm
        self._vector = _app.vector
        self._target = _app.target        
        self._redis = _app.redis
        return

    def load_fit(self, _body):
        self._body = _body
        if not isinstance(_body, dict):
            self._body = json.loads(_body)

        self._app_uuid = self._body.get("app_uuid")
        if self._app_uuid == None:
            logging.error("no app_uuid provided")
            return False
        return True

    def load_answer(self, _body):
        self._body = _body
        if not isinstance(_body, dict):
            self._body = json.loads(_body)

        self._task_uuid = self._body.get("task_uuid")
        if self._task_uuid == None:
            logging.error("no task_uuid provided.")
            return False

        self._task = redis_hash_to_dict(self._redis, MessagePushTask, self._task_uuid)
        if self._task == None:
            logging.error("no task in redis cache")
            return False

        _device_uuid = self._task.get("from_device_uuid")
        if _device_uuid == None:
            logging.error("no from_device_uuid")
            return False
        _key = PCSocketDeviceData.__tablename + ".device_uuid." + _device_uuid
        _pcsocket_uuid = self._redis.get(_key)
        if _pcsocket_uuid == None:
            logging.error("no pcsocket_uuid")
            return False
        self._pcsocket = redis_hash_to_dict(self._redis, PCSocketInfo, _pcsocket_uuid)
        if self._pcsocket == None:
            logging.error("no pcsocket")
            return False
        
        return True
    
    def parse_answer(self):
        _subtype = self._task.get("message_subtype")
        
        if _subtype == MESSAGE_SUBTYPE.TEXT:
            return self._task.get("body")

        if _subtype == MESSAGE_SUBTYPE.TXT:
            _fid = self._task.get("message_body").get("fid")
            return read_file(self._redis, _fid)
        
        return None

    def load_user(self, _body):
        self._body = _body
        if not isinstance(_body, dict):
            self._body = json.loads(_body)

        # pcsocket, host, port, device_uuid
        self._pcsocket = self._body.get("pcsocket")
        if self._pcsocket == None:
            logging.error("no pcsocket_uuid")
            return False

        # FIXME: app_uuid, user_uuid, conversation_uuid
        # to allocate a real people for the visitor
        self._app_uuid = self._body.get("app_uuid")
        if self._app_uuid == None:
            logging.error("no app_uuid")
            return False

        self._user_uuid = self._body.get("user_uuid")
        if self._user_uuid == None:
            logging.error("no user_uuid")
            return False

        self._conversation_uuid = self._body.get("conversation_uuid")
        if self._conversation_uuid == None:
            logging.error("no conversation_uuid")
            return False

        return True

    def predict_user(self):
        return None
    
    def fit(self):
        _Y = []
        _train_data = []
        _target_string = []
        _label_index = 0

        _key = RobotSampleInfo.__tablename__ + ".app_uuid." + self._app_uuid
        _train_set = self._redis.smembers(_key)
        for _train_item in _train_set:
            _item = json.loads(_train_item)
            
            for _data in _item[0]:
                #_train_data.append(_data)
                _train_data.append(" ".join(jieba.lcut(_data)))
                _Y.append(_label_index)
            _label_index = _label_index + 1
            _targe_string.append(_item[1])

        if len(_train_data) == 0:
            logging.error("no data to train")
            return False
        
        _vector = TfidVectorizer()
        _X = _vector.fit_transform(_train_data)
        _svm = SVC(C=1000000.0, gamma='auto', kernel='rbf')
        _svm.fit(_X, _Y)
        
        self._svm[self._app_uuid] = _svm
        self._vector[self._app_uuid] = _vector
        self._target[self._app_uuid] = _target_string
        
        return True
    
    def predict_answer(self, _question):
        _svm = self._svm.get(self._app_uuid)
        _vector = self._vector.get(self._app_uuid)
        _target = self._target.get(self._app_uuid)

        if _svm == None or _vector == None or _target == None:
            logging.error("svm classification not ready to predict")
            return False

        _question =  " ".join(jieba.lcut(_question))
        _X = _vector.transform([_question])
        _Y = _svm.predict(_X)
        _label = _target[_Y[0]]

        if _label == None:
            logging.error("target:%s has not label for: %d" % (_target, _Y[0]))
            return False
        
        return self._push_task(_label)

    def ack(self, _what, _code, _extra):
        if self._pcsocket == None:
            logging.error("no pcsocket which ack needs")
            return
        _host = self._pcsocket.get("host")
        _port = self._pcsocket.get("port")
        _device_uuid = self._pcsocket.get("device_uuid")
        if _host == None or _port == None or _device_uuid == None:
            logging.error("no host/port/device which ack needs")
            return
        _body = {
            "device_uuid": _device_uuid,
            "what": _what,
            "code": _code,
            "extra": _extra,
        }
        _key = REDIS_ACK_NOTIFICATION_KEY + ".host." + _host + ".port." + _port
        self._redis.rpush(_key, json.dumps(_body))
        return
    
    def _push_task(self, _label):        
        _conversation_uuid = self._task.get("conversation_uuid")
        if _conversation_uuid == None:
            logging.error("no conversation uuid prepared.")
            return False
        
        _task = {
            "uuid": str(uuid.uuid1()),
            "app_uuid": self._app_uuid,
            "conversation_uuid": _conversation_uuid,
            "conversation_type": CONVERSATION_TYPE.S2P,
            "message_type": MESSAGE_TYPE.NOTI,
            "message_subtype": MESSAGE_SUBTYPE.TEXT,
            "from_uuid": self._app.robot_user_uuid,
            "from_type": YVOBJECT.RO,
            "to_type": self._task.get("to_type"),
            "to_uuid": self._task.get("to_uuid"),
            "body": _label,
            "task_status": TASK_STATUS.PENDING,
        }
        _row = MessagePushTask(**_task)
        _row.async_add()
        _row.create_redis_keys(self._redis)

        _row = ConversationInfo(uuid=_conversation_uuid, latest_task=_task.uuid)
        _row.async_update()
        _row.update_redis_keys(self._redis)

        _m = {"task_uuid": _task.uuid}
        self._redis.rpush(REDIS_DISPATCHER_NOTIFICATION_KEY, json.dumps(_m))
        return True

