import React, { useState } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button, Layout, message } from "antd";

const { Header, Content } = Layout;

const contratoDireccion = "0x3FBA30A7d969ABe8E462333523D48365195F6898"; // Reemplázalo con la dirección real de tu contrato

function App() {
    const [cuenta, setCuenta] = useState(null);
    const [proveedor, setProveedor] = useState(null);
    const [contrato, setContrato] = useState(null);

    async function conectarWallet() {
        try {
            // Configurar WalletConnect
            const provider = new WalletConnectProvider({
                rpc: {
                    11155111: "https://ethereum-sepolia-rpc.publicnode.com", // Sepolia RPC
                },
            });

            // Habilitar conexión
            await provider.enable();

            // Crear proveedor y signer
            const web3Provider = new ethers.providers.Web3Provider(provider);
            const signer = web3Provider.getSigner();

            // Obtener la cuenta conectada
            const address = await signer.getAddress();
            setCuenta(address);
            setProveedor(web3Provider);

            message.success(`Conectado a Rainbow Wallet: ${address}`);
        } catch (error) {
            message.error("Error al conectar Rainbow Wallet");
        }
    }

    return (
        <Layout style={{ minHeight: "100vh", padding: "20px" }}>
            <Header style={{ color: "white", textAlign: "center", fontSize: "20px" }}>
                Conectar a Sepolia con Rainbow Wallet
            </Header>
            <Content style={{ textAlign: "center", marginTop: "50px" }}>
                <Button type="primary" onClick={conectarWallet}>
                    Conectar Rainbow Wallet
                </Button>
                <p>Cuenta: {cuenta || "No conectada"}</p>
            </Content>
        </Layout>
    );
}

export default App;
