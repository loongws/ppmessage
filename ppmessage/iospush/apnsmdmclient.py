# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from ppmessage.db.models import APNSSetting
from ppmessage.core.constant import INVALID_IOS_TOKEN

from apnsclient import *
import tornado.ioloop
import tornado.options

import base64
import logging
import datetime
import traceback
import os

class APNSMDMClient():
    """
    every object is indexed by app_uuid
    """
    
    def __init__(self, _app, _name, _dev):
        self.application = _app
        self.app_uuid = _name

        self.apns_settings = None
        self.apns_cert_string = None

        self.apns_session = None
        self.apns_connection = None
        self.apns_service = None

        self.apns_updatetime = 0
        self.apns_alivedelta = datetime.timedelta(minutes=5)
        #self.apns_invalid_token = set()
        #self.application.redis.delete(INVALID_IOS_TOKEN)

        self.apns_push_server = None
        self.apns_feedback_server = None
        self.apns_cert_string = None

        self.is_dev = _dev
        
    def _load_settings(self):
        """
        reload apns settings
        """
        _pattern = APNSSetting.__tablename__ + ".app_uuid." + self.app_uuid
        _apns_uuid = self.application.redis.get(_pattern)
        if _apns_uuid == None:
            return None

        _key = APNSSetting.__tablename__ + ".uuid." + _apns_uuid
        _setting = self.application.redis.hgetall(_key)
        return _setting

    def _load_cert(self, _settings):        
        if self.is_dev == True:
            self.apns_cert_string = base64.b64decode(_settings.get("development_pem"))
            self.apns_push_server = "push_sandbox"
            self.apns_feedback_server = "feedback_sandbox"
        else:
            self.apns_cert_string = base64.b64decode(_settings.get("production_pem"))
            self.apns_push_server = "push_production"
            self.apns_feedback_server = "feedback_production"
        return

    def check_cert(self):
        _settings = self._load_settings()
        
        if _settings == None:
            logging.error("No setting loaded.")
            return None

        self.apns_settings = _settings
        self._load_cert(_settings)
        return _settings
                
    def _get_apns_service(self):                    
        if self.apns_session == None:
            self.apns_session = Session()
        
        #if self.apns_session != None:
        #    self.apns_invalid_token.update(self.application.redis.smembers(INVALID_IOS_TOKEN))

        self.apns_connection = self.apns_session.get_connection(self.apns_push_server, cert_string=self.apns_cert_string)
        self.apns_service = APNs(self.apns_connection)

        return self.apns_service
        
    def feedback(self):
        self._load_cert()
        logging.info("feedback checking...")
        _con = Session().new_connection(self.apns_feedback_server, cert_string=self.apns_cert_string)
        _srv = APNs(_con)
        #_key = INVALID_IOS_TOKEN
        try:
            for token, when in _srv.feedback():
                logging.info("feedback get invalid token: %s" % (token))
                #self.application.redis.sadd(_key, token)
        except:
            logging.error("feedback connection failed.")
        return
        
    def close(self):
        if self.apns_session is not None:
            self.apns_session.shutdown()
        self.apns_session = None
        self.apns_connection = None
        self.apns_service = None
        return

    def publish_one(self, _message):
        response = None

        if not self._get_apns_service():
            return

        #_state = _message.__getstate__()
        #for _i in self.apns_invalid_token:
        #    if _i in _state["tokens"]:
        #        _state["tokens"].remove(_i)
        
        logging.info("sending: " + str(_message.tokens))
        _message = Message(**_state)
        try:
            response = self.apns_service.send(_message)
            self.apns_session.outdate(self.apns_alivedelta)
        except:
            traceback.print_exc()
            self.close()
            error_string = "exception ios message: {0}."
            logging.error(error_string.format(str(_message)))
            return None

        # it occurs when certificate doesn't match the push server.
        if response is None:
            error_string = "response is None for ios message: {0}."
            logging.error(error_string.format(str(_message)))
            return None
            
        # Check failures not related to devices.
        for code, errmsg in response.errors:
            logging.error("Error: {0}, code: {1} ".format(errmsg, code))
            return None
            
        # Check if there are tokens that can be retried
        if response.needs_retry():
            error_string = "Error ios message: {0} needs retry."
            logging.error(error_string.format(str(_message)))
            # repeat with retry_message or reschedule your task
            retry_message = response.retry()
            tornado.ioloop.IOLoop.instance().add_callback(self.publish_one, retry_message)
            
        # Check failures. Check codes in APNs reference docs.
        for token, reason in response.failed.items():
            code, errmsg = reason
            error_string = "Device failed: {0}, reason: {1}, code: {2}."
            logging.error(error_string.format(token, errmsg, code))
            #self.application.redis.sadd(INVALID_IOS_TOKEN, token)
            #self.apns_invalid_token.add(token)
            
        #info_string = "APNS failed: {0}, invalid: {1}."
        #logging.info(info_string.format(str(response.failed), str(self.apns_invalid_token)))
        #return self.apns_invalid_token
        return


def get_apns(app, name):
    if app.apns.get(name) is None:
        app.apns[name] = {}
        app.apns[name]["dev"] = APNSMDMClient(app, name, True)
        app.apns[name]["dev"].check_cert()
        app.apns[name]["pro"] = APNSMDMClient(app, name, False)
        app.apns[name]["pro"].check_cert()
    return app.apns.get(name)

