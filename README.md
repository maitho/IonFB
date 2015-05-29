#### DOCUMENTATION
Please before you start read the support documentation here: https://docs.google.com/document/d/1UzyjU0vwCnFyW8M9mFtQCSjnv7jG_U_QDdL1ve8gHCI/edit?usp=sharing

In the documentation you will find all steps needed to install, setup and build your ionFB app.





#### Other installations

#### init

You need to install ionic and its dependencies
http://ionicframework.com/docs/guide/installation.html

#### Install android sdk (http://goo.gl/iso187, http://goo.gl/dlMOi, 'http://robdodson.me/setting-up-android-studio-on-yosemite/', we need api 19: http://stackoverflow.com/a/24934188)

#### Add ANDROID_HOME to .bash_profile:
```
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### Install ant
```
brew install ant
```

### Create platforms
```
ionic platform ios
```

We need android sdk and ant before running this command
```
ionic platform android
```

### Build & emulate
```
ionic build ios
ionic emulate ios

ionic build android
ionic emulate android
```

### Install sass
```
gem install sass
```

### Install gulp
```
npm install --global gulp
```

### Live reload: if we run this command we will have code changes live reload when saving the files
### Before running these commands we need sass and gulp installed
```
ionic setup sass
ionic serve
```

### Debug (http://ionicframework.com/docs/guide/testing.html)
To debug on android just plug it and run
```
ionic run android
```

#### Android emulator: for proper use install intel HAXM (http://stackoverflow.com/a/26587252)

### To update ionic, run
```
npm update -g ionic
bower update
```

### To generate app icon and splash screen run
```
ionic resources
```
#### Or
```
ionic resources --icon
ionic resources --splash
```

#### Install fb plugin

To use this app you will need to make sure you've registered your Facebook app with Facebook and have an APP_ID https://developers.facebook.com/apps.

This is the plugin: https://github.com/Wizcorp/phonegap-facebook-plugin

For ios see doc: https://github.com/Wizcorp/phonegap-facebook-plugin/tree/master/platforms/ios

For android see doc: https://github.com/Wizcorp/phonegap-facebook-plugin/tree/master/platforms/android

### Generate ANDROID Key Hash

http://stackoverflow.com/a/12577997/1330740
https://developers.facebook.com/docs/android/getting-started#release-key-hash
