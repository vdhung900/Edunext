import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Question from './pages/Question';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path="/question/:id" element={<Question />} />
         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
