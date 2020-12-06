import React from 'react';
import PropTypes from 'prop-types';
import 'css-doodle';

class Doodle extends React.Component {
  constructor(props) {
    super(props);

    this.doodleRef = React.createRef();
  }

  componentDidUpdate() {
    this.redraw();
  }

  redraw() {
    this.doodleRef.current.update();
  }

  render() {
    const { seed, name, styleCode, doodleCode } = this.props;

    return (
      <div>
        <style>
          {`
          css-doodle#${name} {
            ${styleCode}
          }
        `}
        </style>

        <css-doodle
          id={name}
          seed={seed}
          use="var(--rule)"
          ref={this.doodleRef}
        >
          {`
            ${doodleCode}
          `}
        </css-doodle>
      </div>
    );
  }
}

Doodle.defaultProps = {
  seed: '0000',
};

Doodle.propTypes = {
  seed: PropTypes.string,
  name: PropTypes.string,
  styleCode: PropTypes.string,
  doodleCode: PropTypes.string,
};

export default Doodle;
