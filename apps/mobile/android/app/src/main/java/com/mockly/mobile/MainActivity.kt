package com.mockly.mobile

import android.os.Bundle
import androidx.core.splashscreen.SplashScreen
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate


class MainActivity : ReactActivity() {

  private var keepSplashScreen = true

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Mockly"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /** 
   * 스플래시 화면 조정
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    // Install splash screen and keep it visible until JS calls hide()
    val splashScreen = installSplashScreen()
  
    super.onCreate(savedInstanceState)

    splashScreen.setKeepOnScreenCondition { keepSplashScreen }
  }

  /**
   * 스플래시 화면 끄는 함수 api 제공
   */
  fun hideSplashScreen() {
    keepSplashScreen = false
  }
}
