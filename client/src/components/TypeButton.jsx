import { IoCameraOutline, IoVideocamOutline } from 'react-icons/io5';
import { useImage } from '../context/ImageContext';

const TypeButton = ({ onClick, activeTab, type, setActiveTab }) => {
  const isActive = activeTab === type;
  const className = isActive ? 'type-button' : 'type-button-disabled';
  const { setImage } = useImage();

  return (
    <button
      className={className}
      onClick={() => {
        onClick;
        setActiveTab(type);
        setImage([]);
      }}
    >
      {type === 'image' ? <IoCameraOutline size='30' /> : <IoVideocamOutline size='30' />}
      {type === 'image' ? '이미지 판별' : '동영상 판별'}
    </button>
  );
};

export default TypeButton;
