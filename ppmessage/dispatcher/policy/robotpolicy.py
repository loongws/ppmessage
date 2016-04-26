# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from .policy import AbstractPolicy
from .algorithm import RobotAppAlgorithm

from ppmessage.core.constant import APP_POLICY

import random

class RobotPolicy(AbstractPolicy):
    def __init__(self, dis):
        super(RobotPolicy, self).__init__(dis)
        self._name = APP_POLICY.ROBOT
        return

    @classmethod
    def name(cls):
        return APP_POLICY.ROBOT
    
    def users(self):
        super(RobotPolicy, self).users()
        return

    @classmethod
    def get_service_care_users(cls, _app_uuid, _user_uuid, _redis):
        _a_users = AbstractPolicy.app_users(_app_uuid, True, _redis)
        _b_users = AbstractPolicy.app_users(_app_uuid, False, _redis)
        return _a_users + _b_users

    @classmethod
    def get_portal_care_users(cls, _app_uuid, _user_uuid, _redis):
        _a_users = AbstractPolicy.app_users(_app_uuid, True, _redis)
        return _a_users

