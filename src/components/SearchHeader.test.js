import { getFiltersByGroupAndKey} from './SearchHeader';

test('getFiltersByGroupAndKey', () => {
  const filterState = {
    tags: ['yellow'],
    people: ['jacinta', 'fred']
  }
  const result = getFiltersByGroupAndKey(filterState)
  expect(result.length).toEqual(3);
  expect(result[0]).toEqual({
    group: 'tags',
    key: 'yellow'
  });
});
