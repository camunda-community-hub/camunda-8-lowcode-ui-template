all: buildfront run

runfront:
	cd src/main/react/tasklist; npm run start

buildall: buildfront package

buildfront:
ifeq ("$(wildcard src/main/react/tasklist/node_modules)","")
	cd src/main/react/tasklist; npm install
endif
	cd src/main/react/tasklist; npm run build
	-rm -rf src/main/resources/static
	cp -r src/main/react/tasklist/build src/main/resources/static
	-rm -rf target

package:
	./mvnw clean package

run:
	./mvnw spring-boot:run

npminstall:
	cd src/main/react/tasklist; npm install

builddockerimage:
	docker build -t camunda-community/camunda-lowcode-ui .

rundockerimage:
	docker run -p 8888:8080 camunda-community/camunda-lowcode-ui
