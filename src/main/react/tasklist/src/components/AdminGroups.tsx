import React, { useState, useEffect } from 'react';
import { Organization } from '../store/model';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useTranslation } from "react-i18next";

function AdminGroups(orgParam: { organization: Organization }) {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<string[]>(orgParam.organization.groups);

  const changeGroupName = (index: number, value: string) => {
    orgParam.organization.groups[index] = value;
  }
  const deleteGroup = (index: number) => {
    orgParam.organization.groups.splice(index, 1);
    setGroups(Object.assign([], orgParam.organization.groups));
  }
  const addGroup = () => {
    orgParam.organization.groups.push("");
    setGroups(Object.assign([],orgParam.organization.groups));
  }
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>{t("Group name")}</th>
          <th><Button variant="success" onClick={addGroup}><i className="bi bi-plus-circle"></i></Button></th>
        </tr>
      </thead>
      <tbody>
        {groups ? groups.map((group: string, index: number) =>
          <tr key={ group+index }>
            <td>{index}</td>
            <td><Form.Control aria-label="group name" defaultValue={group} onChange={event => changeGroupName(index, event.target.value)} /></td>
            <td><Button variant="danger" onClick={() => deleteGroup(index)}><i className="bi bi-trash"></i></Button></td>
          </tr>
        ) : <></>}
      </tbody>
    </Table>
  );
}

export default AdminGroups
