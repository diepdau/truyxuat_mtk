import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './store/reducers/rootReducer.js'

import { AuthContexProvider} from "./asset/service/index.js";
import { SidebarProvider } from '../src/components/Sidebar/SidebarContext.js'; 
const reduxStore=createStore(rootReducer);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={reduxStore}>
    <AuthContexProvider>
     <SidebarProvider>
      <App />
      </SidebarProvider>
     </AuthContexProvider>
    </Provider>
    
  </React.StrictMode>
);


