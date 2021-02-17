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
Bump build numbers, and set the version to match the pacakage.json version.

----

## iOS
### ios certificates
```
fastlane ios certificates
```
Fetch certificates and provisioning profiles
### ios bump_version
```
fastlane ios bump_version
```
Update version code and version number
### ios beta
```
fastlane ios beta
```
Ship to Testflight.

----

## Android
### android bump_version
```
fastlane android bump_version
```
Build the Android application.

Update version code and version number
### android beta
```
fastlane android beta
```
Ship to Playstore Beta.

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
