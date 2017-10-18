# REST API component

The **REST API component** is a simple yet powerful component that allows you to connect to REST APIs without programming your own components and deploying them into the platform.

* [Supported HTTP methods](#supported-http-methods)
* [URL](#url)
* [Headers](#headers)
* [Body](#body)
* [Authorisation methods](#authorisation-methods)

In the example below the REST API component is used with our own [REST API service](https://api.elastic.io/docs "elastic.io REST API service").

![alt text](https://cdn.elastic.io/documentation/rest-api-first-look.png "REST API component first look")

> The authorisation type is selected earlier to this configuration. Only [the following types](#authorisation-methods) are supported: `No Auth`, `Basic Auth` and `API Key Auth`.

## Supported HTTP methods

> Jump to: [Top](#) | **Methods** | [URL](#url) | [Headers](#headers) | [Body](#body) | [Authorisation](#authorisation-methods)

REST API component supports standard HTTP requests like `GET`, `PUT`, `POST`, `DELETE` and `PATCH`.

![alt text](https://cdn.elastic.io/documentation/rest-api-component-methods.png "REST API component methods")

## URL

 >Jump to: [Top](#) | [Methods](#supported-http-methods) | **URL** | [Headers](#headers) | [Body](#body) | [Authorisation](#authorisation-methods)

The field where the URL of the REST API is inputted. This field accepts only JSONata expressions, meaning the URL address should be a `string`.

![alt text](https://cdn.elastic.io/documentation/rest-api-component-url.png "REST API component URL field")

## Headers

> Jump to: [Top](#) | [Methods](#supported-http-methods) | [URL](#url) | **Headers** | [Body](#body) | [Authorisation](#authorisation-methods)

Use this part to add as many headers as necessary. If REST API requires an [authorisation](#authorisation-methods) then the credentials are submitted in the header as it is shown below.

![alt text](https://cdn.elastic.io/documentation/rest-api-component-headers-get.png "REST API component Headers field")

## Body

> Jump to: [Top](#) | [Methods](#supported-http-methods) | [URL](#url) | [Headers](#headers) | **Body** | [Authorisation](#authorisation-methods)

When HTTP Method is not `GET` then the Body part is switched on.

![alt text](https://cdn.elastic.io/documentation/rest-api-component-put-body.png "REST API component Body field")

In current view, it is possible to input the body of the HTTP call. The type of body depends on the content type which is `application/json` in the above example. The rendered field Body accepts only JSONata expressions.

The Content type field can have different values and the required Body will be different accordingly:

* `multipart/form-data`
* `application/x-www-form-urlencoded`
* `text/plain`
* `application/json`
* `application/xml`
* `text/xml`
* `text/html`

## Authorisation methods

> Jump to: [Top](#) | [Methods](#supported-http-methods) | [URL](#url) | [Headers](#headers) | [Body](#body) | **Authorisation**

Before REST API component can be used, authorisation information should be provided. This information is sent in HTTP Request header to the REST API provider. There are 3 available types:

* `No Auth` - used to work with completely open REST APIs
* `Basic Auth` - used to provide login credentials like **username/password**
* `API Key Auth` - used to provide `API Key` to access the resource
