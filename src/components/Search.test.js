// Link.react.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components'

import { Search } from './Search';

test('Search with no result array', () => {
  const component = renderer.create(
    <Search />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Search with 0 results', () => {
  const component = renderer.create(
    <Search results={[]}/>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Search with 1 result', () => {
  const component = renderer.create(
    <Search results={[{
      id: 'image_guid',
      img_location: 'myImg.jpg',
      img_thumb_location: 'myImg-thumb.jpg'
    }]}/>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Search with multiple results', () => {
  const component = renderer.create(
    <Search results={[{
      id: 'image_guid',
      img_location: 'myImg.jpg',
      img_thumb_location: 'myImg-thumb.jpg'
    },
    {
      id: 'image_2_guid',
      img_location: 'myImg2.jpg',
      img_thumb_location: 'myImg2-thumb.jpg'
    }]}/>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
