const apiKey = "905df42c041077783d94e471ff9c346c";
const BODY = document.querySelector("body");
let buscar = document.querySelector("#buscar");
buscar.addEventListener("click", () => {
  let localizacion = document.querySelector("#inputLocalizacion").value;
  let consulta = `https://api.openweathermap.org/data/2.5/weather?q=${localizacion}&appid=${apiKey}&lang=ES`;
  fetch(consulta)
    .then((response) => {
      return response.json();
    })
    .then((weatherData) => {
      return tiempoActual(weatherData);
    })
    .then((coordenadas) => {
      return estimacion7Dias(coordenadas);
    }).then(coordenadas =>{
      proximas24Horas(coordenadas);
    })
});
let input = document.querySelector('#inputLocalizacion');
input.addEventListener('focus',()=>{
  let tiempoActual = document.querySelector('#tiempoActual');
  let estimacion7Dias = document.querySelector('#estimacion7Dias');
  let proximas24Horas = document.querySelector('#proximas24Horas');
  if (tiempoActual)
    tiempoActual.remove();
  if(estimacion7Dias)
    estimacion7Dias.remove();
  if(proximas24Horas)
    proximas24Horas.remove();
})

function kelvinToCelsius(temp) {
  return Math.round((temp - 273.5) * 100) / 100;
}

function tiempoActual(json) {
  //console.log(json);
  let estado = json.weather[0].description;
  let temp = kelvinToCelsius(json.main.temp);
  let tempMax = kelvinToCelsius(json.main.temp_max);
  let tempMin = kelvinToCelsius(json.main.temp_min);
  let viento = json.wind.speed;
  let nubes = json.clouds.all;
  let coordenadas = [json.coord.lat, json.coord.lon];

  //let lluvia = json.rain["1h"];
  /*console.log("estado: ", estado,"temperatura: ", temp,"máxima: ", tempMax,"mínima: ", tempMin,
    "viento: ",viento, "nubes: ", nubes, "lluvia: ", lluvia);*/

  //Creación de elementos
  let contenedor = document.createElement("div");
  contenedor.id = "tiempoActual";
  BODY.appendChild(contenedor);

  let h2 = document.createElement("h2");
  h2.id = "tiempoActualH2";
  h2.innerText="Tiempo Actual";
  contenedor.appendChild(h2);

  let divEstado = document.createElement("div");
  divEstado.id = "div";
  divEstado.innerText = "Estado: " + estado;
  contenedor.appendChild(divEstado);

  let divTemp = document.createElement("div");
  divTemp.id = "div";
  contenedor.appendChild(divTemp);
  divTemp.innerText = "Temperatura: " + temp + "Cº";

  let divTempMax = document.createElement("div");
  divTempMax.id = "div";
  contenedor.appendChild(divTempMax);
  divTempMax.innerText = "Temperatura máxima: " + tempMax + "Cº";

  let divTempMin = document.createElement("div");
  divTempMin.id = "div";
  contenedor.appendChild(divTempMin);
  divTempMin.innerText = "Temperatura mínima: " + tempMin + "Cº";

  let divViento = document.createElement("div");
  divViento.id = "div";
  contenedor.appendChild(divViento);
  divViento.innerText = "Viento: " + viento + " m/s";

  let divNubes = document.createElement("div");
  divNubes.id = "div";
  contenedor.appendChild(divNubes);
  divNubes.innerText = "Abundacia de nubes: " + nubes + "%";

  /*let divLluvia = document.createElement("div");
    divLluvia.id="div";
    contenedor.appendChild(divLluvia);
    divLluvia.innerText="Lluvia última hora: "+lluvia+"mm";*/
  return coordenadas;
}

function estimacion7Dias(coordenadas) {
  let consulta = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordenadas[0]}&lon=${coordenadas[1]}&appid=${apiKey}`;
  fetch(consulta)
    .then((response) => {
      return response.json();
    })
    .then((weatherData) => {
      //console.log(weatherData);
      let contenedor = document.createElement("div");
      contenedor.id = "estimacion7Dias";
      BODY.appendChild(contenedor);

      let h2 = document.createElement("h2");
      h2.id = "estimacion7diasH2";
      h2.innerText="Estimación Próximos 7 Días";
      contenedor.appendChild(h2);

      let arrayDays=weatherData.daily;
      let contador = 1;
      arrayDays.map(element=>{
        let div = document.createElement("div");
        div.id ="div"+contador;
        div.innerText="Tiempo (hoy+"+contador+"): "+element.weather[0].main;
        contenedor.appendChild(div);
        contador++;
      });
    });
    return coordenadas;
}

function proximas24Horas(coordenadas){
  let consulta = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordenadas[0]}&lon=${coordenadas[1]}&appid=${apiKey}`;
  fetch(consulta)
    .then((response) => {
      return response.json();
    })
    .then((weatherData) => {
      //console.log(weatherData);
      let contenedor = document.createElement("div");
      contenedor.id = "proximas24Horas";
      BODY.appendChild(contenedor);

      let h2 = document.createElement("h2");
      h2.id = "24HorasH2";
      h2.innerText="Temperatura Próximas 24 Horas";
      contenedor.appendChild(h2);

      let arrayHoras=weatherData.hourly;
      let contador = 1;
      arrayHoras.map(element=>{
        if(contador<25){
          let div = document.createElement("div");
          div.id ="div"+contador;
          div.innerText="Tiempo (ahora+"+contador+"): "+kelvinToCelsius(element.temp)+"Cº";
          contenedor.appendChild(div);
          contador++;
        }
      });
    });
}
