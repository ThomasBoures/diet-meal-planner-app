import { bmrMifflinStJeor } from '../services/calc/bmr';

describe('bmrMifflinStJeor', () => {
  it('calculates male BMR', () => {
    expect(bmrMifflinStJeor({ sex: 'male', weightKg: 80, heightCm: 180, age: 30 })).toBeCloseTo(1780, 0);
  });

  it('calculates female BMR', () => {
    expect(bmrMifflinStJeor({ sex: 'female', weightKg: 65, heightCm: 165, age: 28 })).toBeCloseTo(1425, 0);
  });

  it('handles other as average', () => {
    expect(bmrMifflinStJeor({ sex: 'other', weightKg: 65, heightCm: 165, age: 28 })).toBeCloseTo(1508, 0);
  });
});
