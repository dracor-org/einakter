# Einakter

Database of German one-act plays.

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the
[Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

### Quick start

After installing [nodejs](https://nodejs.org/en/download/package-manager/) and
enabling `corepack` (running `corepack enable pnpm`) you can start the
_Einakter_ database by running the following commands:

```bash
git clone git@github.com:dracor-org/einakter.git
cd einakter
pnpm install
pnpm run compile
pnpm start
```

In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.<br />
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `pnpm run test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `pnpm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the
best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

### `pnpm run json`

Transforms [`data.yaml`](data.yaml) into JSON creating file `data.json`. This
script is mostly used behind the scenes for `pnpm start` and `pnpm run build` but
can come in handy when a fresh JSON version of the current data is needed.

### `pnpm run csv`

Generates CSV file `data.csv` from [`data.yaml`](data.yaml).

### `pnpm run authors`

Update [`authors.json`](src/authors.json). This fetches author data for new
author IDs in `data.yaml` and adds it to `src/authors.json`.

To update existing IDs they can be passed as arguments:

```bash
pnpm run authors Q123 Q4566
```

This script also updates the network graph of translators and translated authors
in [`translators-network.gexf](translators-network.gexf).

### `pnpm run locations`

Update [`locations.json`](src/locations.json). This fetches coordinates for
new location IDs in `data.yaml` and adds them to `src/locations.json`.

### `pnpm run extract`

Extracts translatable text from Javascript code and updates `.po` files in
the `src/locales` directory.

### `pnpm run compile`

Compiles `.po` files in the `src/locales` directory to Javascript. This is
normally run by `pnpm start` and `pnpm run build`. It would only need to be executed
for testing new translations in a development server without re-running
`pnpm start`.

## Translations

_Einakter_ uses [LinguiJS](https://lingui.js.org) to provide a multi-lingual
user interface. Translations are maintained in `.po` files in the
[src/locales](src/locales). For updating translations the
[pnpm run extract](#pnpm-run-extract) and [pnpm run compile](#pnpm-run-compile)
commands can be used.

## License

The code of this project is licensed under the MIT License.

The data files (data.yaml, originals.yaml) are licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
