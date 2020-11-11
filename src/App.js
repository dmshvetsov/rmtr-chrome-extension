import React from 'react';
import Select from 'react-select';
import moment from 'moment-timezone';
import './App.css';

const DATE_TIME_FORMAT = `${moment.HTML5_FMT.DATE} ${moment.HTML5_FMT.TIME}`;
const TIME_FORMAT_WITH_SECONDS = 'LTS';
const TIME_FORMAT = 'LT';
const SECOND = 1000;

const INITIAL_LOCATIONS = [
  getCurrentLocation()
];

function createLocation({ timeZone, isCurrent }) {
  if (!moment.tz.zone(timeZone)) {
    throw new Error(`Wrong time zone ${timeZone}`);
  }

  return {
    timeZone,
    isCurrent
  };
}

function prepareLocations(locations) {
  return locations.filter((item) => item && item.timeZone);
}

function getCurrentLocation() {
  return createLocation({
    timeZone: moment.tz.guess(),
    isCurrent: true
  });
}

function formatLocationName(str) {
  return str.replace(/_/, ' ');
}

function Time({ location }) {
  const [dateTime, setDateTime] = React.useState(moment().tz(location.timeZone));
  React.useEffect(() => {
    const interval = setInterval(
      () => setDateTime(moment().tz(location.timeZone)),
      SECOND
    );
    return () => clearInterval(interval);
  }, [location.timeZone]);
  return (
    <div className="App-location">
      {formatLocationName(location.timeZone)}
      <br/>
      <time
        className="App-time"
        dateTime={dateTime.format(DATE_TIME_FORMAT)}
      >
        {dateTime.format(location.isCurrent ? TIME_FORMAT_WITH_SECONDS : TIME_FORMAT)}
      </time>
    </div>
  );
}

function Button({ text, ...rest }) {
  return <button className="App-button" {...rest}>{text}</button>;
}

function ZonePickField(props) {
  const inputRef = React.useRef(null);
  const options = moment.tz.names().map((timeZoneName) => ({
    value: timeZoneName,
    label: timeZoneName
  }));
  React.useEffect(() => inputRef.current.focus());
  return (
    <Select 
      ref={inputRef}
      placeholder="Type to search"
      menuPlacement="auto"
      menuPosition="fixed"
      options={options}
      isSearchable
      {...props}
    />
  );
}

function AddLocationForm({ submit }) {
  const [isEdited, setEdited] = React.useState(false);

  const handleChange = (option) => {
    submit(option.value);
    setEdited(!isEdited);
  }


  if (isEdited) {
    return (
      <div style={{ width: '350px', textAlign: 'left' }}>
        <ZonePickField onChange={handleChange} />
        <Button text="cancel" onClick={() => setEdited(!isEdited)}/>
      </div>
    );
  }
  return <Button text="+" onClick={() => setEdited(!isEdited)}/>;
}

function App() {
  const [locations, setLocations] = React.useState(
    prepareLocations(INITIAL_LOCATIONS)
  );

  const handleAddLocation = (newLocationName) => {
    setLocations([
      ...locations,
      createLocation({ timeZone: newLocationName })
    ]);
  }

  return (
    <div className="App">
      <header className="App-header">
        {locations.map((item) => <Time key={item.timeZone} location={item} />)}
        <AddLocationForm submit={handleAddLocation} />
      </header>
      <footer className="App-footer">
        <a
          className="App-link App-author"
          href="https://dmitryshvetsov.com/?utm_source=rmtr&utm_medium=chrome-extension"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dmitry Shvetsov
        </a>
      </footer>
    </div>
  );
}

export default App;
