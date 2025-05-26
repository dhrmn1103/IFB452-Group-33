const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
let executeContract, validateContract, willContract;

const EXECUTE_CONTRACT_ADDRESS = "0xdc4DeA5ebAe12794cB79F73845eb2a6ea6a58626";
const VALIDATE_CONTRACT_ADDRESS = "0x43BF4f97E4A967a6589123060BE90970F383C686";
const WILL_CONTRACT_ADDRESS = "0x2F9437f76108a98606e0cb59a9cFB180061626b4";

const DEBUG_MODE = true;

const EXECUTE_CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "willId", type: "uint256" }],
    name: "executeWill",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "executed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  }
];

const VALIDATE_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "willId", type: "uint256" },
      { internalType: "string", name: "deathCertHash", type: "string" }
    ],
    name: "submitDeathCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "willId", type: "uint256" }],
    name: "isVerified",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  }
];

const WILL_CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "_willId", type: "uint256" }],
    name: "getWillById",
    outputs: [{
      components: [
        { internalType: "uint256", name: "id", type: "uint256" },
        { internalType: "address", name: "testator", type: "address" },
        { internalType: "address", name: "beneficiary", type: "address" },
        { internalType: "string", name: "beneficiaryNameHash", type: "string" },
        { internalType: "string", name: "assetInfoHash", type: "string" },
        { internalType: "string", name: "ageConditionHash", type: "string" },
        { internalType: "bool", name: "isRevoked", type: "bool" }
      ],
      internalType: "struct WillCreation.Will",
      name: "",
      type: "tuple"
    }],
    stateMutability: "view",
    type: "function"
  }
];

async function connectContracts() {
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  executeContract = new ethers.Contract(EXECUTE_CONTRACT_ADDRESS, EXECUTE_CONTRACT_ABI, signer);
  validateContract = new ethers.Contract(VALIDATE_CONTRACT_ADDRESS, VALIDATE_CONTRACT_ABI, signer);
  willContract = new ethers.Contract(WILL_CONTRACT_ADDRESS, WILL_CONTRACT_ABI, signer);
}

window.addEventListener("DOMContentLoaded", () => {
  connectContracts();

  const approvalForm = document.getElementById("approval-form");
  if (approvalForm) {
    approvalForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const willId = document.getElementById("will-id-approval").value.trim();
      const certificateInput = document.getElementById("certificate");

      if (!certificateInput.files.length) return alert("❌ Upload a certificate.");

      const fakeHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("death-certificate"));

      try {
        const tx = await validateContract.submitDeathCertificate(willId, fakeHash);
        await tx.wait();
        alert("✅ Certificate submitted.");
      } catch (err) {
        console.error("❌ Certificate Error:", err);
        alert("❌ Submission failed. Already verified?");
      }
    });
  }

  const executionForm = document.getElementById("execution-form");
  if (executionForm) {
    executionForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const willId = document.getElementById("will-id-execution").value.trim();

      try {
        if (DEBUG_MODE) {
          console.group(`🔍 Execution Debug [Will ID: ${willId}]`);
          const willData = await willContract.getWillById(willId);
          const isVerified = await validateContract.isVerified(willId);
          const alreadyExecuted = await executeContract.executed(willId);

          console.log("Will:", willData);
          console.log("Verified:", isVerified);
          console.log("Executed:", alreadyExecuted);
          console.log("Revoked:", willData.isRevoked);

          if (willData.isRevoked) return alert("❌ Will is revoked");
          if (!isVerified) return alert("❌ Death not verified");
          if (alreadyExecuted) return alert("❌ Will already executed");

          console.groupEnd();
        }

        const tx = await executeContract.executeWill(willId, {
          gasLimit: 100000
        });
        await tx.wait();
        alert("✅ Will executed successfully");
      } catch (err) {
        console.error("❌ Execution error:", err);
        alert("❌ Execution failed. See console.");
      }
    });
  }
});
