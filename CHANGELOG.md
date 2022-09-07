## TODO

- update vue tasklist to use websockets
- reactjs: use customized version of forms-ui
- implement candidate groups in user task job worker
- if process has a start form, show the start form
- implement web socket server side error handling
- todo apply auto formatting maven plugin
- use bulma variables to create custom Camunda theme
- reactjs: implement "waiting" dialog
- reactjs: implement routing
- reactjs: remove form-io buttons from forms if they exist, use custom buttons instead

## August 2022, Version 1.1.0-SNAPSHOT

- added UserTaskWorker that pushes User Task Instance information via web sockets
- camunda forms are read from bpmn file rather than calling operate api because operate api can be too slow
- note that because forms are read from bpmn files, the bpmn file names must match both the process names and process
  ids. This can be improved, but it's a small hack that makes it easy to find bpmn files for quickly loading form schemas.
- when task is received from UserTaskWorker, it is completed using Zeebe Client (using jobkey) because the graphql
  can be too slow
- Added reactjs sample app in `src/main/react`.
- configured pom.xml to build and deploy react app, now available here: http://localhost:8080/react/index.html
- added "formSchema" field to the Task Model. this makes it easier to get form schema over websockets
- removed unused constants file
- during development, now able to edit static files without restart using spring boot `dev` profile

## August 2022, Version 1.0.0-SNAPSHOT

- cloned original project which contained vue app able to edit and show user task forms
