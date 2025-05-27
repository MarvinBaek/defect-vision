import { useNavigate } from 'react-router-dom';
import markcloud from '../assets/markcloud.png';
import { useImage } from '../context/ImageContext';

const Header = () => {
  const navigate = useNavigate();
  const { setImage } = useImage();

  return (
    <header>
      <img
        src={markcloud}
        width={'120px'}
        onClick={() => {
          setImage([]);
          navigate('/');
          window.location.reload();
        }}
        style={{ cursor: 'pointer' }}
      />
      <span>부품 불량 판별 솔루션 </span>
    </header>
  );
};

export default Header;
