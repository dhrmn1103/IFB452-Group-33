# IFB452-Group-33
DIGITAL WILL DAPP

A decentralized application (DApp) for secure digital will creation, verification, and execution using Ethereum smart contracts.

-------------------------------------------------------------------------------

TABLE OF CONTENTS

1. Project Overview
2. Team Members and Contributions
3. Smart Contracts
   - ValidateWill.sol
   - ValidateAndExecuteWill.sol
4. Front-End Features
5. Usage Workflow
6. Project Structure
7. Technologies Used
8. Security Notes
9. License

-------------------------------------------------------------------------------

PROJECT OVERVIEW

Digital Will DApp provides a blockchain-based solution to manage the creation, validation, and execution of digital wills. The system ensures that:

- Wills are immutable and stored securely
- Verification of death is required before execution
- Beneficiaries must meet a minimum age (18 years) for asset release

-------------------------------------------------------------------------------

TEAM MEMBERS AND CONTRIBUTIONS

- Dharman – Front-End Developer
  Built the entire user interface with HTML, CSS, and JavaScript. Created all user interaction pages including forms and flows.

- Hassan – Full Stack Integrator
  Connected the front-end with smart contracts and implemented the time-based (age verification) logic. Supported UI-to-chain interaction.

- Fayaaz – Back-End Developer
  Developed Solidity smart contracts including validation, execution, and event logging mechanisms.

-------------------------------------------------------------------------------

SMART CONTRACTS

1. VALIDATEWILL.SOL

Handles verification of a will by allowing a verifier to submit a hash of the death certificate.

Features:
- isVerified: Tracks if the will has been verified.
- verifiers: Stores verifier addresses for each will.
- submitDeathCertificate: Marks a will as verified and emits an event.
- getVerifiers: Returns list of verifiers for a given will ID.

Example Function:

function submitDeathCertificate(uint256 willId, string memory deathCertHash) public {
    require(!isVerified[willId], "Already verified");
    isVerified[willId] = true;
    verifiers[willId].push(msg.sender);
    emit DeathVerified(willId, msg.sender, deathCertHash);
}

2. VALIDATEANDEXECUTEWILL.SOL

Handles conditional execution of wills after verification.

Features:
- submitDeathCertificate: Validates death status of testator.
- executeWill: Executes will if all checks pass.
- executed: Tracks if a will has already been executed.

Example Function:

function executeWill(uint willId) external {
    IWillCreation.Will memory will = willContract.getWillById(willId);
    require(will.testator != address(0), "Will does not exist");
    require(!will.isRevoked, "Will is revoked");
    require(isVerified[willId], "Not verified");
    require(!executed[willId], "Already executed");

    executed[willId] = true;
    emit WillExecuted(willId, will.beneficiary);
}

-------------------------------------------------------------------------------

FRONT-END FEATURES

Developed using HTML, CSS, and JavaScript with responsive styling.

Core Pages:
- Create Will – Enter beneficiary and asset details
- Verify Age – Checks if beneficiary is 18+, includes document upload
- Execution Panel – Verifier uploads a death certificate
- Navigation Bar – Links all modules in a user-friendly layout

-------------------------------------------------------------------------------

USAGE WORKFLOW

1. Testator creates a will via the UI.
2. Authorized verifier submits a death certificate hash.
3. Beneficiary’s age is verified (must be 18+).
4. If all checks pass, the will is executed and a blockchain event is emitted.

-------------------------------------------------------------------------------

PROJECT STRUCTURE

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

README.txt

-------------------------------------------------------------------------------

TECHNOLOGIES USED

- Solidity (version ^0.8.20) – Smart contract language
- HTML5 / CSS3 – Web layout and styling
- JavaScript – Front-end logic and validation
- IPFS-compatible hash storage (simulated)
- Ethereum – Blockchain platform for smart contracts

-------------------------------------------------------------------------------

SECURITY NOTES

- Will execution is only allowed if:
  - The will is not revoked
  - Death has been verified
  - The will has not already been executed

- Smart contracts prevent duplicate execution or verification.
- In a production version, verification should include IPFS and document integrity checking.

-------------------------------------------------------------------------------

LICENSE

This project is open source and licensed under the MIT License.
You are free to use, modify, and distribute this software with appropriate credit to the contributors.

