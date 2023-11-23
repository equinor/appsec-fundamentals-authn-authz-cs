# Workshop Slide Deck

The slides are created with [Reveal.js](https://revealjs.com/)

## Updating content

The contents of the slide deck are contained in a set of markdown file in the [`content`](content) folder. The markdown files are referenced from the [`index.html`](index.html) file.

### Live Server

- To host the files, use the "Live Server" plugin to VSCode. (It's included in recommend extensions for the workspace)
- Press to "Go Live" icon toolbar bottom right, and the port 5500 is forwarded to your client.

(In order to be able to use the automatic reload up-on changes the 'unsafe-inline' needs to be added to the CSP in ``index.html``. Remember to remove before before making commits.)

### Docker

- `docker build -t aa-slides .`
- `docker run -d -p 8080:8080 aa-slides`

### SRI - Integrity check for source files

To provide a hash for the .js and .css file provided in the source do:

- `cat ./content/js/app.js | openssl dgst -sha512 -binary | openssl base64 -A`
- `cat ./content/css/equinor.css | openssl dgst -sha512 -binary | openssl base64 -A`
- `curl https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css | openssl dgst -sha512 -binary | openssl base64 -A`

... and so on.

### Exporting Slides to PDF

I use https://github.com/astefanutti/decktape to export slides to PDF.

The command looks something like this: `decktape -s 1920x1080 http://localhost:5500 ./pdf/slides.pdf`
