// BOM: baixo acoplamento, fácil trocar implementações
class Database {
  salvar(dados) {
    throw new Error('Implementar na classe concreta');
  }
}

class MySQLDatabase extends Database {
  salvar(dados) {
    console.log(`Salvando no MySQL: ${dados}`);
  }
}

class MongoDBDatabase extends Database {
  salvar(dados) {
    console.log(`Salvando no MongoDB: ${dados}`);
  }
}

class GerenciadorUsuarios {
  constructor(database) {
    this.database = database; // Depende da abstração, não do detalhe
  }
  salvarUsuario(usuario) {
    this.database.salvar(usuario);
  }
}