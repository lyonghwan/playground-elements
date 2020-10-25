# playground-elements

[![Published on npm](https://img.shields.io/npm/v/playground-elements.svg)](https://www.npmjs.com/package/playground-elements) [![Tests](https://github.com/PolymerLabs/playground-elements/workflows/Tests/badge.svg)](https://github.com/PolymerLabs/playground-elements/actions?query=workflow%3Atests+branch%3Amaster)

⚠️ _Active work in progress! Subject to rapid major changes._ ⚠️

A multi-file code editor component with live preview

## Introduction

`<playground-ide>` is a web component that allows you to embed multi-file, editable, live-preview code examples that use JavaScript, TypeScript, HTML and CSS. It's like a mini-IDE that you can embed many times in a page, and it works without a server!

## Features

### No server-required

`<playground-ide>` uses a service worker to send files from the main page to the preview iframe. Users can edit examples locally and the edited files are served to the iframe without ever hitting the network. This means you can use `<playground-ide>` with a static file server, and preview reloads are ultra-fast!

### Multi-file unbundled editing

`<playground-ide>` serves each file indivdually to the preview iframe, instead of bundling them first. This gives faster refresh times and means taht you can utilize the standard web platform features in your examples without a bundler getting in the way and potentially breaking things. The experience is very much like working wtih a static file server.

HTML can have multiple `<script>` and `<link>` tags, even dynamically added. CSS can use `@import` and `url()`. JavaScript can use `import.meta.url`, dynamic `import()`, and `fetch()`. It all just works.

### Bare-module specifiers support

Standard JavaScript modules are great, but currently they lack one feature that has such overwhelming use and utility that we included support for it: base module specifiers.

If you import a module by name, like:

```js
import {html, render} from 'lit-html';
```

`<playground-ide>` will automatically rewrite the import specifier to use [unpkg.com](unpkg.com) URLs:

```js
import {html, render} from 'https://unpkg.com/lit-html?module';
```

### TypeScript support

Besides standard JavaScript, `<playground-ide>` supports TypeScript files, which are automatically transpiled to JavaScript in a web worker.

The TypeScript worker behaves exactly like the `tsc` compiler does, so the examples match local code. This means that when you import other TypeScript files, you do with with a `.js` extension, which matches the compiler output.

`my-element.ts`

```ts
import {LitElement, html, customElement} from 'lit-element';

@customElement('my-element')
class MyElement extends LitElement {
  /* ... */
}
```

`index.html`

```html
<script type="module" src="my-element.js"></script>
```

Note the filename of `my-element.js`.

### Inline or external sources

You can define an example entirely in HTML for simplicity:

```html
<playground-ide>
  <script type="sample/html" filename="index.html">
    <script type="module" src="my-element.js">&lt;/script>
    <h1>Hello World!</h1>
    <my-element></my-element>
  </script>
  <script type="sample/js" filename="my-element.js">
    import {LitElement, html, customElement} from 'lit-element';

    class MyElement extends LitElement { /* ... */ }
    customElements.define('my-element', MyElement);
  </script>
</playground-ide>
```

Or define your project in a JSON manifest:

```html
<playground-ide project-src="./example-1.json"></playground-ide>
```

`example-1.json`:

```json
{
  "files": {
    "index.html": {},
    "my-element.js": {},
    "my-second-element.js": {}
  }
}
```

## Getting Started

Install with npm:

```sh
npm i playground-elements
```

Load the component definition:

```html
<script
  type="module"
  src="/node_modules/playground-elements/playground-ide.js"
></script>
```

Use the component:

```html
<playground-ide project-src="./example-1.json"></playground-ide>
```

`<playground-ide>` uses bare module specifiers in its code, so you'll need a server that supports rewriting module specifiers with the Node module resolution algorithm, or a build tool like Rollup.

`<playground-ide>` also uses `import.meta.url` to load the worker scripts.

## Development

After cloning the repo:

```sh
npm install

# runs npm run watch and npm run serve at the same time
npm run dev
```

Open your browser to `http://localhost:8081/demo/` to see the demo.

### Project organization

The project is organized into multiple TypeScript projects, one for each browser/worker environment, and one shared project. They reference each other via TypeScript project references and are built together with the `--build` flag to `tsc`.
