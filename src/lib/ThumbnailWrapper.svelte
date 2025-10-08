<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { getIgThumbnailClass, getThumbnailStyle, getThumbsTranslate } from './styling';

  export let items = [];
  export let currentIndex = 0;
  export let useTranslate3D = true;
  export let isRTL = false;
  export let thumbnailPosition = 'bottom';
  export const stopPropagation = false;
  export let disableThumbnailScroll = false;
  export const disableThumbnailSwipe = false;
  export let slideDuration = 450;
  export let swipingThumbnailTransitionDuration = 0;
  export let gallerySlideWrapperHeight = 1000;

  let isSwipingThumbnail = false;
  let isSwipedThumbnail = false;

  let elem: Element;
  let thumbnails: HTMLElement;

  let thumbnailsWrapperWidth = 0;
  let thumbnailsWrapperHeight = 0;
  let thumbsElementScrollHeight = 0;
  let thumbsElementScrollWidth = 0;

  $: isThumbnailVertical = thumbnailPosition === 'left' || thumbnailPosition === 'right';

  let thumbsTranslate = 0;
  let thumbsSwipedTranslate = 0;

  $: thumbsStyle = `transition: all ${
    isSwipingThumbnail ? swipingThumbnailTransitionDuration : slideDuration
  }ms ease-out;`;

  $: thumbnailStyle = getThumbnailStyle(
    isRTL,
    thumbsTranslate,
    isThumbnailVertical,
    useTranslate3D,
    thumbsStyle
  );

  export function getElem() {
    return elem;
  }

  export function resetSwipingThumbnail() {
    isSwipedThumbnail = false;
  }

  export function handleResizeWidth(newWidth: number) {
    thumbnailsWrapperWidth = newWidth;
    handleResize();
  }

  export function handleResizeHeight(newHeight: number) {
    thumbnailsWrapperHeight = newHeight;
    handleResize();
  }

  function handleResize() {
    if (!items || !thumbnails) {
      return;
    }
    
    thumbsTranslate = getThumbsTranslate(
      thumbnails,
      currentIndex,
      disableThumbnailScroll,
      thumbnailsWrapperWidth,
      thumbnailsWrapperHeight,
      isThumbnailVertical,
      items.length
    );
    thumbsElementScrollWidth = thumbnails.scrollWidth;
    thumbsElementScrollHeight = thumbnails.scrollHeight;
  }

  export function slideThumbnailBar(newIndex: number) {
    if (!items || !thumbnails) {
      return;
    }
    
    const nextTranslate = -getThumbsTranslate(
      thumbnails,
      newIndex,
      disableThumbnailScroll,
      thumbnailsWrapperWidth,
      thumbnailsWrapperHeight,
      isThumbnailVertical,
      items.length
    );
    if (isSwipedThumbnail) {
      return;
    }

    if (newIndex === 0) {
      thumbsTranslate = 0;
      thumbsSwipedTranslate = 0;
    } else {
      thumbsTranslate = nextTranslate;
      thumbsSwipedTranslate = nextTranslate;
    }
  }

  $: getThumbnailBarHeight = () => {
    if (isThumbnailVertical) {
      return `height: ${gallerySlideWrapperHeight}px;`;
    }
    return '';
  };

  $: igThumbnailClasses = items ? items.map((item, index) =>
    getIgThumbnailClass(index, currentIndex, item.thumbnailClass)
  ) : [];

  const dispatch = createEventDispatcher();

  export function resetThumbnailPosition() {
    if (thumbnails) {
      thumbsTranslate = 0;
      thumbsSwipedTranslate = 0;
    }
  }
</script>

<div class="image-gallery-thumbnails" bind:this={elem} style={getThumbnailBarHeight()}>
  <nav
    bind:this={thumbnails}
    class="image-gallery-thumbnails-container"
    style={thumbnailStyle}
    aria-label="Thumbnail Navigation"
  >
    {#each items || [] as item, index}
      <button
        class="image-gallery-thumbnail {igThumbnailClasses[index]}"
        class:active={index === currentIndex}
        on:click={() => dispatch('slidejump', index)}
        on:mouseover={() => dispatch('thumbnailmouseover', index)}
        on:mouseleave={() => dispatch('thumbnailmouseleave', index)}
        on:focus={() => dispatch('thumbnailmouseover', index)}
        on:blur={() => dispatch('thumbnailmouseleave', index)}
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            dispatch('slidejump', index);
          }
        }}
        aria-label="Go to video {index + 1}"
        type="button"
      >
        <div class="image-gallery-thumbnail-inner">
          {#if item.thumbnail}
            <img
              class="image-gallery-thumbnail-image"
              src={item.thumbnail}
              alt="Video thumbnail {index + 1}"
            />
          {:else if item.poster}
            <img
              class="image-gallery-thumbnail-image"
              src={item.poster}
              alt="Video thumbnail {index + 1}"
            />
          {:else}
            <div class="image-gallery-thumbnail-placeholder">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M8 5v14l11-7z" fill="currentColor"/>
              </svg>
            </div>
          {/if}
          {#if item.thumbnailLabel}
            <div class="image-gallery-thumbnail-label">
              {item.thumbnailLabel}
            </div>
          {/if}
        </div>
      </button>
    {/each}
  </nav>
</div>

<style>
  .image-gallery-thumbnail-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #333;
    color: #fff;
  }
</style>
