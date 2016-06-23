# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
# cor/utils/restart.py
#
# touch a file and let tornado restart it
#

import os
import logging
import subprocess

def restart(_name):
    _path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../backend/" + _name)
    _cmd = "touch " + _path
    logging.info("restarting with %s" % _cmd)
    subprocess.check_output(_cmd, shell=True)
