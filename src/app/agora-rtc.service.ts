import { Injectable } from '@angular/core';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';
import { ToastrService } from 'ngx-toastr';
import VirtualBackgroundExtension from "agora-extension-virtual-background";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AgoraRtcService {
  rtc: any = {
    // For the local client.
    client: null,
    // For the local audio and video tracks.
    localAudioTrack: null,
    localVideoTrack: null,
  };
  options = {
    appId: environment.appId, // set your appid here
    channel: '', // Set the channel name.
    // token: '', // Pass a token if your project enables the App Certificate.
    // uid: null
  };
  messages: Array<any> = [];
  remoteUsers: Array<any> = [];
  processor: any = null;
  extension:any = null;
  constructor(private toastr: ToastrService) {}

  checkSystemRequirements() {
    return AgoraRTC.checkSystemRequirements();
  }
  createClient() {
    this.rtc.client = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'h264',
      websocketRetryConfig: {
        timeout: 10,
        timeoutFactor: 0,
        maxRetryCount: 1,
        maxRetryTimeout: 2000,
      },
    });
    // Create a VirtualBackgroundExtension instance
     this.extension = new VirtualBackgroundExtension();
    // Register the extension
    AgoraRTC.registerExtensions([this.extension]);
  }
  async localUser(token: any, uuid: any) {
    await this.rtc.client.join(
      this.options.appId,
      this.options.channel,
      token,
      uuid
    );
    this.rtc.uid = uuid;
    this.rtc.name = uuid.split('_')[0];
    await this.createRTMChannel(uuid);
    await this.validateLimit(uuid);
  }
  async createRTMChannel(uuid: string) {
    this.rtc.channelClient = AgoraRTM.createInstance(this.options.appId);
    await this.rtc.channelClient.login({ uid: uuid });
    this.rtc.chatChannel =  this.rtc.channelClient.createChannel(this.options.channel + '_rtm');
    await this.rtc.chatChannel.join();
    console.log("9********")
    this.addChatChannelEvents();
  }
  addChatChannelEvents(){
    this.rtc.chatChannel.on('ChannelMessage', (message: any, memberId: any) => {
      const name = memberId.split('_')[0];
      this.messages.push({
        id: memberId,
        name,
        text: message.text,
        date: new Date(),
      });
    });
    // Display channel member stats
    this.rtc.chatChannel.on('MemberJoined', (memberId: any) => {
      // console.log("9********")
      // document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " joined the channel")
    });
  }
  async validateLimit(uuid:any){
    console.log("8********", await this.rtc.channelClient.getChannelMemberCount([this.options.channel+'_rtm']))
    const joinedUser = await this.rtc.chatChannel.getMembers();
    console.log("=======>><>>hahh", joinedUser)
    if(joinedUser.length <9){
      AgoraRTC.getCameras().then(
        (res: any) => {
          this.createVideoAndPublish(uuid);
        },
        (err: any) => {
          this.toastr.error('Please allow to use camera');
        }
      );
      AgoraRTC.getMicrophones().then(
        (res: any) => {
          this.createAudioAndPublish();
        },
        (err: any) => {
          this.toastr.error('Please allow to use microphone');
        }
      );
    }else{
      this.toastr.error('Channel is already full.')
    }
  }
  async createAudioAndPublish() {
    this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    this.rtc.client.publish([this.rtc.localAudioTrack]);
  }
  async createVideoAndPublish(uuid: any) {
    this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
      encoderConfig: '120p',
    });
    this.rtc.client.publish([this.rtc.localVideoTrack]);
    this.createUserUI(uuid);
    // this.addAlreadyConnected();
  }
  createUserUI(uuid: string) {
    const myConatiner: any = document.getElementById('me');
    myConatiner.replaceChildren();
    this.rtc.localVideoTrack.play(myConatiner);
  }
  agoraServerEvents(rtc: any) {
    this.userJoinedEvent(rtc);
    this.userPublishedEvent(rtc);
    this.userUnpublishedEvent(rtc);
    this.useLeftEvent(rtc);
  }
  async addAlreadyConnected(){
    console.log("========>",this.rtc.client.remoteUsers)
    for(const u of this.rtc.client.remoteUsers){
      const id = u.uid;
      const name = id.split('_')[0];
      let userAlreadyExists = false;
      for (const userObj of this.remoteUsers) {
        if (userObj.id === u.uid) {
          userAlreadyExists = true;
          break;
        }
      }
      if(!userAlreadyExists){
        this.remoteUsers.push({ id, name });
      }
      await this.rtc.client.subscribe(u, 'video');
      await this.rtc.client.subscribe(u, 'audio');
        const remoteVideoTrack = u.videoTrack;
        const remotePlayerContainer = document.getElementById(
          u.uid + '_parent');
        remoteVideoTrack.play(remotePlayerContainer);
        const remoteAudioTrack = u.audioTrack;
        remoteAudioTrack.play();
    }
  }
  userJoinedEvent(rtc: any) {
    rtc.client.on('user-joined', (user: any) => {
      console.log('01============================');
      const id = user.uid;
      const name = id.split('_')[0];
      let userAlreadyExists = false;
      for (const userObj of this.remoteUsers) {
        if (userObj.id === user.uid) {
          userAlreadyExists = true;
          break;
        }
      }
      if(!userAlreadyExists){
        this.remoteUsers.push({ id, name });
      }
      this.toastr.success(user.uid.split('_')[0] + ' joined');
    });
  }
  userPublishedEvent(rtc: any) {
    rtc.client.on('user-published', async (user: any, mediaType: any) => {
      console.log('02============================,',user);
      await rtc.client.subscribe(user, mediaType);
      let currentUser: any = {};
      for (const userObj of this.remoteUsers) {
        if (userObj.id === user.uid) {
          currentUser = userObj;
          break;
        }
      }
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        const remotePlayerContainer = document.getElementById(
          user.uid + '_parent'
        );
        currentUser.isVideoMuted = false;
        remoteVideoTrack.play(remotePlayerContainer);
      }
      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack;
        currentUser.isAudioMuted = false;
        remoteAudioTrack.play();
      }
    });
  }
  userUnpublishedEvent(rtc: any) {
    rtc.client.on('user-unpublished', (user: any, mediaType: any) => {
      let currentUser: any = {};
      for (const userObj of this.remoteUsers) {
        if (userObj.id === user.uid) {
          currentUser = userObj;
          break;
        }
      }
      if (mediaType === 'video') {
        currentUser.isVideoMuted = true;
      }
      if (mediaType === 'audio') {
        currentUser.isAudioMuted = true;
      }
      rtc.client.unsubscribe(user, mediaType);

    });
  }
  useLeftEvent(rtc: any) {
    this.rtc.client.on('user-left', (user: any) => {
      this.remoteUsers = this.remoteUsers.filter(
        (userObj) => userObj.id !== user.uid
      );
      this.toastr.error(user.uid.split('_')[0] + '  has left meeting.');
    });
  }
  async leaveCall() {
    this.rtc.isVideoMuted = false;
    this.rtc.isAudioMuted = false;
    if(this.rtc.localAudioTrack){
      await this.rtc.localAudioTrack.close();
    }
    if(this.rtc.localVideoTrack){
      await this.rtc.localVideoTrack.close();
    }
    if(this.rtc.screenTrack){
      await this.rtc.screenTrack.stop();
    }
    
    // this.myConatiner.replaceChildren();
    // this.myTitleConatiner.textContent = '';

    // this.rtc.client.remoteUsers.forEach((user: any) => {
    //   // Destroy the dynamically created DIV container.
    //   const playerContainer = document.getElementById(user.uid);
    //   playerContainer && playerContainer.remove();
    // });
    this.remoteUsers = [];
    this.messages = [];
    // Leave the channel.
    if(this.rtc.client){
      await this.rtc.client.leave();
    }
    if(this.rtc.chatChannel){
      await this.rtc.chatChannel.leave();
    }
    if(this.rtc.channelClient){
      await this.rtc.channelClient.logout();
    }

  }
  async startScreenCall(token: any, uuid: any) {
    this.rtc.screenTrack = await AgoraRTC.createScreenVideoTrack({});
    this.rtc.localVideoTrack.stop();
    await this.rtc.client.unpublish(this.rtc.localVideoTrack);
    // Publish the screen track.
    await this.rtc.client.publish(this.rtc.screenTrack);
    const remotePlayerContainer = document.getElementById('me');
    this.rtc.isScreenShareStart = true;
    // Play the screen track on local container.
    this.rtc.screenTrack.play(remotePlayerContainer);
    this.rtc.screenTrack.on('track-ended', () => {
      this.stopScreenShare(uuid);
    });
    // Update the button text.
    //   this.rtc.screenShareclient = AgoraRTC.createClient({
    //   mode: 'rtc',
    //   codec: 'h264',
    //   websocketRetryConfig: {
    //     timeout: 10,
    //     timeoutFactor: 0,
    //     maxRetryCount: 1,
    //     maxRetryTimeout: 2000,
    //   },
    // });

    // uuid = uuid+'_screenShare';
    // await this.rtc.screenShareclient.join(this.options.appId,
    //   this.options.channel,
    //   token,
    //   uuid);
    // this.rtc.screenTrack = await AgoraRTC.createScreenVideoTrack({});
    // await this.rtc.screenShareclient.publish(this.rtc.screenTrack);
  }
  stopScreenShare(uuid:any){
    // console.log('1000---track-ended');
    this.rtc.screenTrack.close();
    this.rtc.client.unpublish(this.rtc.screenTrack).then(()=>{
      console.log('track-ended');
      this.rtc.client.publish([this.rtc.localVideoTrack]);
      this.createUserUI(uuid);
      this.rtc.isScreenShareStart = false;
      // this.rtc.localVideoTrack.play();
    });
    // console.log('track-ended');
    // console.log('you can run your code here to stop screen');

  }
  agoraServerScreenShareEvents(rtc: any) {
    this.userJoinedEventScreenShare(rtc);
    this.userPublishedEventScreenShare(rtc);
    this.userUnpublishedEventScreenShare(rtc);
    this.useLeftEventScreenShare(rtc);
  }
  userJoinedEventScreenShare(rtc: any) {
    rtc.screenShareclient.on('user-joined', (user: any) => {
      // console.log(
      //   'userPublishedEventScreenShare---------hahhahhha==========>>>',
      //   user
      // );
      // const id = user.uid;
      this.toastr.success(user.uid.split('_')[0] + 'Screen user joined');
    });
  }
  userPublishedEventScreenShare(rtc: any) {
    rtc.screenShareclient.on(
      'user-published',
      async (user: any, mediaType: any) => {
        // console.log(
        //   'userPublishedEventScreenShare hahhahhha==========>>>',
        //   user
        // );
        await rtc.screenShareclient.subscribe(user, mediaType);
        let currentUser: any = {};
        console.log('abhcdhncjdkmc------', user);
        for (const userObj of this.remoteUsers) {
          if (userObj.id === user.uid) {
            currentUser = userObj;
            break;
          }
        }
        // if (mediaType === 'video') {
        //   const remoteVideoTrack = this.rtc.screenTrack;
        //   const remotePlayerContainer = document.getElementById('shareScreen');
        //   currentUser.isScreenShareStart = true;
        //   remoteVideoTrack.play(remotePlayerContainer);
        // }
        // if (mediaType === 'audio') {
        //   const remoteAudioTrack = user.audioTrack;
        //   currentUser.isAudioMuted = false;
        //   remoteAudioTrack.play();
        // }
      }
    );
  }
  userUnpublishedEventScreenShare(rtc: any) {
    rtc.screenShareclient.on(
      'user-unpublished',
      (user: any, mediaType: any) => {
        let currentUser: any = {};
        for (const userObj of this.remoteUsers) {
          if (userObj.id === user.uid) {
            currentUser = userObj;
            break;
          }
        }
        if (mediaType === 'video') {
          currentUser.isScreenShareStart = false;
        }
        // if (mediaType === 'audio') {
        // for(const userObj of this.remoteUsers){
        //   if(userObj.id===user.uid){
        //     currentUser.isAudioMuted = true;
        //   }
        // }}
      }
    );
  }
  useLeftEventScreenShare(rtc: any) {
    rtc.screenShareclient.on('user-left', (user: any) => {
      // this.remoteUsers = this.remoteUsers.filter((userObj)=> userObj.id !== user.uid)
      this.toastr.error(user.uid.split('_')[0] + '  has stop sharing.');
    });
  }
  setEnabledAudioYourSelf(value: boolean) {
    this.rtc.isAudioMuted = !value;
    this.rtc.localAudioTrack.setEnabled(value);
  }
  setEnabledVideoYourSelf(value: boolean) {
    this.rtc.isVideoMuted = !value;
    this.rtc.localVideoTrack.setEnabled(value);
  }
  sendMessage(text: string) {
    if (this.rtc.chatChannel) {
      this.rtc.chatChannel
        .sendMessage({ text })
        .then(() => {
          this.messages.push({
            id: this.rtc.uid,
            name: this.rtc.name + '(Me)',
            text,
            date: new Date(),
          });
        })
        .catch((error: any) => {
          this.toastr.error('Message failed');
        });
    }
  }
  uuid() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }
  // Initialization
async getProcessorInstance() {
  if (!this.processor && this.rtc.localVideoTrack) {
    // Create a VirtualBackgroundProcessor instance
    this.processor = this.extension.createProcessor();

      try {
        // Initialize the extension and pass in the URL of the Wasm file
        await this.processor.init("./assets/wasms");
        } catch(e) {
          console.log("Fail to load WASM resource!");return null;
          }
    // Inject the extension into the video processing pipeline in the SDK
    this.rtc.localVideoTrack.pipe(this.processor).pipe(this.rtc.localVideoTrack.processorDestination);
  }
  return this.processor;
}
// Blur the user's actual background
async setBackgroundBlurring() {
  if (this.rtc.localVideoTrack) {

    let processor = await this.getProcessorInstance();

    try {
      processor.setOptions({type: 'blur', blurDegree: 2});
      await processor.enable();
    } finally {
    }

    this.rtc.virtualBackgroundEnabled = true;
  }
}
async  setBackgroundColor() {
  if (this.rtc.localVideoTrack) {
    let processor = await this.getProcessorInstance();

    try {
      processor.setOptions({type: 'color', color: '#00ff00'});
      await processor.enable();
    } finally {
    }

    this.rtc.virtualBackgroundEnabled = true;
  }
}
async  setBackgroundImage() {
  const imgElement = document.createElement('img');

  imgElement.onload = async() => {

    let processor = await this.getProcessorInstance();

    try {
      processor.setOptions({type: 'img', source: imgElement});
      await processor.enable();
    } finally {
    }
    this.rtc.virtualBackgroundEnabled = true;
  }
  imgElement.src = 'assets/images/background1.jpg';
}
async removeBackgroundAffect(){
  let processor = await this.getProcessorInstance();
  await processor.disable();
}
}
