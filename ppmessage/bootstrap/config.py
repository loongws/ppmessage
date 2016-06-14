# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

PPMESSAGE_CONFIG = {
    "db": {
        "type": "mysql",

        "sqlite": {
            "db_file": "/usr/local/var/db/sqlite/ppmessage.db"
        },
        
        "mysql": {
            "db_host": "127.0.0.1",
            "db_user": "root",
            "db_pass": "test",
            "db_name": "ppmessage"
        },
        
        "psql": {
            "db_host": "127.0.0.1",
            "db_user": "root",
            "db_pass": "test",
            "db_name": "ppmessage"
        }
    }
}
