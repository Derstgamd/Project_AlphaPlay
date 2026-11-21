"use client";

import LaptopScene from "./LaptopScene";
import PhoneScene from "./PhoneScene";

export default function DeviceScene({ hostDevice }) {
  if (hostDevice.activeDeviceType === "phone") {
    return <PhoneScene hostDevice={hostDevice} />;
  }
  return <LaptopScene hostDevice={hostDevice} />;
}
