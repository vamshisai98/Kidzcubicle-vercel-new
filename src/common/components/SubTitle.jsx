import PropTypes from 'prop-types';

import './SubTitle.scss';

const SubTitle = ({ name }) => {
  return <div className="SubTitle--name">{name}</div>;
};

SubTitle.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SubTitle;
