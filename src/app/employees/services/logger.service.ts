import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  public logMessage(arg: unknown) {
    console.log(arg);
  }
}
