import { Component, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';

interface Message {
  from: 'user' | 'bot';
  text: string;
  time: Date;
}

const RESPONSES: { patterns: RegExp[]; reply: string }[] = [
  {
    patterns: [/\boi\b/i, /\bolá\b/i, /\bhello\b/i, /\bboa\b/i, /\btudo\b/i, /\bpode\b/i],
    reply: 'Olá! Sou o assistente virtual do HelpDesk EA. Posso te ajudar com dúvidas sobre chamados, prioridades, status e acesso ao sistema. O que você precisa?',
  },
  {
    patterns: [/abrir?\s+chamado/i, /criar?\s+chamado/i, /novo\s+chamado/i, /como\s+abr/i],
    reply: 'Para abrir um novo chamado, clique em "Novo Chamado" no menu lateral. Preencha o título, descrição, categoria e prioridade. Assim que enviar, o chamado aparece na lista e é atribuído automaticamente.',
  },
  {
    patterns: [/status/i, /alterar?\s+status/i, /mudar?\s+status/i, /trocar?\s+status/i],
    reply: 'Para alterar o status de um chamado, abra o chamado desejado na lista e clique no botão de status. As opções são: Aberto → Em Andamento → Resolvido → Fechado.',
  },
  {
    patterns: [/prioridade/i, /urgente/i, /cr[íi]tico/i, /alta/i, /baixa/i, /m[ée]dia/i],
    reply: 'As prioridades disponíveis são:\n• Crítica — impacto total no sistema, resposta imediata\n• Alta — afeta bastante, resolver em até 4h\n• Média — reduz produtividade, resolver em até 8h\n• Baixa — impacto mínimo, resolver no prazo normal',
  },
  {
    patterns: [/prazo/i, /sla/i, /tempo\s+de/i, /quanto\s+tempo/i],
    reply: 'Os prazos de atendimento são:\n• Crítico: até 1 hora\n• Alto: até 4 horas\n• Médio: até 8 horas (mesmo dia)\n• Baixo: até 3 dias úteis',
  },
  {
    patterns: [/senha/i, /acesso/i, /login/i, /entrar/i, /esqueci/i],
    reply: 'Para problemas de acesso ou senha, abra um chamado com a categoria "Acesso / Permissão" e prioridade adequada. O time de T.I irá resetar as credenciais e retornar por e-mail.',
  },
  {
    patterns: [/categoria/i, /tipo\s+de/i, /qual\s+categoria/i],
    reply: 'As categorias disponíveis são: Hardware, Software, Rede, Acesso/Permissão, Impressora e Outros. Escolha a que melhor descreve o problema ao abrir o chamado.',
  },
  {
    patterns: [/acompanhar/i, /ver\s+meu/i, /meus\s+chamados/i, /consultar/i],
    reply: 'Você pode acompanhar todos os chamados na seção "Chamados" do menu. Use os filtros de status, prioridade e categoria para encontrar facilmente o que procura.',
  },
  {
    patterns: [/obrigad/i, /valeu/i, /thanks/i, /resolveu/i],
    reply: 'Fico feliz em ajudar! Se precisar de mais alguma coisa, é só perguntar. 😊',
  },
];

const FALLBACK = 'Não entendi muito bem. Tente perguntar sobre: abrir chamado, alterar status, prioridades, prazos de atendimento, categorias ou problemas de acesso.';

function getReply(input: string): string {
  const trimmed = input.trim();
  for (const item of RESPONSES) {
    if (item.patterns.some(p => p.test(trimmed))) {
      return item.reply;
    }
  }
  return FALLBACK;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatRippleModule, DatePipe],
  template: `
    <!-- Floating button -->
    @if (!open()) {
      <button class="fab" (click)="openChat()" matRipple title="Assistente virtual">
        <mat-icon>support_agent</mat-icon>
      </button>
    }

    <!-- Chat panel -->
    @if (open()) {
      <div class="chat-panel" [class.open]="open()">
        <div class="chat-header">
          <div class="bot-info">
            <div class="bot-avatar">
              <mat-icon>support_agent</mat-icon>
            </div>
            <div>
              <span class="bot-name">Assistente HelpDesk</span>
              <span class="bot-status">
                <span class="dot"></span>Online agora
              </span>
            </div>
          </div>
          <button class="close-btn" (click)="open.set(false)" title="Fechar">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="messages" #messagesEl>
          @for (msg of messages(); track $index) {
            <div class="msg-wrap" [class.from-user]="msg.from === 'user'">
              @if (msg.from === 'bot') {
                <div class="msg-avatar"><mat-icon>support_agent</mat-icon></div>
              }
              <div class="bubble">
                <p>{{ msg.text }}</p>
                <span class="msg-time">{{ msg.time | date:'HH:mm' }}</span>
              </div>
            </div>
          }

          @if (typing()) {
            <div class="msg-wrap">
              <div class="msg-avatar"><mat-icon>support_agent</mat-icon></div>
              <div class="bubble typing-bubble">
                <span></span><span></span><span></span>
              </div>
            </div>
          }
        </div>

        <div class="chat-input-row">
          <input
            #inputEl
            class="chat-input"
            type="text"
            placeholder="Digite sua dúvida..."
            [(ngModel)]="inputText"
            (keydown.enter)="send()"
            [disabled]="typing()"
          />
          <button class="send-btn" (click)="send()" [disabled]="!inputText.trim() || typing()" matRipple>
            <mat-icon>send</mat-icon>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    /* FAB */
    .fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(99,102,241,0.45);
      z-index: 900;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      mat-icon { color: white; font-size: 26px; width: 26px; height: 26px; }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(99,102,241,0.55);
      }

      &:active { transform: translateY(0); }
    }

    /* Panel */
    .chat-panel {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 360px;
      height: 520px;
      background: var(--bg-card);
      border-radius: 20px;
      border: 1px solid var(--border);
      box-shadow: 0 24px 64px rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      z-index: 900;
      overflow: hidden;
      animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes popIn {
      from { opacity: 0; transform: scale(0.85) translateY(20px); transform-origin: bottom right; }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Header */
    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      flex-shrink: 0;
    }

    .bot-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .bot-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon { color: white; font-size: 20px; width: 20px; height: 20px; }
    }

    .bot-name {
      display: block;
      font-size: 14px;
      font-weight: 700;
      color: white;
      line-height: 1;
    }

    .bot-status {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: rgba(255,255,255,0.8);
      margin-top: 2px;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ade80;
      display: inline-block;
    }

    .close-btn {
      background: rgba(255,255,255,0.15);
      border: none;
      border-radius: 8px;
      width: 30px;
      height: 30px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: background 0.15s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { background: rgba(255,255,255,0.25); }
    }

    /* Messages */
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;

      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-track { background: transparent; }
      &::-webkit-scrollbar-thumb { background: var(--border-md); border-radius: 4px; }
    }

    .msg-wrap {
      display: flex;
      align-items: flex-end;
      gap: 8px;

      &.from-user {
        flex-direction: row-reverse;
        .bubble {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-radius: 16px 4px 16px 16px;
          p { color: white; }
          .msg-time { color: rgba(255,255,255,0.65); }
        }
      }
    }

    .msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(99,102,241,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: #818cf8; }
    }

    .bubble {
      max-width: 240px;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: 4px 16px 16px 16px;
      padding: 10px 12px;

      p {
        margin: 0;
        font-size: 13px;
        line-height: 1.5;
        color: var(--text-secondary);
        white-space: pre-line;
      }
    }

    .msg-time {
      display: block;
      font-size: 10px;
      color: var(--text-dim);
      text-align: right;
      margin-top: 4px;
    }

    /* Typing indicator */
    .typing-bubble {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 4px;

      span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #818cf8;
        display: inline-block;
        animation: bounce 1.2s infinite;

        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }

    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    /* Input */
    .chat-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      border-top: 1px solid var(--border);
      background: var(--bg-card);
      flex-shrink: 0;
    }

    .chat-input {
      flex: 1;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      color: var(--text-primary);
      outline: none;
      transition: border-color 0.15s;
      font-family: inherit;

      &::placeholder { color: var(--text-placeholder); }
      &:focus { border-color: #6366f1; }
      &:disabled { opacity: 0.6; }
    }

    .send-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.15s, transform 0.15s;

      mat-icon { color: white; font-size: 18px; width: 18px; height: 18px; }

      &:hover:not(:disabled) { transform: scale(1.05); }
      &:disabled { opacity: 0.4; cursor: default; }
    }
  `]
})
export class ChatWidgetComponent implements AfterViewChecked {
  @ViewChild('messagesEl') private messagesEl!: ElementRef<HTMLDivElement>;

  open = signal(false);
  typing = signal(false);
  inputText = '';
  messages = signal<Message[]>([]);

  private greeted = false;

  openChat(): void {
    this.open.set(true);
    if (!this.greeted) {
      this.greeted = true;
      setTimeout(() => {
        this.messages.update(m => [...m, {
          from: 'bot',
          text: 'Olá! 👋 Sou o assistente virtual do HelpDesk EA. Como posso te ajudar hoje?',
          time: new Date(),
        }]);
      }, 300);
    }
  }

  send(): void {
    const text = this.inputText.trim();
    if (!text || this.typing()) return;

    this.messages.update(m => [...m, { from: 'user', text, time: new Date() }]);
    this.inputText = '';
    this.typing.set(true);

    const delay = 700 + Math.random() * 600;
    setTimeout(() => {
      this.typing.set(false);
      this.messages.update(m => [...m, { from: 'bot', text: getReply(text), time: new Date() }]);
    }, delay);
  }

  ngAfterViewChecked(): void {
    if (this.messagesEl) {
      const el = this.messagesEl.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
