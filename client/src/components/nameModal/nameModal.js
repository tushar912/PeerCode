import React, { Component } from "react";
import { Container, Row, Col, Modal, Form, Button } from "react-bootstrap";
import onFieldChange from "../../utilities/onFieldChange";
import "./nameModal.css"

class NameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
    };
  }

  render() {
    return (
      <Modal show={this.props.showNameModal} centered>
        <Modal.Header>
          <Modal.Title>
            <Container>
              <Row>
                <Col xs={12}>
                  <h1 className="modal-heading">Enter Details</h1>
                </Col>
              </Row>
            </Container>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12}>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.props.onFormSubmit(this.state.userName);
                  }}
                >
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      onChange={(e) => this.setState(onFieldChange(e))}
                      type="text"
                      name="userName"
                      value={this.state.userName}
                    />
                  </Form.Group>
                  <Button
                    variant=""
                    className="secondary-button"
                    type="submit"
                    disabled={this.state.userName.length === 0}
                  >
                    Continue
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    );
  }
}

export default NameModal;