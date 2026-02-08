import { Button, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Sentry from '@sentry/react-native';

const ChatsTab = () => {
  return (
    <SafeAreaView className='bg-surface flex-1'>
      <Text className='text-white'>ChatsTab</Text>
      <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/>
    </SafeAreaView>
  )
}

export default ChatsTab