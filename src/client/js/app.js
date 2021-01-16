/* Global Variables */
const pixaBayKey = '19902117-cdeb0ef749ef0fdae1e6a89b3'
const pixaBayUrl = 'https://pixabay.com/api/?'
const weatherApiKey = '571ac465219049acb576209687577563'
const weatherApiUrl = 'https://cors-anywhere.herokuapp.com/https://api.weatherbit.io/v2.0/forecast/daily?'
const baseUrl = 'http://api.geonames.org/searchJSON?'
const username = '&username=norahmd'

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

const generateBtn = document.getElementById('generate')


generateBtn.addEventListener('click', generateData)

function generateData(e){
    const city = document.getElementById('city').value
    const travelDate = new Date(document.getElementById('travelDate').value)
    const returnDate = new Date(document.getElementById('returnDate').value)

    // const dayAfter = new Date(travelDate)
    // dayAfter.setDate(dayAfter.getDate() + 1);
    var newData 

    if(city&&travelDate){

        getInfoFromApi(`${baseUrl}q=${city}${username}`)
        .then(function(data){
            newData = {
                place: `${city}, ${data.geonames[0].countryName}`,
                lat: data.geonames[0].lat,
                lng: data.geonames[0].lng,
                travelDate: travelDate,
                returnDate: returnDate
            }
            return data
        })
        .then((data) => getInfoFromApi(`${weatherApiUrl}city=${city}&country=${data.geonames[0].countryCode}&key=${weatherApiKey}`))
        .then(function(data){
            newData['high_temp'] = data.data[0].high_temp
            newData['low_temp'] = data.data[0].low_temp
        })
        .then(() => getInfoFromApi(`${pixaBayUrl}key=${pixaBayKey}&q=${encodeURIComponent(city)}`))
        .then(function(data){
            newData['photo_url'] = data.hits[0].largeImageURL
            console.log(newData)
        })
        .then(() => postDataToServer('http://localhost:8081/set-place', newData) )
            .then(()=>reflectData())
    }
}


const getInfoFromApi = async (url)=>{
    console.log('function 1 get data from api')
    const res = await fetch(url)
    try{
        const data = await res.json();
        console.log(data)
        return data;
    }catch(error){
        console.log('error', error);
    }
}

const postDataToServer = async (url='', data = {})=>{
    console.log('function 2 set data to server')

    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = res;
            return newData;
      }catch(error) {
      console.log("error", error);
      }
}

const reflectData = async () => {
    console.log('function 3 reflect changes')

    const request = await fetch('http://localhost:8081/get-place');
    try{
      const data = await request.json();
      console.log(data.travelDate)
      console.log(d)


      document.getElementById('date').innerHTML = data.place;
      document.getElementById('temp').innerHTML = data.lat;
      document.getElementById('content').innerHTML = data.lng;

      var duration = new Date(data.travelDate).getTime() - d.getTime();
      var dayDiff = parseInt(duration /  (1000 * 3600 * 24))
      var travelDuration = new Date(data.returnDate).getTime() - new Date(data.travelDate).getTime();
      var travelDurationDays = parseInt(travelDuration /  (1000 * 3600 * 24))
      console.log(travelDurationDays)
      document.getElementById('content').innerHTML = dayDiff;

  
    }catch(error){
      console.log("error", error);
    }
  }

  export { generateData, generateBtn }