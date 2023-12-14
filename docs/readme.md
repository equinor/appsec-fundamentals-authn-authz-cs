# Workshop Slide Deck

The slides are created with [Reveal.js](https://revealjs.com/)

## Updating content

The contents of the slide deck are contained in a set of markdown file in the [`content`](content) folder. The markdown files are referenced from the [`index.html`](index.html) file.

### Live Server

- To host the files, you can use the "Live Server" plugin to VSCode. 
- Press to "Go Live" icon toolbar bottom right, and the port 5500 is forwarded to your client.

(In order to be able to use the automatic reload up-on changes the 'unsafe-inline' needs to be added to the CSP in ``index.html``. Remember to remove before before making commits.)

### Github Pages

The slide deck is also served using Github Pages at [https://equinor.github.io/appsec-fundamentals-authn-authz-cs](https://equinor.github.io/appsec-fundamentals-authn-authz-cs)


### Docker

- `docker build -t aa-slides .`
- `docker run -d -p 8080:8080 aa-slides`

### SRI - Integrity check for own provided source files

To provide a hash for the .js and .css file provided in the source do:

- `cat ./content/js/app.js | openssl dgst -sha512 -binary | openssl base64 -A`
- `cat ./content/css/equinor.css | openssl dgst -sha512 -binary | openssl base64 -A`
- `curl https://file-to-download | openssl dgst -sha512 -binary | openssl base64 -A`

... and so on.

### Creating a pdf

DeckTape (https://github.com/astefanutti/decktape) is useful to create pdf's of the slides.

To create a pdf of the slides, run the live server, or the Docker version - exposing the slides to localhost.Port 5500 is default for Liveserver, while port 8080 is default when serving from Docker.

Using docker:

```shell
docker run --rm -t --net=host -v `pwd`:/slides  astefanutti/decktape --size 1920x1080 http://localhost:5050 ./slides.pdf
```

Using a local clone of DecTape:

```shell
node decktape.js reveal --size 1920x1080 http://localhost:5500 ./slides.pdf 
```
