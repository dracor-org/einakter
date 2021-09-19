# Einakter

Database of German one-act plays.

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the
[Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

### Quick start

After installing [nodejs](https://nodejs.org/en/download/package-manager/) and
[yarn](https://classic.yarnpkg.com/en/docs/install) you can start the *Einakter*
database by running the following commands:

```bash
git clone git@github.com:dracor-org/einakter.git
cd einakter
yarn
yarn start
```

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

### `yarn json`

Transforms [`data.yaml`](data.yaml) into JSON creating file `data.json`. This
script is mostly used behind the scenes for `yarn start` and `yarn build` but
can come in handy when a fresh JSON version of the current data is needed.

### `yarn csv`

Generates CSV file `data.csv` from [`data.yaml`](data.yaml).

### `yarn authors`

Update [`authors.json`](src/authors.json). This fetches author data for new
author IDs in `data.yaml` and adds it to `src/authors.json`.

To update existing IDs they can be passed as arguments:

```bash
yarn authors Q123 Q4566
```

### `yarn locations`

Update [`locations.json`](src/locations.json). This fetches coordinates for
new location IDs in `data.yaml` and adds them to `src/locations.json`.

## License

The code of this project is licensed under the MIT License.

The data files (data.yaml, originals.yaml) are licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
