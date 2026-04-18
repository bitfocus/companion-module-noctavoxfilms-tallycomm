## TallyComm

Send PGM/PVW tally to smartphone cameras via [TallyComm](https://tallycomm.com) — a SaaS broadcast intercom that turns phones into camera tally lights plus intercom, without extra hardware.

### Getting started

1. On your producer device, open **tallycomm.com/setup** and activate an event. You will get:
   - A **Room Code** (e.g. `SHOW-2026`)
   - A **PIN** for each team member
   - An **API Key** for switcher integrations (this module)
2. In Companion, add a **TallyComm** connection and fill in:
   - **Server URL** — leave as `https://tallycomm.com` unless self-hosted
   - **Room / Event code** — exactly as shown in setup (case-sensitive on the room the camera operators connect to)
   - **API Key** — paste the `tk_...` key shown in setup. Leave empty only if the server does not require one.
3. Press **Save**. The connection status should turn green within a few seconds.

### Rotating the API Key

If the key leaks or you want to revoke it, the director can rotate it from the **TEAM ACCESS** panel on `tallycomm.com/director`. A new key will be generated instantly and the old one will stop working — update it in this module's config to resume tally.

### Actions

| Action | Description |
|--------|-------------|
| **Set Camera PGM** | Put a camera on Program (red on the phone) |
| **Set Camera PVW** | Put a camera on Preview (yellow on the phone) |
| **Clear Camera** | Remove a specific camera from PGM and PVW |
| **Clear All** | Remove every camera from PGM and PVW |
| **Set PGM + Clear Previous** | Put one camera on PGM and automatically clear the previous one (most useful for switcher triggers) |
| **Set PVW + Clear Previous** | Same pattern, for Preview |

### Feedbacks

| Feedback | Description |
|----------|-------------|
| **Camera is PGM** | Boolean — true while the camera is on Program |
| **Camera is PVW** | Boolean — true while the camera is on Preview |
| **Is Connected** | Boolean — true when the module can reach TallyComm |

### Variables

| Variable | Value |
|----------|-------|
| `$(tc:pgm)` | Current PGM camera number (0 = none) |
| `$(tc:pvw)` | Current PVW camera number (0 = none) |
| `$(tc:room)` | Room code currently configured |
| `$(tc:connected)` | `online` or `offline` |

### Troubleshooting

- **Connection is red / "Unreachable"**: check Server URL is correct and the server responds at `/health`.
- **"Invalid API Key" (401)**: re-copy the key from setup or director panel. Keys have a `tk_` prefix.
- **Tally shows on my phone but wrong camera number**: the `camera` option in the action must match the camera number assigned to the operator in setup (CAM 1, CAM 2, etc.), not the input on the switcher.
