import React, { useState, useEffect } from 'react';
import { Modal, Button, InputGroup, Form } from 'react-bootstrap';
import { env } from '../env';

import { useTranslation } from "react-i18next";

function UploadedDoc(props: any) {
  const { t } = useTranslation();
  const [showVisualization, setShowVisualization] = useState(false);


  return (
    props.file ?
    <>
      <Form.Label>{props.file.type} : </Form.Label> <i>{props.file.comment}</i>
        <InputGroup className="mb-3" onClick={() => setShowVisualization(true) }>
        <Form.Control value={props.file.filename} type="text" readOnly />
                  <InputGroup.Text><i className="bi bi-eye"></i></InputGroup.Text>
      </InputGroup>
        <Modal show={showVisualization} onHide={() => setShowVisualization(false) } size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{props.file.type} : {props.file.filename}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showVisualization ?
              <iframe src={env.backend + "/api/file/doc/" + props.file.processInstanceKey + "/" + props.file.type + "/" + props.file.filename} className="previewDocFrame"/>
              : <></>}
          </Modal.Body>
          <Modal.Footer>
            
            <Button variant="secondary" onClick={() => setShowVisualization(false)}>
              {t("Close")}
            </Button>
          </Modal.Footer>
      </Modal>
      </>
        :<></>
  )

}

export default UploadedDoc;


