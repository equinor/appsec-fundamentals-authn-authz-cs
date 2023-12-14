# Security Considerations re-cap

* Things are getting complex - which always gives us security issues
  * Credentials and config needs to be managed properly
  * Borders between staging environments needs to be clear (dev, test, prod)
  * Application architecture should be done carefully
* Use frameworks as much as possible to handle the flows?
  * Testability and frameworks are a potential issue.
* Using a lot of different technologies in projects sets high demand to team skills and capabilities.
* Establish good practice around debugging/tracing to understand network flow (OWASP Zap)
  * For NodeJS i recommend the Global Agent module to enable debugging using a network proxy 
* Scan for open source components for known vulnerabilities

---


What could possibly go wrong? Do threat modeling! Visit [appsec.equinor.com](https://appsec.equinor.com/threat-modeling/) to get started! ⚡️
