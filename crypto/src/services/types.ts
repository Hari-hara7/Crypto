export interface Coin {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    total_volume: number;
    image: string;
    price_change_percentage_24h: number;
  }
  
  export interface News {
    id: string;
    title: string;
    url: string;
    source: string;
    published_on: number;
    body: string;
  }
  