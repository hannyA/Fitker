import React, { Component } from 'react'
import {View, Text, TouchableOpacity } from 'react-native'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import FitSlider from './FitSlider'
import FitStepper from './FitStepper'
import DateHeader from './DateHeader'
// import { TouchableOpacity } from 'react-native-gesture-handler'


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

export default class AddEntry extends Component {

    state = {
        run: 0,
        bike: 10,
        swim: 4,
        eat: 5,
        sleep:8
    }

    increment = (metric) => {
        const {max, step} = getMetricMetaInfo(metric)

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
        this.setState({
            run: 0,
            bike: 0,
            swim: 0,
            eat: 0,
            sleep:0
        })

        //Navigate Home

        //Save to DB

        // Clear local Notification

    }


    render() {
        const metaInfo = getMetricMetaInfo()

        return (
            <View>
                <DateHeader date={new Date().toLocaleDateString() } />
                <Text>{JSON.stringify(this.state)}</Text>
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