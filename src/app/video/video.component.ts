import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AgoraHTTPService } from '../agora-http.service';
import { AgoraRtcService } from '../agora-rtc.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  uid = '';
  // channel = '';
  constructor(
    public agoraRTC: AgoraRtcService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private agoraHTTP: AgoraHTTPService
  ) {}

  async ngOnInit() {
    // await this.agoraRTC.leaveCall();
    this.route.params.subscribe((params) => {
      this.uid = this.route.snapshot.paramMap.get('uid') || '';
      this.uid = '527841';
      this.agoraRTC.options.channel =
        this.route.snapshot.paramMap.get('channel') || '';
      this.startCall();
      this.getAcquire();
      console.log('1========>', this.uid, this.agoraRTC.options.channel);
    });
  }
  async startCall() {
    if (this.agoraRTC.checkSystemRequirements()) {
      this.agoraRTC.createClient();
      this.agoraRTC.agoraServerEvents(this.agoraRTC.rtc);
      await this.agoraRTC.localUser(null, this.uid);
    } else {
      this.toastr.error('Browser is not compatible');
    }
  }

  async startScreenShare() {
    this.agoraRTC.startScreenCall(null, this.uid);
    // this.agoraRTC.agoraServerScreenShareEvents(this.agoraRTC.rtc);
  }
  stopScreenShare() {
    this.agoraRTC.stopScreenShare(this.uid);
  }
  async logout() {
    await this.agoraRTC.leaveCall();
    this.router.navigate(['landing']);
  }
  getAcquire() {
    const reqBody = {
      "cname": this.agoraRTC.options.channel,
      "uid": "527841",
      "clientRequest": {
          "region": "CN",
          "resourceExpiredHour": 24
      }
  };
    this.agoraHTTP.getAcquire(reqBody).subscribe({
      next: (res: any) => {
        console.log('%%%%%%%%%', res);
      },
      error: (err) => {
        console.log('%%%%%%%%%', err);
      },
    });
  }
}
