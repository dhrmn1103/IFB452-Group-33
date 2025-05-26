# IFB452-Group-33

# Digital Will DApp

A decentralized application (DApp) for secure digital will creation, verification, and execution using Ethereum smart contracts.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Team Members and Contributions](#team-members-and-contributions)  
3. [Smart Contracts](#smart-contracts)  
   - [ValidateWill.sol](#1-validatewillsol)  
   - [ValidateAndExecuteWill.sol](#2-validateandexecutewillsol)  
4. [Front-End Features](#front-end-features)  
5. [Usage Workflow](#usage-workflow)  
6. [Project Structure](#project-structure)  
7. [Technologies Used](#technologies-used)  
8. [Security Notes](#security-notes)  
9. [License](#license)

---

## Project Overview

Digital Will DApp provides a blockchain-based solution to manage the creation, validation, and execution of digital wills. The system ensures that:

- Wills are immutable and stored securely  
- Verification of death is required before execution  
- Beneficiaries must meet a minimum age (18 years) for asset release  

---

## Team Members and Contributions

- **Dharman** – *Front-End Developer*  
  Built the entire user interface with HTML, CSS, and JavaScript. Created all user interaction pages including forms and flows.

- **Hassan** – *Full Stack Integrator*  
  Connected the front-end with smart contracts and implemented the time-based (age verification) logic. Supported UI-to-chain interaction.

- **Fayaaz** – *Back-End Developer*  
  Developed Solidity smart contracts including validation, execution, and event logging mechanisms.

---

## Smart Contracts

### 1. ValidateWill.sol

Handles verification of a will by allowing a verifier to submit a hash of the death certificate.

**Features:**

- `isVerified`: Tracks if the will has been verified.  
- `verifiers`: Stores verifier addresses for each will.  
- `submitDeathCertificate`: Marks a will as verified and emits an event.  
- `getVerifiers`: Returns list of verifiers for a given will ID.

**Example Function:**

```solidity
function submitDeathCertificate(uint256 willId, string memory deathCertHash) public {
    require(!isVerified[willId], "Already verified");
    isVerified[willId] = true;
    verifiers[willId].push(msg.sender);
    emit DeathVerified(willId, msg.sender, deathCertHash);
}
```

---

### 2. ValidateAndExecuteWill.sol

Handles conditional execution of wills after verification.

**Features:**

- `submitDeathCertificate`: Validates death status of testator.  
- `executeWill`: Executes will if all checks pass.  
- `executed`: Tracks if a will has already been executed.

**Example Function:**

```solidity
function executeWill(uint willId) external {
    IWillCreation.Will memory will = willContract.getWillById(willId);
    require(will.testator != address(0), "Will does not exist");
    require(!will.isRevoked, "Will is revoked");
    require(isVerified[willId], "Not verified");
    require(!executed[willId], "Already executed");

    executed[willId] = true;
    emit WillExecuted(willId, will.beneficiary);
}
```

---

## Front-End Features

Developed using HTML, CSS, and JavaScript with responsive styling.

**Core Pages:**

- **Create Will** – Enter beneficiary and asset details  
- **Verify Age** – Checks if beneficiary is 18+, includes document upload  
- **Execution Panel** – Verifier uploads a death certificate  
- **Navigation Bar** – Links all modules in a user-friendly layout  

---

## Usage Workflow

1. Testator creates a will via the UI.  
2. Authorized verifier submits a death certificate hash.  
3. Beneficiary’s age is verified (must be 18+).  
4. If all checks pass, the will is executed and a blockchain event is emitted.  

---

## Project Structure

```
/contracts
  ├── ValidateWill.sol
  └── ValidateAndExecuteWill.sol

/frontend
  ├── index.html
  ├── create-will.html
  ├── execution-panel.html
  ├── verify-age.html

/style
  └── style.css

README.md
```

---

## Technologies Used

- Solidity (version ^0.8.20)  
- HTML5 / CSS3  
- JavaScript  
- IPFS-compatible hash storage (simulated)  
- Ethereum blockchain  

---

## Security Notes

- Will execution is only allowed if:
  - The will is not revoked  
  - Death has been verified  
  - The will has not already been executed  

- Smart contracts prevent duplicate execution or verification.  
- Future improvements include:
  - IPFS document integrity validation  
  - Oracles for real-world conditions  
  - Biometric or off-chain document verification  

---

## License

This project is open source and licensed under the MIT License.  
You are free to use, modify, and distribute this software with proper credit to the contributors.

