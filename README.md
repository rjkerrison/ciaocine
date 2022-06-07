# ciaocine

Cinema viewing info, in an express app.

## Example

View showtimes as JSON:

```sh
curl --location --request GET 'https://ciaocine.herokuapp.com/api/showtimes/2022/7/6'
```

## Architecture

This application is a REST API built with Express in NodeJs, with a MongoDB backend.

It has some complex features, such as Mongo aggregations,
but it is intended to remain close to the stack commonly used to teach new developers in intensive bootcamps,
such as those at Ironhack and at General Assembly.

## Documentation

To better understand how to use the API, please refer to [Ciaocine documentation and examples on Postman][docs].

[docs]: https://documenter.getpostman.com/view/17470638/UyxnD4Kh "documenter.getpostman.com for Ciaocine"
