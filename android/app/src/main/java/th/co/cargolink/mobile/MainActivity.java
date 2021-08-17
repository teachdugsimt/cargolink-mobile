// package com.cargolinkmobile;
package th.co.cargolink.mobile;

import com.facebook.react.ReactActivity;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.devio.rn.splashscreen.SplashScreen; // Import this.
import android.os.Bundle; // Import this.

import android.content.Intent;
import android.content.res.Configuration;

import android.net.Uri;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MainActivity extends ReactActivity {

  @Override
  public void onNewIntent(Intent intent) {
    if (intent.getData() != null) {
      Uri deepLinkURL = intent.getData();
      // note deeplink_identifier means the identity that you register in the manifest.
      if (deepLinkURL.toString().contains("deeplink_identifier")) {
          // Create map for params
          WritableMap event = Arguments.createMap();
          // Put data to map
          event.putString("url", deepLinkURL.toString());
          // Get EventEmitter from context and send event thanks to it
          getReactInstanceManager().getCurrentReactContext()
                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit("url", event);
      } else {
         // to handle other deeplink that not related to the defined deeplink identifier such as notification
         setIntent(intent);
      }
    } 
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
      super.onConfigurationChanged(newConfig);
      Intent intent = new Intent("onConfigurationChanged");
      intent.putExtra("newConfig", newConfig);
      this.sendBroadcast(intent);
  }

  // Add this method.
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this);
      super.onCreate(savedInstanceState);
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "CargoLink";
  }
}
