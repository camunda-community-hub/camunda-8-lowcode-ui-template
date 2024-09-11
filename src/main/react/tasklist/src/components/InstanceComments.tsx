import React, { useState, useEffect } from 'react';
import { IInstanceViewer } from '../store/model';
import api from '../service/api';
import { Form, InputGroup, Table, Button } from 'react-bootstrap';


function InstanceComments(props: IInstanceViewer) {
  const [comments, setComments] = useState<any[]>([]);


  useEffect(() => {
    if (props && props.instancekey) {
      loadComments();
    }
  }, [props.instancekey]);

  const submitComment = () => {
    let value = (document.getElementById("newComment") as HTMLInputElement)!.value;
    api.post('/process/comments/' + props.instancekey, { "content": value }).then((response: any) => {
      setComments(response.data);
    }).catch((error: any) => {
      alert(error.message);
    })
  }

  const loadComments = () => {
    api.get('/process/comments/' + props.instancekey).then((response: any) => {
      setComments(response.data);
    }).catch((error: any) => {
      alert(error.message);
    })
  }


  return (
    <>
      <InputGroup>
        <InputGroup.Text>New comment</InputGroup.Text>
        <Form.Control id="newComment" as="textarea" />
        <Button variant="primary" onClick={submitComment}> <i className="bi bi-send"></i> Send</Button>
      </InputGroup>
      <hr />
      <Table striped hover variant="light">
        <thead >
          <tr >
            <th className="bg-primary text-light">Author</th>
            <th className="bg-primary text-light">Comment</th>
            <th className="bg-primary text-light">Date</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment: any, index: number) =>
            <tr key={index} >
              <td> {comment.author} </td>
              <td> {comment.comment} </td>
              <td> {comment.date} </td>
            </tr>

          )}
        </tbody>
      </Table>
    </>
  );
}

export default InstanceComments;
