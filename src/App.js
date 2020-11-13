import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./component/InfoBox";
import LineGraph from "./component/LineGraph";
import Table from "./component/Table";
import { sortData, prettyPrintStat } from "./component/util";
import numeral from "numeral";
import Map from "./component/Map";
import "leaflet/dist/leaflet.css";


const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryName, setCountryName] = useState("all");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34, lng: 9 });
  const [mapZoom, setMapZoom] = useState(3);



  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };
    const seDefault = ( async()=>{ //on prend les cas dans le monde entier par defaut
      await  fetch("https://disease.sh/v3/covid-19/all")
        .then(response => response.json())
        .then(data => {
          setCountryInfo(data);
        });
      });
    seDefault();

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    if(countryCode === "worldwide"){
      setCountryName('all');
      await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([34,9]);
        setMapZoom(3);
      });
    }
    else{
      setCountryName(countryCode)
      await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(5);
      });
    }
    
  };
  console.log(mapCountries);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Traqueur du COVID-19</h1>
          <FormControl className="app__dropdown">
           <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
            <MenuItem value="worldwide" name="all">Tout le monde</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value} name={country.name}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="app__stats">
        <InfoBox
          onClick={() => setCasesType("cases")}
          title="Cas du Covid-19"
          couleur='rouge'
          active={casesType === "cases"}
          cases={prettyPrintStat(countryInfo.todayCases)}
          total={numeral(countryInfo.cases).format("0.0a")}
        />
        <InfoBox
          onClick={() => setCasesType("recovered")}
          title="Rétabli"
          couleur='vert'
          active={casesType === "recovered"}
          cases={prettyPrintStat(countryInfo.todayRecovered)}
          total={numeral(countryInfo.recovered).format("0.0a")}
        />
        <InfoBox
          onClick={() => setCasesType("deaths")}
          title="Décès"
          couleur='noir'
          active={casesType === "deaths"}
          cases={prettyPrintStat(countryInfo.todayDeaths)}
          total={numeral(countryInfo.deaths).format("0.0a")}
        />
      </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Les Cas Par Pays</h3>
            <Table countries={tableData} />
            <h3>Bilan des nouveaux {casesType==='cases'? 'Cas':casesType=== 'recovered'? 'Rétabli': 'Déces' }</h3>
            <LineGraph casesType={casesType} country={countryName} />
            
          </div>
        </CardContent>
     </Card>
    </div>
  );
};

export default App;
