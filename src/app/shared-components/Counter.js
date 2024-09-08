import { animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import utils from 'src/@utils';

const Counter = ({ from, to }) => {
  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;
    const { isInt } = utils;

    const controls = animate(from, to, {
      duration: 1,
      onUpdate(value) {
        node.textContent = isInt(to) ? Math.round(value) : +value.toFixed(2);
      },
    });

    return () => controls.stop();
  }, [from, to]);

  return <p ref={nodeRef} />;
};

export default Counter;
