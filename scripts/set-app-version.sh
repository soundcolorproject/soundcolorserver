#!/usr/bin/env bash

APP_VERSION=$(node -e 'console.log(require("./package.json").version)')

pushd electron
  npm version "${APP_VERSION}"
popd
