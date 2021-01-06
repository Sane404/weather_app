import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cityForm:FormGroup;
  constructor(private router:Router,private fb:FormBuilder){}

  ngOnInit(): void {
    this.cityForm = this.fb.group({
      city: ['',[Validators.required,Validators.minLength(3),Validators.pattern('^[A-Za-z]+$')]]
    });
  }
  get city(){

    return this.cityForm.get('city');
  }
  toLeft(){
    this.router.navigate(['left'])
  }
  submit(form){
    if(form.status != 'INVALID'){
      console.log(form);
      this.router.navigate(['right',form.value.city])
    }
  }
}
