import React, { useCallback, useEffect, useState, useRef } from 'react';
import './ProgressBar.scss';
const ProgressBar = ({
  percent: initialPercent = 0
}) => {
  const [percent, setPercent] = useState(initialPercent);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const clearTimeoutAndInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  const incrementProgress = () => {
    setPercent(prevPercent => {
      const newPercent = Math.min(prevPercent + 2 / (prevPercent || 1), 100);
      if (newPercent === 100) {
        clearTimeoutAndInterval();
      }
      0;
      return newPercent;
    });
  };
  const resetProgress = () => {
    setPercent(0);
  };
  const startProgress = useCallback(() => {
    if (percent === 0) {
      intervalRef.current = window.setInterval(incrementProgress, 100);
    } else if (percent === 100) {
      timeoutRef.current = window.setTimeout(resetProgress, 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    startProgress();
    return () => clearTimeoutAndInterval();
  }, [percent, startProgress]);
  useEffect(() => {
    setPercent(initialPercent);
  }, [initialPercent]);
  const containerStyle = {
    opacity: percent > 0 && percent < 100 ? 1 : 0,
    transitionDelay: percent > 0 && percent < 100 ? '0' : '0.4s'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "be-progress-container",
    style: containerStyle
  }, /*#__PURE__*/React.createElement("div", {
    className: "be-progress",
    role: "progressbar",
    style: {
      width: `${percent}%`
    }
  }));
};
export default ProgressBar;
//# sourceMappingURL=ProgressBar.js.map