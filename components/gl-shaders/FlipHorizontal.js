import React from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { GLSL, Shaders, Node } from 'gl-react';

const shaders = Shaders.create({
  FlipHorizontal: {
    frag: `
    precision highp float;

    varying vec2 uv;
    uniform sampler2D t;
    uniform bool enabled;

    void main(){
      if (enabled) {
        gl_FragColor=texture2D(t, vec2(1.0 - uv.x, uv.y));
      } else {
        gl_FragColor=texture2D(t, vec2(uv.x, uv.y));
      }
    }
    `,
  }
});

const { width: winWidth, height: winHeight } = Dimensions.get('window');

const FlipHorizontal = ({ children: t, enabled }) =>
  (<Node
    shader={shaders.FlipHorizontal}
    uniforms={{
      t: t,
      enabled: enabled
    }}
  />);

FlipHorizontal.propTypes = {
  children: PropTypes.object.isRequired,
};

export default FlipHorizontal;