# MIS-UPrepare App (U-Prepare)

React Native / Expo application for infrastructure project management — BOQ tracking,
financial progress, physical progress milestones, safeguard entries and site photo capture.

- **Expo SDK** 53.0.27
- **React Native** 0.79.6
- **React** 19.0.0
- **Android package / iOS bundle id** `uprepare.com`
- **Architecture** New Architecture (Fabric + TurboModules) is **enabled**

> **This is a bare (prebuild-ejected) project.** The `android/` folder is committed to git.
> That has an important consequence — see [Native config & app.json](#native-config--appjson).

---

## Table of contents

- [Quick start — build an APK](#quick-start--build-an-apk)
- [Requirements](#requirements)
- [One-time machine setup](#one-time-machine-setup)
- [Installing the project](#installing-the-project)
- [Running the app](#running-the-app)
- [Building the APK](#building-the-apk)
- [Android emulator from scratch](#android-emulator-from-scratch)
- [Native config & app.json](#native-config--appjson)
- [Project structure](#project-structure)
- [Available scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)

---

## Quick start — build an APK

If your machine already has JDK 17 and the Android SDK:

**macOS / Linux**

```bash
git clone <repository-url>
cd MIS-UPrepare-App
npm install
chmod +x android/gradlew
cd android && ./gradlew assembleRelease
```

**Windows (PowerShell)**

```powershell
git clone <repository-url>
cd MIS-UPrepare-App
npm install
cd android
.\gradlew.bat assembleRelease
```

The APK is written to:

```
android/app/build/outputs/apk/release/app-release.apk
```

Expect **20–40 minutes on a first build** (native C++ compilation + dependency downloads)
and **2–5 minutes** for subsequent builds. See [Build times](#build-times).

---

## Requirements

| Tool | Required version | Why |
|---|---|---|
| **Node.js** | 18+ (tested on 24.17.0) | Metro bundler, Expo CLI |
| **npm** | 9+ (tested on 11.13.0) | dependency install |
| **JDK** | **17** (exactly) | Android Gradle Plugin 8.x refuses 11; 21 is not yet supported |
| **Android SDK Platform** | **android-35** | `compileSdk` / `targetSdk` |
| **Android Build-Tools** | **35.0.0** | aapt2, d8, apksigner, zipalign |
| **Android NDK** | **27.1.12297006** | C++ for reanimated, svg, sqlite, screens, gesture-handler |
| **CMake** | **3.22.1** | drives the NDK builds |
| **Platform-Tools** | latest (adb) | install / debug on device |
| **Gradle** | 8.13 — auto-downloaded by the wrapper | build system |

**iOS is not currently set up in this repository.** There is no `ios/` directory, so there is
nothing to `pod install` and no `.xcworkspace` to open. To target iOS you must first generate
the native project with `npx expo prebuild -p ios`, which requires macOS + Xcode.

---

## One-time machine setup

Everything below installs **without Android Studio** — the command-line tools are enough to
build an APK. Pick your OS.

### Download links (all platforms)

| Tool | Official download page |
|---|---|
| Node.js LTS | https://nodejs.org/en/download |
| JDK 17 (Temurin) | https://adoptium.net/temurin/releases/?version=17 |
| Android command-line tools | https://developer.android.com/studio#command-line-tools-only |
| Android Studio (optional, bundles the SDK) | https://developer.android.com/studio |
| Git | https://git-scm.com/downloads |

> On the Android page, scroll to **"Command line tools only"** and take the archive for your
> OS. Direct archives follow the pattern
> `https://dl.google.com/android/repository/commandlinetools-<os>-<build>_latest.zip`
> (`<os>` = `win` / `mac` / `linux`). The `<build>` number changes with each release, so copy
> the current link from that page rather than hard-coding one.

---

### macOS

**Option A — Homebrew (recommended)**

```bash
# Install Homebrew first if you don't have it: https://brew.sh
brew install --cask temurin@17              # JDK 17
brew install --cask android-commandlinetools # Android SDK tools
brew install node git                        # Node.js + Git
```

Add to `~/.zshrc` so it persists across terminals:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH
```

Then reload: `source ~/.zshrc`

> On Intel Macs Homebrew lives at `/usr/local`, so use
> `export ANDROID_HOME=/usr/local/share/android-commandlinetools`.

**Option B — manual download**

1. Install JDK 17 from https://adoptium.net/temurin/releases/?version=17 (`.pkg` installer)
2. Download the macOS command-line tools zip from
   https://developer.android.com/studio#command-line-tools-only
3. Unpack into the layout `sdkmanager` expects:
   ```bash
   mkdir -p ~/Android/sdk/cmdline-tools
   unzip ~/Downloads/commandlinetools-mac-*_latest.zip -d ~/Android/sdk/cmdline-tools
   mv ~/Android/sdk/cmdline-tools/cmdline-tools ~/Android/sdk/cmdline-tools/latest
   export ANDROID_HOME=$HOME/Android/sdk
   export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH
   ```

**Install the SDK packages (either option):**

```bash
yes | sdkmanager --licenses
sdkmanager --install \
  "platform-tools" \
  "platforms;android-35" \
  "build-tools;35.0.0" \
  "ndk;27.1.12297006" \
  "cmake;3.22.1" \
  "emulator" \
  "system-images;android-35;google_apis;arm64-v8a"
```

---

### Windows

**Option A — winget (built into Windows 10 21H1+ / 11)**

Open **PowerShell** and run:

```powershell
winget install OpenJS.NodeJS.LTS
winget install EclipseAdoptium.Temurin.17.JDK
winget install Git.Git
```

Then download the **Windows command-line tools** zip from
https://developer.android.com/studio#command-line-tools-only and unpack it:

```powershell
mkdir "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools"
Expand-Archive "$env:USERPROFILE\Downloads\commandlinetools-win-*_latest.zip" `
  -DestinationPath "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools"
Rename-Item "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\cmdline-tools" "latest"
```

**Option B — Chocolatey**

```powershell
choco install nodejs-lts temurin17 git -y
choco install android-sdk -y
```

**Set environment variables (PowerShell, persists for your user):**

```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME",
  "C:\Program Files\Eclipse Adoptium\jdk-17", "User")
[Environment]::SetEnvironmentVariable("ANDROID_HOME",
  "$env:LOCALAPPDATA\Android\Sdk", "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT",
  "$env:LOCALAPPDATA\Android\Sdk", "User")
[Environment]::SetEnvironmentVariable("Path",
  "$env:Path;$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin" +
  ";$env:LOCALAPPDATA\Android\Sdk\platform-tools" +
  ";$env:LOCALAPPDATA\Android\Sdk\emulator", "User")
```

> Check the actual JDK folder name — it may be `jdk-17.0.x.y-hotspot`.
> **Close and reopen PowerShell** afterwards so the variables take effect.

**Install the SDK packages:**

```powershell
sdkmanager --licenses
sdkmanager --install "platform-tools" "platforms;android-35" "build-tools;35.0.0" `
  "ndk;27.1.12297006" "cmake;3.22.1" "emulator" `
  "system-images;android-35;google_apis;x86_64"
```

> Note the **`x86_64`** system image on Windows (Intel/AMD), versus `arm64-v8a` on Apple
> silicon. On an ARM Windows device use `arm64-v8a`.

**Windows-specific notes**

- Use `gradlew.bat` instead of `./gradlew` in every command in this README.
- `chmod +x` is not needed on Windows.
- Long paths can break the NDK build. Enable long paths once, as Administrator:
  ```powershell
  New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
    -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
  ```
- Clone to a short path such as `C:\dev\MIS-UPrepare-App`, not a deeply nested folder.
- Exclude the project and `~/.gradle` from real-time antivirus scanning — Defender can cause
  the "Unable to delete directory" build failures described in
  [Troubleshooting](#troubleshooting).

---

### Linux

```bash
sudo apt install -y nodejs npm git unzip     # or your distro equivalent
# JDK 17 from https://adoptium.net/temurin/releases/?version=17
sudo apt install -y temurin-17-jdk

mkdir -p ~/Android/sdk/cmdline-tools
unzip ~/Downloads/commandlinetools-linux-*_latest.zip -d ~/Android/sdk/cmdline-tools
mv ~/Android/sdk/cmdline-tools/cmdline-tools ~/Android/sdk/cmdline-tools/latest

export JAVA_HOME=/usr/lib/jvm/temurin-17-jdk-amd64
export ANDROID_HOME=$HOME/Android/sdk
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH
```

Then run the same `sdkmanager --install` command as macOS, with the `x86_64` system image.

---

### Verify the setup (all platforms)

```bash
node -v                    # v18+ 
java -version              # must print 17.x
echo $ANDROID_HOME         # Windows: echo $env:ANDROID_HOME
sdkmanager --list_installed
adb version
```

You should see `build-tools;35.0.0`, `platforms;android-35`, `ndk;27.1.12297006`,
`cmake;3.22.1` and `platform-tools` in the installed list.

> The SDK download totals roughly **3 GB**; the NDK alone is about 1 GB and is the slowest
> part. Budget 15–30 minutes on a typical connection.

---

## Installing the project

```bash
git clone <repository-url>
cd MIS-UPrepare-App
npm install
```

**macOS / Linux only — make the Gradle wrapper executable.** It is stored in git with mode
`100644`, so a fresh clone cannot run it. (Not needed on Windows, which uses `gradlew.bat`.)

```bash
chmod +x android/gradlew
```

Optionally tell Gradle where the SDK is (only needed if `ANDROID_HOME` is not exported):

```bash
# macOS / Linux
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

```powershell
# Windows PowerShell — note the doubled backslashes, Gradle requires them
"sdk.dir=$($env:ANDROID_HOME -replace '\\','\\\\')" | Out-File -Encoding ascii android\local.properties
```

Sanity-check the project before building:

```bash
npx expo-doctor        # project health
npx tsc --noEmit       # type check
npx expo lint          # lint
```

---

## Running the app

### On an emulator or connected device

```bash
npm run android
```

This compiles the **debug** variant, installs it, and starts Metro. The first run takes as
long as a full release build; later runs are much faster.

### Metro only (JS reload against an already-installed build)

```bash
npm start                 # then press 'a' for Android
npm run start:dev-client  # for the expo-dev-client build
```

### Web

```bash
npm run web
```

The repo ships web variants (`navigation/AppNav.web.js`, `services/database/database.web.js`),
so the web target builds — but it is not the primary platform and some native-only features
(SecureStore, SQLite, biometrics, call/contact access) degrade or no-op.

> **Expo Go will not fully work.** This project uses `expo-dev-client` and custom native
> modules. Use a development build (`npm run android`) rather than the Expo Go app.

---

## Building the APK

### Release APK (local, recommended)

**macOS / Linux**

```bash
cd android
./gradlew assembleRelease
```

**Windows (PowerShell)**

```powershell
cd android
.\gradlew.bat assembleRelease
```

Output:

```
android/app/build/outputs/apk/release/app-release.apk
```

Install it on a running emulator or attached device:

```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

### Debug APK

```bash
cd android
./gradlew assembleDebug          # Windows: .\gradlew.bat assembleDebug
# -> android/app/build/outputs/apk/debug/app-debug.apk
```

### Faster builds — single ABI

By default [`android/gradle.properties`](android/gradle.properties) builds **four** ABIs
(`armeabi-v7a, arm64-v8a, x86, x86_64`). Restricting to one roughly quarters the native
compile time. `arm64-v8a` covers all modern phones and Apple-silicon emulators:

```bash
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

### Android App Bundle (for Play Store)

```bash
./gradlew bundleRelease
# -> android/app/build/outputs/bundle/release/app-release.aab
```

### ⚠️ Signing

[`android/app/build.gradle`](android/app/build.gradle) currently points the **release**
`signingConfig` at the bundled **debug keystore**:

```gradle
release {
    signingConfig signingConfigs.debug   // <-- debug key
}
```

This is fine for sideloading and internal testing, but **Google Play will reject it**.
Before publishing, generate a real keystore and wire it up:

```bash
keytool -genkeypair -v -keystore release.keystore \
  -alias uprepare -keyalg RSA -keysize 2048 -validity 10000
```

Then add a `release` signing config reading credentials from `~/.gradle/gradle.properties`
(never commit the keystore or its passwords).

### Cloud build with EAS (no local Android SDK needed)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview     # APK
```

Profiles are defined in [`eas.json`](eas.json): `preview` (APK), `preview2`
(`assembleRelease`), `preview3` (dev client), `preview4` (internal distribution),
`production`.

> Because `android/` is committed, EAS will **not** apply the `app.json` fields listed in
> [Native config & app.json](#native-config--appjson).

### Build times

Measured on an Apple-silicon MacBook Air:

| Scenario | Time |
|---|---|
| First build (cold Gradle cache, NDK compile, 4 ABIs) | **20–40 min** |
| First build, `arm64-v8a` only | ~10–15 min |
| Incremental build after a JS-only change | 2–5 min |
| Incremental after a native/dependency change | 5–15 min |

Most of a first build is *not* CPU work — it is downloading ~500 MB of Maven artifacts plus
the Gradle distribution. A stable connection matters more than a fast CPU.

---

## Android emulator from scratch

```bash
# Create an AVD (Pixel 7, API 35, arm64)
avdmanager create avd -n uprepare_pixel \
  -k "system-images;android-35;google_apis;arm64-v8a" -d pixel_7

# Boot it
emulator -avd uprepare_pixel -no-snapshot -no-boot-anim -gpu swiftshader_indirect &

# Wait until it is ready
adb wait-for-device
until [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" = "1" ]; do sleep 3; done
adb devices
```

Useful tweaks in `~/.android/avd/uprepare_pixel.avd/config.ini` — the defaults are frugal:

```ini
hw.ramSize=4096
hw.gpu.enabled=yes
hw.gpu.mode=swiftshader_indirect
hw.keyboard=yes
vm.heapSize=512
```

Screenshot a running emulator:

```bash
adb exec-out screencap -p > screen.png
```

---

## Native config & app.json

Because the `android/` directory is checked into git, this is a **bare** project rather than a
Continuous Native Generation (CNG) one. Consequently these `app.json` fields are **ignored**
by both local Gradle builds and EAS:

`orientation`, `icon`, `scheme`, `userInterfaceStyle`, `splash`, `ios`, `android`, `plugins`

To change an app icon, splash screen, permission or config plugin you must either:

1. edit the native files directly (`android/app/src/main/AndroidManifest.xml`,
   `android/app/src/main/res/…`), **or**
2. regenerate the native project:
   ```bash
   npx expo prebuild --clean -p android
   ```
   — which **overwrites** `android/`, discarding any manual native edits.

Permissions actually shipped are the ones in
[`android/app/src/main/AndroidManifest.xml`](android/app/src/main/AndroidManifest.xml),
*not* the list in `app.json`.

---

## Project structure

```
MIS-UPrepare-App/
├── android/                # Native Android project (committed — see note above)
│   ├── app/
│   │   ├── build.gradle    # applicationId, signing, build types
│   │   ├── debug.keystore  # debug signing key
│   │   └── src/main/AndroidManifest.xml
│   ├── build.gradle        # repositories, plugin classpath
│   ├── gradle.properties   # newArchEnabled, hermesEnabled, ABIs
│   └── gradlew             # wrapper (chmod +x after cloning)
├── app/
│   └── index.js            # root component — fonts, splash, providers
├── index.js                # registerRootComponent entry
├── assets/                 # fonts and images
├── components/             # reusable UI
│   ├── DashBoardComponent/ # dashboard widgets and charts
│   ├── TableComponents/    # data tables
│   └── …
├── constants/              # Colors.ts, theme.js, animations.js
├── hooks/                  # useColorScheme, useThemeColor
├── navigation/
│   ├── AppNav.js           # NavigationContainer + SQLiteProvider
│   ├── AppNav.web.js       # web variant
│   ├── AuthContext/        # auth state, axios 401 interceptor
│   ├── AuthStack.js        # login / OTP / forgot / reset
│   ├── DrawerNavigation.js
│   ├── TabNavigation.js
│   └── Navigation.js       # main stack
├── screens/                # one folder per screen
│   ├── Auth/               # Login, OTP, Register, ResetPassword
│   ├── DashboardScreen/
│   ├── BOQScreen/ BOQDetailsScreen/
│   ├── FinancialScreen/ ECPScreen/ SafeGuardScreen/
│   ├── WorkProgress/ UpdateWorkProgress/
│   └── …
├── services/
│   ├── api/                # endpoints.js, fetch.js (axios)
│   ├── auth/               # tokenStorage.js
│   ├── database/           # expo-sqlite wrapper (+ .web variant)
│   ├── storage/            # SecureStore / AsyncStorage helpers
│   └── helper.js           # dimensions, connectivity, formatting
├── app.json                # Expo config (partly inert — see note)
├── eas.json                # EAS build profiles
├── babel.config.js         # module-resolver "@" -> project root, reanimated plugin
└── metro.config.js
```

Path alias: `@/…` resolves to the project root (configured in both `babel.config.js` and
`tsconfig.json`).

---

## Available scripts

| Script | What it does |
|---|---|
| `npm start` | Expo dev server |
| `npm run start:dev-client` | Dev server for `expo-dev-client` builds |
| `npm run android` | Build + install debug APK, start Metro |
| `npm run ios` | iOS — **requires generating `ios/` first** |
| `npm run web` | Run in browser |
| `npm run lint` | ESLint |
| `npm test` | Jest (see caveat below) |
| `npm run reset-project` | ⚠️ **DESTRUCTIVE — see below** |

> ### ⚠️ `npm run reset-project` does not clear caches
> Despite the name, [`scripts/reset-project.js`](scripts/reset-project.js) **moves `app/` to
> `app-example/` and replaces it with a blank Expo starter screen.** It will wipe this app's
> entry point. It is a leftover from the Expo template. **Do not run it to fix build issues.**
> To clear caches use `npx expo start --clear` or the commands in
> [Troubleshooting](#troubleshooting).

> ### Jest caveat
> The only test, `components/__tests__/ThemedText-test.tsx`, is a leftover template test that
> renders the whole app root and fails on unmocked `AsyncStorage`. `npm test` is therefore red
> out of the box. Either delete it or add the AsyncStorage jest mock.

---

## Troubleshooting

### `permission denied: ./gradlew`
The wrapper is committed without the executable bit:
```bash
chmod +x android/gradlew
```

### `Could not resolve com.android.tools.build:gradle` / `Network is unreachable`
A dependency download failed — usually a dropped connection, or a slow `jitpack.io`
(referenced in `android/build.gradle`). Confirm connectivity and re-run; Gradle resumes from
its cache rather than restarting:
```bash
curl -sI https://repo.maven.apache.org/maven2/ | head -1
cd android && ./gradlew assembleRelease
```

### `Unable to delete directory … Failed to delete some children`
Stale intermediates, typically left by a previous build that was interrupted. Stop any
daemons and remove the affected module's build directory:
```bash
cd android && ./gradlew --stop
rm -rf ../node_modules/<module>/android/build
./gradlew assembleRelease
```

### Kotlin `PersistentMapImpl` / `lookups.tab` corruption
The Kotlin incremental cache is damaged:
```bash
rm -rf node_modules/expo-modules-core/android/build/kotlin
cd android && ./gradlew assembleRelease -Pkotlin.incremental=false
```

### `SDK location not found`
```bash
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
# or
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

### Wrong Java version
AGP 8 requires JDK 17 — not 11, not 21:
```bash
java -version
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### Metro cache problems
```bash
npx expo start --clear
```
(Do **not** use `npm run reset-project`.)

### Full clean rebuild
```bash
cd android
./gradlew --stop
./gradlew clean
rm -rf ~/.gradle/caches/build-cache-*
./gradlew assembleRelease
```

### Verify what actually shipped in an APK
```bash
unzip -l android/app/build/outputs/apk/release/app-release.apk | head -30
$ANDROID_HOME/build-tools/35.0.0/aapt2 dump badging \
  android/app/build/outputs/apk/release/app-release.apk | head -20
```

---

## Backend

The app talks to `https://www.u-prepare.com/api` (see
[`services/api/endpoints.js`](services/api/endpoints.js)). Authentication is a bearer token
persisted via `expo-secure-store`; a global axios interceptor in
[`navigation/AuthContext/AuthContext.js`](navigation/AuthContext/AuthContext.js) clears the
session on `401 Invalid or expired token`. The backend must be reachable for anything beyond
the login screen to render real data.

---

## License

Proprietary software. All rights reserved.
