import React from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import HomeIcon from "../../assets/images/home.svg";
import axios from "axios";
import "./home.css"
function Home(props) {
  return (
    <Container className="home-container">
      <Row>
        <Col md={5} className="home-brand-text-column">
          <h1>PeerCode</h1>
          <h6>
              Are you fed up of writing code in a word document
              over a video call when you need to code with your peers?
          </h6>
          <h6>
            PeerCode is specially made for this purpose.
          </h6>
          <Button
            variant=""
            className="primary-button"
            onClick={async () => {
              const roomId = await generateRoom();
              props.history.push(`/${roomId}`);
            }}
          >
            Create Room
          </Button>
          <Row>
            <small>
              Room link will be automatically copied to your clipboard.
            </small>
          </Row>
        </Col>
        <Col md={7}>
          <Image src={HomeIcon} className="home-icon" alt="Home Banner" />
        </Col>
      </Row>
    </Container>
  );
}

async function generateRoom() {
  try {
    const newRoomKey = await axios.get(
      "http://localhost:5000/generate"
    );
    navigator.clipboard.writeText(
      `http://localhost:3000/${newRoomKey.data.roomId}`
    );
    return newRoomKey.data.roomId;
  } catch(error) {
    console.log(`Server connection error: ${error}`);
  }
}

export default Home;