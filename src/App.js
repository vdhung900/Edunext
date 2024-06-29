import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Question from './pages/Question';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/question/:id" element={<Question />} />
      </Routes>
    </Router>
  );
}

export default App;
