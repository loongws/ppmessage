#!/bin/bash

function print_usage() {
    echo "Usage:
  Enter ppkefu root directory, run this script via npm:

    npm run electron [command]

Commands:
  set-up                      Install electron package and save to package.json
  clean                       Clean electron dist directory
  clean-linux                 Clean electron linux dist directory
  clean-osx                   Clean electron osx dist directory
  clean-mas                   Clean electron mas dist directory (for Mac App Store)
  clean-win32                 Clean electron win32 dist directory
  clean-win64                 Clean electron win64 dist directory
  pack-linux                  Create electron linux package
  pack-osx                    Create electron osx package
  pack-mas                    Create electron mas package (for Mac App Store)
  pack-win32                  Create electron win32 package
  pack-win64                  Create electron win64 package
  build-osx                   Create electron osx installer
  build-mas                   Create electron mas installer (for Mac App Store)
  build-win32                 Create electron win32 installer
  build-win64                 Create electron win64 installer
"
}

function set_up_electron() {
    cnpm install \
         --save-dev \
         electron-packager@7.0.1 \
         electron-builder@2.1.1 \
         electron-prebuilt@0.37.8
}

function clean_linux() {
    rm -rf electron/dist/linux
}

function clean_osx() {
    rm -rf electron/dist/osx
}

function clean_mas() {
    sudo rm -rf electron/dist/mas
}

function clean_win32() {
    rm -rf electron/dist/win32
}

function clean_win64() {
    rm -rf electron/dist/win64
}

function clean() {
    rm -rf electron/dist
}

function pack_linux() {
    clean_linux;
    electron-packager ./www $npm_package_name \
                      --arch=x64 \
                      --asar=true \
                      --overwrite \
                      --platform=linux \
                      --out=electron/dist/linux \
                      --version=$npm_electron_version \
                      --app-version=$npm_package_version \
                      --build-version=$npm_package_version
}

function pack_osx() {
    clean_osx;
    electron-packager ./www $npm_package_name \
                      --arch=x64 \
                      --asar=true \
                      --overwrite \
                      --platform=darwin \
                      --out=electron/dist/osx \
                      --version=$npm_electron_version \
                      --app-version=$npm_package_version \
                      --build-version=$npm_package_version
}
function pack_mas() {
    clean_mas;
    electron-packager ./www $npm_package_name \
                      --arch=x64 \
                      --asar=true \
                      --overwrite \
                      --platform=mas \
                      --out=electron/dist/mas \
                      --version=$npm_electron_masVersion \
                      --app-version=$npm_package_version \
                      --build-version=$npm_package_version \
                      --icon=electron/assets/osx/ppmessage.icns \
                      --app-bundle-id=com.ppmessage.ppkefu.mac \
                      --helper-bundle-id=com.ppmessage.ppkefu.mac.helper \
                      --osx-sign.entitlements=electron/assets/mas/parent.plist \
                      --osx-sign.entitlements-inherit=electron/assets/mas/child.plist \
                      --osx-sign.identity="3rd Party Mac Developer Application: Beijing Yourui Technology Co., Ltd. (2WSQ489AT3)"

}

function pack_win32() {
    clean_win32;
    electron-packager ./www $npm_package_name \
                      --arch=ia32 \
                      --asar=true \
                      --overwrite \
                      --platform=win32 \
                      --out=electron/dist/win32 \
                      --version=$npm_electron_version \
                      --app-version=$npm_package_version \
                      --build-version=$npm_package_version
}
function pack_win64() {
    clean_win64;
    electron-packager ./www $npm_package_name \
                      --arch=x64 \
                      --asar=true \
                      --overwrite \
                      --platform=win64 \
                      --out=electron/dist/win64 \
                      --version=$npm_electron_version \
                      --app-version=$npm_package_version \
                      --build-version=$npm_package_version
}

function build_osx() {
    pack_osx;
    electron-builder "electron/dist/osx/${npm_package_name}-darwin-x64/${npm_package_name}.app" \
                     --platform=osx \
                     --out="electron/dist/osx" \
                     --config=electron/assets/osx/config.json
}

function build_mas() {
    pack_mas;
    # The path of you app to sign.
    APP_PATH="electron/dist/mas/${npm_package_name}-mas-x64/${npm_package_name}.app"
    # The path to the location you want to put the signed package.
    RESULT_PATH="electron/dist/mas/${npm_package_name}.pkg"
    # INSTALLER_KEY should be in the keychain
    INSTALLER_KEY="3rd Party Mac Developer Installer: Beijing Yourui Technology Co., Ltd. (2WSQ489AT3)"

    productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
}

function build_win32() {
    electron-builder "electron/dist/win32/${npm_package_name}-win32-ia32" \
                     --platform=win \
                     --out="electron/dist/win32" \
                     --config=electron/assets/win/config.json
}

function build_win64() {
    electron-builder "electron/dist/win64/${npm_package_name}-win32-x64" \
                     --platform=win \
                     --out="electron/dist/win64" \
                     --config=electron/assets/win/config.json
}


# Main

# must run via npm
if [ ! $npm_package_name ];
then
    print_usage;
    exit 0
fi

case "$1" in

    set-up) set_up_electron;;

    clean) clean;;

    clean-linux) clean_linux;;

    clean-osx) clean_osx;;

    clean-mas) clean_mas;;

    clean-win32) clean_win32;;

    clean-win64) clean_win64;;

    pack-linux) pack_linux;;

    pack-osx) pack_osx;;

    pack-mas) pack_mas;;

    pack-win32) pack_win32;;

    pack-win64) pack_win64;;

    build-osx) build_osx;;

    build-mas) build_mas;;

    build-win32) build_win32;;

    build-win64) build_win64;;

    *) print_usage;;
esac

exit 0
