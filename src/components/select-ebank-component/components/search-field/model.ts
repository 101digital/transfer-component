export class SearchData {
  constructor(readonly key: string) {}

  static empty(): SearchData {
    return new SearchData('');
  }
}
