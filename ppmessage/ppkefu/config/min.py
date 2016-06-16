# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights are reserved.
#
# ppkefu/min/min.py
#

from buildconfig import build_config

import os
import json
import scss
import hashlib
#from jsmin import jsmin
#from slimit import minify
from htmlmin import minify

def _cur_dir():
    return os.path.dirname(__file__)

def _files_content(_files):
    _cur = _cur_dir()    
    _abs = []
    for _f in _files:
        _abs.append(os.path.abspath(os.path.join(_cur, _f)))

    _content = ""
    for _p in _abs:

        _f = open(_p)
        if _f == None:
            continue

        _r = _f.read()
        _f.close()

        if _r != None and len(_r) != 0:
            _content = _content + _r + "\n"
    
    return _content

def _sass():
    _str = _files_content(build_config.get("scss"))
    _ionic_path = os.path.abspath(os.path.join(_cur_dir(), "../../resource/share/bower_components/ionic/scss/"))
    _scss_path = os.path.abspath(os.path.join(_cur_dir(), build_config.get("scssPath")))
    _cstr = scss.Compiler(search_path=[_scss_path, _ionic_path]).compile_string(_str)
    return _cstr.encode("utf8")

def _css():
    _str = _sass()
    _str = _str + _files_content(build_config.get("libCss"))
    _str = _str.encode("utf8")
    _hash = hashlib.sha1(_str).hexdigest()[:8]
    _dst_name = "ppkefu.min.%s.css" % _hash
    _dst_path = build_config.get("buildCssPath")
    _dst_path = os.path.join(_cur_dir(), _dst_path)
    _dst_path = os.path.join(_dst_path, _dst_name)
    _f = open(_dst_path, "w")
    _f.write(_str)
    _f.close()
    return _dst_name

def _html():
    def _w(_s, _d, _n):
        for _i in _n:
            _j = os.path.join(_d, _i)
            if not os.path.isfile(_j):
                continue
            _s.append(os.path.abspath(_j))
        return
    
    _dir = os.path.join(_cur_dir(), build_config.get("htmlPath"))
    _files = []
    os.path.walk(_dir, _w, _files)

    _path_names = {}
    for _i in _files:
        _f = open(_i, "r")
        _str = _f.read()
        _f.close()
        _name = "templates" + _i[_i.find("/html") + len("/html") : ]
        _path_names[_name] = _str

    print _path_names
    
    FUNC_TEMPLATE = "var t = %s;\n" + \
                    "angular.module('%s').run(['$templateCache',function($templateCache){\n" + \
                    "    var templates = JSON.parse(t).templates;\n" + \
                    "    angular.forEach(templates,function(val,key){\n" + \
                    "        $templateCache.put(key,val);\n" + \
                    "    });\n" + \
                    "}]);\n"

    _content = FUNC_TEMPLATE  % (repr(json.dumps(dict(templates=_path_names))), "ppmessage")    
    _hash = hashlib.sha1(_content).hexdigest()[:8]
    _outname = "template.%s.js" % _hash
    _buildpath = os.path.join(os.path.join(_cur_dir(), build_config.get("buildJsPath")), _outname)

    print _buildpath
    with open(_buildpath,'w') as out:
        out.write(_content)
    return _outname

def _js():
    _lib_str = _files_content(build_config.get("libJs"))
    _src_str = _files_content(build_config.get("js"))
    _src = _lib_str + "\n" + _src_str
    _src = _src.decode("utf8")
    #_dst = minify(_src)
    _dst = _src
    _hash = hashlib.sha1(_dst).hexdigest()[:8]
    _dst_name = "ppkefu.min.%s.js" % _hash
    _dst_path = build_config.get("buildJsPath")
    _dst_path = os.path.join(_cur_dir(), _dst_path)
    _dst_path = _dst_path + "/" + _dst_name
    print(_dst_path)
    _f = open(_dst_path, "w")
    _f.write(_dst.encode("utf8"))
    _f.close()
    return _dst_name

def _head_js(_ppkefu_api_key):
    _head_file = build_config.get("buildHeadFile")
    _head_path = os.path.join(_cur_dir(), _head_file)

    _ppmessage = {
        "version": "2.0.0",
        "developer_mode": False,
        "api_key": _ppkefu_api_key
    }
    
    _str = "window.ppmessage = " + json.dumps(_ppmessage) + ";\n";

    _f = open(_head_path, "w")
    _f.write(_str)
    _f.close()
    return

def _replace_html(_js_name, _template_name, _css_name):
    _file = build_config.get("buildHtmlTemplateFile")
    _path = os.path.join(_cur_dir(), _file)

    _f = open(_path, "r")
    _r = _f.read()
    _f.close()

    _r = _r.replace("{{ppkefu.min.js}}", _js_name)
    _r = _r.replace("{{templates.min.js}}", _template_name)
    _r = _r.replace("{{ppkefu.min.css}}", _css_name)
    
    _file = build_config.get("buildHtmlFile")
    _path = os.path.join(_cur_dir(), _file)
    _f = open(_path, "w")
    _f.write(_r)
    _f.close()
    return

def _main(_key):
    _css_name = _css()
    _html_name = _html()
    _head_js(_key)
    _js_name = _js()
    _replace_html(_js_name, _html_name, _css_name)
    return

if __name__ == "__main__":
    import sys
    import uuid

    reload(sys)
    sys.setdefaultencoding('utf-8')
    _key = "NGY3YjM2MGM1ZDExNTRlOGRiNDcxNjhjNjA2Y2ExMDE1YmNiOTVkNA=="
    _main(_key)
