# cljsjs-hosted
This repo hosts the contents of [cljsjs](https://github.com/cljsjs/packages) packages.

Its main usage is for self-host clojurescript.

The files are hosted by `gh-pages` at: https://viebel.github.io/cljsjs-hosted

For instance the `moment` package is at: https://viebel.github.io/cljsjs-hosted/cljsjs/moment/production/moment.min.inc.js

The rule for the full url of a package is:

`https://viebel.github.io/cljsjs-hosted/cljsjs/<package-name>/production/<package-name>.min.inc.js`

where `package-name` is the package name with hyphens `-` instead of dots `.`

# Adding/Updating a package

In order to add/update a package, you have to:

1. fork this project
2. add the package in the `project.clj`
3. run `lein deps`
4. open the jar of the package e.g. `tar xvf ~/.m2/repository/cljsjs/moment/2.15.2-3/moment-2.15.2-3.jar`
5. put the contents of the jar under a folder under `cljsjs` folder e.g. `cljsjs/moment`
6. add an empty file with the name of the version e.g `cljsjs/moment/version-2.15.2-3`
6. commit and push the contents of the jar
7. open a pull request

