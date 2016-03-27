# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 YVertical.
# Guijin Ding, dingguijin@gmail.com
#
#

from mdm.core.constant import DIS_WHAT
from mdm.pcsocket.error import DIS_ERR
from .proc import Proc
import logging

class PredictUserHandler():
    
    def __init__(self, _app):
        self.app = _app
        return
    
    def task(self, _body):
        _proc = Proc(self.app)
        if not _proc.load_user(_body):
            logging.error("fail to load_user")
            return
        if not _proc.predict_user():
            logging.error("fail to predict_user")
            _proc.ack(DIS_WHAT.PEOPLE, DIS_ERR.PREDICT) 
            return
        return

