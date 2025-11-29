import Foundation
import UIKit

@objc(SplashScreen)
class SplashScreen: NSObject {

  private static var splashWindow: UIWindow?

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func hide() {
    DispatchQueue.main.async {
      UIView.animate(withDuration: 0.3, animations: {
        SplashScreen.splashWindow?.alpha = 0
      }) { _ in
        SplashScreen.splashWindow?.isHidden = true
        SplashScreen.splashWindow = nil
      }
    }
  }

  @objc
  func show() {
    // Optional: implement if you want to show splash screen again
  }

  @objc
  static func showSplashScreen(in window: UIWindow?) {
    guard let window = window else { return }

    let splashViewController = UIStoryboard(name: "BootSplash", bundle: nil)
      .instantiateInitialViewController()

    let splashWindow = UIWindow(frame: UIScreen.main.bounds)
    splashWindow.rootViewController = splashViewController
    splashWindow.windowLevel = .normal + 1
    splashWindow.makeKeyAndVisible()

    SplashScreen.splashWindow = splashWindow
  }
}
