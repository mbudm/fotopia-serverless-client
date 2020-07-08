import React, { Component } from "react";
import {
  ButtonToolbar,
  Button,
  Glyphicon
} from "react-bootstrap";

export class SearchHeaderClosed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      criteria: props.currentFilters.criteria
    };
  }

  render() {
    const { currentFilterLabels, toggleFilter } = this.props;
    return (
      <div>
        <Button onClick={toggleFilter} className="pull-right">
          Filter
        </Button>
        {currentFilterLabels.length > 0 &&
          this.renderFilterLabels(currentFilterLabels)}
      </div>
    );
  }

  renderFilterLabels = filters => (
    <ButtonToolbar>
      {filters.map(filter => (
        <Button
          bsSize="xsmall"
          key={filter.key}
          data-group={filter.group}
          data-key={filter.key}
          onClick={this.handleFilterButtonClick}
        >
          {filter.label} <Glyphicon glyph="remove" />
        </Button>
      ))}
    </ButtonToolbar>
  );

  removeFromGroup = (key, group) => {
    const existingGroup = this.state.criteria[group];
    return existingGroup.includes(key)
      ? existingGroup.filter(k => k !== key)
      : [...existingGroup];
  };

  handleFilterButtonClick = e => {
    e.preventDefault();
    const { group, key } = e.currentTarget.dataset;
    const filtersUpdate = {
      ...this.state.criteria,
      [group]: this.removeFromGroup(key, group)
    };
    this.setState({
      criteria: filtersUpdate
    });
    this.props.onSearch({criteria: filtersUpdate});
  };
}

export default SearchHeaderClosed;
