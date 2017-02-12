import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import {greenA400, blue500} from 'material-ui/styles/colors';

const iconStyle = {
  viewBox: "0 0 24 24",
};

const MapsPlaceIcon = (props) => (
  <SvgIcon {...props} viewBox={iconStyle.viewBox}>
      <defs>
          <linearGradient id="MyGradient2">
              <stop offset="0%" stopColor="#b64be8" />
              <stop offset="100%" stopColor="#faa159" />
          </linearGradient>
          <linearGradient id="MyGradient3">
              <stop offset="0%" stopColor={blue500} />
              <stop offset="100%" stopColor={greenA400} />
          </linearGradient>
      </defs>
        <path d="M 12,2 C 8.13,2 5,5.13 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.87 -3.13,-7 -7,-7 z"></path>
    </SvgIcon>
);

export default MapsPlaceIcon;