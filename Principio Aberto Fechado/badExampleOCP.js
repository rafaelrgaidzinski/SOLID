// RUIM: toda vez precisa modificar para incluir um novo tipo
class CalculadoraDesconto {
  calcular(cliente, valor) {
    if (cliente.tipo === 'regular') {
      return valor * 0.9;
    } else if (cliente.tipo === 'vip') {
      return valor * 0.8;
    }
    // Para novo tipo, tem que editar aqui 😞
    return valor;
  }
}