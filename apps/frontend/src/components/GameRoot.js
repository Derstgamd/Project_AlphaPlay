"use client";

import { CaseProvider, useCase } from "@/context/CaseContext";
import { useHostDevice } from "@/hooks/useHostDevice";
import WorkspaceScreen from "./WorkspaceScreen";
import DeviceScene from "./DeviceScene";

function ScreenRouter() {
  const { activeScreen } = useCase();
  const hostDevice = useHostDevice();

  if (activeScreen === "device") {
    return <DeviceScene hostDevice={hostDevice} />;
  }
  return <WorkspaceScreen hostDevice={hostDevice} />;
}

export default function GameRoot() {
  return (
    <CaseProvider>
      <ScreenRouter />
    </CaseProvider>
  );
}
