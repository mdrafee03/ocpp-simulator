# OCPP 1.6 Charger Simulator

A React-based simulator for OCPP 1.6 (Open Charge Point Protocol) charging stations. This application allows you to simulate various OCPP operations and test charging station behavior.

## Features

- **WebSocket Connection**: Real-time communication with OCPP servers
- **Transaction Management**: Start, stop, and monitor charging transactions
- **Meter Values**: Simulate realistic energy consumption with configurable intervals
- **Status Notifications**: Send charger status updates
- **Authorization**: Handle user authorization requests
- **Remote Operations**: Support for remote start/stop transactions
- **Persistent State**: Transaction IDs and configurations persist across browser refreshes
- **Real-time Logging**: Comprehensive logging of all OCPP messages

## Live Demo

Visit the live application: [OCPP Simulator](https://mdrafee.github.io/ocpp-simulator)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mdrafee/ocpp-simulator.git
   cd ocpp-simulator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Workflow

1. **Connect**: Click "Connect" to establish WebSocket connection
2. **Authorize**: Send authorization request (optional but recommended)
3. **Start Transaction**: Begin a charging session
4. **Send Meter Values**: Start sending energy consumption data
5. **Stop Transaction**: End the charging session

### Configuration

- **Environment**: Choose between Local and Dev servers
- **Serial Number**: Configure charger identification
- **Meter Values**: Set starting energy value and interval
- **Charger Management**: Add/remove multiple chargers

### Features

#### Meter Value Simulation

- Realistic energy consumption calculations
- Configurable sending intervals (5-60 seconds)
- Power and State of Charge (SoC) simulation
- Monotonic energy increase (never decreases)

#### Transaction Management

- Start/stop transactions
- Remote transaction control
- Transaction ID persistence
- Real-time status updates

#### WebSocket Communication

- Automatic reconnection
- Message tracking and correlation
- Error handling and logging
- OCPP 1.6 protocol compliance

## OCPP 1.6 Support

This simulator supports the following OCPP 1.6 operations:

### Outgoing Messages (Client to Server)

- `BootNotification`
- `Authorize`
- `StartTransaction`
- `StopTransaction`
- `Heartbeat`
- `StatusNotification`
- `MeterValues`

### Incoming Messages (Server to Client)

- `GetConfiguration`
- `RemoteStartTransaction`
- `RemoteStopTransaction`
- `SetChargingProfile`
- `ClearChargingProfile`

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ControlPanel/   # Main control interface
│   ├── LogConsole/     # Message logging
│   └── Settings/       # Configuration modal
├── hooks/              # Custom React hooks
│   ├── Handlers/       # OCPP message handlers
│   └── useMeterValue.ts
├── store/              # Zustand state management
├── constants/          # OCPP constants and enums
└── interfaces/         # TypeScript interfaces
```

### Key Technologies

- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first styling
- **DaisyUI**: Component library
- **react-use-websocket**: WebSocket management

### Building for Production

```bash
npm run build
```

### Deployment

The app is automatically deployed to GitHub Pages:

```bash
npm run deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:

- Create an issue on GitHub
- Check the OCPP 1.6 specification for protocol details

## Acknowledgments

- OCPP 1.6 specification
- React and Vite communities
- DaisyUI for the beautiful components
