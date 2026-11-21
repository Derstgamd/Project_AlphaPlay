"use client";

import FilesApp from "./apps/FilesApp";
import MapApp from "./apps/MapApp";
import MessagesApp from "./apps/MessagesApp";
import NotesApp from "./apps/NotesApp";
import PhotosApp from "./apps/PhotosApp";
import BrowserApp from "./apps/BrowserApp";
import TerminalApp from "./apps/TerminalApp";

export const APP_COMPONENTS = {
  messages: MessagesApp,
  photos: PhotosApp,
  notes: NotesApp,
  files: FilesApp,
  map: MapApp,
  browser: BrowserApp,
  terminal: TerminalApp,
};

// Order used for docks and home screens.
export const APP_ORDER = ["messages", "browser", "map", "notes", "photos", "files", "terminal"];

// Default laptop window sizes.
export const WINDOW_SIZE = {
  messages: [680, 420],
  photos: [700, 420],
  notes: [640, 400],
  files: [640, 400],
  map: [720, 440],
  browser: [740, 460],
  terminal: [620, 380],
};
