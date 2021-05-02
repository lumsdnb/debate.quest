import React from 'react';
import './Modal.css';

import { RiSwordFill } from 'react-icons/ri';
import { GiBangingGavel } from 'react-icons/gi';

import AvatarGen from './AvatarGen.js';

const Modal = (props) => {
  return (
    <>
      <div
        className='modal-popup'
        style={{ display: props.showModal ? 'block' : 'none' }}
      >
        <div>
          <h3>{props.title}</h3>
          <p>{props.body}</p>
          {props.game ? (
            <div className='triangular-flex-container'>
              <div className='login-flex-player'>
                <div className='center-flex'>
                  <GiBangingGavel className='big-icon' />
                  <AvatarGen
                    className='fb100'
                    i={props.game.judgeAvi}
                    style={{ width: '3.8rem', height: '3.8rem' }}
                  />
                  <div>{props.game.judgeName}</div>
                </div>
              </div>

              <div className='login-player fb50'>
                <div className='login-flex-player'>
                  <strong>Pro</strong>{' '}
                  <AvatarGen
                    className='fb100'
                    i={props.game.affirmativeAvi}
                    style={{ width: '3.8rem', height: '3.8rem' }}
                  />
                  <RiSwordFill className='big-icon' />
                  <div>{props.game.affirmativeName}</div>
                </div>
              </div>
              <div className='login-player fb50'>
                <div className='login-flex-player'>
                  <strong>Contra</strong>
                  <AvatarGen
                    className='fb100'
                    i={props.game.negativeAvi}
                    style={{ width: '3.8rem', height: '3.8rem' }}
                  />
                  <RiSwordFill className='big-icon' />
                  <div>{props.game.negativeName}</div>
                </div>
              </div>
            </div>
          ) : null}
          <button onClick={props.closeModal}>ok!</button>
        </div>
      </div>
    </>
  );
};

export default Modal;
