# AcademicPortfolio — Scroll-Cinema Edition

A full recreation of the Stitch/Figma "Academic Innovation" design, with a
scroll-driven video-frame background layered behind glass-panel sections.

## Structure

```
index.html
css/style.css        → full design system (colors, type, spacing) + glass panels
js/script.js          → nav, reveal-on-scroll, contact form handling
js/scroll-cinema.js   → preloads frames/ and scrubs them based on scroll position
frames/                → 121 JPEG frames (frame_0001.jpg … frame_0121.jpg), 1920×1080, 12fps
images/                → reserved for local design assets (currently unused — see note)
```

## How the scroll-video background works

`js/scroll-cinema.js` preloads every JPEG in `frames/`, then on every scroll
event computes `scrollTop / (documentHeight - viewportHeight)` (0 → 1) and
maps that directly to a frame index. There is no `setInterval`/timer — the
frame only changes when the user scrolls, so scrolling up plays the frames
backwards. All frames are preloaded up front (with a progress bar) so
scrubbing never flickers.

To swap in your own footage: replace the files in `frames/` with your own
sequence named `frame_0001.jpg`, `frame_0002.jpg`, … and update
`frameCount` in `js/scroll-cinema.js` to match.

## Images

The hero portrait and two project thumbnails are hot-linked from the
original Stitch/Figma export's asset URLs (Google's `lh3.googleusercontent.com`
CDN), the same way the original Figma export referenced them. If you'd
rather self-host them, download the three images into `images/` and update
the `src`/`background-image` values in `index.html` accordingly.

## Deploying

This is a static site — drop the whole folder into a GitHub repo with
`index.html` at the root and enable GitHub Pages (or drag the folder into
Netlify/Vercel). No build step required.
