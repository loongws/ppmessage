# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# db/sqlnone.py
#

from ppmessage.core.constant import SQL

from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session

class SqlNone(object):

    def __init__(self):
        self.dbengine = None
        self.dbsession_class = None
        return

    def name(self):
        return SQL.NONE
        
    def createEngine(self):                
        return self.dbengine

    def getSessionClass(self):
        return scoped_session(sessionmaker(bind=self.dbengine))
    
