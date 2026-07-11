import { sendEmail, type SendEmailOptions } from './sendEmail';
import type { EmailEventName } from './email.events';

export interface QueuedEmail<T extends EmailEventName> extends SendEmailOptions<T> {
  id: string;
  createdAt: string;
}

class EmailQueue {
  private readonly queue: Array<QueuedEmail<EmailEventName>> = [];

  enqueue<T extends EmailEventName>(item: Omit<QueuedEmail<T>, 'id' | 'createdAt'>): QueuedEmail<T> {
    const entry: QueuedEmail<T> = {
      ...item,
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
    };

    this.queue.push(entry as QueuedEmail<EmailEventName>);
    return entry;
  }

  size(): number {
    return this.queue.length;
  }

  async flush(): Promise<Array<Awaited<ReturnType<typeof sendEmail>>>> {
    const pending = [...this.queue];
    this.queue.length = 0;

    return Promise.all(pending.map((item) => sendEmail(item)));
  }
}

export const emailQueue = new EmailQueue();

export function queueEmail<T extends EmailEventName>(item: Omit<QueuedEmail<T>, 'id' | 'createdAt'>): QueuedEmail<T> {
  return emailQueue.enqueue(item);
}
