import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video.component';
import { VideoRoutingModule } from './video.routing-module';
import { ChatComponent } from '../chat/chat.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    VideoComponent,
    ChatComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    VideoRoutingModule
  ]
})
export class VideoModule { }
