<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import VideoPlayer from './VideoPlayer.svelte';
  import ThumbnailWrapper from './ThumbnailWrapper.svelte';
  import { getIgClass, getIgContentClass, getSlideWrapperClass } from './styling';

  export let items = []; // Array of video items with src, poster, etc.
  export let startIndex = 0;
  export let infinite = true;
  export let showBullets = true;
  export let showThumbnails = true;
  export let showFullscreenButton = true;
  export const showPlayButton = true;
  export let showNav = true;
  export let isRTL = false;
  export let slideDuration = 450;
  export const slideInterval = 2000;
  export let slideOnThumbnailOver = false;
  export let thumbnailPosition = 'bottom';
  export let useWindowKeyDown = true;
  export const disableSwipe = false;
  export let disableThumbnailSwipe = false;
  export let additionalClass = '';
  export let containInPage = false;

  // Video player specific props
  export let width = 1920;
  export let height = 1080;
  export let controlsHeight = '55px';
  export let trackHeight = '6px';
  export let thumbSize = '15px';
  export let centerIconSize = '60px';
  export let playerBgColor = 'black';
  export let color = '#FF3E00';
  export let focusColor = 'white';
  export let barsBgColor = 'white';
  export let iconColor = 'white';
  export let bufferedColor = '#FF9600';
  export let chunkBars = false;
  export let borderRadius = '8px';
  export let loop = false;
  export let skipSeconds = 5;
  export let controlsOnPause = true;
  export let timeDisplay = false;

  let currentIndex = startIndex;
  let isFullscreen = false;
  let isPlaying = false;
  let isTransitioning = false;
  let galleryWidth = 1000;
  let gallerySlideWrapperHeight = 1000;
  let containerHeight: number | undefined;
  let parentElement: HTMLElement | null = null;

  // Component bindings
  let videoGallery: HTMLElement;
  let slideWrapper: HTMLElement;
  let thumbnailWrapper: ThumbnailWrapper;

  const dispatch = createEventDispatcher();

  $: canSlidePrevious = currentIndex > 0;
  $: canSlideNext = currentIndex < items.length - 1;
  $: canSlideLeft = infinite || (isRTL ? canSlideNext : canSlidePrevious);
  $: canSlideRight = infinite || (isRTL ? canSlidePrevious : canSlideNext);

  $: igClass = getIgClass(false, additionalClass, 'mouse');
  $: igContentClass = getIgContentClass(isFullscreen, thumbnailPosition);
  $: slideWrapperClass = getSlideWrapperClass(isRTL, thumbnailPosition);

  function slideLeft() {
    slideTo(isRTL ? 'right' : 'left');
  }

  function slideRight() {
    slideTo(isRTL ? 'left' : 'right');
  }

  function slideTo(direction: 'left' | 'right') {
    const nextIndex = currentIndex + (direction === 'left' ? -1 : 1);
    slideToIndex(nextIndex);
  }

  export function slideToIndex(index: number) {
    if (!isTransitioning) {
      const slideCount = items.length - 1;
      let nextIndex = index;
      if (index < 0) {
        nextIndex = slideCount;
      } else if (index > slideCount) {
        nextIndex = 0;
      }
      if (nextIndex !== currentIndex) {
        dispatch('beforeslide', { nextIndex });
      }

      isTransitioning = nextIndex !== currentIndex;
      currentIndex = nextIndex;
      if (thumbnailWrapper) {
        thumbnailWrapper.slideThumbnailBar(currentIndex);
      }
      onSliding();
    }
  }

  function onSliding() {
    setTimeout(() => {
      if (isTransitioning) {
        isTransitioning = false;
        if (thumbnailWrapper) {
          thumbnailWrapper.resetSwipingThumbnail();
        }
        dispatch('slide', { currentIndex });
      }
    }, slideDuration + 50);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'ArrowLeft' && canSlideLeft) {
      slideLeft();
    } else if (event.code === 'ArrowRight' && canSlideRight) {
      slideRight();
    } else if (event.code === 'Escape' && isFullscreen) {
      _exitFullScreen();
    }
  }

  function handleMouseDown() {
    // Track mouse usage for accessibility
  }

  function toggleFullscreen() {
    if (isFullscreen) {
      _exitFullScreen();
    } else {
      _fullScreen();
    }
  }

  function _fullScreen() {
    isFullscreen = true;
    if (thumbnailWrapper) {
      thumbnailWrapper.slideThumbnailBar(currentIndex);
    }
    dispatch('screenchange', { fullscreen: true });
  }

  function _exitFullScreen() {
    isFullscreen = false;
    slideToIndex(0);
    dispatch('screenchange', { fullscreen: false });
  }

  function handleThumbnailMouseOver(event: CustomEvent<number>) {
    if (!slideOnThumbnailOver) return;
    const index = event.detail;
    setTimeout(() => {
      slideToIndex(index);
    }, 300);
  }

  function handleThumbnailMouseLeave() {
    // Handle thumbnail mouse leave if needed
  }

  function updateContainerHeight() {
    if (containInPage && parentElement) {
      const parentRect = parentElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(parentElement);
      const verticalMargins = parseFloat(computedStyle.marginTop) + 
                            parseFloat(computedStyle.marginBottom);
      
      containerHeight = parentRect.height - verticalMargins;
    } else {
      containerHeight = undefined;
    }
  }

  onMount(() => {
    parentElement = videoGallery?.parentElement ?? null;
    let resizeObserver: ResizeObserver | null = null;

    if (parentElement) {
      updateContainerHeight();
      resizeObserver = new ResizeObserver(() => {
        updateContainerHeight();
      });
      resizeObserver.observe(parentElement);
    }

    return () => {
      resizeObserver?.disconnect();
    };
  });
</script>

<div
  class={igClass}
  aria-live="polite"
  role="region"
  bind:this={videoGallery}
  style={containInPage ? `max-height: ${containerHeight}px;` : ''}
  class:contain-in-page={containInPage || isFullscreen}
  class:fullscreen-portrait={isFullscreen && typeof window !== 'undefined' && window.screen?.orientation?.type?.includes('portrait')}
  class:fullscreen-landscape={isFullscreen && typeof window !== 'undefined' && window.screen?.orientation?.type?.includes('landscape')}
>
  <div class={igContentClass}>
    {#if thumbnailPosition === 'bottom' || thumbnailPosition === 'right'}
      <div class={slideWrapperClass} bind:this={slideWrapper}>
        <!-- Navigation arrows -->
        {#if showNav && items.length > 1}
          <button 
            class="image-gallery-left-nav" 
            on:click={slideLeft}
            disabled={!canSlideLeft}
            aria-label="Previous video"
          >
            <svg class="image-gallery-svg" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button 
            class="image-gallery-right-nav" 
            on:click={slideRight}
            disabled={!canSlideRight}
            aria-label="Next video"
          >
            <svg class="image-gallery-svg" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        {/if}

        <!-- Main video area -->
        <div class="image-gallery-slides">
          <div class="image-gallery-slide image-gallery-center">
            <VideoPlayer
              width={width}
              height={height}
              poster={items[currentIndex]?.poster || ''}
              source={items[currentIndex]?.src ? [{ src: items[currentIndex].src, type: items[currentIndex].type || 'video/mp4' }] : []}
              {controlsHeight}
              {trackHeight}
              {thumbSize}
              {centerIconSize}
              {playerBgColor}
              {color}
              {focusColor}
              {barsBgColor}
              {iconColor}
              {bufferedColor}
              {chunkBars}
              {borderRadius}
              {loop}
              {skipSeconds}
              {controlsOnPause}
              {timeDisplay}
              showFullscreenButton={false}
              showBullets={false}
            />
          </div>
        </div>

        <!-- Bullets navigation -->
        {#if showBullets && items.length > 1}
          <div class="image-gallery-bullets">
            <div class="image-gallery-bullets-container" role="navigation" aria-label="Bullet Navigation">
              {#each items as _, index}
                <button
                  class="image-gallery-bullet"
                  class:active={index === currentIndex}
                  on:click={() => slideToIndex(index)}
                  aria-label="Go to video {index + 1}"
                ></button>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Fullscreen button -->
        {#if showFullscreenButton}
          <button 
            class="image-gallery-fullscreen-button" 
            on:click={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            <svg class="image-gallery-svg" viewBox="0 0 24 24">
              {#if isFullscreen}
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
              {:else}
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              {/if}
            </svg>
          </button>
        {/if}
      </div>
    {/if}

    <!-- Thumbnails -->
    {#if showThumbnails && items.length > 1}
      <ThumbnailWrapper
        bind:this={thumbnailWrapper}
        {items}
        {currentIndex}
        useTranslate3D={true}
        {isRTL}
        {thumbnailPosition}
        {slideDuration}
        disableThumbnailScroll={false}
        stopPropagation={false}
        swipingThumbnailTransitionDuration={0}
        {disableThumbnailSwipe}
        {gallerySlideWrapperHeight}
        on:slidejump={(event) => {
          slideToIndex(event.detail);
        }}
        on:thumbnailmouseover={handleThumbnailMouseOver}
        on:thumbnailmouseleave={handleThumbnailMouseLeave}
      />
    {/if}

    {#if thumbnailPosition === 'top' || thumbnailPosition === 'left'}
      <div class={slideWrapperClass} bind:this={slideWrapper}>
        <!-- Navigation arrows -->
        {#if showNav && items.length > 1}
          <button 
            class="image-gallery-left-nav" 
            on:click={slideLeft}
            disabled={!canSlideLeft}
            aria-label="Previous video"
          >
            <svg class="image-gallery-svg" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button 
            class="image-gallery-right-nav" 
            on:click={slideRight}
            disabled={!canSlideRight}
            aria-label="Next video"
          >
            <svg class="image-gallery-svg" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        {/if}

        <!-- Main video area -->
        <div class="image-gallery-slides">
          <div class="image-gallery-slide image-gallery-center">
            <VideoPlayer
              width={width}
              height={height}
              poster={items[currentIndex]?.poster || ''}
              source={items[currentIndex]?.src ? [{ src: items[currentIndex].src, type: items[currentIndex].type || 'video/mp4' }] : []}
              {controlsHeight}
              {trackHeight}
              {thumbSize}
              {centerIconSize}
              {playerBgColor}
              {color}
              {focusColor}
              {barsBgColor}
              {iconColor}
              {bufferedColor}
              {chunkBars}
              {borderRadius}
              {loop}
              {skipSeconds}
              {controlsOnPause}
              {timeDisplay}
              showFullscreenButton={false}
              showBullets={false}
            />
          </div>
        </div>

        <!-- Bullets navigation -->
        {#if showBullets && items.length > 1}
          <div class="image-gallery-bullets">
            <div class="image-gallery-bullets-container" role="navigation" aria-label="Bullet Navigation">
              {#each items as _, index}
                <button
                  class="image-gallery-bullet"
                  class:active={index === currentIndex}
                  on:click={() => slideToIndex(index)}
                  aria-label="Go to video {index + 1}"
                ></button>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Fullscreen button -->
        {#if showFullscreenButton}
          <button 
            class="image-gallery-fullscreen-button" 
            on:click={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            <svg class="image-gallery-svg" viewBox="0 0 24 24">
              {#if isFullscreen}
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
              {:else}
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              {/if}
            </svg>
          </button>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* Fullscreen mobile styles */
  .fullscreen-portrait :global(video) {
    max-height: 100vh !important;
    max-width: 100vw !important;
    width: auto !important;
    height: auto !important;
    object-fit: contain !important;
  }
  
  .fullscreen-landscape :global(video) {
    max-width: 100vw !important;
    max-height: 100vh !important;
    width: auto !important;
    height: auto !important;
    object-fit: contain !important;
  }
  
  /* Ensure fullscreen container takes full viewport */
  .fullscreen-portrait,
  .fullscreen-landscape {
    width: 100vw !important;
    height: 100vh !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: black !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Ensure content fills available space */
  .fullscreen-portrait :global(.image-gallery-content),
  .fullscreen-landscape :global(.image-gallery-content) {
    width: 100% !important;
    height: 100% !important;
  }
</style>

<svelte:window
  on:keydown={useWindowKeyDown ? handleKeyDown : undefined}
  on:mousedown={handleMouseDown}
/>
