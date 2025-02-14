# Deployment Guide

This guide will walk you through deploying your application on a server using GitHub Actions and Vault. We'll cover setting up Vault for secure configuration management, configuring GitHub for continuous deployment, and optionally integrating Elastic APM for application performance monitoring.

## 1. Setup Vault

Vault is a tool for securely storing and accessing secrets, such as API keys, passwords, and tokens. It's crucial for managing configurations across different environments securely.

- **Step 1:** Install and configure Vault on your server. Follow the official Vault documentation for installation instructions.
- **Step 2:** Store your application's configuration secrets in Vault. This includes database credentials, API keys, and any other sensitive information.
- **Step 3:** For each environment (development, staging, production), create a separate path in Vault to store environment-specific configurations.

## 2. Setup GitHub

GitHub Actions allows you to automate your software workflows, including deploying your application. We'll use it to connect to Vault and deploy your application.

- **Step 1:** Create a new GitHub repository or use an existing one.
- **Step 2:** Set up GitHub Secrets to store the Vault token and any other sensitive information. This ensures that your secrets are not hard-coded in your workflow files.
- **Step 3:** Create a `.github/workflows/deployment.yml` file in your repository or using exists file. This file will define the deployment workflow.

### Starter Variables for GitHub

- **ENVIRONMENT:** Specifies the deployment environment (e.g., development, staging, production).
- **APP_NAME:** The name of your application.
- **APP_URL:** The URL where your application will be accessible.
- **VAULT_HOST:** The address of your Vault server.
- **VAULT_TOKEN:** The token used to authenticate with Vault.
- **VAULT_BACKEND:** The path in Vault where your application's configurations are stored.

### Example Configuration in `deployments/config.yml`

This file should reference the environment variables defined in GitHub Secrets and Vault paths.

## 3. Optional: Integrate Elastic APM

Elastic APM provides application performance monitoring, helping you understand and troubleshoot your application's performance.

- **Step 1:** If you want to use Elastic APM, add the following variables to your GitHub Secrets:
  - **ELASTIC_APM_SERVER_URL:** The URL of your Elastic APM server.
  - **ELASTIC_APM_ENABLED:** Set to `true` to enable Elastic APM.

### Review `.github/workflows/deployment.yml` and `.deploy/docker-compose.yml`

Ensure that your deployment workflow and Docker Compose file are correctly configured to use the environment variables and Vault configurations.

## Conclusion

By following this guide, you'll have a secure and automated deployment process for your application using GitHub Actions and Vault. Remember to review and update your configurations as your application evolves.
