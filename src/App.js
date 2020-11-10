import React from 'react';
import moment from 'moment-timezone';
import './App.css';

const DATE_TIME_FORMAT = `${moment.HTML5_FMT.DATE} ${moment.HTML5_FMT.TIME}`;
const TIME_FORMAT_WITH_SECONDS = 'LTS';
const TIME_FORMAT = 'LT';

const locations = [
  { timeZone: 'Asia/Vladivostok', isCurrent: true },
  { timeZone: 'Asia/Hong_Kong', isCurrent: false },
  { timeZone: 'America/Toronto', isCurrent: false }
];

function formatLocationName(str) {
  return str.replace(/_/, ' ');
}

function Time({ timeZone, isCurrent }) {
  const [dateTime, setDateTime] = React.useState(moment().tz(timeZone));
  React.useEffect(() => setDateTime(moment().tz(timeZone)), [dateTime]);
  return (
    <div className="App-location">
      {formatLocationName(timeZone)}
      <br/>
      <time
        className="App-time"
        datetime={dateTime.format(DATE_TIME_FORMAT)}
      >
        {dateTime.format(isCurrent ? TIME_FORMAT_WITH_SECONDS : TIME_FORMAT)}
      </time>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {locations.map((item) => <Time {...item} />)}
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
