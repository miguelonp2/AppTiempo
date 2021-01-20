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
      estimacion7Dias(coordenadas);
    });
});

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
      console.log(weatherData);
      let contenedor = document.createElement("div");
      contenedor.id = "estimacion7Dias";
      BODY.appendChild(contenedor);

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
}
