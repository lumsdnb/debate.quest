import React, { useState } from 'react';
import Card from './Card.js';
import './Modal.css';

import Player from './Player.js';

const VotingModal = (props) => {
  const [yourWinner, setYourWinner] = useState('unset');
  const [ruling, setRuling] = useState('');

  const handleRuling = (e) => {
    setRuling(e.target.value);
  };

  const sendRuling = () => {
    props.handleRuling(ruling);
  };

  function selectVote(e) {
    setYourWinner(e);
  }

  const sendVote = () => {
    if (props.role === 'judge') {
      sendRuling();
    }
    props.voteFor(yourWinner);
  };

  const round1 = props.usedCards[0].map((c, i) => {
    return (
      <Card
        save
        key={c.i}
        claim={c.body}
        index={i}
        role={c.role}
        type={c.type}
        spectatorRating={c.spectatorRating}
        judgeRating={c.judgeRating}
      />
    );
  });

  const round2 = props.usedCards[1].map((c, i) => {
    return (
      <Card
        save
        key={c.i}
        claim={c.body}
        index={i}
        role={c.role}
        type={c.type}
        spectatorRating={c.spectatorRating}
        judgeRating={c.judgeRating}
      />
    );
  });

  const round3 = props.usedCards[2].map((c, i) => {
    return (
      <Card
        save
        key={c.i}
        claim={c.body}
        index={i}
        role={c.role}
        type={c.type}
        spectatorRating={c.spectatorRating}
        judgeRating={c.judgeRating}
      />
    );
  });
  const round4 = props.usedCards[3].map((c, i) => {
    return (
      <Card
        save
        key={c.i}
        claim={c.body}
        index={i}
        role={c.role}
        type={c.type}
        spectatorRating={c.spectatorRating}
        judgeRating={c.judgeRating}
      />
    );
  });

  return (
    <>
      <div className='voting-modal'>
        <div class='voting-grid-container'>
          <div class='title-topic neo-box-inward flex-column'>
            <h4>{props.topic}</h4>
            <h3>Wer hat am besten argumentiert?</h3>
          </div>

          <div className='round1-title vote-title'>
            <h3>Runde 1</h3>
          </div>
          <div className='round2-title vote-title'>
            <h3>Runde 2</h3>
          </div>
          <div className='round3-title vote-title'>
            <h3>Runde 3</h3>
          </div>
          <div className='round4-title vote-title'>
            <h3>Runde 4</h3>
          </div>
          <div className='round1 scroll-round'>{round1}</div>
          <div className='round2 scroll-round'>{round2}</div>
          <div className='round3 scroll-round'>{round3}</div>
          <div className='round4 scroll-round'>{round4}</div>
          <div className='voting'>
            <div className='neo-box-inward'>
              <div className='flex-row'>
                <button
                  className={
                    yourWinner === 'pro' ? 'select-highlight' : 'select-buttons'
                  }
                  onClick={() => {
                    selectVote('pro');
                  }}
                >
                  <Player
                    avi={props.game.affirmativeAvi}
                    name={props.game.affirmativeName}
                    role={'pro'}
                  />
                </button>
                <button
                  className={
                    yourWinner === 'unentschieden'
                      ? 'select-highlight'
                      : 'select-buttons'
                  }
                  onClick={() => {
                    selectVote('unentschieden');
                  }}
                >
                  <h4 classname='center-flex'>Unentschieden</h4>
                </button>
                <button
                  className={
                    yourWinner === 'contra'
                      ? 'select-highlight'
                      : 'select-buttons'
                  }
                  onClick={() => {
                    selectVote('contra');
                  }}
                >
                  <Player
                    avi={props.game.negativeAvi}
                    name={props.game.negativeName}
                    role={'contra'}
                  />
                </button>
              </div>
              <div className='neo-box-outward flex-row'>
                {props.role === 'judge' ? (
                  <>
                    <h4>dein Urteil:</h4>
                    <textarea
                      className='judgement-textarea'
                      onChange={handleRuling}
                    />
                  </>
                ) : null}
                {yourWinner !== 'unset' ? (
                  <button onClick={sendVote}>abstimmen</button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VotingModal;
