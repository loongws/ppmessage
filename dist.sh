#!/bin/bash


PY_SITE="`python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())"`"
PIP="`which pip`"
VERBOSE=""

function ppmessage_options()
{ 
    if [ "$2" = "-v" ];
    then
        VERBOSE="1"
    else
        VERBOSE=""
    fi
}

function ppmessage_err()
{
    echo "EEEE) $1"
    echo
    exit 1
}

function ppmessage_check_path()
{
    if [ ! -f ./dist.sh  ];
    then
        ppmessage_err "you should run under the first-level path of ppmessage!"
    fi
}

function ppmessage_help()
{
    echo "Usage:
  $0 <command> [options]

Commands:
  dev                         Install development mode with current working directory.
  undev                       Uninstall development mode.
  status                      Show the status of installation mode.
  run                         Start ppmessage in foreground.
  proc                        Show the ppmessage processes.
  start                       Start ppmessage service.
  stop                        Stop ppmessage service.
  restart                     Restart ppmessage service.
  log                         View the ppmessage logs.
  bower                       Install bower components.
  npm                         Install node components.
  cnpm                        Install node components, using cnpm.
  gulp                        Run all gulp tasks.
  app-win32                   Create window desktop app.
  app-win64                   Create window desktop app.
  app-mac                     Create mac os x desktop app.
  app-android                 Create mac os x desktop app.
  app-ios                     Create mac os x desktop app.
  app-auto-update             Update app version in server

Options:
  -v                          Give more output.
"
}

function ppmessage_need_root()
{
    if [ $UID -ne 0 ];
    then
        ppmessage_err "you should run in root, or use sudo!"
    fi
}

function ppmessage_exec()
{
    if [ $VERBOSE ];
    then
        $*
    else
        $* >/dev/null 2>/dev/null
    fi
}

function ppmessage_dist()
{
    if [ -e tmp ];
    then
        ppmessage_err "uncleaned tmp, please remove it manually!"
    fi

    mkdir -p tmp
    cp -r ppmessage tmp/

    ppmessage_exec python -m compileall tmp/ppmessage

    if [ $? != 0 ];
    then
        ppmessage_err "compile failed!"
    fi

    find tmp/ppmessage/*/* -name \*.py |xargs rm
    cp setup.py tmp/
    cp setup.py tmp/ppmessage/

    cd tmp
    ppmessage_exec python setup.py bdist_egg install_egg_info
    if [ $? != 0 ];
    then
        ppmessage_err 'make egg failed!'
    fi

    cp -r dist ..
    cd - >/dev/null

    rm -fr tmp
}

function ppmessage_dev()
{
    if [ ! -d $PY_SITE ];
    then
        ppmessage_err 'can not find site-packages!'
    else
        echo "`pwd`" > $PY_SITE/ppmessage.pth
    fi
}

function ppmessage_undev()
{
    if [ ! -d $PY_SITE ];
    then
        ppmessage_err 'can not find site-packages!'
    elif [ -f "$PY_SITE/ppmessage.pth" ];
    then
        rm -f "$PY_SITE/ppmessage.pth"
    fi
}

function ppmessage_dev_status()
{
    if [ -f "$PY_SITE/ppmessage.pth" ];
    then
        echo "PPMESSAGE is installed in dev-mode."
    else
        echo "PPMESSAGE is not installed in dev-mode."
    fi
}

function ppmessage_working_path()
{
    cd /tmp

    WORKING_DIR="`python <<EOF
import os

try:
    import ppmessage

    print os.path.dirname(ppmessage.__file__)
except:
    pass

EOF`"

    cd - >/dev/null

    if [ -z "$WORKING_DIR" ];
    then
        echo 'can not find the working path of PPMESSAGE!'
    else
        echo 'PPMESSAGE.working_path =' $WORKING_DIR
    fi
}

function ppmessage_status()
{
    info="`$PIP show ppmessage 2>/dev/null`"
    if [ "$info" ];
    then
        echo "PPMESSAGE is installed in production-mode."
    else
        echo "PPMESSAGE is not installed in production-mode."
    fi
}

function ppmessage_run()
{
    ppmessage_exec supervisord -n -c ppmessage/conf/supervisord.nginx.conf
}

function ppmessage_proc()
{
    ps axu|grep "\-m ppmessage\."|grep -v grep
}

function ppmessage_supervisord_proc()
{
    ps axu|grep python|grep -v "\-m ppmessage\."|grep ppmessage|grep "\.py"|grep -v grep
}

function ppmessage_start()
{
    ppmessage_exec mkdir -p /usr/local/var/log
    ppmessage_exec supervisord -c ppmessage/conf/supervisord.nginx.conf
}

function ppmessage_stop()
{
    SPID="`ps axu|grep supervisord|grep -v grep|awk '{print $2}'`"
    if [ -z $SPID ];
    then
        return
    fi

    ppmessage_exec kill $SPID
}

function ppmessage_log()
{
    if [ ! -d /usr/local/var/log ];
    then
        ppmessage_err "can not find ppmessage's log path!"
    fi

    tail -F /usr/local/var/log/*.log
}

function ppmessage_gulp()
{
    echo "generate PPCom/PPKefu/PPConsole js";
    cd ppmessage/ppkefu/gulp; gulp; cd -;
    cd ppmessage/ppcom/gulp; gulp; cd -;
    cd ppmessage/ppconsole/gulp; gulp; cd -;
    cd ppmessage/ppconfig/gulp; gulp; cd -;
}

function ppmessage_bower()
{
    echo "install PPCom/PPKefu/PPConsole js bower depends";
    cd ppmessage/ppcom/bower; bower install --allow-root; cd -;
    cd ppmessage/ppkefu/bower; bower install --allow-root; cd -;
    cd ppmessage/ppconsole/bower; bower install --allow-root; cd -;
    cd ppmessage/ppconfig/bower; bower install --allow-root; cd -;
}

function ppmessage_npm()
{
    echo "install PPCom/PPKefu/PPConsole js node depends";
    cd ppmessage/ppcom/gulp; npm install; cd -;
    cd ppmessage/ppkefu/gulp; npm install; cd -;
    cd ppmessage/ppconsole/gulp; npm install; cd -;
    cd ppmessage/ppconfig/gulp; npm install; cd -;
}

function ppmessage_cnpm()
{
    echo "install PPCom/PPKefu/PPConsole js node depends";
    cd ppmessage/ppcom/gulp; cnpm install; cd -;
    cd ppmessage/ppkefu/gulp; cnpm install; cd -;
    cd ppmessage/ppconsole/gulp; cnpm install; cd -;
}

function ppmessage_build()
{
    echo "building $1"
    cd ppmessage/$1/gulp; gulp; cd -;
}

function ppmessage_apply_config()
{
    echo "Apply config for ppconsole"
    python ppmessage/ppconsole/config/config.py

    echo "Apply config for ppkefu"
    python ppmessage/ppkefu/config/config.py

    echo "Apply config for ppcom"
    python ppmessage/ppcom/config/config.py

}

### MAIN ###

echo

ppmessage_options $*
ppmessage_check_path

case "$1" in

    build-ppconfig)
        ppmessage_build "ppconfig"
        ;;

    build-ppconsole)
        ppmessage_build "ppconsole"
        ;;

    build-ppkefu)
        ppmessage_build "ppkefu"
        ;;

    build-ppcom)
        ppmessage_build "ppcom"
        ;;

    apply-config)
        ppmessage_apply_config
        ;;
    
    dev)
        ppmessage_need_root
        ppmessage_dev
        echo "done!"
        ;;

    undev)
        ppmessage_need_root
        ppmessage_undev
        echo "done!"
        ;;

    status)
        ppmessage_dev_status
        ppmessage_status
        ppmessage_working_path
        ;;

    run)
        ppmessage_run
        ;;

    proc)
        ppmessage_proc
        ppmessage_supervisord_proc
        ;;

    start)
        ppmessage_start
        ;;

    stop)
        ppmessage_stop
        ;;

    restart)
        ppmessage_stop
        ppmessage_start
        ;;

    log)
        ppmessage_log
        ;;
    
    gulp)
        ppmessage_gulp
        ;;

    bower)
        ppmessage_bower
        ;;

    npm)
        ppmessage_npm
        ;;

    cnpm)
        ppmessage_cnpm
        ;;

    app-win32)
        ppmessage_app_win32
        ;;

    app-win64)
        ppmessage_app_win64
        ;;

    app-mac)
        ppmessage_app_mac
        ;;

    app-android)
        ppmessage_app_android
        ;;

    app-ios)
        ppmessage_app_ios
        ;;

    app-dist)
        ppmessage_app_dist
        ;;

    app-dist-clean)
        ppmessage_app_dist_clean
        ;;

    app-scp)
        ppmessage_app_scp
        ;;
    
    *)
        ppmessage_help
        exit 0
        ;;
esac


echo
exit 0
