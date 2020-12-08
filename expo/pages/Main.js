import React from 'react';
import { Dimensions, StatusBar } from 'react-native';
import styled, { css } from 'styled-components';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import WrappedText from 'react-native-wrapped-text';

import numberWithCommas from 'helpers/number-with-commas';

import PartnerItem from 'components/PartnerItem';
import Popup from 'components/Popup';

import DummyPartners from 'DummyPartners';

const statusBarHeight = Constants.statusBarHeight;
const { width: screenWidth } = Dimensions.get('window');

const Container = styled.ScrollView`
  flex: 1;
  margin-top: ${statusBarHeight}px;
`;

const Nav = styled.View`
  flex-direction: row;
  align-items: center;
  height: 60px;
  margin-bottom: 40px;
  padding: 0 20px;
  background-color: #fff;
`;

const Logo = styled.Image`
  height: 32px;
  margin-right: auto;
`;

const NavButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 20px;
  border-radius: 16px;
  background-color: #F7F8FA;
`;

const NavButtonIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const ASPCard = styled.View`
  margin: 0 20px 20px 20px;
  padding: 20px 28px;
  border-radius: 46px;
  background-color: #F7F8FA;
`;

const ASPCardNav = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ASPCardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
  color: #1F2E44;
`;

const ASPCardIndicator = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ASPCardIndicatorText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  padding-bottom: 4px;
  color: #1F2E44;
`;

const ASPCardIndicatorIcon = styled.Image`
  width: 16px;
  height: 16px;
`;

const ASPCardPoint = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const ASPCardPointText = styled.Text`
  font-weight: bold;
  font-size: 46px;
  line-height: 69px;
  color: #1F2E44;
`;

const ASPCardPointImage = styled.Image`
  width: 37px;
  height: 58px;
`;

const Contents = styled.View`
  margin-top: 20px;
`;

const ContentsHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

const ContentsTitle = styled.Text`
  font-weight: bold;
  font-size: 24px;
  line-height: 36px;
  color: #1F2E44;
`;

const ContentsRefreshButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #F7F8FA;  
`;

const ContentsRefreshButtonIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const CategoryList = styled.FlatList`
  margin: 20px 0;
`;

const CategoryButton = styled.TouchableOpacity`
  justify-content: center;
  height: 44px;
  margin-right: 10px;
  padding: 0 20px;
  border-radius: 18px;
  background-color: #F7F8FA;;

  ${props => props.active && css`
    background-color: #4886FD;
  `}
  ${props => props.first && css`
    margin-left: 20px;
  `}
`;

const CategoryButtonText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: #48596D;
  ${props => props.active && css`
    color: #fff;
  `}
`;

const ExchangePopup = styled.View``;

const ExchangePopupContents = styled.View`
  padding: 20px;
`;

const ExchangePopupHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  border-radius: 46px;
  background-color: #F7F8FA;
`;

const ExchangePopupHeaderImage = styled.Image`
  width: 75px;
  height: 75px;
  border-radius: 32px;
`;

const ExchangePopupHeaderContents = styled.View`
  flex: 1;
  margin-left: 20px;
`;

const ExchangePopupTitle = styled.Text`
  font-weight: bold;
  font-size: 24px;
  line-height: 36px;
  color: #1F2E44;
`;

const ExchangePopupSubTitle = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: #1F2E44;
  opacity: 0.4;
`;

const ExchangePopupFooter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;

const CancelButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: ${(screenWidth - 90) / 2}px;
  height: 64px;
  border-radius: 16px;
  background-color: #F7F8FA;
`;

const CancelButtonText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: #FF124B;
`;

const ConfrimButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: ${(screenWidth - 90) / 2}px;
  height: 64px;
  border-radius: 16px;
  background-color: #4886FD;
`;

const ConfrimButtonText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: #fff;
`;

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      currentPoint: 0,
      isVisible: false,
      partners: JSON.parse(JSON.stringify(DummyPartners)),
      currentPatner: null,
    };
  }

  componentDidMount = () => {
    this.refresh();
  }

  _renderCateogryItem = ({ item, index }) => {
    return (
      <CategoryButton key={index} first={index === 0} active={index === 0}>
        <CategoryButtonText active={index === 0}>{item}</CategoryButtonText>
      </CategoryButton>
    );
  }

  openPopup = (partner) => {
    this.setState({ currentPatner: partner, isVisible: true });
  }

  closePopup = () => {
    this.setState({ isVisible: false, currentPatner: null });
  }

  exchange = () => {
    const { currentPatner } = this.state;
    const currentPoint = this.state.currentPoint + currentPatner.point;
    const targetIndex = this.state.partners.findIndex(p => p.name === currentPatner.name);
    const changedPartners = [...this.state.partners];
    changedPartners[targetIndex].point = 0;
    this.setState({
      currentPoint,
      partners: changedPartners,
    });
    this.closePopup();
  }

  refresh = () => {
    const partners = DummyPartners.map((partner) => {
      const point = Math.floor(Math.random() * (5000 - 400 + 1)) + 400;
      partner.point = point;
      return partner
    })
    this.setState({ partners: JSON.parse(JSON.stringify(partners)) });
  }

  render() {
    const currentPoint = !!this.state.currentPatner && numberWithCommas(Math.round((this.state.currentPatner.point * 10) / 8) || 0);
    const currentPartnerName = !!this.state.currentPatner && this.state.currentPatner.name;
    const currentASP = !!this.state.currentPatner && numberWithCommas(this.state.currentPatner.point || 0);
    const displayExchangePoint = `${currentPartnerName} ${currentPoint} 포인트를 ${currentASP} ASP로 전환하시겠습니까?`;

    return (
      <Container stickyHeaderIndices={[1]} contentContainerStyle={{ paddingTop: 20 }}>
        <StatusBar barStyle="dark-content" backgroundColor='transparent' translucent={true} />
        <Nav>
          <Logo source={require('assets/logo.png')} />
          <NavButton>
            <NavButtonIcon source={require('assets/search.png')} />
          </NavButton>
          <NavButton>
            <NavButtonIcon source={require('assets/user.png')} />
          </NavButton>
        </Nav>
        <ASPCard>
          <ASPCardNav>
            <ASPCardTitle>MY ASP</ASPCardTitle>
            <ASPCardIndicator>
              <ASPCardIndicatorText>exchange</ASPCardIndicatorText>
              <ASPCardIndicatorIcon source={require('assets/chevron-right.png')} />
            </ASPCardIndicator>
          </ASPCardNav>
          <ASPCardPoint>
            <ASPCardPointText>{numberWithCommas(this.state.currentPoint)}</ASPCardPointText>
            <ASPCardPointImage source={require('assets/point.png')} />
          </ASPCardPoint>
        </ASPCard>
        <Contents>
          <ContentsHeader>
            <ContentsTitle>Assemble Partners</ContentsTitle>
            <ContentsRefreshButton onPress={this.refresh}>
              <ContentsRefreshButtonIcon source={require('assets/update.png')} />
            </ContentsRefreshButton>
          </ContentsHeader>
          <CategoryList
            data={['패션', '뷰티', '리빙', '푸드', '컬쳐']}
            renderItem={(params) => this._renderCateogryItem(params)}
            keyExtractor={(item, index) => `${index}`}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
          {
            this.state.partners.map((partner, index) => (
              <PartnerItem
                key={index}
                partner={partner}
                exchange={() => this.openPopup(partner)}
                onPress={() => WebBrowser.openBrowserAsync(partner.url, { controlsColor: '#000' })}
              />
            ))
          }
        </Contents>

        <ExchangePopup as={Popup}
          isVisible={this.state.isVisible}
          close={this.closePopup}
        >
          {!!this.state.currentPatner && <ExchangePopupContents>
            <ExchangePopupHeader>
              <ExchangePopupHeaderImage source={{ uri: this.state.currentPatner.image }}/>
              <ExchangePopupHeaderContents>
                <ExchangePopupTitle>{this.state.currentPatner.name}</ExchangePopupTitle>
                <ExchangePopupSubTitle>{this.state.currentPatner.domain}</ExchangePopupSubTitle>
              </ExchangePopupHeaderContents>
            </ExchangePopupHeader>
            <WrappedText
              containerStyle={{ marginTop: 30 }}
              textStyle={{ fontWeight: 'bold', fontSize: 16, lineHeight: 24, color: '#48596D' }}
              rowWrapperStyle={{ justifyContent: 'center' }}
            >
              {displayExchangePoint}
            </WrappedText>
            <ExchangePopupFooter>
              <CancelButton onPress={this.closePopup}>
                <CancelButtonText>취소하기</CancelButtonText>
              </CancelButton>
              <ConfrimButton onPress={this.exchange}>
                <ConfrimButtonText>전환하기</ConfrimButtonText>
              </ConfrimButton>
            </ExchangePopupFooter>
          </ExchangePopupContents>}
        </ExchangePopup>
      </Container>
    );
  }
}
