const hre = require("hardhat");

async function main() {
    const MedicamentoTrace = await hre.ethers.getContractFactory("MedicamentoTrace");
    const contrato = await MedicamentoTrace.deploy(); // Desplegamos el contrato

    await contrato.waitForDeployment(); // Nueva forma de esperar el despliegue en ethers v6

    console.log("Contrato desplegado en:", await contrato.getAddress()); // Obtener la dirección del contrato
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
