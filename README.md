to start without docker:
yarn install
yarn start

with docker docker-compose:
docker-compose build
docker-compose up
exposed port 8888

Paths:

[GET]  /_health
[GET]  /movies?genres=['Comedy']&duration=90
[POST] /movies
    headers:{
        content-type: 'application/json'
    } 
    body: {
        genres: array of string, required,,
        title: string, required, max(255),
        year:  number, required, min(1895),
        runtime: number, required,
        director: string, required, max(255),
        actors: string,
        plot: string,
        posterUrl: string,
    }