import { useState, useEffect } from "react";
import countryService from "./services/countries";
import weatherService from "./services/weather";

const ErrorMessage = ({ error }) => <p>{error}</p>;

const CountryListing = ({ countries, setQuery }) => {
    const selectCountry = (name) => {
        setQuery(name);
    };

    return (
        <div>
            {countries.map((country) => (
                <div key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => selectCountry(country.name.common)}>
                        show
                    </button>
                    <br />
                </div>
            ))}
        </div>
    );
};

const CountryDetail = ({ country }) => {
    const flagStyle = { width: "150px" };

    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area}</p>
            <h3>Languages:</h3>
            <ul>
                {Object.values(country.languages).map((lang) => (
                    <li key={lang}>{lang}</li>
                ))}
            </ul>
            <img src={country.flags.png} style={flagStyle} />

            <WeatherDetail country={country} />
        </div>
    );
};

const WeatherDetail = ({ country }) => {
    const [temp, setTemp] = useState("");
    const [image, setImage] = useState("");
    const [wind, setWind] = useState("");

    useEffect(() => {
        if (!country) {
            setTemp("");
            setImage("");
            setWind("");
        } else {
            weatherService
                .getWeather(
                    country.capitalInfo.latlng[0],
                    country.capitalInfo.latlng[1]
                )
                .then((res) => {
                    setTemp(res.data.main.temp);
                    setImage(res.data.weather[0].icon);
                    setWind(res.data.wind.speed);
                });
        }
    }, [country]);

    return (
        <div>
            <h2>Weather in {country.capital}</h2>
            <p>temperature {temp} Celcius</p>
            <img src={`https://openweathermap.org/img/wn/${image}@2x.png`} />
            <p>wind {wind} m/s</p>
        </div>
    );
};

function App() {
    const [query, setQuery] = useState("");
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState("");

    // Effect to fetch countries
    useEffect(() => {
        if (query.length === 0) {
            setCountries([]);
            setError("");
            return;
        }

        countryService
            .getAll()
            .then((response) => {
                const filtered = response.data.filter((country) =>
                    country.name.common
                        .toLowerCase()
                        .includes(query.toLowerCase())
                );
                setCountries(filtered);
                setError(
                    filtered.length > 10
                        ? "Too many matches, specify another filter"
                        : ""
                );
            })
            .catch((err) => console.error(err));
    }, [query]);

    return (
        <div>
            <div>
                find countries:{" "}
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            {error && <ErrorMessage error={error} />}
            {!error && countries.length > 1 && (
                <CountryListing countries={countries} setQuery={setQuery} />
            )}
            {!error && countries.length === 1 && (
                <div>
                    <CountryDetail country={countries[0]} />
                </div>
            )}
        </div>
    );
}

export default App;
