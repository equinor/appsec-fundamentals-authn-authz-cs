# Frequently Asked Questions

## NODE_ENV observations

* We use the NODE_ENV environment variable to drive some logic in our code (like logging levels)
* The NODE_ENV variables is also used to [configure](https://docs.npmjs.com/cli/v6/using-npm/config) [NPM](https://docs.npmjs.com/about-npm) - the default package manager for javascript. (It's not an acronym for Node Package Manager :)
  * If NODE_ENV=production, _npm_ will only install production dependencies, dev-dependencies are omitted.
  * If you have NODE_ENV=production, do an ```npm install``` and then ```npm test``` or ```npm run dev``` they will usually fail, because modules needed for testing and development will be installed as dev-dependencies.
