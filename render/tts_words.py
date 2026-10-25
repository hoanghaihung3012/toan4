"""Edge TTS helper: one line of text -> MP3 + word timings (JSON).

The only Python in the project: Microsoft's Edge TTS endpoint currently rejects the Node
clients, and the maintained `edge-tts` package is Python. render/voice.mjs calls this.

  .venv/bin/python render/tts_words.py <voice> <rate> <text> <out.mp3> <out.json>
"""
import asyncio
import json
import os
import ssl
import sys

import edge_tts
import edge_tts.communicate

# behind an HTTPS proxy (cloud sessions): route through it and trust its CA bundle
PROXY = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
if PROXY and os.environ.get("SSL_CERT_FILE"):
    edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile=os.environ["SSL_CERT_FILE"])


async def main(voice, rate, text, mp3, out):
    words = []
    com = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary", proxy=PROXY)
    with open(mp3, "wb") as f:
        async for chunk in com.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                # offsets are in 100 ns ticks
                words.append({"text": chunk["text"], "start": chunk["offset"] / 1e7,
                              "end": (chunk["offset"] + chunk["duration"]) / 1e7})
    with open(out, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    asyncio.run(main(*sys.argv[1:6]))
