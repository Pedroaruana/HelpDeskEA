import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diff < 60) return 'agora mesmo';
    if (diff < 3600) {
      const m = Math.floor(diff / 60);
      return `há ${m} minuto${m > 1 ? 's' : ''}`;
    }
    if (diff < 86400) {
      const h = Math.floor(diff / 3600);
      return `há ${h} hora${h > 1 ? 's' : ''}`;
    }
    if (diff < 2592000) {
      const d = Math.floor(diff / 86400);
      return `há ${d} dia${d > 1 ? 's' : ''}`;
    }
    const mo = Math.floor(diff / 2592000);
    return `há ${mo} ${mo > 1 ? 'meses' : 'mês'}`;
  }
}

@Pipe({ name: 'priorityLabel', standalone: true })
export class PriorityLabelPipe implements PipeTransform {
  transform(value: string): string {
    const labels: Record<string, string> = {
      critical: 'Crítico',
      high: 'Alto',
      medium: 'Médio',
      low: 'Baixo'
    };
    return labels[value] ?? value;
  }
}

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  transform(value: string): string {
    const labels: Record<string, string> = {
      open: 'Aberto',
      'in-progress': 'Em Andamento',
      resolved: 'Resolvido',
      closed: 'Fechado'
    };
    return labels[value] ?? value;
  }
}

@Pipe({ name: 'categoryLabel', standalone: true })
export class CategoryLabelPipe implements PipeTransform {
  transform(value: string): string {
    const labels: Record<string, string> = {
      hardware: 'Hardware',
      software: 'Software',
      network: 'Rede',
      access: 'Acesso',
      other: 'Outros'
    };
    return labels[value] ?? value;
  }
}
