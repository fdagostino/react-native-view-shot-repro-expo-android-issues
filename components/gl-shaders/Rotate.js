import React from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { GLSL, Shaders, Node } from 'gl-react';

const shaders = Shaders.create({
  Rotate: {
    frag: `
      precision highp float;

      varying vec2 uv;
      uniform float angle;
      uniform sampler2D t;

      void main () {
        mat2 rotation = mat2(
        cos(angle), -sin(angle),
        sin(angle),  cos(angle)
      );
      vec2 p = (uv - vec2(0.5)) * rotation + vec2(0.5);
      if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0)
        gl_FragColor = vec4(0.0);
      else
        gl_FragColor = texture2D(t, p);
      }
    `
  }
});

const { width: winWidth, height: winHeight } = Dimensions.get('window');

const Rotate = ({ children: t, angle }) =>
  (<Node
    shader={shaders.Rotate}
    uniforms={{
      t: t,
      angle: angle
    }}
  />);

Rotate.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Rotate;