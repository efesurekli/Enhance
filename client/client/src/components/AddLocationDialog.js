import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class AddLocationDialog extends React.Component {
  state = {
    inputValidated: false,
    messageText: ''
  };

  handleMessageChange(evt) {
    const messageText = evt.target.value;
    
    this.setState({ messageText, inputValidated: messageText.length > 5 });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.onClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={!this.state.inputValidated}
        onTouchTap={() => this.props.onSubmit(this.state.messageText)}
      />,
    ];

    return (
      <Dialog
        title="Add Message"
        actions={actions}
        modal={true}
        open={this.props.open}>
        <TextField
          hintText="Pick up laundry"
          floatingLabelText="Your breadcrumb message"
          multiLine={true}
          onChange={this.handleMessageChange.bind(this)}
          rows={2}
        />
      </Dialog>
    );
  }
}

const T = React.PropTypes;
AddLocationDialog.propTypes = {
  onSubmit: T.func,
  onClose: T.func,
  open: T.bool
};
