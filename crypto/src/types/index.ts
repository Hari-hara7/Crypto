export interface Blog {
    _id: string;
    title: string;
    content: string;
    likes: string[];
    comments: {
      username: string;
      text: string;
    }[];
  }
  