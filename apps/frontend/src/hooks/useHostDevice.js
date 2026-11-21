"use client";

import { useEffect, useState } from "react";

function detectHostInfo() {
  if (typeof window === "undefined") {
    return { osName: "Desktop", detectedType: "laptop" };
  }

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";

  let osName = "Desktop OS";
  if (/Android/i.test(ua)) osName = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) osName = "iOS";
  else if (/Win/i.test(platform) || /Windows/i.test(ua)) osName = "Windows";
  else if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) osName = "macOS";
  else if (/Linux/i.test(platform) || /Linux/i.test(ua)) osName = "Linux";

  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isNarrow = window.innerWidth < 768;
  const detectedType = isMobileUA || isNarrow ? "phone" : "laptop";

  return { osName, detectedType };
}

export function useHostDevice() {
  const [hostInfo, setHostInfo] = useState({ osName: "Detecting...", detectedType: "laptop" });
  const [overrideType, setOverrideType] = useState(null);

  useEffect(() => {
    const update = () => setHostInfo(detectHostInfo());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const activeDeviceType = overrideType || hostInfo.detectedType;

  return {
    osName: hostInfo.osName,
    detectedType: hostInfo.detectedType,
    activeDeviceType,
    overrideType,
    setOverrideType,
  };
}
