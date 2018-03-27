const Page = require('./helpers/page');

let page;   // proxy page

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});


describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('Can see blog create form', async () => {
    const text = await page.getContentsOf('form label');
    expect(text).toEqual('Blog Title');
  });

  describe('And using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', "My Title");
      await page.type('.content input', "My Content");
      await page.click('form button');
    });

    test('Submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });

    test('Submitting then saving brings user to ', async () => {
      await page.click('button.green');
      await page.waitFor('.card');
      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');
      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    });
  });

  describe('And using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('User is not logged in', async () => {
  test('User cannot create blog posts', async () => {
    const result = await page.post('/api/blogs', {title: 'My Title', content: 'My Content'});
    // console.log(result);
    expect(result).toEqual({error: 'You must log in!'});
  });

  test('User cannot get a listof posts', async () => {
    const result = await page.get('/api/blogs');
    expect(result).toEqual({error: 'You must log in!'});
  });
});
