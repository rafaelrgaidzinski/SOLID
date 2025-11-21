# SOLID

Este guia ensina, de forma clara e prática, dois princípios essenciais do SOLID: Princípio da Inversão de Dependência e Princípio do Aberto/Fechado. Vamos entender como aplicá-los e por que facilitam a vida do programador em manutenção e testes.

***

## 1. Dependency Inversion Principle (DIP) — Princípio da Inversão de Dependência

**O que diz o DIP?**
- **Módulos de alto nível** (que resolvem problemas do seu software) não devem depender diretamente de módulos de baixo nível (que lidam com detalhes técnicos, como bancos de dados, APIs ou bibliotecas).
- **Ambos devem depender de abstrações**, como interfaces ou classes base.

**Por quê?**
Imagine que você programe uma lógica de negócio (como "cadastro de usuários") que usa diretamente um banco de dados específico (por exemplo, MySQL). Se precisar trocar o banco de dados para MongoDB, pode causar mudanças em várias partes do código, pois é um exemplo clássico de acoplamento forte.

Com o DIP, você cria uma interface (ou abstração) para acesso ao banco, e sua lógica depende dessa interface e nunca diretamente da implementação específica. Assim, mudar o banco, fazer testes automatizados ou incluir alternativas se torna fácil e seguro.

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
> **Comentários:** No exemplo bom, `GerenciadorUsuarios` funciona com qualquer banco. Basta receber a classe correta, não precisa modificar o gerenciador toda vez!

### Erros comuns ao aplicar DIP
- Instanciar o detalhe concreto diretamente na classe (usar `new` dentro de classes de alto nível).
- Não criar uma interface ou abstração clara para as dependências.
- Não pensar nos testes: classes fortemente acopladas são difíceis de “mockar” (fingir dependências para testar).

***

## 2. Open/Closed Principle (OCP) — Princípio do Aberto/Fechado

**O que diz o OCP?**
- O software deve ser aberto para extensão (pode adicionar novas funções) e fechado para modificação (não precisa mexer no código antigo para incluir novidades).
- Ou seja, ao invés de editar o código existente para adicionar comportamentos novos, você cria novas classes ou módulos que extendem os já existentes.

**Por quê?**
Se você tem um código cheio de condicionais (`if` ou `switch`) para cada novo tipo de cliente ou desconto, cada “feature” nova exige alterar o código antigo. Isso gera bugs e obriga re-testes constantes.

Com o OCP, você usa herança, interfaces ou composição para adicionar melhorias sem alterar o que já existe e funciona. O código antigo permanece testado e confiável, e o novo comportamento é isolado em novos arquivos ou funções.

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
    // Para novo tipo, tem que editar aqui 
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

// Adicionar tipo novo não afeta código antigo
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
- **OCP**: Ao adicionar comportamentos novos, estenda através de novas classes, não remende o código antigo.


Aqui está a explicação revisada, organizada e pronto para um **README**, com termos técnicos claros, exemplos reais e citações relevantes.

***

# GRASP

Este guia ensina, de forma clara e prática, o princípio Indirection do GRASP. Vamos entender como aplicá-lo e como facilitam a vida do programador em manutenção e testes.

## 1. Indirection (Indireção)

### O que é Indirection?

O padrão **Indirection** propõe a introdução de um objeto intermediário que atua como mediador entre dois ou mais componentes do sistema que, sem esse intermediário, se comunicariam diretamente. O objetivo principal é **reduzir o acoplamento** — ou seja, diminuir o quanto uma parte do sistema depende diretamente de outra.  
Esse desacoplamento facilita a manutenção, o reuso de código e torna o sistema mais robusto diante de mudanças, já que alterações em um componente tendem a afetar apenas o intermediário e não todo o sistema.

> **Exemplo conceitual:**  
> Imagine duas classes: `Cliente` (A) e `Serviço` (B). Se a classe `Cliente` chama diretamente métodos da classe `Serviço`, as duas ficam fortemente acopladas. Com Indirection, criamos uma classe intermediária (C) para ser responsável por essa comunicação; agora `Cliente` fala com C, e C fala com `Serviço`.

***

### Exemplo Prático: Sistema de Pagamento

Suponha um aplicativo de loja online que processa pagamentos via diferentes gateways.

### Sem Indirection

```javascript
class Cart {
  pay(amount) {
    // comunicação direta com Gateway de pagamento!
    paymentGateway.process(amount);
  }
}
```
*Problema:* Se precisar trocar o tipo do `paymentGateway`, será necessário modificar todos os lugares que usam `Cart`.

### Com Indirection

```javascript
class PaymentService {
  constructor(gateway) {
    this.gateway = gateway;
  }
  pay(amount) {
    this.gateway.process(amount);
  }
}

class Cart {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }
  pay(amount) {
    this.paymentService.pay(amount); // só fala com PaymentService
  }
}
```
Agora, a classe `Cart` não precisa conhecer os detalhes de como o pagamento é realizado ou qual gateway está em uso. Se você quiser adicionar ou trocar gateways (Paypal, Stripe, etc.), basta alterar o `PaymentService`.

***

### Quando aplicar Indirection?

- Quando dois componentes precisam se comunicar, mas existe possibilidade de mudança futura em algum deles
- Para facilitar testes, manutenção ou reuso
- Quando é necessário incluir regras (validação, log, controle de acesso) entre uma chamada e o componente final

**Exemplos clássicos:**  
- **MVC:** O controller faz mediação entre view e model, evitando acoplamento direto.
- **Repositórios:** Um repository intermedia o acesso entre domínio e a persistência.
- **Adaptadores:** Um adapter traduz chamadas entre sistemas distintos, desacoplando-os.

***

### Diferença: Indirection (GRASP) vs. Inversão de Dependência (SOLID)

### Indirection (GRASP)
- Foca em introduzir um intermediário para reduzir acoplamento direto entre componentes
- Concentra a roteirização e delegação das responsabilidades

### Inversão de Dependência (DI - SOLID)
- Recomenda que componentes dependam de *abstrações* (interfaces), nunca de implementações concretas
- Normalmente, combina indireção com abstração: o intermediário implementa uma interface e interage apenas com outras interfaces

**Exemplo evoluído para Inversão de Dependência:**

```javascript
// Interface
class PaymentGateway {
  process(amount) {}
}

class PaypalGateway extends PaymentGateway {
  process(amount) { /*...*/ }
}

class PaymentService {
  constructor(gateway) { // espera uma abstração!
    this.gateway = gateway;
  }
  pay(amount) {
    this.gateway.process(amount);
  }
}
```
Neste modelo, o `PaymentService` depende da abstração `PaymentGateway`, e não de implementações específicas. Isso facilita testes, substituições e evolução do sistema.

***

### Resumindo

- **Indirection:** Cria um objeto intermediário para mediar comunicação, diminuir acoplamento e facilitar manutenção.
- **Inversão de Dependência:** Garante que componentes dependam de abstrações, não de construções concretas, aumentando flexibilidade e permitindo trocas com impacto mínimo.

***
