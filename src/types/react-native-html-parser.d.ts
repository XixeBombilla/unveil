declare module "react-native-html-parser" {
  export class HTMLParser {
    parseFromString(
      html: string,
      type: string
    ): {
      querySelector(selector: string): any;
      querySelectorAll(selector: string): any[];
      getElementById(id: string): any;
      body: any;
    };
  }
}
