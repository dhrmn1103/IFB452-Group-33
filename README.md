# IFB452-Group-33
Digital Will DApp

This project is a decentralized application (DApp) that allows users to securely create, validate, and execute digital wills on the Ethereum blockchain. The system ensures that asset distribution follows predefined rules and includes a time-locked condition that prevents the release of assets to beneficiaries under the age of 18.

Team Members and Contributions

- Dharman – Front-End Development  
  Dharman was responsible for designing and implementing the front-end interface using HTML, CSS, and JavaScript. This includes all UI forms, page navigation, and visual user interaction workflows.

- Hassan – Integration and Time Logic  
  Hassan worked on connecting the front-end with the smart contracts, focusing particularly on ensuring that time-based conditions like age verification were handled correctly. He also helped bridge the UI with the backend logic.

- Fayaaz – Back-End Development  
  Fayaaz was in charge of designing and implementing the smart contracts in Solidity. He developed the logic for will verification and execution, including managing contract state and security checks.

Smart Contracts

1. ValidateWill.sol

This contract handles the validation of a will through the submission of a death certificate. Once submitted, the will is marked as verified and an event is emitted to log the verification.

Key Features:
- isVerified: Tracks verification status of each will by ID.
- verifiers: Keeps a record of addresses that submitted verification.
- submitDeathCertificate: Accepts a hash of the death certificate and marks the will as verified.
- getVerifiers: Returns the list of verifier addresses for a given will ID.

Code Summary:

function submitDeathCertificate(uint256 willId, string memory deathCertHash) public {
    require(!isVerified[willId], "Already verified");
    isVerified[willId] = true;
    verifiers[willId].push(msg.sender);
    emit DeathVerified(willId, msg.sender, deathCertHash);
}

2. ValidateAndExecuteWill.sol

This contract connects to a WillCreation contract and enables execution of the will only after the death has been verified and certain conditions (like age) are met.

Key Features:
- submitDeathCertificate: Similar to the validation step but used in coordination with another contract interface.
- executeWill: Executes the will by confirming the will is valid, verified, and not already executed.
- executed: Tracks whether each will has already been executed.

Code Summary:

function executeWill(uint willId) external {
    IWillCreation.Will memory will = willContract.getWillById(willId);
    require(will.testator != address(0), "Will does not exist");
    require(!will.isRevoked, "Will is revoked");
    require(isVerified[willId], "Not verified");
    require(!executed[willId], "Already executed");

    executed[willId] = true;
    emit WillExecuted(willId, will.beneficiary);
}

Front-End Features

The front-end was developed in HTML, CSS, and JavaScript. Styling is handled using a modern, responsive CSS layout.

Key Pages:
- Create Will Page: Allows testators to input will information and designate beneficiaries.
- Verify Age Page: Collects the beneficiary's birth year and a scanned image of the birth certificate. If the age is under 18, execution is blocked.
- Execution Panel: Used by legal authorities or authorized verifiers to submit a death certificate to verify the will.
- Navigation: Responsive navbar links to all key pages.

Usage Workflow

1. The testator accesses the Create Will page and submits will data to the smart contract.
2. A verifier submits a death certificate hash to the ValidateWill contract.
3. The beneficiary or an executor inputs the birth year and uploads a document for manual/automated age verification.
4. If the will is verified and the beneficiary is 18 or older, the ValidateAndExecuteWill contract allows execution.
5. The will is executed, and an event is emitted to confirm successful asset transfer.

Project Structure

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

/README.txt

Technologies Used

- Solidity (version ^0.8.20)
- HTML5 / CSS3
- JavaScript (for UI logic and condition handling)
- IPFS-compatible hash storage (for document proofs, simulated)
- Ethereum (smart contract execution via Remix)

Security Notes

- Smart contracts ensure that:
  - Wills cannot be verified more than once.
  - Execution is only allowed after death verification and if the will is not revoked.
  - Each will can only be executed one time.
- The current implementation simulates file verification. In a production environment, integration with IPFS and cryptographic hashing should be used.
- Future enhancements could include using Chainlink oracles for date-based logic or integrating biometric verification.

License

This project is open source and licensed under the MIT License. You are free to use, modify, and distribute this software with appropriate credit to the contributors.
