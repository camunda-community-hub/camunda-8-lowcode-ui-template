import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Organization } from '../store/model';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

function OrganizationComp(orgParam: { organization: Organization }) {
  const dispatch = useDispatch();
  const org = orgParam.organization;
  
  return (
    <>
      <InputGroup className="mb-3">
        <InputGroup.Text>Orgnization name</InputGroup.Text>
        <Form.Control aria-label="Orgnization name" defaultValue={org.name} />
      </InputGroup>
      <Tab.Container id="left-tabs-example" defaultActiveKey="groups">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="groups">Groups</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="users">Users</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="groups">
                groups
              </Tab.Pane>
              <Tab.Pane eventKey="users">
                users
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
}

export default OrganizationComp
