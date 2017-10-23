# REST API component

The **REST API component** is a simple yet powerful component that allows you to connect to REST APIs without programming your own components and deploying them into the platform.

*   [Headers](#headers)
*   [Body](#body)
*   [Authorisation methods](#authorisation-methods)

In the example below the REST API component is used with our own [REST API service](https://api.elastic.io/docs "elastic.io REST API service") to create a development team.

![alt text](https://cdn.elastic.io/documentation/restapi-component-featuresv2.png "REST API component features")
*Numbers indicate: (1) the supported HTTP methods, (2) the URL of the REST API resource, (3) the HTTP call headers and (4) the body of the HTTP request.*

1.  REST API component supports all the HTTP methods of RESTful APIs like `GET`, `PUT`, `POST`, `DELETE` and `PATCH`.
2.  The URL of the REST API accepts only JSONata expressions, meaning the URL address should be a `string`.
3.  [Headers](#headers)
4.  [Body](#body)

## Headers

Use this part to add as many headers as necessary. If REST API requires an [authorisation](#authorisation-methods) then the credentials are submitted in the header as it is shown below.

![alt text](https://cdn.elastic.io/documentation/rest-api-component-headers-get.png "REST API component Headers field")

Header fields should only be colon-separated name-value pairs in clear-text `string` format. Header value field accepts JSONata expressions therefore, every `string` should be inputted in the double-quotes.

## Body

When HTTP Method is not `GET` then the Body part is switched on. It is possible to input the body of the HTTP call. The type of body depends on the content type which is `application/json` in the above example. The rendered field Body accepts only JSONata expressions.

The Content type field can have different values and the required Body will be different accordingly:

*   `multipart/form-data`
*   `application/x-www-form-urlencoded`
*   `text/plain`
*   `application/json`
*   `application/xml`
*   `text/xml`
*   `text/html`

### Sending JSON data

Here is how to send a JSON data in the body. The body input part will be validated as a JSONata expression.

![alt text](https://cdn.elastic.io/documentation/restapi-component-body-json-var.png "REST API component Body sending JSON data")
*Example shows the JSON in the body where the value of the `name` parameter is mapped using the value of `project_name` from the previous step of integration.*

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
Use a JSONata expression to include and map any values coming from the previous steps as it is done with `fname` field in above example. In the final mapping it will be replaced with a value. Note that the rest of `XML` will be passed as a `string`.

## Authorisation methods

Before REST API component can be used, authorisation information should be provided. This information is sent in HTTP Request header to the REST API provider. There are 3 available types:

*   `No Auth` - used to work with completely open REST APIs
*   `Basic Auth` - used to provide login credentials like **username/password**
*   `API Key Auth` - used to provide `API Key` to access the resource
