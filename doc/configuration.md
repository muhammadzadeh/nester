# Configuration Guide

This document is designed to help users understand and configure the settings for our application across various environments. Configuration settings are crucial for the application's performance, security, and functionality. These settings can be loaded from a `config.yml` file or fetched from a vault server, depending on the operational environment. Below is a detailed explanation of each configuration section.

## Global Configuration

This section includes global settings that apply across the application.

- `app`: Application-specific settings.
  - `env`: The environment in which the application is running, e.g., production, development.
  - `name`: The name of the application.
- `debug`: Enables or disables debug mode. Useful for development and troubleshooting.
- `http`: HTTP server configurations.
  - `port`: The port on which the HTTP server listens.

## Frontend Address

Settings related to the frontend part of the application.

- `frontEnd`: Frontend configuration.
  - `baseUrl`: Base URL for the frontend.
  - `dashboard`: Dashboard-specific settings.
    - `baseUrl`: Base URL for the dashboard.

## Cache and Redis

Configuration for caching mechanisms and Redis database.

- `globalCache`: Global cache settings.
  - `host`: Redis server host, default is `127.0.0.1`.
  - `port`: Redis server port, default is `6379`.
  - `db`: Redis database number, default is `0`.

## Rate Limit (Throttling)

Settings to manage request rate limiting to protect the application from abuse.

- `throttling`: Rate limiting configurations.
  - `limit`: The maximum number of requests allowed in a given time frame.
  - `ttl`: The time-to-live (in milliseconds) for each request's count.

## Database

Database connection configurations, supporting both URL and parameter-based connections.

### Using URL (Connection String)

- `database`: Database settings using a connection string.
  - `url`: The database connection URL.
  - `schema`: The database schema, default is `public`.

### Using Host and Port (Parameters)

- `database`: Parameter-based database settings.
  - `host`: Database server host.
  - `port`: Database server port.
  - `database`: Database name.
  - `username`: Database username.
  - `password`: Database password.
  - `ssl`: SSL configuration for the database connection.
  - `schema`: The database schema, default is `public`.

<a id="authentication"></a>

## Authentication

Configuration settings related to user authentication.

- `authentication`: Authentication settings.
  - `passwordRegEx`: Regular expression for validating passwords.
  - `allowUnverifiedSignin`: Allows users to sign in without verifying their identity.
  - `allowImpersonation`: Allows users to impersonate other users(Only for development purpose).
  - `token`: Token-specific settings.
    - `jwtSecret`: Secret key for JWT.
    - `accessTokenExpiration`: Expiration time for access tokens.
    - `refreshTokenExpiration`: Expiration time for refresh tokens.
  - `providers`: External authentication providers.
    - `google`: Google OAuth settings.
      - `clientId`: Google client ID.
      - `clientSecret`: Google client secret.

## Storage

This section outlines the configurations for the storage options available in the application. The application supports multiple storage types, allowing flexibility in how and where files are stored.

- `storage`: Main storage configuration settings.
  - `type`: Specifies the type of storage to use. Options include `minio`, `r2`, `s3`, and `local`. This setting determines which storage backend will be used to store application data.
  - `baseUrl`: The base URL for accessing stored files. This URL is used as the prefix for all files stored in the selected storage type, facilitating access from the application.
  - `maxFileSize`: The maximum file size allowed for uploads. This limit helps in managing storage capacity and preventing abuse.

### R2 Storage Configuration

- `r2`: Configuration for R2 storage.
  - `privateBucket`: The name of the private bucket in R2 storage, used for storing sensitive or non-public files.
  - `publicBucket`: The name of the public bucket in R2 storage, used for storing files that can be publicly accessed.
  - `accessKeyId`: The access key ID for authenticating with R2 storage.
  - `secretAccessKey`: The secret access key for authenticating with R2 storage.
  - `storageEndpoint`: The endpoint URL for the R2 storage API.
  - `privateBaseUrl`: The base URL for accessing files in the private bucket.
  - `publicBaseUrl`: The base URL for accessing files in the public bucket.

### MinIO Storage Configuration

- `minio`: Configuration for MinIO storage.
  - `privateBucket`: The name of the private bucket in MinIO storage, similar to R2, for sensitive or non-public files.
  - `publicBucket`: The name of the public bucket in MinIO storage, for files that are accessible publicly.
  - `accessKeyId`: The access key ID for MinIO storage authentication.
  - `secretAccessKey`: The secret access key for MinIO storage authentication.
  - `storageEndpoint`: The endpoint URL for the MinIO storage API.
  - `privateBaseUrl`: Base URL for accessing private bucket files.
  - `publicBaseUrl`: Base URL for accessing public bucket files.

### Local Storage Configuration

- `local`: Configuration for local storage.
  - `privateDir`: The directory path for storing private files on the local filesystem.
  - `publicDir`: The directory path for storing public files, accessible publicly through the application.
  - `uploadDir`: The directory path for temporary storage of uploaded files before they are moved to their final location.
  - `privateBaseUrl`: The base URL for accessing files in the private directory.
  - `publicBaseUrl`: The base URL for accessing files in the public directory.

<a id="notification"></a>

## Mailer

Mailer service configurations for sending emails.

- `mailer`: Mailer settings.
  - `provider`: Email service provider (`mailgun`, `local`).
  - `sender`: Email address used as the sender.
  - `host`: SMTP host for the email service.
  - `auth`: Authentication details for the email service.
    - `user`: Username for authentication.
    - `pass`: Password for authentication.

## Sentry

Integration settings for Sentry, used for error tracking and monitoring.

- `sentry`: Sentry configurations.
  - `enabled`: Enables or disables Sentry integration.
  - `dsn`: The DSN (Data Source Name) for connecting to Sentry.
  - `tracesSampleRate`: Sampling rate for collecting performance traces.
  - `profilesSampleRate`: Sampling rate for collecting profiles.

## Swagger

Configuration for the Swagger UI, used for API documentation.

- `swagger`: Swagger settings.
  - `enabled`: Enables or disables Swagger UI.
  - `apiUrl`: The URL to the API documentation.

## Captcha

Configurations for captcha verification to protect the application from automated abuse.

- `captcha`: Captcha settings.
  - `enabled`: Enables or disables captcha functionality. Useful for adding an extra layer of security during user interactions such as login, registration, or form submissions.
  - `provider`: Specifies the captcha provider. Options include `recaptcha` and `hcaptcha`, allowing the application to use Google's reCAPTCHA or hCaptcha for bot detection.
  - `recaptcha`: Configuration specific to reCAPTCHA.
    - `verifyUrl`: The URL used to verify the captcha response with Google's reCAPTCHA service.
    - `secret`: The secret key for communicating with the reCAPTCHA service, used to authenticate the application's captcha requests.

## Logger

Settings for application logging, detailing how logs are generated, stored, and managed.

- `logger`: Logger configurations.
  - `console`: Console logging settings.
    - `enabled`: Enables or disables logging to the console. Useful for development and debugging.
    - `level`: Specifies the log level for console output (e.g., debug, info, warning, error), controlling the verbosity of logs.
  - `fluent`: Fluentd logging settings, for centralized log management.
    - `enabled`: Enables or disables logging to Fluentd.
    - `host`: The hostname or IP address of the Fluentd server.
    - `port`: The port on which the Fluentd server is listening.
    - `timeout`: Timeout for Fluentd logging connections, ensuring logs are sent within a reasonable time frame.
    - `requireAckResponse`: Whether an acknowledgment from the Fluentd server is required, ensuring reliable log delivery.

## Rabbit MQ

Configuration for RabbitMQ, a message broker that enables asynchronous communication and workload distribution.

- `rabbit`: RabbitMQ settings.
  - `uri`: The URI for connecting to the RabbitMQ server, including credentials, host, port, and virtual host. This enables the application to produce and consume messages across distributed systems.

## Default Admin

Settings for creating a default super admin user upon application initialization.

- `defaultUser`: Configuration for the default admin user.
  - `email`: The email address for the default admin user. Used for login and notifications.
  - `mobile`: The mobile number for the default admin user. Optional, can be used for SMS notifications or two-factor authentication.
  - `password`: The password for the default admin user. It's highly recommended to change this after the first login for security reasons.
