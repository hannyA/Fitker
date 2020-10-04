import React, { Component } from 'react'
import {View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import FitSlider from './FitSlider'
import FitStepper from './FitStepper'
import DateHeader from './DateHeader'
// import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'
import TextButton from './TextButton'
import {submitEntry, removeEntry } from '../utils/api'
import { connect } from "react-redux"
import { addEntry } from "../actions"
import { purple, white } from '../utils/colors'


function Submitbtn( {onPress}) {
    return (
        <TouchableOpacity
          style={Platform.OS === 'ios' ? styles.iosSubmitBtn: styles.androidSubmitBtn}
          onPress={onPress}>
            <Text style={styles.submitBtnText}>
                SUBMIT
            </Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component {

    state = {
        run  : 0,
        bike : 0,
        swim : 0,
        eat  : 0,
        sleep: 0
    }

    increment = (metric) => {
        const {max, step} = getMetricMetaInfo(metric)
        console.log("increment")

        this.setState((prevState) => {
            const count = prevState[metric] + step

            return {
                ...prevState,
                [metric]: count > max ? max : count
            }
        })
    }

    decrement = (metric) => {
        const { step } = getMetricMetaInfo(metric)

        console.log("decrement")
        this.setState((prevState) => {
            const count = prevState[metric] - step

            return {
                ...prevState,
                [metric]: count < 0 ? 0 : count
            }
        })
    }

    slide = (metric, value) => {
        this.setState({
            [metric]: value
        })
    }


    submit = () => {
        const key = timeToString()
        const entry = this.state

        // Update Redux
        this.props.dispatch(addEntry({
            [key]: entry
        }))

        this.setState({
            run: 0,
            bike: 0,
            swim: 0,
            eat: 0,
            sleep:0
        })

        //Navigate Home

        //Save to DB
        submitEntry({key, entry})

        // Clear local Notification

    }


    reset = () => {
        const key = timeToString()

        // Update redux
        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))

        // Route to home

        // Update DB
        removeEntry(key)

    }


    render() {
        const metaInfo = getMetricMetaInfo()

        if (this.props.alreadyLoggedIn) {
            return (
                <View style={styles.center}>
                    <Icon
                        name={Platform.OS === 'ios' ? 'ios-happy' : 'md-happy'}
                        size={100}
                    />
                    <Text>You already logged your info </Text>
                    <TextButton style={{padding: 10} } onPress={this.reset}>
                        RESET
                    </TextButton>
                </View>
            )
        }
        return (
            <View style ={styles.container}>
                <DateHeader date={new Date().toLocaleDateString() } />
                {Object.keys(metaInfo).map((key) => {
                const {getIcon, type, ...rest} = metaInfo[key]
                const value = this.state[key]
                
                    return (
                        <View style={styles.row} key={key}>
                            {getIcon()}
                            {type === 'slider'
                              ? <FitSlider 
                                    value={value}
                                    onChange={(value) => this.slide(key, value)}
                                    {...rest}
                                />
                              : <FitStepper
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                {...rest} 
                                />
                            }
                        </View>
                    )
                })}
                <Submitbtn onPress={this.submit} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40
    },
    androidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 2,
        height: 45,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30
    }
})

function mapStateToProps(state) {
    const key = timeToString()
    
    return {
        alreadyLoggedIn: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry)