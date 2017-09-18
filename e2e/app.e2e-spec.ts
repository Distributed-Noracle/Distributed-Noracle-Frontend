import { DNorPage } from './app.po';

describe('d-nor App', () => {
  let page: DNorPage;

  beforeEach(() => {
    page = new DNorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
