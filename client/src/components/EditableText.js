import React from "react";

class EditableText extends React.Component {
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
        <input
          autoFocus
          onBlur={(e) => {
            this.props.onBlur(e);
            this.setState({ editing: false });
          }}
          defaultValue={children}
        />
      );
    }

    return (
      <span
        onDoubleClick={() => {
          this.setState({ editing: true });
        }}
      >
        {children}
      </span>
    );
  }
}

export default EditableText;