import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

const TabbiedSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

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
    <TabbiedSlider
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
