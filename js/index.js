import condition from "./condition.js"

// elems on page
const apiKey = '06370eb7405f42428ab154655232001'
const header = document.querySelector('.header')
const form = document.querySelector('#form')
const input = document.querySelector('#inputCity')

function removeCard() {
  const prevCard = document.querySelector('.card')
  if (prevCard) prevCard.remove()
} 

function showError(errorMessage){
  const html = `<div class="card">${data.error.message}</div>`

  header.insertAdjacentHTML('afterend', html)

}
function showCard({name,temp,cloud, text,feelslike,humidity,wind,imgPath}) {

  const html = `<div class="card">
                    <h2 class="card-city">${name}</h2>
                    <div class="card-weather">
                      <div class="card-value">${temp}<sup>°c</sup></div>
                      <img class="card-img" src="${imgPath}" alt="Weather"> 
                    </div>
                    <div class="card-description">  ${text} </div>
                    <div class="card-feelslike">Відчувається як: ${feelslike}°c</div>
                    <div class="card-humidity">Вологість: ${humidity}%</div>
                    <div class="card-winds">Вітер: ${wind} км/год</div>
                    </div>`
  header.insertAdjacentHTML('afterend', html)
}
async function getWeather(city) {
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
  const response = await fetch(url)
  const data = await response.json()
  console.log(data);
  return data
}

// слухаємо відправкуформи
form.onsubmit = async function(e) {

// відміняєм відправку форми

  e.preventDefault()

// беремо значення з інпута, обрізаєм пробіли

   let city = input.value.trim()
// беремо данні з серверу  
   const data = await getWeather(city)
  
  if (data.error) {
    removeCard()
    showError(data.error.message)

  } else {
    removeCard()

    console.log(data.current.condition.code);

    const info = condition.find((obj) => obj.code === data.current.condition.code)
    console.log(info);
    console.log(info.languages[32]['day_text']);

    const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/'
    const fileName = (data.current.is_day ? info .day : info.night) + '.png'
    const imgPath = filePath + fileName
    console.log('filePath', filePath + fileName );

    const weatherData = {
      name: data.location.name,
      temp: data.current.temp_c,
      cloud: data.current.cloud,
      text: data.current.is_day
             ? info.languages[32]['day_text']
             : info.languages[32]['night_text'],
             imgPath,
      feelslike: data.current.feelslike_c,
      humidity: data.current.humidity,
      wind: data.current.wind_kph
      }

      showCard(weatherData)
  }
}
