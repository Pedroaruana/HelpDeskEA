import { Injectable, signal, computed } from '@angular/core';
import { Ticket, TicketStatus, DashboardStats } from '../models/ticket.model';

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TK-001',
    title: 'Computador não liga na recepção',
    description: 'O computador da recepção não está ligando desde hoje de manhã. Já verifiquei a tomada e o cabo de força.',
    status: 'open',
    priority: 'high',
    category: 'hardware',
    requester: 'Ana Silva',
    assignee: 'Pedro Técnico',
    createdAt: new Date('2026-06-02T08:30:00'),
    updatedAt: new Date('2026-06-02T08:30:00'),
    comments: [
      { id: 'c1', author: 'Pedro Técnico', text: 'Chamado recebido, irei verificar em breve.', createdAt: new Date('2026-06-02T08:45:00') }
    ]
  },
  {
    id: 'TK-002',
    title: 'Sem acesso ao sistema ERP',
    description: 'Usuário relata que ao tentar entrar no ERP aparece mensagem de "usuário sem permissão". Aconteceu após a atualização de senha.',
    status: 'in-progress',
    priority: 'critical',
    category: 'access',
    requester: 'Carlos Mendes',
    assignee: 'Pedro Técnico',
    createdAt: new Date('2026-06-02T07:15:00'),
    updatedAt: new Date('2026-06-02T09:00:00'),
    comments: [
      { id: 'c2', author: 'Pedro Técnico', text: 'Verificando permissões no Active Directory.', createdAt: new Date('2026-06-02T09:00:00') }
    ]
  },
  {
    id: 'TK-003',
    title: 'Impressora do setor fiscal offline',
    description: 'A impressora HP LaserJet do setor fiscal está aparecendo como offline para todos os usuários.',
    status: 'resolved',
    priority: 'medium',
    category: 'hardware',
    requester: 'Juliana Costa',
    assignee: 'Pedro Técnico',
    createdAt: new Date('2026-06-01T14:00:00'),
    updatedAt: new Date('2026-06-01T16:30:00'),
    resolvedAt: new Date('2026-06-01T16:30:00'),
    comments: [
      { id: 'c3', author: 'Pedro Técnico', text: 'Problema resolvido: fila de impressão travada, limpeza realizada e serviço reiniciado.', createdAt: new Date('2026-06-01T16:30:00') }
    ]
  },
  {
    id: 'TK-004',
    title: 'Internet lenta no setor de vendas',
    description: 'Todos os computadores do setor de vendas estão com internet muito lenta desde as 13h. Prejudicando o atendimento ao cliente.',
    status: 'in-progress',
    priority: 'high',
    category: 'network',
    requester: 'Roberto Lima',
    assignee: 'Pedro Técnico',
    createdAt: new Date('2026-06-02T13:05:00'),
    updatedAt: new Date('2026-06-02T13:30:00'),
    comments: []
  },
  {
    id: 'TK-005',
    title: 'Excel travando ao abrir planilhas grandes',
    description: 'O Microsoft Excel fecha sozinho sempre que tento abrir planilhas com mais de 10MB. Isso está acontecendo em duas máquinas do RH.',
    status: 'open',
    priority: 'medium',
    category: 'software',
    requester: 'Fernanda Rocha',
    createdAt: new Date('2026-06-02T10:20:00'),
    updatedAt: new Date('2026-06-02T10:20:00'),
    comments: []
  },
  {
    id: 'TK-006',
    title: 'Solicitação de novo usuário no sistema',
    description: 'Novo colaborador contratado precisa de acesso ao sistema de gestão, e-mail corporativo e pasta compartilhada do setor.',
    status: 'open',
    priority: 'low',
    category: 'access',
    requester: 'RH - Mariana',
    createdAt: new Date('2026-06-01T09:00:00'),
    updatedAt: new Date('2026-06-01T09:00:00'),
    comments: []
  },
  {
    id: 'TK-007',
    title: 'Câmera de segurança sem sinal',
    description: 'A câmera da entrada principal está sem sinal no sistema de monitoramento há 2 dias.',
    status: 'closed',
    priority: 'high',
    category: 'hardware',
    requester: 'Segurança - João',
    assignee: 'Pedro Técnico',
    createdAt: new Date('2026-05-31T08:00:00'),
    updatedAt: new Date('2026-05-31T17:00:00'),
    resolvedAt: new Date('2026-05-31T17:00:00'),
    comments: [
      { id: 'c4', author: 'Pedro Técnico', text: 'Cabo de rede da câmera estava danificado. Substituído e testado.', createdAt: new Date('2026-05-31T17:00:00') }
    ]
  },
  {
    id: 'TK-008',
    title: 'VPN não conecta para trabalho remoto',
    description: 'Desde a atualização do Windows, o cliente VPN não consegue estabelecer conexão. Afetando 3 colaboradores em home office.',
    status: 'open',
    priority: 'critical',
    category: 'network',
    requester: 'TI - Gestor',
    createdAt: new Date('2026-06-02T06:00:00'),
    updatedAt: new Date('2026-06-02T06:00:00'),
    comments: []
  }
];

@Injectable({ providedIn: 'root' })
export class TicketService {
  private _tickets = signal<Ticket[]>(MOCK_TICKETS);

  tickets = this._tickets.asReadonly();

  stats = computed<DashboardStats>(() => {
    const tickets = this._tickets();
    const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');
    const avgHours = resolved.length
      ? resolved.reduce((acc, t) => {
          if (t.resolvedAt) {
            return acc + (t.resolvedAt.getTime() - t.createdAt.getTime()) / 3600000;
          }
          return acc;
        }, 0) / resolved.length
      : 0;

    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
      critical: tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed').length,
      avgResolutionHours: Math.round(avgHours * 10) / 10
    };
  });

  getById(id: string): Ticket | undefined {
    return this._tickets().find(t => t.id === id);
  }

  createTicket(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Ticket {
    const tickets = this._tickets();
    const num = tickets.length + 1;
    const ticket: Ticket = {
      ...data,
      id: `TK-${String(num).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };
    this._tickets.set([ticket, ...tickets]);
    return ticket;
  }

  updateStatus(id: string, status: TicketStatus): void {
    this._tickets.update(tickets =>
      tickets.map(t => t.id === id
        ? { ...t, status, updatedAt: new Date(), resolvedAt: (status === 'resolved' || status === 'closed') ? new Date() : t.resolvedAt }
        : t
      )
    );
  }

  addComment(id: string, text: string, author: string): void {
    this._tickets.update(tickets =>
      tickets.map(t => t.id === id
        ? {
            ...t,
            updatedAt: new Date(),
            comments: [...t.comments, { id: `c${Date.now()}`, author, text, createdAt: new Date() }]
          }
        : t
      )
    );
  }

  deleteTicket(id: string): void {
    this._tickets.update(tickets => tickets.filter(t => t.id !== id));
  }
}
