# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights are reserved
#
# core/utils/slplitstring.py
#
#

_pinyin_table = {}

def _load_pinyin_table():
    return

def split_chinese_string_to_words(_string):
    if len(_pinyin_table) == 0:
        _load_pinyin_table()

    if len(_pinyin_table) == 0:
        logging.error("no pinyin table")
        return None
    
    return []


