#!/usr/bin/env python3
"""Statischer Server fürs Entwickeln — schickt nichts in den Browser-Cache."""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Service-Worker-Allowed', '/')
        super().end_headers()

    def log_message(self, *args):
        pass


handler = partial(NoCacheHandler, directory=str(ROOT))
print(f'Secret Circle läuft auf http://localhost:{PORT}')
ThreadingHTTPServer(('0.0.0.0', PORT), handler).serve_forever()
