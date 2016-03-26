# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 YVertical.
# Guijin Ding, dingguijin@gmail.com
#
#

from ppmessage.core.constant import DIS_WHAT
from ppmessage.pcsocket.error import DIS_ERR
from .proc import Proc
import logging

class FitHandler():
    
    def __init__(self, _app):
        self.app = _app
        return
    
    def task(self, _body):
        _proc = Proc(self.app)
        if not _proc.load_fit(_body):
            logging.error("fail to proc load_fit")
            return
        
        if not _proc.fit():
            logging.error("fail to proc fit")
            return
        return

