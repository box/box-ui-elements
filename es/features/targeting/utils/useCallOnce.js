import { useState } from 'react';

/**
 * This hook will call the callback once in the life cycle of the component
 */
function useCallOnce(callback) {
  const [hasCalled, setHasCalled] = useState(false);
  return () => {
    if (!hasCalled) {
      setHasCalled(true);
      return callback();
    }
    return undefined;
  };
}
export default useCallOnce;
//# sourceMappingURL=useCallOnce.js.map