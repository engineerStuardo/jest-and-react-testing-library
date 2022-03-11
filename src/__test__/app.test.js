import React from 'react';
import {
  render,
  screen,
  fireEvent,
  wait,
  act,
  waitForElement,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import App from '../App';

global.fetch = require('jest-fetch-mock');

const movie = [
  {
    id: 1,
    title: 'Batman the dark knight',
    description: 'Testing description in mock data',
  },
  {
    id: 2,
    title: 'The batman',
    description: 'Testing description in mock data 2',
  },
];

describe('App component', () => {
  test('Should display and hide loading', async () => {
    fetch.mockResponseOnce(JSON.stringify(movie));

    act(() => {
      render(<App />);
    });

    expect(screen.getByTestId('loading')).toBeTruthy();
    await waitForElement(() => screen.getByTestId('list'));
    expect(screen.queryByTestId('loading')).toBeFalsy();
  });

  test('Should display an error on bad request', async () => {
    fetch.mockResponseOnce(null, { status: 500 });

    act(() => {
      render(<App />);
    });

    expect.assertions(1);
    await waitForElementToBeRemoved(() => screen.getAllByTestId('loading'));
    expect(screen.getByTestId('error')).toBeTruthy();
  });

  test('Should display list of movies after api request', async () => {
    fetch.mockResponseOnce(JSON.stringify(movie));

    act(() => {
      render(<App />);
    });

    await waitForElementToBeRemoved(() => screen.getAllByTestId('loading'));
    const list = screen.getByTestId('list');
    expect(list).toBeTruthy();
    expect(list.children.length).toBe(2);
  });

  test('new movie button should be present and trigger form', async () => {
    fetch.mockResponseOnce(JSON.stringify(movie));

    act(() => {
      render(<App />);
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('loading'));
    const newMovieButton = screen.getByTestId('new-movie');
    fireEvent.click(newMovieButton);

    await wait(() => {
      expect(screen.getByTestId('movie-form')).toBeTruthy();
    });
  });

  test('should display movie details when click on heading', async () => {
    fetch.mockResponseOnce(JSON.stringify(movie));

    act(() => {
      render(<App />);
    });

    await waitForElementToBeRemoved(() => screen.getAllByTestId('loading'));

    const headings = screen.getAllByTestId('heading');
    fireEvent.click(headings[0]);

    await wait(() => {
      expect(screen.getByText(movie[0].description)).toBeTruthy();
    });

    fireEvent.click(headings[1]);

    await wait(() => {
      expect(screen.queryByText(movie[0].description)).toBeFalsy();
      expect(screen.getByText(movie[1].description)).toBeTruthy();
    });
  });
});
