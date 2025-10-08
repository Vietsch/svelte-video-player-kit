<script>
  export let src;

  function hideOnError(event) {
    event.currentTarget.style.display = "none";
  }
</script>

<style>
  .poster {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>

<img {src} class="poster" alt="poster" on:error={hideOnError} />
