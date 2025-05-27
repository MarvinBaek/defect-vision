import detail from '../assets/ic_right arrow.png';

const Button = ({ onClick, children, outline = false, disabled, detailPressed }) => {
  const className = outline ? 'common-button-outline' : 'common-button-normal';

  return (
    <>
      {outline ? (
        <button className={className} onClick={onClick}>
          {children}
          <img src={detail} className={`rotatable ${detailPressed ? 'rotated' : ''}`} />
        </button>
      ) : (
        <button className={className} onClick={onClick} disabled={disabled}>
          {children}
        </button>
      )}
    </>
  );
};

export default Button;
