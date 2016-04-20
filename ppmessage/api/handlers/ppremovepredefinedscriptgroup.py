# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import ApiInfo
from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL

import json
import logging

class PPRemovePredefinedScriptGroup(BaseHandler):
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPRemovePredefineScriptGroup, self)._Task()
        return
