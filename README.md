# AcademicPortfolio — Scroll-Cinema Edition

A full recreation of the Stitch/Figma "Academic Innovation" design, with a
scroll-driven video-frame background layered behind glass-panel sections.

## Structure

```
index.html
style.css            → full design system (colors, type, spacing) + glass panels
script.js             → nav, reveal-on-scroll, contact form handling
scroll-cinema.js      → preloads frames-N/ folders and scrubs them based on scroll position
images/                → local SVG illustrations (hero + project thumbnails)
frames-1/              → frame001.jpg – frame100.jpg
frames-2/              → frame101.jpg – frame172.jpg
```

Frames are split 100-per-folder (frames-1, frames-2, frames-3, …) purely so
they're easy to drag-and-drop into GitHub's web uploader, which caps out at
100 files per upload. `scroll-cinema.js` reconstructs the right folder for
any frame number automatically — you never edit paths by hand.

## How the scroll-video background works

`scroll-cinema.js` preloads every JPEG across the `frames-N/` folders, then
on every scroll event computes `scrollTop / (documentHeight - viewportHeight)`
(0 → 1) and maps that directly to a frame index. There is no
`setInterval`/timer — the frame only changes when the user scrolls, so
scrolling up plays the frames backwards. All frames are preloaded up front
(with a progress bar) so scrubbing never flickers.

To swap in your own footage: replace the images in `frames-1/`, `frames-2/`,
etc., keeping the `frameNNN.jpg` naming and 100-per-folder split, then update
`frameCount` in `scroll-cinema.js` to match your total frame count.

## Uploading to GitHub without git

1. Drag `index.html`, `style.css`, `script.js`, `scroll-cinema.js`, and
   `images/` into your repo and commit.
2. Create/open a `frames-1` folder in the repo, drag in the 100 files from
   your local `frames-1/`, commit.
3. Repeat for `frames-2` (and any further `frames-N` folders).

## Deploying

This is a static site — drop the whole folder into a GitHub repo with
`index.html` at the root and enable GitHub Pages (or drag the folder into
Netlify/Vercel). No build step required.
