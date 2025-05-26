# IFB452-Group-33

# ⚖️ Digital Will DApp

**A blockchain-based decentralized application** for secure will creation, verification, and execution, with time-locked asset release and age validation logic.

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-blue.svg)]()
[![Frontend](https://img.shields.io/badge/frontend-HTML%2FCSS%2FJS-orange.svg)]()
[![Deployed On](https://img.shields.io/badge/platform-Ethereum-black.svg)]()

---

## 🌐 Demo

🔗 Not yet deployed publicly – run locally or through Remix IDE.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Smart Contracts](#-smart-contracts)
- [Frontend Highlights](#-frontend-highlights)
- [Usage Flow](#-usage-flow)
- [Project Roles](#-project-roles)
- [Folder Structure](#-folder-structure)
- [Security Notes](#-security-notes)
- [License](#-license)

---

## 🧩 Overview

**Digital Will DApp** enables:

- Digital will creation and management
- Verifier-based death certificate submission
- Smart contract-based execution of wills
- Time-lock condition: beneficiary must be 18+

The platform aims to solve legal challenges around inheritance, fairness, and asset distribution using Ethereum smart contracts and verifiable logic.

---

## ✨ Features

✅ Smart contract-verified death certificate  
✅ One-time execution with revoke support  
✅ Age verification via birth year input  
✅ UI preview of uploaded documents  
✅ Responsive design with clean layout  
✅ Event logging on chain  
✅ Custom input validation in frontend  
✅ MIT licensed and open source  

---

## 🔧 Tech Stack

- **Smart Contracts:** Solidity ^0.8.20
- **Frontend:** HTML, CSS, JavaScript
- **Blockchain:** Ethereum, Remix IDE
- **Hashing (simulated):** IPFS/document string
- **Version Control:** Git + GitHub

---

## 🔒 Smart Contracts

### willcreation.sol
- stores all information including assets allocation
- Allows the testator to create the will with all details
- Stores verification status of wills
- Allows submission of death certificate hashes
- Emits `DeathVerified` events

### ExecuteWill.sol

- Interfaces with a WillContract
- Submits death certificates and marks wills verified
- Executes wills once verified and not revoked

---

## 🖥️ Frontend Highlights

- Built with vanilla HTML/CSS/JS
- Styled with custom CSS for responsive layout
- Contains birth year input + image verification
- Displays messages and conditions clearly
- Verifies if beneficiary is 18+ before executing will

---

## 🔄 Usage Flow

1. Testator creates a will and defines a beneficiary.
2. Verifier uploads a death certificate (hash).
3. Smart contract logs the execution on-chain.
4. Beneficiary enters birth year and uploads ID.
5. If verified and aged 18+, assets can be released.


---

## 👥 Project Roles

| Name     | Role                  | Contributions                                           |
|----------|-----------------------|---------------------------------------------------------|
| Dharman  | Front-End Developer   | UI, form flows, frontend interactions                   |
| Hassan   | Full Stack Developer  | Integrated UI with backend, age logic, document upload  |
| Fayaaz   | Back-End Developer    | Created, tested, and deployed backend Solidity contracts|

---

## 📁 Folder Structure

```
/contracts
  ├── willcreation.sol
  └── ExecuteWill.sol

/frontend
  ├── index.html
  ├── create-will.html
  ├── verify-inheritence.html
  ├── My-wills.html
  └── execution-panel.html
    

/style
  └── style.css

README.md
```

---

## 🔐 Security Notes

- Prevents multiple executions of the same will
- Rejects already revoked or unverifiable wills
- Future enhancements:
  - Real IPFS integration for file proof
  - Chainlink oracles for trusted age verification

---

## 📄 License

This project is licensed under Hassan, Fayaaz and Dharman.  
Feel free to use, modify, and distribute with credit to the authors.


