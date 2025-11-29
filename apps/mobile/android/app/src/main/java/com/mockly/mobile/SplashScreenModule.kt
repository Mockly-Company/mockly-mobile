package com.mockly.mobile

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class SplashScreenModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SplashScreen"
    }

    @ReactMethod
    fun hide() {
        UiThreadUtil.runOnUiThread {
            val activity = reactApplicationContext.currentActivity as? MainActivity
            activity?.hideSplashScreen()
        }
    }

    @ReactMethod
    fun show() {
        // Optional: implement if you want to show splash screen again
    }
}
