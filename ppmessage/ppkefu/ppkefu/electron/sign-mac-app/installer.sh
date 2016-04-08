#!/bin/bash

# Name of your app.
APP="PPMessage"
# The path of you app to sign.
APP_PATH="../dist/mas/PPMessage-mas-x64/PPMessage.app"
# The path to the location you want to put the signed package.
RESULT_PATH="../dist/mas/$APP.pkg"
# The name of certificates you requested.

# APP_KEY and INSTALLER_KEY should be in the keychain
APP_KEY="3rd Party Mac Developer Application: Beijing Yourui Technology Co., Ltd. (2WSQ489AT3)"
INSTALLER_KEY="3rd Party Mac Developer Installer: Beijing Yourui Technology Co., Ltd. (2WSQ489AT3)"
FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"

# codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A"

# this line is added to handle a error when deliver app to mac app store
# codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Resources/crashpad_handler"

# codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper.app/"
# codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper EH.app/"
# codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper NP.app/"
# if [ -d "$FRAMEWORKS_PATH/Squirrel.framework/Versions/A" ]; then
  # Signing a non-MAS build.
  # codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Mantle.framework/Versions/A"
  # codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/ReactiveCocoa.framework/Versions/A"
  # codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Squirrel.framework/Versions/A"

  # this line is added to handle a error when deliver app to mac app store
  # codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Squirrel.framework/Versions/A/Resources/ShipIt"
# fi
# codesign -fs "$APP_KEY" --entitlements parent.plist "$APP_PATH"

productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
