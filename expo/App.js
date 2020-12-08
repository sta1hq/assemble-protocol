import React from 'react';
import styled from 'styled-components';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';

import Main from 'pages/Main';

const Container = styled.View`
  position: relative;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const SplashSymbol = styled.Image`
  width: 100px;
  height: 100px;
`;

const SplashLogoWrapper = styled.View`
  position: absolute;
  bottom: 80px;
  align-items: center;
  width: 100%;
`;

const SplashLogo = styled.Image`
  width: 151.19px;
  height: 24px;
`;

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isReady: false,
      isSplashEnd: false,
    };
  }

  componentDidMount = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
  }

  async _cacheResourcesAsync() {
    const images = [require('assets/splash-symbol.png'), require('assets/splash-logo.png')];
    const cacheImages = images.map(image => Asset.fromModule(image).downloadAsync());
    return Promise.all(cacheImages)
  }

  onFinish = () => {
    this.setState({ isReady: true });
    setTimeout(() => this.setState({ isSplashEnd: true }), 2000);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={this.onFinish}
          onError={console.warn}
        />
      );
    } else if (this.state.isReady && !this.state.isSplashEnd) {
      return (
        <Container>
          <SplashSymbol source={require('assets/splash-symbol.png')}/>
          <SplashLogoWrapper>
            <SplashLogo source={require('assets/splash-logo.png')}/>
          </SplashLogoWrapper>
        </Container>
      );
    } else return <Main />;
  }
}
