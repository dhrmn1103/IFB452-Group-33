// createWill.js

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = "0xdeEd7Ec0Da23801Cac5E7b1F05f881Fb0B5cecCC"; // ✅ Updated address

// ✅ Updated ABI with correct function input types and structure
const contractABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_beneficiary", "type": "address" },
      { "internalType": "string", "name": "_beneficiaryNameHash", "type": "string" },
      { "internalType": "string", "name": "_assetInfoHash", "type": "string" },
      { "internalType": "string", "name": "_ageConditionHash", "type": "string" }
    ],
    "name": "createWill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let signer, contract;

// Connect wallet and set up contract
provider.send("eth_requestAccounts", []).then(() => {
  provider.listAccounts().then(accounts => {
    signer = provider.getSigner(accounts[0]);
    contract = new ethers.Contract(contractAddress, contractABI, signer);
  });
});

// Utility: hash input string using keccak256
function sha3(input) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(input));
}

// Handle form submission
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("create-will-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const beneficiaryName = document.getElementById("beneficiaries").value.trim();
    const beneficiaryAddress = document.getElementById("beneficiaryAddress").value.trim();
    const asset = document.getElementById("assets").value.trim();
    const age = document.getElementById("age").value.trim();

    if (!ethers.utils.isAddress(beneficiaryAddress)) {
      alert("❌ Invalid Ethereum address for beneficiary.");
      return;
    }

    if (!age || isNaN(age) || parseInt(age) < 0) {
      alert("❌ Please enter a valid non-negative number for age.");
      return;
    }

    try {
      const tx = await contract.createWill(
        beneficiaryAddress,
        sha3(beneficiaryName),
        sha3(asset),
        sha3(age)
      );

      await tx.wait();
      alert("✅ Will successfully recorded on blockchain!");
      document.getElementById("create-will-form").reset();
    } catch (err) {
      console.error("❌ Transaction failed:", err);
      alert("❌ Failed to create will. Check the console for details.");
    }
  });
});
