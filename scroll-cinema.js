/**
 * scroll-cinema.js
 * -----------------------------------------------------------------------
 * Renders a pre-extracted JPEG frame sequence onto a fixed, full-viewport
 * <canvas> and steps through frames based on scroll progress (0 → 1 across
 * the whole document), not on a timer. This makes the "video" scrub back
 * and forth exactly in sync with the user's scroll position.
 * -----------------------------------------------------------------------
 */
(function () {
  "use strict";

  var CONFIG = {
    frameFolder: "frames/",
    framePrefix: "frame_",
    frameDigits: 4,
    frameExtension: ".jpg",
    frameCount: 172, // total extracted frames
    canvasId: "scroll-cinema-canvas",
    preloaderId: "cinema-preloader",
    preloaderFillId: "preloader-fill",
    preloaderLabelId: "preloader-label"
  };

  var canvas = document.getElementById(CONFIG.canvasId);
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var preloader = document.getElementById(CONFIG.preloaderId);
  var preloaderFill = document.getElementById(CONFIG.preloaderFillId);
  var preloaderLabel = document.getElementById(CONFIG.preloaderLabelId);

  var frames = [];
  var loadedCount = 0;
  var currentFrameIndex = 0;
  var latestScrollFrameIndex = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var ticking = false;
  var isReady = false;

  function padFrameNumber(n) {
    var s = String(n);
    while (s.length < CONFIG.frameDigits) s = "0" + s;
    return s;
  }

  function frameUrl(n) {
    return CONFIG.frameFolder + CONFIG.framePrefix + padFrameNumber(n) + CONFIG.frameExtension;
  }

  /* ---------------------------------------------------------------------
     Canvas sizing — fixed, full viewport, redraw current frame on resize
     --------------------------------------------------------------------- */
  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    drawFrame(currentFrameIndex, true);
  }

  /* ---------------------------------------------------------------------
     Draw a given frame index, "cover" fit against the viewport
     --------------------------------------------------------------------- */
  function drawFrame(index, force) {
    if (!force && index === currentFrameIndex && isReady) return;

    var img = frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Fall back to nearest loaded frame so the canvas never goes blank
      img = findNearestLoadedFrame(index);
      if (!img) return;
    }

    currentFrameIndex = index;

    var canvasRatio = canvas.width / canvas.height;
    var imgRatio = img.naturalWidth / img.naturalHeight;
    var drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  function findNearestLoadedFrame(index) {
    for (var radius = 1; radius < frames.length; radius++) {
      var before = index - radius;
      var after = index + radius;
      if (frames[before] && frames[before].complete && frames[before].naturalWidth > 0) return frames[before];
      if (frames[after] && frames[after].complete && frames[after].naturalWidth > 0) return frames[after];
    }
    return null;
  }

  /* ---------------------------------------------------------------------
     Scroll → frame mapping
     --------------------------------------------------------------------- */
  function getScrollProgress() {
    var doc = document.documentElement;
    var scrollTop = window.pageYOffset || doc.scrollTop || 0;
    var maxScroll = (doc.scrollHeight - window.innerHeight) || 1;
    var progress = scrollTop / maxScroll;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;
    return progress;
  }

  function onScroll() {
    var progress = getScrollProgress();
    latestScrollFrameIndex = Math.round(progress * (CONFIG.frameCount - 1));

    if (!ticking) {
      window.requestAnimationFrame(function () {
        drawFrame(latestScrollFrameIndex, false);
        ticking = false;
      });
      ticking = true;
    }
  }

  /* ---------------------------------------------------------------------
     Preload every frame before enabling scroll-scrubbing, so the sequence
     never flickers or shows blank frames while scrolling.
     --------------------------------------------------------------------- */
  function updatePreloaderProgress() {
    var pct = Math.round((loadedCount / CONFIG.frameCount) * 100);
    if (preloaderFill) preloaderFill.style.width = pct + "%";
    if (preloaderLabel) preloaderLabel.textContent = "Loading scene… " + pct + "%";
  }

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("is-hidden");
    window.setTimeout(function () {
      if (preloader && preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
    }, 700);
  }

  function frameLoaded() {
    loadedCount++;
    updatePreloaderProgress();

    // As soon as the very first frame lands, paint it so there's never a
    // blank canvas, even before the rest finish preloading.
    if (loadedCount === 1) {
      resizeCanvas();
    }

    if (loadedCount >= CONFIG.frameCount) {
      isReady = true;
      hidePreloader();
      onScroll(); // sync to current scroll position immediately
    }
  }

  function preloadFrames() {
    for (var i = 0; i < CONFIG.frameCount; i++) {
      var img = new Image();
      img.decoding = "async";
      img.onload = frameLoaded;
      img.onerror = frameLoaded; // don't let one missing frame block the rest
      img.src = frameUrl(i + 1); // files are frame_0001.jpg .. frame_0121.jpg (1-indexed)
      frames[i] = img;
    }
  }

  /* ---------------------------------------------------------------------
     Init
     --------------------------------------------------------------------- */
  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  resizeCanvas();
  preloadFrames();

  // Safety net: if something goes wrong with loading, don't trap the user
  // behind the preloader forever.
  window.setTimeout(function () {
    if (!isReady) {
      isReady = true;
      hidePreloader();
    }
  }, 12000);
})();
