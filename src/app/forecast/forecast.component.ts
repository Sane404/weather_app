import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SvgService } from '../svg.service';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit {

  constructor(private svgService:SvgService,private route: ActivatedRoute,private httpRequest:HttpService) { }
  data;
  pixabay_images = [];
  lat;
  lon;
  forecastData;
  date;
  translate;
  ngOnInit(): void {
    //svgPositioning
    let name = this.route.snapshot.paramMap.get('country');
    this.data = this.svgService.getSvg(name);
    let svgElement = <any>document.querySelector('.svg');
    svgElement.innerHTML = this.data.html;
    svgElement.classList.add(this.data.key);
    let bboxRect = svgElement.getBBox();
    let requiredX = (400 - bboxRect.width)/2;
    let requiredY  = (400 - bboxRect.height)/2;
    let currentX = bboxRect.x;
    let currentY = bboxRect.y;
    let xDiff = (requiredX - currentX);
    let yDiff = (requiredY - currentY);
    // let fullProp =  `translate(${xDiff}px,${yDiff}px)`;
    this.translate = `translate(${xDiff}px,${yDiff}px)`;
    // svgElement.style.transform = fullProp;
    this.httpRequest.getPixabayImages(this.data.capital).subscribe((data:any) => {
        data.hits.forEach(element => {
          this.pixabay_images.push(element.largeImageURL);
        });
    });
    this.httpRequest.getWeatherCoords(this.data.capital).subscribe((data:any)=>{
      this.lat = data.coord.lat;
      this.lon = data.coord.lon;
      
      
      this.httpRequest.getForecastData(this.lat,this.lon).subscribe((data:any)=>{
        let date = new Date((data.current.dt + data.timezone_offset)*1000).toUTCString().split(' ')[4];
        let date_split = date.split(':');
        let hours = date_split[0];
        let minutes = date_split[1];
        let seconds = date_split[2];
        this.date = `${hours}: ${minutes}: ${seconds}`;
        this.startTimer(hours,minutes,seconds);
        this.forecastData = data.daily.splice(0,7)
        this.forecastData.forEach(element => {
          let fullDate = new Date(element.dt * 1000).toUTCString().split(' ');
          let day = fullDate[0].substr(0,3);
          let dayNum = fullDate[1];
          let month = fullDate[2];
          let year = fullDate[3];
          element.this_day = { day: day, day_number: dayNum, month: month, year: year }
          let weather_icon = element.weather[0].icon;
          element.weather[0].icon = `http://openweathermap.org/img/wn/${weather_icon}@2x.png`

          
        })
        console.log(this.forecastData);
      })
    })
  }
  //liechteinstein fix ??
  swapImg(e){
    let mainImage = document.querySelector('.mainImage');
    let mainSrc = mainImage.getAttribute('src');
    if(e.target.classList.contains('secondaryImage')){
          let secondarySrc = e.target.getAttribute('src'); 
          e.target.setAttribute('src',mainSrc);
          mainImage.setAttribute('src',secondarySrc); 
    }else if(e.target == mainImage){
      if(window.innerWidth > 768){
        e.target.classList.toggle('big');
        if(mainImage.classList.contains('big')){
          document.body.style.overflow = 'hidden';
          window.scrollTo(0,0);
        }else{
          document.body.style.overflow = 'scroll';
        }
      }
      
    }
  }
  startTimer(hh,mm,ss){
    hh = +hh;
    mm = +mm;
    ss = +ss;
    setInterval(()=>{
      ss++;
      if(ss > 60){
        ss = 0;
        mm++;
      }
      if(mm > 60){
        mm = 0;
        hh++;
      }
      if(hh > 24){
        hh = 0;
      }
      hh = (hh < 10) ? "0" + +hh : +hh;
      mm = (mm < 10) ? "0" + +mm : +mm;
      ss = (ss < 10) ? "0" + +ss : +ss;
      this.date = `${hh}:${mm}:${ss}`;
    },1000)
  }
  hideImg(e){
    let imagesGrid = document.querySelector('.pixabay_images')
    imagesGrid.classList.toggle('hidden');
    if(imagesGrid.classList.contains('hidden')){
      e.target.innerText = 'Show Images';

    }else{
      e.target.innerText = 'Hide Images';
    }
  }
}
