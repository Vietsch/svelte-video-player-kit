<script>
  import VideoGallery from '$lib/VideoGallery.svelte';
  import '$lib/app.scss';

  const demoVideos = [
    {
      src: 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4',
      type: 'video/mp4',
      poster: 'https://storage.googleapis.com/coverr-public/poster/Mt_Baker.jpg',
      thumbnail: 'https://storage.googleapis.com/coverr-public/poster/Mt_Baker.jpg',
      thumbnailLabel: 'Mt Baker'
    },
    {
      src: 'https://storage.googleapis.com/coverr-main/mp4/Beach_Walk.mp4',
      type: 'video/mp4',
      poster: 'https://storage.googleapis.com/coverr-public/poster/Beach_Walk.jpg',
      thumbnail: 'https://storage.googleapis.com/coverr-public/poster/Beach_Walk.jpg',
      thumbnailLabel: 'Beach Walk'
    },
    {
      src: 'https://storage.googleapis.com/coverr-main/mp4/Sunset_Lover.mp4',
      type: 'video/mp4',
      poster: 'https://storage.googleapis.com/coverr-public/poster/Sunset_Lover.jpg',
      thumbnail: 'https://storage.googleapis.com/coverr-public/poster/Sunset_Lover.jpg',
      thumbnailLabel: 'Sunset Lover'
    }
  ];
</script>

<svelte:head>
  <title>Svelte Video Player Kit</title>
</svelte:head>

<main>
  <h1>Svelte Video Player Kit</h1>
  <p>
    This playground uses SvelteKit 2 and Svelte 5. The bundled package lives in <code>src/lib</code> and is exported
    via <code>$lib</code> imports.
  </p>

  <div class="gallery-container">
    <VideoGallery
      items={demoVideos}
      startIndex={0}
      infinite={true}
      showBullets={true}
      showThumbnails={true}
      showFullscreenButton={true}
      showPlayButton={true}
      showNav={true}
      isRTL={false}
      slideDuration={450}
      slideInterval={2000}
      slideOnThumbnailOver={false}
      thumbnailPosition="bottom"
      useWindowKeyDown={true}
      disableSwipe={false}
      disableThumbnailSwipe={false}
      additionalClass="app-video-gallery"
      containInPage={false}
    />
  </div>
</main>

<style>

  main {
    margin: 0 auto;
    padding: 3rem 1.5rem;
    max-width: 960px;
    display: grid;
    gap: 2rem;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.5rem, 3vw, 3.5rem);
    color: #ddd;
  }

  p {
    margin: 0;
    line-height: 1.6;
    color: #ddd;
  }

  .gallery-container {
    margin-top: 50px;
  }

  :global(.app-video-gallery) {
    margin: 0 auto;
    width: 75%;
  }

  @media (max-width: 1024px) {
    :global(.app-video-gallery) {
      width: 100%;
    }
  }

  :global(.app-video-gallery :where(video, img)) {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
