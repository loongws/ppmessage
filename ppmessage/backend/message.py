# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# init/message.py 
# The entry for message service
#

from ppmessage_mqtt import mqtt_server
from ppmessage_mqtt import authenticate
from ppmessage_mqtt import mqtt_authenticate

from tornado.options import parse_command_line

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import ApiTokenData

import redis

class my_authenticate(authenticate):
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        return
    
    def verify_client_id(self, client_id):
        _key = DeviceInfo.__tablename__ + ".uuid." + client_id
        if not self.redis.exists(_key):
            return False
        return True
    
    def verify_user_password(self, user_id, password):
        _key = ApiTokenData.__tablename__ + ".api_token." + password
        if not self.redis.exists(_key):
            return False
        return True

def mqtt_message_main():
    parse_command_line()
    mqtt_authenticate(my_authenticate)
    mqtt_server()
    return

if __name__ == "__main__":
    mqtt_message_main()
