# PPKefu

PPKefu is the service client app for PPMessage. It is based on angular, ionic, cordova and electron. You can run it in browser, mobile(iOS, Android), Mac OSX, Windows, Linux.


### before running PPKefu
Firstly install [nodejs](https://nodejs.org) (4.x recommended), then install bower, gulp via npm

```
sudo npm install -g bower gulp
```

install bower components and npm packages.

```
bower install
npm install 
```

then run gulp task to create min.js, min.css files from source code.

```
gulp
```

### browser 

after finish gulp task, you can run PPKefu in browser.

the url should be something like (based on your PPMessage Config):

```
http://localhost:8080/ppkefu
```


### cordova

1. install cordova and ionic-cli

  ```
  sudo npm install -g cordova ionic
  ```
2. package.json includes cordova project dependency, To initialize cordova platforms and plugins, just run

  ```
  ionic state restore
  ```
3. now you can run PPKefu in mobile via cordova, some useful commands are as follows.

  ``` bash
  # run Andorid app in Android device
  ionic run android

  # run ios app via Xcode
  ionic prepare ios
  open platforms/ios/PPMessage.xcodeproj
  # now use Xcode to build/run app 
 ```

### electron

1. install npm package: electron-prebuilt, electron-builder

  ```
  npm run set-up-electron
  ```
2. run electron app

  ```
  npm run start
  ```
3. build electron app (read electron and electron-builder docs before building)

  ```
  npm run dist
  ```

### notices

1. The source files(.js, .css, .scss) we actually edit is under `app/`.

2. Run `gulp` task will generate (.min.js, .min.css) files under `www/`. PPKefu will only load files under www/ when launch. When build cordova/electron app, only files under `www/` is packaged.

3. Before you edit source files under `app/`, run `gulp watch` firstly. The files to watch is defined in `config/build.config.js`. If you create new `.js` files, you should add it to `build.config.js`, or it will not be used when run gulp task.

4. `config/app.config.json` include server settings, it will be re-created when run gulp task unless you set `overwrite: false`.
