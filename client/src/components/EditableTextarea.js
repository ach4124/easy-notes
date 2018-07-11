import React from "react";

class EditableTextarea extends React.Component {
  constructor() {
    super();
    this.state = {
      editing: false
    };
  }

  render() {
    const { children } = this.props;
    const { editing } = this.state;

    if (editing) {
      return (
        <textarea
          id="note"
          rows="10" cols="40"
          autoFocus
          onBlur={(e) => {
            this.props.onBlur(e);
            this.setState({editing: false});
          }}
          onFocus={this.props.onFocus}
          defaultValue={children}
          required
        />
      );
    }

    return (
      <pre
        onDoubleClick={() => {
          this.setState({ editing: true });
        }}
      >
        {children}
      </pre>
    );
  }
}

export default EditableTextarea;