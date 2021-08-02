import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import 'webgltexture-loader-expo-camera';
import { Surface } from 'gl-react-expo';

import Inkwell from './components/gl-shaders/Inkwell';
import PhotoFix from './components/gl-shaders/PhotoFix';

export default class App extends React.Component {
  state = {
    isCameraReady: false,
    cameraType: Camera.Constants.Type.back,
    photo: null,
  };

  async componentDidMount() {
    Camera.requestPermissionsAsync();
    MediaLibrary.requestPermissionsAsync();
  }

  _onCameraReady = () => {
    this.setState({
      isCameraReady: true
    });
  }

  _onCameraMountError = (error) => {
    console.log(error);
  }

  _onFlipButtonPressed = () => {
    let cameraType = (this.state.cameraType == Camera.Constants.Type.front) 
      ? Camera.Constants.Type.back 
      : Camera.Constants.Type.front;

    this.setState({
      cameraType: cameraType
    });
  }

  _onTakePhotoButtonPressed = async () => {
    try {
      if (!this.camera) {
        return;
      }

      let photo = await this.camera.takePictureAsync({
        options: {
          exif: true
        }
      });

      this.setState({ 
        photo: photo,
      });
    }
    catch (snapshotError) {
      console.error(snapshotError);
    }
  }

  _onReTakePhotoButtonPressed = async () => {
    this.setState({ 
      photo: null,
    });
  }

  _onSavePhotoButtonPressed = async () => {
    if (this.state.photo == null) {
      return;
    }
      
    let photo = await this.snapArea.capture();

    await MediaLibrary.saveToLibraryAsync(photo, 'photo');
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}
          onLayout={(event) => {
            var { width, height } = event.nativeEvent.layout;
            this.surface = {
              width: width,
              height: height
            };
          }}>
          <ViewShot
            style={{flex: 1}}
            ref={(snapArea) => {
              this.snapArea = snapArea;
            }}
            options={{ format: "png" }}
          >
            <View
              style={{flex: 1}}
            >
              <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
                {this.renderPhoto()}
                {this.renderLoadingScreen()}
                {this.renderCamera()}
              </View>
              {this.renderFilter()}
            </View>
          </ViewShot>
        </View>

        <View style={styles.buttonsContainer}>
          {this.renderFlipCameraButton()}
          {this.renderTakePhotoButton()}
          {this.renderReTakePhotoButton()}
          {this.renderSavePhotoButton()}
        </View>
        
      </View>
    );
  }

  renderLoadingScreen() {
    if (this.state.photo != null) {
      return null;
    }

    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.text, { color: 'white' }]}>Loading Camera...</Text>
      </View>
    )
  }

  renderCamera() {
    if (this.state.photo != null) {
      return null;
    }

    return (
      <Camera
        onCameraReady={this._onCameraReady}
        onMountError={this._onCameraMountError}
        style={{
          flex: 1
        }}
        type={this.state.cameraType}
        ref={ref => {
          this.camera = ref;
        }}
      />
    );
  }

  renderFlipCameraButton() {
    if (this.state.photo != null) {
      return null;
    }

    return (
      <TouchableOpacity 
        disabled={!this.state.isCameraReady}
        onPress={this._onFlipButtonPressed}
      >
        <Ionicons
          name="camera-reverse"
          color="#006175"
          size={30}
        />
      </TouchableOpacity>
    )
  }

  renderTakePhotoButton() {
    if (this.state.photo != null) {
      return null;
    }

    return (
      <TouchableOpacity 
        disabled={!this.state.isCameraReady}
        onPress={this._onTakePhotoButtonPressed}
      >
        <Ionicons
          name="camera"
          color="#006175"
          size={30}
        />
      </TouchableOpacity>
    )
  }

  renderReTakePhotoButton() {
    if (this.state.photo == null) {
      return null;
    }

    return (
      <TouchableOpacity 
        disabled={!this.state.isCameraReady}
        onPress={this._onReTakePhotoButtonPressed}
      >
        <Ionicons
          name="refresh-circle"
          color="#006175"
          size={30}
        />
      </TouchableOpacity>
    )
  }

  renderSavePhotoButton() {
    if (this.state.photo == null) {
      return null;
    }

    return (
      <TouchableOpacity 
        disabled={!this.state.isCameraReady}
        onPress={this._onSavePhotoButtonPressed}
      >
        <Ionicons
          name="download"
          color="#006175"
          size={30}
        />
      </TouchableOpacity>
    )
  }

  renderPhoto() {
    if (this.state.photo == null) {
      return null;
    }

    let flip = (this.state.cameraType == Camera.Constants.Type.front);

    console.log('this.surface:', this.surface);

    return (
      <Surface 
        style={{ width: this.surface.width, height: this.surface.height }} 
        preload={[this.state.photo]} 
      >
        <Inkwell>
          <PhotoFix flip={flip}>
            {this.state.photo}
          </PhotoFix>
        </Inkwell>
      </Surface>
    )
  }

  renderPhoto2() {
    if (this.state.photo == null) {
      return null;
    }

    let rotate = null;

    if (this.state.cameraPosition == 'front') {
      rotate = { transform: [{ scaleX: -1 }] };
    }

    return (
      <Image source={{ uri: this.state.photo.uri }} style={[{flex: 1}, rotate]} />
    )
  }

  renderFilter() {
    return (
      <Image
        source={require('./assets/images/filter.png')}
        style={styles.filterImage}
      />
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'stretch'
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-evenly'
  },
});
