const apikey='228eff15ab36692ee75f401eff9f3a92';
let baseURL='https://api.openweathermap.org/data/2.5/weather?';
const place=document.querySelector('.city');
const errorMessage=document.querySelector('.wrong-input');
const backgrounds=[
{
    'icon':'01d',
    'gradient':'linear-gradient(180deg, rgba(255,172,88,1) 0%, rgba(242,205,122,1) 100%)'
},{
    'icon':'02d',
    'gradient':'linear-gradient(180deg, rgba(255,186,137,1) 22%, rgba(77,183,246,1) 100%)'
},{
    'icon':'03d',
    'gradient':'linear-gradient(180deg, rgba(184,217,235,1) 0%, rgba(208,238,247,1) 46%, rgba(125,190,223,1) 100%)'
},{
    'icon':'04d',
    'gradient':'linear-gradient(180deg, rgba(184,217,235,1) 0%, rgba(208,238,247,1) 24%, rgba(153,210,240,1) 47%, rgba(178,216,232,1) 78%, rgba(125,190,223,1) 100%)'
},{
    'icon':'09d',
    'gradient':'linear-gradient(180deg, rgba(208,238,247,1) 0%, rgba(185,216,233,1) 45%, rgba(123,153,168,1) 100%)'
},{
    'icon':'10d',
    'gradient':'linear-gradient(180deg, rgba(189,218,233,1) 0%, rgba(208,238,247,1) 17%, rgba(189,218,233,1) 45%, rgba(163,175,181,1) 100%)'
},{
    'icon':'11d',
    'gradient':'linear-gradient(180deg, rgba(117,137,175,1) 0%, rgba(165,176,199,1) 31%, rgba(160,171,194,1) 51%, rgba(73,85,120,1) 100%)'
},{
    'icon':'13d',
    'gradient':'linear-gradient(180deg, rgba(197,208,232,1) 0%, rgba(208,215,230,1) 16%, rgba(217,224,238,1) 29%, rgba(206,219,246,1) 46%, rgba(204,217,245,1) 100%)'
},{
    'icon':'50d',
    'gradient':'linear-gradient(180deg, rgba(172,176,187,1) 0%, rgba(201,207,218,1) 16%, rgba(181,186,195,1) 56%, rgba(188,196,204,1) 100%)'
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

const toCelsius=(temp)=>{
    return Math.floor(temp-273.15);
}
const toFahrenheit=(temp)=>{
    return Math.floor(((temp-273.15)*1.8)+32);
}
const toKelvin=(temp)=>{
    return Math.floor(temp);
}
const addZeroIf=(time)=>{
    let mins;
    if(time<10?mins='0'+time:mins=time)
    return mins;
}
const calculateDate=(timezone)=>{
    let currentDate=new Date();
    let currentUTC=currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
    let offset=timezone/3600;
    let date = new Date(currentUTC + (3600000*offset));
    console.log(currentDate.getTimezoneOffset());
    console.log(date);
    return date;
}
let searchedCities=[];


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
    const date=calculateDate(fullWeather.timezone);
    // Fill Date and Time
    weekday.innerHTML=weekdays[date.getDay()];
    day.innerHTML=date.getDate();
    month.innerHTML=months[date.getMonth()];
    year.innerHTML=date.getFullYear();
    hour.innerHTML=date.getHours()+':';
    minutes.innerHTML=addZeroIf(date.getMinutes());


    // Fill Main Section
    
    const degrees=document.querySelector('.degrees');
    const textWeather=document.querySelector('.current-weather');
    const feelsLike=document.querySelector('.feels-like');
    const weatherIcon=document.querySelector('.weather-icon');
    const container=document.querySelector('.container');

    place.innerHTML=`${fullWeather.name}, ${fullWeather.sys.country}`;
    degrees.innerHTML=`${eval(unitSystem)(fullWeather.main.temp)}<span>&#176;</span>`;
    textWeather.innerHTML=fullWeather.weather[0].description;
    feelsLike.innerHTML=`Feels like: ${eval(unitSystem)(fullWeather.main.feels_like)}<span>&#176;</span>`;
    weatherIcon.src=`http://openweathermap.org/img/wn/${fullWeather.weather[0].icon}@2x.png`;
    let bgColor;
    let iconWeather=fullWeather.weather[0].icon;
    backgrounds.forEach(bg=>{
        if(iconWeather===bg.icon){
            bgColor=bg.gradient;
        }
    });
    container.style.backgroundImage=bgColor;
    
    // Fill Additional Section
    const min=document.querySelector('.min');
    const max=document.querySelector('.max');
    const sunrise=document.querySelector('.sunrise');
    const sunset=document.querySelector('.sunset');
    const humidity=document.querySelector('.humidity');
    const pressure=document.querySelector('.pressure');
    const cloudiness=document.querySelector('.cloudiness');
    const windspeed=document.querySelector('.windspeed');

    min.innerHTML=`Minimum: ${eval(unitSystem)(fullWeather.main.temp_min)}<span>&#176;</span>`;
    max.innerHTML=`Maximum: ${eval(unitSystem)(fullWeather.main.temp_max)}<span>&#176;</span>`;
    
    let rise=new Date(fullWeather.sys.sunrise*1000);
    sunrise.innerHTML=`Sunrise: ${rise.getHours()}:${addZeroIf(rise.getMinutes())}h`;
    let down=new Date(fullWeather.sys.sunset*1000);
    sunset.innerHTML=`Sunset: ${down.getHours()}:${addZeroIf(down.getMinutes())}h`;
    
    humidity.innerHTML=`Humidity: '${fullWeather.main.humidity}%`;
    pressure.innerHTML=`Pressure: ${fullWeather.main.pressure}hPa-`;
    cloudiness.innerHTML=`Cloudiness: ${fullWeather.clouds.all}%`;
    windspeed.innerHTML=`Wind: ${Math.floor(fullWeather.wind.speed*3.6)}km/h`;
};


// Fetch Weather
const fetchWeather=(location)=>{
    fetch(`${baseURL}${location}&appid=${apikey}`)
    .then(response =>{
        return response.json();        
    }).then(data=>{
        if(data.message){
            errorMessage.innerText=data.message;
            errorMessage.style.display="block";
            const topSection=document.querySelector('.top-section');
            const dateSection=document.querySelector('.date-section');
            topSection.style.paddingBottom="0.2rem";
            dateSection.style.paddingTop="0";
        }
            
        else{
            searchedCities.push(data);
            console.log(data);
            showWeather(data);
            console.log("fetch+1");
        }
            
    });
}

// Location from Search Box
const search=document.querySelector('.fa-search');
const searchBox=document.querySelector('#search');
search.addEventListener('click', ()=>{
    // if(searchBox.value){
        let location=`q=${searchBox.value}`;
        if(searchedCities.length>0){
            searchedCities.forEach(city=>{
                if(city.name===searchBox.value){
                    showWeather(city);
                }else{
                    fetchWeather(location);
                    console.log("search+1");
                }
            });
        }else{
            fetchWeather(location);
        }
    // }else{
    //     console.log("Enter a city!");
    // }
    
    
});
// Use Current Location of Device
const currentLocation=document.querySelector('.current-location');
currentLocation.addEventListener('click', ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
            let lon=position.coords.longitude;
            let lat=position.coords.latitude;
            let location=`lat=${lat}&lon=${lon}`;
            if(searchedCities.length>0){
                searchedCities.forEach(city=>{
                    if(city.coords.lat===lat && city.coords.lon){
                        showWeather(city);
                    }else{
                        fetchWeather(location);
                        console.log("currentLoc+1");
                    }
                });
            }else{
                fetchWeather(location);
                showWeather(searchedCities[0]);
                console.log("fetching");
            }
        });
    }else{
        console.log("Geolocation blocked!");
    }
});
// Choose Measurement Unit (Default is Celsius)
let unitSystem='toCelsius';
const dropdown=document.querySelector('#dropdown');
dropdown.addEventListener('change', ()=>{
    unitSystem=dropdown.options[dropdown.options.selectedIndex].dataset.unit;
    console.log(unitSystem);
    if(searchedCities.length>0){
        searchedCities.forEach(city=>{
            if(city.name===place.innerText.substring(0, place.innerText.indexOf(','))){
                showWeather(city);
            }
        });
    }else{
        console.log("Input info!");
    }
});

// if (fullWeather.message) {
            //     console.log("wrong");
            //     return;
            //   }








// getLocationWeather(searchBox.value);
// const getLocationWeather= (cityValue)=>{
//     fetch(`${baseURL}q=${cityValue}&appid=${apikey}${unitsURL}`)
//     .then(weather =>{
//         return weather.json();
//     }).then(showWeather);
// };
// getCurrentLocationWeather(lon, lat);
// const getCurrentLocationWeather= (lon, lat)=>{
    //     searchBox.value=null;
    //     fetch(`${baseURL}lat=${lat}&lon=${lon}&appid=${apikey}${unitsURL}`)
    //     .then(weather =>{
           
    //         return weather.json();
    //     }).then(showWeather);
    // };

