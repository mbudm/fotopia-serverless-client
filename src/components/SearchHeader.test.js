import { getFiltersByGroupAndKey} from './SearchHeader';

test('getFiltersByGroupAndKey', () => {
  const people = [{
    id: '123',
    name: 'jacinta',
  },{
    id: '23swa',
    name: 'fred',
  }];
  const filterState = {
    tags: ['yellow'],
    people: ['123', '23swa']
  }
  const result = getFiltersByGroupAndKey(filterState, people)
  expect(result.length).toEqual(3);
  expect(result[0]).toEqual({
    group: 'tags',
    key: 'yellow',
    label: 'yellow'
  });
  expect(result[1]).toEqual({
    group: 'people',
    key: '123',
    label: 'jacinta'
  });
});
