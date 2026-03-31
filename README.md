# companion-module-tallycomm

Bitfocus Companion module for [TallyComm](https://tallycomm.com) — send real-time PGM/PVW tally signals to camera operators via the TallyComm broadcast intercom system. No hardware needed, just smartphones.

## What is TallyComm?

TallyComm is a browser-based broadcast intercom system. Camera operators receive tally signals (PGM/PVW/CLEAR) on their smartphones in real time, along with two-way audio channels (PTT, IFB, party lines). No dedicated hardware, no app store — just a link shared by WhatsApp.

## Installation

Once published to the Companion Module Store:
**Connections** → search **TallyComm** → **Add**

## Configuration

| Field | Description |
|-------|-------------|
| Server | `https://tallycomm.com` (default) |
| Room | Exact room name used by camera operators when joining |

## Actions

| Action | Description |
|--------|-------------|
| Set Camera PGM | Put camera on Program (red) |
| Set Camera PVW | Put camera on Preview (green) |
| Clear Camera | Remove camera from PGM/PVW |
| Clear All | Remove all cameras |
| **⭐ Set PGM + Clear Previous** | PGM + auto-clear previous — best for switcher triggers |
| **⭐ Set PVW + Clear Previous** | PVW + auto-clear previous |

## Feedbacks

- **Camera is PGM** → button turns red
- **Camera is PVW** → button turns green
- **Is Connected** → active when connected to TallyComm

## Variables

| Variable | Description |
|----------|-------------|
| `$(tallycomm:pgm)` | Current PGM camera (0 = none) |
| `$(tallycomm:pvw)` | Current PVW camera (0 = none) |
| `$(tallycomm:room)` | Room name |
| `$(tallycomm:connected)` | `online` / `offline` |

## Compatible Switchers

This module works with **any switcher supported by Companion** via Triggers. The switcher module detects the source change; this module sends the tally to TallyComm.

Tested with: Blackmagic ATEM, OBS Studio, vMix, RGBlink mini-pro, Roland.

### ATEM Example

**Trigger — CAM 1 PGM:**
- WHEN: `bmd-atem` → Program Input Changed → ME=1, Input=1
- DO: `TallyComm` → Set PGM + Clear Previous → Camera=1

With `Set PGM + Clear Previous`, CLEAR triggers are handled automatically.

## Links

- 🌐 [tallycomm.com](https://tallycomm.com)
- 📖 [Integration guide](https://tallycomm.com/guide)
- 🐛 [Issues](https://github.com/noctavoxfilms/companion-module-tallycomm/issues)

## License

MIT
