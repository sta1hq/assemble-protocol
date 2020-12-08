import React from 'react'
import styled from 'styled-components';

import numberWithCommas from 'helpers/number-with-commas';

const PartnerItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: 96px;
  padding: 0 20px;
`;

const PartnerItemImage = styled.Image`
  width: 75px;
  height: 75px;
  border-radius: 32px;
`;

const PartnerItemContents = styled.View`
  flex: 1;
  margin-left: 20px;
`;

const PartnerItemName = styled.Text`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #1F2E44;
`;

const PartnerItemHostName = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: #48596D;
  opacity: 0.6;
`;

const PartnerItemFooter = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
`;

const PartnerItemPoint = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PartnerItemPointText = styled.Text`
  font-weight: bold;
  font-size: 18px;
  line-height: 27px;
  color: #1F2E44;
`;

const PartnerItemPointImage = styled.Image`
  height: 27px;
`;

const ExchangeButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 20px;
  border-radius: 10px;
  background-color: #F7F8FA;
`;

const ExchangeButtonIcon = styled.Image`
  width: 16px;
  height: 16px;
`;

export default class PartnerItem extends React.Component {
  render() {
    const { partner } = this.props;

    return (
      <PartnerItemContainer onPress={this.props.onPress}>
        <PartnerItemImage source={{ uri: partner.image }} />
        <PartnerItemContents>
          <PartnerItemName>{partner.name}</PartnerItemName>
          <PartnerItemHostName>{partner.domain}</PartnerItemHostName>
        </PartnerItemContents>
        <PartnerItemFooter>
          <PartnerItemPoint>
            <PartnerItemPointText>{numberWithCommas(partner.point)}</PartnerItemPointText>
            <PartnerItemPointImage source={require('assets/point-small.png')} />
          </PartnerItemPoint>
          <ExchangeButton onPress={this.props.exchange}>
            <ExchangeButtonIcon source={require('assets/refresh.png')} />
          </ExchangeButton>
        </PartnerItemFooter>
      </PartnerItemContainer>
    );
  }
}