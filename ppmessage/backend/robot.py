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

import tornado.web
import tornado.httpserver
import tornado.options
import tornado.ioloop

import sys
import logging

@singleton
class RobotDelegate():
    def __init__(self, app):
        self.redis = app.redis
        
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
        self.predict_answer_handler = PredictAnswerHandler(self)
        self.predict_user_handler = PredictUserHandler(self)
        self.fit_handler = FitHandler(self)

        return

    def fit_task():
        return

    def predict_task():
        return
    
    def run_periodic(self):
        tornado.ioloop.PeriodicCallback(self.fit_task, 1000).start()
        tornado.ioloop.PeriodicCallback(self.predict_task, 100).start()
        return
    
class RobotWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.ROBOT

    @classmethod
    def get_handlers(cls):
        return []

    @classmethod
    def get_delegate(cls, app):
        return RobotDelegate(app)
    

class RobotApp(tornado.web.Application):
    """
    callback will run when loop check
    """
    def __init__(self, *args, **kwargs):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        super(RobotApp, self).__init__(*args, **kwargs)
        
        settings = {}
        settings["debug"] = True
        handlers = []
        Application.__init__(self, handlers, **settings)

        return

    def get_delegate(self, name):
        return RobotDelegate(self)

if __name__ == "__main__":
    tornado.options.parse_command_line()
    _app = RobotApp()
    _app.get_delegate("").run_periodic()
    logging.info("Starting robot service......")
    tornado.ioloop.IOLoop.instance().start()
    
