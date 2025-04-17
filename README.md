# Flashback

Flashback is a cloud-based image gallery application designed to handle image uploads, organization and storage. It provides a rich front-end experience for managing and viewing images, along with a robust back-end for processing and storing them. Flashback leverages modern web technologies and a microservices architecture to provide a seamless and scalable user experience.

---

## Live Demo
You can access the live demo of Flashback here: [https://flashback-cloud.be](https://flashback-cloud.be)
> **Note:** Please have a Google account ready, as the app uses Google Sign-In for authentication.

---

## Architecture

Flashback is composed of the following services:

### Core Services
- **Front-end**: A Vite React app that provides an organizer for managing folders and galleries, as well as a site section for viewing images in beautiful galleries. It communicates with the API and provides real-time upload status updates via `socket.io`.
- **API**: A NestJS app that handles requests from the front-end, manages the message queue, and facilitates communication between services.
- **Storage Service**: An ExpressJS app responsible for processing uploaded images, generating multiple sizes, and storing them in cloud storage.
- **RabbitMQ**: A message queue used for managing upload tasks and reporting upload statuses.

### External Services
- **Managed Postgres Database**: Used for storing application data, including folder and gallery settings.
- **Cloud Storage**: Used for storing processed images.

---

## Features

- **Secure Authentication with Google Sign-In**: Uses OAuth 2.0 with Bearer tokens and Refresh tokens to manage user sessions securely.
- **Organizer for Folders and Galleries**: Create and manage folders and galleries to organize your images.
- **Customizable Settings**: Configure settings for each folder and gallery, such as enabling maps for galleries.
- **Real-time Upload Status**: Track the progress of your uploads in real-time.
- **Image Processing**: Automatically generates three sizes for each uploaded image.
- **Cloud Storage Integration**: Securely stores images in a cloud storage service.
- **Presigned Download Links**: Provides time-limited links for secure image downloads.
- **Interactive Site Section**: View your organized folders and galleries in a visually appealing interface.
- **Map Integration**: If enabled and GPS data is present, view your images on an interactive map.
- **Scalable Architecture**: Built with microservices to handle high loads and ensure reliability.

---

## Service Details

### Front-end
- Built with **Vite** and **React**.
- **Authentication**:
  - Integrates Google Sign-In for secure and seamless user authentication.
- **Organizer**:
  - Allows users to create and manage folders and galleries.
  - Provides settings for each folder and gallery, such as enabling maps or other features.
- **Site Section**:
  - Displays the organized folders and galleries in a visually appealing format.
  - Includes interactive image galleries for browsing images.
  - Displays images on a map if GPS data is available and the map feature is enabled.
- Communicates with the API for image uploads, folder & gallery management and status updates.
- Establishes a `socket.io` connection for real-time updates.

### API
- Built with **NestJS**.
- Authentication:
  - Implements OAuth 2.0 with Google Sign-In.
  - Uses Bearer tokens for secure API requests.
  - Refresh tokens are used to maintain long-lived sessions without requiring users to log in repeatedly.
- Handles OAuth tokens from Google Sign-In and manages user sessions securely.
- Handles requests from the front-end for managing folders, galleries and image uploads.
- Adds uploaded files (images) to the message queue for processing by the storage service.
- Receives upload status updates from RabbitMQ and transmits them to the front-end via `socket.io`.

### Storage Service
- Built with **ExpressJS**.
- Processes image upload messages from RabbitMQ.
- Generates three sizes for each image and stores them in cloud storage.
- Sends progress and error updates to the API via RabbitMQ.
- Provides an endpoint to generate presigned download links for images.

### RabbitMQ
- Manages message queues for upload tasks and status updates.

---

## Work in Progress

Flashback is a functional application with all the core features described above. However, there are still some features and improvements planned, including:

- **Image Downloading**: Adding functionality for users to download images directly from the app.
- **Comprehensive Testing**: Unit and integration tests are yet (yes, I know, very naughty!) to be implemented to ensure code quality and reliability.

While the app is fully operational, I consider it an evolving project and am continuously working to refine and expand its capabilities.