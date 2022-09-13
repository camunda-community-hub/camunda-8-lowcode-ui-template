import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Organization } from '../store/model';
import adminService from '../service/AdminService';
import AdminGroups from './AdminGroups'
import AdminUsers from './AdminUsers'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';

function AdminOrganization(orgParam: { organization: Organization }) {
  const dispatch = useDispatch();
  const org = JSON.parse(JSON.stringify(orgParam.organization));

  const setActive = () => {
    dispatch(adminService.setActive(org));
  }
  const save = () => {
    dispatch(adminService.save(org));
  }

  const changeName = (value: string) => {
    org.name = value;
  }

  return (
    <>
      {org.active ? <></> : <Button variant="primary" onClick={setActive}><i className="bi bi-check-lg"></i> Set as active</Button>}
      <Button variant="primary" onClick={save}><i className="bi bi-hdd"></i> Save</Button>
      <InputGroup className="mb-3">
        <InputGroup.Text>Orgnization name</InputGroup.Text>
        <Form.Control aria-label="Orgnization name" defaultValue={org.name} onChange={event => changeName(event.target.value)} />
      </InputGroup>
      <Tab.Container id="left-tabs-example" defaultActiveKey="users">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="users">Users</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="groups">Groups</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="users">
                <AdminUsers organization={org} />
              </Tab.Pane>
              <Tab.Pane eventKey="groups">
                <AdminGroups organization={ org }/>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
}

export default AdminOrganization
