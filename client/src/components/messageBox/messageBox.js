import React, { Component } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import onFieldChange from "../../utilities/onFieldChange";
import "./messageBox.css"
class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messageList: [],
    };
  }

  componentDidMount() {
    this.props.socket.on("newMessage", (messageData) => {
      this.setState({
        messageList: [
          ...this.state.messageList,
          {
            user: {
              name: messageData.user.name,
              colorCode: messageData.user.colorCode,
            },
            message: messageData.message,
          },
        ],
      });
    });
  }

  onMessageSubmit = (e) => {
    e.preventDefault();
    this.setState({
      messageList: [
        ...this.state.messageList,
        {
          user: {
            name: this.props.user.name,
            colorCode: this.props.user.colorCode,
          },
          message: this.state.message,
        },
      ],
      message: "",
    });
    this.props.socket.emit("newMessage", {
      user: {
        name: this.props.user.name,
        colorCode: this.props.user.colorCode,
      },
      codeRoom: this.props.codeRoom,
      message: this.state.message,
    });
    this.scrollToBottom();
  };

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    return (
      <Row>
        <Col xs={12}>
          <Row className="center-row message-input-row">
            <Col xs={12} className="message-list">
              {this.state.messageList.map((message, index) => (
                <Row key={index}>
                  <Col className="message-container">
                    <h6 style={{ color: message.user.colorCode }}>
                      {message.user.name}
                    </h6>
                    <p>{message.message}</p>
                  </Col>
                </Row>
              ))}
              <div
                ref={(el) => {
                  this.el = el;
                }}
              />
            </Col>
            <Col xs={12}>
              <Form onSubmit={this.onMessageSubmit}>
                <Form.Group controlId="messageFormBasicText">
                  <Form.Control
                    onChange={(e) => this.setState(onFieldChange(e))}
                    type="text"
                    as="textarea"
                    rows={1}
                    name="message"
                    placeholder="Discuss here"
                    value={this.state.message}
                  />
                </Form.Group>
                <Row className="message-submit-button-container">
                  <Col>
                    <Button
                      variant=""
                      className="secondary-button message-button"
                      type="submit"
                      disabled={this.state.message.length === 0}
                    >
                      Send
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default MessageBox;