# HelpDesk EA

🔗 **[Acessar o projeto](https://pedroaruana.github.io/HelpDeskEA/)**

![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=flat&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular%20Material-17+-757575?style=flat&logo=material-design&logoColor=white)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## Sobre o projeto

Trabalho com suporte de T.I e sempre tive uma reclamação com os sistemas que a gente usa no dia a dia: são lentos, feios ou cheios de coisa que ninguém usa. Quis construir algo do zero que fizesse sentido pra mim — simples, rápido e com uma interface que não desse vergonha de mostrar.

O HelpDesk EA é um sistema para abertura e acompanhamento de chamados de suporte. Ele tem dashboard com métricas, lista de chamados com filtros, detalhe com linha do tempo e comentários, formulário de abertura e busca global. Tudo com tema escuro e claro, deploy automático via GitHub Actions, e código organizado com Angular 17.

Esse projeto também foi minha entrada no Angular de verdade. Aprendi bastante na prática.

---

## Funcionalidades

- **Dashboard** — métricas de chamados em tempo real: abertos, em andamento, resolvidos e críticos
- **Lista de chamados** — tabela com busca por texto e filtros por status, prioridade e categoria
- **Detalhe do chamado** — visualização completa com linha do tempo, comentários e alteração de status
- **Novo chamado** — formulário de abertura com seleção de categoria e prioridade
- **Busca global** — campo no topo que encontra qualquer chamado pelo título, ID ou solicitante
- **Excluir chamado** — com confirmação para evitar acidentes
- **Notificação de críticos** — banner de alerta quando há chamados críticos em aberto
- **Tema claro/escuro** — toggle salvo automaticamente no navegador

---

## Tecnologias

| Tecnologia | Por que usei |
|---|---|
| Angular 17+ | Framework principal — queria aprender de verdade, não só tutoriais |
| Angular Material | Componentes prontos com visual consistente |
| TypeScript | Tipagem forte, menos bug em produção |
| Angular Signals | Estado reativo sem RxJS desnecessário |
| GitHub Actions | CI/CD automático: lint → build → deploy |
| GitHub Pages | Hospedagem gratuita, deploy sem complicação |

---

## Dificuldades

Algumas coisas que não foram fáceis:

**O deploy automático me deu trabalho.** Nunca tinha configurado isso antes e quebrou umas três vezes seguidas por motivos diferentes. Fui ajustando aos poucos até entender o que cada erro queria dizer. Quando funcionou pela primeira vez e vi o site no ar sozinho foi satisfatório.

**As rotas quebravam fora da página inicial.** Se eu acessava qualquer outra tela direto pela URL, dava página não encontrada. Demorei pra entender que não era bug do meu código, era o jeito que o serviço de hospedagem funciona. Resolvi com um arquivo extra que redireciona tudo corretamente.

**Entender o sistema de estado do Angular.** Li sobre isso antes de começar mas na prática foi diferente. Os filtros da lista de chamados não atualizavam do jeito certo, precisei refazer essa parte duas vezes até funcionar como eu queria.

**O tema claro/escuro deu mais trabalho do que parecia.** Achei que ia ser rápido mas todos os componentes tinham as cores escritas direto no código. Tive que ir arquivo por arquivo trocando por variáveis. Chato de fazer, mas o resultado valeu.

---

## Arquitetura

```
src/
├── app/
│   ├── models/           # Tipos e interfaces (Ticket, Comment...)
│   ├── services/         # Lógica de negócio com Signals
│   └── components/
│       ├── sidebar/      # Menu lateral
│       ├── topbar/       # Barra superior com busca e toggle de tema
│       ├── dashboard/    # Tela principal com estatísticas
│       ├── ticket-list/  # Lista com filtros
│       ├── ticket-detail/# Detalhe e gerenciamento do chamado
│       ├── new-ticket/   # Formulário de abertura
│       └── confirm-dialog/ # Modal de confirmação reutilizável
```

---

## CI/CD

A cada `push` na branch `main`:

1. Executa o lint do código
2. Faz o build de produção
3. Publica automaticamente no GitHub Pages

---

## Como rodar localmente

Precisar ter Node.js 18+ e Angular CLI instalados.

```bash
git clone https://github.com/Pedroaruana/HelpDeskEA.git
cd HelpDeskEA
npm install
npm start
```

Abre no navegador: **http://localhost:4200**

---

## Autor

Feito por **Pedro Aruana** — técnico de suporte T.I

[![GitHub](https://img.shields.io/badge/GitHub-Pedroaruana-181717?style=flat&logo=github&logoColor=white)](https://github.com/Pedroaruana)

---

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
