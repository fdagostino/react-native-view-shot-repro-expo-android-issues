import React from 'react';
import { 
  View,
} from 'react-native';
import * as Device from 'expo-device';
import Normal from './Normal';
import Rotate from './Rotate';
import FlipHorizontal from './FlipHorizontal';

class PhotoFix extends React.Component {
  render() {
    if (Device.platformApiLevel == null) {
      return (
        <FlipHorizontal enabled={this.props.flip}>
          <Rotate angle={Math.PI / 2}>
            {this.props.children}
          </Rotate>
        </FlipHorizontal>
      )
    } else {
      return (
        <FlipHorizontal enabled={this.props.flip}>
          <Normal>
            {this.props.children}
          </Normal>
        </FlipHorizontal>
      )
    }
  }
}
export default PhotoFix;