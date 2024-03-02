# Attachments API

This section describes the API for uploading attachments.

## Endpoint

- **URL**: `http://localhost:3000/common/attachments/{visibility}`
- **Method**: `POST`
- **Description**: Uploads an attachment and returns a URL for downloading the uploaded file.

### URL Parameters

- **Required**: `visibility=[public|private]`
- **Description**: Specifies the visibility of the attachment. Accepts `public` or `private`.
