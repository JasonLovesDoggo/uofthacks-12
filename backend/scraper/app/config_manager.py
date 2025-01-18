import json
from typing import List, Dict
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time


class ConfigHandler(FileSystemEventHandler):
    def __init__(self, config_path: str):
        self.config_path = config_path
        self.config = self.load_config()

    def start_watching(self, config_path: str):
        observer = Observer()
        observer.schedule(self, path=config_path, recursive=False)
        observer.start()
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()

    def load_config(self) -> List[Dict]:
        with open(self.config_path, "r") as f:
            return json.load(f)

    def on_modified(self, event):
        if event.src_path == self.config_path:
            self.config = self.load_config()
            print("Config file updated.")


def start_config_watcher(config_path: str):
    event_handler = ConfigHandler(config_path)
    observer = Observer()
    observer.schedule(event_handler, path=config_path, recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
