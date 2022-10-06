import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  joinCallForm: any;
  isSubmitted =false;
  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.joinCallForm = this.formBuilder.group({
      channelName: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }
  get channelName(){
    return this.joinCallForm.get('channelName');
  }
  get name(){
    return this.joinCallForm.get('name');
  }
  join(){
      this.isSubmitted =  true;
    if(this.joinCallForm.valid){
      const uid = this.name.value;
      const channel = this.channelName.value;
      console.log("========>",uid, channel );
      this.router.navigate(['video',uid,channel])
    }
  }
}
