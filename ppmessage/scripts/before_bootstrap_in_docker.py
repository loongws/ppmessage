#!-*- coding: utf-8 -*-

from ppmessage.bootstrap.config import BOOTSTRAP_CONFIG
import subprocess

"""
Before bootstrap PPMessage in docker container, we must do following things:

1. Set mysql password in docker container, base on PPMessage Config.

2. Check nginx conf path in PPMessage Config.

"""

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    
def set_mysql_password():
    password = BOOTSTRAP_CONFIG["mysql"]["db_pass"]
    print "set mysql password to: %s" %password
    subprocess.check_output("mysqladmin -uroot password " + password, shell=True)
    print "done!\n"
    return

def check_nginx_conf_path():
    path = BOOTSTRAP_CONFIG["nginx"]["nginx_conf_path"]
    right_path = "/usr/local/nginx/conf/nginx.conf";
    print "check nginx conf path... got path: %s" %path
    if path == right_path:
        print "done! \n"
        return
    
    print bcolors.FAIL + "nginx_conf_path is not right, please set it to: %s \n" %right_path + bcolors.ENDC
    return

if __name__ == "__main__":
    set_mysql_password()
    check_nginx_conf_path()
