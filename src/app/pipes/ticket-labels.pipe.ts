import { Pipe, PipeTransform } from '@angular/core';

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
