import { Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Home from './components/home/home';
import Login from './components/login/login';

function App() {
  
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
      {/* <Login />  */}
      
    </div>
  );
}

export default App;