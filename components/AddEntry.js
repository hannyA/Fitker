import React, { Component } from 'react'
import {View, Text } from 'react-native'
import { getMetricMetaInfo } from '../utils/helpers'
import FitSlider from './FitSlider'
import FitStepper from './FitStepper'
import DateHeader from './DateHeader'


export default class AddEntry extends Component {

    state = {
        run: 0,
        bike: 0,
        swim: 0,
        eat: 0,
        sleep:0
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

    render() {
        const metaInfo = getMetricMetaInfo()

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
            </View>
        )
    }
}