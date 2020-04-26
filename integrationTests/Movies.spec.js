const chakram = require('chakram');
const expect = chakram.expect;

describe('Movies api tests', function () {
    const baseAddress = 'http://localhost:8888';

    it('should return 400 when no genres provided', async () => {
        const response = await chakram.post(`${baseAddress}/movies`, {
            title: 'Do utraty tchu',
            actors: 'Jean Seberg, Jean Paoul Belmondo',
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        console.log(response.body);
        expect(response.body.message.findIndex(x => x.fieldName === 'genres')).to.be.above(-1);
        return chakram.wait();
    });

    it('should return 400 when no title provided', async () => {
        const response = await chakram.post(`${baseAddress}/movies`, {
            genres: ['Crime', 'Drama'],
            actors: 'Jean Seberg, Jean Paoul Belmondo',
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'title')).to.be.above(-1);
        return chakram.wait();
    });

    it('should return 400 when no year provided', async () => {
        const response = await chakram.post(`${baseAddress}/movies`, {
            genres: ['Crime', 'Drama'],
            actors: 'Jean Seberg, Jean Paoul Belmondo',
            title: 'Breathless'
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'year')).to.be.above(-1);
        return chakram.wait();
    });

    it('should return 400 when no runtime provided', async () => {
        const response = await chakram.post(`${baseAddress}/movies`, {
            genres: ['Crime', 'Drama'],
            actors: 'Jean Seberg, Jean Paoul Belmondo',
            title: 'Breathless',
            year: '1960'
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'runtime')).to.be.above(-1);
        return chakram.wait();
    });

    it('should return 400 when no runtime provided', async () => {
        const response = await chakram.post(`${baseAddress}/movies`, {
            genres: ['Crime', 'Drama'],
            actors: 'Jean Seberg, Jean Paoul Belmondo',
            title: 'Breathless',
            year: '1960',
            runtime: 91,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'director')).to.be.above(-1);
        return chakram.wait();
    });

    it('should return 400 when director has more than 255 chars', async () => {
        const response = await chakram.post(`${baseAddress}/movies`, {
            genres: ['Crime', 'Drama'],
            actors: 'Jean Seberg, Jean Paoul Belmondo',
            title: 'Breathless',
            year: '1960',
            director: 'Jean Luc Godard lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
            runtime: 91,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'director')).to.be.above(-1);
        return chakram.wait();
    });

    it('should return 400 when title has more than 255 chars', async () => {
        const response = await chakram.post(`${baseAddress}/movies`, {
            genres: ['Crime', 'Drama'],
            actors: 'Jean Seberg, Jean Paoul Belmondo',
            title: 'Breathlesslorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
            year: '1960',
            director: 'Jean Luc Godard',
            runtime: 91,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'title')).to.be.above(-1);
        return chakram.wait();
    });

    it('should return 201 when valid data provided', async () => {
        const response = await chakram.post(`${baseAddress}/movies`, {
            genres: ['Crime', 'Drama'],
            actors: 'Jean Seberg, Jean Paoul Belmondo',
            title: 'Breathless',
            year: '1960',
            director: 'Jean Luc Godard',
            runtime: 91,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(201);
        return chakram.wait();
    });

    it('should return 400 when not existing genere provided', async () => {
        const response = await chakram.post(`${baseAddress}/movies`, {
            genres: ['Crime', 'NotExistingGenre'],
            actors: 'Jean Seberg, Jean Paoul Belmondo',
            title: 'Breathless',
            year: '1960',
            director: 'Jean Luc Godard',
            runtime: 91,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'genres')).to.be.above(-1);
        return chakram.wait();
    });


    it('should return 400 when not existing genere provided', async () => {
        const response = await chakram.post(`${baseAddress}/movies`, {
            genres: ['NotExistingGenre'],
            actors: 'Jean Seberg, Jean Paoul Belmondo',
            title: 'Breathless',
            year: '1960',
            director: 'Jean Luc Godard',
            runtime: 91,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'genres')).to.be.above(-1);
        return chakram.wait();
    });

    it('should return movies with proper genres and duration', async () => {
        const response = await chakram.get(`${baseAddress}/movies`, {
            qs: {
                genres: ['Crime', 'Drama'],
                duration: 50,
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(200);
        console.log(response.body);
        return chakram.wait();
    });

    it('should return random movie when no param provided', async () => {
        const response = await chakram.get(`${baseAddress}/movies`, {}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array').lengthOf(1);
        return chakram.wait();
    });


    it('should return random movie when only duration provided', async () => {
        const response = await chakram.get(`${baseAddress}/movies`, {
            qs: {
                duration: 100,
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array').lengthOf(1);
        return chakram.wait();
    });

    it('should return empty array not existing duration provided', async () => {
        const response = await chakram.get(`${baseAddress}/movies`, {
            qs: {
                duration: 1,
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array').lengthOf(0);
        return chakram.wait();
    });

    it('should return 400 bad request when invalid input duration type provided', async () => {
        const response = await chakram.get(`${baseAddress}/movies`, {
            qs: {
                genres: ['Crime', 'Drama'],
                duration: 'xdXDXDXDXD12',
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'duration')).to.be.above(-1);
        return chakram.wait();
    });

    it('should return 400 bad request when invalid input genres type provided', async () => {
        const response = await chakram.get(`${baseAddress}/movies`, {
            qs: {
                genres: '123',
                duration: 123,
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'genres')).to.be.above(-1);
        return chakram.wait();
    });

    it('should return 400 bad request when invalid input duration type provided', async () => {
        const response = await chakram.get(`${baseAddress}/movies`, {
            qs: {
                genres: '123',
                duration: null,
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'duration')).to.be.above(-1);
        return chakram.wait();
    });

    it('should return 400 bad request when invalid input genres type provided', async () => {
        const response = await chakram.get(`${baseAddress}/movies`, {
            qs: {
                genres: 123,
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response.body);
        expect(response).to.have.status(400);
        expect(response.body.message).to.be.an('array');
        expect(response.body.message.findIndex(x => x.fieldName === 'genres')).to.be.above(-1);
        return chakram.wait();
    });
});
