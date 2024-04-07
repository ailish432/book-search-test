import { BookSearchApiClient } from "@source/BooksSearchApiClient/BookSearchApiClient";

const author = 'Shakespear'
const limit = 10

const client = new BookSearchApiClient('json')
const booksByAuthor =  client.getBooksByAuthor(author, limit)

/* 
To further improve this, I would pass in a url as a parameter to getBooksByAuthor
so that different book seller APIs can be used with this class
e.g.
client.getBooksByAuthor(author, limit, url)
*/


