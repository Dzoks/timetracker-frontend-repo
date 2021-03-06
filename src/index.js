import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware,compose} from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import { ConfigProvider } from 'antd';
import srRS from 'antd/es/locale-provider/sr_RS';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

ReactDOM.render(<Provider store={createStore(reducers,composeEnhancer(applyMiddleware(thunk)))}>
                    <ConfigProvider locale={srRS}>><App /></ConfigProvider>
                </Provider>,
                document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
