import { buildApiResponse } from '../utilities/buildApiResponse';
import { BookSearchApiClient } from '../BooksSearchApiClient/BookSearchApiClient';
import axios from 'axios';
import * as xml2js from 'xml2js';
import { Formats } from '@source/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../utilities/buildApiResponse');
const mockedBuildApiResponse = buildApiResponse as jest.MockedFunction<
  typeof buildApiResponse
>;

const fakeResponse = {
  data: [
    {
      book: {
        title: 'title1',
        author: 'author',
        isbn: 'isbn1',
      },
      stock: {
        quantity: 1,
        price: 2.5,
      },
    },
    {
      book: {
        title: 'title2',
        author: 'author',
        isbn: 'isbn2',
      },
      stock: {
        quantity: 2,
        price: 3.5,
      },
    },
  ],
};

mockedBuildApiResponse.mockReturnValue({
  results: [
    {
      title: 'title1',
      author: 'author',
      isbn: 'isbn1',
      quantity: 1,
      price: 2.5,
    },
    {
      title: 'title2',
      author: 'author',
      isbn: 'isbn2',
      quantity: 2,
      price: 3.5,
    },
  ],
  count: 2,
});

jest.mock('xml2js', () => ({
  parseString: jest.fn(
    (xml: string, callback: (err: any, result: any) => void) => {
      // Provide a custom implementation for parseString callback
      // For example, mock result for successful parsing
      callback(null, fakeResponse);
    }
  ),
}));

describe('BookSearchApiClient tests', () => {
  it('should return mapped json response', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          book: {
            title: 'title1',
            author: 'author',
            isbn: 'isbn1',
          },
          stock: {
            quantity: 1,
            price: 2.5,
          },
        },
        {
          book: {
            title: 'title2',
            author: 'author',
            isbn: 'isbn2',
          },
          stock: {
            quantity: 2,
            price: 3.5,
          },
        },
      ],
      status: 200,
    });
    const bookSearchApiClient = new BookSearchApiClient('json');
    const response = await bookSearchApiClient.getBooksByAuthor('author', 10);

    const expectedResponse = {
        results: [
          {
            title: 'title1',
            author: 'author',
            isbn: 'isbn1',
            quantity: 1,
            price: 2.5,
          },
          {
            title: 'title2',
            author: 'author',
            isbn: 'isbn2',
            quantity: 2,
            price: 3.5,
          },
        ],
        count: 2,
      };

    expect(response).toStrictEqual(expectedResponse);
  });

  it('should return mapped xml response', async () => {
    const js = { some: 'result' };
    let result;
    mockedAxios.get.mockResolvedValue({
      data: `<?xml version="1.0" encoding="UTF-8"?>
                       <response>
                         <data>
                         <item>
                         <book>
                             <title>title1</title>
                             <author>author</author>
                             <isbn>isbn1</isbn>
                         </book>
                         <stock>
                             <quantity>1</quantity>
                             <price>2.5</price>
                         </stock>
                     </item>
                     <item>
                         <book>
                             <title>title2</title>
                             <author>author</author>
                             <isbn>isbn2</isbn>
                         </book>
                         <stock>
                             <quantity>2</quantity>
                             <price>3.5</price>
                         </stock>
                     </item>
                         </data>
                       </response>`,
    });

    const bookSearchApiClient = new BookSearchApiClient('xml');
    const response = await bookSearchApiClient.getBooksByAuthor('author', 10);

    const expectedResponse = {
        results: [
          {
            title: 'title1',
            author: 'author',
            isbn: 'isbn1',
            quantity: 1,
            price: 2.5,
          },
          {
            title: 'title2',
            author: 'author',
            isbn: 'isbn2',
            quantity: 2,
            price: 3.5,
          },
        ],
        count: 2,
      };

    expect(response).toStrictEqual(expectedResponse);
  });

  it('should return validation error response when there is a missing query parameter', async () => {
    const bookSearchApiClient = new BookSearchApiClient('json');
    const response = await bookSearchApiClient.getBooksByAuthor('author', undefined);

    const expectedResponse = {
        error: {
            status: 400,
            code: 'VALIDATION_ERROR',
            message: 'Missing required getBooksByAuthor query parameters'
        }
      };

    expect(response).toStrictEqual(expectedResponse);
  });

  it('should return bad request error response when the format is invalid', async () => {
    const bookSearchApiClient = new BookSearchApiClient('foo' as Formats);
    const response = await bookSearchApiClient.getBooksByAuthor('author', 10);

    const expectedResponse = {
        error: {
            status: 400,
            code: 'BAD_REQUEST',
            message: 'Invalid format requested for getBooksByAuthor, ,ust be either xml or json'
        }
      };

    expect(response).toStrictEqual(expectedResponse);
  });
});
