export interface GoogleBook {
  id: string;
  saleInfo: {
    /** 購入リンク */
    buyLink: string;
    /** 販売状態 */
    saleability: "FOR_SALE" | "NOT_FOR_SALE" | "FREE";
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
