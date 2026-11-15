# AI Policy Builder — Workshop edition

A self-contained, static web app. No build step, no backend, and no API keys.

## Run it

Open `index.html` in a modern browser, or from this folder run:

```bash
python3 -m http.server 8765
```

Then visit http://localhost:8765/

On a phone, use the same Wi-Fi as the computer and open `http://YOUR-LAN-IP:8765/`. A QR code pointing at that address is enough for the workshop.

## What it does

Attendees answer 13 questions in four short steps and get a 1–2 page AI usage policy tailored to their business. They can download a Word file, copy the text, or print / save a PDF. The policy is filled in the browser from a fixed template — there is no AI call, so the demo is reliable offline.

The optional email field is stored only in this browser (`localStorage`). Nothing is sent.

## Rebrand

Change the name and “Workshop edition” subtitle in `index.html`, and the color tokens at the top of `styles.css`.
