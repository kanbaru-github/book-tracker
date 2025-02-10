export interface GoogleBook {
  id: string;
  saleInfo: {
    buyLink: string;
    saleability: string;
  };
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail: string;
    };
    infoLink: string;
  };
}
