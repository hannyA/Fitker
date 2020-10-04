import React, { Component } from 'react'
import {View, Text } from 'react-native'
import { getMetricMetaInfo } from '../utils/helpers'

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

    deccrement = (metric) => {
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
                {Object.keys(metaInfo).map((key) => {
                const {getIcon} = metaInfo[key]
                const value = this.state[key]
                
                    return (
                        <View>
                            <Text>{getIcon()}</Text>
                        </View>
                    )
                })}
            </View>
        )
    }
}