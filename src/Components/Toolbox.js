import React, { useState } from 'react';
import BlockUi from 'react-block-ui';

import 'react-block-ui/style.css';

import './Toolbox.css';
import { GiBangingGavel } from 'react-icons/gi';

const Toolbox = (props) => {
  const [yourArgument, setYourArgument] = useState('');
  const [cardType, setCardType] = useState('argument');
  const [cardSource, setCardSource] = useState('');

  function handleArgument(e) {
    setYourArgument(e.target.value);
  }

  function handleCardType(c) {
    setCardType(c.target.value);
  }

  const handleCardSource = (e) => {
    setCardSource(e.target.value);
  };

  function sendMessage(e) {
    if (e === '') return;
    if (yourArgument === '') return;
    if (cardType === 'fact') {
      const messageObject = {
        body: yourArgument,
        role: props.role,
        type: cardType,
        source: cardSource,
        judgeRating: 0,
        spectatorRating: 0,
      };
      props.sendMessage(messageObject);
    } else {
      const messageObject = {
        body: yourArgument,
        role: props.role,
        type: cardType,
        judgeRating: 0,
        spectatorRating: 0,
      };
      props.sendMessage(messageObject);
    }
    document.getElementById('toolbox-form').reset();
    setYourArgument('');
  }

  function surrender() {
    const messageObject = {
      body: 'argument aufgegeben',
      role: props.role,
      type: 'surrender',
      judgeRating: 0,
      spectatorRating: 0,
    };
    props.sendMessage(messageObject);
    document.getElementById('toolbox-form').reset();
    setYourArgument('');
  }

  const spectatorView = () => {
    return (
      <div className='spectator-board'>
        <button onClick={props.playWoo}>woo</button>
        <button onClick={props.playBoo}>boo</button>
        <button onClick={props.playAirhorn}>airhorn</button>
      </div>
    );
  };

  return (
    <BlockUi
      tag='div'
      blocking={!props.canSend}
      message=''
      style={{ borderRadius: '100vh' }}
    >
      <div style={{ height: '100vh' }}>
        {props.role === 'spectator' ? spectatorView : null}

        {props.role === 'judge' ? (
          <div classname='tools-judge'>
            <button className='gavel-btn' onClick={props.playGavel}>
              <GiBangingGavel />
            </button>

            <button onClick={props.nextRound}>Runde beenden</button>
          </div>
        ) : null}
        {props.role === 'affirmative' ||
        props.role === 'negative' ||
        props.role === 'debater' ? (
          <>
            <div class='select-buttons'>
              <button
                className={cardType === 'argument' ? 'select-highlight' : null}
                type='button'
                name='card_type'
                value='argument'
                onClick={handleCardType}
              >
                Argument
              </button>
              <button
                className={cardType === 'fact' ? 'select-highlight' : null}
                type='button'
                name='card_type'
                value='fact'
                onClick={handleCardType}
              >
                Fakt
              </button>
              <button
                className={cardType === 'question' ? 'select-highlight' : null}
                type='button'
                name='card_type'
                value='question'
                onClick={handleCardType}
              >
                Frage
              </button>
            </div>
          </>
        ) : null}
        <form id='toolbox-form'>
          <textarea
            id='cardform'
            className='form-textarea'
            onChange={handleArgument}
            maxLength='200'
          />
          {cardType === 'fact' ? (
            <textarea
              id='cardsource'
              className='source-field'
              onChange={handleCardSource}
            >
              source pls
            </textarea>
          ) : null}

          <button type='button' className='form-btn' onClick={sendMessage}>
            {props.role === 'judge' ? 'Runde kommentieren' : 'Karte spielen'}
          </button>

          {/*props.role === 'judge' ? null : (
            <button type='button' className='form-btn' onClick={surrender}>
              surrender!
            </button>
          )*/}
        </form>
      </div>
    </BlockUi>
  );
};

export default Toolbox;
