import { expect } from 'chai';
import * as sinon from 'sinon';
import { MovieDurationFilter } from '../src/usecase/movies/filters/MovieDurationFilter';
import { GenreSearchStrategy } from '../src/usecase/movies/searchStrategy/GenreSearchStrategy';

const mockedMovies = [
    {
        genres: ['Drama', 'Comedy', 'Western'],
        title: '',
        year: 2000,
        runtime: 120,
        director: '',
        actors: '',
        plot: 'plot',
        posterUrl: '',
    },
    {
        genres: ['Drama', 'Comedy', 'Musical'],
        title: '',
        year: 2000,
        runtime: 130,
        director: '',
        actors: '',
        plot: 'plot',
        posterUrl: '',
    },
    {
        genres: ['Noir', 'Criminal'],
        title: '',
        year: 2000,
        runtime: 110,
        director: '',
        actors: '',
        plot: 'plot',
        posterUrl: '',
    },
    {
        genres: ['Sci-fi', 'Thriller'],
        title: '',
        year: 2000,
        runtime: 120,
        director: '',
        actors: '',
        plot: 'plot',
        posterUrl: '',
    },
    {
        genres: ['Western'],
        title: '',
        year: 2000,
        runtime: 131,
        director: '',
        actors: '',
        plot: 'plot',
        posterUrl: '',
    },
    {
        genres: ['Western', 'Drama'],
        title: '',
        year: 2000,
        runtime: 121,
        director: '',
        actors: '',
        plot: 'plot',
        posterUrl: '',
    },

];
describe('GenreSearchStrategy tests', () => {
    it('should return 0 result array when empty movies input array provided', async () => {
        const test = new GenreSearchStrategy(['Comedy', 'Western'], []);
        const result = test.search([]);
        expect(result).to.be.an('array');
        expect(result).to.have.length(0);
    });

    it('should return 1 result for Comedy and Western', async () => {
        const test = new GenreSearchStrategy(['Comedy', 'Western'], []);
        const result = test.search(mockedMovies);
        expect(result).to.be.an('array');
        expect(result).to.have.length(1);
    });

    it('should return 1 result for Western', async () => {
        const test = new GenreSearchStrategy(['Western'], []);
        const result = test.search(mockedMovies);
        expect(result).to.be.an('array');
        expect(result).to.have.length(1);
    });

    it('should return 3 result for Comedy, Western and Drama ', async () => {
        const test = new GenreSearchStrategy(['Comedy', 'Western', 'Drama'], []);
        const result = test.search(mockedMovies);
        expect(result).to.be.an('array');
        expect(result).to.have.length(3);
    });

    it('should return 0 result when filters does not match any movie', async () => {
        sinon.stub(MovieDurationFilter.prototype, 'filter').callsFake(() => false);
        const test = new GenreSearchStrategy(['Western'], [new MovieDurationFilter(10)]);
        const result = test.search(mockedMovies);
        expect(result).to.be.an('array');
        expect(result).to.have.length(0);
    });

});
