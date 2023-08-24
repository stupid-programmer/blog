export interface Post {
    data: {

      title: string;
      description: string;
      pubDate: string | Date;
      heroImage: string;
      url: string;
      tags: string[];
    }
  }
