import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private warnMessages: WritableSignal<string[]> = signal([]);
  private successMessages: WritableSignal<string[]> = signal([]);
  private errorMessages: WritableSignal<string[]> = signal([]);
  private time: WritableSignal<number> = signal(4000);

  //To show warning message
  warn(data: string) {
    this.warnMessages.update((message) => [...message, data]);
    const index = this.warnMessages.length;
    setTimeout(() => {
      this.clearValue(this.warnMessages, index);
    }, this.time());
  }

  //To show success meesage
  success(data: string) {
    this.successMessages.update((messages) => [...messages, data]);
    const index = this.successMessages.length;
    setTimeout(() => {
      this.clearValue(this.successMessages, index);
    }, this.time());
  }

  //To show error message
  error(data: string) {
    this.errorMessages.update((errors) => [...errors,  data]);
    const index = this.errorMessages.length;
    setTimeout(() => {
      this.clearValue(this.errorMessages, index);
    }, this.time());
  }

  //To clear messages
  private clearValue(data: WritableSignal<string[]>, index: number) {
    data.update((messsages) => messsages.filter((message, i) => i != index ));
  }

  //To access warning messagearray
  warnMes() {
    return this.warnMessages();
  }

  //To access success messages array
  successMes() {
    return this.successMessages();
  }
  
  //To access error messages array
  errorMes() {
    return this.errorMessages();
  }
}
