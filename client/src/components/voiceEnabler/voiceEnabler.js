import React, { Component } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { ReactComponent as UnmuteMicIcon } from "../../assets/images/micMute.svg";
import { ReactComponent as MuteMicIcon } from "../../assets/images/mic.svg";
import { ReactComponent as UnmuteSpeakerIcon } from "../../assets/images/speakerMute.svg";
import { ReactComponent as MuteSpeakerIcon } from "../../assets/images/speaker.svg";
import "./voiceEnabler.css"
const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();
let myStream;

class VoiceEnabler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onMute: false,
      remoteMute: false,
    };
  }

  componentDidMount() {
    navigator.getUserMedia(
      { video: false, audio: true },
      async (stream) => {
        myStream = stream;
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
        peerConnection.onicecandidate = (e) => {
          if (e && e.candidate) {
            this.props.socket.emit("iceConnection", {
              type: "iceCandidate",
              candidate: e.candidate,
              codeRoom: this.props.codeRoom,
            });
          }
        }
        peerConnection.ontrack = (e) => {
          this.audio.srcObject = e.streams[0];
        };
        if (this.props.connectedSockets !== 1) {
          await initiateCall(this.props.socket, this.props.codeRoom);
        }
        await receiveCall(this.props.socket, this.props.codeRoom);
        await iceConnection(this.props.socket);
        await connectCall(this.props.socket, this.props.codeRoom);
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  setOnMute = (stream, isRemote=false) => {
    if (isRemote) {
      this.setState({ remoteMute: !this.state.remoteMute });
    } else {
      stream.getTracks().forEach((track) => {
        track.enabled = !track.enabled;
        this.setState({ onMute: !this.state.onMute });
      });
    }
  }

  render() {
    return (
      <Row>
        <Col>
          <Row className="center-row voice-enabler-row">
            <Col xs={6}>
              <Button
                onClick={() => {
                  this.setOnMute(myStream);
                }}
                variant=""
                className="mute-button"
              >
                {this.state.onMute ? (
                  <UnmuteMicIcon fill="white" />
                ) : (
                  <MuteMicIcon fill="white" />
                )}
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                onClick={() => {
                  this.setOnMute(null, true);
                }}
                variant=""
                className="mute-button"
              >
                {this.state.remoteMute ? (
                  <UnmuteSpeakerIcon fill="white" />
                ) : (
                  <MuteSpeakerIcon fill="white" />
                )}
              </Button>
            </Col>
          </Row>
        </Col>
        <audio
          autoPlay
          ref={(audio) => {
            this.audio = audio;
          }}
          muted={this.state.remoteMute}
        ></audio>
      </Row>
    );
  }
}

async function iceConnection(socket) {
  socket.on("iceConnection", async (iceData) => {
    const newCandidate = new RTCIceCandidate(iceData.candidate);
    await peerConnection.addIceCandidate(newCandidate);
  });
}

async function initiateCall(socket, codeRoom) {
  const newConnection = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(
    new RTCSessionDescription(newConnection)
  );
  socket.emit("initiateCall", {
    offerId: socket.id,
    newConnection,
    codeRoom,
  });
}

async function receiveCall(socket, codeRoom, peer) {
  socket.on("receiveCall", async (callData) => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(callData.newConnection)
    );
    const callBack = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(
      new RTCSessionDescription(callBack)
    );
    
    socket.emit("callBack", {
      offerId: callData.offerId,
      callBack,
      codeRoom,
    });
  });
}

async function connectCall(socket, codeRoom) {
  socket.on("connectCall", async (callData) => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(callData.callBack)
    );
  });
}

export default VoiceEnabler;