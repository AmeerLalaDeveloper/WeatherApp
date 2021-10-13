const apiKey='51b66d1c18112050011a7e4248fdc8f6'
const cityInput=document.querySelector('#city-name')
const message=document.querySelector('.msg')
const search=document.querySelector('.search-btn')
const currentWeather=document.querySelector('.current-weather')
const sunrise=document.querySelector('.sunrise')
const sunset=document.querySelector('.sunset')
let latitude,longitude;
let userInput=null;
let isDeleted=false;
const cityList=document.querySelector('.city-list')

function handleDeleteBtn(){
    const deleteBtn=document.querySelectorAll('.delete')
    
Array.from(deleteBtn).forEach(button=>{
    button.addEventListener('click',function(e){
         let list_item=e.target.parentElement;
               console.log(e.target.nextElementSibling);
        let key=e.target.nextElementSibling.
        nextElementSibling.textContent.toString()
  
        localStorage.removeItem(key.trim())
          list_item.remove();
     
    })
})
}

async function getWeatherIcon(pngCode){
    const request=(await fetch(`http://openweathermap.org/img/wn/${pngCode}@2x.png`))
 
   return request.url;
}
function timeFromTimeStamp(ts) {

    let date = new Date(ts * 1000);

    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();

    return hours + ':' + minutes.substr(-2);
}

async function getCityByLocation(lat,lon){
      const requestByCor=  await(await fetch(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&appid=${apiKey}`)).json()
        let currCity=requestByCor.list[0].name;
     return currCity
       
}

function setCurrentLocationDetails(response){
    currentWeather.innerHTML=(response.main.temp-273.15).toFixed(2)+`C&#176`;
    sunrise.innerHTML=timeFromTimeStamp(parseInt(response.sys.sunrise))
    sunset.innerHTML=timeFromTimeStamp(parseInt(response.sys.sunset))
}
async function getWeaterData(cityName=null,curr=false){
       
         let img;
         const request=await  (await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)).json()
         
            //if       
            if(curr){
            setCurrentLocationDetails(request)
            }
            //else
     
            else{    
             img=await getWeatherIcon(request.weather[0].icon)
            if(!Object.keys(localStorage).includes(userInput)){
            cityList.innerHTML+=
            `<li>
             <button class="delete">Delete</button>
              <span class="title">  City :</span> <span class="res">${userInput}</span>
               <span class="title"> Temprature :</span><span class="res">${(request.main.temp-273.15).toFixed(2)} C&#176;</span></span>

              <span class="title"> Condition : <img src="${img}" alt="">
             <hr>
            </li>`
                }    
            localStorage.setItem(userInput,(
               JSON.stringify( {
                    temp:(request.main.temp-273.15).toFixed(2)
                   ,png:img
                }
               )
            
            ))

            }

            handleDeleteBtn()
       
            
        
}
function validateUserInput(value){
    return !value.match(/\d/)
}
 function trimInput(input){
     return input.trim()
 }
async function successCallback(position){
     latitude=position.coords.latitude
     longitude=position.coords.longitude
     let city=await getCityByLocation(latitude,longitude);
     getWeaterData(city,true)
    // let latitude=position.latitude
}
function erroCallBack(error){
    message.textContent='You Dont have premission'
}
function firstLetterUpper(userInput){

    return userInput.charAt(0).toUpperCase()+userInput.slice(1)
}
 window.onload=()=>{
     navigator.geolocation.getCurrentPosition(successCallback,erroCallBack);
     let keys=Object.keys(localStorage);
   for(let key in  keys)
    cityList.innerHTML+= 
    `<li>  <button class="delete">Delete</button>
    <span class="title">City :</span><span class="res"> ${keys[key]}</span></br>
     <span class="title">Temprature :</span><span class="res">${JSON.parse(localStorage.getItem(keys[key])).temp} C&#176</span>
     <span class="title"> Condition : </span><img src="${JSON.parse(localStorage.getItem(keys[key])).png}" alt="">
     
     <hr></li>`
    handleDeleteBtn();
 
}
cityInput.addEventListener('keydown',(e)=>{ 
    message.textContent='';
    if(e.keyCode==13)
        search.click()

})
search.addEventListener('click',async ()=>{
    message.textContent=''
    userInput=cityInput.value
    userInput=trimInput(userInput)
    userInput=firstLetterUpper(userInput)
   if(validateUserInput(userInput)){
    await getWeaterData(cityInput.value)
    .catch(err=>message.textContent='No Such City Found')
   }
   else message.textContent='No Such City Found'
})

