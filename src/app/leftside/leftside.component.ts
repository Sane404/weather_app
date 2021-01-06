import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SvgService } from '../svg.service';
@Component({
  selector: 'app-leftside',
  templateUrl: './leftside.component.html',
  styleUrls: ['./leftside.component.scss']
})
export class LeftsideComponent implements OnInit {

  constructor(private router: Router, private svgService: SvgService) { }

  ngOnInit(): void {
    // if (this.svgService.getAll() == null) {
      let allPaths = Array.from(document.querySelectorAll('path'));
      let apArr = [];
      let dataObj;
      allPaths.forEach((item: any) => {
        let data = item.id;
        let countryName = item.getAttribute('name');
        let capitalCity = item.dataset.capital;
        let outerHTML = item.outerHTML;
        let posFind = outerHTML.split('M');
        let XYpos = posFind[1].split('l');
        XYpos[0] = '200 200';
        let newXYpos = XYpos.join('l');
        let newPositions;
        if(item.id == 'AM'){
          newPositions = posFind[0].concat('M',newXYpos,posFind[1],'M',posFind[2]);
        }else{
          newPositions = posFind[0].concat('M',newXYpos);
        }
        dataObj = { key: data, html: newPositions, country:countryName, capital:capitalCity };
        apArr.push(dataObj);
      })
      this.svgService.setSvg(apArr);
    

  }
  goThere(e) {
    let destination = e.target.getAttribute('id');

    this.router.navigate(['forecast', destination])
    //split the string to mdify svg
  }
}
