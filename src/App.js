import React from 'react'
import VideoChat from './VideoChat'
import './App.css'

import { Layout } from 'antd'

import 'antd/dist/antd.css'

const App = () => {
  const { Header } = Layout

  return (
    <Layout style={{ height: '100vh' }}>
      <Header
        className='site-layout-background'
        style={{
          textAlign: 'center',
          fontSize: '20px',
          color: 'white',
          padding: 0
        }}
      >
        Flask & Twilio Video Conference
      </Header>
      <VideoChat />
    </Layout>
  )
}

export default App
