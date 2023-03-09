
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Video from './Video';


function App() {
  return (<Routes>
    <Route exact path="/" element={<Dashboard />} />
    <Route exact path="/join" element={<Video />} />
  </Routes>);
}

export default App;