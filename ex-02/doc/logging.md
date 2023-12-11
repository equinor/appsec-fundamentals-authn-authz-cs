# Logging

In this parts will spend a few minutes and discuss and share practices around logging.


Steps:

* Explore the logging code (./lib/logger.js)

## --Discuss security issues and good practices--

* Good practice
  * Use different log levels for different environment
  * Default log level should log as little as possible - only high level errors?
  * Pay particularly attention to private and personal identifiable information (PII) in log files
* Good practice - Create a strategy for logging as soon as possible
  * Include transports in strategy (why we log, where we send the logs, where we store the logs, log maintenance)
  * A log strategy could include multiple transports
    * One log goes to console
    * One more detailed log goes to a log-service
* Good practice - Don't mix logs and metrics - they have different purposes
  * Logs are messages describing an event - the message is the data
  * Metrics are measurements at a point in time for the app/system. Metrics usually consist of a timestamp, and identifier and a value - and are done at regular intervals (the resolution)



