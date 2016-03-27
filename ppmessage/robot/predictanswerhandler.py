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

class PredictAnswerHandler():
    
    def __init__(self, _app):
        self.app = _app
        return
        
    def task(self, _body):
        _proc = Proc(self.app)
        if not _proc.load_answer(_body):
            logging.error("fail to load_answer")
            return
        if not _proc.parse_answer():
            logging.error("fail to parse_answer")
            _proc.ack(DIS_WHAT.SEND, DIS_ERR.PARAM)
            return
        if not _proc.predict_answer(_question):
            logging.error("fail to predict_answer")
            _proc.ack(DIS_WHAT.SEND, DIS_ERR.PARAM)
            return
        return

