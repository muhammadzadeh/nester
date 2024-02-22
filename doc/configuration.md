# Configuration Guide

This document provides an overview of the configuration settings for our application, tailored for different environments. The configurations are loaded from `config.yml` or from a vault server based on the environment.

## Development Environment

For the development stage, use `config.example.yml` as a template and copy it into `config.yml`. This setup is intended for local development and testing.

- **General Settings**
  - **App Environment**: `local`
  - **App Name**: `app-server-local`
  - **Debug Mode**: `true`

- **Frontend Configuration**
  - **Base URL**: `https://app.com`
  - **Dashboard Base URL**: `https://app.com`

- **HTTP Server**
  - **Port**: `3000`

- **Database Configuration**
  - **URL**: `postgres://postgres:postgres@127.0.0.1:5432/beta`
  - **Schema**: `public`

- **Authentication**
  - **Password Regular Expression**: `^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$`
  - **Allow Unverified Signin**: `true`
  - **Allow Impersonation**: `false`
  - **Token Configuration**
    - **JWT Secret**: `replace_me`
    - **Access Token Expiration**: `PT1H`
    - **Refresh Token Expiration**: `P100D`
  - **Providers**
    - **Google**:
      - **Client ID**: `replace_me`
      - **Client Secret**: `replace_me`

- **Storage Configuration**
  - **Type**: `minio`
  - **Base URL**: `http://localhost:9000`
  - **Max File Size**: `30_000_000`

- **Mailer Configuration**
  - **Provider**: `mailgun`
  - **Sender**: `no-reply@app.com`

- **Swagger**
  - **Enabled**: `true`
  - **API URL**: `http://localhost:3000`

- **Sentry**
  - **Enabled**: `true`
  - **DSN**: `replace_me`

- **Captcha**
  - **Enabled**: `false`
  - **Provider**: `recaptcha`

- **Logger Configuration**
  - **Console**:
    - **Enabled**: `true`
    - **Level**: `debug`

- **RabbitMQ**
  - **URI**: `amqp://localhost:5672`

- **Default User**
  - **Email**: `replace_me`
  - **Mobile**: `replace_me`
  - **Password**: `replace_me`

## Production Environment (Live Mode)

For production, copy `deployments/config.yml` into `config.yml`. This setup is intended for the live environment and loads configurations from a vault server.

- **General Settings**
  - **App Environment**: `ENVIRONMENT`
  - **App Name**: `APP_NAME`
  - **App URL**: `APP_URL`

- **Vault Configuration**
  - **Host**: `VAULT_HOST`
  - **Token**: `VAULT_TOKEN`
  - **Backend**: `VAULT_BACKEND`
