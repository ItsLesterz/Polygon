import React, { useState } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Layout, Button, Input, Table, message } from "antd";
import contratoABI from "./MedicamentoTrace.json"; // Asegúrate de tener el ABI del contrato

const { Header, Content } = Layout;
const contratoDireccion = "0x929DA8a3D737bE3aB09fE264ac53eE53B510765e"; // Reemplaza con la dirección de tu contrato desplegado

const App = () => {
    const [cuenta, setCuenta] = useState(null);
    const [proveedor, setProveedor] = useState(null);
    const [lote, setLote] = useState("");
    const [historial, setHistorial] = useState([]);
    const [nuevoPropietario, setNuevoPropietario] = useState("");

    async function conectarWallet() {
        try {
            const provider = new WalletConnectProvider({
                rpc: {
                    11155111: "https://ethereum-sepolia-rpc.publicnode.com", // Sepolia RPC
                },
            });
            await provider.enable();
            const web3Provider = new ethers.BrowserProvider(provider);
            const signer = await web3Provider.getSigner();
            const address = await signer.getAddress();
            setCuenta(address);
            setProveedor(web3Provider);
            message.success(`Conectado a Rainbow Wallet: ${address}`);
        } catch (error) {
            console.error("Error al conectar:", error);
            message.error("Error al conectar Rainbow Wallet");
        }
    }
    
    async function registrarMedicamento() {
        if (!proveedor || !cuenta || !lote) {
            message.warning("Ingresa el lote y conecta Rainbow Wallet");
            return;
        }
        try {
            const signer = await proveedor.getSigner();
            const contrato = new ethers.Contract(contratoDireccion, contratoABI, signer);
            const tx = await contrato.registrarMedicamento("Paracetamol", lote, "2025-03-12");
            await tx.wait();
            message.success("Medicamento registrado con éxito");
        } catch (error) {
            console.error("Error al registrar:", error);
            message.error("Error al registrar medicamento");
        }
    }
    
    async function consultarHistorial() {
        if (!proveedor || !cuenta || !lote) {
            message.warning("Ingresa un lote válido");
            return;
        }
        try {
            const contrato = new ethers.Contract(contratoDireccion, contratoABI, proveedor);
            const transacciones = await contrato.obtenerHistorial(lote);
            const datos = transacciones.map((t, index) => ({
                key: index,
                de: t.de,
                para: t.para,
                timestamp: new Date(t.timestamp * 1000).toLocaleString(),
            }));
            setHistorial(datos);
            message.success("Historial cargado");
        } catch (error) {
            console.error("Error al consultar historial:", error);
            message.error("Error al obtener historial");
        }
    }
    
    async function transferirMedicamento() {
        if (!proveedor || !cuenta || !lote || !nuevoPropietario) {
            message.warning("Ingresa todos los datos");
            return;
        }
        try {
            const signer = await proveedor.getSigner();
            const contrato = new ethers.Contract(contratoDireccion, contratoABI, signer);
            const tx = await contrato.transferirMedicamento(lote, nuevoPropietario);
            await tx.wait();
            message.success("Transferencia realizada con éxito");
        } catch (error) {
            console.error("Error al transferir:", error);
            message.error("Error al transferir medicamento");
        }
    }

    const columnas = [
        { title: "De", dataIndex: "de", key: "de" },
        { title: "Para", dataIndex: "para", key: "para" },
        { title: "Fecha", dataIndex: "timestamp", key: "timestamp" },
    ];

    return (
        <Layout style={{ minHeight: "100vh", padding: "20px" }}>
            <Header style={{ color: "white", textAlign: "center", fontSize: "20px" }}>
                Sistema de Trazabilidad de Medicamentos
            </Header>
            <Content style={{ margin: "20px", textAlign: "center" }}>
                <Button type="primary" onClick={conectarWallet}>
                    Conectar Rainbow Wallet
                </Button>
                <p>Cuenta: {cuenta || "No conectada"}</p>

                <Input
                    placeholder="Lote del medicamento"
                    value={lote}
                    onChange={(e) => setLote(e.target.value)}
                    style={{ width: "50%", marginRight: "10px", marginTop: "20px" }}
                />
                <Button type="default" onClick={registrarMedicamento}>
                    Registrar Medicamento
                </Button>

                <Input
                    placeholder="Nueva dirección del propietario"
                    value={nuevoPropietario}
                    onChange={(e) => setNuevoPropietario(e.target.value)}
                    style={{ width: "50%", marginRight: "10px", marginTop: "20px" }}
                />
                <Button type="dashed" onClick={transferirMedicamento}>
                    Transferir Medicamento
                </Button>
                
                <Button type="dashed" onClick={consultarHistorial} style={{ marginLeft: "10px" }}>
                    Consultar Historial
                </Button>

                <Table dataSource={historial} columns={columnas} style={{ marginTop: "20px" }} />
            </Content>
        </Layout>
    );
};

export default App;
