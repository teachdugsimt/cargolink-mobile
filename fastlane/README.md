fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### bump_version
```
fastlane bump_version
```
Bump version numbers, and set the version to match the pacakage.json version.
### distribute
```
fastlane distribute
```
Distribute app to firebase
### changelog
```
fastlane changelog
```


----

## iOS
### ios certificates
```
fastlane ios certificates
```
Fetch certificates and provisioning profiles
### ios beta
```
fastlane ios beta
```
Ship to Testflight.
### ios distribute
```
fastlane ios distribute
```
Distribute app to firebase

----

## Android
### android beta
```
fastlane android beta
```
Ship to Playstore Beta.
### android distribute
```
fastlane android distribute
```
Distribute app to firebase

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
