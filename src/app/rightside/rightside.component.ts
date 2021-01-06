import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../shared/http.service';
@Component({
  selector: 'app-rightside',
  templateUrl: './rightside.component.html',
  styleUrls: ['./rightside.component.scss']
})
export class RightsideComponent implements OnInit {
  city;
  lat;
  lon;
  date;
  forecastData;
  errorMessage:boolean = false;
  constructor(private route:ActivatedRoute,private httpRequest:HttpService,private router:Router) { }

  ngOnInit(): void {
    this.city = this.route.snapshot.paramMap.get('city');
    this.httpRequest.getWeatherCoords(this.city).subscribe((data:any)=>{
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
    },(error)=>{
       this.errorMessage = true;
    })
    
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
  goBack(){
    this.router.navigate(['']);
  }
}
