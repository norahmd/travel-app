/* Global Variables */
const baseUrl = 'http://api.geonames.org/searchJSON?'
const username = '&username=norahmd'

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

const generateBtn = document.getElementById('generate')


generateBtn.addEventListener('click', generateData)

function generateData(e){
    const city = document.getElementById('city').value
    const travelDate = document.getElementById('travelDate').value

    if(city){


        getPlaceFromApi(`${baseUrl}q=${city}${username}`)
        .then(function(data){
            console.log(data.geonames[0].countryName)
            postDataToServer('http://localhost:8081/set-place', {
                place: `${city}, ${data.geonames[0].countryName}`,
                lat: data.geonames[0].lat,
                lng: data.geonames[0].lng,
                travelDate: new Date(travelDate)
            })
            .then(
                reflectData()
            )
        })
    }
}

const getPlaceFromApi = async (url)=>{

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
        const newData = await res.json();
            return newData;
      }catch(error) {
      console.log("error", error);
      }
}

const reflectData = async () => {

    const request = await fetch('http://localhost:8081/get-place');
    try{
      const data = await request.json();
      console.log(data.travelDate)
      console.log(d)


      document.getElementById('date').innerHTML = data.place;
      document.getElementById('temp').innerHTML = data.lat;
      document.getElementById('content').innerHTML = data.lng;

      var duration = new Date(data.travelDate).getTime() - d.getTime(); // The unit is millisecond
      var hourDiff = parseInt(duration /  (1000 * 3600 * 24))

      document.getElementById('content').innerHTML = hourDiff;

  
    }catch(error){
      console.log("error", error);
    }
  }

  export { generateData, generateBtn }