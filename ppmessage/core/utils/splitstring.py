# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights are reserved
#
# core/utils/slplitstring.py
#

import os

_pinyin_table = {}

def _load_pinyin_table():
    _file = os.path.join(os.path.dirname(__file__), "../../resource/data/mandarin.pinyin")
    with open(_file, "r") as _f:
        _lines = _f.read().strip().split("\n")
        for _line in _lines:
            key, value = _line.split('\t', 1)
            _pinyin_table[key] = value
    return

def _to_unicode(chars):
    if isinstance(chars, (unicode, type(None))):
        return chars
    try:
        return unicode(chars, "utf8")
    except:
        return chars.encode("utf8").decode("utf8")

def _split(chars, splitter = ' '):
    pinyin_results = []
    chinese_results = []
    
    is_english = False
    
    chars = _to_unicode(chars)
    for char in chars:

        # u'\u624b' remove "u'\u" of "u'\u624b'"
        key = repr(char)[4:-1].upper()

        if key in _pinyin_table:

            chinese_results.append(char)
            
            if is_english:
                pinyin_results.append(splitter)

            pinyin_results.append(_pinyin_table[key].strip().split(" ", 1)[0][0:-1].lower())
            pinyin_results.append(splitter)
            
            is_english = False
        else:
            pinyin_results.append(char)
            is_english = True

    # merge english and merge whitespace
    pinyin_list = "".join(pinyin_results).strip(splitter).split()
    return pinyin_list + chinese_results

def split_chinese_string_to_words(_string):
    if _string == None or len(_string) == 0:
        return None
    
    if len(_pinyin_table) == 0:
        _load_pinyin_table()

    if len(_pinyin_table) == 0:
        logging.error("no pinyin table")
        return None

    return _split(_string, ' ')

# test it
if __name__ == "__main__":
    print(split_chinese_string_to_words("Hello I am Guijin Ding - 丁貴金"))
