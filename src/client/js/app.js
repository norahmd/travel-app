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
const body = document.getElementsByTagName('body')[0]


generateBtn.addEventListener('click', generateData)

function generateData(e){
    const city = document.getElementById('city').value
    const travelDate = new Date(document.getElementById('travelDate').value)
    const returnDate = new Date(document.getElementById('returnDate').value)

    var newData 

    if(city&&travelDate){
        body.classList.add('loading')
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
            newData['description'] = data.data[0].weather.description

        })
        .then(() => getInfoFromApi(`${pixaBayUrl}key=${pixaBayKey}&q=${encodeURIComponent(city)}`))
        .then(function(data){
            newData['photo_url'] = data.hits[0].largeImageURL
        })
        .then(() => postDataToServer('http://localhost:8081/set-place', newData) )
            .then(()=>reflectData())
    }
}


const getInfoFromApi = async (url)=>{
    // this function is used to bring data from a given api url
    const res = await fetch(url)
    try{
        const data = await res.json();
        return data;
    }catch(error){
        console.log('error', error);
    }
}

const postDataToServer = async (url='', data = {})=>{

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
// this function is used to bring data from the server then reflect the data on the website
    const request = await fetch('http://localhost:8081/get-place');
    try{
      const data = await request.json();
      var daysUntilTravil = Client.calculateDurationInDays(d, data.travelDate)
      var travelDuration = Client.calculateDurationInDays(data.travelDate, data.returnDate)
        var div = document.getElementsByClassName('main-content')[0]
        var section = document.createElement('section')
        section.classList = 'card'
        var figure = document.createElement('figure')
        var img = document.createElement('img')
        img.src = data.photo_url
        figure.append(img)
        section.append(figure)
        div.prepend(section)
        var heading = document.createElement('h1')
        heading.innerHTML = `My trip to: ${data.place}<br>Departing: ${data.travelDate.slice(0, 10)}`
        var p = document.createElement('p')
        p.innerHTML = `${data.place} is ${daysUntilTravil} days away and lasts for ${travelDuration} days<br>
        <br>Typical weather for then is:<br>
        High: ${data.high_temp} Low: ${data.low_temp}<br>
        ${data.description}`
        section.append(heading, p)
        body.classList.remove('loading')
  
    }catch(error){
      console.log("error", error);
    }
  }

  export { generateData, generateBtn}