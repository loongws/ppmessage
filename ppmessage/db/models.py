# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights are reserved
#

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import TASK_STATUS
from ppmessage.core.constant import MESSAGE_STATUS
from ppmessage.core.constant import MESSAGE_SUBTYPE
from ppmessage.core.constant import CONVERSATION_STATUS
from ppmessage.core.constant import SERVICE_USER_STATUS
from ppmessage.core.constant import GROUP_ALGORITHM

from ppmessage.core.redis import row_to_redis_hash
from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.imageconverter import ImageConverter

from .dbinstance import BaseModel
from .commonmixin import CommonMixin
from .dbinstance import getDBSessionClass

from sqlalchemy import Float
from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import LargeBinary

from sqlalchemy import Index

import datetime
import time
import uuid
import json
import traceback
import hashlib
import logging
import os


class DeviceUser(CommonMixin, BaseModel):
    __tablename__ = "device_users"
    
    user_name = Column("user_name", String(32))
    user_password = Column("user_password", String(256))
    user_email = Column("user_email", String(64))
    user_status = Column("user_status", String(64))
    user_firstname = Column("user_firstname", String(64))
    user_lastname = Column("user_lastname", String(64))
    user_fullname = Column("user_fullname", String(64))
    user_icon = Column("user_icon", String(512))
    user_mobile = Column("user_mobile", String(32))
    user_qq = Column("user_qq", String(64))
    user_wechat = Column("user_wechat", String(64))
    user_signature = Column("user_signature", String(128))
    
    # user_defined a json string includes [{n:xxx, v:xxx}, {n:xxx, v:xxx}]
    user_defined = Column("user_defined", String(512))
    
    # only one mobile and browser device
    mobile_device_uuid = Column("mobile_device_uuid", String(64))
    browser_device_uuid = Column("browser_device_uuid", String(64))
    ppcom_mobile_device_uuid = Column("ppcom_mobile_device_uuid", String(64))
    ppcom_browser_device_uuid = Column("ppcom_browser_device_uuid", String(64))
    
    # zh_cn/en_us/zh_tw
    user_language = Column("user_language", String(32))
    
    # push but no sound
    user_silence_notification = Column("user_silence_notification", Boolean)

    # push with badge on app icon
    user_show_badge = Column("user_show_badge", Boolean)

    # not push to device, this is global set, highest priority
    # for special notification of coversation, should set in conversation user data
    user_mute_notification = Column("user_mute_notification", Boolean)
    
    # if user user pc, let the device mute notification but if open ws still work
    user_mute_other_mobile_device = Column("user_mute_other_mobile_device", Boolean)
    
    user_company = Column("user_company", String(64))

    is_email_verified = Column("is_email_verified", Boolean)
    is_mobile_verified = Column("is_mobile_verified", Boolean)

    # create_status for user creatation,
    # USER_OWNER_0 -> already signup from PORTAL
    # USER_OWNER_1 -> already pick up a team name
    # USER_OWNER_2 -> already promote the gift
    # USER_OWNER_3 -> already how to get support
    # USER_SERVICE -> create by the owner of app
    
    create_status = Column("create_status", String(16))

    # service_user_status for service user
    # READY -> ready to allocate message to me
    # BUSY -> busy not allocate message to me
    # REST -> rest not allocate message to me
    
    service_user_status = Column("service_user_status", String(16))
    
    # ppcom portal user
    is_anonymous_user = Column("is_anonymous_user", Boolean)

    # ppcom trace id with web cookie
    ppcom_trace_uuid = Column("ppcom_trace_uuid", String(64))

    # lastest_send_message_time for idle algorithm
    latest_send_message_time = Column("latest_send_message_time", DateTime)

    geolite_latitude = Column("geolite_latitude", Float)
    geolite_longitude = Column("geolite_longitude", Float)

    # which is uuid of other/third party system
    ent_user_uuid = Column("ent_user_uuid", String(64))
    
    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(DeviceUser, self).__init__(*args, **kwargs)
        return
        
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)

        _key = self.__tablename__ + ".user_email." + self.user_email
        _redis.set(_key, self.uuid)
        
        if self.is_anonymous_user:
            _key = DeviceUser.__tablename__ + ".ppcom_trace_uuid." + self.ppcom_trace_uuid
            _redis.set(_key, self.uuid)

        _key = self.__tablename__ + ".statistics.all"
        _redis.incr(_key)

        if self.user_fullname != None:
            self.add_redis_search_index(_redis, self.__tablename__, self.user_fullname, self.uuid)
        
        return

    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, DeviceUser, self.uuid)
        if _obj == None:
            return

        _key = self.__tablename__ + ".user_email." + _obj["user_email"]
        _redis.delete(_key)

        if _obj["ppcom_trace_uuid"] != None:
            _key = self.__tablename__ + ".ppcom_trace_uuid." + _obj["ppcom_trace_uuid"]
            _redis.delete(_key)

        _key = self.__tablename__ + ".statistics.all"
        _redis.decr(_key)

        if _obj["user_fullname"] != None:
            self.remove_redis_search_index(_redis, self.__tablename__, _obj["user_fullname"], self.uuid)
        
        CommonMixin.delete_redis_keys(self, _redis)
        return    

    def update_redis_keys(self, _redis):
        if self.user_fullname != None and len(self.user_fullname) != 0:
            self.add_redis_search_index(_redis, self.__tablename__, self.user_fullname, self.uuid)
            
            _key = self.__tablename__ + ".uuid." + self.uuid
            _old = _redis.hget(_key, "user_fullname")
            if _old != None and len(_old) != 0 and _old != self.user_fullname:
                self.remove_redis_search_index(_redis, self.__tablename__, _old, self.uuid)

        CommonMixin.update_redis_keys(self, _redis)
        _obj = redis_hash_to_dict(_redis, DeviceUser, self.uuid)
        if _obj == None:
            return

        if _obj["ppcom_trace_uuid"] != None:
            _key = self.__tablename__ + ".ppcom_trace_uuid." + _obj["ppcom_trace_uuid"]
            _redis.set(_key, _obj["uuid"])

        return

class UserOnlineStatusLog(CommonMixin, BaseModel):
    __tablename__ = "user_online_status_logs"
    app_uuid = Column("app_uuid", String(64))
    user_uuid = Column("user_uuid", String(64))
    device_uuid = Column("device_uuid", String(64))
    online_status = Column("online_status", String(32))
    status_data = Column("status_data", String(16))
    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(UserOnlineStatusLog, self).__init__(*args, **kwargs)
        return

    
class DeviceInfo(CommonMixin, BaseModel):
    __tablename__ = "device_infos"

    app_uuid = Column("app_uuid", String(64))
    
    # after allocation
    user_uuid = Column("user_uuid", String(64))
    
    # generated by terminal
    terminal_uuid = Column("terminal_uuid", String(64))

    # after update
    device_fullname = Column("device_fullname", String(256))
    # ios/android/windowsphone/windows/macosx upper letter
    device_phonenumber = Column("device_phonenumber", String(32))

    device_ostype = Column("device_ostype", String(32))
    device_osversion = Column("device_osversion", String(32))

    device_android_apilevel = Column("device_android_apilevel", String(32))
    device_android_gcmtoken = Column("device_android_gcmtoken", String(64))
    device_android_gcmpush = Column("device_android_gcmpush", Boolean)

    device_ios_model = Column("device_ios_model", String(32))
    device_ios_token = Column("device_ios_token", String(64))

    # online ppkefu
    api_session_uuid = Column("api_session_uuid", String(64))

    # online for ppcom and ppkefu
    device_is_online = Column("device_is_online", Boolean)

    # accelerate the online devices of portal users
    is_ppcom_device = Column("is_ppcom_device", Boolean)

    # is_development
    is_development = Column("is_development", Boolean)
    
    __table_args__ = ()

    def __init__(self, *args, **kwargs):
        super(DeviceInfo, self).__init__(*args, **kwargs)
        return
        
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        _key = self.__tablename__ + ".terminal_uuid." + self.terminal_uuid
        _redis.set(_key, self.uuid)

        if self.app_uuid != None:
            _key_0 = self.__tablename__ + ".app_uuid." + self.app_uuid + \
                     ".is_ppcom_device." + str(self.is_ppcom_device) + \
                     ".device_is_online." + str(self.device_is_online)
            _key_1 = self.__tablename__ + ".app_uuid." + self.app_uuid + \
                     ".is_ppcom_device." + str(self.is_ppcom_device) + \
                     ".device_is_online." + str(not self.device_is_online)
        
            _updatetime = time.mktime(self.updatetime.timetuple())*1000*1000 + self.updatetime.microsecond
            _v = json.dumps([self.user_uuid, self.uuid])
            _redis.zadd(_key_0, _v, _updatetime)
            _redis.zrem(_key_1, _v)
        return

    def update_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.update_redis_keys(self, _redis, *args, **kwargs)
        _obj = redis_hash_to_dict(_redis, DeviceInfo, self.uuid)
        if _obj == None:
            return

        if self.app_uuid != None:
            _key_0 = self.__tablename__ + ".app_uuid." + self.app_uuid + \
                     ".is_ppcom_device." + str(_obj["is_ppcom_device"]) + \
                     ".device_is_online." + str(_obj["device_is_online"])
            _key_1 = self.__tablename__ + ".app_uuid." + self.app_uuid + \
                     ".is_ppcom_device." + str(_obj["is_ppcom_device"]) + \
                     ".device_is_online." + str(not _obj["device_is_online"])
        
            _updatetime = time.mktime(self.updatetime.timetuple())*1000*1000 + self.updatetime.microsecond
            _v = json.dumps([_obj["user_uuid"], self.uuid])
            _redis.zadd(_key_0, _v, _updatetime)
            _redis.zrem(_key_1, _v)
        return
    
    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, DeviceInfo, self.uuid)
        if _obj == None:
            return
        _key = self.__tablename__ + ".terminal_uuid." + _obj["terminal_uuid"]
        _redis.delete(_key)

        if _obj["app_uuid"] != None:
            _key_0 = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + \
                     ".is_ppcom_device." + str(_obj["is_ppcom_device"]) + \
                     ".device_is_online." + str(_obj["device_is_online"])
            _v = json.dumps([_obj["user_uuid"], self.uuid])
            _redis.zrem(_key_0, _v)
        
        CommonMixin.delete_redis_keys(self, _redis)
        return
        
class MessagePushTask(CommonMixin, BaseModel):

    __tablename__ = "message_push_tasks"

    app_uuid = Column("app_uuid", String(64))
    
    conversation_uuid = Column("conversation_uuid", String(64))
    # P2S/S2P/S2S since conversationinfo no S2P
    conversation_type = Column("conversation_type", String(8))
    
    # message from
    from_uuid = Column("from_uuid", String(64))
    # admin_user/device_user/app_group
    from_type = Column("from_type", String(32))

    from_device_uuid = Column("from_device_uuid", String(64))
    to_device_uuid = Column("to_device_uuid", String(64))

    # message to
    to_uuid = Column("to_uuid", String(64))
    # app/org_group/device_user
    to_type = Column("to_type", String(32))
        
    # type NOTIFICATION/APP..., subtype text/card/image/audio/video
    message_type = Column("message_type", String(32))
    message_subtype = Column("message_subtype", String(32))

    # message body and title could be search
    # if text message body less than 128 bytes, the subtype is text
    # else the subtype is txt
    # store it in body otherwise body is a file uuid
    body = Column("body", String(256))
    title = Column("title", String(256))

    # message dump generated after sending to push server
    message_body = Column("message_body", String(512))

    # message push procedure
    task_status = Column("task_status", String(32))

    is_development = Column("is_development", Boolean)
    
    __table_args__ = (
        Index(
            "_idx_message_pushtask",
            "task_status",
        ),
    )

    def __init__(self, *args, **kwargs):
        super(MessagePushTask, self).__init__(*args, **kwargs)
        return
        
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        if self.from_uuid != None:
            _key = self.__tablename__ + ".today_message_load." + ".from_uuid." + self.from_uuid
            _redis.incr(_key)
            
            if self.to_uuid != None:
                _key = self.__tablename__ + ".today_customer_load." + ".from_uuid." + self.from_uuid
                _redis.sadd(_key, self.to_uuid)
            
        if self.conversation_uuid != None:
            _key = self.__tablename__ + ".conversation_uuid." + self.conversation_uuid
            _createtime = time.mktime(self.createtime.timetuple())*1000*1000 + self.createtime.microsecond
            _redis.zadd(_key, self.uuid, _createtime)

        if self.app_uuid != None:
            # by hour
            _key = self.__tablename__ + ".app_uuid." + self.app_uuid + \
                   ".day." + self.createtime.strftime("%Y-%m-%d") + ".hour." + str(self.createtime.hour)
            _redis.incr(_key)
            # by day
            _key = self.__tablename__ + ".app_uuid." + self.app_uuid + \
                   ".day." + self.createtime.strftime("%Y-%m-%d")
            _redis.incr(_key)
            # all messages
            _key = self.__tablename__ + ".app_uuid." + self.app_uuid
            _redis.incr(_key)

            
        return
    
    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, MessagePushTask, self.uuid)
        if _obj == None:
            return

        if _obj.get("conversation_uuid") != None:
            _key = self.__tablename__ + ".conversation_uuid." + _obj["conversation_uuid"]
            _redis.zrem(_key, self.uuid)

        CommonMixin.delete_redis_keys(self, _redis)
        return
    
class MessagePush(CommonMixin, BaseModel):
    __tablename__ = "message_pushs"
    app_uuid = Column("app_uuid", String(64))
    task_uuid = Column("task_uuid", String(64))
    user_uuid = Column("user_uuid", String(64))
    device_uuid = Column("device_uuid", String(64))
    status = Column("status", String(32))

    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(MessagePush, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        # ACKED PUSH NOT CACHED ANY LONGER
        if self.status == MESSAGE_STATUS.ACKED:
            #self.delete_redis_keys(_redis)
            return
        
        if self.task_uuid == None or self.app_uuid == None or \
           self.user_uuid == None or self.device_uuid == None:
            return

        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        # badge number and unacked messages
        _key = self.__tablename__ + ".app_uuid." + self.app_uuid + \
               ".user_uuid." + self.user_uuid + ".device_uuid." + self.device_uuid
        if self.updatetime != None:
            _updatetime = time.mktime(self.updatetime.timetuple())*1000*1000 + self.updatetime.microsecond
            _v = json.dumps([self.task_uuid, self.uuid])
            _redis.zadd(_key, _v, _updatetime)

        return

    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, MessagePush, self.uuid)
        if _obj == None or _obj["task_uuid"] == None or _obj["app_uuid"] == None or \
           _obj["user_uuid"] == None or _obj["device_uuid"] == None:
            return

        _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + \
               ".user_uuid." + _obj["user_uuid"] + ".device_uuid." + _obj["device_uuid"]
        _v = json.dumps([_obj["task_uuid"], self.uuid])
        _redis.zrem(_key, _v)
        
        CommonMixin.delete_redis_keys(self, _redis)
        return

class UserContactData(CommonMixin, BaseModel):
    __tablename__ = "user_contact_datas"
    user_uuid = Column("user_uuid", String(64))
    contact_uuid = Column("contact_uuid", String(64))
    
    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(UserContactData, self).__init__(*args, **kwargs)
        return
        
class OrgGroup(CommonMixin, BaseModel):
    __tablename__ = "org_groups"

    app_uuid = Column("app_uuid", String(64))
    
    parent_group_uuid = Column("parent_group_uuid", String(64))
    
    group_name = Column("group_name", String(64))
    group_desc = Column("group_desc", String(128))
    group_icon = Column("group_icon", String(512))
    
    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(OrgGroup, self).__init__(*args, **kwargs)
        return

    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        _key = self.__tablename__ + ".app_uuid." + self.app_uuid
        _redis.sadd(_key, self.uuid)

        _key = self.__tablename__ + ".app_uuid." + self.app_uuid + ".sorted"
        _redis.zadd(_key, self.group_name + ":" + self.uuid, 0)

        self.add_redis_search_index(_redis, self.__tablename__, self.group_name, self.uuid)        
        return

    def update_redis_keys(self, _redis):

        if self.group_name != None and len(self.group_name):
            self.add_redis_search_index(_redis, self.__tablename__, self.group_name, self.uuid)
            
            _key = self.__tablename__ + ".uuid." + self.uuid
            _old = _redis.hget(_key, "group_name")
            _app_uuid = _redis.hget(_key, "app_uuid")

            _key_n = self.__tablename__ + ".app_uuid." + _app_uuid + ".sorted"
            _redis.zadd(_key_n, self.group_name + ":" + self.uuid)
            
            if _old != None and len(_old) != 0 and _old != self.group_name:
                self.remove_redis_search_index(_redis, self.__tablename__, _old, self.uuid)
                _redis.zrem(_key_n, self.group_name + ":" + self.uuid)

        CommonMixin.update_redis_keys(self, _redis)
        return
    
    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, OrgGroup, self.uuid)
        if _obj == None or _obj["app_uuid"] == None or _obj["group_name"] == None:
            return

        _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"]
        _redis.srem(_key, _obj["uuid"])

        _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + ".sorted"
        _redis.zrem(_key, _obj["group_name"] + ":" + _obj["uuid"])
        
        self.remove_redis_search_index(_redis, self.__tablename__, _obj["group_name"], _obj["uuid"])

        CommonMixin.delete_redis_keys(self, _redis)
        return

class OrgGroupUserData(CommonMixin, BaseModel):

    __tablename__ = "org_group_user_datas"

    group_uuid = Column("group_uuid", String(64))
    user_uuid = Column("user_uuid", String(64))

    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(OrgGroupUserData, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)

        _pi = _redis.pipeline()

        _key = self.__tablename__ + ".group_uuid." + self.group_uuid
        _pi.sadd(_key, self.user_uuid)

        _key = self.__tablename__ + ".user_uuid." + self.user_uuid
        _pi.sadd(_key, self.group_uuid)

        _key = self.__tablename__ + ".group_uuid." + self.group_uuid + \
               ".user_uuid." + self.user_uuid
        _pi.set(_key, self.uuid)
        
        _pi.execute()
        return

    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, OrgGroupUserData, self.uuid)
        if _obj == None or _obj["group_uuid"] == None or _obj["user_uuid"] == None:
            return

        _pi = _redis.pipeline()
        _key = self.__tablename__ + ".group_uuid." + _obj["group_uuid"] 
        _pi.srem(_key, _obj["user_uuid"])
        
        _key = self.__tablename__ + ".user_uuid." + _obj["user_uuid"] 
        _pi.srem(_key)

        _key = self.__tablename__ + ".group_uuid." + _obj["group_uuid"] + \
               ".user_uuid." + _obj["user_uuid"]
        _pi.delete(_key)
        _pi.execute()
        
        CommonMixin.delete_redis_keys(self, _redis)
        return

class OrgGroupSubGroupData(CommonMixin, BaseModel):
    __tablename__ = "org_group_sub_group_datas"

    group_uuid = Column("group_uuid", String(64))
    sub_group_uuid = Column("sub_group_uuid", String(64))

    __table_args__ = ()

    def __init__(self, *args, **kwargs):
        super(OrgGroupSubGroupData, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)

        _pi = _redis.pipeline()
        _key = self.__tablename__ + ".group_uuid." + self.group_uuid
        _pi.sadd(_key, self.sub_group_uuid)
        _pi.execute()
        
        return

    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, OrgGroupUserData, self.uuid)
        if _obj == None or _obj["group_uuid"] == None or _obj["sub_group_uuid"] == None:
            return

        _pi = _redis.pipeline()
        _key = self.__tablename__ + ".group_uuid." + _obj["group_uuid"] 
        _pi.srem(_key, _obj["sub_group_uuid"])        
        _pi.execute()
        
        CommonMixin.delete_redis_keys(self, _redis)
        return

class MaterialRefInfo(CommonMixin, BaseModel):
    """
    this object will be created when message is acked
    when the message with material info
    image/file/card etc (not including the AUDIO)
    """
    
    __tablename__ = "material_ref_infos"

    # the user is the owner
    user_uuid = Column("user_uuid", String(64))

    # application/x-yv-file means file info
    # application/x-yv-icon
    # application/x-yv-evernote
    # application/x-yv-material-image
    # application/x-yv-material-audio
    # application/x-yv-material-video
    # application/x-yv-material-document ? word/excel/ppt/pdf/etc.
    # application/x-yv-material-archive ? zip/rar/tar/gz/7z
    # application/x-yv-material-card ~ html

    material_type = Column("material_type", String(64))

    # based on material_type find the uuid in related table
    material_uuid = Column("material_uuid", String(64))

    # is file visible , [visible:1, not visible or deleted:0]
    visible = Column("visible", Integer, default=1)
    
    def __init__(self, *args, **kwargs):
        super(MaterialRefInfo, self).__init__(*args, **kwargs)
        return

    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        _key = self.__tablename__ + \
               ".user_uuid." + self.user_uuid + \
               ".material_uuid." + self.material_uuid
        _redis.set(_key, self.uuid)
        return

    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, MaterialRefInfo, self.uuid)
        if _obj == None:
            return
        _key = self.__tablename__ + \
               ".user_uuid." + _obj["user_uuid"] + \
               ".material_uuid." + _obj["material_uuid"]
        _redis.delete(_key)
        CommonMixin.delete_redis_keys(self, _redis)
        return

class FileInfo(CommonMixin, BaseModel):
    __tablename__ = "file_infos"

    # the user is the owner
    user_uuid = Column("user_uuid", String(64))

    # application/x-yv-icon
    # application/x-yv-material-image
    # application/x-yv-material-image-thumbnail
    # application/x-yv-material-audio
    # application/x-yv-material-video
    # application/x-yv-material-document ? word/excel/ppt/pdf/etc.
    # application/x-yv-material-archive ? zip/rar/tar/gz/7z
    # application/x-yv-material-card ~ html

    material_type = Column("material_type", String(64))
    
    # original name if provided
    file_name = Column("file_name", String(128))
    file_size = Column("file_size", Integer)
    file_hash = Column("file_hash", String(64))
    file_mime = Column("file_mime", String(128))

    # absolute path
    file_path = Column("file_path", String(256))

    # the file is only a link which referencing other file
    file_ref = Column("file_ref", String(64))

    thumbnail_uuid = Column("thumbnail_uuid", String(64))

    def __init__(self, *args, **kwargs):
        super(FileInfo, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        _key = self.__tablename__ + ".file_hash." + self.file_hash
        _redis.set(_key, self.uuid)
        return

    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, FileInfo, self.uuid)
        if _obj == None:
            return
        _key = self.__tablename__ + ".file_hash." + _obj["file_hash"]
        _redis.delete(_key)
        CommonMixin.delete_redis_keys(self, _redis)
        return
    
class VideoMaterialInfo(CommonMixin, BaseModel):
    __tablename__ = "video_material_infos"
    video_file_uuid = Column("video_file_uuid", String(64))
    cover_file_uuid = Column("cover_file_uuid", String(64))
    cover_thumbnail_file_uuid = Column("cover_thumbnail_file_uuid", String(64))

    duration = Column("duration", Integer)
    inspired_times = Column("inspired_times", Integer)
    viewed_times = Column("viewed_times", Integer)

    user_uuid = Column("user_uuid", String(64))
    
    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(VideoMaterialInfo, self).__init__(*args, **kwargs)
        return
        
class SingleCardMaterialInfo(CommonMixin, BaseModel):
    __tablename__ = "single_card_material_infos"

    content_file_uuid = Column("content_file_uuid", String(64))
    cover_file_uuid = Column("cover_file_uuid", String(64))

    cover_thumbnail_file_uuid = Column("cover_thumbnail_file_uuid", String(64))
    
    title=Column("title", String(256))
    abstract=Column("abstract", String(256))
    
    external_url=Column("external_url", String(256))
        
    inspired_times = Column("inspired_times", Integer)
    viewed_times = Column("viewed_times", Integer)

    user_uuid = Column("user_uuid", String(64))

    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(SingleCardMaterialInfo, self).__init__(*args, **kwargs)
        return

class MultipleCardMaterialInfo(CommonMixin, BaseModel):
    """
    body format is json
    [
    message_card_info_uuid,
    message_card_info_uuid
    ]
    """
    
    __tablename__ = "multiple_card_material_infos"
    
    body = Column("body", String(512))
    user_uuid = Column("user_uuid", String(64))
    
    def __init__(self, *args, **kwargs):
        super(MultipleCardMaterialInfo, self).__init__(*args, **kwargs)
        return

class AppInfo(CommonMixin, BaseModel):
    __tablename__ = "app_infos"

    # which api create it
    api_uuid = Column("api_uuid", String(64))
    
    # who create it
    user_uuid = Column("user_uuid", String(64))
    
    app_key = Column("app_key", String(64))
    app_secret = Column("app_secret", String(64))
    
    app_name = Column("app_name", String(64))
    app_icon = Column("app_icon", String(512))

    app_route_policy = Column("app_route_policy", String(64))
    
    company_name = Column("company_name", String(64))
    
    app_billing_email = Column("app_billing_email", String(64))
    app_billing_uuid = Column("app_billing_uuid", String(64))

    return_offline_message = Column("return_offline_message", Boolean)
    offline_message = Column("offline_message", String(512))
    welcome_message = Column("welcome_message", String(512))

    # ALWAYS/ONCE/NEVER
    show_ppcom_hover = Column("show_ppcom_hover", String(16))
    ppcom_launcher_color = Column("ppcom_launcher_color", String(16))

    # DEFAULT/FLAT/MATERIAL/ANIMATE
    ppcom_launcher_style = Column("ppcom_launcher_style", String(16))

    # DEFAULT is `Powered by PPMESSAGE` and link
    ppcom_powered_by_name = Column("ppcom_powered_by_name", String(64))
    ppcom_powered_by_link = Column("ppcom_powered_by_link", String(128))
    ppcom_powered_by_visible = Column("ppcom_powered_by_visible", Boolean)

    robot_train_chat = Column("robot_train_chat", Boolean)
    robot_train_track = Column("robot_train_track", Boolean)
    robot_train_click = Column("robot_train_click", Boolean)

    robot_train_method = Column("robot_train_method", String(32))

    robot_user_uuid = Column("robot_user_uuid", String(64))

    enable_apns_push = Column("enable_apns_push", Boolean)
    enable_mqtt_push = Column("enable_mqtt_push", Boolean)
    enable_gcm_push = Column("enable_gcm_push", Boolean)

    gcm_api_key = Column("gcm_api_key", String(128))
    apns_combination_pem_data = Column("apns_combination_pem_data", LargeBinary)
    apns_combination_pem_password = Column("apns_combination_pem_password", String(32))
    
    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(AppInfo, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)

        _key = self.__tablename__
        _redis.sadd(_key, self.uuid)
        
        _key = self.__tablename__ + ".app_key." + self.app_key
        _redis.set(_key, self.uuid)

        if self.user_uuid != None:
            _key = self.__tablename__ + ".user_uuid." + self.user_uuid
            _redis.set(_key, self.uuid)

        if self.api_uuid != None:
            _key = self.__tablename__ + ".api_uuid." + self.api_uuid
            _redis.sadd(_key, self.uuid)

        return
    
    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, AppInfo, self.uuid)
        if _obj == None:
            return

        _key = self.__tablename__
        _redis.srem(_key, self.uuid)
        
        _key = self.__tablename__ + ".app_key." + _obj["app_key"]
        _redis.delete(_key)

        if self.user_uuid != None:
            _key = self.__tablename__ + ".user_uuid." + _obj["user_uuid"]
            _redis.delete(_key)

        if self.api_uuid != None:
            _key = self.__tablename__ + ".api_uuid." + _obj["api_uuid"]
            _redis.delete(_key)

        CommonMixin.delete_redis_keys(self, _redis)
        return

        
class AppUserData(CommonMixin, BaseModel):
    __tablename__ = "app_user_datas"

    uuid = Column("uuid", String(64), primary_key=True)
    
    app_uuid = Column("app_uuid", String(64))
    user_uuid = Column("user_uuid", String(64))
    user_fullname = Column("user_fullname", String(64))

    is_portal_user = Column("is_portal_user", Boolean)
    is_service_user = Column("is_service_user", Boolean)
    is_owner_user = Column("is_owner_user", Boolean)

    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(AppUserData, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        _key = self.__tablename__ + \
               ".app_uuid." + self.app_uuid + \
               ".user_uuid." + self.user_uuid + \
               ".is_service_user." + str(self.is_service_user)
        _redis.set(_key, self.uuid)

        _key = self.__tablename__ + \
               ".app_uuid." + self.app_uuid + \
               ".user_uuid." + self.user_uuid
        _d = {
            "is_owner_user": self.is_owner_user,
            "is_service_user": self.is_service_user,
        }
        _redis.set(_key, json.dumps(_d))

        _key = self.__tablename__ + \
               ".user_uuid." + self.user_uuid + \
               ".is_service_user." + str(self.is_service_user)
        _redis.set(_key, self.app_uuid)
        
        _key = self.__tablename__ + \
               ".app_uuid." + self.app_uuid + \
               ".is_service_user." + str(self.is_service_user)
        _redis.sadd(_key, self.user_uuid)

        _key = self.__tablename__ + \
               ".app_uuid." + _obj["app_uuid"] + \
               ".is_service_user." + str(_obj["is_service_user"]) + ".sorted"
        _redis.zadd(_key, _obj["user_fullname"] + ":" + _obj["user_uuid"])

        return

    def update_redis_keys(self, _redis, *args, **kwargs):
        if self.user_fullname == None:
            return

        _obj = redis_hash_to_dict(_redis, AppUserData, self.uuid)
        if self.user_fullname == _obj["user_fullname"]:
            return

        _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + \
               ".is_service_user." + str(_obj["is_service_user"]) + ".sorted"
        _redis.zrem(_key, _obj["user_fullname"] + ":" + _obj["user_uuid"])
        _redis.zadd(_key, _obj["user_fullname"] + ":" + _obj["user_uuid"])
        
        CommonMixin.update_redis_keys(self, _redis, *args, **kwargs)
        
        return
            
    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, AppUserData, self.uuid)
        if _obj == None:
            return

        _key = self.__tablename__ + \
               ".app_uuid." + _obj["app_uuid"] + \
               ".user_uuid." + _obj["user_uuid"] + \
               ".is_service_user." + str(_obj["is_service_user"])
        _redis.delete(_key)

        _key = self.__tablename__ + \
               ".app_uuid." + _obj["app_uuid"] + \
               ".user_uuid." + _obj["user_uuid"]
        _redis.delete(_key)

        _key = self.__tablename__ + \
               ".user_uuid." + _obj["user_uuid"] + \
               ".is_service_user." + str(_obj["is_service_user"])
        _redis.delete(_key)
        
        _key = self.__tablename__ + \
               ".app_uuid." + _obj["app_uuid"] + \
               ".is_service_user." + str(_obj["is_service_user"])
        _redis.srem(_key, _obj["user_uuid"])

        _key = self.__tablename__ + \
               ".app_uuid." + _obj["app_uuid"] + \
               ".is_service_user." + str(_obj["is_service_user"]) + ".sorted"
        _redis.zrem(_key, _obj["user_fullname"] + ":" + _obj["user_uuid"])

        CommonMixin.delete_redis_keys(self, _redis)
        return

# for ppkefu
class ConversationInfo(CommonMixin, BaseModel):
    __tablename__ = "conversation_infos"

    app_uuid = Column("app_uuid", String(64))
    
    # which group this conversation created for
    # for app route policy == group
    # the group is targe group
    group_uuid = Column("group_uuid", String(64))
    
    # who create this conversation
    user_uuid = Column("user_uuid", String(64))
    
    # which peer user is assigned
    # when portal user create this conversation,
    #   the assigned uuid is the service user assigned
    # when service user create this conversation,
    #   the assigned uuid is the peer service user or portal user
    assigned_uuid = Column("assigned_uuid", String(64))
    
    # OPEN/CLOSE create as OPEN, explicit to CLOSE
    status = Column("status", String(32))
    
    conversation_name = Column("conversation_name", String(64))
    conversation_icon = Column("conversation_icon", String(512))
    conversation_type = Column("conversation_type", String(8))
    
    latest_task = Column("latest_task", String(64))
    
    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(ConversationInfo, self).__init__(*args, **kwargs)
        return
        
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        _key = self.__tablename__ + \
               ".app_uuid." + self.app_uuid + \
               ".user_uuid." + self.user_uuid + \
               ".conversation_uuid." + self.uuid + \
               ".conversation_type." + self.conversation_type
        _redis.set(_key, self.uuid)

        if self.group_uuid != None:
            _key = self.__tablename__ + \
                   ".app_uuid." + self.app_uuid + \
                   ".user_uuid." + self.user_uuid + \
                   ".group_uuid." + self.group_uuid
            _redis.set(_key, self.uuid)
            
        if self.assigned_uuid != None:
            _key = self.__tablename__ + \
                   ".app_uuid." + self.app_uuid + \
                   ".user_uuid." + self.user_uuid + \
                   ".assigned_uuid." + self.assigned_uuid
            _redis.set(_key, self.uuid)
       
        return
    
    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, ConversationInfo, self.uuid)
        if _obj == None:
            return
        
        _key = self.__tablename__ + \
               ".app_uuid." + _obj["app_uuid"] + \
               ".user_uuid." + _obj["user_uuid"] + \
               ".conversation_uuid." + _obj["uuid"] + \
               ".conversation_type." + _obj["conversation_type"]
        _redis.delete(_key)

        if _obj["group_uuid"] != None:
            _key = self.__tablename__ + \
                   ".app_uuid." + _obj["app_uuid"] + \
                   ".user_uuid." + _obj["user_uuid"] + \
                   ".group_uuid." + _obj["group_uuid"]
            _redis.delete(_key)

        if _obj["assigned_uuid"] != None:
            _key = self.__tablename__ + \
                   ".app_uuid." + _obj["app_uuid"] + \
                   ".user_uuid." + _obj["user_uuid"] + \
                   ".assigned_uuid." + _obj["assigned_uuid"]
            _redis.delete(_key)

        CommonMixin.delete_redis_keys(self, _redis)
        return

    def update_redis_keys(self, _redis):
        CommonMixin.update_redis_keys(self, _redis)
        _obj = redis_hash_to_dict(_redis, ConversationInfo, self.uuid)
        if _obj == None:
            return
        if _obj["group_uuid"] != None:
            _key = self.__tablename__ + \
                   ".app_uuid." + _obj["app_uuid"] + \
                   ".user_uuid." + _obj["user_uuid"] + \
                   ".group_uuid." + _obj["group_uuid"]
            _redis.set(_key, self.uuid)
        return
    

class ConversationUserData(CommonMixin, BaseModel):
    __tablename__ = "conversation_user_datas"
    
    app_uuid = Column("app_uuid", String(64))
    user_uuid = Column("user_uuid", String(64))

    # the user in this notification but unlike the push notification
    user_mute_notification = Column("user_mute_notification", Boolean)

    # the user can define the conversation name and user name only show to himself
    conversation_name = Column("conversation_name", String(64))
    conversation_icon = Column("conversation_icon", String(512))
    conversation_type = Column("conversation_type", String(8))
    
    user_name = Column("user_name", String(64))
    
    conversation_uuid = Column("conversation_uuid", String(64))
    
    # NEW/OPEN/CLOSE
    conversation_status = Column("conversation_status", String(16))

    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(ConversationUserData, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        
        _key = self.__tablename__ + ".app_uuid." + self.app_uuid \
               + ".user_uuid." + self.user_uuid + ".conversation_uuid." + self.conversation_uuid
        _redis.set(_key, self.uuid)
        
        _key = self.__tablename__ + ".app_uuid." + self.app_uuid + ".user_uuid." + self.user_uuid
        _redis.sadd(_key, self.conversation_uuid)

        _key = self.__tablename__ + ".app_uuid." + self.app_uuid + \
               ".user_uuid." + self.user_uuid + ".conversation_status." + self.conversation_status
        if self.updatetime != None:
            _updatetime = time.mktime(self.updatetime.timetuple())*1000*1000 + self.updatetime.microsecond
            _redis.zadd(_key, self.conversation_uuid, _updatetime)

        _key = self.__tablename__ + ".app_uuid." + self.app_uuid + ".conversation_status." + self.conversation_status
        if self.updatetime != None:
            _updatetime = time.mktime(self.updatetime.timetuple())*1000*1000 + self.updatetime.microsecond
            _redis.zadd(_key, self.conversation_uuid, _updatetime)
        
        _key = self.__tablename__ + ".conversation_uuid." + self.conversation_uuid
        _redis.sadd(_key, self.user_uuid)
        _key = self.__tablename__ + ".conversation_uuid." + self.conversation_uuid + ".datas"
        _redis.sadd(_key, self.uuid)
        return

    def update_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.update_redis_keys(self, _redis, *args, **kwargs)
        _obj = redis_hash_to_dict(_redis, ConversationUserData, self.uuid)
        if _obj == None:
            return

        # REMOVE IT then ADD IT
        _statuses=[CONVERSATION_STATUS.NEW, CONVERSATION_STATUS.OPEN, CONVERSATION_STATUS.CLOSE]
        for _status in _statuses:
            _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + \
                   ".user_uuid." + _obj["user_uuid"] + ".conversation_status." + _status
            _redis.zrem(_key, _obj["conversation_uuid"])

            _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + ".conversation_status." + _status
            _redis.zrem(_key, _obj["conversation_uuid"])

        # user's conversations
        _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + \
               ".user_uuid." + _obj["user_uuid"] + ".conversation_status." + _obj["conversation_status"]
        _redis.zadd(_key, _obj["conversation_uuid"], time.time()*1000*1000)

        # app's conversations
        _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + ".conversation_status." + _obj["conversation_status"]
        _redis.zadd(_key, _obj["conversation_uuid"], time.time()*1000*1000)

        return

    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, ConversationUserData, self.uuid)
        if _obj == None:
            return
        _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] \
               + ".user_uuid." + _obj["user_uuid"] + ".conversation_uuid." + _obj["conversation_uuid"]
        _redis.delete(_key)
        
        _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + ".user_uuid." + _obj["user_uuid"]
        _redis.srem(_key, _obj["conversation_uuid"])

        _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + \
               ".user_uuid." + _obj["user_uuid"] + ".conversation_status." + _obj["conversation_status"]
        _redis.zrem(_key, _obj["conversation_uuid"])

        _key = self.__tablename__ + ".conversation_uuid." + _obj["conversation_uuid"]
        _redis.srem(_key, _obj["user_uuid"])

        _key = self.__tablename__ + ".conversation_uuid." + _obj["conversation_uuid"] + ".datas"
        _redis.srem(_key, self.uuid)

        CommonMixin.delete_redis_keys(self, _redis)
        return

# PCSOCKET CLUSTER
class PCSocketInfo(CommonMixin, BaseModel):
    __tablename__ = "pc_socket_infos"

    host = Column("host", String(64))
    port = Column("port", String(16))
    latest_register_time = Column("latest_register_time", DateTime)
    
    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(PCSocketInfo, self).__init__(*args, **kwargs)
        return

    def create_redis_keys(self, _redis, *args, **kwargs):
        _key = self.__tablename__ \
               + ".host." + self.host \
               + ".port." + self.port
        _redis.set(_key, self.uuid)
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        return

    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, PCSocketInfo, self.uuid)
        if _obj == None:
            return
        _key = self.__tablename__ \
               + ".host." + _obj["host"] \
               + ".port." + _obj["port"]
        _redis.delete(_key)
        CommonMixin.delete_redis_keys(self, _redis)
        return


class PCSocketDeviceData(CommonMixin, BaseModel):
    __tablename__ = "pc_socket_device_datas"

    pc_socket_uuid = Column("pc_socket_uuid", String(64))
    device_uuid = Column("device_uuid", String(64))
    
    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(PCSocketDeviceData, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        _key = self.__tablename__ \
               + ".pc_socket_uuid." + self.pc_socket_uuid \
               + ".device_uuid." + self.device_uuid
        _redis.set(_key, self.uuid)

        _key = self.__tablename__ \
               + ".device_uuid." + self.device_uuid
        _redis.set(_key, self.pc_socket_uuid)

        _key = self.__tablename__ \
               + ".pc_socket_uuid." + self.pc_socket_uuid
        _redis.sadd(_key, self.device_uuid)
        
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        return

    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, PCSocketDeviceData, self.uuid)
        if _obj == None or _obj["pc_socket_uuid"] == None or _obj["device_uuid"] == None:
            return

        _key = self.__tablename__ \
               + ".pc_socket_uuid." + _obj["pc_socket_uuid"] \
               + ".device_uuid." + _obj["device_uuid"]
        _redis.delete(_key)

        _key = self.__tablename__ \
               + ".device_uuid." + _obj["device_uuid"]
        _redis.delete(_key)

        _key = self.__tablename__ \
               + ".pc_socket_uuid." + _obj["pc_socket_uuid"]
        _redis.srem(_key, _obj["device_uuid"])
        
        CommonMixin.delete_redis_keys(self, _redis)
        return

class DeviceNavigationData(CommonMixin, BaseModel):
    __tablename__ = "device_navigation_datas"

    app_uuid = Column("app_uuid", String(64))
    device_uuid = Column("device_uuid", String(64))
    navigation_data = Column("navigation_data", String(2048))
    
    __table_args__ = (
    )

    def __init__(self, *args, **kwargs):
        super(DeviceNavigationData, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)

        _key = self.__tablename__  + ".app_uuid." + self.app_uuid + ".device_uuid." + self.device_uuid
        _createtime = time.mktime(self.createtime.timetuple())*1000*1000 + self.createtime.microsecond
        _v = json.dumps([_createtime, self.navigation_data])
        _redis.zadd(_key, _v, _createtime)
        return

    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, DeviceNavigationData, self.uuid)
        if _obj == None:
            return

        _key = self.__tablename__  + ".app_uuid." + _obj["app_uuid"] + ".device_uuid." + _obj["device_uuid"]
        _createtime = time.mktime(_obj["createtime"].timetuple())*1000*1000 + _obj["createtime"].microsecond
        _v = json.dumps([_createtime, _obj["navigation_data"]])
        _redis.zrem(_key, _v)
        
        CommonMixin.delete_redis_keys(self, _redis)
        return


class ApiInfo(CommonMixin, BaseModel):
    __tablename__ = "api_infos"

    api_key = Column("api_key", String(64))
    api_secret = Column("api_secret", String(64))

    app_uuid = Column("app_uuid", String(64))
    user_uuid = Column("user_uuid", String(64))

    # PPCOM/PPKEFU/PPCONSOLE/THIRD_PARTY_KEFU/THIRD_PARTY_CONSOLE
    api_level = Column("api_level", String(32))
    
    def __init__(self, *args, **kwargs):
        super(ApiInfo, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        _key = self.__tablename__ + ".api_key." + self.api_key
        _v = json.dumps([self.app_uuid, self.uuid, self.api_level, self.api_secret])
        _redis.set(_key, _v)

        _key = self.__tablename__ + ".app_uuid." + self.app_uuid + \
               ".user_uuid." + self.user_uuid + ".api_level." + self.api_level
        _v = json.dumps([self.uuid, self.api_level, self.api_key, self.api_secret])
        _redis.set(_key, _v)
        
        return
    
    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, ApiInfo, self.uuid)
        if _obj == None:
            return
        _key = self.__tablename__ + ".api_key." + _obj["api_key"]
        _redis.delete(_key)

        _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + \
               ".user_uuid." + _obj["user_uuid"] + ".api_level." + _obj["api_level"]
        _redis.delete(_key)
        
        CommonMixin.delete_redis_keys(self, _redis)
        return


class ApiTokenData(CommonMixin, BaseModel):
    __tablename__ = "api_token_datas"

    # copy from api info
    app_uuid = Column("app_uuid", String(64))
    api_uuid = Column("api_uuid", String(64))
    api_level = Column("api_level", String(32))

    api_code = Column("api_code", String(256))
    api_token = Column("api_token", String(256))
    is_code_authorized = Column("is_code_authorized", Boolean)
    
    def __init__(self, *args, **kwargs):
        super(ApiTokenData, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)

        _key = self.__tablename__ + ".app_uuid." + self.app_uuid + \
               ".api_token." + self.api_token
        _redis.set(_key, self.uuid)
        
        _key = self.__tablename__ + ".api_token." + self.api_token
        _v = json.dumps([self.api_uuid, self.api_level])
        _redis.set(_key, _v)
        
        # one day expired for ppconsole 
        if self.api_level == API_LEVEL.THIRD_PARTY_CONSOLE:
            _redis.expire(_key, 3600*24)

        # 30 seconds expired, if no token request in time, the code expired.
        _key = self.__tablename__ + ".api_code." + self.api_code
        _v = json.dumps([self.api_uuid, self.uuid])
        _redis.set(_key, _v)
        _redis.expire(_key, 30)
        return
    
    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, ApiTokenData, self.uuid)
        if _obj == None:
            return
        _key = self.__tablename__ + ".api_token." + _obj["api_token"]
        _redis.delete(_key)
        _key = self.__tablename__ + ".api_code." + _obj["api_code"]
        _redis.delete(_key)
        _key = self.__tablename__ + ".app_uuid." + _obj["app_uuid"] + \
               ".api_token." + _obj["api_token"]
        _redis.delete(_key)
        
        CommonMixin.delete_redis_keys(self, _redis)
        return

class PredefinedScript(CommonMixin, BaseModel):
    __tablename__ = "predefined_scripts"

    # copy from api info
    app_uuid = Column("app_uuid", String(64))
    group_uuid = Column("group_uuid", String(64))
    script_answer = Column("script_answer", String(512))
    script_question = Column("script_question", String(512))
    
    def __init__(self, *args, **kwargs):
        super(PredefinedScript, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        _key = self.__tablename__ + ".group_uuid." + str(self.group_uuid)
        _redis.sadd(_key, self.uuid)

        _key = self.__tablename__ + ".app_uuid." + self.app_uuid
        _redis.sadd(_key, self.uuid)
        
        return

    def update_redis_keys(self, _redis):
        CommonMixin.update_redis_keys(self, _redis)
        _obj = redis_hash_to_dict(_redis, PredefinedScript, self.uuid)
        if _obj == None:
            return
        _key = self.__tablename__ + ".group_uuid." + str(_obj.get("group_uuid"))
        _redis.sadd(_key, self.uuid)
        return
    
    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, PredefinedScript, self.uuid)
        if _obj == None:
            return

        _key = self.__tablename__ + ".group_uuid." + str(_obj.get("group_uuid"))
        _redis.srem(_key, self.uuid)

        _key = self.__tablename__ + ".app_uuid." + _obj.get("app_uuid")
        _redis.srem(_key, self.uuid)

        CommonMixin.delete_redis_keys(self, _redis)
        return

class PredefinedScriptGroup(CommonMixin, BaseModel):
    __tablename__ = "predefined_script_groups"

    # copy from api info
    app_uuid = Column("app_uuid", String(64))
    group_name = Column("group_name", String(128))
    
    def __init__(self, *args, **kwargs):
        super(PredefinedScriptGroup, self).__init__(*args, **kwargs)
        return
    
    def create_redis_keys(self, _redis, *args, **kwargs):
        CommonMixin.create_redis_keys(self, _redis, *args, **kwargs)
        _key = PredefinedScriptGroup.__tablename__ + ".app_uuid." + self.app_uuid
        _redis.sadd(_key, self.uuid)
        return
    
    def delete_redis_keys(self, _redis):
        _obj = redis_hash_to_dict(_redis, PredefinedScriptGroup, self.uuid)
        if _obj == None:
            return
        _key = PredefinedScriptGroup.__tablename__ + ".app_uuid." + _obj["app_uuid"]
        _redis.srem(_key, self.uuid)
        CommonMixin.delete_redis_keys(self, _redis)
        return
    

