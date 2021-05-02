import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import { Helmet } from 'react-helmet';

import CardTable from './Components/CardTable.js';
import Player from './Components/Player.js';
import Toolbox from './Components/Toolbox.js';
import Chat from './Components/Chat.js';
import Modal from './Components/Modal.js';
import LoginModal from './Components/LoginModal.js';
import VotingModal from './Components/VotingModal.js';
import FinalModal from './Components/FinalModal.js';
import Timer from './Components/Timer.js';

import { RiSwordFill } from 'react-icons/ri';

import PreparedDeck from './Components/PreparedDeck.js';

import './App.css';

import crowd from './images/crowd.png';
import deckbtn from './images/cardbtn.png';
import AvatarGen from './Components/AvatarGen.js';

import useSound from 'use-sound';
import soundGavel from './sounds/gavel-2.mp3';
import soundWoo from './sounds/woo.wav';
import soundBoo from './sounds/boo.mp3';
import soundAirhorn from './sounds/airhorn.wav';
import soundBigHammer from './sounds/big-hammer.wav';
import soundMystery from './sounds/mystery.wav';
import soundCard from './sounds/card.mp3';
import soundClick from './sounds/click.mp3';
import soundTick from './sounds/tick.wav';
import soundUp from './sounds/upvote.mp3';
import soundDown from './sounds/downvote.mp3';

const localENDPOINT = 'http://127.0.0.1:4000';
const productionENDPOINT = 'https://cardgame-server-master.herokuapp.com:443';
const piENDPOINT = 'http://192.168.178.44:4000';

const App = () => {
  const [yourID, setYourID] = useState();
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [yourUnsentArgument, setYourUnsentArgument] = useState('');
  const [judgeMessage, setJudgeMessage] = useState('guilty');
  const [finalRuling, setFinalRuling] = useState('');
  const [canSend, setCanSend] = useState(true);
  const [showRuling, setShowRuling] = useState(false);
  const [topic, setTopic] = useState('');
  const [topicID, setTopicID] = useState(0);
  const [game, setGame] = useState({});

  const [showLogin, setShowLogin] = useState(true);
  const [showVoting, setShowVoting] = useState(false);
  const [showStartingModal, setShowStartingModal] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showCommentary, setShowCommentary] = useState(false);

  const [userAvi, setUserAvi] = useState(0);
  const [tempSpectatorAvi, setTempSpectatorAvi] = useState(0);

  const [preparedDeck, setpreparedDeck] = useState([]);
  const [showCardDeck, setShowCardDeck] = useState(false);

  const [chatList, setChatList] = useState([]);

  const [cardList, setCardList] = useState([]);
  const [isTyping] = useState(false);

  const [newCardType, setNewCardType] = useState();

  const [gameReady, setGameReady] = useState('');

  const [showTimer, setShowTimer] = useState(false);
  const [roundTimerWasUsed, setRoundTimerWasUsed] = useState(false);

  const [showInfo, setShowInfo] = useState(false);

  const [judgeCanAdvance, setJudgeCanAdvance] = useState([]);

  const [finalVotes, setFinalVotes] = useState([]);

  const debateTopics = [
    'Jeansjacken sind besser als Lederjacken',
    'Klopapier ist überbewertet!',
    'Autos mit Verbrennungsmotor sollten verboten werden.',
    'Die Mietpreisbremse ist ineffektiv und sollte abgeschafft werden.',
  ];

  const socketRef = useRef();

  //=============================================
  // sound triggers

  const [playGavel] = useSound(soundGavel, {
    volume: 0.7,
  });

  const [playMystery] = useSound(soundMystery, {
    volume: 0.3,
  });

  const [playClick] = useSound(soundClick, {
    volume: 0.5,
  });

  const [playTick] = useSound(soundTick, {
    volume: 0.8,
  });

  const [playCard] = useSound(soundCard, {
    volume: 0.5,
  });

  const [playWoo, { stop }] = useSound(soundWoo, {
    volume: 0.1,
  });

  const [playBoo] = useSound(soundBoo, {
    volume: 0.1,
  });
  const [playAirhorn] = useSound(soundAirhorn, {
    volume: 0.1,
  });
  const [playBigHammer] = useSound(soundBigHammer, {
    volume: 0.2,
  });

  const [playUp] = useSound(soundUp, {
    volume: 0.6,
  });
  const [playDown] = useSound(soundDown, {
    volume: 0.6,
  });
  useEffect(() => {
    socketRef.current = io.connect(productionENDPOINT);
    socketRef.current.on('your id', (id) => {
      setYourID(id);
    });
    socketRef.current.on('topic', (topic) => {
      setTopic(topic);
    });
    socketRef.current.on('game reset', () => {
      setGameReady(false);
      setUserName('');
      setRole('');
      closeModal();
      setShowLogin(true);
      setRoundTimerWasUsed(false);
    });

    socketRef.current.on('topic id', (id) => {
      setTopicID(id);
      if (id != -1) {
        setTopic(debateTopics[id]);
      }
    });

    socketRef.current.on('final votes', (voot) => {
      setFinalVotes(voot);
    });

    socketRef.current.on('message', (cards) => {
      setCardList(cards);
    });
    socketRef.current.on('latest card', (card) => {
      if (card.type === 'question') {
        playMystery();
      }
      if (card.type === 'argument' || 'fact') {
        playCard();
      }
    });
    socketRef.current.on('topic id', (id) => {
      setTopicID(id);
    });

    socketRef.current.on('next round', () => {
      console.log('nextround');
      setShowCommentary(true);
      setRoundTimerWasUsed(false);
      setShowTimer(false);
    });

    socketRef.current.on('get ready', () => {
      setGameReady(true);
      setShowCommentary(true);
    });

    socketRef.current.on('game', (gameObj) => {
      setGame(gameObj);
      setCardList(gameObj.cardList);
    });
    socketRef.current.on('chat messages', (msgList) => {
      setChatList(msgList);
    });

    socketRef.current.on('play sound', (sound) => {
      switch (sound) {
        case 'airhorn':
          playAirhorn();

          break;
        case 'boo':
          playBoo();

          break;
        case 'gavel':
          playGavel();

          break;
        case 'woo':
          playWoo();

          break;
        case 'timer':
          playTick();
          break;
        case 'up':
          playUp();
          break;
        case 'down':
          playDown();
          break;
        default:
          break;
      }
    });
    socketRef.current.on('final ruling', (e) => {
      setFinalRuling(e);
    });

    socketRef.current.on('judge ruling', (ruling) => {
      setJudgeMessage(ruling);
      if (role !== 'judge') {
        setShowRuling(true);
      }
    });
    socketRef.current.on('please vote', () => {
      setShowVoting(true);
    });
  }, [socketRef]);

  const oneTimerPerRound = () => {
    if (!roundTimerWasUsed) {
      console.log('bang');
      setShowTimer(true);
      setRoundTimerWasUsed(true);
    }
  };

  const [spectators, setSpectators] = useState([]);

  useEffect(() => {
    if (game.spectators) setSpectators(game.spectators);
  }, [game.spectators]);

  const spectatorList = spectators.map((s, i) => {
    if (s.id !== yourID)
      return (
        <div className='spectator-small'>
          <AvatarGen i={s.avi} style={{ width: '3rem', height: '3rem' }} />
          <h2>{s.name}</h2>
        </div>
      );
  });

  useEffect(() => {
    if (cardList.length === 0) {
      //if role is aff and round is odd, turn on sending
      //if role is neg and round is even, turn on sending
      if (role === 'affirmative') {
        game.round % 2 === 1 ? setCanSend(true) : setCanSend(false);
      }
      if (role === 'negative') {
        game.round % 2 === 1 ? setCanSend(false) : setCanSend(true);
      }
      if (role === 'judge') {
        setCanSend(true);
      }
    } else if (cardList.length > 0) {
      oneTimerPerRound();
      setCanSend(true);
      setShowCommentary(false);
    }
  }, [cardList, role, game.round]);

  const sendTopic = () => {
    socketRef.current.emit('set topic', topic);
  };

  const handleTopicID = (id) => {
    socketRef.current.emit('topic number', id);
  };

  //send cards from prep deck & toolbox
  function sendMessage(e) {
    if (e === '') return;

    socketRef.current.emit('send message', e);
    setYourUnsentArgument('');
  }

  const handleStartGame = () => {
    if (yourID === game.affirmativeID) {
      setRole('affirmative');
    }
    if (yourID === game.negativeID) {
      setRole('negative');
    }
    if (yourID === game.judgeID) {
      setRole('judge');
    }
    if (game.spectators.find((s) => s.id === yourID)) {
      console.log(`spectator found!`);
      setUserAvi(tempSpectatorAvi);
    }

    setShowLogin(false);
    if (role !== 'spectator') {
      setShowStartingModal(true);
    }
  };

  const showDeck = () => {
    setShowCardDeck(true);
  };
  const hideDeck = () => {
    setShowCardDeck(false);
  };

  const handleFinalRuling = (e) => {
    socketRef.current.emit('final ruling', e);
  };

  function setName(name) {
    setUserName(name);
  }

  function handleChange(e) {
    setYourUnsentArgument(e.target.value);
  }

  function handleSetRole(e) {
    setRole(e);
  }

  function handleNameChange(e) {
    setUserName(e.target.value);
  }

  function handleCardType(e) {
    setNewCardType(e.target.value);
  }

  const voteFor = (e) => {
    const voteObj = {
      role: role,
      vote: e,
    };
    socketRef.current.emit('send final vote', voteObj);
    closeModal();
    setShowFinal(true);
  };

  function handleSetUser(e) {
    const messageObject = {
      name: userName,
      role: role,
      avi: userAvi,
    };
    socketRef.current.emit('set user', messageObject);
  }

  const rateCard = (index, rating) => {
    const msgObj = {
      index: index,
      type: role,
      rating: rating,
    };
    socketRef.current.emit('rate card', msgObj);
  };

  function closeModal() {
    setShowRuling(false);
    setShowFinal(false);
    setShowVoting(false);
    setShowStartingModal(false);
    setShowInfo(false);
  }

  const closeJudgeModal = () => setShowRuling(false);

  function changeAvi(e) {
    setUserAvi(e);
  }

  const handleShowInfo = () => {
    setShowInfo(true);
  };

  //use this for increasing pitch of slaps

  const [playbackRate, setPlaybackRate] = React.useState(0.75);

  const handleClick = () => {
    setPlaybackRate(playbackRate + 0.1);
    playBoo();
  };

  const handleSetCustomTopic = (t) => {
    socketRef.current.emit('set topic', t);
  };

  const handleDebateField = (e) => {
    setTopic(e.target.value);
  };

  const handleTempAvi = (e) => {
    setTempSpectatorAvi(e);
  };

  const nextRound = () => {
    emitGavel();
    if (game.round > 4) {
      setShowCommentary(false);
      setRoundTimerWasUsed(false);
      setShowTimer(false);
    }
    if (game.round <= 4) socketRef.current.emit('next round');
  };
  const finishGame = (e) => {
    closeModal();
    setShowFinal(true);
    socketRef.current.emit('end game');
  };

  const resetGame = () => {
    socketRef.current.emit('reset');
    setGameReady(false);
    setUserName('');
    setRole('');
    closeModal();
    setShowLogin(true);
    setChatList([]);
    setShowTimer(false);
  };

  const sendChatMsg = (msg) => {
    const msgObj = {
      name: userName,
      body: msg,
    };
    socketRef.current.emit('chat message', msgObj);
  };

  const startTimer = () => {
    setShowTimer(true);
  };

  const emitAirhorn = () => {
    socketRef.current.emit('emit sound', 'airhorn');
  };

  const emitBoo = () => {
    socketRef.current.emit('emit sound', 'boo');
  };
  const emitGavel = () => {
    socketRef.current.emit('emit sound', 'gavel');
  };
  const silenceChat = () => {
    emitGavel();
    socketRef.current.emit('silence chat');
  };
  const emitWoo = () => {
    socketRef.current.emit('emit sound', 'woo');
  };

  const emitUp = () => {
    socketRef.current.emit('emit sound', 'up');
  };

  const emitDown = () => {
    socketRef.current.emit('emit sound', 'down');
  };

  const emitTimer = () => {
    socketRef.current.emit('start timer');
  };

  const finishCounting = () => {
    if (role !== 'judge') {
      setCanSend(false);
    }
    setShowTimer(false);
    console.log('app f received');
  };

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>
          {userName
            ? `Rolle: ${role === 'affirmative' ? 'Pro' : ''}${
                role === 'negative' ? 'Contra' : ''
              }${role === 'judge' ? 'Richter' : ''} ${
                role === 'spectator' ? 'Zuschauer' : ''
              } - Debate Quest`
            : 'Debate Quest'}
        </title>
      </Helmet>
      <Timer
        startTimer={showTimer}
        playTick={playTick}
        stopRound={finishCounting}
      />

      <Modal
        title='Debate Quest'
        showModal={showInfo}
        body={'Debattieren im Internet! Teil eines h_da Masterprojektes'}
        closeModal={closeModal}
      />

      <Modal
        title='Richter sagt:'
        showModal={showRuling}
        body={judgeMessage}
        closeModal={closeJudgeModal}
      />
      <Modal
        title='Die Debatte beginnt'
        showModal={showStartingModal}
        closeModal={closeModal}
        game={game}
      />
      {showVoting ? (
        <VotingModal
          game={game}
          topic={topic}
          voteFor={voteFor}
          role={role}
          usedCards={game.pastRounds}
          handleRuling={handleFinalRuling}
        />
      ) : null}
      {showFinal ? (
        <FinalModal
          topic={topic}
          role={role}
          game={game}
          resetGame={resetGame}
          finalVotes={finalVotes}
          finalRuling={finalRuling}
        />
      ) : null}
      {showLogin ? (
        <LoginModal
          game={game}
          role={role}
          userName={userName}
          setRole={handleSetRole}
          spectators={spectators}
          handleSetUser={handleSetUser}
          handleNameChange={handleNameChange}
          handleStartGame={handleStartGame}
          changeAvi={changeAvi}
          changeTempAvi={handleTempAvi}
          gameReady={gameReady}
          topic={topic}
          setTopic={handleSetCustomTopic}
          debateTopics={debateTopics}
          topicID={topicID}
          handleTopicID={handleTopicID}
          resetGame={resetGame}
        />
      ) : null}
      {showCardDeck ? (
        <PreparedDeck
          canSend={canSend}
          cardList={game.preparedDeck}
          sendMessage={sendMessage}
          hideDeck={hideDeck}
          role={role}
          topicID={topicID}
          debateTopics={debateTopics}
        />
      ) : null}
      <div
        className={
          role === 'spectator'
            ? 'grid-container spectator-layout'
            : 'grid-container'
        }
      >
        <div className='opponents'>
          {role === 'affirmative' ? (
            <>
              <Player
                avi={game.judgeAvi}
                name={game.judgeName}
                role='Richter'
              />
              <Player
                avi={game.negativeAvi}
                name={game.negativeName}
                role='Contra'
              />
            </>
          ) : null}
          {role === 'negative' ? (
            <>
              <Player
                avi={game.judgeAvi}
                name={game.judgeName}
                role='Richter'
              />
              <Player
                avi={game.affirmativeAvi}
                name={game.affirmativeName}
                role='Pro'
              />
            </>
          ) : null}
          {role === 'judge' ? (
            <>
              <Player
                avi={game.affirmativeAvi}
                name={game.affirmativeName}
                role={'dafür'}
              />
              <Player
                avi={game.negativeAvi}
                name={game.negativeName}
                role='dagegen'
              />
            </>
          ) : null}
          {role === 'spectator' ? (
            <>
              <Player
                avi={game.judgeAvi}
                name={game.judgeName}
                role='Richter'
              />
              <Player
                avi={game.affirmativeAvi}
                name={game.affirmativeName}
                role={'dafür'}
              />
              <Player
                avi={game.negativeAvi}
                name={game.negativeName}
                role='dagegen'
              />
            </>
          ) : null}
        </div>
        <div className='chat'>
          <Chat
            sendChatMsg={sendChatMsg}
            chatList={chatList}
            spectatorList={game.spectators}
          />
          <RiSwordFill />
        </div>
        <div className='player1'>
          {role === 'affirmative' ? (
            <Player
              avi={game.affirmativeAvi}
              name={game.affirmativeName}
              role='Pro'
            />
          ) : null}
          {role === 'negative' ? (
            <Player
              avi={game.negativeAvi}
              name={game.negativeName}
              role='Contra'
            />
          ) : null}
          {role === 'judge' ? (
            <Player avi={game.judgeAvi} name={game.judgeName} role='Richter' />
          ) : null}
          {role === 'spectator' ? (
            <Player avi={tempSpectatorAvi} name={userName} role='Zuschauer' />
          ) : null}
        </div>
        <div className='title'>
          <h1>
            <sup>
              <i>Thema: </i>
            </sup>
            {topic}
          </h1>
          <div className='game-commentary'>
            {showCommentary ? (
              <h3>
                Runde {game.round} von 4 <br />
                {game.round % 2 === 1
                  ? `${game.affirmativeName} spielt das erste PRO Argument`
                  : `${game.negativeName} spielt das erste CONTRA Argument`}
              </h3>
            ) : null}
          </div>
        </div>
        <div className='card-table'>
          <CardTable
            cardList={cardList}
            userRole={role}
            rateCard={(i, r) => rateCard(i, r)}
          />
        </div>
        <div className='crowd'>
          {spectatorList}
          <img src={crowd} alt='crowd cheering' draggable='false'></img>
        </div>
        <div className='card-deck'>
          {role === 'judge' || role === 'spectator' ? null : (
            <button className='deck-button' onClick={showDeck}>
              <img src={deckbtn} alt='deck öffnen' draggable='false'></img>
            </button>
          )}
        </div>
        <div className='navbar'>
          <button onClick={handleShowInfo}>Info</button>
        </div>
        <div className='toolbox'>
          {role === 'spectator' ? (
            <>
              <button onClick={emitWoo}>woo</button>
              <button onClick={emitBoo}>boo</button>
              <button onClick={emitAirhorn}>airhorn</button>
            </>
          ) : (
            <Toolbox
              game={game}
              onChange={handleChange}
              handleCardType={handleCardType}
              sendMessage={sendMessage}
              nextRound={nextRound}
              role={role}
              canSend={canSend}
              playWoo={emitWoo}
              playBoo={emitBoo}
              playAirhorn={emitAirhorn}
              playGavel={silenceChat}
              startTimer={emitTimer}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
