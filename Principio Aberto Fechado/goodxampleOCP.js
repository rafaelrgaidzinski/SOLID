// BOM: basta criar uma nova classe para cada tipo novo
class Cliente {
  calcularDesconto(valor) {
    return valor; // padrão sem desconto
  }
}

class ClienteRegular extends Cliente {
  calcularDesconto(valor) {
    return valor * 0.9;
  }
}

class ClienteVIP extends Cliente {
  calcularDesconto(valor) {
    return valor * 0.8;
  }
}

// Adicionar tipo novo não afeta código antigo 👌
class ClienteGold extends Cliente {
  calcularDesconto(valor) {
    return valor * 0.7;
  }
}

class CalculadoraDesconto {
  calcular(cliente, valor) {
    return cliente.calcularDesconto(valor);
  }
}