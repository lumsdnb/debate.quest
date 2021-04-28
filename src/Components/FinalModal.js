import React, { useState } from 'react';
import './Modal.css';

import AvatarGen from './AvatarGen.js';

const FinalModal = (props) => {
  const [showBtn, setShowBtn] = useState(false);

  const doneVoting = () => {
    if (
      props.finalVotes.aff &&
      props.finalVotes.neg &&
      props.finalVotes.judge
    ) {
      return true;
    }
  };

  function handleSubmitBtn(event) {
    event.preventDefault();
    props.handleSetUser(event.target.value);
  }

  function handleName(e) {
    e.preventDefault();
    setShowBtn(true);
    props.handleNameChange(e);
  }

  const spectators = props.game.spectators.map((s) => {
    return (
      <div>
        <p>{s.name}</p>
        <AvatarGen i={s.avi} style={{ width: '3rem', height: '3rem' }} />
      </div>
    );
  });

  return (
    <>
      <div className='login-modal'>
        <div>
          <div>
            <div className='neo-box-outward'>
              <h2>Rundenende</h2>

              <h3>
                <sup>Thema:</sup>
                {props.topic}
              </h3>
            </div>

            <div className='neo-box-inward vote-display'>
              <h3 className='fb100'>Ergebnis:</h3>
              <h5>
                <AvatarGen
                  i={props.game.affirmativeAvi}
                  style={{ width: '3rem', height: '3rem' }}
                />{' '}
                {props.game.affirmativeName} : {props.finalVotes.aff}
              </h5>
              <h5>
                <AvatarGen
                  i={props.game.negativeAvi}
                  style={{ width: '3rem', height: '3rem' }}
                />{' '}
                {props.game.negativeName} : {props.finalVotes.neg}
              </h5>
              <h5>
                <AvatarGen
                  i={props.game.judgeAvi}
                  style={{ width: '3rem', height: '3rem' }}
                />{' '}
                {props.game.judgeName} : {props.finalVotes.judge}
              </h5>
              {spectators}
            </div>

            {props.finalRuling ? (
              <div className='neo-box-inward'>
                <h2>{`${props.game.judgeName}'s Urteil: ${props.finalRuling}`}</h2>
              </div>
            ) : null}

            {doneVoting ? null : (
              <div className='neo-box-outward'>
                <p>Warte auf Ergebnisse...</p>
                <div class='spinner-ellipsis'>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
          </div>
        </div>
        {doneVoting ? (
          <button onClick={props.resetGame}>Neues Spiel</button>
        ) : null}
      </div>
    </>
  );
};

export default FinalModal;
