import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Panel,
  ButtonToolbar,
  Button,
  Form,
  Glyphicon,
  Row
} from 'react-bootstrap';

import { DELETE_FOTO } from '../constants/actions';

import './detailHeader.css';


export class DetailHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    return (<div className="detail-tools">
        {!this.state.isOpen && this.renderClosed()}
        {this.state.isOpen && this.renderOpen()}
      </div>
    );
  }

  renderClosed(){
    return (
    <div>
       <Button
        onClick={this.toggleHeader}
        className="pull-right">
        Edit
      </Button>
    </div>);
  }

  renderOpen(){
   return (<Panel>
      <Form horizontal className="panel-body">
        <ButtonToolbar>
            <Glyphicon glyph="remove" onClick={this.toggleHeader} className="pull-right"/>
        </ButtonToolbar>
        <Row>
          <p>edit metadata here</p>
        </Row>
        <ButtonToolbar className="pull-right">
          <Button onClick={this.toggleHeader} > Close</Button>
          <Button onClick={this.handleDelete} bsStyle="danger"> Delete Image</Button>
          <Button onClick={this.handleSave} bsStyle="primary"> Update Image</Button>
        </ButtonToolbar>
      </Form>
    </Panel>);
  }

  handleDelete = (e) => {
    e.preventDefault();
    this.props.onDelete(this.props.fotoid);
    this.toggleHeader()
  }

  handleSave = (e) => {
    e.preventDefault();
    this.toggleHeader()
  }

  toggleHeader = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
}


const mapDispatchToProps = dispatch => {
  return {
    onDelete(payload) {
      dispatch({
        type: DELETE_FOTO,
        payload
      });
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(DetailHeader);


