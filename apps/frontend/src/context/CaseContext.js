"use client";

import { createContext, useContext, useState } from "react";
import {
  ALL_CLUES_BY_ID,
  CASE_BRIEF,
  INITIAL_CHATS,
  INITIAL_CLUES,
} from "@/data/caseData";

const CaseContext = createContext(null);

const INITIAL_MAP_PINS = [
  {
    id: "pin_sealdah",
    lat: 22.5646,
    lng: 88.3709,
    title: "Sealdah Station · North Platform",
    tag: "Last Seen",
    time: "01:47 AM",
    note: "Final device sync pinged near the north locker bay minutes before the phone went offline.",
    locked: true,
  },
  {
    id: "pin_parkst",
    lat: 22.5535,
    lng: 88.3526,
    title: "Park Street · Corner Café",
    tag: "Sighting",
    time: "09:15 PM",
    note: "Cash receipt for two coffees. Witness reported someone with a silver transit keycard.",
    locked: true,
  },
  {
    id: "pin_esplanade",
    lat: 22.567,
    lng: 88.3515,
    title: "Substation B · Esplanade",
    tag: "Lead",
    time: "00:50 AM",
    note: "Manual grid override recorded here. Cross-check Adam's Photos EXIF and grid logs.",
    locked: true,
  },
];

const INITIAL_MAP_YARNS = [
  { id: "yarn_init_1", fromPinId: "pin_sealdah", toPinId: "pin_esplanade" },
];

export function CaseProvider({ children }) {
  const [activeScreen, setActiveScreen] = useState("workspace"); // "workspace" | "device"
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [clues, setClues] = useState(INITIAL_CLUES);
  const [notesUnlocked, setNotesUnlocked] = useState(false);
  const [typingThreadId, setTypingThreadId] = useState(null);
  const [mapPins, setMapPins] = useState(INITIAL_MAP_PINS);
  const [mapYarns, setMapYarns] = useState(INITIAL_MAP_YARNS);
  const [scratchpad, setScratchpad] = useState(
    "Case Notes:\n- Adam last seen 01:47 AM at North Platform\n- Need 4-digit PIN for locked note"
  );

  const unlockClue = (clueId) => {
    if (!clueId || !ALL_CLUES_BY_ID[clueId]) return;
    setClues((prev) => {
      if (prev.some((c) => c.id === clueId)) return prev;
      return [...prev, ALL_CLUES_BY_ID[clueId]];
    });
  };

  const sendReply = (threadId, choice) => {
    if (!choice || typingThreadId) return;

    const myMsg = {
      id: `me_${Date.now()}`,
      sender: "me",
      text: choice.label,
      time: "Now",
    };

    setChats((prev) => {
      const thread = prev[threadId];
      if (!thread) return prev;
      return {
        ...prev,
        [threadId]: {
          ...thread,
          unread: 0,
          messages: [...thread.messages, myMsg],
          choices: thread.choices.filter((c) => c.id !== choice.id),
        },
      };
    });

    setTypingThreadId(threadId);
    setTimeout(() => {
      const replyMsg = {
        id: `reply_${Date.now()}`,
        sender: "them",
        text: choice.replyText,
        time: "Now",
      };
      setChats((prev) => {
        const thread = prev[threadId];
        if (!thread) return prev;
        return {
          ...prev,
          [threadId]: {
            ...thread,
            messages: [...thread.messages, replyMsg],
          },
        };
      });
      if (choice.unlockClue) {
        unlockClue(choice.unlockClue);
      }
      setTypingThreadId(null);
    }, 650);
  };

  const markThreadRead = (threadId) => {
    setChats((prev) => {
      const thread = prev[threadId];
      if (!thread || thread.unread === 0) return prev;
      return {
        ...prev,
        [threadId]: { ...thread, unread: 0 },
      };
    });
  };

  const tryUnlockNotes = (pinInput) => {
    if (pinInput === CASE_BRIEF.pinCode) {
      setNotesUnlocked(true);
      unlockClue("clue_locked_note");
      return true;
    }
    return false;
  };

  const addMapPin = (pin) => {
    const entry = {
      id: `pin_${Date.now()}`,
      locked: false,
      time: "Note",
      ...pin,
    };
    setMapPins((prev) => [...prev, entry]);
    return entry;
  };

  const deleteMapPin = (pinId) => {
    setMapPins((prev) => prev.filter((p) => p.id !== pinId));
    setMapYarns((prev) =>
      prev.filter((y) => y.fromPinId !== pinId && y.toPinId !== pinId)
    );
  };

  const addMapYarn = (fromPinId, toPinId) => {
    if (!fromPinId || !toPinId || fromPinId === toPinId) return;
    setMapYarns((prev) => {
      const exists = prev.some(
        (y) =>
          (y.fromPinId === fromPinId && y.toPinId === toPinId) ||
          (y.fromPinId === toPinId && y.toPinId === fromPinId)
      );
      if (exists) return prev;
      return [...prev, { id: `yarn_${Date.now()}`, fromPinId, toPinId }];
    });
  };

  const undoMapYarn = () => {
    setMapYarns((prev) => prev.slice(0, -1));
  };

  const resetCase = () => {
    setChats(INITIAL_CHATS);
    setClues(INITIAL_CLUES);
    setNotesUnlocked(false);
    setTypingThreadId(null);
    setMapPins(INITIAL_MAP_PINS);
    setMapYarns(INITIAL_MAP_YARNS);
  };

  const totalUnread = Object.values(chats).reduce((sum, t) => sum + t.unread, 0);

  return (
    <CaseContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        chats,
        clues,
        notesUnlocked,
        typingThreadId,
        mapPins,
        mapYarns,
        addMapPin,
        deleteMapPin,
        addMapYarn,
        undoMapYarn,
        scratchpad,
        setScratchpad,
        totalUnread,
        unlockClue,
        sendReply,
        markThreadRead,
        tryUnlockNotes,
        resetCase,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCase must be used inside CaseProvider");
  return ctx;
}
