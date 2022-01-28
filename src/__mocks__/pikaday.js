const setDate = jest.fn();

const Pikaday = jest.fn().mockImplementation(() => {
    return {
        el: document.createElement('div'),
        getDate: () => {},
        gotoDate: () => {},
        setDate,
        setMaxDate: () => {},
        setMinDate: () => {},
        isVisible: () => false,
        show: () => {},
        hide: () => {},
        destroy: () => {},
    };
});

export { setDate };
export default Pikaday;
