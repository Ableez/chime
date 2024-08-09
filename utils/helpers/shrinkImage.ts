function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

function denormalize(value: number, min: number, max: number): number {
  return value * (max - min) + min;
}

function mapToRange(
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
): number {
  const normalizedValue = normalize(value, inputMin, inputMax);
  return denormalize(normalizedValue, outputMin, outputMax);
}

export function shrinkSizeNumber(values: number[]): number[] {
  const inputMin = Math.min(...values);
  const inputMax = Math.max(...values);
  return values.map((value) => mapToRange(value, inputMin, inputMax, 260, 340));
}
