import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Organization } from '../store/model';
import adminOrgService from '../service/AdminOrgService';
import AdminGroups from './AdminGroups'
import AdminUsers from './AdminUsers'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import { useTranslation } from "react-i18next";

function AdminOrganization(orgParam: { organization: Organization }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const org = JSON.parse(JSON.stringify(orgParam.organization));

  const setActive = () => {
    dispatch(adminOrgService.setActive(org));
  }
  const save = () => {
    dispatch(adminOrgService.save(org));
  }

  const changeName = (value: string) => {
    org.name = value;
  }

  return (
    <div className="organizationContainer">
      <Row>
        <Col>
          <InputGroup className="mb-3">
            <InputGroup.Text>{t("Organization name")}</InputGroup.Text>
            <Form.Control aria-label="Orgnization name" defaultValue={org.name} onChange={event => changeName(event.target.value)} />
          </InputGroup>
        </Col>
        <Col>
          {org.active ? <></> : <Button variant="primary" onClick={setActive}><i className="bi bi-check-lg"></i> {t("Set as active")}</Button>}
          <Button variant="primary" onClick={save}><i className="bi bi-hdd"></i> {t("Save")}</Button>
        </Col>
      </Row>
      <Tab.Container id="left-tabs-example" defaultActiveKey="users">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="users">{t("Users")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="groups">{t("Groups")}</Nav.Link>
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
    </div>
  );
}

export default AdminOrganization
