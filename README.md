# REST API component

The **REST API component** is a simple yet powerful component that allows you to connect to any REST API without programming your own components and deploying them into the platform.

This document covers the following topics:

*   [Introduction](#introduction)
*   [Authorisation methods](#authorisation-methods)
*   [Defining HTTP headers](#defining-http-headers)
*   [Defining request body](#defining-http-body)
*   [Known Limitations](#known-limitations)

## Introduction

The example below shows the development team creation using the REST API component with our own [REST API service](https://api.elastic.io/docs "elastic.io REST API service").

![alt text](https://cdn.elastic.io/documentation/restapi-component-featuresv2.png "REST API component features")
*Numbers show: (1) HTTP methods, (2) the URL of the REST API resource, (3) the HTTP call headers and (4) the body of the HTTP request.*

1.  REST API component supports the following HTTP methods: `GET`, `PUT`, `POST`, `DELETE` and `PATCH`.
2.  The URL of the REST API accepts JSONata expressions, meaning the URL address evaluates [JSONata](http://jsonata.org/) expressions.
3.  Definition of request [headers](#defining-http-headers)
4.  Definition of request [body](#defining-http-body), if the HTTP method is not `GET`

## Authorisation methods

Before REST API component can be used, authorisation information should be provided. This information is sent in HTTP request header to the REST API provider. There are 3 available types:

*   `No Auth` - use this method to work with any open REST API
*   `Basic Auth` - use it to provide login credentials like **username/password**
*   `API Key Auth` - use it to provide `API Key` to access the resource

Please note that the result of creating a credential is an HTTP header automatically placed for you. You can also specify the authorisation in the headers section directly.


## Defining HTTP headers

Use this section to add the request headers.

![alt text](https://cdn.elastic.io/documentation/rest-api-component-headers-get.png "REST API component Headers field")

Each header has a name and a value. Header name should be colon-separated name-value pairs in clear-text `string` format. The header value can use [JSONata](http://jsonata.org/) expressions.

## Defining request body

The body may be defined if the HTTP method is not `GET`. The **body** tab enables configuration options such as the **content type** drop-down menu and the **body input field**.

Here is the list of all supported **content types**:

*   `multipart/form-data`
*   `application/x-www-form-urlencoded`
*   `text/plain`
*   `application/json`
*   `application/xml`
*   `text/xml`
*   `text/html`

The **body input field** changes according to the chosen content type.

### Sending JSON data

Here is how to send a JSON data in the body. Change the **content type** to `application/json` and the **body input part** would change accordingly to accept JSON object. Please note that this field supports [JSONata](http://jsonata.org) expressions.

![alt text](https://cdn.elastic.io/documentation/restapi-component-body-json-var.png "REST API component Body sending JSON data")
*Example shows the JSON in the body where the `name` parameter value is mapped using the value of `project_name` from the previous step of integration.*

### Sending XML data

To send an `XML` data set the content type to `application/xml` or `text/xml` and place the `XML` in the body input field between double-quotes like:

```
"
<note>
  <to>" & fname & "</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>
"
```
Use a JSONata expression to include and map any values coming from the previous steps. It will be replaced with a real value in the final mapping. Note that the rest of `XML` will be passed as a `string`.

### Sending Form data

(content types `application/x-www-form-urlencoded` and `multipart/form-data`)

- [ ] explain the form type
- [ ] give example and a screenshot


## Known Limitations

- [ ] Here we list the limitations

*   HTTP Response code is ignored
*   Can't handle anything else but JSON
*   Can't handle XML Responses
*   Can't handle multi-part responses
*   Ignores and do not store HTTP Response headers
*   Can't handle HTML/Plain-text responses
*   Can't handle redirects

Also check if anything is missing from these:

- [ ] https://github.com/elasticio/rest-api-component/issues/30
- [ ] https://github.com/elasticio/rest-api-component/issues/20
- [ ] https://github.com/elasticio/rest-api-component/issues/14
