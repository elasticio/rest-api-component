# REST API component

The **REST API component** is a simple yet powerful component that allows you to connect to REST APIs without programming your own components and deploying them into the platform.

* [Headers](#headers)
* [Body](#body)
* [Authorisation methods](#authorisation-methods)

In the example below the REST API component is used with our own [REST API service](https://api.elastic.io/docs "elastic.io REST API service") to create a development team.

![alt text](https://cdn.elastic.io/documentation/restapi-component-featuresv2.png "REST API component features")
*Numbers indicate: (1) the supported HTTP methods, (2) the URL of the REST API resource, (3) the HTTP call headers and (4) the body of the HTTP request.*

1. REST API component supports all the HTTP methods of RESTful APIs like `GET`, `PUT`, `POST`, `DELETE` and `PATCH`.
2. The URL of the REST API accepts only JSONata expressions, meaning the URL address should be a `string`.
3. [Headers](#headers)
4. [Body](#body)

## Headers

Use this part to add as many headers as necessary. If REST API requires an [authorisation](#authorisation-methods) then the credentials are submitted in the header as it is shown below.

![alt text](https://cdn.elastic.io/documentation/rest-api-component-headers-get.png "REST API component Headers field")

## Body

When HTTP Method is not `GET` then the Body part is switched on. It is possible to input the body of the HTTP call. The type of body depends on the content type which is `application/json` in the above example. The rendered field Body accepts only JSONata expressions.

The Content type field can have different values and the required Body will be different accordingly:

* `multipart/form-data`
* `application/x-www-form-urlencoded`
* `text/plain`
* `application/json`
* `application/xml`
* `text/xml`
* `text/html`

### Sending JSON data

![alt text](https://cdn.elastic.io/documentation/restapi-component-body-json.png "REST API component Body field")

## Authorisation methods

Before REST API component can be used, authorisation information should be provided. This information is sent in HTTP Request header to the REST API provider. There are 3 available types:

* `No Auth` - used to work with completely open REST APIs
* `Basic Auth` - used to provide login credentials like **username/password**
* `API Key Auth` - used to provide `API Key` to access the resource
