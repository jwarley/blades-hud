const injectStyle = (style: any) => {
    const styleElement = document.createElement('style');
    let styleSheet = null;

    document.head.appendChild(styleElement);

    styleSheet = styleElement.sheet!; // not null

    (styleSheet as CSSStyleSheet).insertRule(style, (styleSheet as CSSStyleSheet).cssRules.length);
};

export default injectStyle;