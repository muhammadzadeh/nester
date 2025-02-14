# Authentication Methods

Our platform supports a variety of authentication methods to ensure secure and convenient access for users. Below, we detail each method, including how to configure them and any specific considerations for implementation.

## Supported Authentication Methods

### Basic Authentication

- **Email and Password**: Users can sign in using their registered email address and password.
- **Mobile and Password**: Users can sign in using their mobile number and password.

### One-Time Password (OTP) Authentication

- **Email OTP**: Users receive a one-time password (OTP) via email to authenticate.
- **Mobile OTP**: Users receive a one-time password (OTP) via SMS to authenticate.

### Third-Party Authentication

- **Google OAuth**: Users can sign in using their Google account credentials.

## Configuration

The authentication APIs are hosted at `localhost:3000/common/docs`. For configuring the authentication view, refer to the [configuration](configuration.md#authentication) file under the section titled "Authentication".

## HOW to use(develop new feature)

In our application, authorization is a crucial aspect of ensuring secure access to various routes. While all routes require authorization by default, we provide several decorators to manage different authorization scenarios effectively. Here's a breakdown of these decorators and their applications:

### `IgnoreAuthorizationGuard`

This decorator is used to bypass the authorization requirement for specific routes or controllers. It's particularly useful for public routes that do not require user authentication. For example, a route that displays a public blog post can use this decorator to allow access without requiring a user to be logged in.

### `AllowUnauthorizedGuard`

This decorator allows requests to proceed whether they include a token or not. It's beneficial for routes that can be accessed both by authenticated and unauthenticated users. For instance, a route that displays a community post can use this decorator to show the post to all users, but if a user is authenticated (i.e., a token is provided), the application can display additional user-specific actions or information.

### `RequiredPermissions`

For routes that require specific permissions to access, this decorator is used to enforce access control. It checks if the user has the necessary permissions before granting access. This is crucial for routes that handle sensitive operations or data, ensuring that only authorized users can perform these actions.

### `IgnoreIsEnableGuard`

In cases where a user account is disabled, but there's a need to access certain routes (for example, to allow the user to update their account status or to retrieve account information), this decorator can be used. It bypasses the usual checks that would prevent access to a disabled user, allowing the user to interact with the application as needed.
