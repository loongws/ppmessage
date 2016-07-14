# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 YVertical.
# Guijin Ding, dingguijin@gmail.com
#
#

from ppmessage.core.constant import MESSAGE_SUBTYPE

from ppmessage.pcsocket.error import DIS_ERR

from .proc import Proc
import logging

class SendHandler():
    
    def __init__(self, _app):
        self._app = _app
        return
    
    def task(self, _body):
        logging.info("ppmessage recv %s" % _body)
        _proc = Proc(self._app)

        # AUDIO SUPPORT?
        _proc.register_subtypes([
            MESSAGE_SUBTYPE.TEXT,
            MESSAGE_SUBTYPE.TXT,
            MESSAGE_SUBTYPE.IMAGE,
            MESSAGE_SUBTYPE.AUDIO,
            MESSAGE_SUBTYPE.FILE
        ])
        
        if not _proc.check(_body):
            _proc.ack(DIS_ERR.PARAM)
            return
        if not _proc.parse():
            _proc.ack(DIS_ERR.MESSAGE)
            return
        _proc.save()
        _proc.ack(DIS_ERR.NOERR)
        return

