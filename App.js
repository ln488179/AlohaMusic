import React, { Component } from 'react';
//import { Audio } from 'expo';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

import ukulele from './assets/ukulele.png'
import drums from './assets/drums.png'

export default class App extends Component {
  state = {
    isPlayingU: false,
    isPlayingD: false,
    playbackInstance: null,
    volume: 1.0,
    filePath: './music/ukulele.mp3',
    isBuffering: false,
  }
  
	async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    this.setState({
      filePath: './music/ukulele.mp3',
    });
    this.loadAudio();
  }

  handlePlayPauseU = async () => {
    let { isPlayingU, playbackInstance } = this.state;

    if (playbackInstance) {
      await playbackInstance.unloadAsync();

      playbackInstance = new Audio.Sound();
      const source = require('./music/ukulele.mp3');
		  const status = {
			  shouldPlay: this.state.isPlayingD,
			  volume: this.state.volume,
      };

      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      await playbackInstance.loadAsync(source, status, false);
      await playbackInstance.playAsync();
      
      isPlayingU ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();

      this.setState({
        playbackInstance,
        isPlayingU: !isPlayingU,
      });
    }
  }

  handlePlayPauseD = async () => {
    let { isPlayingD, playbackInstance } = this.state;

    if (playbackInstance) {
      await playbackInstance.unloadAsync();

      playbackInstance = new Audio.Sound();
      const source = require('./music/drums.mp3');
		  const status = {
			  shouldPlay: this.state.isPlayingD,
			  volume: this.state.volume,
      };

      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      await playbackInstance.loadAsync(source, status, false);
      await playbackInstance.playAsync();
      
      isPlayingD ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();

      this.setState({
        playbackInstance,
        isPlayingD: !isPlayingD,
      });
    }

  }
  
  onPlaybackStatusUpdate = (status) => {
    this.setState({
      isBuffering: status.isBuffering
    });
  }

  async loadAudio() {
    const playbackInstance = new Audio.Sound();
    const source = require('./music/ukulele.mp3');
		const status = {
			shouldPlay: this.state.isPlayingU,
			volume: this.state.volume,
    };
    playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
    await playbackInstance.loadAsync(source, status, false);
    this.setState({
      playbackInstance
    });
  } 


  render() {
    return (
      <View style={styles.container}>

      <View style={styles.containerHeader}>

        <Text style={styles.header}>
          Aloha Music
        </Text>
        </View>

        <View style={styles.containerBody}>
          <Image style={styles.image} source={ukulele} />
          <TouchableOpacity
            style={styles.control}
            onPress={this.handlePlayPauseU}
          >
            {this.state.isPlayingU ?
              <Feather name="pause" size={32} color="#563822"/> 
              :
              <Feather name="play"  size={32} color="#563822"/>
            }
          </TouchableOpacity>

          <Image style={styles.image} source={drums} />
          <TouchableOpacity
            style={styles.control}
            onPress={this.handlePlayPauseD}
          >
            {this.state.isPlayingD ?
              <Feather name="pause" size={32} color="#563822"/> :
              <Feather name="play"  size={32} color="#563822"/>
            }
          </TouchableOpacity>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerHeader: {
    flex: 1,
    marginTop: 150,
    backgroundColor: '#da9547',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerBody: {
    flex: 18,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: '#563822',
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    width: 350
  },
  image:{
    height: 210,
    width: 350
  },
  control: {
    margin: 20,
  }
});