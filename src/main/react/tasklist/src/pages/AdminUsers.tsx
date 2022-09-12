import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminService from '../service/AdminService';
import { Organization } from '../store/model';

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
    organizations ?
    <div>
      <ul className="nav nav-tabs" id="orgTabs" role="tablist">
        {organizations.map((org: Organization) =>
          <li className="nav-item" role="presentation">
            <button className="nav-link active" data-bs-toggle="tab" data-bs-target={'#'+org.name} type="button" role="tab" aria-controls={org.name} aria-selected="true">{org.name}</button>
          </li>
        )}
        <li className="nav-item" role="presentation">
            <button className="nav-link" type="button" role="tab" onClick={ addOrg }> + Organization</button>
      </li>
    </ul>
      <div className="tab-content" id="myTabContent">
        {organizations.map((org: Organization) =>
          <div className="tab-pane fade show active" id={org.name} role="tabpanel" aria-labelledby={org.name + '-tab'}>pouzr</div>
        )}
    </div>
      </div>
      :<></>
  );
}

export default AdminUsers;
