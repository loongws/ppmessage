package com.ppmessage.ppcomdemo;

import android.app.Application;

import com.ppmessage.ppcomlib.PPComSDK;
import com.ppmessage.ppcomlib.PPComSDKConfiguration;
import com.ppmessage.sdk.core.PPMessageSDK;

/**
 * Created by ppmessage on 5/13/16.
 */
public class App extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        PPComSDK sdk = PPComSDK.getInstance();
        sdk.init(new PPComSDKConfiguration
                .Builder(this)
                .setAppUUID(TestData.TEST_APP_UUID)
                .build());

    }

}
