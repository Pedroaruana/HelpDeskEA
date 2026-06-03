# HelpDesk EA

Sistema de gerenciamento de chamados de suporte técnico desenvolvido com Angular 17+, focado em produtividade e experiência do usuário.

![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=flat&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular%20Material-17+-757575?style=flat&logo=material-design&logoColor=white)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## Sobre o projeto

O **HelpDesk EA** é uma aplicação web para abertura, acompanhamento e resolução de chamados de suporte de T.I. O sistema permite que equipes de suporte gerenciem demandas de forma organizada, com visibilidade em tempo real do status e prioridade de cada chamado.

Desenvolvido como projeto de portfólio para demonstrar habilidades em desenvolvimento front-end moderno e boas práticas de entrega de software.

---

## Funcionalidades

- **Dashboard** — visão geral com métricas de chamados abertos, em andamento, resolvidos e críticos
- **Lista de chamados** — tabela completa com busca por texto e filtros por status, prioridade e categoria
- **Detalhe do chamado** — visualização completa com linha do tempo, comentários e alteração de status
- **Novo chamado** — formulário para abertura de chamados com seleção de categoria e prioridade
- **Navegação lateral** — sidebar com contador de chamados abertos em tempo real

---

## Tecnologias

| Tecnologia | Descrição |
|---|---|
| Angular 17+ | Framework principal com Standalone Components e Signals |
| Angular Material | Biblioteca de componentes de UI |
| TypeScript | Tipagem estática |
| SCSS | Estilização com tema dark personalizado |
| GitHub Actions | Pipeline de CI/CD automatizado |
| GitHub Pages | Hospedagem da aplicação em produção |

---

## Arquitetura

```
src/
├── app/
│   ├── models/           # Interfaces e tipos (Ticket, Comment, etc.)
│   ├── services/         # Lógica de negócio com Signals
│   └── components/
│       ├── sidebar/      # Menu lateral de navegação
│       ├── dashboard/    # Tela principal com estatísticas
│       ├── ticket-list/  # Lista de chamados com filtros
│       ├── ticket-detail/# Detalhe e gerenciamento do chamado
│       └── new-ticket/   # Formulário de abertura
```

---

## CI/CD

O projeto utiliza **GitHub Actions** para automatizar o processo de build e deploy:

1. A cada `push` na branch `main`, o pipeline é acionado automaticamente
2. Executa o lint do código
3. Realiza o build de produção
4. Faz o deploy automático no GitHub Pages

---

## Como rodar localmente

**Pré-requisitos:** Node.js 18+ e Angular CLI instalados.

```bash
# Clonar o repositório
git clone https://github.com/Pedroaruana/HelpDeskEA.git
cd HelpDeskEA

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

Acesse **http://localhost:4200** no navegador.

---

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
