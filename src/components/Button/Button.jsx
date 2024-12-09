import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = React.memo(({ onClick, buttonName, className }) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "px-4 py-2 text-blue-500 border font-bold border-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-auto",
        className
      )}
    >
      {buttonName}
    </button>
  );
});

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  buttonName: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Button.defaultProps = {
  className: '',
};

export default Button;
