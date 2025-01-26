import './styles.css';

export enum Rating {
  Good,
  Bad,
  Excellent,
}

function getRatingLabel(rating: Rating) {
  switch (rating) {
    case Rating.Bad:
      return 'Плохо';
    case Rating.Good:
      return 'Хорошо';
    case Rating.Excellent:
      return 'Отлично';
    default:
      return 'Неизвестное значение оценки';
  }
}

const RatingBadge = ({ value }: { value: Rating }) => {
  const ratingStyles = {
    [Rating.Good]: 'RatingGood',
    [Rating.Bad]: 'RatingBad',
    [Rating.Excellent]: 'RatingExcellent',
  };

  return (
    <div className={`Rating ${ratingStyles[value]}`}>
      {getRatingLabel(value)}
    </div>
  );
};

export const RandomRatingBadge = () => {
  const randomRating = Math.floor(Math.random() * 4);

  if (randomRating === 0) {
    return <RatingBadge value={Rating.Bad} />;
  } else if (randomRating === 1) {
    return <RatingBadge value={Rating.Good} />;
  } else if (randomRating === 2) {
    return <RatingBadge value={Rating.Excellent} />;
  }

  return null;
};

export default RatingBadge;
