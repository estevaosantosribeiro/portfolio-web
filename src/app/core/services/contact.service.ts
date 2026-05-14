import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

export interface ContactPayload {
  name:    string;
  email:   string;
  subject: string;
  message: string;
}

export type SendResult = { success: true } | { success: false; error: string };

@Injectable({ providedIn: 'root' })
export class ContactService {
  send(payload: ContactPayload): Observable<SendResult> {
    // Mock: simulate network latency before real API integration
    return timer(1800).pipe(mapTo({ success: true } as SendResult));
  }
}
