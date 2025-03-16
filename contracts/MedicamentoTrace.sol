// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedicamentoTrace {
    struct Medicamento {
        string nombre;
        string lote;
        string fechaProduccion;
        address actualPropietario;
    }

    struct Transferencia {
        address de;
        address para;
        uint256 timestamp;
    }

    mapping(string => Medicamento) public medicamentos;
    mapping(string => Transferencia[]) public historialTransferencias;

    event MedicamentoRegistrado(string lote, string nombre, address propietario);
    event TransferenciaRealizada(string lote, address de, address para, uint256 timestamp);

    function registrarMedicamento(string memory _nombre, string memory _lote, string memory _fechaProduccion) public {
        require(medicamentos[_lote].actualPropietario == address(0), "El medicamento ya esta registrado.");
        
        medicamentos[_lote] = Medicamento(_nombre, _lote, _fechaProduccion, msg.sender);
        emit MedicamentoRegistrado(_lote, _nombre, msg.sender);
    }

    function transferirMedicamento(string memory _lote, address _nuevoPropietario) public {
        require(medicamentos[_lote].actualPropietario == msg.sender, "No eres el propietario actual.");
        
        historialTransferencias[_lote].push(Transferencia(msg.sender, _nuevoPropietario, block.timestamp));
        medicamentos[_lote].actualPropietario = _nuevoPropietario;

        emit TransferenciaRealizada(_lote, msg.sender, _nuevoPropietario, block.timestamp);
    }

    function obtenerHistorial(string memory _lote) public view returns (Transferencia[] memory) {
        return historialTransferencias[_lote];
    }
}
