import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  Pixabay_API_KEY:string = '19270976-52a948baffb8c387b7c0b57b3';
  OWM_API_KEY:string = '585b22c630bae3a1a34759b42ff0639d';
  
  constructor(private http:HttpClient) { }
  getPixabayImages(capital){
    return this.http.get(`https://pixabay.com/api/?key=${this.Pixabay_API_KEY}&q=${capital}+city&image_type=photo&per_page=5`);
  }
  getWeatherCoords(city){
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.OWM_API_KEY}`)
  }
  getForecastData(lat,lon){
    
    return this.http.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${this.OWM_API_KEY}&units=metric`)
    
  }

  
}
