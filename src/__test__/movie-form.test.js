import React from 'react';
import { render, screen, fireEvent, wait } from '@testing-library/react';

import MovieForm from '../components/movie-form';

global.fetch = require('jest-fetch-mock');

const emptyMovie = {
  title: '',
  description: '',
};

const movie = {
  id: 1,
  title: 'Batman the dark knight',
  description: 'Testing description in mock data',
};

describe('Movie form component', () => {
  test('Should match snapshot', () => {
    const { container } = render(<MovieForm movie={emptyMovie} />);
    expect(container).toMatchSnapshot();
  });

  test('Should have form elements', () => {
    render(<MovieForm movie={emptyMovie} />);

    const title = screen.getByLabelText(/title/i);
    expect(title).toBeTruthy();

    const description = screen.getByLabelText(/description/i);
    expect(description).toBeTruthy();

    const button = screen.getByRole('button', { name: /create/i });
    expect(button).toBeTruthy();
  });

  test('display form elements with movie data', () => {
    const { debug } = render(<MovieForm movie={movie} />);
    // debug(screen.getByLabelText('Title'));

    const titleInput = screen.getByLabelText(/title/i).value;
    expect(titleInput).toBe(movie.title);

    const descriptionInput = screen.getByLabelText(/description/i).value;
    expect(descriptionInput).toBe(movie.description);

    const button = screen.getByRole('button', { name: /update/i });
    expect(button).toBeTruthy();
  });

  test('Should trigger API request when clicked on button', async () => {
    const updatedMovie = jest.fn();

    jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(movie) })
      );

    render(<MovieForm movie={movie} updatedMovie={updatedMovie} />);
    const submitButton = screen.getByRole('button', { name: /update/i });
    fireEvent.click(submitButton);

    await wait(() => {
      expect(updatedMovie).toBeCalledTimes(1);
    });
  });

  test('Shouldn trigger API request when clicked on button with empty form', async () => {
    const updatedMovie = jest.fn();

    fetch.mockResponseOnce(JSON.stringify(emptyMovie));

    render(<MovieForm movie={emptyMovie} updatedMovie={updatedMovie} />);
    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await wait(() => {
      expect(updatedMovie).toBeCalledTimes(0);
    });
  });

  test('Should trigger API request when clicked on button on new movie button', async () => {
    const movieCreated = jest.fn();

    fetch.mockResponseOnce(JSON.stringify(movie));

    render(<MovieForm movie={emptyMovie} movieCreated={movieCreated} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(titleInput, { target: { value: 'Title1' } });
    fireEvent.change(descriptionInput, { target: { value: 'Description1' } });

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await wait(() => {
      // expect(movieCreated.mock.calls[0][0]).toStrictEqual(movie);
      expect(movieCreated).toBeCalledWith(movie);
    });
  });
});
