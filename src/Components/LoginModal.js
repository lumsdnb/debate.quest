import React, { useState } from 'react';
import './Modal.css';
const LoginModal = (props) => {
  const [showBtn, setShowBtn] = useState(false);
  const [userHasJoined, setUserHasJoined] = useState(false);

  function handleSubmitBtn(event) {
    event.preventDefault();
    setUserHasJoined(false);
    props.handleSetUser(event.target.value);
  }

  function handleName(e) {
    e.preventDefault();
    setShowBtn(true);
    props.handleNameChange(e);
  }

  return (
    <>
      <div className="login-modal">
        <div>
          <div>
            <div className="neo-box-outward">
              <h2>KNOWLEDGE DECKS&trade;</h2>

              <h3>
                <sup>Thema:</sup>
                {props.topic}
              </h3>
              <button onClick={props.resetGame}>Spiel zurücksetzen</button>
            </div>

            {userHasJoined ? null : (
              <div className="neo-box-inward">
                <form>
                  <div className="form-group">
                    <label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="dein Name"
                        onChange={handleName}
                        maxlength="10"
                        required="required"
                        autocomplete="off"
                      />
                    </label>{' '}
                  </div>

                  <div className="form-group">
                    <label>Wähle deine Rolle:</label>

                    <div className="form-check">
                      <label className="form-check-label">
                        Debattierer
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          value="debater"
                          onChange={props.handleRadioChange}
                        />{' '}
                      </label>
                    </div>

                    <div className="form-check">
                      <label className="form-check-label">
                        Richter
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          value="judge"
                          onChange={props.handleRadioChange}
                        />{' '}
                      </label>
                    </div>

                    <div className="form-check">
                      <label className="form-check-label">
                        Zuschauer
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          value="spectator"
                          onChange={props.handleRadioChange}
                        />{' '}
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    {showBtn ? (
                      <input
                        type="submit"
                        className="btn btn-primary"
                        name="set"
                        value="set"
                        onClick={handleSubmitBtn}
                      />
                    ) : null}
                  </div>
                </form>
              </div>
            )}

            <div className="neo-box-inward">
              <h2>verbundene Spieler:</h2>
              <p>Spieler 1: {props.game.debater1Name}</p>
              <p>Spieler 2: {props.game.debater2Name}</p>
              <p>RICHTER: {props.game.judgeName}</p>
            </div>

            {props.gameReady ? (
              <button className="BUTTON_START" onClick={props.handleStartGame}>
                Spiel starten!
              </button>
            ) : (
              <>
                <p>Warte auf weitere Spieler...</p>
                <div className="spinner-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
