# FullPortDEV Fork of Svelte Video Player Kit

## Why this fork exists
The original package was missing fixes for modern SvelteKit and SSR scenarios. This fork keeps the component updated and now ships with a Svelte 5 / SvelteKit 2 toolchain powered by `@sveltejs/package`.

## Installation

```bash
npm install @fullportdev/svelte-video-player-kit
# or
pnpm add @fullportdev/svelte-video-player-kit
# or
yarn add @fullportdev/svelte-video-player-kit
```

## Development workflow
- Requires Node 18.13+ (Node 20 recommended; see `.nvmrc`).
- `npm run dev` – run the local SvelteKit playground at `http://localhost:5173`
- `npm run sync` – regenerate SvelteKit's build artifacts (run automatically before `npm run check`)
- `npm run check` – type and template checks
- `npm run package` – build the distributable package into `./package`
- `npm run build` – Vite production build for the playground (not required for publishing)
- `npm run prepublishOnly` – runs `check` + `package` before publishing

Publishing now uses `publishConfig.directory = "package"`, so `npm publish` from the repo root will publish the generated package after `npm run package` completes.

## Usage

Import the bundled `VideoPlayer` Svelte component from the package. The component is SSR‑safe and works in Svelte 3/4/5 as well as SvelteKit 2+ projects.

```svelte
<script>
  import VideoPlayer from '@fullportdev/svelte-video-player-kit';

  const poster = 'https://www.server.com/poster.jpg';
  const source = [
    'https://www.server.com/video.webm',
    'https://www.server.com/video.mp4',
    'https://www.server.com/video.ogv'
  ];
</script>

<VideoPlayer {poster} {source} width={1920} height={1080} chunkBars />
```

A live playground is included in `src/routes/+page.svelte` when running `npm run dev`.

> **Note:** Legacy UMD builds previously available on unpkg are no longer produced. If you need that distribution format, stay on an older release.

## Props

| Prop name       | Type                                | Default value          | Description                                                                                                 |
| :-------------- | :---------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| width           | <code>string &#124; number</code>   | <code>1920</code>      | Real width of video for calculating aspect ratio for responsive design                                      |
| height          | <code>string &#124; number</code>   | <code>1080</code>      | Real height of video for calculating aspect ratio for responsive design                                     |
| poster          | <code>string</code>                 | <code>''</code>        | Absolute or relative URL of poster image                                                                    |
| source          | <code>string &#124; string[]</code> | <code>''</code>        | Absolute or relative URL (or array of those) of video source. Supported formats are `webm`, `mp4` and `ogg` |
| controlsHeight  | <code>string</code>                 | <code>'55px'</code>    | Height of bottom control bar, rescaling included components                                                 |
| trackHeight     | <code>string</code>                 | <code>'6px'</code>     | Height of playbar and volume slider tracks                                                                  |
| thumbSize       | <code>string</code>                 | <code>'15px'</code>    | Size of playbar and volume slider thumb                                                                     |
| centerIconSize  | <code>string</code>                 | <code>'60px'</code>    | Size of center icon                                                                                         |
| playerBgColor   | <code>string</code>                 | <code>'black'</code>   | Color of player background                                                                                  |
| color           | <code>string</code>                 | <code>'#FF3E00'</code> | Main color of control components                                                                            |
| focusColor      | <code>string</code>                 | <code>'white'</code>   | Color of focus outlines                                                                                     |
| barsBgColor     | <code>string</code>                 | <code>'white'</code>   | Background color of playbar and volume slider tracks                                                        |
| iconColor       | <code>string</code>                 | <code>'white'</code>   | Color of button icons                                                                                       |
| bufferedColor   | <code>string</code>                 | <code>'#FF9600'</code> | Color of buffered chunks                                                                                    |
| borderRadius    | <code>string</code>                 | <code>'8px'</code>     | Rounded corner radius of the player                                                                         |
| skipSeconds     | <code>string &#124; number</code>   | <code>5</code>         | Skipping time in seconds                                                                                    |
| chunkBars       | <code>boolean</code>                | <code>false</code>     | Display overlay with buffered and played parts of video                                                     |
| loop            | <code>boolean</code>                | <code>false</code>     | Play video in loop                                                                                          |
| controlsOnPause | <code>boolean</code>                | <code>true</code>      | Show control bar when video is paused                                                                       |
| timeDisplay     | <code>boolean</code>                | <code>false</code>     | Display current time beside playbar                                                                         |

If your video aspect ratio differs from the default 16:9, provide `width` and `height` to prevent layout shift. The displayed size is controlled by the player's container width.

## Credits
Original component by [Meigo Kukk](https://github.com/meigo). This fork simply keeps the package aligned with the latest Svelte ecosystem.
