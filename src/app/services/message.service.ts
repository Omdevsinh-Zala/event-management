import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private successMessages: WritableSignal<string[]> = signal([]);
  private errorMessages: WritableSignal<string[]> = signal([]);
  private time: WritableSignal<number> = signal(4000);

  //To show success meesage
  success(data: string) {
    this.successMessages.update((messages) => [...messages, data])
    const index = this.successMessages.length
    setTimeout(() => {
      this.clearValue(this.successMessages, index)
    }, this.time())
  }

  //To show error message
  error(data: string) {
    this.errorMessages.update((errors) => [...errors,  data])
    const index = this.errorMessages.length
    setTimeout(() => {
      this.clearValue(this.errorMessages, index)
    }, this.time())
  }

  //To clear messages
  clearValue(data: WritableSignal<string[]>, index: number) {
    data.update((messsages) => messsages.filter((message, i) => i != index ));
  }

  //To access success messages array
  successMes() {
    return this.successMessages()
  }
  
  //To access error messages array
  errorMes() {
    return this.errorMessages()
  }
}
