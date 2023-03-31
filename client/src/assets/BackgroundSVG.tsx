import React from "react";
import { SVGProps } from "../types";

const BackgroundSVG: React.FC<SVGProps> = ({ color }) => {
  return (
    <svg
      className="bgSVG"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1918 584"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 453.206C820.8 -367.594 1620.67 111.206 1918 453.206V583.5H0V453.206Z"
        fill={color}
      />
    </svg>
  );
};

export default BackgroundSVG;
