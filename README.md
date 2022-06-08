# ciaocine

Cinema viewing info, as a REST API. A React frontend is available at [rjkerrison/ciaocine-react][react].

To view the full website, go to [www.ciaocine.com][ciaocine].

## Example

View showtimes as JSON:

```sh
curl --location --request GET 'https://ciaocine.herokuapp.com/api/showtimes/2022/7/6'
```

## Documentation

To understand how to use the API, please refer to the [Ciaocine documentation and examples on Postman][docs].

## Architecture

This application is a REST API built with Express in NodeJs, with a MongoDB backend.

It has some complex features, such as Mongo aggregations,
but it is intended to remain close to the stack commonly used to teach new developers in intensive bootcamps,
such as those at [Ironhack][ironhack] and at [General Assembly][ga].

It is deployed to [Heroku][heroku], a cloud deployment solution that's free for hobby projects.

[react]: https://github.com/rjkerrison/ciaocine-react "Ciaocine React frontend on Github"
[ciaocine]: https://www.ciaocine.com/ "Ciaocine Homepage"
[docs]: https://documenter.getpostman.com/view/17470638/UyxnD4Kh "documenter.getpostman.com for Ciaocine"
[heroku]: https://www.heroku.com/ "Heroku"
[ironhack]: https://www.ironhack.com/en/web-development "Ironhack Web Development Bootcamp"
[ga]: https://generalassemb.ly/education/software-engineering-immersive "General Assembly Software Engineering Immersive"
