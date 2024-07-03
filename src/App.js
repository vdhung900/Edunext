import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Question from './pages/Question';
import Login from './pages/Login';
import Assignments from './pages/Assignments';
import AssignmentDetail from './components/AssignmentDetail';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path="/question/:id" element={<Question />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/assignments' element={<Assignments/>}/>
            <Route path="/assignments/:id" element={<AssignmentDetail/>}/>

         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
