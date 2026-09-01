#!/usr/bin/env python3
"""Entwicklungsserver ohne Browser-Cache — startet im Projektordner."""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def log_message(self, *args):
        pass


print(f'Secret Circle: http://localhost:{PORT}')
ThreadingHTTPServer(('0.0.0.0', PORT), NoCache).serve_forever()
