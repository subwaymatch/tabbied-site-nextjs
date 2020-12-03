import Slider from '@material-ui/core/Slider';

type ValueSliderPropTypes = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v) => void;
};

export default function ValueSlider({
  min,
  max,
  step,
  value,
  onChange,
}: ValueSliderPropTypes) {
  return (
    <Slider
      defaultValue={0.4}
      getAriaValueText={(v) => `${v}%`}
      aria-labelledby="discrete-slider"
      valueLabelDisplay="auto"
      value={value}
      onChange={(ev, val) => {
        onChange(val);
      }}
      step={step}
      marks={false}
      min={min}
      max={max}
    />
  );
}
