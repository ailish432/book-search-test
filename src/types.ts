export type ApiResponse<T> = {
    results: T;
    count: number;
}

export type BooksResponse = {
  book: Book;
  stock: Stock;
};

type Book = {
  title: string;
  author: string;
  isbn: string;
};

type Stock = {
  quantity: number;
  price: number;
};

export type BooksByAuthorResponse = {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  price: number;
};

export type Formats = 'xml' | 'json';

export type ErrorDetails = {
    error: {
        status: number;
        code: string;
        message: string;
    }
}
