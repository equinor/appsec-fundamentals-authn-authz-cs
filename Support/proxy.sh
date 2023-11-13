
function proxyon () {
    export HTTP_PROXY="http://www-authproxy.statoil.net:80"
    export HTTPS_PROXY="http://www-authproxy.statoil.net:80"
    export NO_PROXY="127.0.0.1"

    npm config set proxy $HTTP_PROXY
    npm config set https-proxy $HTTPS_PROXY

}

function proxyoff () {
    unset HTTPS_PROXY
    unset HTTP_PROXY
    unset NO_PROXY

    npm config delete proxy
    npm config delete https-proxy

}