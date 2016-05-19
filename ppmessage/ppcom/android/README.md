PPCom Android SDK
=======

Android SDK for PPCom

For more information please see [the website](https://ppmessage.com)

Before
======

```
compile 'com.koushikdutta.async:androidasync:2.+'
compile 'com.squareup.picasso:picasso:2.5.2'
```

[AndroidAsync](https://github.com/koush/AndroidAsync) for WebSocket implementation

[Picasso](https://github.com/square/picasso) for ImageLoader implementation

The minimum sdk version is `15`, and current library version is `0.0.1`.
	
Usage
======

## Initialize

```java
public class App extends Application {

	private static final String PPMESSAGE_APP_UUID = "xxx";

	@Override
	public void onCreate() {
		super.onCreate();

		PPComSDK sdk = PPComSDK.getInstance();
		sdk.init(new PPComSDKConfiguration
	        .Builder(this)
        	.setAppUUID(PPMESSAGE_APP_UUID)
	        .build());

	}

}
```

## Startup

```java
public class MainActivity extends ConversationsActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
    	super.onCreate(savedInstanceState);

    	startUp();
	}

}
```
