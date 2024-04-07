import { Request } from 'express'
import { BookSearchApiClient } from "@source/BooksSearchApiClient/BookSearchApiClient";
import { ApiResponse, BooksByAuthorResponse, ErrorDetails } from '@source/types';

export class GetController {
    async getBooksByAuthor(req: Request): Promise<ApiResponse<BooksByAuthorResponse[]> | ErrorDetails> {
        const bookSearchApiClient = new BookSearchApiClient('json')
        return bookSearchApiClient.getBooksByAuthor(req.body.author, req.body.limit)
    }
}
