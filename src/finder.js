import React, { Component } from 'react';
import {
  Modal,
  Input,
  Table,
  Pagination
} from 'antd';
import "./finder.css";

export class FinderModal extends Component {
  render() {
    return (
      <Modal { ...this.props }>
      </Modal>
    );
  }
}

export class Finder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      pageSize: 10,
      page: 1,
      term: "",
      total: 0
    }
  }

  setTerm = ({ target: { value } }) => {
    this.setState({ term: value });
  };

  search = ({ page = this.state.page, pageSize = this.state.pageSize, term = this.state.term } = {}) => {    
    return this.props.query({ page, pageSize, term })
    .then(result => this.setState(result));
  };

  componentDidMount() {
    this.search();
  }

  render() {
    const { page, pageSize, term, total, items } = this.state;

    return (
      <div className="Finder">
        <Input.Search
          placeholder="Search"
          value={ term }
          onChange={ this.setTerm }
          onSearch={ (term) => this.search({ term }) }
        />
        <Table
          columns={ this.props.columns }
          dataSource={ items }
          rowKey="id"
          pagination={ false }
        />
        <Pagination
          current={ page }
          pageSize={ pageSize }
          total={ total }
          onChange={ (page, pageSize) => this.search({ page: page, pageSize }) }
        />
      </div>
    );
  }
}