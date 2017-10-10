// FIXME: decorators not working, w0t. play with configs later, maybe still using babel6?...
import React, { Component } from 'react';
import { types } from 'mobx-state-tree';
import { observer } from 'mobx-react';
import { Finder, FinderModal } from './finder';
import {
  Input,
  Button,
  Tabs
} from 'antd';
import { stringify } from 'query-string';
import './App.css';

const base = 'https://api.magicthegathering.io/v1';

const mtgQuery = ({ page, pageSize, term }) => {
  return fetch(`${base}/cards?${stringify({ page, pageSize, name: term })}`)
  .then((response) =>
    response.json()
    .then(({ cards }) => ({
      page,
      pageSize,
      items: cards,
      total: +response.headers.get('total-count')
    })
  ));
}

const columns = [{
  title: 'ID',
  dataIndex: 'id',
  key: 'id'
},{
  title: 'Name',
  dataIndex: 'name',
  key: 'name'
}];

// Deck Section

const Card = types.model("Card", {
  name: types.string
});

const Deck = types.model("Deck", {
  name: types.string,
  cards: types.array(Card)
});

const Decks = types.model("Decks", {
  decks: types.array(Deck)
})
.actions(self => {
  return {
    addDeck(data = { cards: [] }) {
      self.decks.push(data);
    }
  }
})

class _DecksView extends Component {
  state = {
    activeSearchId: null
  };

  render() {
    const { vm } = this.props;
    const { activeSearchId } = this.state;

    return (
      <div>
        <FinderModal
          visible={ Boolean(activeSearchId) }
          title={ `Adding to Deck: ${activeSearchId}` }
          onOk={ () => this.setState({ activeSearchId: null }) }
        >
          <Finder
            columns={ columns }
            query={ mtgQuery }
          />
        </FinderModal>
        { vm.decks.map(deck =>
          <div key={ deck.name }>
            <Button onClick={ () => this.setState({ activeSearchId: deck.name }) }>
              { deck.name }
            </Button>
          </div>
        ) }
        <Input id="deck-name" />
        <Button onClick={ () => {
          const deckName = document.getElementById('deck-name');
          vm.addDeck({
            name: deckName.value,
            cards: []
          });
          deckName.value = '';
        } }>
          Add Deck
        </Button>
      </div>
    );
  }
}

const DecksView = observer(_DecksView);

const tempState = Decks.create({
  decks: []
});

class _App extends Component {
  state = { activeKey: 'decks' };

  changeScreen = (screen) => {
    this.setState({ activeKey: screen });
  };

  render() {
    return (
      <div className="App">
        <Tabs activeKey={ this.state.activeKey } onChange={ this.changeScreen }>
          <Tabs.TabPane tab="Finder" key="finder">
            <Finder
              columns={ columns }
              query={ mtgQuery }
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Decks" key="decks">
            <DecksView
              vm={ tempState }
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

export default observer(_App);