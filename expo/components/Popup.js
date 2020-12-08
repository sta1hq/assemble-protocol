import React from 'react';
import { SafeAreaView, KeyboardAvoidingView } from 'react-native';
import styled from 'styled-components';
import Modal from 'react-native-modal';

const PopupWrapper = styled.View`
  background-color: #fff;
  border-radius: 36px;
`;

export default class Popup extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <Modal
        style={{ margin: 20, justifyContent: 'flex-end' }}
        backdropColor="#000"
        backdropOpacity={0.8}
        isVisible={this.props.isVisible}
        onBackdropPress={this.props.close}
        onBackButtonPress={this.props.close}
        useNativeDriver={true}
      >
        <KeyboardAvoidingView behavior={'padding'}>
          <SafeAreaView>
            <PopupWrapper>
              {children}
            </PopupWrapper>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}