# REST API component

The **REST API component** is a simple yet powerful component that allows you to connect to any REST API without programming your own components and deploying them into the platform.

*   [Headers](#headers)
*   [Body](#body)
*   [Authorisation methods](#authorisation-methods)

The example below shows the development team creation using the REST API component with our own [REST API service](https://api.elastic.io/docs "elastic.io REST API service").

![alt text](https://cdn.elastic.io/documentation/restapi-component-featuresv2.png "REST API component features")
*Numbers show: (1) HTTP methods, (2) the URL of the REST API resource, (3) the HTTP call headers and (4) the body of the HTTP request.*

1.  REST API component supports `GET`, `PUT`, `POST`, `DELETE` and `PATCH`.
2.  The URL of the REST API accepts JSONata expressions, meaning the URL address should be a `string`.
3.  [Headers](#headers)
4.  [Body](#body)

## Headers

Use this section to add the necessary headers. If the REST API requires an [authorisation](#authorisation-methods) then the credentials are submitted in the header as shown below.

![alt text](https://cdn.elastic.io/documentation/rest-api-component-headers-get.png "REST API component Headers field")

Header fields should be colon-separated name-value pairs in clear-text `string` format. Header value field accepts JSONata expressions therefore, every `string` should be inputted in the double-quotes.

## Body

The body part is available when HTTP method is not `GET`. The body type depends on the content type which is `application/json` in the above example. The rendered Body field accepts JSONata expressions.

The Content type field can have different values and the required Body will be different accordingly:

*   `multipart/form-data`
*   `application/x-www-form-urlencoded`
*   `text/plain`
*   `application/json`
*   `application/xml`
*   `text/xml`
*   `text/html`

### Sending JSON data

Here is how to send a JSON data in the body. The body input part accepts a JSONata expression.

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

## Authorisation methods

Before REST API component can be used, authorisation information should be provided. This information is sent in HTTP request header to the REST API provider. There are 3 available types:

*   `No Auth` - use this method to work with any open REST API
*   `Basic Auth` - use it to provide login credentials like **username/password**
*   `API Key Auth` - use it to provide `API Key` to access the resource
