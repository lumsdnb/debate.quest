import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import CardTable from './Components/CardTable.js';
import Player from './Components/Player.js';
//import MainForm from './Components/MainForm.js';
import Chat from './Components/Chat.js';
import Modal from './Components/Modal.js';
import UserList from './Components/UserList.js';
import MainForm from './Components/MainForm.js';

import './App.css';
import './Components/MainForm.css';

import useSound from 'use-sound';
import gavelSound from './sounds/gavel-2.mp3';

const ENDPOINT = 'http://127.0.0.1:4001';
const herokuENDPOINT = 'https://cardgame-server-master.herokuapp.com:4001';
const piENDPOINT = 'http://192.168.2.199:4001';

const App = () => {
  const [yourID, setYourID] = useState();
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState();
  const [affirmativeMessage, setAffirmativeMessage] = useState('');
  const [yourUnsentArgument, setYourUnsentArgument] = useState('');
  const [NegativeMessage, setNegativeMessage] = useState('');
  const [judgeMessage, setJudgeMessage] = useState('guilty');
  const [canSend, setCanSend] = useState(true);
  const [showRuling, setShowRuling] = useState(false);
  const [debateClaim, setDebateClaim] = useState('pineapple belongs on pizza');

  const [userList, setUserList] = useState([]);
  const [cardList, setCardList] = useState([]);
  //todo: implement card array )doesnt work atm

  //const [messages, setMessages] = useState([]);
  //setaffirmativeMessages((oldMsgs) => [...oldMsgs, message]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect(ENDPOINT);
    socketRef.current.on('your id', (id) => {
      setYourID(id);
    });
    socketRef.current.on('message', (message) => {
      const tempCardList = cardList;
      tempCardList.push(message);
      setCardList(tempCardList);

      switch (message.type) {
        case 'affirmative':
          setAffirmativeMessage(message.body);

          break;
        case 'negative':
          setNegativeMessage(message.body);

          break;
        case 'judge':
          setJudgeMessage(message.body);
          setShowRuling(true);
          break;

        default:
          break;
      }
    });
    socketRef.current.on('set user', (user) => {});
    socketRef.current.on('user list', (users) => {
      setUserList(users);
      console.log(users);
    });
  }, []);

  function sendMessage(e) {
    if (canSend) {
      const messageObject = {
        body: e,
        id: yourID,
        type: role,
      };
      //setCanSend(false);
      socketRef.current.emit('send message', messageObject);
    }
  }

  function setName(name) {
    setUserName(name);
  }

  function handleChange(e) {
    setYourUnsentArgument(e.target.value);
  }

  function handleRadioChange(e) {
    setRole(e.target.value);
  }

  function handleNameChange(e) {
    setUserName(e.target.value);
  }

  function handleSetuser(e) {
    const messageObject = {
      id: yourID,
      name: userName,
      role: role,
    };
    socketRef.current.emit('set user', messageObject);
  }

  function closeModal() {
    setShowRuling(false);
  }

  const handleSound = () => {
    play();
  };

  const [play] = useSound(gavelSound, {
    volume: 0.8,
  });

  return (
    <>
      <div
        class={
          role == 'judge' ? 'grid-container-judge' : 'grid-container-player'
        }
      >
        <div class="title-claim">
          <h1 className="claim-header">
            <sup>
              <i>claim: </i>
            </sup>
            {debateClaim}
          </h1>
        </div>
        <div class="chat">
          <UserList
            users={userList}
            handleRadioChange={handleRadioChange}
            handleSetUser={handleSetuser}
            handleNameChange={handleNameChange}
          />
        </div>
        {role == 'affirmative' || role == 'negative' ? (
          <>
            <div className="player1">
              <Player name={userName} role={role} />
            </div>
            <div className="player2">
              <Player name="player2" role="negative" />
            </div>
          </>
        ) : null}
        {role == 'judge' ? (
          <div class="players">
            <Player name={'affirmativ'} role={'affirmative'} />
            <Player name="neg" role="negative" />
          </div>
        ) : null}
        <div class="toolbox">
          {role == 'spectator' ? null : (
            <MainForm onChange={handleChange} handleSubmit={sendMessage} />
          )}

          {role == 'judge' ? (
            <button onClick={handleSound}>gavel</button>
          ) : null}
          {role == 'spectator' ? (
            <>
              <button>cheer</button>
              <button>throw tomato</button>
            </>
          ) : null}
        </div>

        <CardTable
          arg1={affirmativeMessage}
          arg2={NegativeMessage}
          cardList={cardList}
          role={role}
        />

        <div class="judge">
          <Player name="bob" role="judge" />
        </div>
      </div>

      <Modal
        showModal={showRuling}
        verdict={judgeMessage}
        closeModal={closeModal}
      />
    </>
  );
};

export default App;
