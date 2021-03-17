import React from 'react';
import useFitText from 'use-fit-text';

import './Card.css';

const Card = (props) => {
  const { fontSize, ref } = useFitText();
  return (
    <>
      <div className="card">
        <div ref={ref} className="card-inner" style={{ fontSize }}>
          <p>{props.claim}</p>
        </div>
      </div>
    </>
  );
};

export default Card;
