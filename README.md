[![Community Extension](https://img.shields.io/badge/Community%20Extension-An%20open%20source%20community%20maintained%20project-FF4700)](https://github.com/camunda-community-hub/community)
![Compatible with: Camunda Platform 8](https://img.shields.io/badge/Compatible%20with-Camunda%20Platform%208-0072Ce)
[![](https://img.shields.io/badge/Lifecycle-Incubating-blue)](https://github.com/Camunda-Community-Hub/community/blob/main/extension-lifecycle.md#incubating-)

# Low-code Solution Template for Camunda Platform 8 using React, Java and Spring Boot

We've had some customers who would like to offer some "citizen dev tools" to their business users :
- build Forms using drag'n drop tools like [form-js](https://bpmn.io/toolkit/form-js/) but with more components.
- build/adapt mail templates

The goal of this project is to show how to build such a solution with [React](https://reactjs.org/), an [extended form-js](https://github.com/camunda-community-hub/extended-form-js), [Spring-Boot](https://spring.io/projects/spring-boot), [spring-zeebe](https://github.com/camunda-community-hub/spring-zeebe), [tasklist-client](https://github.com/camunda-community-hub/camunda-tasklist-client-java) and [operate-client](https://github.com/camunda-community-hub/camunda-operate-client-java)

## Repository content

This repository contains a Java application template for Camunda Platform 8 using Spring Boot
and a [docker-compose.yaml](docker-compose.yaml) file for local development. For production setups we recommend to use our [helm charts](https://docs.camunda.io/docs/self-managed/platform-deployment/kubernetes-helm/).

- [Documentation](https://docs.camunda.io)
- [Camunda Platform SaaS](https://camunda.io)
- [Getting Started Guide](https://github.com/camunda/camunda-platform-get-started)
- [Releases](https://github.com/camunda/camunda-platform/releases)
- [Helm Charts](https://helm.camunda.io/)
- [Zeebe Workflow Engine](https://github.com/camunda/zeebe)
- [Contact](https://docs.camunda.io/contact/)

It also contains a [React front-end](src/main/react/tasklist/) that you can execute independently (npm run start). This front-end rely on a [customized version of @bpmnio/form-js](https://github.com/camunda-community-hub/extended-form-js). The first time you use the project, you should be able to connect with demo/demo to create new forms, mail templates and manage your user organization.

## Google integration
If you want to send emails through gmail (what is coded for now), you will need to download a [client_secret_google_api.json from your google console] (https://console.cloud.google.com/) and put it in your resources folder.

## First steps with the application

The application requires a running Zeebe engine. You can run Zeebe locally using the instructions below for Docker Compose or have a look at our [recommended deployment options for Camunda Platform](https://docs.camunda.io/docs/self-managed/platform-deployment/#deployment-recommendation.).

Run the application via
```
./mvnw spring-boot:run
```

Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

When you start the application for the first time, an "ACME" organization is created for you with a single user demo/demo with admin rights. When you access the landing page, you'll be able to access the "admin" section where you can [manage forms](https://github.com/camunda-community-hub/extended-form-js), [mail templates](https://github.com/camunda-community-hub/thymeleaf-feel) and your organization.

You can also access the Tasklist section from the welcome page. You'll notice that in processes are listed the latest versions of your deployed processes. In Tasks, you'll find tasks that you can filter (assigned, assignee, group, state). When a new task is available, the Spring Boot backend will push the information to the front-end (ws). To work on a task you should first claim it. If task is assign to someone else, you'll need to unclaim and claim it.

> :information_source: In the application.yml, you'll notice some "exotic" properties that could modify to change application behavior.

## Forms
You can create forms with 3 different approaches :
- Embedded forms into your process definition (classic approach)
- Create Extended Forms from the admin application. Form name should match the formKey. Forms will be stored in the workspace/forms folder.
- Create custom react forms. From the react application, in the forms folder, create your custom forms. You should then reference them in the customForms map in the forms/index.ts file.

Translations will be managed from the backend in the 2 first approaches. Input labels should be references in the Forms translations.
In the 3rd case, translation will be managed from the front-end and translations should be added in the "siteTranslations".

## Using docker-compose

> :information_source: The docker-compose file in this repository uses the latest [compose specification](https://docs.docker.com/compose/compose-file/), which was introduced with docker-compose version 1.27.0+. Please make sure to use an up-to-date docker-compose version.

> :information_source: The Docker required is 20.10.16+

To stand-up a complete Camunda Platform 8 Self-Managed environment locally the [docker-compose.yaml](docker-compose.yaml) file in this repository can be used.

The full enviornment contains these components:
- Zeebe
- Operate
- Tasklist
- Optimize
- Identity
- Elasticsearch
- KeyCloak

Clone this repo and issue the following command to start your environment:

```
docker-compose up -d
```

Wait a few minutes for the environment to start up and settle down. Monitor the logs, especially the Keycloak container log, to ensure the components have started.

Now you can navigate to the different web apps and log in with the user `demo` and password `demo`:
- Operate: [http://localhost:8081](http://localhost:8081)
- Tasklist: [http://localhost:8082](http://localhost:8082)
- Optimize: [http://localhost:8083](http://localhost:8083)
- Identity: [http://localhost:8084](http://localhost:8084)
- Elasticsearch: [http://localhost:9200](http://localhost:9200)
- KeyCloak: [http://localhost:18080](http://localhost:18080)

The workflow engine Zeebe is available using gRPC at `localhost:26500`.

To tear down the whole environment run the following command

```
docker-compose down -v
```

If Optimize, Identity, and Keycloak are not needed you can use the [docker-compose-core.yaml](docker-compose-core.yaml) instead which does not include these components:

```
docker-compose -f docker-compose-core.yaml up -d
```

Zeebe, Operate, Tasklist, along with Optimize require a separate network from Identity as you'll see in the docker-compose file.

In addition to the local environment setup with docker-compose, you can download the [Camunda Desktop Modeler](https://camunda.com/download/modeler/) to locally model BPMN diagrams for execution and directly deploy them to your local environment.

Feedback and updates are welcome!

## Using this template

Fork [this repository](https://github.com/camunda-community-hub/camunda-8-lowcode-ui-template) on GitHub
and rename/refactor the following artifacts:

* `groupId`, `artifactId`, `name`, and `description` in [pom.xml](pom.xml)
* `process/@id` and `process/@name` in [src/main/resources/models/camunda-process.bpmn](src/main/resources/models/camunda-process.bpmn)
* `ProcessConstansts#BPMN_PROCESS_ID` in [src/main/java/org/example/camunda/process/solution/ProcessConstants.java](src/main/java/org/example/camunda/process/solution/ProcessConstants.java)
* Java package name, e.g. `org.example.camunda.process.solution.*`

By forking this project, you can stay connected to improvements that we do to this template and simply pull updates into your fork, e.g. by using GitHub's Web UI or the following commands:

```sh
git remote add upstream git@github.com:camunda-community-hub/camunda-8-lowcode-ui-template.git
git pull upstream main
git push
```
