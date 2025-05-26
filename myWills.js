const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = "0x096de3b63E631350e80B8d19Fe13c5f22a6b1e59";

const contractABI = [
  {
    "inputs": [],
    "name": "getMyWills",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "testator", "type": "address" },
          { "internalType": "address", "name": "beneficiary", "type": "address" },
          { "internalType": "string", "name": "beneficiaryNameHash", "type": "string" },
          { "internalType": "string", "name": "assetInfoHash", "type": "string" },
          { "internalType": "string", "name": "conditionHash", "type": "string" },
          { "internalType": "bool", "name": "isRevoked", "type": "bool" }
        ],
        "internalType": "struct WillCreation.Will[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_willId", "type": "uint256" }
    ],
    "name": "revokeWill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let signer, contract;

async function loadWills() {
  if (!window.ethereum) {
    alert("MetaMask not detected. Please install it.");
    return;
  }

  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    const wills = await contract.getMyWills();
    const container = document.getElementById("will-list");
    container.innerHTML = "";

    if (wills.length === 0) {
      container.innerHTML = "<p>No wills found for this address.</p>";
      return;
    }

    wills.forEach((will) => {
      const willCard = document.createElement("div");
      willCard.className = "will-card";
      willCard.innerHTML = `
        <h3>Will ID: ${will.id}</h3>
        <p><strong>Beneficiary Address:</strong> ${will.beneficiary}</p>
        <p><strong>Beneficiary Hash:</strong> ${will.beneficiaryNameHash}</p>
        <p><strong>Asset Hash:</strong> ${will.assetInfoHash}</p>
        <p><strong>Condition Hash:</strong> ${will.conditionHash}</p>
        <p><strong>Status:</strong> ${will.isRevoked ? "Revoked ❌" : "Active ✅"}</p>
        ${!will.isRevoked ? `<button onclick="revokeWill(${will.id})" class="submit-button">Revoke Will</button>` : ""}
      `;
      container.appendChild(willCard);
    });

  } catch (err) {
    console.error("Error loading wills:", err);
    document.getElementById("will-list").innerHTML = "<p>Error loading wills.</p>";
  }
}

async function revokeWill(willId) {
  try {
    const tx = await contract.revokeWill(willId);
    await tx.wait();
    alert(`✅ Will #${willId} successfully revoked.`);
    loadWills(); // Refresh list
  } catch (err) {
    console.error("Revoke failed:", err);
    alert("❌ Failed to revoke will.");
  }
}

window.addEventListener("DOMContentLoaded", loadWills);
