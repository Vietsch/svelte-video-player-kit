<script lang="ts">
  import VideoPlayer from 'svelte-video-player';

  // Spread all props from the original VideoPlayer
  export let width: number | string;
  export let height: number | string;
  export let poster: string;
  export let source: string | string[];
  export let playerBgColor: string | undefined = undefined;
  export let chunkBars: boolean | undefined = undefined;
  export let skipSeconds: number | string | undefined = undefined;
  export let loop: boolean | undefined = undefined;
  export let controlsHeight: string | undefined = undefined;
  export let thumbSize: string | undefined = undefined;
  export let trackHeight: string | undefined = undefined;
  export let centerIconSize: string | undefined = undefined;
  export let borderRadius: string | undefined = undefined;
  export let color: string | undefined = undefined;
  export let barsBgColor: string | undefined = undefined;
  export let iconColor: string | undefined = undefined;
  export let focusColor: string | undefined = undefined;
  export let bufferedColor: string | undefined = undefined;
  export let controlsOnPause: boolean | undefined = undefined;
  export let timeDisplay: boolean | undefined = undefined;
</script>

<div 
  role="region" 
  aria-label="Video Player" 
  tabindex="-1"
>
  <VideoPlayer
    {width}
    {height}
    {poster}
    {source}
    {playerBgColor}
    {chunkBars}
    {skipSeconds}
    {loop}
    {controlsHeight}
    {thumbSize}
    {trackHeight}
    {centerIconSize}
    {borderRadius}
    {color}
    {barsBgColor}
    {iconColor}
    {focusColor}
    {bufferedColor}
    {controlsOnPause}
    {timeDisplay}
  />
</div> 