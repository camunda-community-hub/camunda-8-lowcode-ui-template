import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {} from 'redux-thunk/extend-redux';
import processService from '../service/ProcessService';

function Sidebar(props:any) {
  return (
    <div className="col-auto px-0">
      <div id="sidebar" className="border-end">
        <div id="sidebar-nav" className="list-group bg-secondary border-0 rounded-0 text-sm-start">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;