
# soundcolorserver

[![Codeship Status for soundcolorproject/soundcolorserver](https://app.codeship.com/projects/1de96a30-597c-0138-9d4f-324044434575/status?branch=master)](https://app.codeship.com/projects/391460)

This is the Philips Hue integrated soundcolorproject implementation.

* [Getting started]
  * [Quickstart]

[Getting started]: #getting-started
## Getting started

[Quickstart]: #quickstart
### Quickstart
To get the application running in development mode, simply:

```bash
npm i # installs the dependencies
npm run dev # runs the app in development mode
```

When running in development mode:
* any changes to backend code (living in the `server` directory) causes the affected module(s) to be reloaded
* any changes to frontend code (living in the `site` directory) causes webpack to hot-replace the module(s) affected

[Verify Code]: #verify-code
### Verify Code
In order to check whether the code passes the checks defined in CI, you can run:

```bash
# in the order in which they are run in CI:

npm run lint # static code analysis
npm run build # typecheck & compile the code
npm run test # run unit tests
npm run verify-build # verifies that the built server actually starts
```

To run all of these in one go, you can run:
```bash
npm run check
```

To run the first three (since the last one can take a while), you can instead:
```bash
npm run check-simple
```
