import React, { Component } from 'react'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import AddEntry from './components/AddEntry'
import { purple } from './utils/colors'
import Constants from 'expo-constants'
import { createStore } from "redux"
import { Provider } from "react-redux"
import reducer from "./reducers"

function FitStatusBar( { backgroundColor, ...props } ){
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props}/> 
    </View>
  )
}

export default class App extends Component {
  render () {
    return (
      <Provider store={createStore(reducer)}>
        <View style={{flex: 1}}>
          <FitStatusBar backgroundColor={purple}  barStyle='light-content' />
          <AddEntry />
        </View>
      </Provider>
    )
  }
}