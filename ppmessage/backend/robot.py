# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 YVertical.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/robot.py 
# The entry form robot service
#

from ppmessage.db.models import AppInfo
from ppmessage.robot.getweb import getWeb
from ppmessage.core.constant import ROBOT_PORT

from tornado.web import Application
import tornado.httpserver
import tornado.options
import tornado.ioloop

import logging
import sys

tornado.options.define("port", default=ROBOT_PORT, help="", type=int)  

class RobotApp(Application):
    """
    callback will run when loop check
    """
    def __init__(self, *args, **kwargs):
        super(RobotApp, self).__init__(*args, **kwargs)

        # every app_uuid get its svm, vector, target (label->string).
        self.svm = {}
        self.vector = {}
        # target string array
        self.target = {}

        _key = AppInfo.__tablename__ + ".uuid." + self._app_uuid
        _robot_uuid = self.redis.hget(_key, "robot_user_uuid")
        if _robot_uuid == None:
            logging.error("no robot user uuid")
            sys.exit()
            
        self.robot_user_uuid = _robot_uuid

        self.robot_key = REDIS_ROBOT_KEY
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        self.predict_answer_handler = PredictAnswerHandler(self)
        self.predict_user_handler = PredictUserHandler(self)
        self.fit_handler = FitHandler(self)
        
        settings = {}
        settings["debug"] = True
        handlers = []
        Application.__init__(self, handlers, **settings)

        return

    def fit_task():
        return

    def predict_task():
        return

if __name__ == "__main__":
    tornado.options.parse_command_line()
    _app = RobotApp()
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)
    logging.info("Starting robot service......%d" % tornado.options.options.port)
    tornado.ioloop.PeriodicCallback(_app.fit_task, 1000).start()
    tornado.ioloop.PeriodicCallback(_app.predict_task, 100).start()
    tornado.ioloop.IOLoop.instance().start()
    
