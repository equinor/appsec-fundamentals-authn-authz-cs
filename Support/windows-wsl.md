# Windows WSL2

We are collecting some experiences with using WSL in the workshop. Note that WSL2 has a `careful` state in the TLC. 

Below is an example of what to install in ubuntu subsystem prior to `ex-13` and `ex-14`

## OWASP ZAP

Visit [OWASP ZAP](https://www.zaproxy.org/download/) to check for later releases

JDK
```sh
sudo apt-get install openjdk-17-jre
```
ZAP
```sh
mkdir ~/tools && cd ~/tools
wget https://github.com/zaproxy/zaproxy/releases/download/v2.13.0/ZAP_2.13.0_Linux.tar.gz
tar -xzf ZAP_2.13.0_Linux.tar.gz
cd ZAP_2.13.0
./zap.sh
```

## Cypress

Make sure you have the [cypress dependencies](https://docs.cypress.io/guides/continuous-integration/introduction#Dependencies) installed for your subsystem

```sh
sudo apt install libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libnss3-dev libxss-dev
```

If you still get errors, you may need to install some [additional libraries](https://wilcovanes.ch/articles/error-while-loading-shared-library-libnss3so-running-cypress-in-ubuntu/)
```sh
sudo apt-get install xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
```


