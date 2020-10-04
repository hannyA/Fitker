import React, { Component } from 'react'
import {  View, Text } from 'react-native'
import Slider from '@react-native-community/slider'

export default function FitSlider({max, unit, step, value, onChange}) {
    return (
        <View>
            <Slider
                step={step}
                value={value}
                maximumValue={max}
                minimumValue={0}
                unit={unit}
                onValueChange={onChange}
            />
            <View>
                <Text>{value}</Text>
                <Text>{unit}</Text>
            </View>
        </View>
    )
}