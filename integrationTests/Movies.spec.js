const chakram = require('chakram');
const expect = chakram.expect;

describe('Movies api tests', function () {
    const baseAddress = 'http://localhost:8888';
    this.timeout(20000);
    it('should return 400 when not title provided', async () => {
        const response = await chakram.post(`${baseAddress}/movies`, {
            title: 'Do utraty tchu',
            actors: 'Jean Seberg, Jean Paoul Belmondo',
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response).to.have.status(200);
        return chakram.wait();
    });
});
