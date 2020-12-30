import React from 'react';
import Select from 'react-select';
import moment from 'moment-timezone';
import './App.css';
import { useLocalStorage } from './hooks'

const DATE_TIME_FORMAT = `${moment.HTML5_FMT.DATE} ${moment.HTML5_FMT.TIME}`;
const TIME_FORMAT_WITH_SECONDS = 'LTS';
const TIME_FORMAT = 'LT';
const SECOND = 1000;

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

function timeZoneDiff(a, b) {
  return (moment().tz(a).utcOffset() - moment().tz(b).utcOffset()) / 60
}

function formatHourDiff(num) {
  return `${(num > 0) ? '+' : '-'}${Math.abs(num)}`;
}

function formatLocationName(str) {
  return str.replace(/_/, ' ');
}

function Time({ location, onRemove, currentTimeZone }) {
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
      {!location.isCurrent &&
        <React.Fragment>
          {` ${formatHourDiff(timeZoneDiff(location.timeZone, currentTimeZone))} `}
          <Button
            className="App-location--close"
            text="remove"
            type="secondary"
            onClick={() => onRemove(location)}
          />
        </React.Fragment>
      }
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

function Button({ text, type, className, ...rest }) {
  const btnClassName = `App-button App-button__${type || 'default'} ${className}`;
  return <button className={btnClassName} {...rest}>{text}</button>;
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
      <div className="App-location-input">
        <ZonePickField onChange={handleChange} />
        <Button text="cancel" type="secondary" onClick={() => setEdited(!isEdited)}/>
      </div>
    );
  }
  return <Button text="+" type="secondary" onClick={() => setEdited(!isEdited)}/>;
}

function App() {
  const [locations, setLocations] = useLocalStorage(
    'rmtr--locations_list',
    prepareLocations([getCurrentLocation()])
  );

  const handleAddLocation = (newLocationName) => {
    const newLocations = [
      ...locations,
      createLocation({ timeZone: newLocationName })
    ].sort(
      (tz1, tz2) => moment().tz(tz1.timeZone).utcOffset() - moment().tz(tz2.timeZone).utcOffset()
    );
    console.log(newLocations.map(el => el.timeZone));
    setLocations(newLocations);
  }
  const handleRemoveLocation = (location) => {
    const idx = locations.findIndex((item) => item.timeZone === location.timeZone);
    setLocations([
      ...locations.slice(0, idx),
      ...locations.slice(idx + 1)
    ]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-locations-container">
          {locations.map((item) => (
            <Time
              key={item.timeZone}
              location={item}
              onRemove={handleRemoveLocation}
              currentTimeZone={getCurrentLocation().timeZone}
            />
          ))}
          <AddLocationForm submit={handleAddLocation} />
        </div>
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
