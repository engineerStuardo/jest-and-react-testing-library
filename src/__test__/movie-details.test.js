import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import MovieDetails from '../components/movie-details';

const selectedMovie = {
  id: 1,
  title: 'some title',
  description: 'some description',
  avg_rating: 3,
  no_of_ratings: 2,
};

describe('Movie details component', () => {
  test('Should match a snapshot', () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);
    expect(container).toMatchSnapshot();
  });

  test('Should display title and description', () => {
    render(<MovieDetails movie={selectedMovie} />);

    const title = screen.queryByText(selectedMovie.title);
    expect(title).toBeTruthy();

    const description = screen.queryByText(selectedMovie.description);
    expect(description).toBeTruthy();
  });

  test('Should display color stars', () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);

    const selectedStars = container.querySelectorAll('.orange');
    expect(selectedStars.length).toBe(selectedMovie.avg_rating);
  });

  test('Should display number of ratings', () => {
    render(<MovieDetails movie={selectedMovie} />);

    const ratingText = screen.getByTestId('ratingNumber');
    expect(ratingText.innerHTML).toBe(`(${selectedMovie.no_of_ratings})`);
  });

  test('Mouseover should highlight the stars', () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);

    const stars = container.querySelectorAll('.rate-container svg');
    stars.forEach((star, index) => {
      fireEvent.mouseOver(star);
      const highlighted_stars = container.querySelectorAll('.purple');
      expect(highlighted_stars.length).toBe(index + 1);
    });
  });

  test('Mouseleave should unhighlight the stars', () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);

    const stars = container.querySelectorAll('.rate-container svg');
    stars.forEach(star => {
      fireEvent.mouseOver(star);
      fireEvent.mouseOut(star);
      const highlighted_stars = container.querySelectorAll('.purple');
      expect(highlighted_stars.length).toBe(0);
    });
  });

  test('Click stars should trigger rating function to update', () => {
    const loadMovie = jest.fn();
    const { container } = render(
      <MovieDetails movie={selectedMovie} updateMovie={loadMovie} />
    );

    const stars = container.querySelectorAll('.rate-container svg');
    stars.forEach(star => {
      fireEvent.click(star);
    });

    setTimeout(() => {
      expect(loadMovie).toBeCalledTimes(stars.length);
    });
  });
});
