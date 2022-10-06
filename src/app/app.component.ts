import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'shivam-demo';
  rtc: any = {
    localAudioTrack: null,
    localVideoTrack: null,
    client: null,
  };
  options = {
    // Pass your App ID here.
    appId: 'fdabba0f28054496a83cfd7c85d4201a',
    // Set the channel name.
    channel: 'test',
    // Pass your temp token here.
    // token: null,
    // Set the user ID.
    uid: 6677,
  };
  myConatiner: any;
  myTitleConatiner: any;
  otherContainer: any;
  messages: Array<any> = [{id:11, text:'ehlllle', date : new Date()}];
  constructor(private route: ActivatedRoute, private toastr: ToastrService) {}

  // ngOnInit(): void {
  //   this.route.queryParams.subscribe((params) => {
  //     const firstParam: number = +(
  //       this.route.snapshot.queryParamMap.get('userId') || 0
  //     );
  //     console.log('UserId========', firstParam);
  //     this.options.uid = firstParam;
  //   });
  //   this.rtc.client = AgoraRTC.createClient({
  //     mode: 'rtc',
  //     codec: 'h264',
  //     websocketRetryConfig: {
  //       timeout: 10,
  //       timeoutFactor: 0,
  //       maxRetryCount: 1,
  //       maxRetryTimeout: 2000,
  //     },
  //   });
  //   console.log('[sk] rtc', this.rtc);
  //   this.rtc.client.on('user-joined', (user: any) => {
  //     console.log('user-joined==========>', user.uid);
  //     this.toastr.success(user.uid + ' joined');
  //     const remotePlayerContainer = document.createElement('div');
  //     // Specify the ID of the DIV container. You can use the uid of the remote user.
  //     remotePlayerContainer.id = user.uid.toString();
  //     remotePlayerContainer.textContent = 'Remote user ' + user.uid.toString();
  //     remotePlayerContainer.style.width = '640px';
  //     remotePlayerContainer.style.height = '480px';
  //     this.otherContainer.append(remotePlayerContainer);
  //   });

  //   this.rtc.client.on('user-published', async (user: any, mediaType: any) => {
  //     console.log('user-published==========>', user.uid);
  //     // Subscribe to the remote user when the SDK triggers the "user-published" event
  //     await this.rtc.client.subscribe(user, mediaType);
  //     console.log('[sk] subscribe success');

  //     // If the remote user publishes a video track.
  //     if (mediaType === 'video') {
  //       // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
  //       const remoteVideoTrack = user.videoTrack;
  //       // Dynamically create a container in the form of a DIV element for playing the remote video track.
  //       const remotePlayerContainer = document.getElementById(user.uid);
  //       this.otherContainer.append(remotePlayerContainer);

  //       // Play the remote video track.
  //       // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
  //       remoteVideoTrack.play(remotePlayerContainer);

  //       // Or just pass the ID of the DIV container.
  //       // remoteVideoTrack.play(playerContainer.id);
  //     }

  //     // If the remote user publishes an audio track.
  //     if (mediaType === 'audio') {
  //       // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
  //       const remoteAudioTrack = user.audioTrack;
  //       // Play the remote audio track. No need to pass any DOM element.
  //       remoteAudioTrack.play();
  //     }
  //   });

  //   // Listen for the "user-unpublished" event
  //   this.rtc.client.on('user-unpublished', (user: any) => {
  //     console.log('==========>', user.uid);
  //     // Get the dynamically created DIV container.
  //     // const remotePlayerContainer:any = document.getElementById(user.uid);
  //     // // Destroy the container.
  //     // remotePlayerContainer.remove();
  //   });
  //   this.rtc.client.on('user-left', (user: any) => {
  //     console.log('track-ended==========>', user.uid);
  //     // Get the dynamically created DIV container.
  //     const remotePlayerContainer: any = document.getElementById(user.uid);
  //     // Destroy the container.
  //     remotePlayerContainer.remove();

  //     this.toastr.error(user.uid + '  has left meeting.');
  //   });
  // }

  // ngAfterViewInit(): void {
  //   this.myConatiner = document.getElementById('me');
  //   this.myTitleConatiner = document.getElementById('me-title');
  //   this.otherContainer = document.getElementById('other');
  //   // document.getElementById('join').onclick = () => {
  //   //   this.join();
  //   // };

  //   // document.getElementById('leave').onclick = async () => {
  //   //   // Destroy the local audio and video tracks.
  //   //   this.rtc.localAudioTrack.close();
  //   //   this.rtc.localVideoTrack.close();

  //   //   this.rtc.client.remoteUsers.forEach((user:any) => {
  //   //     // Destroy the dynamically created DIV container.
  //   //     const playerContainer = document.getElementById(user.uid);
  //   //     playerContainer && playerContainer.remove();
  //   //   });

  //   //   // Leave the channel.
  //   //   await this.rtc.client.leave();
  //   // };
  // }
  // joinClick() {
  //   this.join();
  // }
  // async leave() {
  //   this.setMuteVideoYourSelf(false);
  //   this.setMuteAudioYourSelf(false);
  //   this.rtc.localAudioTrack.close();
  //   this.rtc.localVideoTrack.close();
  //   this.myConatiner.replaceChildren();
  //   this.myTitleConatiner.textContent = '';

  //   this.rtc.client.remoteUsers.forEach((user: any) => {
  //     // Destroy the dynamically created DIV container.
  //     const playerContainer = document.getElementById(user.uid);
  //     playerContainer && playerContainer.remove();
  //   });

  //   // Leave the channel.
  //   await this.rtc.client.leave();
  // }

  // private async join() {
  //   // Join an RTC channel.
  //   console.log('[sk] start join loh');
  //   await this.rtc.client.join(
  //     this.options.appId,
  //     this.options.channel,
  //     null,
  //     this.options.uid
  //   );
  //   console.log('[sk] end join loh', this.rtc);

  //   // Create a local audio track from the audio sampled by a microphone.
  //   console.log('[sk] start audio ambil');
  //   this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  //   console.log('[sk] end audio ambil');
  //   // Create a local video track from the video captured by a camera.
  //   this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  //   // Publish the local audio and video tracks to the RTC channel.
  //   await this.rtc.client.publish([
  //     this.rtc.localAudioTrack,
  //     this.rtc.localVideoTrack,
  //   ]);
  //   const client = AgoraRTM.createInstance(this.options.appId);
  //   await client.login({uid:''+ this.options.uid});
  //   this.rtc.chatChannel =  client.createChannel(this.options.channel + '_rtm');
  //   this.rtc.chatChannel.join();
  //   this.rtc.chatChannel.on('ChannelMessage', (message: any, memberId: any) => {
  //     console.log('hehheehehee--1==>', message, memberId);
  //     this.messages.push({id:memberId, text:message.text, date: new Date()});
  //     // document.getElementById("log").appendChild(document.createElement('div')).append("Message received from: " + memberId + " Message: " + message)
  //   });
  //   // Display channel member stats
  //   this.rtc.chatChannel.on('MemberJoined', (memberId: any) => {
  //     console.log('hehheehehee--2==>', memberId);
  //     // document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " joined the channel")
  //   });
  //   console.log('==========>', this.myConatiner);
  //   // Dynamically create a container in the form of a DIV element for playing the local video track.
  //   const localPlayerContainer = document.createElement('div');
  //   // Specify the ID of the DIV container. You can use the uid of the local user.
  //   localPlayerContainer.id = this.options.uid.toString();
  //   localPlayerContainer.style.width = '100%';
  //   localPlayerContainer.style.height = '100%';
  //   localPlayerContainer.style.position = 'relative';
  //   this.myConatiner.replaceChildren();
  //   this.myConatiner.append(localPlayerContainer);
  //   this.myTitleConatiner.textContent = 'Your id ' + this.options.uid;

  //   // Play the local video track.
  //   // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
  //   this.rtc.localVideoTrack.play(localPlayerContainer);
  //   console.log('[sk] publish success!');
  // }
  // setMuteAudioYourSelf(value: boolean) {
  //   this.rtc.isAudioMuted = value;
  //   this.rtc.localAudioTrack.setMuted(value);
  // }
  // setMuteVideoYourSelf(value: boolean) {
  //   this.rtc.isVideoMuted = value;
  //   console.log('isVideoMuted=========', value);
  //   this.rtc.localVideoTrack.setMuted(value);
  // }
  // sendMessage(text:string){
  //   console.log("----------", text);
  //   if(this.rtc.chatChannel){
  //     console.log("22 ----------", text);
  //     this.rtc.chatChannel.sendMessage({ text }).then(() => {

  //     this.messages.push({id:'me', text, date: new Date()});
  //       console.log("jkjajkjsnkasklkmalmlk")
  //       // Your code for handling the event when the channel message is successfully sent.
  //       }).catch((error:any) => {
  //         console.log('errrrrrrrrrrrrrrrrr', error)
  //       // Your code for handling the event when the channel message fails to be sent.
  //       });
  //   }

  // }
}
