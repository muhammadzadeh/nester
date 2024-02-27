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

## Examples

### Signup by Identifier (Mobile/Email)

1. **API Endpoint**: `http://localhost:3000/common/auth/signup/identifier-password`

   - This endpoint allows users to sign up using their mobile number or email address along with a password.

2. **OTP Verification**:
   - An OTP is sent to the user.
   - The user can verify their account using `http://localhost:3000/common/auth/verify`.

### Signin by OTP

1. **OTP Delivery**: An OTP is sent to the user using `http://localhost:3000/common/auth/otp`.
2. **Signin Process**: The user can sign in using `http://localhost:3000/common/auth/signin/otp`.
