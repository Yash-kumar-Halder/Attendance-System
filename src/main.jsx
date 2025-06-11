import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { persistor, store } from "./Redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import axios from 'axios';

axios.defaults.baseURL = "https://attendance-system-backend-gamma.vercel.app/api/v1"


createRoot(document.getElementById('root')).render(
        <Provider store={store} >
            <PersistGate loading={null} persistor={persistor}>
            <App />
            </PersistGate>
        </Provider>
)
