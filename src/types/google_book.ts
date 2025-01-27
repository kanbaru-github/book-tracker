export type GoogleBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    imageLinks?: {
      thumbnail: string;
    };
    description?: string;
    categories?: string[];
  };
};
