
# Configuring OWASP ZAP

In this part we will configure and prepare OWASP ZAP to capture network traffic. ZAP has a huge amount of use cases. We will only explore tiny part of ZAP's capabilities! Plan to explore ZAP on your own for things like security testing!

Steps:

* Assuming OWASP ZAP is already installed on your computer
* Start the OWASP ZAP client
* Select "No, I do not want to persist this session at this time"
  * Take a brief look at add-ons, installed and the market place (ZAP is highly extendible)
* Select options (the "cog" or "Tools->Options")
* Select "Network" -> "Local servers/proxies"
  * Verify that the local proxy is running on "localhost" and port "8080"
* Behind a corp-proxy?
  * Explore http://wpad.statoil.net/wpad.dat to identify you network
  * If you are behind the corp firewall (corp network) you need to tell ZAP to send traffic to the corp proxy
  * Only if you are behind a corp firewall do
    * Select "Network" -> "Local servers/proxies" -> "HTTP Proxy" [docs](https://www.zaproxy.org/docs/desktop/addons/network/options/connection/#http-proxy)
    * Add relevant address an port (consult the [proxy document](../../Support/proxy.md))
    * (You may want to add an exclusion for localhost)
* Select "Network" -> "Server Certificate"
  * This section contains the ZAP self generated CA root cert that ZAP will use to dynamically generate SSL certs for connections
  * This root CA is different for each ZAP client. ZAP
  * Consult the ZAP [documentation](https://www.zaproxy.org/docs/desktop/addons/network/options/servercertificates/) on Dynamic SSL Certificates.
  * Select "Save"
    * Save the "owasp_zap_root_ca.cer" file at a proper location outside your source code folders<br/> ("~/.certs" could be a good location)
* Close options and return to the ZAP main screen
* Open a bash terminal window and prepare to run curl
  * On Windows? Check out the [faq](../../Support/faq.md)
* Execute

  ```shell
  curl https://api.my-ip.io/ip
  ```

  Should return your external IP. Nothing shows in ZAP

* Execute

  ```shell
  curl --proxy localhost:8080 https://api.my-ip.io/ip
  ```

  With fail with a message indicating SSL cert problem, a self signed cert that Curl knows nothing of. Nothing shows in ZAP

* Execute

  ```shell
  curl --cacert ~/.certs/owasp_zap_root_ca.cer --proxy localhost:8080 https://api.my-ip.io/ip 
  ```

  Should return your external IP. The request shows in ZAP.

* Explore the results in ZAP
  * Context - Sites
  * Request - Response
  * History

At this point we have sent traffic through the ZAP proxy using Curl. Curl uses https and accepts the SSL cert from ZAP since we told it to use the self generated CA root cert. This is the basic principle for all proxying - the problems usually arises around getting systems to use the proxy and accept the certs.

* Execute

  ```shell
  curl --proxy localhost:8080 https://api.my-ip.io/ip --insecure
  ```

  Our external IP shows. Curl will ignore the self-signed SSL certs.

* We are often tempted to tell various systems to ignore self-signed certs, especially when behind a corp firewall with SSL inspection. Use with caution.

## --Now You--

* Do the steps above

## --Discuss security issues and good practices--

* Manage ZAP persisted session properly - they could contain confidential information
* Use the self-signed cert --ignore's with caution
* Is the self-signed CA cert a secret?
  * What risks are associated with the self-signed CA certs?
