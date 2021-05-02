import React from 'react';
import Card from './Card.js';
import './CardTable.css';

import { MdClose } from 'react-icons/md';

const PreparedDeck = (props) => {
  const demoDeck = [
    [
      {
        body: 'Lederjacken erfordern viel mehr Pflegeaufwand.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body: 'Lederjacken erfordern viel mehr Pflegeaufwand.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body:
          'Für Jeansjacken gibt es etablierte, umweltfreundliche Prozesse, um sie zu waschen.',
        type: 'fact',
        source:
          'https://www.sciencedirect.com/science/article/pii/B9780857098436000111',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body:
          'Lederjacken entwickeln mit dem Träger über Zeit einen individuellen used look.',
        type: 'fact',
        judgeRating: 0,
        spectatorRating: 0,
        source: 'https://www.kleidung.com/jeansjacke-vs-lederjacke-33080/',
      },
      {
        body: 'Lederjacken speichern Wärme besser als Jeansjacken.',
        type: 'fact',
        judgeRating: 0,
        spectatorRating: 0,
        source: 'https://www.kleidung.com/jeansjacke-vs-lederjacke-33080/',
      },
    ],
    [],
    [
      {
        body: 'Klopapier belastet die Umwelt.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body: 'Menschen früher haben auch keins gebraucht.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body:
          'Wiederverwendbare Schwämme und Lappen sind genau so zielführend, und langfristig kostengünstiger.',
        type: 'fact',
        judgeRating: 0,
        spectatorRating: 0,
        source:
          'https://www.medicalnewstoday.com/articles/toilet-paper-alternatives',
      },
      {
        body: 'Klopapier Alternativen funktionieren nicht so gut.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
    ],

    [
      {
        body:
          'Fact: Straßenverkehr verursacht 18% des weltweiten CO2 Ausstoßes.',
        type: 'fact',
        source:
          'https://de.statista.com/statistik/daten/studie/317683/umfrage/verkehrsttraeger-anteil-co2-emissionen-fossile-brennstoffe/',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body:
          'Durch das Fördern von E-Motoren gehen wir als Vorbild für andere Länder voran.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body:
          'Unsere Abhängigkeit von ausländischen Energielieferanten würde sinken.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body: '94% aller Fahrzeuge haben einen Verbrennungsmotor.',
        type: 'fact',
        source:
          'https://de.statista.com/statistik/daten/studie/572962/umfrage/anteil-der-jeweiligen-antriebsart-an-an-der-weltweiten-antriebsproduktion-bis-2025/',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body: 'Verbrennungsmotoren haben keinerlei ökologische Vorteile.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body:
          'Statt Verbrenner zu verbieten, sollte in nachhaltige synthetische Treibstoffe investiert werden.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body:
          'Ein generelles Verbot würde alle existierenden Geräte mit solchen Motoren obsolet machen und einen massiven wirtschaftlichen Schaden anrichten.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body:
          'Ein Verbot aus umweltschutzgründen macht keinen Sinn, wenn Alternativen wie Elektroautos immer noch nicht nachhaltig sind.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
    ],

    [
      {
        body:
          'Eine Mietpreisbremse würde nicht dazu führen, dass finanziell schwache Gruppen eine Wohnung tatsächlich bekämen. Mieter würden sich trotzdem für die Familien mit stabilem Einkommen entscheiden, und diese würden dann noch mehr profitieren als vorher.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body:
          'Niemand MUSS in einer Großstadt leben. Wer sich Wohnungen in beliebten Gebieten mit Platzmangel nicht leisten kann, soll sich an weniger dicht besiedelten Orten Wohnraum suchen.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
      {
        body:
          'Eine Mietpreisbremse alleine reicht nicht aus, um finanziell schwache Gruppen zu unterstützen.',
        type: 'argument',
        judgeRating: 0,
        spectatorRating: 0,
      },
    ],
  ];

  const playCard = (c) => {
    console.log('card was clicked');
    c.role = props.role;

    props.sendMessage(c);
    props.hideDeck();
  };

  const listOfCards = demoDeck[props.topicID === 0 ? 0 : props.topicID + 1].map(
    (c, index) => {
      return (
        <div classname='d'>
          <Card
            size={'smol'}
            key={index}
            claim={c.body}
            type={c.type}
            source={c.source}
          />
          {props.canSend ? (
            <button
              type='button'
              className='card-place-btn'
              onClick={() => playCard(c)}
            >
              Karte spielen
            </button>
          ) : null}
        </div>
      );
    }
  );

  return (
    <div className='modal-outer'>
      <div className='prepared-deck'>
        <div className='prepared-deck-cardlist'>{listOfCards}</div>
      </div>
      <button className='deck-prep-close' onClick={props.hideDeck}>
        <MdClose />
      </button>
    </div>
  );
};

export default PreparedDeck;
