<script>
  import { onMount, onDestroy } from "svelte";
  import { screenfull } from "./libs/screenfull.js";

  export let element;
  export let isFullscreen;
  export let isFullscreenEnabled;

  // Browser check without $app/environment
  const isBrowser = typeof window !== 'undefined';

  isFullscreenEnabled = isBrowser && screenfull.isEnabled;
  if (isFullscreenEnabled) screenfull.on("change", onChange);

  function onChange(e) {
    if (element == e.target) isFullscreen = screenfull.isFullscreen;
  }

  $: {
    if (isFullscreenEnabled)
      isFullscreen ? screenfull.request(element) : screenfull.exit();
  }

  onMount(() => {
    if (isBrowser && window.screenfull) {
      // Any additional browser-specific initialization
    }
  });

  onDestroy(() => {
    if (isFullscreenEnabled) {
      screenfull.off("change", onChange);
    }
  });
</script>