import React from 'react';
import { LogoParams } from '../interfaces';

const Logo: React.FC<LogoParams> = ({color, theme, width, height}) => {
  return (
    <svg className="logoSVG" width={width} height={height} viewBox="0 0 159 159" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="TTT-logo">
           <rect id="Rectangle 2" width="50" height="50" fill={color}/>
           <path id="T" d="M13.8073 15.9814V11.2273H36.2061V15.9814H27.8564V38.5H22.1569V15.9814H13.8073Z" fill={theme === 'error' ? color : 'black'}/>
           <rect id="Rectangle 3" x="54.5" width="50" height="50" fill={color}/>
           <path id="I" d="M81.8814 11.2273V38.5H76.1153V11.2273H81.8814Z" fill={theme === 'error' ? color : 'black'}/>
           <rect id="ColorSquare3" x="109" width="50" height="50" fill={theme}/>
           <path id="C" d="M146.335 20.7754H140.502C140.395 20.0208 140.178 19.3505 139.849 18.7646C139.521 18.1697 139.099 17.6637 138.584 17.2464C138.069 16.8292 137.475 16.5096 136.8 16.2876C136.134 16.0657 135.41 15.9547 134.629 15.9547C133.218 15.9547 131.988 16.3054 130.94 17.0067C129.893 17.6992 129.081 18.7113 128.504 20.043C127.926 21.3658 127.638 22.9727 127.638 24.8636C127.638 26.8079 127.926 28.4414 128.504 29.7642C129.089 31.087 129.906 32.0858 130.954 32.7605C132.001 33.4352 133.213 33.7725 134.589 33.7725C135.362 33.7725 136.076 33.6705 136.733 33.4663C137.399 33.2621 137.989 32.9647 138.504 32.574C139.019 32.1745 139.445 31.6907 139.783 31.1225C140.129 30.5543 140.369 29.9062 140.502 29.1783L146.335 29.2049C146.184 30.4567 145.806 31.6641 145.203 32.8271C144.608 33.9812 143.804 35.0154 142.792 35.9299C141.789 36.8354 140.591 37.5545 139.197 38.0872C137.812 38.611 136.245 38.8729 134.496 38.8729C132.064 38.8729 129.888 38.3224 127.971 37.2216C126.062 36.1207 124.553 34.5272 123.443 32.4409C122.342 30.3546 121.792 27.8288 121.792 24.8636C121.792 21.8896 122.351 19.3594 123.47 17.2731C124.588 15.1868 126.106 13.5977 128.024 12.5057C129.942 11.4048 132.099 10.8544 134.496 10.8544C136.076 10.8544 137.541 11.0763 138.891 11.5202C140.249 11.9641 141.452 12.6122 142.499 13.4645C143.547 14.3079 144.399 15.3422 145.056 16.5673C145.722 17.7924 146.148 19.1951 146.335 20.7754Z" fill={theme === 'error' ? color : 'black'}/>
           <rect id="Rectangle 5" y="54.5" width="50" height="50" fill={color}/>
           <path id="T_2" d="M13.8073 70.4814V65.7273H36.2061V70.4814H27.8564V93H22.1569V70.4814H13.8073Z" fill={theme === 'error' ? color : 'black'}/>
           <rect id="ColorSquare2" x="54.5" y="54.5" width="50" height="50" fill={theme}/>
           <path id="A" d="M72.5453 93H66.3663L75.7813 65.7273H83.212L92.6137 93H86.4347L79.6032 71.9595H79.3901L72.5453 93ZM72.1591 82.28H86.7543V86.7811H72.1591V82.28Z" fill={theme === 'error' ? color : 'black'}/>
           <rect id="Rectangle 7" x="109" y="54.5" width="50" height="50" fill={color}/>
           <path id="C_2" d="M146.335 75.2754H140.502C140.395 74.5208 140.178 73.8505 139.849 73.2646C139.521 72.6697 139.099 72.1637 138.584 71.7464C138.069 71.3292 137.475 71.0096 136.8 70.7876C136.134 70.5657 135.41 70.4547 134.629 70.4547C133.218 70.4547 131.988 70.8054 130.94 71.5067C129.893 72.1992 129.081 73.2113 128.504 74.543C127.926 75.8658 127.638 77.4727 127.638 79.3636C127.638 81.3079 127.926 82.9414 128.504 84.2642C129.089 85.587 129.906 86.5858 130.954 87.2605C132.001 87.9352 133.213 88.2725 134.589 88.2725C135.362 88.2725 136.076 88.1705 136.733 87.9663C137.399 87.7621 137.989 87.4647 138.504 87.074C139.019 86.6745 139.445 86.1907 139.783 85.6225C140.129 85.0543 140.369 84.4062 140.502 83.6783L146.335 83.7049C146.184 84.9567 145.806 86.1641 145.203 87.3271C144.608 88.4812 143.804 89.5154 142.792 90.4299C141.789 91.3354 140.591 92.0545 139.197 92.5872C137.812 93.111 136.245 93.3729 134.496 93.3729C132.064 93.3729 129.888 92.8224 127.971 91.7216C126.062 90.6207 124.553 89.0272 123.443 86.9409C122.342 84.8546 121.792 82.3288 121.792 79.3636C121.792 76.3896 122.351 73.8594 123.47 71.7731C124.588 69.6868 126.106 68.0977 128.024 67.0057C129.942 65.9048 132.099 65.3544 134.496 65.3544C136.076 65.3544 137.541 65.5763 138.891 66.0202C140.249 66.4641 141.452 67.1122 142.499 67.9645C143.547 68.8079 144.399 69.8422 145.056 71.0673C145.722 72.2924 146.148 73.6951 146.335 75.2754Z" fill={theme === 'error' ? color : 'black'}/>
           <rect id="ColorSquare1" y="109" width="50" height="50" fill={theme}/>
           <path id="T_3" d="M13.8073 124.981V120.227H36.2061V124.981H27.8564V147.5H22.1569V124.981H13.8073Z" fill={theme === 'error' ? color : 'black'}/>
           <rect id="Rectangle 9" x="54.5" y="109" width="50" height="50" fill={color}/>
           <path id="O" d="M92.2658 133.864C92.2658 136.838 91.702 139.368 90.5746 141.454C89.4559 143.54 87.929 145.134 85.9936 146.235C84.0671 147.327 81.9009 147.873 79.495 147.873C77.0714 147.873 74.8963 147.322 72.9698 146.222C71.0433 145.121 69.5208 143.527 68.4021 141.441C67.2835 139.355 66.7242 136.829 66.7242 133.864C66.7242 130.89 67.2835 128.359 68.4021 126.273C69.5208 124.187 71.0433 122.598 72.9698 121.506C74.8963 120.405 77.0714 119.854 79.495 119.854C81.9009 119.854 84.0671 120.405 85.9936 121.506C87.929 122.598 89.4559 124.187 90.5746 126.273C91.702 128.359 92.2658 130.89 92.2658 133.864ZM86.4197 133.864C86.4197 131.937 86.1312 130.312 85.5541 128.99C84.986 127.667 84.1825 126.664 83.1438 125.98C82.1051 125.297 80.8888 124.955 79.495 124.955C78.1012 124.955 76.8849 125.297 75.8462 125.98C74.8075 126.664 73.9996 127.667 73.4226 128.99C72.8544 130.312 72.5703 131.937 72.5703 133.864C72.5703 135.79 72.8544 137.415 73.4226 138.738C73.9996 140.06 74.8075 141.064 75.8462 141.747C76.8849 142.431 78.1012 142.773 79.495 142.773C80.8888 142.773 82.1051 142.431 83.1438 141.747C84.1825 141.064 84.986 140.06 85.5541 138.738C86.1312 137.415 86.4197 135.79 86.4197 133.864Z" fill={theme === 'error' ? color : 'black'}/>
           <rect id="Rectangle 10" x="109" y="109" width="50" height="50" fill={color}/>
           <path id="E" d="M124.39 147.5V120.227H142.767V124.981H130.156V131.48H141.821V136.234H130.156V142.746H142.82V147.5H124.39Z" fill={theme === 'error' ? color : 'black'}/>
        </g>
    </svg>
  )
}

export default Logo;