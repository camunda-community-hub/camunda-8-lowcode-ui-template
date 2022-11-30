import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import FeelEditor from '@bpmn-io/feel-editor';
import api from '../service/api';

function FeelTester() {

  const [contextData, setContextData] = useState<any>({"attribute":0});
  const [feelExpression, setFeelExpression] = useState<string>('');
  const [result, setResult] = useState<any>(null);


  useEffect(() => {
    let div = document.querySelector('#feeleditor');
    div!.innerHTML = '';
    new FeelEditor({
      container: div,
      onChange: onFeelChange,
      variables: getVariables(),
      value: feelExpression
    });
  }, [contextData]);


  const onFeelChange = React.useCallback((value: string) => {
    setFeelExpression(value);
    setResult('');
  }, []);

  const onChange = React.useCallback((value: string, viewUpdate: any) => {
    try {
      setContextData(JSON.parse(value));
      setResult('');
    } catch (err: any) {
    }
  }, []);

  const getVariables = () => {
    let vars = [];
    for (var propt in contextData) {
      vars.push({
        "name": propt,
        "detail": "From the context",
        "info": typeof contextData[propt] + " with value : " + contextData[propt],
      });
    }
    return vars;
  }

  const checkExpression = () => {
    api.post<string[]>('/feel/test', { expression: feelExpression, context: contextData }).then((response:any) => {
      setResult(response.data);
    });
  };

  return (
    <>
        <span className="form-label">Feel expression</span>
        <div className="feelExpression">
          <div className="feelExpIcon">=</div>
          <div id="feeleditor"></div>
        </div>
        <span className="form-label">Feel expression context</span>
        <CodeMirror
          value={JSON.stringify(contextData, null, 2)}
          extensions={[json()]}
          onChange={onChange}
        />
        <br/>
        <Button variant="primary" onClick={checkExpression}><i className="bi bi-bug"></i> test</Button>
        <hr/>
        <span className="form-label">Result</span>
        <CodeMirror
          value={JSON.stringify(result, null, 2)}
          extensions={[json()]}
        />
      </>
  );
}

export default FeelTester;
