import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Question from './pages/Question';
import Login from './pages/Login';
import Assignment from './pages/Assignment'
import CourseDetail from './pages/CourseDetail';
import List_Assignment from './pages/List_Assignment';
import SettingSlot from './pages/SettingSlot';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Home />} />
          <Route path='/assignment/:id' element={<Assignment />} />
          <Route path="/question/:id/:subid/:slotid" element={<Question />} />
          <Route path='/login' element={<Login />} />
          <Route path='/course/:id' element={<CourseDetail />} />
          <Route path='/assignment' element={<List_Assignment />} />
          <Route path='/setSlot/:uid/:sid/:subid' element={<SettingSlot/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
