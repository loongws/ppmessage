# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# scripts/db2cache.py
#

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

import redis
import logging

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    _redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
    from ppmessage.core.utils.db2cache import load
    load(_redis)
