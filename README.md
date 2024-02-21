# Nester: A Simplified Introduction

Welcome to the  **Nester**  project! This project is a fantastic starting point for anyone looking to kick off a new project using  **NestJS**. It comes with some pre-written code to help you get started quickly, and it includes features for authentication, notifications, attachments, and user management.

## What's NestJS?

**NestJS**  is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses modern JavaScript, is built with TypeScript, and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

## What Does Nester Include?

Nester is packed with a variety of technologies to help you build robust applications:

- **NestJS**: The core framework we're using to build our application.
- **PostgreSQL**: Our database system, which is great for storing structured data.
- **Redis**: An in-memory data structure store, used for caching and message brokering.
- **RabbitMQ**: A message broker that helps our application interlan communication.
- **Fluentd**: A data collector that helps us aggregate logs and metrics.
- **Elastic APM**: Application Performance Monitoring to keep an eye on how our application is performing.

## How Do I Get Started?

It's super easy to get started with Nester! Here's a quick guide:

1. **Run Dependencies**: First, we need to get all the necessary services up and running. We use Docker to manage these services, so you'll need to have Docker installed on your machine. Once you have Docker, run the following command to start all the services:

`docker compose up -d`

2. **Configure Your Project**: Next, we need to set up our project's configuration. We have a sample configuration file that you can copy to get started. Run the following command to copy the configuration file:

`cp config.example.yml config.yml`

Now you can open  `config.yml`  and fill in your own settings.

## What's Next?

Once you've got your environment set up, you can dive into the details of each part of the Nester project:

- **Architecture**: Learn about the overall structure of the application.
- **Configuration**: Find out how to customize your application's settings.
- **Attachments**: Understand how to handle file uploads and downloads.
- **Authentication**: Secure your application with user logins and access controls.
- **Notification**: Set up a system to send users notifications.
- **User Management**: Manage users, including registration, profile updates, and more.
