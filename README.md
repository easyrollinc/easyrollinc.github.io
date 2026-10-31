# easyrollinc.github.io

Workshop draft of the Easy Roll Automation homepage. GitHub Pages serves this repository as static files (`.nojekyll` is present, so there is no Jekyll build).

## Shop-floor stats

The stats strip reads [`data/stats.json`](data/stats.json) in the browser. Fixture counts, program counts, and years on the shop floor are not written into `index.html`.

```json
{
  "fixtures_delivered": 1041,
  "programs_supported": 172,
  "founded_year": 2015,
  "last_updated": "2026-10-31"
}
```

| Field | What it does |
| --- | --- |
| `fixtures_delivered` | Number shown for fixtures delivered. **Not confirmed by the owner.** |
| `programs_supported` | Number shown for programs supported. **Not confirmed by the owner.** |
| `founded_year` | Earliest proven year on the shop floor, set to **2015** by Brandon. The page does not store a year count. |
| `last_updated` | Date this file was last edited, as `YYYY-MM-DD`. |

### Years on the shop floor

When the page loads, the browser computes:

```text
years = current calendar year − founded_year
```

The calendar year is the visitor's local year (`Date#getFullYear()`). With `founded_year` at 2015, the strip shows 11 during 2026 and 12 during 2027. Do not type a year count into the HTML, CSS, or JavaScript.

### How a bot updates stats.json

1. Branch off `main`. Do not commit to `main`.
2. Edit only `data/stats.json`.
3. Change the value the owner confirmed. Leave the other numbers alone.
4. Set `last_updated` to the date of the edit (`YYYY-MM-DD`).
5. Open a pull request that names what changed. If `fixtures_delivered` or `programs_supported` is still the placeholder, say that the owner has not confirmed it.
6. Do not merge the pull request yourself.

The page fetches `data/stats.json` with `cache: "no-store"`, so a merged edit shows up without a layout change.

## Wording and layout

Visible copy is in `index.html`. Presentation is in `assets/css/site.css`. Motion is in `assets/js/motion.js`. The quote button opens an email in `assets/js/rfq.js` and does not upload files. To change wording, edit the text in `index.html` and leave the stylesheet and scripts alone unless the layout itself is changing.

## Leave these alone

- `CNAME`
- `.well-known/` (Tesla public key)
- `privacy-policy.html`
- `terms-of-service.html`
- GitHub Pages settings

This draft does not add analytics or a third-party form service.
