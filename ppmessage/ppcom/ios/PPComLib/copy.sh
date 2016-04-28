#!/bin/bash

MDM_IOS="${HOME}/mdm/mdm/ppcom/ios/"

IOS_Lib="${HOME}/Documents/PPComLib/"
IOS_Lib_Framework="${HOME}/Desktop/PPComLib.framework"
IOS_Lib_Bundle="${HOME}/Desktop/PPComLib.bundle"
IOS_Lib_Version="0.0.2"
IOS_Demo="${HOME}/Documents/PPComDemo/"

(
    cd ${MDM_IOS};
    rm -rf *;

    cp -r ${IOS_Lib} PPComLib/;
    sdk_folder="SDK-V${IOS_Lib_Version}";
    mkdir ${sdk_folder};
    cp -r ${IOS_Lib_Framework} ${sdk_folder};
    cp -r ${IOS_Lib_Bundle} ${sdk_folder};

    cp -r ${IOS_Demo} PPComDemo/;
    
)
