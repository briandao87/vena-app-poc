import React, { Component } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";

export default class AzureLoginView extends Component {
  constructor(props) {
    super(props);
    // this.loginUrl = 'http://localhost:3000/mobile-login';

    this.state = {
      visible: true,
      cancelled: false,
    };

    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(event) {
    const authData = JSON.parse(event.nativeEvent.data);
    console.log('BUGATINO', authData);
    
    this.setState({ visible: false });

    // call success handler
    this.props.onSuccess(authData);
  }

  _renderLoadingView() {
    return this.props.loadingView === undefined ? (
      <View
        style={[
          this.props.style,
          styles.loadingView,
          {
            flex: 1,
            alignSelf: "stretch",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          },
        ]}
      >
        <Text>{this.props.loadingMessage}</Text>
      </View>
    ) : (
      this.props.loadingView
    );
  }

  render() {
    let js = `document.getElementsByTagName('body')[0].style.height = '${
      Dimensions.get("window").height
    }px';`;
    return this.state.visible ? (
      <WebView
        automaticallyAdjustContentInsets={true}
        useWebKit={true}
        style={[
          this.props.style,
          styles.webView,
          {
            flex: 1,
            alignSelf: "stretch",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          },
        ]}
        source={{ uri: this.props.loginUrl }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={this.handleMessage}
        decelerationRate="normal"
        javaScriptEnabledAndroid={true}
        onShouldStartLoadWithRequest={(e) => {
          return true;
        }}
        startInLoadingState={true}
        injectedJavaScript={js}
        scalesPageToFit={true}
      />
    ) : (
      this._renderLoadingView()
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    marginTop: 50,
  },
  loadingView: {
    alignItems: "center",
    justifyContent: "center",
  },
});
