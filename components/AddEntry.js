import React, { Component } from 'react'
import {View, Text, TouchableOpacity } from 'react-native'
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


function Submitbtn( {onPress}) {
    return (
        <TouchableOpacity
            onPress={onPress}>
            <Text>
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
                <View>
                    <Icon
                        name='md-happy'
                        size={100}
                    />
                    <Text>You already logged your info </Text>
                    <TextButton onPress={this.reset}>
                        RESET
                    </TextButton>
                </View>
            )
        }
        return (
            <View>
                <DateHeader date={new Date().toLocaleDateString() } />
                {Object.keys(metaInfo).map((key) => {
                const {getIcon, type, ...rest} = metaInfo[key]
                const value = this.state[key]
                
                    return (
                        <View key={key}>
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
function mapStateToProps(state) {
    const key = timeToString()
    
    return {
        alreadyLoggedIn: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry)