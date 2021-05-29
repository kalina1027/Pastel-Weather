//API ключ и основна част на URL при извличане на данни
const apikey='228eff15ab36692ee75f401eff9f3a92';
const baseURL='https://api.openweathermap.org/data/2.5/weather?';

const SECONDS_IN_30_MINS=1800;
const MILLISECONDS_IN_1_SECOND=1000;
const MILLISECONDS_IN_1_MINUTE=60000;

let searchedCities=[];//предишно търсени градове
let citiesJSON=[];//всички градове, от които може да се избира

const cityName=document.querySelector('.city');//града

//Градиенти за фонове
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

//Изчисляване температура спрямо различни температурни скали
const toCelsius=(temp)=>{
    return Math.floor(temp-273.15);
}
const toFahrenheit=(temp)=>{
    return Math.floor(((temp-273.15)*1.8)+32);
}
const toKelvin=(temp)=>{
    return Math.floor(temp);
}

//Добавяне на 0 пред едноцифрено число
const addZeroIf=(time)=>{
    let mins;
    if(time<10?mins='0'+time:mins=time)
    return mins;
}

//Закръгляне число с 4 знака след десетичната запетая
const roundDecimal=(floatNum)=>{
    return Math.round(parseFloat(floatNum)*10000)/10000;
}

//Изчисляване на дата спрямо различни часови зони
const calculateDate=(date, timezone)=>{
    let utc=date.getTime() + (date.getTimezoneOffset() * MILLISECONDS_IN_1_MINUTE);//текущо време-> дата в ms + часова зона в ms
    let offset=timezone*MILLISECONDS_IN_1_SECOND;//часовата зона на търсения град в ms
    let localDate = new Date(utc + offset);//дата в търсения град (дата от локална машина + часовото изместване)
    return localDate;
}

//Показване времето в документа
const showWeather=(fullWeather)=>{
    // console.log(fullWeather);

    //Дата и час
    const weekdays=['Sun', 'Mon', 'Tue','Wed','Thu','Fri','Sat'];
    const months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekday=document.querySelector('.weekday');
    const day=document.querySelector('.day');
    const month=document.querySelector('.month');
    const year=document.querySelector('.year');
    const hour=document.querySelector('.hour');
    const minutes=document.querySelector('.minutes');
    //Дата спрямо различните часови зони
    const date=calculateDate(new Date(), fullWeather.timezone);
    //Попълване дата и час
    weekday.innerHTML=weekdays[date.getDay()];
    day.innerHTML=date.getDate();
    month.innerHTML=months[date.getMonth()];
    year.innerHTML=date.getFullYear();
    hour.innerHTML=date.getHours()+':';
    minutes.innerHTML=addZeroIf(date.getMinutes());

    //Основни полета
    const degrees=document.querySelector('.degrees');
    const textWeather=document.querySelector('.current-weather');
    const feelsLike=document.querySelector('.feels-like');
    const weatherIcon=document.querySelector('.weather-icon');
    const container=document.querySelector('.container');

    cityName.innerHTML=`${fullWeather.name}, ${fullWeather.sys.country}`;
    cityName.dataset.lat=fullWeather.coord.lat;
    cityName.dataset.lon=fullWeather.coord.lon;
    degrees.innerHTML=`${eval(unitSystem)(fullWeather.main.temp)}<span>&#176;</span>`;
    textWeather.innerHTML=fullWeather.weather[0].description;
    feelsLike.innerHTML=`Feels like: ${eval(unitSystem)(fullWeather.main.feels_like)}<span>&#176;</span>`;
    weatherIcon.src=`http://openweathermap.org/img/wn/${fullWeather.weather[0].icon}@2x.png`;
    //Определяне цвят за фона спрямо текущото време
    let bgColor;
    let iconWeather=fullWeather.weather[0].icon;
    backgrounds.forEach(bg=>{
        if(iconWeather===bg.icon) bgColor=bg.gradient;
    });
    container.style.backgroundImage=bgColor;
    
    //Допълнителни полета
    const min=document.querySelector('.min');
    const max=document.querySelector('.max');
    const sunrise=document.querySelector('.sunrise');
    const sunset=document.querySelector('.sunset');
    const humidity=document.querySelector('.humidity');
    const pressure=document.querySelector('.pressure');
    const cloudiness=document.querySelector('.cloudiness');
    const windspeed=document.querySelector('.windspeed');

    //Минимална и максимална температура
    min.innerHTML=`Minimum: ${eval(unitSystem)(fullWeather.main.temp_min)}<span>&#176;</span>`;
    max.innerHTML=`Maximum: ${eval(unitSystem)(fullWeather.main.temp_max)}<span>&#176;</span>`;
    //Изгрев и залез на слънцето
    let rise=calculateDate(new Date(fullWeather.sys.sunrise*MILLISECONDS_IN_1_SECOND), fullWeather.timezone);
    sunrise.innerHTML=`Sunrise: ${rise.getHours()}:${addZeroIf(rise.getMinutes())}h`;
    let down=calculateDate(new Date(fullWeather.sys.sunset*MILLISECONDS_IN_1_SECOND), fullWeather.timezone);
    sunset.innerHTML=`Sunset: ${down.getHours()}:${addZeroIf(down.getMinutes())}h`;
    //Допълнителни данни
    humidity.innerHTML=`Humidity: '${fullWeather.main.humidity}%`;
    pressure.innerHTML=`Pressure: ${fullWeather.main.pressure}hPa-`;
    cloudiness.innerHTML=`Cloudiness: ${fullWeather.clouds.all}%`;
    windspeed.innerHTML=`Wind: ${Math.floor(fullWeather.wind.speed*3.6)}km/h`;//от m/s в km/h, като умножим по 3.6
};

//Изпращане заявка до API с координатите на локацията
const fetchWeather=(lat, lon)=>{
    fetch(`${baseURL}lat=${lat}&lon=${lon}&appid=${apikey}`)
    .then(response =>{
        return response.json();        
    }).then(data=>{
            searchedCities.push(data);//добавяне на локацията в масива с търсените градове
            showWeather(data);
    });
}

//Проверяване дали избраната локация присъства в списъка с търсени градове
const checkSelectedCity=(searchedCities, lat, lon)=>{
    if(searchedCities.length>0){
        let check=false;
        searchedCities.forEach((city, index)=>{
            if(city.coord.lat==roundDecimal(lat) && city.coord.lon==roundDecimal(lon)){
                let date=Math.floor(calculateDate(new Date(), city.timezone).getTime()/MILLISECONDS_IN_1_SECOND);//датата в секунди, за да са в един формат с датата от API
                let oldDate=city.dt;
                if((date-oldDate)>SECONDS_IN_30_MINS)
                {
                    setTimeout(()=>{
                        fetchWeather(lat, lon);
                        searchedCities.splice(index, 1);//изтрива предишните данни за локацията в масива, т.к. е добавена наново
                    }, 1000);
                }
                showWeather(city);
                check=true;
            }
        });
        if(!check){
            fetchWeather(lat, lon);
        }
    }else{
        fetchWeather(lat, lon);
    }
}

//Координати от текуща локация на устройството
const currentLocationWeather=()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
            let lat=position.coords.latitude;
            let lon=position.coords.longitude;
            checkSelectedCity(searchedCities, lat, lon);
        });
    }else{
        console.log("Geolocation blocked!");
    }
};

//Показване на времето при зареждане на страницата с текущата локация
currentLocationWeather();

//Показване на времето при кликане на бутона за текуща локация
const currentLocation=document.querySelector('.current-location');
currentLocation.addEventListener('click', ()=>{
    currentLocationWeather();
});

//Избиране на локация от search box
const searchBox=document.querySelector('#search');
const suggestionsDiv=document.querySelector('.suggestions');

//Избиране от предишно търсени градове (масив searchedCities)
searchBox.addEventListener('click', ()=>{
    suggestionsDiv.innerHTML='';
    if(searchedCities.length>0 && searchBox.value===''){
        suggestionsDiv.innerHTML='';
        let num=searchedCities.length;
        if(searchedCities.length>10) num=10;
        for (let i = searchedCities.length-1; i >=searchedCities.length-num; i--) {
            let divSug=`<div data-lat="${searchedCities[i].coord.lat}" data-lon="${searchedCities[i].coord.lon}"> ${searchedCities[i].name}, ${searchedCities[i].sys.country}</div>`;
            suggestionsDiv.innerHTML+=divSug;
        }
        //Кликане върху локация
        let allSuggestions=suggestionsDiv.querySelectorAll('div');
        clickSuggestion(allSuggestions, searchBox, suggestionsDiv);
        document.addEventListener('click', ()=>{
            suggestionsDiv.innerHTML='';
            searchBox.value=null;
        }, {capture:true});
    }else{
        suggestionsDiv.innerHTML='';
    }
});

//Избиране от всички възможни градове (масив citiesJSON)
searchBox.addEventListener('keyup', ()=>{
    suggestionsDiv.innerHTML='';
    const suggestionCities=citiesJSON[0].filter((city)=>{
        return city.name.toLowerCase().startsWith(searchBox.value.toLowerCase());
    });
    let num=suggestionCities.length;
    if(suggestionCities.length>10) num=10;
    for (let i = 0; i < num; i++) {
        let divSug=`<div data-lat="${suggestionCities[i].coord.lat}" data-lon="${suggestionCities[i].coord.lon}"> ${suggestionCities[i].name}, ${suggestionCities[i].country}</div>`;
        suggestionsDiv.innerHTML+=divSug;
    }
    //Кликане върху предложение за град
    let allSuggestions=suggestionsDiv.querySelectorAll('div');
    clickSuggestion(allSuggestions, searchBox, suggestionsDiv);
    if(searchBox.value===''){
        suggestionsDiv.innerHTML='';
    }
});

//Кликане върху локация
const clickSuggestion=(allSuggestions, searchBox, suggestionsDiv)=>{
    allSuggestions.forEach(suggestion=>{
        suggestion.addEventListener('click', ()=>{
            let lat=suggestion.dataset.lat;
            let lon=suggestion.dataset.lon;
            checkSelectedCity(searchedCities, lat, lon);
            searchBox.value=null;
            suggestionsDiv.innerHTML='';
        });
    });
}

//Попълване градовете, от които може да се избира в масив citiesJSON
const fillCitiesJSON=()=>{
    fetch("./city.list.json/city.list.json")
.then(response => {
   return response.json();
})
.then(data => {
    citiesJSON.push(data);
});}
fillCitiesJSON();

//Избор на температурна скала (в началото е Целзий, от API връща Келвин)
let unitSystem='toCelsius';
const dropdown=document.querySelector('#dropdown');
dropdown.addEventListener('change', ()=>{
    unitSystem=dropdown.options[dropdown.options.selectedIndex].dataset.unit;
    if(searchedCities.length>0){
        searchedCities.forEach(city=>{
            if(city.coord.lat==roundDecimal(cityName.dataset.lat) && city.coord.lon==roundDecimal(cityName.dataset.lon)){
                showWeather(city);
            }
        });
    }
});