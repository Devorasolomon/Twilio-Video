import React, { useState, useEffect } from 'react'
import Participant from './Participant'
import Video from 'twilio-video'
import { Layout, List } from 'antd'

import 'antd/dist/antd.css'

const Room = ({ roomName, token, handleLogout }) => {
  const { Content, Sider } = Layout

  const [room, setRoom] = useState(null)
  const [participants, setParticipants] = useState([])

  useEffect(() => {
    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant])
    }

    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      )
    }

    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room)
      room.on('participantConnected', participantConnected)
      room.on('participantDisconnected', participantDisconnected)
      room.participants.forEach(participantConnected)
    })

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (
            trackPublication
          ) {
            trackPublication.track.stop()
          })
          currentRoom.disconnect()
          return null
        } else {
          return currentRoom
        }
      })
    }
  }, [roomName, token])

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} />
  ))

  const listParticipants = participants.map(participant => (
    <li style={{ listStyle: 'none', fontSize: '15px', textAlign: 'center' }}>
      name: {participant.identity}, staus: {participant.state}
    </li>
  ))

  const disconnectAll = () => {
    handleLogout()
    fetch('/complete/' + room.sid, {
      method: 'GET'
    }).then(() => {
      room.disconnect()
    })
  }

  return (
    <Layout className='site-layout'>
      <Sider
        breakpoint='lg'
        collapsedWidth='0'
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          color: 'white'
        }}
      >
        <List
          style={{ fontSize: '16px', color: 'white' }}
          header={
            <div style={{ fontWeight: 'bold' }}>Participants On Call:</div>
          }
          footer={
            <>
              <div style={{ fontSize: '12px' }}>
                {listParticipants.length + 1} Participants are Connected to Call
              </div>
              <div style={{ alignItems: 'center' }}>
                <button
                  style={{
                    marginTop: '20px',
                    width: '100px',
                    padding: '3px',
                    color: 'white'
                  }}
                  onClick={disconnectAll}
                >
                  Log out All
                </button>
              </div>
            </>
          }
        >
          <li
            style={{ listStyle: 'none', fontSize: '15px', textAlign: 'center' }}
          >
            {' '}
            me
          </li>
          {listParticipants}
        </List>
      </Sider>
      <Content
        style={{
          margin: '24px 16px 0 200px',
          overflow: 'initial',
          minHeight: 'auto'
        }}
      >
        <div
          className='site-layout-background'
          style={{
            padding: 24,
            textAlign: 'center'
          }}
        >
          <div className='room'>
            <h2>Room: {roomName}</h2>
            <div>
              <button
                style={{ width: '100px', margin: '10px', color: 'white' }}
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>

            <div className='local-participant'>
              {room ? (
                <Participant
                  key={room.localParticipant.sid}
                  participant={room.localParticipant}
                />
              ) : (
                ''
              )}
            </div>
            <h3>Remote Participants</h3>
            <div className='remote-participants'>{remoteParticipants}</div>
          </div>
        </div>
      </Content>
    </Layout>
  )
}

export default Room
