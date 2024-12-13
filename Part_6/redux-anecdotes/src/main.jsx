import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import anecdotesReducer from './reducers/anecdoteReducer';
import filterReducer from './reducers/filterReducer';
import notificationReducer from './reducers/notificationReducer';


const store = configureStore({
  reducer: combineReducers({
    anecdotes: anecdotesReducer,
    filter: filterReducer,
    notification: notificationReducer
  })
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)