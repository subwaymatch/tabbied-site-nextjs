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
      onChangeCommitted={(ev, val) => {
        console.log(`Slider value change`);
        console.log(val);
      }}
      step={step}
      marks={false}
      min={min}
      max={max}
    />
  );
}
