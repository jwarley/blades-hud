import React from 'react';
import useDarkMode from 'use-dark-mode';

const DarkModeSwitcher = () => {
    const darkMode = useDarkMode(false);

    return (
    <span>
        <a className="black toggle no-underline pointer f5" href="#!" onClick={darkMode.toggle}>{darkMode.value ? '\u263E\uFE0E toggle dark mode' : '\u2600\uFE0E toggle dark mode'}</a>
    </span>
    );
};

export default DarkModeSwitcher;