# MIS-UPrepare App

A comprehensive React Native mobile application built with Expo for project management and preparation workflows. The app provides tools for managing Bills of Quantities (BOQ), financial tracking, project progress monitoring, and more.

## Features

- **Authentication System**: Secure login and user management
- **Dashboard**: Overview of project status and key metrics
- **BOQ Management**: Bill of Quantities tracking and management
- **Financial Tracking**: Financial data and media management
- **Project Progress**: Monitor work progress and milestones
- **Photo Management**: Upload and view project photos
- **Cross-Platform**: Runs on iOS, Android, and Web

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Expo CLI**: Install globally with `npm install -g @expo/cli`
- **Git** for version control

### Platform-Specific Requirements

#### For iOS Development
- macOS operating system
- Xcode (latest stable version)
- iOS Simulator (comes with Xcode)
- CocoaPods: `sudo gem install cocoapods`

#### For Android Development
- Android Studio (latest stable version)
- Android SDK (API level 34+ recommended)
- Android Virtual Device (AVD) or physical device
- Configure ANDROID_HOME environment variable

#### For Web Development
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd U-Prepare
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies (macOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
# or
yarn start
```

This will open the Expo Developer Tools in your browser. You can then:

- Press `a` to open on Android device/emulator
- Press `i` to open on iOS Simulator
- Press `w` to open in web browser
- Scan QR code with Expo Go app on physical device

### Platform-Specific Commands

**Android:**
```bash
npm run android
# or
yarn android
```

**iOS:**
```bash
npm run ios
# or
yarn ios
```

**Web:**
```bash
npm run web
# or
yarn web
```

## Building for Production

### Using Expo Application Services (EAS)

1. **Install EAS CLI:**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Build for production:**
   ```bash
   # For Android APK
   eas build --platform android --profile preview

   # For iOS
   eas build --platform ios --profile production

   # For internal distribution
   eas build --platform android --profile preview4
   ```

### Manual Build

**Android:**
```bash
cd android
./gradlew assembleRelease
```

**iOS:**
Open `ios/MISUPrepare.xcworkspace` in Xcode and build for release.

## Project Structure

```
U-Prepare/
├── app/                    # Main app entry point
├── assets/                 # Static assets (images, fonts)
├── components/             # Reusable UI components
│   ├── Button/            # Button components
│   ├── DashBoardComponent/# Dashboard widgets
│   ├── TableComponents/   # Table and data display components
│   └── ...
├── constants/             # App constants and configuration
├── hooks/                 # Custom React hooks
├── navigation/            # Navigation configuration
│   ├── AppNav.js         # Main navigation container
│   ├── AuthStack.js      # Authentication navigation
│   ├── TabNavigation.js  # Tab-based navigation
│   └── ...
├── screens/               # App screens/pages
│   ├── Auth/             # Authentication screens
│   ├── DashboardScreen/  # Main dashboard
│   ├── BOQScreen/        # Bill of Quantities
│   ├── FinancialScreen/  # Financial management
│   └── ...
├── services/              # API services and utilities
│   ├── api/              # API client
│   ├── database/         # Local database helpers
│   └── storage/          # File storage utilities
├── android/               # Android native code
├── ios/                   # iOS native code
├── scripts/               # Build and utility scripts
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── babel.config.js        # Babel configuration
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset project (clears cache, reinstalls dependencies)

## Technologies Used

### Core Framework
- **React Native 0.79.5** - Mobile app framework
- **Expo SDK 53** - Development platform
- **React 19.0.0** - UI library

### Navigation & State
- **React Navigation 7.x** - Navigation library
- **Context API** - State management

### UI & Styling
- **Expo Vector Icons** - Icon library
- **React Native Reanimated** - Animations
- **React Native SVG** - Vector graphics
- **Victory Native** - Charts and graphs

### Data & Storage
- **AsyncStorage** - Local key-value storage
- **Axios** - HTTP client

### Development Tools
- **TypeScript** - Type safety
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Babel** - JavaScript transpiler

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React Native and Expo best practices
- Use functional components with hooks
- Maintain consistent naming conventions

### Testing
Run tests with:
```bash
npm test
```

### Linting
Check code quality with:
```bash
npm run lint
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues:**
   ```bash
   npm run reset-project
   ```

2. **iOS pod install issues:**
   ```bash
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   ```

3. **Android build issues:**
   - Clear Gradle cache
   - Restart Android Studio
   - Check Android SDK versions

4. **Expo Go not connecting:**
   - Ensure same network
   - Check firewall settings
   - Try different connection method (LAN/Tunnel)

### Performance Tips
- Use FlatList for large lists
- Implement proper key props
- Optimize images and assets
- Use React.memo for expensive components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure linting passes
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team.

---

**Note:** This app requires specific backend services and API endpoints to function properly. Ensure all required services are configured and accessible.