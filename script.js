const apikey='228eff15ab36692ee75f401eff9f3a92';
let baseURL='https://api.openweathermap.org/data/2.5/weather?';

const backgrounds=[
{
    'icon':'01d',
    'gradient':'linear-gradient(180deg, rgba(255,169,119,1) 0%, rgba(255,236,110,1) 100%)'
},{
    'icon':'02d',
    'gradient':'linear-gradient(180deg, rgba(196,114,64,1) 0%, rgba(241,233,211,1) 100%)'
},{
    'icon':'03d',
    'gradient':'linear-gradient(180deg, rgba(230,238,252,1) 0%, rgba(172,216,238,1) 100%)'
},{
    'icon':'04d',
    'gradient':'linear-gradient(180deg, rgba(230,238,252,1) 20%, rgba(178,228,255,1) 100%)'
},{
    'icon':'09d',
    'gradient':'linear-gradient(180deg, rgba(214,228,255,1) 0%, rgba(174,186,209,1) 100%)'
},{
    'icon':'10d',
    'gradient':'linear-gradient(180deg, rgba(174,186,209,1) 1%, rgba(203,221,255,1) 37%, rgba(249,255,232,1) 97%)'
},{
    'icon':'11d',
    'gradient':'linear-gradient(180deg, rgba(117,137,175,1) 31%, rgba(151,164,190,1) 63%, rgba(223,223,223,1) 100%)'
},{
    'icon':'13d',
    'gradient':'linear-gradient(180deg, rgba(243,247,255,1) 9%, rgba(223,242,255,1) 69%, rgba(206,212,226,1) 100%)'
},{
    'icon':'50d',
    'gradient':'linear-gradient(180deg, rgba(172,176,187,1) 20%, rgba(208,215,223,1) 100%)'
},{
    'icon':'01n',
    'gradient':'linear-gradient(180deg, rgba(13,51,116,1) 20%, rgba(81,96,159,1) 100%)'
},{
    'icon':'02n',
    'gradient':'linear-gradient(180deg, rgba(48,90,161,1) 20%, rgba(81,96,159,1) 100%)'
},{
    'icon':'03n',
    'gradient':'linear-gradient(180deg, rgba(34,76,145,1) 20%, rgba(152,141,141,1) 100%)'
},{
    'icon':'04n',
    'gradient':'linear-gradient(180deg, rgba(34,76,145,1) 28%, rgba(144,141,141,1) 74%)'
},{
    'icon':'09n',
    'gradient':'linear-gradient(180deg, rgba(21,71,153,1) 10%, rgba(81,81,82,1) 100%)'
},{
    'icon':'10n',
    'gradient':'linear-gradient(180deg, rgba(55,97,166,1) 8%, rgba(140,140,177,1) 78%)'
},{
    'icon':'11n',
    'gradient':'linear-gradient(180deg, rgba(13,45,97,1) 5%, rgba(69,71,89,1) 76%)'
},{
    'icon':'13n',
    'gradient':'linear-gradient(180deg, rgba(77,85,139,1) 0%, rgba(116,119,131,1) 100%)'
},{
    'icon':'50n',
    'gradient':'linear-gradient(180deg, rgba(60,62,74,1) 17%, rgba(156,159,173,1) 100%)'
}];

// const toCelsius=(temp)=>{
//     return Math.floor(temp-273.15);
// }
// const toFahrenheit=(temp)=>{
//     return Math.floor(((temp-273.15)*1.8)+32);
// }
// const addZeroIf=(time)=>{
//     let mins;
//     if(time<10?mins='0'+time:mins=time)
//     return mins;
// }

// Choose Measurement Unit (Default is Celsius)
let units='metric';
let unitsURL=`&units=${units}`;
const dropdown=document.querySelector('#dropdown');
dropdown.addEventListener('change', ()=>{
    units=dropdown.options[dropdown.options.selectedIndex].dataset.unit;
    unitsURL=`&units=${units}`;
});


// Location from Search Box
const search=document.querySelector('.fa-search');
const searchBox=document.querySelector('#search');
search.addEventListener('click', ()=>{
    getLocationWeather(searchBox.value);
});
const getLocationWeather= (cityValue)=>{
    fetch(`${baseURL}q=${cityValue}&appid=${apikey}${unitsURL}`)
    .then(weather =>{
        return weather.json();
    }).then(showWeather);
};

// Use Current Location of Device
const currentLocation=document.querySelector('.current-location');
currentLocation.addEventListener('click', ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
            let lon=position.coords.longitude;
            let lat=position.coords.latitude;
            getCurrentLocationWeather(lon, lat);
        });
    }
    const getCurrentLocationWeather= (lon, lat)=>{
        searchBox.value=null;
        fetch(`${baseURL}lat=${lat}&lon=${lon}&appid=${apikey}${unitsURL}`)
        .then(weather =>{
            return weather.json();
        }).then(showWeather);
    };
});



const showWeather=(fullWeather)=>{
    console.log(fullWeather);
    
    // Date and Time
    const weekdays=['Sun', 'Mon', 'Tue','Wed','Thu','Fri','Sat'];
    const months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekday=document.querySelector('.weekday');
    const day=document.querySelector('.day');
    const month=document.querySelector('.month');
    const year=document.querySelector('.year');
    const hour=document.querySelector('.hour');
    const minutes=document.querySelector('.minutes');
    // Different Timezone Calculations
    let d=new Date();
    let currentUTC=d.getTime() + (d.getTimezoneOffset() * 60000);
    let offset=fullWeather.timezone/3600;
    let date = new Date(currentUTC + (3600000*offset));
    console.log(d.getTimezoneOffset());
    console.log(date);
    // Fill Date and Time
    weekday.innerHTML=weekdays[date.getDay()];
    day.innerHTML=date.getDate();
    month.innerHTML=months[date.getMonth()];
    year.innerHTML=date.getFullYear();
    hour.innerHTML=date.getHours()+':';
    minutes.innerHTML=addZeroIf(date.getMinutes());


    // Fill Main Section
    const city=document.querySelector('.city');
    const degrees=document.querySelector('.degrees');
    const textWeather=document.querySelector('.current-weather');
    const feelsLike=document.querySelector('.feels-like');
    const weatherIcon=document.querySelector('.weather-icon');
    const container=document.querySelector('.container');

    city.innerHTML=`${fullWeather.name}, ${fullWeather.sys.country}`;
    degrees.innerHTML=`${Math.ceil(fullWeather.main.temp)}<span>&#176;</span>`;
    textWeather.innerHTML=fullWeather.weather[0].description;
    feelsLike.innerHTML=`Feels like ${Math.ceil(fullWeather.main.feels_like)}<span>&#176;</span>`;
    weatherIcon.src=`http://openweathermap.org/img/wn/${fullWeather.weather[0].icon}@2x.png`;
    let bgColor;
    let iconWeather=fullWeather.weather[0].icon;
    backgrounds.forEach(bg=>{
        if(iconWeather===bg.icon){
            bgColor=bg.gradient;
        }
    });
    container.style.backgroundImage=bgColor;
    // container.style.backgroundImage=`url(${bgColor})`;
    // container.style.backgroundSize='cover';
    
    // Fill Additional Section
    const min=document.querySelector('.min');
    const max=document.querySelector('.max');
    const sunrise=document.querySelector('.sunrise');
    const sunset=document.querySelector('.sunset');
    const humidity=document.querySelector('.humidity');
    const pressure=document.querySelector('.pressure');
    const cloudiness=document.querySelector('.cloudiness');
    const windspeed=document.querySelector('.windspeed');

    min.innerHTML=`Minimum: ${Math.ceil(fullWeather.main.temp_min)}<span>&#176;</span>`;
    max.innerHTML=`Maximum: ${Math.ceil(fullWeather.main.temp_max)}<span>&#176;</span>`;
    
    let rise=new Date(fullWeather.sys.sunrise*1000);
    sunrise.innerHTML=`Sunrise: ${rise.getHours()}:${addZeroIf(rise.getMinutes())}h`;
    let down=new Date(fullWeather.sys.sunset*1000);
    sunset.innerHTML=`Sunset: ${down.getHours()}:${addZeroIf(down.getMinutes())}h`;
    
    humidity.innerHTML=`Humidity: '${fullWeather.main.humidity}%`;
    pressure.innerHTML=`Pressure: ${fullWeather.main.pressure}hPa-`;
    cloudiness.innerHTML=`Cloudiness: ${fullWeather.clouds.all}%`;
    windspeed.innerHTML=`Wind: ${Math.floor(fullWeather.wind.speed*3.6)}km/h`;
};