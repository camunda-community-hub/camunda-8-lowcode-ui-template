import React from 'react';
import Sidebar from '../components/Sidebar';
import InstantiationForm from '../components/InstantiationForm';
import ProcessList from '../components/ProcessList';

import { useTranslation } from "react-i18next";

function Processes() {
  const { t } = useTranslation();

  return (
    <div className="row flex-nowrap">
      <Sidebar>
        <h2 className="text-primary">{t("My processes")}</h2>
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
