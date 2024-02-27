# Notification System Configuration and Usage

Our notification system is designed to be flexible and extensible, allowing for the configuration of various notification providers to ensure reliable delivery of messages to users. The system supports both email and SMS notifications, with the ability to add more providers as needed.

## Notification Providers

Currently, we have the following notification providers configured:

### Email

- **Mailgun**: A powerful email service for sending, receiving, and tracking emails effortlessly.
- **SendGrid**: A cloud-based email delivery service that assists businesses with email marketing, transactional email, and more.
- **Local (for testing)**: A local provider that simulates sending emails without actually sending them, useful for development and testing environments.

### SMS

- **Local (for testing)**: A local provider that simulates sending SMS messages without actually sending them, useful for development and testing environments.

For more detailed configuration options, please refer to the [configuration documentation](configuration.md#notification).

## Sending Notifications

To send notifications, we utilize the `sendNotification` function. This function allows for the specification of different types of notifications, including OTP (One-Time Password) generation events, and supports various data formats for email, SMS, and notification center data.

Here's an example of how to use the `sendNotification` function:

```javascript
sendNotification({
  event: NotificationEvent.OTP_GENERATED,
  emailData: {},
  smsData: {},
  notificationCenterData: {},
});
```

## Replacing the Module

For those interested in exploring more advanced features or integrating with a more comprehensive notification system, we recommend considering the [Novu](https://github.com/novuhq/novu) module. Novu is a powerful notification platform that offers a wide range of features, including support for various notification channels, automation, and analytics. It can be a great alternative for enhancing the notification capabilities of our system.
