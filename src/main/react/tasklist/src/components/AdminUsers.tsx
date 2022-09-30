import React, { useState, useEffect } from 'react';
import { Organization, IUser } from '../store/model';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Badge from 'react-bootstrap/Badge';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function AdminUsers(orgParam: { organization: Organization }) {
  const [users, setUsers] = useState<IUser[]>(orgParam.organization.users);
  const [userIdx, setUserIdx] = useState<number | null>(orgParam.organization.users.length > 0 ? 0 : null);
  const [user, setUser] = useState<IUser | null>(orgParam.organization.users.length > 0 ? orgParam.organization.users[0] : null);
  const emptyUser: IUser = { username: "", firstname: "", lastname: "", profile: "user", groups: [], password: { value: "", encrypted: false } };
  type ObjectKey = keyof typeof emptyUser;

  const deleteUser = (index: number) => {
    orgParam.organization.users.splice(index, 1);
    setUsers(Object.assign([], orgParam.organization.users));
  }
  const addUser = () => {
    orgParam.organization.users.push(JSON.parse(JSON.stringify(emptyUser)));
    setUsers(Object.assign([], orgParam.organization.users));
  }
  const editUser = (index: number) => {
    setUserIdx(index);
    setUser(orgParam.organization.users[index]);
  }
  const changeUser = (property: ObjectKey, value: any) => {
    orgParam.organization.users[userIdx!]![property] = value;
    setUser(Object.assign({}, orgParam.organization.users[userIdx!]));
  }
  const changePassword = (value: string) => {
    orgParam.organization.users[userIdx!]!.password!.value = value;
    orgParam.organization.users[userIdx!]!.password!.encrypted = false;
    setUser(Object.assign({}, orgParam.organization.users[userIdx!]));
  }
  const updateUser = () => {
    orgParam.organization.users[userIdx!] = user!;
    setUsers(Object.assign([], orgParam.organization.users));
  }
  const addGroupToUSer = (group: string) => {
    if (!orgParam.organization.users[userIdx!].groups.includes(group)) {
      orgParam.organization.users[userIdx!].groups.push(group);
      setUser(Object.assign({}, orgParam.organization.users[userIdx!]));
    }
  }
  const deleteUserGroup = (index: number) => {
    orgParam.organization.users[userIdx!].groups.splice(index, 1);
    setUser(Object.assign({}, orgParam.organization.users[userIdx!]));
  }

  return (
    <Row>
      <Col sm={5}>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th><Button variant="success" onClick={addUser}><i className="bi bi-plus-circle"></i></Button></th>
        </tr>
      </thead>
      <tbody>
        {users ? users.map((user: IUser, index: number) =>
          <tr key={user.username +index }>
            <td>{index}</td>
            <td>{user.username}</td>
            <td><Button variant="info" onClick={() => editUser(index)}><i className="bi bi-pencil"></i></Button><Button variant="danger" onClick={() => deleteUser(index)}><i className="bi bi-trash"></i></Button></td>
          </tr>
        ) : <></>}
      </tbody>
        </Table>
      </Col>
      <Col sm={7}>
        {user ?
          <Card>
            <Card.Body>
              <Card.Title>{user.username}</Card.Title>
              <InputGroup className="mb-3">
                <InputGroup.Text>Username</InputGroup.Text>
                <Form.Control aria-label="Username" value={user.username} onChange={(evt) => changeUser('username', evt.target.value) } />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Firstname</InputGroup.Text>
                <Form.Control aria-label="Firstname" value={user.firstname} onChange={(evt) => changeUser('firstname', evt.target.value)} />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Lastname</InputGroup.Text>
                <Form.Control aria-label="Lastname" value={user.lastname} onChange={(evt) => changeUser('lastname', evt.target.value)} />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Profile</InputGroup.Text>
                <Form.Select aria-label="Profile" value={user.profile} onChange={(evt) => changeUser('profile', evt.target.value)}>
                  <option value="User">User</option>
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </Form.Select>
              </InputGroup>

              <InputGroup className="mb-3">
                <DropdownButton
                  variant="primary"
                  title="Groups"
                >
                  {orgParam.organization.groups ? orgParam.organization.groups.map((group: string, index: number) =>
                    <Dropdown.Item onClick={() =>addGroupToUSer(group)}>{group}</Dropdown.Item>) : <></>}
                </DropdownButton>
                <div className="userGroupList">
                  {user ? user.groups.map((group: string, index: number) => <Badge bg="primary">{group} <i className="bi bi-x" onClick={() => deleteUserGroup(index) }></i></Badge> ) : <></>}
                </div>
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Password</InputGroup.Text>
                <Form.Control type="password" aria-label="Password" value={user.password!.value} onChange={event => changePassword(event.target.value)} />
              </InputGroup>
              <Button variant="primary" onClick={updateUser}>Validate</Button>
            </Card.Body>
          </Card>
          : <></>
        }
      </Col>
      </Row>
  );
}

export default AdminUsers
