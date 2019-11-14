# Projections

## What is here
A basic project setup so that I can build and deploy 3js apps to github pages.

## What tools are used to make this work
npm is used as the encompassing build environment.

Webpack is used to generate the deployable javascript.  It walks through the javascript/node dependencies and builds a bundle to deploy.

* Github.io works by presenting a branch of the project, so I'm using gh-pages-deploy webpack plugin to create and push that branch.
* To create the starting html page, i'm using the html-webpack-plugin (see webpack.config.js)

## How to view the latest deploy
https://spayne.github.io/projections/

## How to build
To run webpack and generate html file from cmd:
```console
npm run build
```

## How to deploy
To run the gh-pages-deploy script to update and push the gh-pages branch from cmd:
```console
npm run deploy
```
