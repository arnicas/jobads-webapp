import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';

const iconStyle = {
  viewBox: "20 10 101 101",
};

const LogoIcon = (props) => (
  <SvgIcon {...props} viewBox={iconStyle.viewBox}>
    <defs>
        <linearGradient id="MyGradient">
            <stop offset="0%" stopColor="#84D2E2" />
            <stop offset="100%" stopColor="#0071BC" />
        </linearGradient>
    </defs>
    <clipPath id="SVGID_2_">
      <use href="#SVGID_1_" style={{overflow:'visible'}}/>
    </clipPath>
    <g>
      <defs>
        <path id="SVGID_1_" d="M105,110.8H43.9c-11.3,0-20.4-9.1-20.4-20.4V29.3c0-11.3,9.1-20.4,20.4-20.4H105c11.3,0,20.4,9.1,20.4,20.4    v61.1C125.5,101.6,116.3,110.8,105,110.8z"/>
      </defs>
      <linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="20.6502" y1="90.8862" x2="128.3218" y2="28.722">
        <stop offset="0" style={{stopColor: 'rgba(255,255,255,.5)'}}/>
        <stop offset="1" style={{stopColor: 'rgba(255,255,255,.3)'}}/>
      </linearGradient>
      <path className="st0" d="M105,110.8H43.9c-11.3,0-20.4-9.1-20.4-20.4V29.3c0-11.3,9.1-20.4,20.4-20.4H105c11.3,0,20.4,9.1,20.4,20.4   v61.1C125.5,101.6,116.3,110.8,105,110.8z"/>
      <g className="st1">
        <path className="st2" d="M98.3,69.7c0,13.3-10.7,24-24,24s-24-10.7-24-24s15-37.4,24-51.7C83,32.1,98.3,56.4,98.3,69.7z"/>
        <g className="st3">
          <defs>
            <path id="SVGID_4_" className="st3" d="M98.3,69.7c0,13.3-10.7,24-24,24s-24-10.7-24-24s15-37.4,24-51.7      C83,32.1,98.3,56.4,98.3,69.7z"/>
          </defs>
          <rect x="34.9" y="18" className="st4" width="39.5" height="75.7"/>
        </g>
      </g>
        <clipPath id="SVGID_5_">
          <use href="#SVGID_4_" style={{overflow:'visible'}}/>
        </clipPath>
        <rect x="96.5" y="73.8" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -41.9931 101.9684)" className="st5" width="11.1" height="55.8"/>
      
        <ellipse transform="matrix(0.7071 -0.7071 0.7071 0.7071 -30.4316 74.0566)" className="st5" cx="74.2" cy="73.8" rx="10.3" ry="14.3"/>
    </g>
  </SvgIcon>
);

export default LogoIcon;