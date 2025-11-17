# Coin Flip - Spixi Mini App

A multiplayer gambling game where two players bet IXI tokens on a coin flip.

## Features

- **Real-time Multiplayer**: Connect with another Spixi user for head-to-head gambling
- **Fair Betting System**: Lower bet amount is automatically selected
- **Random Coin Flip**: Lower bet player flips the coin for fairness
- **Wallet Integration**: Opens Spixi wallet for secure payment processing
- **Modern UI**: Beautiful gradient design with smooth animations

## How to Play

1. **Place Your Bet**: Enter an amount (minimum 1 IXI) and choose Heads or Tails
2. **Wait for Opponent**: Both players must place their bets
3. **Agreed Bet**: The lower bet amount becomes the agreed bet
4. **Coin Flip**: The player with the lower bet flips the coin
5. **Winner Takes All**: Winner receives double the agreed bet amount
6. **Payment**: Loser clicks button to open wallet and complete payment

## Rules

- Minimum bet: 1 IXI
- Both players must place bets to start
- Lower bet amount is used for fairness
- Lower bet player has flip authority
- Winner receives 2x the agreed bet
- Loser opens Spixi wallet to send payment

## Technical Details

- **Capabilities**: multiUser, transactionSigning
- **Max Users**: 2 players
- **Min Users**: 2 players
- **Network Protocol**: JSON-based state synchronization
- **Transaction Integration**: Uses `SpixiAppSdk.spixiAction()` with JSON payload

## Transaction Implementation

The app uses Spixi's action handler for payment processing:

```javascript
const transactionData = {
    command: "sendPayment",
    to: recipientAddress,
    amount: amountString,
    requestId: uniqueId
};

SpixiAppSdk.spixiAction(JSON.stringify(transactionData));
```

This approach:
- Opens the Spixi wallet with pre-filled recipient and amount
- Allows user to review and confirm the transaction
- Handles transaction signing securely within Spixi
- Follows Spixi's security model for Mini Apps

## Development

Built following Spixi Mini Apps SDK conventions:

### Networking
- Bidirectional connection handshake (500ms retry)
- Keepalive pings (3s intervals) for connection monitoring
- State synchronization via JSON network messages
- Fire-and-forget connection replies for reliability

### Game States
1. **Betting Phase**: Players input bet amount and choose side
2. **Waiting Phase**: Shows your bet while waiting for opponent
3. **Ready Phase**: Displays both bets and determines flipper
4. **Flipping Phase**: Animated coin flip (2s animation)
5. **Result Phase**: Shows winner and initiates payment flow

### Network Messages
- `connect`: Bidirectional handshake with session ID
- `ping`: Keepalive packets
- `bet`: Bet amount and choice (heads/tails)
- `flip`: Coin flip result from flipper
- `reset`: Play again request

## Architecture

### Fair Play Mechanics
- **Lower Bet Selection**: Prevents high-roller advantage
- **Flipper Authority**: Lower bet player has control
- **Deterministic Results**: Random flip on flipper's client
- **Result Broadcast**: Flip result sent to opponent

### State Management
```javascript
gameState = {
    localBet, localChoice,    // Your bet
    remoteBet, remoteChoice,  // Opponent's bet
    agreedBet,                // Min(localBet, remoteBet)
    isFlipper,                // true if you flip
    coinResult,               // 'heads' or 'tails'
    winner                    // Winner's address
}
```

## UI Design

- **Modern Gambling Theme**: Gold gradients and dark background
- **Responsive Layout**: Works on mobile and desktop
- **Smooth Animations**: 2-second coin flip with 1800° rotation
- **Accessible**: 44px minimum touch targets (WCAG 2.1)
- **Clear States**: Visual feedback for each game phase

## Version History

**1.0.1** - Transaction implementation fix
- Updated transaction handling to use proper Spixi action handlers
- Improved wallet integration UX
- Opens Spixi wallet with pre-filled payment details

**1.0.0** - Initial release
- Core gambling mechanics
- Multiplayer networking
- Wallet integration for payments
- Modern responsive UI
