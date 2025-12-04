# End-to-End Encryption Web Application

A secure Angular 18 application demonstrating end-to-end encryption (E2EE) for user registration. This project implements RSA encryption for securing the AES key and AES-GCM encryption for encrypting sensitive user data during transmission.

## Technology Stack

- **Frontend Framework**: Angular 18
- **Language**: TypeScript 5.4
- **Styling**: SCSS with Bootstrap 5.3.8
- **HTTP Client**: Angular HttpClient with Custom Interceptors
- **Cryptography**: Web Crypto API
- **Package Manager**: npm
- **Build Tool**: Angular CLI 18
- **Testing**: Jasmine & Karma

## Project Architecture

### Key Components

- **[AppComponent](src/app/app.component.ts)** - Main component with user registration form
- **[UserService](src/app/services/user.service.ts)** - Handles user registration API calls
- **[SecureService](src/app/services/secure.service.ts)** - Retrieves server's public key
- **[CryptoService](src/app/services/crypto.service.ts)** - Manages all cryptographic operations
- **[EncryptionInterceptor](src/app/services/encryption.interceptor.ts)** - Automatically encrypts POST requests to `/api/secure` endpoints
- **[UserModel](src/app/models/user.model.ts)** - User data model

### Encryption Flow

1. **Initialize**: Application fetches the server's RSA public key via `SecureService`
2. **Generate Session Key**: For each request, a unique AES-256 key and random IV are generated
3. **Encrypt Data**: User data is encrypted using AES-GCM with the session IV
4. **Protect Session Key**: The AES key is encrypted with the server's RSA-2048 public key (RSA-OAEP)
5. **Transmit**: All three components (encrypted data, encrypted key, IV) are sent to the server

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI 18 globally installed: `npm install -g @angular/cli@18`

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EndtoEndEncryption.Web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify configuration**
   - Update the API endpoint in [UserService](src/app/services/user.service.ts) if needed
   - Ensure the backend server is running on `https://localhost:44382`

## Running the Application

### Development Server

Run the development server with automatic reload:
```bash
npm start
```
or
```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change any source files.

### Production Build

Build the project for production:
```bash
npm run build
```
Build artifacts are stored in the `dist/endto-end-encryption.web/` directory.

## Project Structure

```
EndtoEndEncryption.Web/
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   └── user.model.ts              # User data model
│   │   ├── services/
│   │   │   ├── crypto.service.ts          # Cryptographic operations
│   │   │   ├── encryption.interceptor.ts  # HTTP encryption interceptor
│   │   │   ├── secure.service.ts          # Public key retrieval
│   │   │   └── user.service.ts            # User registration
│   │   ├── app.component.ts               # Main component
│   │   ├── app.component.html             # Registration form template
│   │   ├── app.component.scss             # Component styles
│   │   ├── app.component.spec.ts          # Component tests
│   │   ├── app.config.ts                  # Application configuration
│   │   └── app.routes.ts                  # Route definitions
│   ├── main.ts                            # Application entry point
│   ├── styles.scss                        # Global styles
│   └── index.html                         # HTML template
├── angular.json                           # Angular CLI configuration
├── tsconfig.json                          # TypeScript configuration
├── tsconfig.app.json                      # App-specific TypeScript config
├── tsconfig.spec.json                     # Test-specific TypeScript config
├── package.json                           # Dependencies & scripts
└── README.md                              # This file
```

## Configuration Files

- **[tsconfig.json](tsconfig.json)** - TypeScript compiler options with strict mode enabled
- **[angular.json](angular.json)** - Angular CLI build and serve configurations
- **[.editorconfig](.editorconfig)** - Code style consistency (UTF-8, 2-space indents)

## Key Features

✅ **End-to-End Encryption** - RSA-OAEP + AES-GCM encryption  
✅ **Automatic Request Encryption** - HTTP interceptor encrypts `/api/secure` POST requests  
✅ **Secure Key Exchange** - AES keys encrypted with server's RSA public key  
✅ **Random Initialization Vectors** - Unique IV generated per request  
✅ **Bootstrap Integration** - Responsive UI with Bootstrap 5.3.8  
✅ **Type-Safe** - Full TypeScript support with strict mode  
✅ **Standalone Components** - Angular 18 standalone API  
✅ **Reactive Forms** - Two-way data binding with ngModel  

## Security Notes

- All sensitive operations use the Web Crypto API (native browser crypto)
- RSA-OAEP with SHA-256 hash for key encryption
- AES-GCM for authenticated encryption of user data
- Random IV (initialization vector) for each encryption operation
- HTTPS only in production (configured for `https://localhost:44382`)

## Troubleshooting

### Port 4200 already in use
```bash
ng serve --port 4300
```

### Backend connection errors
- Verify backend server is running on `https://localhost:44382`
- Check CORS configuration on the backend
- Ensure SSL certificate is valid for HTTPS connections

### Crypto operations failing
- Ensure the server public key is in valid PEM or base64 SPKI format
- Check browser console for detailed error messages
- Verify browser supports Web Crypto API (all modern browsers)

## Further Help

- [Angular Documentation](https://angular.io)
- [Angular CLI Documentation](https://angular.io/cli)
- [Web Crypto API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Bootstrap Documentation](https://getbootstrap.com/docs)

## License

This project is provided as-is for educational and demonstration purposes.
