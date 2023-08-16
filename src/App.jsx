import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { WiSunrise, WiSunset } from "react-icons/wi";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState();
  const [air, setAir] = useState();
  const [airStatusMsg, setAirStatusMsg] = useState("");

  const [airDataModalShow, setAirDataModalShow] = useState(false);

  const fetchWeather = (lat, lon) => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
          import.meta.env.VITE_API_KEY
        }&units=metric`
      )
      .then((response) => {
        setWeather(response.data);
      });
  };
  const fetchAirData = (lat, lon) => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${
          import.meta.env.VITE_API_KEY
        }`
      )
      .then((response) => {
        setAir(response.data);
        setAirStatus(response.data.list[0].main.aqi);
      });
  };

  const setAirStatus = (a) => {
    switch (a) {
      case 1:
        setAirStatusMsg("Good");
        break;
      case 2:
        setAirStatusMsg("Fair");
        break;
      case 3:
        setAirStatusMsg("Moderate");
        break;
      case 4:
        setAirStatusMsg("Poor");
        break;
      case 5:
        setAirStatusMsg("Very Poor");
        break;
      default:
        setAirStatusMsg("N/A");
    }
  };

  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeather(position.coords.latitude, position.coords.longitude);
      fetchAirData(position.coords.latitude, position.coords.longitude);
    });
  };

  const fetchLocationByCity = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/geo/1.0/direct?q=${city}&appid=${
          import.meta.env.VITE_API_KEY
        }`
      )
      .then((response) => {
        fetchWeather(response.data[0].lat, response.data[0].lon);
        fetchAirData(response.data[0].lat, response.data[0].lon);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchLocationByCity();
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  if (weather) {
    return (
      <>
        <div className="container mt-5">
          <div className="row root_box">
            <div className="col-md-4 d-flex flex-column justify-content-around p-5 left_box">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary text-white"
                  type="button"
                  id="button-addon2"
                  onClick={handleSubmit}
                >
                  Search
                </button>
              </div>

              <img
                src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                className="rounded mx-auto d-block"
                alt="..."
              />

              <h4>
                {weather.main.temp}
                <span>&#176;</span>C
              </h4>

              {/* <h4>{moment.unix(weather.dt).format("HH:mm")}</h4> */}

              <hr />

              <h6>{weather.weather[0].main}</h6>
              <h6>{weather.weather[0].description}</h6>
              <h4> {weather.name}</h4>
            </div>
            <div className="col-md-8 p-5 right_box">
              <div className="row g-5">
                <div className="col-md-4">
                  <div className="bg-white child_box p-3">
                    <p className="box_header">Temperature</p>
                    <div style={{ fontSize: "12px" }}>
                      <p>
                        Current: {weather.main.temp}
                        <span>&#176;</span> C
                      </p>
                      <p>
                        Feels Like: {weather.main.feels_like}
                        <span>&#176;</span> C
                      </p>
                      <p>
                        Minimum: {weather.main.temp_min}
                        <span>&#176;</span> C
                      </p>
                      <p>
                        Maximum: {weather.main.temp_max}
                        <span>&#176;</span> C
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-white d-flex flex-column justify-content-around child_box p-3">
                    <p className="box_header">Wind Status</p>

                    <h2>
                      {weather.wind.speed}{" "}
                      <span style={{ fontSize: "12px" }}>m/s</span>
                    </h2>
                    <p>
                      {weather.wind.deg}
                      <span>&#176;</span>
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-white d-flex flex-column justify-content-around child_box p-3">
                    <p className="box_header">Sunrise & Sunset</p>
                    <p>
                      <WiSunrise className="icon" />
                      <span className="p-3">
                        {moment.unix(weather.sys.sunrise).format("HH:mm")}
                      </span>
                    </p>
                    <p>
                      <WiSunset className="icon" />
                      <span className="p-3">
                        {moment.unix(weather.sys.sunset).format("HH:mm")}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-white d-flex flex-column justify-content-around child_box p-3">
                    <p className="box_header">Humidity</p>

                    <h2>
                      {weather.main.humidity}{" "}
                      <span style={{ fontSize: "12px" }}>%</span>
                    </h2>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-white d-flex flex-column justify-content-around child_box p-3">
                    <p className="box_header">Visibility</p>

                    <h2>
                      {weather.visibility / 1000.0}{" "}
                      <span style={{ fontSize: "12px" }}>km</span>
                    </h2>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-white d-flex flex-column justify-content-around child_box p-3">
                    <p className="box_header">Air Quality</p>
                    <h2>{airStatusMsg}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default App;
