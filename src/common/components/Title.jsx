import PropTypes from 'prop-types';
import './Title.scss';

const Title = ({ name }) => {
  return <div className="Title--name">{name}</div>;
};

Title.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Title;
