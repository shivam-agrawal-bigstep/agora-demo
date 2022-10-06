import { Component, EventEmitter,Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent {
  @Input() messages: Array<any> = [];
  @Output() newTextEvent = new EventEmitter<string>();
  text:string = '';
  constructor(private toastr: ToastrService) {}
  sendText(){
    this.text = this.text ? this.text : '';
    this.text =  this.text.trim();
    if(this.text){
      this.newTextEvent.emit(this.text);
      this.text = '';
    }else{
      this.toastr.error('Please input text');
    }
  }
}
