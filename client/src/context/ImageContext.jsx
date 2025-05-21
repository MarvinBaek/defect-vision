import { createContext, useContext, useState } from 'react';

// 이미지 배열 전역 상태 관리 Context

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [image, setImage] = useState([]);

  return <ImageContext.Provider value={{ image, setImage }}>{children}</ImageContext.Provider>;
};

// 커스텀 훅
export const useImage = () => useContext(ImageContext);
