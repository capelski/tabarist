// The HTML must be available on cloud functions. Instead of reading an HTML file (which
// wouldn't be available by default), exporting it via JS function.

// This file is deliberately written in JS and module.exports, as it needs to be imported
// by webpack development configuration

const assetsFolder = 'assets';
const assetsPath = `/${assetsFolder}/`;

module.exports = {
  assetsFolder,
  assetsPath,
  getHtml: (options = {}) =>
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="author" content="Carles Capellas" />
    <meta name="robots" content="index, follow" />
    ${options.headTags || ''}

    <link rel="stylesheet" href="${assetsPath}main.css">
    ${
      options.initialState
        ? `<script>window.initialState = ${JSON.stringify(options.initialState)};</script>`
        : ''
    }
    <script defer="defer" src="${assetsPath}main.js"></script>

    ${
      options.adSenseId
        ? `<script async crossorigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${options.adSenseId}"
        ></script>`
        : ''
    }

    <script src="https://www.youtube.com/iframe_api"></script>
  </head>

  <body style="margin: 0">
    <div id="app-placeholder">${options.appHtml || ''}</div>
  </body>

  <div id="youtube-player" style="display: none"></div>
</html>
`,
};
