import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SvgService {
  svgData:any;
  constructor() { }
  setSvg(data){
    localStorage.setItem('svgs',JSON.stringify(data));
  }
  getSvg(data){
    this.svgData = JSON.parse(localStorage.getItem('svgs'));
    for(let i = 0; i<this.svgData.length;i++){
      if(this.svgData[i].key == data){
        return this.svgData[i];
      }
    }
  }
  getAll(){
    return JSON.parse(localStorage.getItem('svgs'));
  }
}
