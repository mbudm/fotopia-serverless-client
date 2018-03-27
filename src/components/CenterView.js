import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

export default class CenterView extends Component {
  render() {
    return (
      <Grid fluid>
        <Row >
          <Col xs={10} sm={6} md={4} xsOffset={1} smOffset={3} mdOffset={4}>
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    )
  }
}
