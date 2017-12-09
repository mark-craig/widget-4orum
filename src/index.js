import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.css';
import 'react-mde/lib/styles/css/react-mde-all.css';
import './mde_styles/demo.scss';
import './pure-min.css';
import './grids-responsive-min.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('4orum'));
registerServiceWorker();
