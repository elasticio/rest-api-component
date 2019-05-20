# REST API component

The **REST API component** is a simple yet powerful component that allows you to connect to any REST API without programming your own components and deploying them into the platform.

The REST API component will perform a single REST API call when executed. Incoming data can gets used to configure the API call made and the response from the API call will be the output.

This document covers the following topics:

*   [Introduction](#introduction)
*   [Enable debug logging](#enable-debug-logging)
*   [Authorisation methods](#authorisation-methods)
*   [Defining HTTP headers](#defining-http-headers)
*   [Defining request body](#defining-request-body)
*   [Working with XML Response](#working-with-xml)
*   [HTTP Headers in Response](#http-headers)
*   [Redirection](#redirection)
*   [Attachments](#attachments)
*   [Exception handling](#exception-handling)
*   [Known Limitations](#known-limitations)

## Introduction

The example below shows the development team creation using the REST API component with our own [REST API service](https://api.elastic.io/docs "elastic.io REST API service").


![alt text](https://user-images.githubusercontent.com/18464641/58006176-1be14a80-7af0-11e9-9904-f62607106f27.jpg "REST API component features")
*Numbers show: (1) Configuration options, (2) follow redirect mode, (3) the URL and method of the REST API resource, (4) the HTTP call headers.*

1. Configuration options
 * ``Don`t throw Error on Failed Calls`` - if enabled return error, error code and stacktrace in message body otherwise throw error in flow.
 * ``Split Result if it is an Array`` - if enabled and response is array, creates message for each item of array. Otherwise create one message with response array. 
 * ``Enable debug logging`` - The component supports extended logging. `Enable debug logging` checkbox should be enabled for it. After that you may check your logs in the logs console. 
    *Note:* in case of using **ordinary flows**, adding of `DEBUG` environment variable in component repository will override disabled `Enable debug logging` checkbox during flow run, so all logs will be extended until an environment variable is removed.
2. ``Follow redirect mode`` - If you want disable Follow Redirect functionality, you can use option ``Follow redirect mode``.By default ``Follow redirect mode`` option has value ``Follow redirects``.
3.  HTTP methods and URL
 * REST API component supports the following HTTP methods: `GET`, `PUT`, `POST`, `DELETE` and `PATCH`.
 * The URL of the REST API accepts JSONata expressions, meaning the URL address evaluates [JSONata](http://jsonata.org/) expressions.
3. Request Headers and Body
 * Definition of request [headers](#defining-http-headers)
 * Definition of request [body](#defining-http-body), if the HTTP method is not `GET`

## Authorisation methods

To use the REST API component with any restricted access API provide the authorisation information.

![alt text](https://cdn.elastic.io/documentation/restapi-component-auth.png "REST API component Basic authorisation")
*Example above shows how to add the username/password to access the API during the integration flow design.*

You can add the authorisation methods during the integration flow design or by going to your `Settings > Security credentials > REST client` and adding there.

REST API component supports 3 authorisation types:

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
*Example shows the JSON in the body where the `name` parameter value gets mapped using the value of `project_name` from the previous step of integration.*

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
Use a JSONata expression to include and map any values coming from the previous steps. It will replace the variable with a real value in the final mapping. Note that the rest of `XML` gets passed as a `string`.

### Sending Form data

To send a form data two content types are available:

*   `application/x-www-form-urlencoded` - used to submit simple values to a form
*   `multipart/form-data` - used to submit (non-alphanumeric) data or file attachment in payload

In both cases the payload gets transmitted in the message body.

In case of `application/x-www-form-urlencoded` content type add the necessary parameters by giving the name and the values like:

![alt text](https://cdn.elastic.io/documentation/restapi-component-body-form-simple.png "REST API component Body sending a simple form")
*Please note that parameter value fields support [JSONata](http://jsonata.org) expressions.*

This HTTP request would submit `key1=value1&key2=value2` in the message body.

In case of `multipart/form-data` content type add the parameters similarly.

![alt text](https://cdn.elastic.io/documentation/restapi-component-body-form-complex.png "REST API component Body sending a complex form")

The transmitted HTTP request body would be:

```
--__X_ELASTICIO_BOUNDARY__
Content-Disposition: form-data; name="part1"

Please note that this fields supports [JSONata](http://jsonata.org) expressions.
--__X_ELASTICIO_BOUNDARY__
Content-Disposition: form-data; name="part2"

<p>Some more text</p>
--__X_ELASTICIO_BOUNDARY__--
```

Notice how different parts get separated by the boundary. This form is capable of supporting attachments as well.

### Working with XML

This component will try to parse XML content types in the HTTP Response assuming the `Content-Type` header has a
**MIME Content Type** with `xml` in it (e.g. `application/xml`). 
In this case response body will be parsed to JSON using `xml2js` node library and following settings:

```js
{
    trim: false,
    normalize: false,
    explicitArray: false,
    normalizeTags: false,
    attrkey: '_attr',
    tagNameProcessors: [
        (name) => name.replace(':', '-')
    ]
}
```

for more information please see the 
[Documenattion of XML2JS library](https://github.com/Leonidas-from-XIV/node-xml2js#options)

## HTTP Headers 

You can to get HTTP response header only if ``Don`t throw Error on Failed Calls`` option is checked.
In this case output structure of component will be: 
```js
    {
      headers:<HTTP headers>,
      body:<HTTP response body>,
      statusCode:<HTTP response status code>
      statusMessage:<HTTP response status message>
    }
```

## Attachments
Rest API component has opportunity of binary data sending. You just need choose ``multipart/form-data`` Content type and attachments from input message will be included to the request payload automatically.

Rest-api component automatically load binary data to attachments with next content types in response headers:
* image/*
* text/csv
* application/msword
* application/msexcel
* application/pdf
* application/octet-stream

## Exception handling
Rest API component uses exception handling logic below: 
![Exception handling logic](https://user-images.githubusercontent.com/13310949/41960520-9bd468ca-79f8-11e8-83f4-d9b2096deb6d.png)

## Known Limitations

The component can parse any of json and xml content types. 
There are:
* application/json
* application/xml
* text/xml
* etc.

`If content type is not  exists  in response header, component will try parse response as json. 
If it get parse exception, it return response as is.`

> Make sure not to perform your tests using the [requestb.in](https://requestb.in/) since it responds with the `content-type: text/html`.

Here are some further limitation of the REST API component:

*   The component can't handle multi-part responses
