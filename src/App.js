import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './App.css';

import Home from './components/home/home.component';
import Message from './components/message/message.component';



function App() {
  
  return (
    <Router>
    <div className="App">
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/message" element={<Message/>}/>
        </Routes>
    </div>
    </Router>
  );
}

export default App;
