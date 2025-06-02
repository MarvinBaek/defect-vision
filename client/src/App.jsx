import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadScreen from './pages/Upload';
import ResultScreen from './pages/Result';
import NotFound from './pages/NotFound';
import './App.css';
import { ImageProvider } from './context/ImageContext';
import VideoResultScreen from './pages/VideoResult';

function App() {
  return (
    <ImageProvider>
      <Router>
        <Routes>
          <Route path='/' element={<UploadScreen />} />
          <Route path='/result' element={<ResultScreen />} />
          <Route path='/videoresult' element={<VideoResultScreen />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </ImageProvider>
  );
}

export default App;
