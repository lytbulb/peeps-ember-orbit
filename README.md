# Ember-Orbit Client for "Peeps"

This is a client app illustrating the use of
[ember-orbit](https://github.com/orbitjs/ember-orbit/).

It communicates with a [JSON API](http://jsonapi.org/) backend provided by
[Peeps](https://github.com/cerebris/peeps-uuids), a Rails server that was
written using [JSONAPI::Resources](https://github.com/cerebris/jsonapi-resources).

This client also uses Orbit to synchronize its memory source with a local
storage source so that it can work offline.

> The offline synchronization features are not yet complete and require further
work in this project and Orbit itself.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server --proxy http://127.0.0.1:3000`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
