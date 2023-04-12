import { Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Home from './components/home/home';
import Login from './components/login/login';
import SetItem from './components/setItem/setItem';
import SendPlacetable from './components/itemtable/sendPlacetable';
import ItemTable from './components/itemtable/itemTable';
import ColorTable from './components/itemtable/colorTable';
import HomePaid from './components/home/homePaid';
import HomeTopay from './components/home/homeTopay';


function App() {

  return (
    <div>
      <Header />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/paid' element={<HomePaid />} />
        <Route path='/topay' element={<HomeTopay />} />
        
          <Route path='/setting/items' element={<ItemTable />} />
          <Route path='/setting/color' element={<ColorTable />} />
          <Route path='/setting/sendplace' element={<SendPlacetable />} />
        
      </Routes>
      {/* <Login />  */}

    </div>
  );
}

export default App;