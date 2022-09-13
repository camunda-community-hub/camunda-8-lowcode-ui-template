import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminService from '../service/AdminService';
import { Organization } from '../store/model';
import AdminOrganization from '../components/AdminOrganization'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';

function AdminUsers() {

  const dispatch = useDispatch();
  const organizations = useSelector((state: any) => state.admin.organizations)

  useEffect(() => {
    dispatch(adminService.getOrganizations());
  });

  const addOrg = () => {
    dispatch(adminService.addOrganization());
  }

  return (
    <>
      <Button variant="primary" onClick={addOrg} className="addOrg"><i className="bi bi-plus-circle"></i> Add Org</Button>
      <Tabs
        id="orgTabs"
        className="mb-3">
        {organizations ? organizations.map((org: Organization, index:number) =>
          <Tab key={index} eventKey={index} title={org.oldname} tabClassName={org.active ? 'bi bi-check-lg' : ''}>
            <AdminOrganization organization={org} />
          </Tab>
        ) : <></>}
      </Tabs>
    </>
  );
}

export default AdminUsers;
