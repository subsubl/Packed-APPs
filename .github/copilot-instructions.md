# Spixi Mini Apps - AI Coding Agent Instructions

## Project Overview

This repository contains the SDK, tooling, and example applications for **Spixi Mini Apps** - client-side WebView applications that run inside the Spixi decentralized messenger. Mini Apps are HTML/CSS/JavaScript applications that communicate with the Spixi native client via a custom protocol (`ixian:` URL scheme).

**Architecture**: Mini Apps run in isolated WebView sessions with bidirectional communication:
- **App → Spixi**: Uses `location.href = "ixian:command..."` protocol to trigger native actions
- **Spixi → App**: Calls global `executeUiCommand()` function with base64-encoded parameters

## Critical Conventions

### 1. SDK Integration Pattern

**Every Mini App MUST include both SDK files in this exact order:**

```html
<script src="js/spixi-app-sdk.js"></script>
<script src="js/spixi-tools.js"></script>
```

**Never modify SDK files** - they should be copied from `mini-apps-sdk/` unchanged.

### 2. Lifecycle Management

All Mini Apps follow this initialization pattern:

```javascript
// Override SDK callbacks BEFORE fireOnLoad
SpixiAppSdk.onInit = function(sessionId, userAddresses) {
    // Initialize app state with session info
    // userAddresses is comma-separated for multiUser apps
};

// Fire load event to notify Spixi when ready
window.onload = SpixiAppSdk.fireOnLoad;
```

**Critical**: Always call `SpixiAppSdk.fireOnLoad()` when the app is ready, typically in `window.onload`.

### 3. Storage Pattern

Storage operations are **asynchronous** and use base64 encoding:

```javascript
// Writing - always base64 encode
SpixiAppSdk.setStorageData(key, btoa(JSON.stringify(data)));

// Reading - request then handle callback
SpixiAppSdk.getStorageData(key);
SpixiAppSdk.onStorageData = function(key, value) {
    const data = JSON.parse(atob(value));  // base64 decode
};
```

**Pattern in multi-user apps**: Use remote user's address as storage key (see `com.ixilabs.spixi.tictactoe`).

### 4. Network Communication

For `multiUser` apps, use JSON-based messaging with action types:

```javascript
// Sending
const data = { action: "move", cellPosition: 5 };
SpixiAppSdk.sendNetworkData(JSON.stringify(data));

// Receiving
SpixiAppSdk.onNetworkData = function(senderAddress, data) {
    const parsed = JSON.parse(data);
    switch(parsed.action) {
        case "move": // handle move
        case "ping": // handle keepalive
    }
};
```

**Best Practice**: Implement periodic ping/keepalive to detect disconnections (see whiteboard/tictactoe examples).

### 5. Protocol Extensions

Advanced apps can define custom protocol handlers:

```javascript
// Register protocol ID (e.g., "com.yourcompany.yourapp")
SpixiAppSdk.sendNetworkProtocolData(protocolId, data);

SpixiAppSdk.onNetworkProtocolData = function(senderAddress, protocolId, data) {
    // Handle protocol-specific messages
};
```

Used in `com.mostnonameuser.spixi.aiassistant` for structured AI communication.

## File Structure Requirements

```
yourapp/
├── appinfo.spixi         # Metadata (REQUIRED)
├── icon.png              # 512x512 recommended
└── app/
    ├── index.html        # Entry point (REQUIRED)
    ├── js/
    │   ├── spixi-app-sdk.js    # SDK copy
    │   ├── spixi-tools.js      # SDK copy
    │   └── yourapp.js          # Your logic
    └── css/
```

### appinfo.spixi Format

```
caVersion = 0
id = com.company.appname          # Reverse DNS notation
publisher = Your Name
name = App Display Name
version = 1.0.0
capabilities = multiUser          # or singleUser, authentication, etc.
```

**Capabilities**:
- `singleUser` - Runs independently (video-test, auth)
- `multiUser` - Requires peer connection (tictactoe, whiteboard)
- `authentication` - Can authenticate users via QR codes
- `transactionSigning` - Can sign blockchain transactions
- `registeredNamesManagement` - Can manage decentralized names

## Development Workflow

### Testing
1. Use `apps/com.ixilabs.spixi.mini-apps-test/` to verify SDK integration
2. Test storage with sequence: write → read → overwrite → delete
3. Test network by running in two Spixi clients simultaneously

### Packaging
Use `app-packer/index.html` (browser-based tool):
1. Drag app folder containing `appinfo.spixi` and `app/` directory
2. Generates: `.zip` (content), `.spixi` (metadata), `icon.png`
3. Upload all three files to your web host

**Note**: Packer works locally only in Firefox due to browser security; use https://apps.spixi.io/packer for other browsers.

## State Synchronization Pattern

Multi-user apps must handle state conflicts. See `tic-tac-toe.js` for canonical example:

```javascript
// Always compare move counts to determine authority
const myMovesCount = gameState.board.filter(x => x != '').length;
const otherMovesCount = receivedState.board.filter(x => x != '').length;

if (otherMovesCount > myMovesCount) {
    // Accept remote state
} else if (otherMovesCount < myMovesCount) {
    // Send our state
} else {
    // Conflict resolution (e.g., force update flag)
}
```

## Common Utilities (spixi-tools.js)

- `SpixiTools.getTimestamp()` - Current Unix timestamp
- `SpixiTools.base64ToBytes(base64)` - Base64 decode to UTF-8
- `SpixiTools.escapeParameter(str)` - Escape HTML entities
- `executeUiCommand(cmd, ...args)` - Internal SDK communication (do not call directly)

## Key Examples

- **Authentication App**: `com.ixilabs.spixi.auth` - QR code scanning with `spixiAction()`
- **Multiplayer Game**: `com.ixilabs.spixi.tictactoe` - State sync, turn management
- **Real-time Collab**: `com.ixilabs.spixi.whiteboard` - Batched data transmission
- **Protocol Extension**: `com.mostnonameuser.spixi.aiassistant` - Custom protocol handlers

## What NOT to Do

- ❌ Don't modify `spixi-app-sdk.js` or `spixi-tools.js`
- ❌ Don't call `executeUiCommand()` directly - it's internal SDK machinery
- ❌ Don't store data without base64 encoding - Spixi expects it
- ❌ Don't forget `fireOnLoad()` - app won't initialize properly
- ❌ Don't use `&&` in terminal commands (Windows PowerShell) - use `;` instead
