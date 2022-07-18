import './CartButton.scss';

export const generateButton = (buttonText) => {
  return (
  <button className="CartButton" type="button">{buttonText}</button>
  );
};
