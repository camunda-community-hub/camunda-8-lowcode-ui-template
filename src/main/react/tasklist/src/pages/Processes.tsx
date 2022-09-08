import React from 'react';
import Sidebar from '../components/Sidebar';
import InstantiationForm from '../components/InstantiationForm';
import ProcessList from '../components/ProcessList';

function Processes() {

  return (
    <div className="row flex-nowrap">
      <Sidebar>
        <h2>My processes</h2>
        <ProcessList></ProcessList>
      </Sidebar>
      <main className="mainContent col ps-md-2 pt-2">
        <div className="taskListFormContainer">
          <InstantiationForm />
        </div>
      </main>
    </div>
  );
}

export default Processes;