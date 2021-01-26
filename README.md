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
