import { ApiResponse, BooksByAuthorResponse, BooksResponse, ErrorDetails, Formats } from '../types';
import axios, { AxiosResponse } from 'axios';
import { parseString } from 'xml2js';
import * as log4js from 'log4js'
import { buildApiResponse } from '../utilities/buildApiResponse';

export class BookSearchApiClient {
  format: Formats;

  constructor(format: Formats) {
    this.format = format;
  }

  public async getBooksByAuthor(
    authorName: string,
    limit: number
  ): Promise<ApiResponse<BooksByAuthorResponse[]> | ErrorDetails> {
    const logger = log4js.getLogger()
    
    try {
      if (!authorName || !limit) {
        logger.error('Missing required getBooksByAuthor query parameters')
        return {
          error: {
            status: 400,
            code: 'VALIDATION_ERROR',
            message: 'Missing required getBooksByAuthor query parameters'
          }
        }
      }
      
      if (this.format !== 'xml' && this.format !== 'json') {
        logger.error('Invalid format requested for getBooksByAuthor, ,ust be either xml or json')
        return {
          error: {
            status: 400,
            code: 'BAD_REQUEST',
            message: 'Invalid format requested for getBooksByAuthor, ,ust be either xml or json'
          }
        }
      }
      
      const booksResponse = await axios.get<BooksResponse[]>(
        'http://api.book-seller-example.com/by-author',
        { params: { authorName, limit, format: this.format } }
      );

      if (this.format === 'xml') {
        return new Promise((resolve, reject) => {
          parseString(booksResponse, (error, response: AxiosResponse<BooksResponse[]>) => {
            if (error) {
              reject(error);
            } else {
              const result = this.mapJsonBookResponse(response.data);
              resolve(result);
            }
          });
        });
      } else if (this.format === 'json') {
        return this.mapJsonBookResponse(booksResponse.data);
      }
    } catch (error) {
      logger.error('Something went wrong calling getBooksByAuthor', error)
      throw error
      }
  }

  private mapJsonBookResponse(
    booksResponse: BooksResponse[]
  ): ApiResponse<BooksByAuthorResponse[]> {
    const books =  booksResponse.map((item) => {
      return {
        title: item.book.title,
        author: item.book.author,
        isbn: item.book.isbn,
        quantity: item.stock.quantity,
        price: item.stock.price,
      };
    });
    return buildApiResponse(books);
  }
}
