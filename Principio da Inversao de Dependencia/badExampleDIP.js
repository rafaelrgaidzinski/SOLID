// RUIM: alto acoplamento, difícil trocar implementações
class MySQLDatabase {
  salvar(dados) {
    console.log(`Salvando no MySQL: ${dados}`);
  }
}

class GerenciadorUsuarios {
  constructor() {
    this.database = new MySQLDatabase(); // Depende de implementação concreta
  }
  salvarUsuario(usuario) {
    this.database.salvar(usuario);
  }
}