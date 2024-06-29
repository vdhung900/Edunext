import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<Home/>}/>
         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
