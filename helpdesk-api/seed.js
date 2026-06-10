require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const tickets = [
  { id: 'TK-001', title: 'Computador não liga na recepção', description: 'O computador da recepção não está ligando desde esta manhã. Já verificamos a tomada e o cabo de força.', status: 'open', priority: 'high', category: 'hardware', requester: 'Ana Silva', assignee: 'Pedro Técnico', created_at: new Date('2026-06-02T08:30:00') },
  { id: 'TK-002', title: 'Sem acesso ao sistema ERP', description: 'Usuário não consegue logar no sistema ERP desde a atualização de ontem.', status: 'in-progress', priority: 'critical', category: 'software', requester: 'Carlos Mendes', assignee: 'Pedro Técnico', created_at: new Date('2026-06-02T07:15:00') },
  { id: 'TK-003', title: 'Impressora do RH não imprime', description: 'A impressora HP do setor de RH está com erro de conexão. Já reiniciamos o equipamento.', status: 'resolved', priority: 'medium', category: 'impressora', requester: 'Beatriz Costa', assignee: 'Pedro Técnico', created_at: new Date('2026-06-01T14:00:00') },
  { id: 'TK-004', title: 'Internet lenta no setor de vendas', description: 'Todos os computadores do setor de vendas estão com internet muito lenta, afetando o atendimento ao cliente.', status: 'in-progress', priority: 'high', category: 'rede', requester: 'Roberto Lima', assignee: 'Pedro Técnico', created_at: new Date('2026-06-02T13:05:00') },
  { id: 'TK-005', title: 'Excel travando ao abrir planilhas grandes', description: 'O Excel fecha sozinho ao tentar abrir planilhas com mais de 10MB. Ocorre em dois computadores do financeiro.', status: 'open', priority: 'medium', category: 'software', requester: 'Fernanda Rocha', assignee: null, created_at: new Date('2026-06-02T10:20:00') },
  { id: 'TK-006', title: 'Trocar teclado com teclas danificadas', description: 'Teclado do computador da diretoria com várias teclas sem funcionar.', status: 'resolved', priority: 'low', category: 'hardware', requester: 'Marcos Diretor', assignee: 'Pedro Técnico', created_at: new Date('2026-05-30T09:00:00') },
  { id: 'TK-007', title: 'Criar acesso VPN para home office', description: 'Preciso de acesso VPN para trabalhar de casa durante a semana.', status: 'closed', priority: 'medium', category: 'acesso', requester: 'Juliana Pereira', assignee: 'Pedro Técnico', created_at: new Date('2026-05-28T16:30:00') },
  { id: 'TK-008', title: 'VPN não conecta para trabalho remoto', description: 'A VPN parou de funcionar ontem à noite. Não consigo acessar os sistemas da empresa de casa.', status: 'open', priority: 'critical', category: 'rede', requester: 'Ti - Gestor', assignee: null, created_at: new Date('2026-06-02T06:00:00') },
];

async function seed() {
  try {
    const hash = await bcrypt.hash('123456', 10);
    await pool.query(
      `INSERT INTO helpdesk.users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING`,
      ['Pedro Técnico', 'pedro@helpdeskea.com', hash, 'technician']
    );

    for (const t of tickets) {
      await pool.query(
        `INSERT INTO helpdesk.tickets (id, title, description, status, priority, category, requester, assignee, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO NOTHING`,
        [t.id, t.title, t.description, t.status, t.priority, t.category, t.requester, t.assignee, t.created_at]
      );
    }
    console.log('Seed concluído — 1 usuário e 8 chamados inseridos.');
  } catch (err) {
    console.error('Erro no seed:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
