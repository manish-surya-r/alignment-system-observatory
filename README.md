
# Alignment Systems Observatory (ASO)

ASO is a safety-critical human-machine interface (HMI) designed for the supervision of advanced AI systems. It provides real-time telemetry, state-space visualization, and hard-wired override capabilities.

## High-Level Architecture
The system is built as a cross-platform solution (simulated here in a unified React environment):
1.  **Mobile (Operator Interface):** Optimized for low-latency control and rapid reaction. Features a prominent E-Stop and confidence metrics.
2.  **Web (Observer Dashboard):** Optimized for multi-stream monitoring and deep-dive analytics.
3.  **Backend (WebSocket Hub):** A pub/sub architecture that ensures all connected clients receive synchronized telemetry updates.
4.  **Native Bridge (Kotlin):** A simulated module representing interaction with hardware (e.g., a BLE button for tactile safety overrides).

## Core Principles
- **Low Cognitive Load:** High-contrast, monochromatic-first design with color used only for status.
- **Fail-Safe Control:** Explicit "Emergency Stop" functionality that overrides automated processes.
- **Epistemic Transparency:** Real-time visualization of the AI's "latent landscape" to identify uncertainty before it becomes a failure.

## Implementation Details
- **Frontend:** React with Tailwind CSS for high-fidelity UI.
- **Visualization:** D3.js for the latent decision landscape.
- **State:** Centralized telemetry store simulating a real-time event bus.
- **Native:** A browser-based emulator (NativeEmulator) replicates the bridge events between the Android OS and React Native.

## How to use the Prototype
1.  **Toggle Views:** Switch between "Mobile Operator" and "Web Dashboard" at the top.
2.  **E-Stop:** Press the red button to halt the system simulation.
3.  **Native Interaction:** Use the "Kotlin Bridge Sim" in the bottom-right. **Hold** the button to trigger a `LONG_PRESS` which is mapped to an Emergency Shutdown.

---
*Note: This is a supervisory tool, not an AI agent. It is designed to empower human oversight.*
