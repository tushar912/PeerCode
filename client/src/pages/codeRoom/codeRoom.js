import React, { Component } from "react";
import {
  Container, Row, Col,
} from "react-bootstrap";
import io from "socket.io-client";
import { UnControlled as CodeMirror } from "react-codemirror2-react-17";
import generateColorCode from "../../utilities/generateColorCode";
import NameModal from "../../components/nameModal/nameModal";
import MessageBox from "../../components/messageBox/messageBox";
import VoiceEnabler from "../../components/voiceEnabler/voiceEnabler";
import "./codeRoom.css"

class CodeRoom extends Component {
  socket = io("http://localhost:5000");
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "",
        colorCode: "",
      },
      showNameModal: true,
      codeString: "",
      connectedSockets: undefined,
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.socket.on("connect", () => {
      this.socket.emit("joinRoom", String(params.id));
    });
    this.socket.on("countSockets", (connectedSockets) => {
      this.setState({ connectedSockets });
    });
    this.socket.on("newCode", (codeString) => {
      this.setState({ codeString });
    });
  }

  componentDidUpdate() {
    const {
      match: { params },
    } = this.props;
    if(this.state.connectedSockets > 2) {
      this.socket.emit("leaveRoom", String(params.id));
      this.props.history.push("/");
    }
  }

  componentWillUnmount() {
    const {
      match: { params },
    } = this.props;
    this.socket.emit("leaveRoom", String(params.id));
  }

  saveName = (userName) => {
    if (userName.length > 0) {
      const newColorCode = generateColorCode();
      this.setState({ 
        user: {
          name: userName,
          colorCode: newColorCode,
        },
        showNameModal: false,
      });
    }
  }

  render() {
    const {
      match: { params },
    } = this.props;
    return (
      <Container fluid>
        <Row>
          <Col>
            <h3 className="brand-small-text">PeerCode</h3>
          </Col>
        </Row>
        <Row className="main-functionality-container">
          <Col md={8}>
            <CodeMirror
              className="codemirror-container"
              value={this.state.codeString}
              options={{
                theme: "xq-light",
                lineNumbers: true,
              }}
              onChange={(editor, data, value) => {
                if (this.state.codeString !== value) {
                  this.setState({
                    codeString: value,
                  });
                  this.socket.emit("syncCode", {
                    codeRoom: String(params.id),
                    codeString: value,
                  });
                }
              }}
            />
          </Col>
          <Col md={4}>
            {this.state.connectedSockets !== undefined &&
              this.state.connectedSockets < 3 && (
                <VoiceEnabler
                  socket={this.socket}
                  codeRoom={params.id}
                  connectedSockets={this.state.connectedSockets}
                />
              )}
            <MessageBox
              user={this.state.user}
              socket={this.socket}
              codeRoom={params.id}
            />
          </Col>
        </Row>
        <NameModal
          showNameModal={this.state.showNameModal}
          onFormSubmit={this.saveName}
        />
      </Container>
    );
  }
}

export default CodeRoom;