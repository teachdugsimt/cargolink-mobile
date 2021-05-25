//
//  CargoLinkMobile.swift
//  CargoLinkMobile
//
//  Created by Katanyoo Ubalee on 10/5/2564 BE.
//

import Foundation

@objc(CargoLinkMobile)
class CargoLinkMobile: NSObject {
  
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["initialCount": 0]
  }
}
