# Explicando Princípio da Inversão de Dependência e Princípio do Aberto/Fechado

Este guia ensina, de forma clara e prática, dois princípios essenciais do SOLID: **Dependency Inversion Principle (DIP)** e **Open/Closed Principle (OCP)**. Vamos entender de onde surgem, como aplicá-los e por que facilitam a vida do programador em manutenção, testes e evolução.

***

## 1. Dependency Inversion Principle (DIP) — Princípio da Inversão de Dependência

**O que diz o DIP?**
- **Módulos de alto nível** (que resolvem problemas do seu software) **não devem depender diretamente de módulos de baixo nível** (que lidam com detalhes técnicos, como bancos de dados, APIs ou bibliotecas).
- **Ambos devem depender de abstrações**, como interfaces ou classes base.

**Por quê?**
Imagine que você programe uma lógica de negócio (como "cadastro de usuários") que usa diretamente um banco de dados específico (por exemplo, MySQL). Se precisar trocar o banco de dados para MongoDB, pode causar mudanças em várias partes do código — é um exemplo clássico de **acoplamento forte**.

Com o DIP, você cria uma **interface** (ou abstração) para acesso ao banco, e sua lógica depende dessa interface — nunca diretamente da implementação específica. Assim, mudar o banco, fazer testes automatizados ou incluir alternativas se torna fácil e seguro.

**Exemplo prático em JavaScript:**  
Veja antes (**ruim**) e depois (**bom**) aplicando o princípio.

```javascript
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
```

```javascript
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
```
> **Comentários:** No exemplo bom, `GerenciadorUsuarios` funciona com qualquer banco. Basta receber a classe correta; não precisa modificar o gerenciador toda vez!

### Erros comuns ao aplicar DIP
- Instanciar o detalhe concreto diretamente na classe (usar `new` dentro de classes de alto nível).
- Não criar uma interface ou abstração clara para as dependências.
- Não pensar nos testes: classes fortemente acopladas são difíceis de “mockar” (fingir dependências para testar).

***

## 2. Open/Closed Principle (OCP) — Princípio do Aberto/Fechado

**O que diz o OCP?**
- O software deve ser **aberto para extensão** (pode adicionar novas funções) e **fechado para modificação** (não precisa mexer no código antigo para incluir novidades).
- Ou seja, ao invés de editar o código existente para adicionar comportamentos novos, você **cria novas classes ou módulos** que extendem os já existentes.

**Por quê?**
Se você tem um código cheio de condicionais (`if` ou `switch`) para cada novo tipo de cliente ou desconto, cada “feature” nova exige alterar o código antigo. Isso gera bugs e obriga re-testes constantes.

Com o OCP, você usa herança, interfaces ou composição para **adicionar** melhorias sem alterar o que já existe e funciona. O código antigo permanece testado e confiável, e o novo comportamento é isolado em novos arquivos ou funções.

**Exemplo prático em JavaScript:**  
Veja antes (**ruim**) e depois (**bom**) aplicando o princípio.

```javascript
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
```

```javascript
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
```
> **Comentários:** Na versão boa, para adicionar `ClienteGold`, só criamos uma nova classe, sem tocar nas que já existem.

### Erros comuns ao aplicar OCP
- Usar muitos condicionais para tratar variações de comportamento.
- Editar código antigo para comportar novos requisitos ao invés de criar classes/funções novas.
- Não utilizar polimorfismo ou herança de forma adequada.

***

## Resumo prático

- **DIP**: Programe usando abstrações (interfaces), nunca dependa diretamente do detalhe (implementação concreta).
- **OCP**: Ao adicionar comportamentos novos, estenda através de novas classes; não remende o código velho.
